# OpusMotion Studio — Procedural Short Video Generator 🎬⚡

> **Pure Code-Driven Video Generation Engine** producing broadcast-ready short videos (8–45s) entirely through deterministic code, mathematical canvas rendering, neural text-to-speech, and automated director grammar.

---

## 🌟 Key Features

1. **5-Stage Guided Production Pipeline**:
   - **Stage 1 (Script & Storyboard)**: Topic analysis, preset loading (Drones, Quantum, Fusion, eMudhra), and 5-beat director grammar.
   - **Stage 2 (Match Images to Script)**: Integrated image-to-script alignment gate with auto-matching, thumbnail previews, per-scene asset selectors, and high-res inspection.
   - **Stage 3 (Voice-Over & TTS)**: Live neural text-to-speech voice switching (`edge-tts`) with real-time waveform sync.
   - **Stage 4 (Procedural Render Engine)**: 60 FPS HTML5 Canvas procedural animations & kinetic typography across 8 visual archetypes.
   - **Stage 5 (Social Outro & CTA)**: Glassmorphic outro cards, persistent creator credentials (`localStorage`), and dynamic voice CTA sync (defaulting to **X: @Piyushk20**).

2. **Visual Archetypes (8 Styles)**:
   - Cyberpunk HUD / FUI
   - Opus Dark Keynote
   - Swiss Kinetic
   - Celestial Flow
   - 80s Retro Synthwave
   - Geometric Bauhaus
   - Aurora Glassmorphism
   - Technical Blueprint & CAD

3. **Storage Policy & Render Gate**:
   - **Strict Render Gating**: Renders are validated for 100% completion, stream validity, and minimum size before dedicated packaging.
   - **Automated Pruning**: `cleanup_storage.py` and `/api/storage/clean` ensure **ONLY final successful renders** are retained, removing intermediate duplicate files and broken runs.
   - **In-Browser WebCodecs Gate**: Discards partial chunks on abort or modal cancellation.

4. **Multi-Format Viewports**:
   - `9:16` Vertical Shorts (1080x1920)
   - `16:9` Widescreen (1920x1080)
   - `1:1` Square (1080x1080)
   - Mobile safe-zone overlays and 9-frame contact sheet QA export.

---

## 🚀 Quick Start

### 1. Requirements
- Python 3.10+
- FFmpeg (for video multiplexing and contact sheet generation)
- Edge-TTS (`pip install edge-tts requests beautifulsoup4 pillow`)

### 2. Launch Studio Server
```bash
python studio_server.py
```
Open your browser to [http://localhost:8088](http://localhost:8088).

### 3. Dedicated Preview Tab
Open [http://localhost:8088/preview.html](http://localhost:8088/preview.html) for synchronized dual-monitor monitoring.

### 4. Storage Audit & Cleanup
```bash
python cleanup_storage.py --dry-run   # Preview verification
python cleanup_storage.py             # Enforce final successful renders only
```

---

## 📦 Directory Structure

```
shortvideogen1/
├── assets/                  # 9:16 high-definition motion graphics assets
│   ├── drones/
│   ├── emudhra/
│   ├── fusion/
│   └── quantum/
├── renders/                 # Dedicated final successful video packages
│   └── renders_manifest.json
├── app.js                   # Procedural animation, timeline, and studio logic
├── index.html               # Main OpusMotion Studio UI
├── styles.css               # Studio glassmorphism design system
├── preview.html             # Dedicated external synchronized preview tab
├── studio_server.py         # HTTP server, neural TTS API, and article scraper
├── cleanup_storage.py       # Render integrity & storage audit manager
└── render_*.py              # Headless procedural video renderers
```

---

## 🔒 Security & Privacy Notice
This repository contains no hardcoded API keys, secrets, or sensitive personal tokens. All TTS is generated locally or via public endpoints, and user credentials are saved locally in the browser's `localStorage`.
