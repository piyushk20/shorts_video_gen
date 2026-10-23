"""
OpusMotion Studio — Quantum Computing Motion Graphics Video Render Engine
Incorporates 5 High-Definition Motion Graphics Scene Images + Procedural Overlays +
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
DURATION = 36.34
TOTAL_FRAMES = int(DURATION * FPS)
AUDIO_FILE = "voice_quantum_computing_exact.mp3"
OUTPUT_VIDEO = "quantum_computing_motion_graphics_36s.mp4"

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
ASSET_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "quantum")

SCENE_IMAGES = {
    1: os.path.join(ASSET_DIR, "scene_1_qubit_hook.jpg"),
    2: os.path.join(ASSET_DIR, "scene_2_entanglement.jpg"),
    3: os.path.join(ASSET_DIR, "scene_3_crypto_shor.jpg"),
    4: os.path.join(ASSET_DIR, "scene_4_cryochamber.jpg"),
    5: os.path.join(ASSET_DIR, "scene_5_outro_card.jpg")
}

# Preload Scene Images
LOADED_IMAGES = {}
for sid, path in SCENE_IMAGES.items():
    if os.path.exists(path):
        try:
            LOADED_IMAGES[sid] = Image.open(path).convert("RGBA")
            print(f"[+] Loaded Scene {sid} Image: {os.path.basename(path)} ({LOADED_IMAGES[sid].size})")
        except Exception as e:
            print(f"[-] Error loading {path}: {e}")

# Scenes Specification matching Christopher's VO
SCENES = [
    {
        "id": 1,
        "name": "The Qubit Breakthrough Hook",
        "start": 0.0,
        "end": 8.8,
        "duration": 8.8,
        "tag": "SCENE 01: QUANTUM STATE HOOK",
        "img_id": 1
    },
    {
        "id": 2,
        "name": "Superposition & Entanglement Mechanism",
        "start": 8.8,
        "end": 14.5,
        "duration": 5.7,
        "tag": "SCENE 02: ENTANGLEMENT LATTICE",
        "img_id": 2
    },
    {
        "id": 3,
        "name": "Shor's Algorithm & Cryptographic Dissolution",
        "start": 14.5,
        "end": 23.5,
        "duration": 9.0,
        "tag": "SCENE 03: SHOR'S CODEBREAKER",
        "img_id": 3
    },
    {
        "id": 4,
        "name": "The Cryogenic Scaling Challenge",
        "start": 23.5,
        "end": 29.5,
        "duration": 6.0,
        "tag": "SCENE 04: 15 mK CRYOCHAMBER",
        "img_id": 4
    },
    {
        "id": 5,
        "name": "Singularity Outro & Subscribe CTA",
        "start": 29.5,
        "end": 36.34,
        "duration": 6.84,
        "tag": "SCENE 05: SOCIAL OUTRO CARD",
        "img_id": 5
    }
]

CAPTIONS = [
    {"start": 0.0, "end": 4.5, "text": "Here is what makes Quantum computing a game-changing breakthrough:", "highlight": "QUANTUM BREAKTHROUGH"},
    {"start": 4.5, "end": 8.8, "text": "A quantum computer represents and processes information using quantum states.", "highlight": "QUANTUM STATES"},
    {"start": 8.8, "end": 14.5, "text": "Beneath the surface: Quantum computations exploit superposition, interference, and entanglement.", "highlight": "SUPERPOSITION & ENTANGLEMENT"},
    {"start": 14.5, "end": 19.0, "text": "Here is the critical insight: A large-scale quantum computer could break widely used encryption schemes...", "highlight": "BREAK ENCRYPTION"},
    {"start": 19.0, "end": 23.5, "text": "...and aid physicists in performing previously intractable physical simulations.", "highlight": "PHYSICAL SIMULATIONS"},
    {"start": 23.5, "end": 29.5, "text": "Looking at the future horizon: Quantum computers are not yet practical for real-world applications.", "highlight": "REAL-WORLD SCALING"},
    {"start": 29.5, "end": 36.34, "text": "For verified deep-dive procedural intelligence, make sure to like and subscribe to @OpusMotion!", "highlight": "LIKE & SUBSCRIBE"}
]

def get_scene(t):
    for s in SCENES:
        if s["start"] <= t < s["end"]:
            return s
    return SCENES[-1]

def get_active_caption(t):
    for c in CAPTIONS:
        if c["start"] <= t < c["end"]:
            return c
    return CAPTIONS[-1]

def get_ken_burns_image(scene, t, target_w=WIDTH, target_h=HEIGHT):
    img = LOADED_IMAGES.get(scene["img_id"])
    if not img:
        return Image.new("RGBA", (target_w, target_h), (8, 12, 20, 255))

    p = max(0.0, min(1.0, (t - scene["start"]) / scene["duration"]))
    orig_w, orig_h = img.size

    # Dynamic motion parameters per scene
    if scene["id"] == 1:
        # Slow cinematic push-in (1.05x -> 1.18x) with downward pan from sphere to chip
        scale = 1.05 + 0.13 * p
        offset_y = int(orig_h * 0.05 * p)
        offset_x = 0
    elif scene["id"] == 2:
        # Gentle floating lateral drift with breathing zoom
        scale = 1.08 + 0.08 * math.sin(p * math.pi)
        offset_x = int(orig_w * 0.03 * math.sin(p * math.pi * 1.5))
        offset_y = 0
    elif scene["id"] == 3:
        # Dramatic punch towards padlock keyhole
        scale = 1.02 + 0.18 * (p ** 1.3)
        offset_x = int(orig_w * 0.02 * p)
        offset_y = int(orig_h * 0.04 * p)
    elif scene["id"] == 4:
        # Pedestal tilt upward from cryo fog to gold chandelier
        scale = 1.06 + 0.10 * p
        offset_y = int(-orig_h * 0.06 * p)
        offset_x = 0
    else:
        # Scene 5: Outro rotational vortex scale
        scale = 1.02 + 0.15 * p
        offset_x = int(math.sin(p * math.pi * 2) * 12)
        offset_y = int(math.cos(p * math.pi * 2) * 8)

    # Calculate crop box inside original image
    crop_w = int(orig_w / scale)
    crop_h = int(orig_h / scale)

    cx = (orig_w // 2) + offset_x
    cy = (orig_h // 2) + offset_y

    left = max(0, min(orig_w - crop_w, cx - crop_w // 2))
    top = max(0, min(orig_h - crop_h, cy - crop_h // 2))
    right = left + crop_w
    bottom = top + crop_h

    cropped = img.crop((left, top, right, bottom))
    return cropped.resize((target_w, target_h), Image.Resampling.BILINEAR)

def render_frame_pil(t, w=WIDTH, h=HEIGHT):
    scene = get_scene(t)
    
    # 1. Base Image with Ken Burns Camera Motion
    frame = get_ken_burns_image(scene, t, w, h)

    # 2. Smooth Scene Transition (Crossfade during first 0.35s of scene if not scene 1)
    if scene["id"] > 1 and (t - scene["start"]) < 0.35:
        blend_factor = (t - scene["start"]) / 0.35
        prev_scene = SCENES[scene["id"] - 2]
        prev_frame = get_ken_burns_image(prev_scene, prev_scene["end"] - 0.01, w, h)
        frame = Image.blend(prev_frame, frame, blend_factor)

    draw = ImageDraw.Draw(frame, "RGBA")

    # Colors
    cyan = (0, 242, 254, 255)
    magenta = (255, 40, 160, 255)
    gold = (255, 215, 0, 255)
    white = (255, 255, 255, 255)
    dim_white = (255, 255, 255, 140)

    # 3. Floating HUD Telemetry & Motion Graphics Elements
    # Top Status Bar
    draw.rectangle([20, 20, w - 20, 52], fill=(8, 12, 24, 160), outline=(0, 242, 254, 80), width=1)
    draw.text((36, 28), "OPUSMOTION STUDIO // NEURAL ENGINE 60FPS", fill=dim_white, font=font_hud_sm)
    time_str = f"{int(t//60):02d}:{int(t%60):02d}.{int((t%1)*100):02d}"
    draw.text((w - 36, 28), time_str, fill=cyan, font=font_hud_sm, anchor="ra")

    # Scene Tag Badge (Top Left under status)
    draw.rectangle([20, 62, 340, 92], fill=(10, 15, 30, 200), outline=(0, 242, 254, 120), width=1)
    draw.text((32, 69), f"● {scene['tag']}", fill=cyan, font=font_hud_sm)

    # Corner Crop Brackets (High-Tech Viewfinder)
    bracket_len = 24
    bracket_color = (0, 242, 254, 160)
    # Top-Left
    draw.line([(24, 108), (24 + bracket_len, 108)], fill=bracket_color, width=2)
    draw.line([(24, 108), (24, 108 + bracket_len)], fill=bracket_color, width=2)
    # Top-Right
    draw.line([(w - 24, 108), (w - 24 - bracket_len, 108)], fill=bracket_color, width=2)
    draw.line([(w - 24, 108), (w - 24, 108 + bracket_len)], fill=bracket_color, width=2)
    # Bottom-Left
    draw.line([(24, h - 80), (24 + bracket_len, h - 80)], fill=bracket_color, width=2)
    draw.line([(24, h - 80), (24, h - 80 - bracket_len)], fill=bracket_color, width=2)
    # Bottom-Right
    draw.line([(w - 24, h - 80), (w - 24 - bracket_len, h - 80)], fill=bracket_color, width=2)
    draw.line([(w - 24, h - 80), (w - 24, h - 80 - bracket_len)], fill=bracket_color, width=2)

    # 4. Scene-Specific Motion Graphics Overlays
    if scene["id"] == 1:
        # Rotating Reticle around focal center
        rcx, rcy = w // 2, int(h * 0.38)
        rot_angle = t * 35.0
        r_outer = 180
        for deg in range(0, 360, 45):
            rad = math.radians(deg + rot_angle)
            x1 = rcx + int((r_outer - 15) * math.cos(rad))
            y1 = rcy + int((r_outer - 15) * math.sin(rad))
            x2 = rcx + int((r_outer + 8) * math.cos(rad))
            y2 = rcy + int((r_outer + 8) * math.sin(rad))
            draw.line([(x1, y1), (x2, y2)], fill=(0, 242, 254, 90), width=1)
        # Telemetry Text
        draw.text((w - 32, 115), "COHERENCE: 99.82%\nFIDELITY: 0.9994\nSTATE: |Ψ⟩ = α|0⟩ + β|1⟩", fill=(0, 242, 254, 180), font=font_hud_sm, anchor="ra")

    elif scene["id"] == 2:
        # Entanglement pulse waves
        pulse = (t * 2.0) % 1.0
        pcx, pcy = w // 2, int(h * 0.44)
        for r_step in range(1, 4):
            r = int((pulse * 140 + r_step * 50) % 200)
            alpha = int(max(0, 180 * (1.0 - r / 200)))
            draw.ellipse([pcx - r, pcy - r, pcx + r, pcy + r], outline=(255, 40, 160, alpha), width=1)
        draw.text((w - 32, 115), "ENTANGLED PAIRS: 1,024\nBELL STATE: |Φ⁺⟩\nINTERFERENCE: CONSTRUCTIVE", fill=(255, 40, 160, 180), font=font_hud_sm, anchor="ra")

    elif scene["id"] == 3:
        # Shor's Algorithm Decryption Matrix Readout
        draw.rectangle([28, 115, 290, 185], fill=(10, 20, 15, 200), outline=(0, 242, 150, 140), width=1)
        draw.text((38, 122), "SHOR FACTORING: RSA-2048", fill=(0, 242, 150, 255), font=font_hud_sm)
        draw.text((38, 142), f"PERIOD r = {int(10090 + math.sin(t*10)*800)}", fill=white, font=font_hud_sm)
        draw.text((38, 162), "STATUS: CIPHER COMPROMISED", fill=(255, 80, 80, 255), font=font_hud_sm)

    elif scene["id"] == 4:
        # Cryochamber Temperature Telemetry
        draw.rectangle([w - 300, 115, w - 28, 185], fill=(10, 15, 30, 200), outline=(0, 242, 254, 140), width=1)
        draw.text((w - 290, 122), "DILUTION REFRIGERATOR DR-1", fill=cyan, font=font_hud_sm)
        draw.text((w - 290, 142), f"TEMP: {14.85 + 0.15*math.sin(t*3):.2f} milliKelvin", fill=gold, font=font_hud_sm)
        draw.text((w - 290, 162), "VACUUM: 10^-7 mbar (STABLE)", fill=white, font=font_hud_sm)

    # 5. Animated Audio Waveform Spectrum (Bottom)
    wave_y = int(h * 0.77)
    wave_bars = 42
    bar_w = 10
    total_wave_w = wave_bars * (bar_w + 4)
    wave_start_x = (w - total_wave_w) // 2
    for b in range(wave_bars):
        bx = wave_start_x + b * (bar_w + 4)
        bh = int(12 + 28 * abs(math.sin(t * 12.0 + b * 0.35)))
        bar_alpha = int(140 + 100 * abs(math.sin(t * 6.0 + b * 0.2)))
        draw.rectangle([bx, wave_y - bh, bx + bar_w, wave_y + bh], fill=(0, 242, 254, bar_alpha))

    # 6. High-Contrast Safe-Zone Captions Pill (Y: 82% to 92%)
    caption = get_active_caption(t)
    cap_y_center = int(h * 0.86)
    
    # Text wrapping into 2 lines if needed
    words = caption["text"].split()
    if len(words) > 7:
        mid = len(words) // 2
        line1 = " ".join(words[:mid])
        line2 = " ".join(words[mid:])
    else:
        line1 = caption["text"]
        line2 = ""

    box_h = 92 if line2 else 64
    box_w = w - 60
    box_x1 = 30
    box_y1 = cap_y_center - box_h // 2
    box_x2 = box_x1 + box_w
    box_y2 = box_y1 + box_h

    # Translucent Glass Background for captions
    draw.rounded_rectangle([box_x1, box_y1, box_x2, box_y2], radius=16, fill=(5, 9, 18, 220), outline=(0, 242, 254, 180), width=2)
    
    # Highlight Pill Tag
    hl_tag = f"⚡ {caption['highlight']}"
    draw.text((w // 2, box_y1 - 14), hl_tag, fill=gold, font=font_hud_sm, anchor="mm")

    if line2:
        draw.text((w // 2, box_y1 + 26), line1, fill=white, font=font_caption, anchor="mm")
        draw.text((w // 2, box_y1 + 58), line2, fill=(0, 242, 254, 255), font=font_caption_bold, anchor="mm")
    else:
        draw.text((w // 2, box_y1 + 32), line1, fill=white, font=font_caption_bold, anchor="mm")

    # 7. Scene 5 Glassmorphic Animated Outro Overlay
    if scene["id"] == 5:
        p_outro = max(0.0, min(1.0, (t - scene["start"]) / 1.5))
        card_w, card_h = 560, 260
        cx, cy = w // 2, int(h * 0.42)
        y_slide = int((1.0 - p_outro) * 80)

        # Glass Outro Card
        card_box = [cx - card_w//2, cy - card_h//2 + y_slide, cx + card_w//2, cy + card_h//2 + y_slide]
        draw.rounded_rectangle(card_box, radius=24, fill=(10, 16, 32, int(230 * p_outro)), outline=(0, 242, 254, int(255 * p_outro)), width=2)

        # Channel Logo / Avatar
        draw.ellipse([cx - 50, cy - 100 + y_slide, cx + 50, cy + y_slide], fill=(255, 40, 100, int(255 * p_outro)))
        draw.text((cx, cy - 50 + y_slide), "▶", fill=white, font=font_title, anchor="mm")

        # Handle & Title
        draw.text((cx, cy + 24 + y_slide), "OpusMotion Studio ✓", fill=white, font=font_title, anchor="mm")
        draw.text((cx, cy + 54 + y_slide), "@OpusMotion", fill=cyan, font=font_hud_md, anchor="mm")

        # Pulse Subscribe Button
        btn_w, btn_h = 240, 52
        pulse_ring = int(math.sin(t * 8.0) * 4)
        btn_box = [cx - btn_w//2, cy + 85 + y_slide, cx + btn_w//2, cy + 85 + btn_h + y_slide]
        draw.rounded_rectangle(btn_box, radius=12, fill=(255, 20, 60, int(255 * p_outro)))
        draw.text((cx, cy + 85 + btn_h//2 + y_slide), "🔔 SUBSCRIBE", fill=white, font=font_hud_lg, anchor="mm")

    return frame

def generate_contact_sheet(output_filename="preview_quantum_contact_sheet.png", count=9):
    print(f"[*] Generating {count}-frame Contact Sheet to {output_filename}...")
    cols, rows = 3, 3
    sheet_w, sheet_h = 1080, 1920
    cell_w = sheet_w // cols
    cell_h = sheet_h // rows
    sheet = Image.new("RGBA", (sheet_w, sheet_h), (5, 8, 14, 255))

    timestamps = [DURATION * (i / (count - 1)) for i in range(count)]
    for idx, t in enumerate(timestamps):
        col = idx % cols
        row = idx // cols
        frame = render_frame_pil(t, cell_w, cell_h)
        sheet.paste(frame, (col * cell_w, row * cell_h))

    sheet.save(output_filename)
    print(f"[+] Saved Contact Sheet: {output_filename}")

def render_mp4_video():
    print(f"[*] Rendering Master MP4 ({TOTAL_FRAMES} frames @ {FPS}fps) to {OUTPUT_VIDEO}...")
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgba",
        "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO_FILE,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        OUTPUT_VIDEO
    ]

    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    for f_idx in range(TOTAL_FRAMES):
        t = f_idx / FPS
        frame = render_frame_pil(t, WIDTH, HEIGHT)
        proc.stdin.write(frame.tobytes())
        if f_idx % 120 == 0:
            pct = int((f_idx / TOTAL_FRAMES) * 100)
            print(f"    Frame {f_idx}/{TOTAL_FRAMES} ({pct}%) rendered...", flush=True)

    proc.stdin.close()
    proc.wait()

    if proc.returncode != 0 or not os.path.exists(OUTPUT_VIDEO) or os.path.getsize(OUTPUT_VIDEO) < 100 * 1024:
        print(f"[ERROR] Video render FAILED! returncode: {proc.returncode}, file: {OUTPUT_VIDEO}", flush=True)
        if os.path.exists(OUTPUT_VIDEO):
            try:
                os.remove(OUTPUT_VIDEO)
            except Exception:
                pass
        return False

    print(f"[+] Video Render COMPLETE: {OUTPUT_VIDEO} ({os.path.getsize(OUTPUT_VIDEO)/1024/1024:.2f} MB)", flush=True)
    return True

def package_render_folder(slug="quantum_computing_motion_graphics", title="Quantum Computing: Qubit Superposition, Shor's Algorithm & Dilution Cryocore"):
    """
    Creates an isolated, self-contained directory under renders/ for this specific video.
    Packages ONLY final successful renders.
    """
    if not os.path.exists(OUTPUT_VIDEO) or os.path.getsize(OUTPUT_VIDEO) < 100 * 1024:
        print(f"[ABORT] Cannot package render: {OUTPUT_VIDEO} missing or incomplete (<100KB). Only final successful renders are saved.")
        return None, None

    now = datetime.datetime.now()
    timestamp_str = now.strftime("%Y%m%d_%H%M%S")
    folder_name = f"render_{timestamp_str}_{slug}"
    base_dir = os.path.dirname(os.path.abspath(__file__))
    renders_root = os.path.join(base_dir, "renders")
    os.makedirs(renders_root, exist_ok=True)

    target_dir = os.path.join(renders_root, folder_name)
    os.makedirs(target_dir, exist_ok=True)
    print(f"\n[FOLDER] Creating dedicated render package folder: {target_dir}")

    files_manifest = {}

    # 1. Video MP4
    dst_vid = os.path.join(target_dir, "video.mp4")
    shutil.copy2(OUTPUT_VIDEO, dst_vid)
    files_manifest["video"] = {
        "filename": "video.mp4",
        "size_bytes": os.path.getsize(dst_vid),
        "size_formatted": f"{os.path.getsize(dst_vid) / (1024*1024):.2f} MB"
    }

    # Clean up intermediate root video to preserve clean storage
    try:
        os.remove(OUTPUT_VIDEO)
        print(f"[STORAGE] Cleaned intermediate root artifact: {OUTPUT_VIDEO}")
    except Exception:
        pass

    # 2. Voice-Over MP3
    if os.path.exists(AUDIO_FILE):
        dst_audio = os.path.join(target_dir, "voiceover.mp3")
        shutil.copy2(AUDIO_FILE, dst_audio)
        files_manifest["voiceover"] = {
            "filename": "voiceover.mp3",
            "size_bytes": os.path.getsize(dst_audio),
            "size_formatted": f"{os.path.getsize(dst_audio) / 1024:.1f} KB"
        }

    # 3. Contact Sheet QA
    sheet_name = "preview_quantum_contact_sheet.png"
    if os.path.exists(sheet_name):
        dst_sheet = os.path.join(target_dir, "contact_sheet.png")
        shutil.copy2(sheet_name, dst_sheet)
        files_manifest["contact_sheet"] = {
            "filename": "contact_sheet.png",
            "size_bytes": os.path.getsize(dst_sheet),
            "size_formatted": f"{os.path.getsize(dst_sheet) / 1024:.1f} KB"
        }

    # 4. Copy Scene Images into dedicated package
    assets_dest = os.path.join(target_dir, "scene_assets")
    os.makedirs(assets_dest, exist_ok=True)
    for sid, path in SCENE_IMAGES.items():
        if os.path.exists(path):
            shutil.copy2(path, os.path.join(assets_dest, f"scene_{sid}.jpg"))

    # 5. Manifest JSON
    manifest_data = {
        "render_id": folder_name,
        "title": title,
        "slug": slug,
        "topic": "Quantum Computing & Cryptographic Breakthroughs",
        "created_at": now.isoformat(),
        "created_formatted": now.strftime("%Y-%m-%d %H:%M:%S"),
        "specifications": {
            "duration_seconds": DURATION,
            "fps": FPS,
            "total_frames": TOTAL_FRAMES,
            "resolution": f"{WIDTH}x{HEIGHT}",
            "aspect_ratio": "9:16 (Shorts/Reels/TikTok)",
            "video_codec": "H.264 (libx264, crf 18)",
            "audio_codec": "AAC (192 kbps, 44.1 kHz)",
            "motion_graphics": "Generated 3D Scene Visuals + Ken Burns + Procedural HUD Telemetry Overlays"
        },
        "voice": {
            "voice_name": "en-US-ChristopherNeural",
            "style": "Deep Technical Authority",
            "rate": "+12%",
            "file": "voiceover.mp3"
        },
        "scenes": SCENES,
        "captions": CAPTIONS,
        "files": files_manifest
    }

    with open(os.path.join(target_dir, "project_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)

    # 6. Formatted Markdown Report
    details_md_path = os.path.join(target_dir, "details.md")
    md_content = f"""# Video Render Package: {title}

**Generated Date:** {now.strftime("%B %d, %Y at %H:%M:%S")}  
**Render ID:** `{folder_name}`  
**Status:** Broadcast-Ready Master (H.264 / AAC 9:16 Shorts)

---

## 📊 Technical Specifications
| Specification | Value |
|---|---|
| **Duration** | {DURATION}s ({TOTAL_FRAMES} frames @ {FPS} fps) |
| **Resolution** | {WIDTH}x{HEIGHT} (Vertical 9:16 Shorts / Reels) |
| **Video Codec** | H.264 / libx264 (CRF 18 broadcast quality) |
| **Audio Codec** | AAC 192 kbps (Neural TTS `en-US-ChristopherNeural` @ +12%) |
| **Visual Engine** | High-Definition Motion Graphics + Ken Burns Camera + Procedural HUD Overlays |
| **Captions** | Safe-Zone Compliant (Y: 82% - 92%) with High-Contrast Glass Pill |

---

## 🎬 Scene Breakdown & Storyboard
- **Scene 1 (0.0s – 8.8s):** The Qubit Breakthrough Hook (Bloch sphere, superposition, quantum chip)
- **Scene 2 (8.8s – 14.5s):** Superposition & Entanglement Mechanism (Photonic ribbons, logic gates, interference)
- **Scene 3 (14.5s – 23.5s):** Shor's Algorithm & Cryptographic Dissolution (Shattering padlock, binary code, RSA cipher)
- **Scene 4 (23.5s – 29.5s):** The Cryogenic Scaling Challenge (Dilution chandelier, 15 mK telemetry)
- **Scene 5 (29.5s – 36.34s):** Singularity Outro & Subscribe CTA (Glass Outro Card with @OpusMotion, subscribe button)
"""
    with open(details_md_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    # 7. Update Master renders_manifest.json
    master_manifest_path = os.path.join(renders_root, "renders_manifest.json")
    all_renders = []
    if os.path.exists(master_manifest_path):
        try:
            with open(master_manifest_path, "r", encoding="utf-8") as f:
                all_renders = json.load(f)
        except Exception:
            all_renders = []

    summary_item = {
        "id": folder_name,
        "title": title,
        "slug": slug,
        "created_at": now.isoformat(),
        "created_formatted": now.strftime("%Y-%m-%d %H:%M"),
        "duration": DURATION,
        "duration_formatted": f"00:{int(DURATION):02d}",
        "resolution": f"{WIDTH}x{HEIGHT}",
        "aspect_ratio": "9:16",
        "voice": "en-US-ChristopherNeural",
        "folder_path": f"renders/{folder_name}",
        "video_url": f"renders/{folder_name}/video.mp4",
        "thumbnail_url": f"renders/{folder_name}/contact_sheet.png",
        "manifest_url": f"renders/{folder_name}/project_manifest.json",
        "details_url": f"renders/{folder_name}/details.md",
        "files_count": len(files_manifest) + 3
    }

    all_renders.insert(0, summary_item)

    with open(master_manifest_path, "w", encoding="utf-8") as f:
        json.dump(all_renders, f, indent=2, ensure_ascii=False)

    print(f"[OK] Dedicated render folder package created successfully!")
    print(f"     Path: {target_dir}")
    print(f"     Master index updated: {master_manifest_path}")
    return target_dir, folder_name

if __name__ == "__main__":
    generate_contact_sheet("preview_quantum_contact_sheet.png", count=9)
    success = render_mp4_video()
    if success:
        package_render_folder(
            slug="quantum_computing_motion_graphics",
            title="Quantum Computing: Qubit Superposition, Shor's Algorithm & Dilution Cryocore"
        )
    else:
        print("[ABORT] Render failed. No incomplete package created. ONLY final successful renders are saved.")
        sys.exit(1)
