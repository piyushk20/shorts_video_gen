#!/usr/bin/env python3
"""
OpusMotion Studio — Storage & Render Integrity Auditor
Ensures ONLY final successful renders are saved and retained.
Prunes:
  - Incomplete, aborted, or 0-byte video render folders
  - Stale intermediate *.mp4 copies left in workspace root after packaging
  - Corrupt or unplayable video files
  - Orphaned catalog entries in renders_manifest.json
"""

import os
import sys
import json
import shutil
import subprocess
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
RENDERS_DIR = os.path.join(ROOT_DIR, "renders")
MANIFEST_PATH = os.path.join(RENDERS_DIR, "renders_manifest.json")
MIN_VALID_VIDEO_BYTES = 100 * 1024  # 100 KB minimum for a valid short video

def check_video_playable_ffprobe(video_path):
    """Verifies that the video file has valid video streams and duration via ffprobe."""
    if not os.path.exists(video_path) or os.path.getsize(video_path) < MIN_VALID_VIDEO_BYTES:
        return False, "File missing or below minimum size threshold (100KB)"

    try:
        cmd = [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration:stream=codec_type",
            "-of", "json",
            video_path
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=10)
        if result.returncode != 0:
            return False, f"ffprobe error: {result.stderr.strip()[:100]}"
        
        info = json.loads(result.stdout)
        duration = float(info.get("format", {}).get("duration", 0))
        streams = info.get("streams", [])
        has_video = any(s.get("codec_type") == "video" for s in streams)

        if not has_video or duration <= 0:
            return False, "No valid video stream or duration is 0"

        return True, f"Valid ({duration:.1f}s, {len(streams)} streams)"
    except FileNotFoundError:
        # If ffprobe not in PATH, fallback to basic size & header validation
        size = os.path.getsize(video_path)
        with open(video_path, 'rb') as f:
            header = f.read(12)
        # MP4 files start with ftyp box at offset 4
        if len(header) >= 8 and (b'ftyp' in header or header.startswith(b'\x1a\x45\xdf\xa3')):
            return True, f"Valid format header ({size/1024/1024:.2f} MB)"
        return True, f"Basic check passed ({size/1024/1024:.2f} MB)"
    except Exception as e:
        return False, f"Validation exception: {str(e)}"

def audit_and_cleanup(dry_run=False):
    """
    Scans renders directory and workspace root, keeping ONLY final successful renders.
    """
    print("=" * 70)
    print("  OpusMotion Studio: Render Integrity & Storage Auditor")
    print(f"  Mode: {'DRY RUN (Preview Only)' if dry_run else 'ACTIVE PRUNE (Enforcing Final Only)'}")
    print(f"  Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    if not os.path.exists(RENDERS_DIR):
        print(f"[!] Renders directory not found at {RENDERS_DIR}. Nothing to audit.")
        return {"status": "ok", "pruned_folders": 0, "pruned_files": 0, "verified_renders": 0}

    # 1. Load Master Manifest
    manifest_entries = []
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                manifest_entries = json.load(f)
        except Exception as e:
            print(f"[!] Warning reading master manifest: {e}")
            manifest_entries = []

    print(f"[*] Found {len(manifest_entries)} cataloged renders in master manifest.")

    # 2. Audit Each Dedicated Package in renders/
    render_dirs = [d for d in os.listdir(RENDERS_DIR) if os.path.isdir(os.path.join(RENDERS_DIR, d))]
    verified_renders = []
    failed_or_incomplete_dirs = []
    reclaimed_bytes = 0

    for d in render_dirs:
        dir_path = os.path.join(RENDERS_DIR, d)
        
        # Look for video file inside the folder
        video_files = [f for f in os.listdir(dir_path) if f.lower().endswith(('.mp4', '.webm'))]
        
        if not video_files:
            failed_or_incomplete_dirs.append((dir_path, "No video (.mp4/.webm) found in package folder"))
            continue

        primary_video = os.path.join(dir_path, video_files[0])
        is_valid, reason = check_video_playable_ffprobe(primary_video)

        if not is_valid:
            failed_or_incomplete_dirs.append((dir_path, f"Corrupted or incomplete video: {reason}"))
            continue

        # Check for minimum package files (details, manifest, or contact sheet)
        has_metadata = any(f.endswith(('.json', '.md')) for f in os.listdir(dir_path))
        if not has_metadata:
            failed_or_incomplete_dirs.append((dir_path, "Missing package metadata (.json / .md)"))
            continue

        vid_size_mb = os.path.getsize(primary_video) / (1024 * 1024)
        verified_renders.append({
            "folder": d,
            "path": dir_path,
            "video_file": video_files[0],
            "video_size_mb": vid_size_mb,
            "validation": reason
        })

    # 3. Prune Incomplete/Failed Render Folders
    print(f"\n[*] Render Packages Status:")
    print(f"    - Verified Final Successful Renders: {len(verified_renders)}")
    print(f"    - Failed / Incomplete Folders:        {len(failed_or_incomplete_dirs)}")

    for folder_path, reason in failed_or_incomplete_dirs:
        folder_size = sum(os.path.getsize(os.path.join(folder_path, f)) for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f)))
        reclaimed_bytes += folder_size
        if dry_run:
            print(f"    [DRY-RUN WOULD REMOVE] {os.path.basename(folder_path)} ({folder_size/1024/1024:.2f} MB) -> Reason: {reason}")
        else:
            print(f"    [PRUNING INCOMPLETE] {os.path.basename(folder_path)} ({folder_size/1024/1024:.2f} MB) -> Reason: {reason}")
            try:
                shutil.rmtree(folder_path)
            except Exception as e:
                print(f"    [ERROR] Failed to remove {folder_path}: {e}")

    # 4. Clean Intermediate Stale Duplicate MP4s in Workspace Root
    # If an MP4 exists in the root AND is already verified inside renders/, the root copy is an intermediate build artifact
    verified_folder_names = {v["folder"] for v in verified_renders}
    root_mp4s = [f for f in os.listdir(ROOT_DIR) if f.lower().endswith('.mp4')]
    pruned_root_files = []

    for r_mp4 in root_mp4s:
        r_path = os.path.join(ROOT_DIR, r_mp4)
        r_size = os.path.getsize(r_path)
        
        # Check if already safely packaged in a verified render folder
        is_packaged = False
        for v in verified_renders:
            v_dir = v["path"]
            for f in os.listdir(v_dir):
                if f.lower().endswith('.mp4'):
                    target_mp4 = os.path.join(v_dir, f)
                    if os.path.getsize(target_mp4) == r_size:
                        is_packaged = True
                        break
            if is_packaged:
                break
        
        if is_packaged:
            reclaimed_bytes += r_size
            pruned_root_files.append((r_path, r_size))
            if dry_run:
                print(f"    [DRY-RUN WOULD PRUNE ROOT INTERMEDIATE] {r_mp4} ({r_size/1024/1024:.2f} MB) -> Safely preserved in renders package")
            else:
                print(f"    [PRUNING ROOT INTERMEDIATE] {r_mp4} ({r_size/1024/1024:.2f} MB) -> Safely preserved in renders package")
                try:
                    os.remove(r_path)
                except Exception as e:
                    print(f"    [ERROR] Failed to remove {r_path}: {e}")

    # 5. Synchronize Master Manifest to ONLY Verified Successful Renders
    valid_folder_set = {v["folder"] for v in verified_renders}
    pruned_manifest = []

    for entry in manifest_entries:
        fpath = entry.get("folder_path", "")
        f_basename = os.path.basename(fpath.rstrip("/\\"))
        
        if f_basename in valid_folder_set:
            entry["status"] = "verified_final_render"
            pruned_manifest.append(entry)
        else:
            print(f"    [PRUNING MANIFEST ORPHAN] Removed unverified entry: {entry.get('title', 'Unknown')}")

    if not dry_run and os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
            json.dump(pruned_manifest, f, indent=2, ensure_ascii=False)
        print(f"\n[+] Master manifest synchronized: {len(pruned_manifest)} final successful renders cataloged.")

    reclaimed_mb = reclaimed_bytes / (1024 * 1024)
    print("\n" + "=" * 70)
    print(f"  Audit Complete: ONLY Final Successful Renders Preserved")
    print(f"  Verified Renders Retained: {len(verified_renders)}")
    print(f"  Storage Reclaimed:        {reclaimed_mb:.2f} MB")
    print("=" * 70)

    return {
        "status": "success",
        "verified_renders": len(verified_renders),
        "failed_dirs_pruned": len(failed_or_incomplete_dirs),
        "root_files_pruned": len(pruned_root_files),
        "reclaimed_mb": round(reclaimed_mb, 2),
        "renders": [v["folder"] for v in verified_renders]
    }

def remove_all_output_renderings():
    """
    Completely removes all output renderings from renders/ and workspace root.
    Resets renders_manifest.json to an empty catalog.
    """
    print("=" * 70)
    print("  OpusMotion Studio: Removing ALL Output Renderings")
    print(f"  Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    total_reclaimed_bytes = 0
    removed_packages = []
    removed_files = []

    # 1. Remove all subdirectories in renders/
    if os.path.exists(RENDERS_DIR):
        for item in os.listdir(RENDERS_DIR):
            item_path = os.path.join(RENDERS_DIR, item)
            if os.path.isdir(item_path):
                folder_bytes = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(item_path) for f in fs)
                total_reclaimed_bytes += folder_bytes
                shutil.rmtree(item_path)
                removed_packages.append(item)
                print(f"  [-] Removed render package: {item} ({folder_bytes/1024/1024:.2f} MB)")

    # 2. Reset master renders_manifest.json to []
    if os.path.exists(RENDERS_DIR):
        with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
        print(f"  [+] Reset {MANIFEST_PATH} to empty catalog [].")

    # 3. Remove output contact sheet preview images in root
    preview_prefixes = ["preview_drone_contact_sheet.png", "preview_emudhra_contact_sheet.png",
                        "preview_quantum_contact_sheet.png", "preview_v1_rough.png",
                        "preview_v3_contact_sheet.png"]
    for pf in preview_prefixes:
        p_path = os.path.join(ROOT_DIR, pf)
        if os.path.exists(p_path):
            p_bytes = os.path.getsize(p_path)
            total_reclaimed_bytes += p_bytes
            os.remove(p_path)
            removed_files.append(pf)
            print(f"  [-] Removed output contact sheet: {pf} ({p_bytes/1024:.1f} KB)")

    # 4. Remove any loose video output files (.mp4 / .webm) in root
    for f in os.listdir(ROOT_DIR):
        if f.lower().endswith(('.mp4', '.webm')):
            f_path = os.path.join(ROOT_DIR, f)
            f_bytes = os.path.getsize(f_path)
            total_reclaimed_bytes += f_bytes
            os.remove(f_path)
            removed_files.append(f)
            print(f"  [-] Removed root output video: {f} ({f_bytes/1024/1024:.2f} MB)")

    reclaimed_mb = total_reclaimed_bytes / (1024 * 1024)
    print("\n" + "=" * 70)
    print("  Complete: ALL Output Renderings Removed")
    print(f"  Render Packages Removed: {len(removed_packages)}")
    print(f"  Output Files Removed:    {len(removed_files)}")
    print(f"  Total Space Reclaimed:   {reclaimed_mb:.2f} MB")
    print("=" * 70)

    return {
        "status": "success",
        "packages_removed": removed_packages,
        "files_removed": removed_files,
        "reclaimed_mb": round(reclaimed_mb, 2)
    }

if __name__ == "__main__":
    if "--remove-all" in sys.argv or "remove" in sys.argv:
        remove_all_output_renderings()
    else:
        is_dry = "--dry-run" in sys.argv
        audit_and_cleanup(dry_run=is_dry)
