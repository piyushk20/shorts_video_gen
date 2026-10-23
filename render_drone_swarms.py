"""
Procedural Video Render Engine (Thematic Military Defense Motion Graphics + Safe-Zone Captions)
Topic: Autonomous Drone Swarms Vs Air Defense
Duration: 44.25s @ 25fps (720x1280 9:16 Shorts/Reels)
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
DURATION = 44.25
TOTAL_FRAMES = int(DURATION * FPS)
AUDIO_FILE = "voice_drone_swarms.mp3"
OUTPUT_VIDEO = "drone_swarms_vs_air_defense_44s.mp4"

# Load TrueType Fonts
FONT_PATH_BOLD = "C:\\Windows\\Fonts\\segoeuib.ttf" if os.path.exists("C:\\Windows\\Fonts\\segoeuib.ttf") else "C:\\Windows\\Fonts\\arialbd.ttf"
FONT_PATH_MONO = "C:\\Windows\\Fonts\\consolab.ttf" if os.path.exists("C:\\Windows\\Fonts\\consolab.ttf") else FONT_PATH_BOLD

font_hud_sm = ImageFont.truetype(FONT_PATH_MONO, 14)
font_hud_md = ImageFont.truetype(FONT_PATH_MONO, 18)
font_hud_lg = ImageFont.truetype(FONT_PATH_MONO, 24)
font_caption = ImageFont.truetype(FONT_PATH_BOLD, 22)
font_title = ImageFont.truetype(FONT_PATH_BOLD, 28)

# Timed Safe-Zone Captions matching Christopher's VO
CAPTIONS = [
    {"start": 0.0, "end": 4.2, "text": "A $400 hobby drone just destroyed a $7 million main battle tank.", "highlight": "$400 VS $7M TANK"},
    {"start": 4.2, "end": 7.8, "text": "Military generals are watching the death of 20th-century armor in real time.", "highlight": "DEATH OF HEAVY ARMOR"},
    {"start": 7.8, "end": 12.0, "text": "If you examine autonomous drone swarms versus air defense...", "highlight": "SWARM VS AIR DEFENSE"},
    {"start": 12.0, "end": 16.5, "text": "...traditional militaries make one fatal mistake: firing a $2M missile to kill an $800 drone.", "highlight": "BROKEN ECONOMIC MATH"},
    {"start": 16.5, "end": 21.5, "text": "The economic math is broken. Autonomous swarms don't rely on central satellites.", "highlight": "ZERO SATELLITE RELIANCE"},
    {"start": 21.5, "end": 26.5, "text": "Using local mesh networks and onboard optical AI, hundreds communicate peer-to-peer.", "highlight": "PEER-TO-PEER MESH AI"},
    {"start": 26.5, "end": 31.2, "text": "Air defense is forced to adapt: directed energy lasers and micro-interceptors...", "highlight": "50kW LASER SHIELD"},
    {"start": 31.2, "end": 36.0, "text": "...are now the only viable shield against mass swarm saturation.", "highlight": "$1.50 PER INTERCEPT"},
    {"start": 36.0, "end": 40.5, "text": "In modern warfare, decentralized code beats heavy armor every single time.", "highlight": "CODE BEATS ARMOR"},
    {"start": 40.5, "end": 44.25, "text": "Follow OpusMotion for verified defense engineering breakdowns.", "highlight": "FOLLOW @OPUSMOTION"}
]

SCENES_METADATA = [
    {
        "scene_id": 1,
        "name": "The Asymmetric Cost Hook: $400 Drone vs $7M Tank",
        "start": 0.0,
        "end": 7.8,
        "duration": 7.8,
        "visual_theme": "Dual tactical telemetry comparison: $400 FPV quadcopter with spinning rotors vs $7,000,000 Heavy Armor Tank with targeting reticle and explosive impact wave",
        "audio_text": "A four hundred dollar hobby drone just destroyed a seven million dollar main battle tank. Military generals are watching the death of twentieth-century armor in real time.",
        "captions": [CAPTIONS[0], CAPTIONS[1]]
    },
    {
        "scene_id": 2,
        "name": "Radar Saturation & The Broken Economic Curve",
        "start": 7.8,
        "end": 16.5,
        "duration": 8.7,
        "visual_theme": "360-degree sweeping tactical Radar HUD tracking 40+ synchronized drone chevron blips while AA battery burns $2,100,000 interceptor missiles",
        "audio_text": "If you examine autonomous drone swarms versus air defense, traditional militaries make one fatal mistake: firing a two million dollar missile to kill a swarm of cheap loitering drones. The economic math is broken.",
        "captions": [CAPTIONS[2], CAPTIONS[3]]
    },
    {
        "scene_id": 3,
        "name": "Swarm Intelligence: Local Mesh Networks & Optical AI",
        "start": 16.5,
        "end": 26.5,
        "duration": 10.0,
        "visual_theme": "P2P Decentralized Graph Topology with pulsing cyan data links, jamming-resistant optical AI target bounding boxes, and zero-satellite dependency",
        "audio_text": "Autonomous swarms don't rely on central satellites. Using local mesh networks and onboard optical AI, hundreds of drones communicate peer-to-peer to saturate radar defenses.",
        "captions": [CAPTIONS[4], CAPTIONS[5]]
    },
    {
        "scene_id": 4,
        "name": "Counter-Swarm Evolution: Directed Energy Lasers ($1.50/Shot)",
        "start": 26.5,
        "end": 36.0,
        "duration": 9.5,
        "visual_theme": "50 kW High-Energy Laser turret discharging continuous high-speed optical beam slicing drone vectors at $1.50 per kill, coupled with HPM microwave pulse shockwaves",
        "audio_text": "Directed energy lasers and counter-drone micro-interceptors are now the only viable shield against mass swarm saturation.",
        "captions": [CAPTIONS[6], CAPTIONS[7]]
    },
    {
        "scene_id": 5,
        "name": "The Law of Modern Warfare & Outro",
        "start": 36.0,
        "end": 44.25,
        "duration": 8.25,
        "visual_theme": "Holographic balance scale weighing 70-ton composite armor vs distributed code mesh, concentric shockwaves, and brand call to action",
        "audio_text": "In modern warfare, decentralized code beats heavy armor every single time. Follow OpusMotion for verified defense engineering.",
        "captions": [CAPTIONS[8], CAPTIONS[9]]
    }
]

def get_active_caption(t):
    for c in CAPTIONS:
        if c["start"] <= t < c["end"]:
            return c
    return CAPTIONS[-1]

def render_frame_pil(t, w=WIDTH, h=HEIGHT):
    img = Image.new("RGBA", (w, h), (6, 9, 14, 255))
    draw = ImageDraw.Draw(img)

    # Color Palette
    cyan = (0, 242, 254, 255)
    orange = (255, 120, 0, 255)
    red = (255, 45, 75, 255)
    green = (0, 230, 140, 255)
    silver = (210, 225, 240, 255)
    white = (255, 255, 255, 255)
    dark_glass = (12, 17, 28, 235)

    cx = w // 2
    cy = int(h * 0.38) # Visual focal center (Y: ~485px, safely above captions)

    # Ambient Background Radial Glow
    glow_col = red if t < 7.8 else (cyan if t < 26.5 else orange)
    for ring_r, alpha in [(300, 18), (200, 28), (100, 42)]:
        draw.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r], fill=(glow_col[0], glow_col[1], glow_col[2], alpha))

    # Tactical Perspective Floor Grid
    horizon = int(h * 0.52)
    for i in range(0, w + 1, 75):
        draw.line([(cx, horizon), (i, int(h * 0.85))], fill=(0, 242, 254, 20), width=1)
    for j in range(1, 7):
        p = (j / 6.0) ** 2.2
        y = int(horizon + p * (int(h * 0.85) - horizon))
        draw.line([(0, y), (w, y)], fill=(0, 242, 254, int(p * 50)), width=1)

    # =========================================================================
    # THEMATIC MOTION GRAPHICS (TOPIC: DRONE SWARMS VS AIR DEFENSE)
    # =========================================================================

    if t < 7.8:
        # SCENE 1: ASYMMETRIC WARFARE — $400 FPV DRONE VS $7,000,000 TANK
        card_w, card_h = 240, 160

        # Left: $400 Drone Card
        draw.rectangle([cx - 290, cy - card_h//2, cx - 40, cy + card_h//2], outline=cyan, width=2, fill=(15, 25, 38, 200))
        draw.text((cx - 165, cy - 65), "FPV QUADCOPTER", fill=cyan, font=font_hud_sm, anchor="mt")
        draw.text((cx - 165, cy - 40), "$400", fill=white, font=font_title, anchor="mt")
        draw.text((cx - 165, cy - 5), "Hobby Carbon Frame", fill=silver, font=font_hud_sm, anchor="mt")
        draw.text((cx - 165, cy + 18), "RPG Shaped Charge (1.8kg)", fill=orange, font=font_hud_sm, anchor="mt")
        draw.text((cx - 165, cy + 42), "Fiber-Optic Guided", fill=cyan, font=font_hud_sm, anchor="mt")

        # Right: $7M Tank Card
        draw.rectangle([cx + 40, cy - card_h//2, cx + 290, cy + card_h//2], outline=red, width=2, fill=(35, 15, 20, 200))
        draw.text((cx + 165, cy - 65), "MAIN BATTLE TANK", fill=red, font=font_hud_sm, anchor="mt")
        draw.text((cx + 165, cy - 40), "$7,000,000", fill=red, font=font_title, anchor="mt")
        draw.text((cx + 165, cy - 5), "65-Ton Composite Armor", fill=silver, font=font_hud_sm, anchor="mt")
        draw.text((cx + 165, cy + 18), "Turbine Engine (1500 HP)", fill=silver, font=font_hud_sm, anchor="mt")
        draw.text((cx + 165, cy + 42), "STATUS: MISSION KILL", fill=red, font=font_hud_sm, anchor="mt")

        # Cost Asymmetry Ratio Banner
        draw.rectangle([cx - 240, cy + 105, cx + 240, cy + 150], outline=orange, width=2, fill=(25, 18, 10, 220))
        draw.text((cx, cy + 115), "COST ASYMMETRY RATIO: 17,500 TO 1", fill=orange, font=font_hud_md, anchor="mt")
        draw.text((cx, cy + 132), "MASS-PRODUCED CODE OVERWHELMS ARMOR", fill=white, font=font_hud_sm, anchor="mt")

        # Center Targeting Reticle Pulse
        ret_r = int(35 + math.sin(t * 12) * 5)
        draw.ellipse([cx - ret_r, cy - ret_r, cx + ret_r, cy + ret_r], outline=red, width=2)
        draw.line([(cx - ret_r - 10, cy), (cx + ret_r + 10, cy)], fill=red, width=2)
        draw.line([(cx, cy - ret_r - 10), (cx, cy + ret_r + 10)], fill=red, width=2)

    elif t < 16.5:
        # SCENE 2: TACTICAL RADAR SWEEP & SATURATION SWARM
        radar_r = 160
        # Radar Base Circle
        draw.ellipse([cx - radar_r, cy - radar_r, cx + radar_r, cy + radar_r], outline=cyan, width=2, fill=(10, 18, 28, 200))
        # Concentric Range Rings
        for rr in [50, 95, 140]:
            draw.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=(0, 242, 254, 60), width=1)
        draw.line([(cx - radar_r, cy), (cx + radar_r, cy)], fill=(0, 242, 254, 60), width=1)
        draw.line([(cx, cy - radar_r), (cx, cy + radar_r)], fill=(0, 242, 254, 60), width=1)

        # Rotating Radar Beam Sweep
        sweep_ang = t * 2.8
        sx = cx + int(math.cos(sweep_ang) * radar_r)
        sy = cy + int(math.sin(sweep_ang) * radar_r)
        draw.line([(cx, cy), (sx, sy)], fill=cyan, width=3)

        # Swarm Drone Blips (30+ Coordinated Chevrons flying towards center)
        drone_count = 32
        for d in range(drone_count):
            d_ang = (d / drone_count) * math.pi * 2 + t * 0.4
            d_dist = 60 + int((((d * 37) + t * 50) % 95))
            dx = cx + int(math.cos(d_ang) * d_dist)
            dy = cy + int(math.sin(d_ang) * d_dist)
            # Draw Chevron blip
            draw.polygon([(dx, dy - 5), (dx - 4, dy + 4), (dx + 4, dy + 4)], fill=green)

        # Anti-Air Missile Interceptor Trajectory
        mx = cx + int(math.cos(t * 3.5) * 110)
        my = cy + int(math.sin(t * 3.5) * 110)
        draw.ellipse([mx - 5, my - 5, mx + 5, my + 5], fill=red)
        draw.line([(cx, cy + 30), (mx, my)], fill=red, width=2)

        # Financial Depletion Box
        draw.rectangle([cx - 240, cy + 105, cx + 240, cy + 155], outline=red, width=2, fill=(25, 10, 15, 220))
        draw.text((cx, cy + 115), "MISSILE INTERCEPT: -$2,100,000", fill=red, font=font_hud_md, anchor="mt")
        draw.text((cx, cy + 135), "SWARM EXHAUSTS DEFENSE INVENTORY IN MINUTES", fill=silver, font=font_hud_sm, anchor="mt")

    elif t < 26.5:
        # SCENE 3: PEER-TO-PEER MESH NETWORK & ONBOARD OPTICAL AI
        node_count = 14
        nodes = []
        for n in range(node_count):
            ang = (n / node_count) * math.pi * 2 + t * 0.3
            dist = 85 + (35 if n % 2 == 0 else -15)
            nx = cx + int(math.cos(ang) * dist)
            ny = cy + int(math.sin(ang) * (dist * 0.75))
            nodes.append((nx, ny))

        # Draw Mesh Link Lines between nodes
        for i in range(node_count):
            for j in range(i + 1, min(i + 4, node_count)):
                draw.line([nodes[i], nodes[j]], fill=(0, 242, 254, 75), width=1)

        # Draw Mesh Drone Nodes
        for idx, (nx, ny) in enumerate(nodes):
            draw.ellipse([nx - 6, ny - 6, nx + 6, ny + 6], fill=cyan, outline=white, width=1)
            draw.text((nx + 8, ny - 6), f"NODE {idx+1}", fill=(0, 242, 254, 180), font=font_hud_sm)

        # Center AI Telemetry Box
        draw.rectangle([cx - 240, cy + 100, cx + 240, cy + 155], outline=green, width=2, fill=(10, 24, 18, 220))
        draw.text((cx, cy + 110), "JAM-RESISTANT OPTICAL EDGE AI", fill=green, font=font_hud_md, anchor="mt")
        draw.text((cx, cy + 132), "GPS: DENIED / SATCOM: ZERO / MESH: ACTIVE", fill=white, font=font_hud_sm, anchor="mt")

    elif t < 36.0:
        # SCENE 4: DIRECTED ENERGY LASER SHIELD ($1.50 PER SHOT)
        turret_y = cy + 120
        # Laser Turret Base
        draw.rectangle([cx - 60, turret_y, cx + 60, turret_y + 35], fill=(25, 30, 45, 255), outline=cyan, width=2)
        draw.text((cx, turret_y + 10), "50 kW HEL TURRET", fill=cyan, font=font_hud_sm, anchor="mt")

        # Laser Beams Zapping Incoming Drones
        target_drone_x = cx + int(math.sin(t * 8) * 180)
        target_drone_y = cy - 80 + int(math.cos(t * 6) * 35)

        # High-power laser streak
        draw.line([(cx, turret_y), (target_drone_x, target_drone_y)], fill=(0, 242, 254, 255), width=4)
        draw.line([(cx, turret_y), (target_drone_x, target_drone_y)], fill=(255, 255, 255, 255), width=2)

        # Thermal Plasma Explosion at Contact Point
        exp_r = int(25 + math.sin(t * 20) * 8)
        draw.ellipse([target_drone_x - exp_r, target_drone_y - exp_r, target_drone_x + exp_r, target_drone_y + exp_r], fill=(255, 150, 0, 180), outline=white, width=2)
        draw.text((target_drone_x + 30, target_drone_y - 10), "DESTROYED", fill=orange, font=font_hud_sm)

        # Economic Defense Metric Tag
        draw.rectangle([cx - 240, cy - 145, cx + 240, cy - 95], outline=cyan, width=2, fill=(10, 20, 32, 220))
        draw.text((cx, cy - 138), "LASER SHOT COST: $1.50 PER INTERCEPT", fill=cyan, font=font_hud_md, anchor="mt")
        draw.text((cx, cy - 116), "DEEP MAGAZINE: UNLIMITED RECHARGE BY DIESEL/BATTERY", fill=white, font=font_hud_sm, anchor="mt")

    else:
        # SCENE 5: FINALE — CODE > 70-TON ARMOR
        emblem_r = 105
        draw.ellipse([cx - emblem_r, cy - emblem_r, cx + emblem_r, cy + emblem_r], outline=cyan, width=3, fill=(12, 18, 30, 220))

        # Concentric Shockwave Pulses
        for w_idx in range(3):
            wave_rad = int(((t * 110 + w_idx * 60) % 200))
            wave_alpha = max(0, 255 - wave_rad)
            draw.ellipse([cx - wave_rad, cy - wave_rad, cx + wave_rad, cy + wave_rad], outline=(0, 242, 254, int(wave_alpha * 0.6)), width=2)

        draw.text((cx, cy - 25), "MASS & CODE", fill=white, font=font_title, anchor="mt")
        draw.text((cx, cy + 12), "> HEAVY ARMOR", fill=cyan, font=font_title, anchor="mt")
        draw.text((cx, cy + emblem_r + 20), "THE NATURE OF WARFARE HAS FOREVER CHANGED", fill=orange, font=font_hud_md, anchor="mt")

    # =========================================================================
    # DYNAMIC NON-INTRUSIVE HIGH-CONTRAST CAPTIONS (LOWER-MIDDLE SAFE ZONE)
    # =========================================================================
    cap = get_active_caption(t)
    cap_box_w = 640
    cap_box_h = 100
    cap_x1 = (w - cap_box_w) // 2
    cap_y1 = int(h * 0.68) # 870px, safe from center graphics and TikTok/Reels UI bounds
    cap_x2 = cap_x1 + cap_box_w
    cap_y2 = cap_y1 + cap_box_h

    # Translucent Dark Glass Container Pill
    draw.rounded_rectangle([cap_x1, cap_y1, cap_x2, cap_y2], radius=16, fill=dark_glass, outline=cyan, width=2)

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
    for l_idx, line in enumerate(lines[:2]):
        draw.text((cx + 1, line_start_y + l_idx * 30 + 1), line, fill=(0, 0, 0, 255), font=font_caption, anchor="mt") # Drop shadow
        draw.text((cx, line_start_y + l_idx * 30), line, fill=white, font=font_caption, anchor="mt")

    # =========================================================================
    # TOP HEADER & TIMELINE PROGRESS BAR
    # =========================================================================
    draw.rectangle([0, 0, w, 65], fill=(5, 8, 14, 240))
    draw.line([(0, 65), (w, 65)], fill=(0, 242, 254, 80), width=1)
    draw.text((30, 22), "OPUSMOTION // DEFENSE TECH", fill=cyan, font=font_hud_sm)
    tc_str = f"00:{int(t):02d}.{int((t % 1)*100):02d} / 00:44.25"
    draw.text((w - 30, 22), tc_str, fill=silver, font=font_hud_sm, anchor="rt")

    # Bottom Timeline Progress Indicator
    prog_w = int(w * (t / DURATION))
    draw.rectangle([0, h - 8, w, h], fill=(20, 25, 40, 255))
    draw.rectangle([0, h - 8, prog_w, h], fill=cyan)

    return img

def generate_contact_sheet(output_filename="preview_drone_contact_sheet.png", count=9):
    print(f"[*] Generating {count}-frame QA Contact Sheet with Captions: {output_filename}...")
    cell_w = 360
    cell_h = 640
    sheet = Image.new("RGBA", (cell_w * 3, cell_h * 3), (8, 12, 18, 255))

    for i in range(count):
        t = (i / (count - 1)) * DURATION
        frame = render_frame_pil(t, cell_w, cell_h)
        col = i % 3
        row = i // 3
        sheet.paste(frame, (col * cell_w, row * cell_h))

    sheet.save(output_filename)
    print(f"[+] Saved Contact Sheet: {output_filename}")

def render_mp4_video():
    print(f"[*] Rendering high-bitrate MP4 ({TOTAL_FRAMES} frames @ {FPS}fps) to {OUTPUT_VIDEO}...")
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

def package_render_folder(slug="drone_swarms_vs_air_defense", title="Autonomous Drone Swarms Vs Air Defense: The $400 Weapon Killing $7M Tanks"):
    """
    Creates an isolated, self-contained directory under renders/ for this specific video.
    Packages ONLY final successful renders.
    """
    # Strict validation: ONLY save final successful renders
    if not os.path.exists(OUTPUT_VIDEO) or os.path.getsize(OUTPUT_VIDEO) < 100 * 1024:
        print(f"[ABORT] Cannot package render: {OUTPUT_VIDEO} is missing or incomplete (<100KB). Only final successful renders are saved.")
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
    sheet_v3 = "preview_drone_contact_sheet.png"
    if os.path.exists(sheet_v3):
        dst_sheet = os.path.join(target_dir, "contact_sheet.png")
        shutil.copy2(sheet_v3, dst_sheet)
        files_manifest["contact_sheet"] = {
            "filename": "contact_sheet.png",
            "size_bytes": os.path.getsize(dst_sheet),
            "size_formatted": f"{os.path.getsize(dst_sheet) / 1024:.1f} KB"
        }

    # 4. Standalone Render Script
    this_script = os.path.abspath(__file__)
    dst_src = os.path.join(target_dir, "render_source.py")
    shutil.copy2(this_script, dst_src)
    files_manifest["render_source"] = {
        "filename": "render_source.py",
        "size_bytes": os.path.getsize(dst_src),
        "size_formatted": f"{os.path.getsize(dst_src) / 1024:.1f} KB"
    }

    # 5. Manifest JSON
    manifest_data = {
        "render_id": folder_name,
        "title": title,
        "slug": slug,
        "topic": "Autonomous Drone Swarms Vs Air Defense",
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
            "voice_name": "en-US-ChristopherNeural",
            "style": "Deep Tactical Tech Documentary",
            "rate_adjustment": "+18%",
            "file": "voiceover.mp3"
        },
        "scenes": SCENES_METADATA,
        "captions": CAPTIONS,
        "files": files_manifest
    }

    with open(os.path.join(target_dir, "project_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)

    with open(os.path.join(target_dir, "details.json"), "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)

    # 6. Formatted Markdown Report
    details_md_path = os.path.join(target_dir, "details.md")
    md_content = f"""# Video Render Package: {title}

**Render ID:** `{folder_name}`  
**Generated On:** {now.strftime("%B %d, %Y at %I:%M:%S %p")}  
**Core Topic:** Autonomous Drone Swarms Vs Air Defense  

---

## 📊 Technical Specifications
| Specification | Value |
|---|---|
| **Duration** | {DURATION}s ({TOTAL_FRAMES} frames @ {FPS} fps) |
| **Resolution** | {WIDTH}x{HEIGHT} (Vertical 9:16 Shorts / Reels) |
| **Video Codec** | H.264 / libx264 (CRF 18 broadcast quality) |
| **Audio Codec** | AAC 192 kbps (Neural TTS `en-US-ChristopherNeural` @ +18%) |
| **Visual Engine** | 100% Procedural Code (No Generative Video AI) |
| **Captions** | Safe-Zone Compliant (Y: 68% - 76%) with High-Contrast Glass Pill |

---

## 🎬 Scene Breakdown & Tactical Storyboard

"""
    for sc in SCENES_METADATA:
        md_content += f"""### Scene {sc['scene_id']}: {sc['name']} ({sc['start']}s – {sc['end']}s)
- **Visual Theme:** {sc['visual_theme']}
- **Voiceover Script:** *"{sc['audio_text']}"*
- **Active Captions:**
"""
        for cap in sc['captions']:
            md_content += f"  - `[{cap['start']}s - {cap['end']}s]` **[{cap['highlight']}]** {cap['text']}\n"
        md_content += "\n"

    md_content += """---

## 📦 Package Files Contained in this Folder
- `video.mp4`: Final master vertical short video (H.264 / AAC)
- `voiceover.mp3`: Isolated neural voiceover audio track
- `contact_sheet.png`: 9-frame evidence contact sheet with safe-zone captions
- `project_manifest.json`: Full machine-readable metadata and parameters
- `details.json`: Duplicate JSON specification
- `render_source.py`: Standalone reproducible Python generation script
- `details.md`: This comprehensive production document
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
    generate_contact_sheet("preview_drone_contact_sheet.png", count=9)
    success = render_mp4_video()
    if success:
        package_render_folder(
            slug="drone_swarms_vs_air_defense",
            title="Autonomous Drone Swarms Vs Air Defense: The $400 Weapon Killing $7M Tanks"
        )
    else:
        print("[ABORT] Render failed. No incomplete package created. ONLY final successful renders are saved.")
        sys.exit(1)
