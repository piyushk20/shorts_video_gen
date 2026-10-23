"""
OpusMotion Studio — eMudhra SSL Cryptographic Flaw & Business Exit Video Render Engine
Incorporates 5 High-Definition Motion Graphics Scene Images + Procedural Cyber Overlays +
Ken Burns Zoom/Pan + Animated HUD Telemetry + Safe-Zone Captions + Neural Voice-Over
"""

import os
import sys
import math
import json
import shutil
import datetime
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

WIDTH = 720
HEIGHT = 1280
FPS = 25
DURATION = 43.70
TOTAL_FRAMES = int(DURATION * FPS)
AUDIO_FILE = "voice_emudhra_exit.mp3"
OUTPUT_VIDEO = "emudhra_ssl_exit_motion_graphics_44s.mp4"

# Load TrueType Fonts
FONT_PATH_BOLD = "C:\\Windows\\Fonts\\segoeuib.ttf" if os.path.exists("C:\\Windows\\Fonts\\segoeuib.ttf") else "C:\\Windows\\Fonts\\arialbd.ttf"
FONT_PATH_MONO = "C:\\Windows\\Fonts\\consolab.ttf" if os.path.exists("C:\\Windows\\Fonts\\consolab.ttf") else FONT_PATH_BOLD

font_hud_sm = ImageFont.truetype(FONT_PATH_MONO, 14)
font_hud_md = ImageFont.truetype(FONT_PATH_MONO, 18)
font_hud_lg = ImageFont.truetype(FONT_PATH_MONO, 22)
font_caption = ImageFont.truetype(FONT_PATH_BOLD, 22)
font_caption_bold = ImageFont.truetype(FONT_PATH_BOLD, 25)
font_title = ImageFont.truetype(FONT_PATH_BOLD, 28)

# 5 Generated Motion Graphics Scene Assets
ASSET_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "emudhra")

SCENE_IMAGES = {
    1: os.path.join(ASSET_DIR, "scene_1_ssl_revocation.jpg"),
    2: os.path.join(ASSET_DIR, "scene_2_crypto_glitch.jpg"),
    3: os.path.join(ASSET_DIR, "scene_3_forensic_audit.jpg"),
    4: os.path.join(ASSET_DIR, "scene_4_market_exit.jpg"),
    5: os.path.join(ASSET_DIR, "scene_5_outro_card.jpg")
}

LOADED_IMAGES = {}
for sid, path in SCENE_IMAGES.items():
    if os.path.exists(path):
        try:
            LOADED_IMAGES[sid] = Image.open(path).convert("RGBA")
            print(f"[+] Loaded Scene {sid} Image: {os.path.basename(path)} ({LOADED_IMAGES[sid].size})")
        except Exception as e:
            print(f"[-] Error loading {path}: {e}")

SCENES = [
    {
        "id": 1,
        "name": "Global Trust Revocation Hook",
        "start": 0.0,
        "end": 7.8,
        "duration": 7.8,
        "tag": "SCENE 01: GLOBAL TRUST REVOKED",
        "img_id": 1
    },
    {
        "id": 2,
        "name": "Catastrophic RSA Key Entropy Glitch",
        "start": 7.8,
        "end": 18.4,
        "duration": 10.6,
        "tag": "SCENE 02: CRYPTO ENTROPY COLLAPSE",
        "img_id": 2
    },
    {
        "id": 3,
        "name": "18-Month Undetected Forensic Audit",
        "start": 18.4,
        "end": 27.3,
        "duration": 8.9,
        "tag": "SCENE 03: 18-MO TIMELINE AUDIT",
        "img_id": 3
    },
    {
        "id": 4,
        "name": "40% Crash & Global SSL Exit",
        "start": 27.3,
        "end": 37.1,
        "duration": 9.8,
        "tag": "SCENE 04: MARKET CRASH & EXIT",
        "img_id": 4
    },
    {
        "id": 5,
        "name": "Payoff & Outro Subscribe CTA",
        "start": 37.1,
        "end": 43.70,
        "duration": 6.6,
        "tag": "SCENE 05: SOCIAL OUTRO CARD",
        "img_id": 5
    }
]

CAPTIONS = [
    {"start": 0.0, "end": 4.0, "text": "Tech giants Google, Apple, and Microsoft have revoked trust...", "highlight": "TRUST REVOKED"},
    {"start": 4.0, "end": 7.8, "text": "...in global digital certificates issued by Indian cybersecurity firm eMudhra.", "highlight": "EMUDHRA ROOT CERTS"},
    {"start": 7.8, "end": 13.0, "text": "An internal key-generation script error drastically weakened RSA private keys...", "highlight": "SCRIPT ERROR"},
    {"start": 13.0, "end": 18.4, "text": "...reducing cryptographic entropy down to trivial numbers like 4, 56, and 115.", "highlight": "KEYS: 4, 56, 115"},
    {"start": 18.4, "end": 23.0, "text": "The vulnerability sat undetected in production for eighteen months...", "highlight": "18 MONTHS UNDETECTED"},
    {"start": 23.0, "end": 27.3, "text": "...until independent security researchers exposed the flaw across eight CAs.", "highlight": "RESEARCH AUDIT"},
    {"start": 27.3, "end": 32.0, "text": "Facing a forty percent stock plunge and immediate browser distrust...", "highlight": "40% STOCK CRASH"},
    {"start": 32.0, "end": 37.1, "text": "...eMudhra officially surrendered its global SSL certificate operations.", "highlight": "GLOBAL SSL EXIT"},
    {"start": 37.1, "end": 43.70, "text": "For verified deep-dive cybersecurity breakdowns, like and subscribe to @OpusMotion!", "highlight": "LIKE & SUBSCRIBE"}
]

def draw_corner_brackets(draw, x0, y0, x1, y1, length=24, color=(0, 242, 254, 200), width=2):
    draw.line([(x0, y0), (x0 + length, y0)], fill=color, width=width)
    draw.line([(x0, y0), (x0, y0 + length)], fill=color, width=width)
    draw.line([(x1, y0), (x1 - length, y0)], fill=color, width=width)
    draw.line([(x1, y0), (x1, y0 + length)], fill=color, width=width)
    draw.line([(x0, y1), (x0 + length, y1)], fill=color, width=width)
    draw.line([(x0, y1), (x0, y1 - length)], fill=color, width=width)
    draw.line([(x1, y1), (x1 - length, y1)], fill=color, width=width)
    draw.line([(x1, y1), (x1, y1 - length)], fill=color, width=width)

def render_frame_image(frame_idx):
    t = frame_idx / FPS
    current_scene = SCENES[-1]
    for sc in SCENES:
        if sc["start"] <= t < sc["end"]:
            current_scene = sc
            break

    scene_progress = (t - current_scene["start"]) / max(0.001, current_scene["duration"])
    scene_progress = min(1.0, max(0.0, scene_progress))

    sid = current_scene["img_id"]
    base_img = LOADED_IMAGES.get(sid)

    if base_img:
        # Subtle, cinematic Ken Burns zoom and pan
        zoom = 1.0 + (scene_progress * 0.08)
        orig_w, orig_h = base_img.size
        crop_w = int(orig_w / zoom)
        crop_h = int(orig_h / zoom)

        pan_dir = 1 if (sid % 2 == 0) else -1
        offset_x = int((orig_w - crop_w) * 0.5 + (scene_progress * pan_dir * (orig_w - crop_w) * 0.2))
        offset_y = int((orig_h - crop_h) * 0.5)

        crop_box = (
            max(0, offset_x),
            max(0, offset_y),
            min(orig_w, offset_x + crop_w),
            min(orig_h, offset_y + crop_h)
        )
        cropped = base_img.crop(crop_box).resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
        frame = cropped.convert("RGBA")
    else:
        frame = Image.new("RGBA", (WIDTH, HEIGHT), (6, 11, 18, 255))

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Top & Bottom Cinematic Vignette Gradients
    for y in range(160):
        alpha = int(220 * (1.0 - (y / 160.0)))
        draw.line([(0, y), (WIDTH, y)], fill=(0, 0, 0, alpha))
    for y in range(HEIGHT - 260, HEIGHT):
        rel = (y - (HEIGHT - 260)) / 260.0
        alpha = int(240 * rel)
        draw.line([(0, y), (WIDTH, y)], fill=(0, 0, 0, alpha))

    # Top Status Bar (Cyber Telemetry)
    draw.rectangle([(28, 24), (WIDTH - 28, 68)], fill=(6, 11, 18, 190), outline=(0, 229, 255, 90), width=1)
    draw.text((42, 34), "OPUSMOTION // CYBER INVESTIGATION", font=font_hud_md, fill=(0, 242, 254, 255))
    draw.text((WIDTH - 150, 36), f"REC • {t:05.2f}s", font=font_hud_sm, fill=(255, 77, 77, 255))

    # Scene Badge
    draw.rectangle([(28, 80), (28 + 320, 114)], fill=(15, 23, 42, 210), outline=(0, 242, 254, 140), width=1)
    draw.text((38, 88), current_scene["tag"], font=font_hud_sm, fill=(0, 242, 254, 255))

    # Corner brackets for viewport framing
    draw_corner_brackets(draw, 24, 76, WIDTH - 24, HEIGHT - 200, length=24, color=(0, 242, 254, 160), width=2)

    # Simulated Audio Waveform Bar at y=1030
    wave_y = 1028
    num_bars = 48
    bar_w = 8
    spacing = 13
    start_x = (WIDTH - (num_bars * spacing)) // 2
    for b in range(num_bars):
        freq = math.sin(t * 8.0 + b * 0.45) * math.cos(t * 4.5 + b * 0.2)
        h = max(6, int(abs(freq) * 42))
        x = start_x + b * spacing
        color = (0, 242, 254, 230) if b % 2 == 0 else (255, 106, 0, 230)
        draw.rounded_rectangle([(x, wave_y - h // 2), (x + bar_w, wave_y + h // 2)], radius=2, fill=color)

    # Active Caption
    active_cap = None
    for c in CAPTIONS:
        if c["start"] <= t < c["end"]:
            active_cap = c
            break

    if active_cap:
        cap_box_y0 = HEIGHT - 200
        cap_box_y1 = HEIGHT - 90
        draw.rounded_rectangle([(32, cap_box_y0), (WIDTH - 32, cap_box_y1)], radius=12, fill=(10, 15, 26, 230), outline=(0, 242, 254, 180), width=2)

        # Highlight tag pill
        if "highlight" in active_cap:
            draw.rounded_rectangle([(46, cap_box_y0 + 10), (46 + 210, cap_box_y0 + 36)], radius=6, fill=(0, 242, 254, 40), outline=(0, 242, 254, 150), width=1)
            draw.text((56, cap_box_y0 + 14), f"KEY: {active_cap['highlight']}", font=font_hud_sm, fill=(0, 242, 254, 255))

        # Two-line caption text wrapping
        words = active_cap["text"].split()
        line1 = " ".join(words[:len(words)//2 + 1])
        line2 = " ".join(words[len(words)//2 + 1:])
        draw.text((46, cap_box_y0 + 44), line1, font=font_caption_bold, fill=(255, 255, 255, 255))
        if line2:
            draw.text((46, cap_box_y0 + 72), line2, font=font_caption_bold, fill=(255, 230, 100, 255))

    # Bottom Timeline Bar
    prog_pct = t / DURATION
    bar_y = HEIGHT - 36
    draw.rectangle([(32, bar_y), (WIDTH - 32, bar_y + 8)], fill=(30, 41, 59, 200))
    draw.rectangle([(32, bar_y), (32 + int((WIDTH - 64) * prog_pct), bar_y + 8)], fill=(0, 242, 254, 255))

    # Composite overlay on top of frame
    out_img = Image.alpha_composite(frame, overlay)
    return out_img.convert("RGB")

def render_video():
    print(f"============================================================")
    print(f"OpusMotion Studio — eMudhra Motion Graphics Master Render")
    print(f"Frames: {TOTAL_FRAMES} | Res: {WIDTH}x{HEIGHT} | FPS: {FPS}")
    print(f"Audio Source: {AUDIO_FILE} | Duration: {DURATION:.2f}s")
    print(f"============================================================")

    # Pipe directly into FFmpeg for hardware-accelerated/fast rendering
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO_FILE,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        OUTPUT_VIDEO
    ]

    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)

    for i in range(TOTAL_FRAMES):
        img = render_frame_image(i)
        proc.stdin.write(img.tobytes())
        if i % 50 == 0 or i == TOTAL_FRAMES - 1:
            pct = (i + 1) / TOTAL_FRAMES * 100
            print(f"[Render] Frame {i+1}/{TOTAL_FRAMES} ({pct:.1f}%) | Time: {(i/FPS):.2f}s")

    proc.stdin.close()
    proc.wait()

    if proc.returncode == 0:
        file_size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
        print(f"[SUCCESS] Exported Master Video: {OUTPUT_VIDEO} ({file_size_mb:.2f} MB)")
        generate_contact_sheet()
        package_render_vault()
    else:
        print(f"[ERROR] FFmpeg render failed with code {proc.returncode}")

def generate_contact_sheet():
    sheet_w = 1080
    sheet_h = 1920
    contact = Image.new("RGB", (sheet_w, sheet_h), (8, 12, 20))
    draw = ImageDraw.Draw(contact)

    draw.text((40, 36), "OPUSMOTION STUDIO // EMUDHRA SSL CRISIS QA SHEET", font=font_title, fill=(0, 242, 254))
    draw.text((40, 78), f"43.70s Master Run • 25 FPS • 720x1280 • Archetype: Cyber HUD", font=font_hud_sm, fill=(160, 175, 200))

    grid_cols = 3
    grid_rows = 3
    cell_w = 320
    cell_h = 568
    pad_x = 28
    pad_y = 20
    start_y = 120

    keyframe_indices = [int(i * (TOTAL_FRAMES - 1) / 8) for i in range(9)]

    for idx, fidx in enumerate(keyframe_indices):
        r = idx // grid_cols
        c = idx % grid_cols
        x = pad_x + c * (cell_w + pad_x)
        y = start_y + r * (cell_h + pad_y)

        fimg = render_frame_image(fidx).resize((cell_w, cell_h), Image.Resampling.LANCZOS)
        contact.paste(fimg, (x, y))

        draw.rectangle([(x, y + cell_h - 28), (x + cell_w, y + cell_h)], fill=(0, 0, 0, 210))
        t_sec = fidx / FPS
        draw.text((x + 8, y + cell_h - 22), f"Frame {fidx+1} ({t_sec:.1f}s)", font=font_hud_sm, fill=(0, 242, 254))

    sheet_out = "preview_emudhra_contact_sheet.png"
    contact.save(sheet_out, quality=95)
    print(f"[+] Saved QA Contact Sheet: {sheet_out}")

def package_render_vault():
    vault_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "renders", "emudhra_ssl_exit_run")
    dest_mp4 = os.path.join(vault_dir, OUTPUT_VIDEO)
    shutil.copy2(OUTPUT_VIDEO, dest_mp4)

    # Clean up intermediate root video to preserve clean storage
    try:
        os.remove(OUTPUT_VIDEO)
        print(f"[STORAGE] Cleaned intermediate root artifact: {OUTPUT_VIDEO}")
    except Exception:
        pass

    if os.path.exists("preview_emudhra_contact_sheet.png"):
        shutil.copy2("preview_emudhra_contact_sheet.png", os.path.join(vault_dir, "contact_sheet.png"))

    manifest = {
        "title": "eMudhra Global SSL Cryptographic Crisis & Exit",
        "description": "Procedural cybersecurity investigation short breakdown of Indian firm eMudhra exiting global digital certificates after catastrophic key entropy flaw.",
        "duration": DURATION,
        "duration_formatted": "43.7s",
        "resolution": "720x1280",
        "aspect_ratio": "9:16 Shorts",
        "fps": FPS,
        "visual_archetype": "cyber",
        "voice": "Christopher (Tactical Tech)",
        "created_at": datetime.datetime.now().isoformat(),
        "created_formatted": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "video_url": f"renders/emudhra_ssl_exit_run/{OUTPUT_VIDEO}",
        "thumbnail_url": "preview_emudhra_contact_sheet.png",
        "folder_path": "renders/emudhra_ssl_exit_run",
        "manifest_url": "renders/emudhra_ssl_exit_run/manifest.json",
        "details_url": "renders/emudhra_ssl_exit_run/DETAILS.md",
        "files_count": 8,
        "scenes": SCENES
    }

    with open(os.path.join(vault_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    details_md = f"""# eMudhra Global SSL Cryptographic Crisis & Exit — Master Package

- **Title**: eMudhra Global SSL Cryptographic Crisis & Exit
- **Duration**: 43.70 seconds (1092 frames @ 25 FPS)
- **Aspect Ratio**: 9:16 Shorts (720x1280)
- **Visual Style**: Cyberpunk HUD / FUI (#22-hud & hologram-hud)
- **Voice-Over**: `en-US-ChristopherNeural` (+12% rate)
- **Motion Graphics Assets**: 5 9:16 High-Resolution Scenes in `assets/emudhra/`
- **Topic Source**: Reuters Legal Litigation (2026-10-22)

## 5-Beat Director Grammar Storyboard:
1. **The Hook (0.0s - 7.8s)**: Google, Apple, and Microsoft revoke trust in eMudhra global root SSL certificates.
2. **The Glitch (7.8s - 18.4s)**: Flawed script during April 2025 ceremony generated weak RSA keys with trivial entropy (4, 56, 115).
3. **The Turn / Audit (18.4s - 27.3s)**: 18-month dormant vulnerability discovered across 8 intermediate certificate authorities.
4. **Market Exit (27.3s - 37.1s)**: 40% stock crash triggers formal voluntary exit from global SSL business while domestic eSign is protected.
5. **Outro CTA (37.1s - 43.7s)**: Glassmorphic Outro Card inviting viewers to like and subscribe to @OpusMotion.
"""
    with open(os.path.join(vault_dir, "DETAILS.md"), "w", encoding="utf-8") as f:
        f.write(details_md)

    # Update global renders_manifest.json
    global_manifest_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "renders", "renders_manifest.json")
    all_runs = []
    if os.path.exists(global_manifest_path):
        try:
            with open(global_manifest_path, "r", encoding="utf-8") as f:
                all_runs = json.load(f)
        except Exception:
            all_runs = []

    all_runs = [r for r in all_runs if r.get("title") != manifest["title"]]
    all_runs.insert(0, manifest)

    with open(global_manifest_path, "w", encoding="utf-8") as f:
        json.dump(all_runs, f, indent=2)

    print(f"[+] Updated Global Renders Manifest: {global_manifest_path}")

if __name__ == "__main__":
    render_video()
