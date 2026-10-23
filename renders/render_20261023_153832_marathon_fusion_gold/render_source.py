"""
Procedural Video Render Engine (Enhanced Thematic Motion Graphics + High-Contrast Captions)
Topic: Marathon Fusion Mercury-to-Gold Transmutation & Gold Market Impact
Duration: 41.6s @ 25fps (720x1280 9:16 Shorts)
"""

import os
import sys
import math
import json
import shutil
import datetime
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

WIDTH = 720
HEIGHT = 1280
FPS = 25
DURATION = 41.6
TOTAL_FRAMES = int(DURATION * FPS)
AUDIO_FILE = "voice_guy_40s.mp3"
OUTPUT_VIDEO = "marathon_fusion_gold_40s.mp4"

# Load TrueType Fonts
FONT_PATH_BOLD = "C:\\Windows\\Fonts\\segoeuib.ttf" if os.path.exists("C:\\Windows\\Fonts\\segoeuib.ttf") else "C:\\Windows\\Fonts\\arialbd.ttf"
FONT_PATH_MONO = "C:\\Windows\\Fonts\\consolab.ttf" if os.path.exists("C:\\Windows\\Fonts\\consolab.ttf") else FONT_PATH_BOLD

font_hud_sm = ImageFont.truetype(FONT_PATH_MONO, 14)
font_hud_md = ImageFont.truetype(FONT_PATH_MONO, 18)
font_caption = ImageFont.truetype(FONT_PATH_BOLD, 22)
font_caption_bold = ImageFont.truetype(FONT_PATH_BOLD, 24)
font_title = ImageFont.truetype(FONT_PATH_BOLD, 28)

# Captions timed to Guy's Voice-Over
CAPTIONS = [
    {"start": 0.0, "end": 3.8, "text": "Did a Silicon Valley fusion startup break global gold markets?", "highlight": "GOLD MARKETS"},
    {"start": 3.8, "end": 7.2, "text": "Marathon Fusion claims it turned mercury into stable gold.", "highlight": "MERCURY → GOLD"},
    {"start": 7.2, "end": 11.8, "text": "Surrounding a fusion reactor core with mercury-198...", "highlight": "FUSION REACTOR"},
    {"start": 11.8, "end": 16.5, "text": "...intense neutron capture yields 10x the benchmark of CERN!", "highlight": "10X CERN BENCHMARK"},
    {"start": 16.5, "end": 21.4, "text": "Before you panic: the company didn't disclose yield or cost.", "highlight": "YIELD & COST UNDISCLOSED"},
    {"start": 21.4, "end": 27.0, "text": "One gram demands massive fusion energy and years of cooling.", "highlight": "ASTRONOMICAL ENERGY"},
    {"start": 27.0, "end": 31.0, "text": "The result? Zero market crash. Gold's dip is driven by macro...", "highlight": "ZERO MARKET CRASH"},
    {"start": 31.0, "end": 35.2, "text": "...not nuclear alchemy. Lab gold costs far more than mining it.", "highlight": "COST > MINED GOLD"},
    {"start": 35.2, "end": 38.6, "text": "Modern physics solved alchemy — but Earth still sets the price.", "highlight": "PHYSICS > ALCHEMY"},
    {"start": 38.6, "end": 41.6, "text": "Follow OpusMotion for verified procedural science.", "highlight": "FOLLOW @OPUSMOTION"}
]

def get_active_caption(t):
    for c in CAPTIONS:
        if c["start"] <= t < c["end"]:
            return c
    return CAPTIONS[-1]

def render_frame_pil(t, w=WIDTH, h=HEIGHT):
    img = Image.new("RGBA", (w, h), (7, 9, 15, 255))
    draw = ImageDraw.Draw(img)

    # Color Palette
    cyan = (0, 242, 254, 255)
    gold = (255, 215, 0, 255)
    silver = (210, 225, 240, 255)
    amber = (255, 170, 0, 255)
    red = (255, 40, 80, 255)
    green = (0, 230, 150, 255)
    white = (255, 255, 255, 255)

    cx = w // 2
    cy = int(h * 0.38) # Visual focal center (Y: ~480px, well above captions)

    # Background ambient radial glow
    for ring_r, alpha in [(320, 20), (220, 30), (120, 45)]:
        glow_color = cyan if t < 16.5 or t >= 27.0 else amber
        draw.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r], fill=(glow_color[0], glow_color[1], glow_color[2], alpha))

    # Perspective 3D floor grid (Subtle in background)
    horizon = int(h * 0.52)
    for i in range(0, w + 1, 80):
        draw.line([(cx, horizon), (i, int(h * 0.85))], fill=(0, 242, 254, 25), width=1)
    for j in range(1, 7):
        p = (j / 6.0) ** 2.2
        y = int(horizon + p * (int(h * 0.85) - horizon))
        draw.line([(0, y), (w, y)], fill=(0, 242, 254, int(p * 55)), width=1)

    # =========================================================================
    # THEMATIC MOTION GRAPHICS (TOPIC-MATCHED)
    # =========================================================================

    if t < 7.2:
        # SCENE 1: LIQUID MERCURY MORPHING INTO GOLD (Hg 80 -> Au 79)
        # Left: Mercury Element Card [80 Hg 200.59]
        card_w, card_h = 130, 150
        draw.rectangle([cx - 280, cy - card_h//2, cx - 150, cy + card_h//2], outline=silver, width=2, fill=(20, 30, 45, 180))
        draw.text((cx - 215, cy - 60), "80", fill=silver, font=font_hud_sm, anchor="mt")
        draw.text((cx - 215, cy - 35), "Hg", fill=white, font=font_title, anchor="mt")
        draw.text((cx - 215, cy + 5), "MERCURY", fill=silver, font=font_hud_sm, anchor="mt")
        draw.text((cx - 215, cy + 25), "198.0", fill=cyan, font=font_hud_sm, anchor="mt")

        # Right: Gold Element Card [79 Au 196.97]
        draw.rectangle([cx + 150, cy - card_h//2, cx + 280, cy + card_h//2], outline=gold, width=2, fill=(35, 30, 15, 180))
        draw.text((cx + 215, cy - 60), "79", fill=gold, font=font_hud_sm, anchor="mt")
        draw.text((cx + 215, cy - 35), "Au", fill=gold, font=font_title, anchor="mt")
        draw.text((cx + 215, cy + 5), "GOLD", fill=white, font=font_hud_sm, anchor="mt")
        draw.text((cx + 215, cy + 25), "197.0", fill=gold, font=font_hud_sm, anchor="mt")

        # Center: Pulsing Transmutation Core & Liquid Droplet
        drop_r = int(55 + math.sin(t * 8) * 8)
        draw.ellipse([cx - drop_r, cy - drop_r, cx + drop_r, cy + drop_r], fill=(180, 200, 220, 220), outline=cyan, width=3)
        draw.ellipse([cx - drop_r + 15, cy - drop_r + 15, cx - drop_r + 35, cy - drop_r + 35], fill=(255, 255, 255, 200)) # Specular highlight

        # Orbiting Electron Rings
        for o in range(3):
            ang = t * 1.5 + o * (math.pi / 3)
            rx, ry = int(100 + o * 20), int(45 + o * 10)
            # Electron dots
            ex = cx + int(math.cos(ang) * rx)
            ey = cy + int(math.sin(ang) * ry)
            draw.ellipse([ex - 4, ey - 4, ex + 4, ey + 4], fill=cyan if o != 1 else gold)

        # Transmutation laser beams
        laser_offset = int((t * 240) % 200)
        draw.line([(cx - 150, cy), (cx - 55, cy)], fill=cyan, width=3)
        draw.line([(cx + 55, cy), (cx + 150, cy)], fill=gold, width=3)

    elif t < 16.5:
        # SCENE 2: TOKAMAK FUSION CORE & 14.1 MeV NEUTRON CAPTURE
        # 3D Torus Magnetic Coils (Confinement chamber)
        torus_r = 160
        coil_count = 12
        for c in range(coil_count):
            coil_ang = (c / coil_count) * math.pi * 2 + t * 0.8
            px = cx + int(math.cos(coil_ang) * torus_r)
            py = cy + int(math.sin(coil_ang) * (torus_r * 0.45))
            draw.ellipse([px - 16, py - 35, px + 16, py + 35], outline=cyan, width=2)

        # Fusion Core Plasma Reaction (Center)
        plasma_r = int(45 + math.sin(t * 12) * 10)
        draw.ellipse([cx - plasma_r, cy - plasma_r, cx + plasma_r, cy + plasma_r], fill=(0, 242, 254, 180), outline=white, width=3)
        draw.text((cx, cy - 8), "D-T PLASMA", fill=white, font=font_hud_sm, anchor="mt")

        # Fast Streaming Neutrons Bombarding the Outer Blanket
        for n in range(16):
            n_ang = n * (math.pi / 8) + t * 4
            n_dist = 50 + int(((t * 300 + n * 40) % 130))
            nx = cx + int(math.cos(n_ang) * n_dist)
            ny = cy + int(math.sin(n_ang) * (n_dist * 0.6))
            draw.line([(nx, ny), (nx + int(math.cos(n_ang)*15), ny + int(math.sin(n_ang)*10))], fill=gold, width=3)
            draw.text((nx + 6, ny - 6), "n⁰", fill=gold, font=font_hud_sm)

        # Telemetry Box (10x CERN Benchmark)
        draw.rectangle([cx - 200, cy + 95, cx + 200, cy + 145], outline=green, width=2, fill=(10, 25, 20, 200))
        draw.text((cx, cy + 105), "PRODUCTION RATE: 10.4x CERN", fill=green, font=font_hud_md, anchor="mt")
        draw.text((cx, cy + 125), "NEUTRON FLUX: 14.1 MeV • Hg-198 BLANKET", fill=white, font=font_hud_sm, anchor="mt")

    elif t < 27.0:
        # SCENE 3: REALITY CHECK — COST & COOLING BARRIERS
        # Warning Diagnostic Gauges
        gauge_w = 480
        draw.rectangle([cx - gauge_w//2, cy - 130, cx + gauge_w//2, cy + 120], outline=red, width=3, fill=(25, 10, 15, 220))
        draw.rectangle([cx - gauge_w//2, cy - 130, cx + gauge_w//2, cy - 90], fill=red)
        draw.text((cx, cy - 122), "⚠ TECHNICAL & ECONOMIC AUDIT ⚠", fill=white, font=font_hud_md, anchor="mt")

        # Metric 1: Yield Status
        draw.text((cx - 200, cy - 70), "YIELD DISCLOSED:", fill=silver, font=font_hud_sm)
        draw.text((cx + 190, cy - 70), "NONE / CLASSIFIED", fill=red, font=font_hud_sm, anchor="rt")

        # Metric 2: Net Energy Gain (Q Factor)
        draw.text((cx - 200, cy - 40), "FUSION ENERGY GAIN (Q):", fill=silver, font=font_hud_sm)
        draw.text((cx + 190, cy - 40), "Q < 1.0 (NET LOSS)", fill=amber, font=font_hud_sm, anchor="rt")

        # Metric 3: Radioisotope Cooldown Period
        draw.text((cx - 200, cy - 10), "RADIOACTIVE COOLDOWN:", fill=silver, font=font_hud_sm)
        draw.text((cx + 190, cy - 10), "MULTI-YEAR DECAY", fill=amber, font=font_hud_sm, anchor="rt")

        # Energy Cost vs Gold Value Bar Comparison
        draw.text((cx, cy + 25), "ESTIMATED SYNTHESIS COST PER GRAM:", fill=silver, font=font_hud_sm, anchor="mt")
        # Bar 1: Market Gold Value ($85/g)
        draw.rectangle([cx - 200, cy + 50, cx - 120, cy + 70], fill=gold)
        draw.text((cx - 110, cy + 52), "MINED GOLD: $85/g", fill=gold, font=font_hud_sm)
        # Bar 2: Nuclear Synthesis ($1,000,000+/g)
        cost_bar_w = int(220 + math.sin(t * 6) * 15)
        draw.rectangle([cx - 200, cy + 78, cx - 200 + cost_bar_w, cy + 98], fill=red)
        draw.text((cx - 190 + cost_bar_w, cy + 80), "FUSION COST: >$1,000,000/g", fill=red, font=font_hud_sm)

    elif t < 35.2:
        # SCENE 4: GOLD MARKET ORDER BOOK & MACRO DRIFT (XAU/USD)
        chart_w, chart_h = 520, 200
        draw.rectangle([cx - chart_w//2, cy - chart_h//2, cx + chart_w//2, cy + chart_h//2], outline=cyan, width=2, fill=(10, 18, 30, 220))
        draw.text((cx - chart_w//2 + 15, cy - chart_h//2 + 12), "XAU/USD (SPOT GOLD) — NO ALCHEMY CRASH", fill=cyan, font=font_hud_sm)
        draw.text((cx + chart_w//2 - 15, cy - chart_h//2 + 12), "$2,648.20 (-0.12%)", fill=silver, font=font_hud_sm, anchor="rt")

        # Candlesticks
        candle_count = 14
        spacing = chart_w // (candle_count + 1)
        for c in range(candle_count):
            k_x = (cx - chart_w//2 + 25) + c * spacing
            val = math.sin(c * 0.7 + t * 1.5) * 0.35 + 0.5
            k_y = int(cy + 40 - val * 70)
            is_green = val > 0.45
            draw.line([(k_x, k_y - 12), (k_x, k_y + 24)], fill=green if is_green else red, width=2)
            draw.rectangle([k_x - 7, k_y - 6, k_x + 7, k_y + 16], fill=green if is_green else red)

        # Macro Narrative Tag Below Chart
        draw.rectangle([cx - 220, cy + 115, cx + 220, cy + 150], outline=gold, fill=(30, 25, 10, 200), width=2)
        draw.text((cx, cy + 125), "GOLD TREND = MACRO POLICY & INFLATION", fill=gold, font=font_hud_sm, anchor="mt")

    else:
        # SCENE 5: FINALE — MOTHER EARTH EMBLEM & OUTRO
        earth_r = 110
        draw.ellipse([cx - earth_r, cy - earth_r, cx + earth_r, cy + earth_r], outline=cyan, width=3, fill=(12, 22, 38, 220))
        # Latitude / Longitude Lines
        draw.ellipse([cx - earth_r, cy - earth_r//2, cx + earth_r, cy + earth_r//2], outline=(0, 242, 254, 80), width=2)
        draw.ellipse([cx - earth_r//2, cy - earth_r, cx + earth_r//2, cy + earth_r], outline=(0, 242, 254, 80), width=2)

        # Glowing Gold Veins inside Earth
        for g in range(8):
            ang = g * (math.pi / 4) + t * 0.4
            gx = cx + int(math.cos(ang) * (earth_r * 0.65))
            gy = cy + int(math.sin(ang) * (earth_r * 0.65))
            draw.ellipse([gx - 6, gy - 6, gx + 6, gy + 6], fill=gold)

        # Pulse shockwave
        wave_r = int((t * 90) % 190)
        draw.ellipse([cx - wave_r, cy - wave_r, cx + wave_r, cy + wave_r], outline=(255, 215, 0, max(0, 255 - wave_r)), width=2)

        draw.text((cx, cy + earth_r + 20), "NATURE'S SCARCITY CANNOT BE FORGED", fill=gold, font=font_hud_md, anchor="mt")

    # =========================================================================
    # DYNAMIC NON-INTRUSIVE HIGH-CONTRAST CAPTIONS (LOWER-MIDDLE SAFE ZONE)
    # =========================================================================
    # Placed between Y = 870 and Y = 1010 (Clear of visuals, clear of bottom TikTok UI)
    cap = get_active_caption(t)
    cap_box_w = 640
    cap_box_h = 100
    cap_x1 = (w - cap_box_w) // 2
    cap_y1 = int(h * 0.68) # 870px
    cap_x2 = cap_x1 + cap_box_w
    cap_y2 = cap_y1 + cap_box_h

    # Translucent Dark Glass Container Pill
    draw.rounded_rectangle([cap_x1, cap_y1, cap_x2, cap_y2], radius=16, fill=(10, 14, 24, 230), outline=cyan, width=2)

    # Keyword Pill Tag at Top of Caption Box
    kw_w = int(draw.textlength(cap["highlight"], font=font_hud_sm)) + 24
    draw.rounded_rectangle([cx - kw_w//2, cap_y1 - 12, cx + kw_w//2, cap_y1 + 12], radius=6, fill=cyan)
    draw.text((cx, cap_y1 - 10), cap["highlight"], fill=(5, 8, 14, 255), font=font_hud_sm, anchor="mt")

    # Spoken Sentence Text with Word Wrap
    full_sentence = cap["text"]
    words = full_sentence.split(" ")
    lines = []
    curr_line = ""
    for word in words:
        test_line = curr_line + " " + word if curr_line else word
        if draw.textlength(test_line, font=font_caption) > (cap_box_w - 40):
            lines.append(curr_line)
            curr_line = word
        else:
            curr_line = test_line
    if curr_line:
        lines.append(curr_line)

    # Render High-Contrast Caption Lines
    line_start_y = cap_y1 + 22
    for l_idx, line in enumerate(lines[:2]): # Max 2 clean lines
        draw.text((cx + 1, line_start_y + l_idx * 30 + 1), line, fill=(0, 0, 0, 255), font=font_caption, anchor="mt") # Drop shadow
        draw.text((cx, line_start_y + l_idx * 30), line, fill=white, font=font_caption, anchor="mt")

    # =========================================================================
    # TOP HEADER & TIMELINE PROGRESS BAR
    # =========================================================================
    draw.rectangle([0, 0, w, 65], fill=(5, 8, 14, 240))
    draw.line([(0, 65), (w, 65)], fill=(0, 242, 254, 80), width=1)
    draw.text((30, 22), "OPUSMOTION // PURE CODE", fill=cyan, font=font_hud_sm)
    tc_str = f"00:{int(t):02d}.{int((t % 1)*100):02d} / 00:41.60"
    draw.text((w - 30, 22), tc_str, fill=silver, font=font_hud_sm, anchor="rt")

    # Bottom Timeline Progress Indicator
    prog_w = int(w * (t / DURATION))
    draw.rectangle([0, h - 8, w, h], fill=(20, 25, 40, 255))
    draw.rectangle([0, h - 8, prog_w, h], fill=cyan)

    return img

def generate_contact_sheet(output_filename="preview_v3_contact_sheet.png", count=9):
    print(f"[*] Generating {count}-frame QA Contact Sheet with Captions: {output_filename}...")
    cell_w = 360
    cell_h = 640
    sheet = Image.new("RGBA", (cell_w * 3, cell_h * 3), (10, 12, 18, 255))

    for i in range(count):
        t = (i / (count - 1)) * DURATION
        frame = render_frame_pil(t, cell_w, cell_h)
        col = i % 3
        row = i // 3
        sheet.paste(frame, (col * cell_w, row * cell_h))

    sheet.save(output_filename)
    print(f"[+] Saved Contact Sheet: {output_filename}")

def render_mp4_video():
    print(f"[*] Rendering high-bitrate MP4 with Topic Motion Graphics & Captions ({TOTAL_FRAMES} frames @ {FPS}fps)...")
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
            print(f"    Frame {f_idx}/{TOTAL_FRAMES} ({int((f_idx/TOTAL_FRAMES)*100)}%) rendered...", flush=True)

    proc.stdin.close()
    proc.wait()
    print(f"[+] Video Render COMPLETE: {OUTPUT_VIDEO}", flush=True)

SCENES_METADATA = [
    {
        "scene_id": 1,
        "name": "Hook: Nuclear Alchemy & Element Transmutation",
        "start": 0.0,
        "end": 7.2,
        "duration": 7.2,
        "visual_theme": "Cyber Neon Element Cards (Hg 80 -> Au 79) with pulsing liquid mercury droplet and orbital electron rings",
        "audio_text": "Did a Silicon Valley fusion startup break global gold markets? Marathon Fusion claims it turned mercury into stable gold.",
        "captions": [
            {"start": 0.0, "end": 3.8, "text": "Did a Silicon Valley fusion startup break global gold markets?", "highlight": "GOLD MARKETS"},
            {"start": 3.8, "end": 7.2, "text": "Marathon Fusion claims it turned mercury into stable gold.", "highlight": "MERCURY → GOLD"}
        ]
    },
    {
        "scene_id": 2,
        "name": "Mechanism: 14.1 MeV Fast Neutrons in Tokamak Blanket",
        "start": 7.2,
        "end": 16.5,
        "duration": 9.3,
        "visual_theme": "3D Tokamak Torus Magnetic Coils, pulsing D-T plasma core, and fast neutron bombardment of Hg-198 blanket (10.4x CERN rate)",
        "audio_text": "Surrounding a fusion reactor core with mercury-198, intense neutron capture yields 10x the benchmark of CERN!",
        "captions": [
            {"start": 7.2, "end": 11.8, "text": "Surrounding a fusion reactor core with mercury-198...", "highlight": "FUSION REACTOR"},
            {"start": 11.8, "end": 16.5, "text": "...intense neutron capture yields 10x the benchmark of CERN!", "highlight": "10X CERN BENCHMARK"}
        ]
    },
    {
        "scene_id": 3,
        "name": "Reality Check: Economic & Radioactive Barriers",
        "start": 16.5,
        "end": 27.0,
        "duration": 10.5,
        "visual_theme": "Red Alert Technical Audit HUD: Yield undisclosed, Q < 1.0 net energy loss, multi-year radioisotope cooldown, and synthesis cost comparison ($85/g vs >$1,000,000/g)",
        "audio_text": "Before you panic: the company didn't disclose yield or cost. One gram demands massive fusion energy and years of cooling.",
        "captions": [
            {"start": 16.5, "end": 21.4, "text": "Before you panic: the company didn't disclose yield or cost.", "highlight": "YIELD & COST UNDISCLOSED"},
            {"start": 21.4, "end": 27.0, "text": "One gram demands massive fusion energy and years of cooling.", "highlight": "ASTRONOMICAL ENERGY"}
        ]
    },
    {
        "scene_id": 4,
        "name": "Market Analysis: Spot Gold (XAU/USD) Macro Trends",
        "start": 27.0,
        "end": 35.2,
        "duration": 8.2,
        "visual_theme": "Dynamic Candlestick Chart HUD showing XAU/USD at $2,648.20 and macro policy narrative (zero market crash caused by fusion)",
        "audio_text": "The result? Zero market crash. Gold's dip is driven by macro, not nuclear alchemy. Lab gold costs far more than mining it.",
        "captions": [
            {"start": 27.0, "end": 31.0, "text": "The result? Zero market crash. Gold's dip is driven by macro...", "highlight": "ZERO MARKET CRASH"},
            {"start": 31.0, "end": 35.2, "text": "...not nuclear alchemy. Lab gold costs far more than mining it.", "highlight": "COST > MINED GOLD"}
        ]
    },
    {
        "scene_id": 5,
        "name": "Conclusion: Physics Solved Alchemy, Earth Sets Scarcity",
        "start": 35.2,
        "end": 41.6,
        "duration": 6.4,
        "visual_theme": "Earth Hologram with gold mineral veins, radial pulse shockwaves, and brand call-to-action",
        "audio_text": "Modern physics solved alchemy — but Earth still sets the price. Follow OpusMotion for verified procedural science.",
        "captions": [
            {"start": 35.2, "end": 38.6, "text": "Modern physics solved alchemy — but Earth still sets the price.", "highlight": "PHYSICS > ALCHEMY"},
            {"start": 38.6, "end": 41.6, "text": "Follow OpusMotion for verified procedural science.", "highlight": "FOLLOW @OPUSMOTION"}
        ]
    }
]

def package_render_folder(slug="marathon_fusion_gold", title="Marathon Fusion: Can Nuclear Fusion Turn Mercury to Gold?"):
    """
    Creates an isolated, self-contained directory under renders/ for this specific video.
    Packages:
      - video.mp4
      - voiceover.mp3
      - contact_sheet.png
      - preview_rough.png
      - project_manifest.json
      - details.md
      - render_source.py
    Also registers the video in renders/renders_manifest.json master catalog.
    """
    now = datetime.datetime.now()
    timestamp_str = now.strftime("%Y%m%d_%H%M%S")
    folder_name = f"render_{timestamp_str}_{slug}"
    base_dir = os.path.dirname(os.path.abspath(__file__))
    renders_root = os.path.join(base_dir, "renders")
    os.makedirs(renders_root, exist_ok=True)

    target_dir = os.path.join(renders_root, folder_name)
    os.makedirs(target_dir, exist_ok=True)
    print(f"\n[FOLDER] Creating dedicated render package folder: {target_dir}")

    # Copy binary files
    files_manifest = {}
    
    # 1. Video MP4
    if os.path.exists(OUTPUT_VIDEO):
        dst_vid = os.path.join(target_dir, "video.mp4")
        shutil.copy2(OUTPUT_VIDEO, dst_vid)
        files_manifest["video"] = {
            "filename": "video.mp4",
            "size_bytes": os.path.getsize(dst_vid),
            "size_formatted": f"{os.path.getsize(dst_vid) / (1024*1024):.2f} MB"
        }

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
    sheet_v3 = "preview_v3_contact_sheet.png"
    if os.path.exists(sheet_v3):
        dst_sheet = os.path.join(target_dir, "contact_sheet.png")
        shutil.copy2(sheet_v3, dst_sheet)
        files_manifest["contact_sheet"] = {
            "filename": "contact_sheet.png",
            "size_bytes": os.path.getsize(dst_sheet),
            "size_formatted": f"{os.path.getsize(dst_sheet) / 1024:.1f} KB"
        }

    # 4. Rough Sheet
    sheet_v1 = "preview_v1_rough.png"
    if os.path.exists(sheet_v1):
        dst_rough = os.path.join(target_dir, "preview_rough.png")
        shutil.copy2(sheet_v1, dst_rough)
        files_manifest["preview_rough"] = {
            "filename": "preview_rough.png",
            "size_bytes": os.path.getsize(dst_rough),
            "size_formatted": f"{os.path.getsize(dst_rough) / 1024:.1f} KB"
        }

    # 5. Standalone Render Script
    this_script = os.path.abspath(__file__)
    dst_src = os.path.join(target_dir, "render_source.py")
    shutil.copy2(this_script, dst_src)
    files_manifest["render_source"] = {
        "filename": "render_source.py",
        "size_bytes": os.path.getsize(dst_src),
        "size_formatted": f"{os.path.getsize(dst_src) / 1024:.1f} KB"
    }

    # 6. Detailed Project Manifest JSON
    manifest_data = {
        "render_id": folder_name,
        "title": title,
        "slug": slug,
        "topic_source_url": "https://beincrypto.com/marathon-fusion-mercury-gold-price-impact/",
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
            "color_depth": "8-bit RGBA / yuv420p",
            "generation_type": "Pure Mathematical Procedural (Pillow + FFmpeg rawvideo pipe)"
        },
        "voice": {
            "voice_name": "en-US-GuyNeural",
            "style": "Energetic / Authoritative",
            "rate_adjustment": "+24%",
            "file": "voiceover.mp3"
        },
        "scenes": SCENES_METADATA,
        "captions": CAPTIONS,
        "files": files_manifest
    }

    manifest_json_path = os.path.join(target_dir, "project_manifest.json")
    with open(manifest_json_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)

    details_json_path = os.path.join(target_dir, "details.json")
    with open(details_json_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)

    # 7. Formatted Human-Readable Markdown Report
    details_md_path = os.path.join(target_dir, "details.md")
    md_content = f"""# Video Render Package: {title}

**Render ID:** `{folder_name}`  
**Generated On:** {now.strftime("%B %d, %Y at %I:%M:%S %p")}  
**Topic URL:** [BeInCrypto Article](https://beincrypto.com/marathon-fusion-mercury-gold-price-impact/)  

---

## 📊 Technical Specifications
| Specification | Value |
|---|---|
| **Duration** | {DURATION}s ({TOTAL_FRAMES} frames @ {FPS} fps) |
| **Resolution** | {WIDTH}x{HEIGHT} (Vertical 9:16 Shorts / Reels) |
| **Video Codec** | H.264 / libx264 (CRF 18 broadcast quality) |
| **Audio Codec** | AAC 192 kbps (Neural TTS `en-US-GuyNeural` @ +24%) |
| **Visual Architecture** | 100% Procedural Code (No Generative Diffusion AI) |
| **Captions** | Safe-Zone Compliant (Y: 68% - 76%) with High-Contrast Glass Pill |

---

## 🎬 Scene Breakdown & Visual Storyboard

"""
    for sc in SCENES_METADATA:
        md_content += f"""### Scene {sc['scene_id']}: {sc['name']} ({sc['start']}s – {sc['end']}s)
- **Visual Theme:** {sc['visual_theme']}
- **Voiceover Script:** *"{sc['audio_text']}"*
- **Captions Active:**
"""
        for cap in sc['captions']:
            md_content += f"  - `[{cap['start']}s - {cap['end']}s]` **[{cap['highlight']}]** {cap['text']}\n"
        md_content += "\n"

    md_content += """---

## 📦 Package Files Contained in this Folder
- `video.mp4`: Final master vertical short video (H.264 / AAC)
- `voiceover.mp3`: Isolated calibrated neural voiceover audio track
- `contact_sheet.png`: 9-frame evidence contact sheet with safe-zone captions
- `preview_rough.png`: 9-frame layout contact sheet
- `project_manifest.json`: Full machine-readable metadata and parameters
- `details.json`: Duplicate JSON specification
- `render_source.py`: Standalone reproducible Python generation script
- `details.md`: This comprehensive production document
"""

    with open(details_md_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    # 8. Update Master renders_manifest.json
    master_manifest_path = os.path.join(renders_root, "renders_manifest.json")
    all_renders = []
    if os.path.exists(master_manifest_path):
        try:
            with open(master_manifest_path, "r", encoding="utf-8") as f:
                all_renders = json.load(f)
        except Exception:
            all_renders = []

    # Prepare summary item for master index
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
        "voice": "en-US-GuyNeural",
        "folder_path": f"renders/{folder_name}",
        "video_url": f"renders/{folder_name}/video.mp4",
        "thumbnail_url": f"renders/{folder_name}/contact_sheet.png",
        "manifest_url": f"renders/{folder_name}/project_manifest.json",
        "details_url": f"renders/{folder_name}/details.md",
        "files_count": len(files_manifest) + 3 # + json, md, details
    }

    # Prepend newest
    all_renders.insert(0, summary_item)

    with open(master_manifest_path, "w", encoding="utf-8") as f:
        json.dump(all_renders, f, indent=2, ensure_ascii=False)

    print(f"[OK] Dedicated render folder package created successfully!")
    print(f"     Path: {target_dir}")
    print(f"     Master index updated: {master_manifest_path}")
    return target_dir, folder_name

if __name__ == "__main__":
    generate_contact_sheet("preview_v3_contact_sheet.png", count=9)
    generate_contact_sheet("preview_v1_rough.png", count=9)
    render_mp4_video()
    package_render_folder(
        slug="marathon_fusion_gold",
        title="Marathon Fusion: Can Nuclear Fusion Turn Mercury to Gold?"
    )
