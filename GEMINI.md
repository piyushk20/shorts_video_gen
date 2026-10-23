# OpusMotion Studio — Last Stable State (2026-10-23)

## Overview
- **App Name**: OpusMotion Studio (Code-Driven Procedural Short Video Generator)
- **Workspace**: `c:\Users\HP\shortvideogen1`
- **Port**: `8088` (serves both static assets and API backend)

## Launch Sequence
- **Server command**: `python studio_server.py`
  - Runs on `http://127.0.0.1:8088`
  - Serves:
    - Main Studio UI: `http://localhost:8088/` (`index.html`)
    - Dedicated Preview Tab: `http://localhost:8088/preview.html`
    - Health Endpoint: `http://localhost:8088/api/health`
    - Neural TTS Engine: `http://localhost:8088/api/tts` (POST JSON `{text, voice, rate}`)
    - Rendered Vault & Assets: `/renders/renders_manifest.json`, `.mp4`, `.png`

## Verified Working Endpoints & Features
1. **Health Check**: `GET /api/health` -> `{"status": "ok", "server": "OpusMotion Studio"}`
2. **Neural TTS Synthesis**: `POST /api/tts` with `edge_tts` and `ffprobe` duration calculation
3. **Stage 1 (Script & Storyboard)**: Dynamic presets (Drones, Fusion, Quantum, Neural, Market), scene list generation, script approval gate advancing directly to Stage 2: Match Images to Script.
4. **Stage 2 (Match Images to Script — Integrated Pipeline Gate)**:
   - Mandatory workflow step before audio and render: each scene beat is matched to high-definition 9:16 motion graphics assets.
   - ⚡ Auto-Match engine matching keywords in narration, tags, and motion direction across asset packages (Drones, Quantum, eMudhra, Fusion).
   - Gallery with real-time thumbnail previews, per-scene asset selector dropdowns, high-res viewer links, and scene jump triggers.
   - Dedicated approval gate ("Approve Images & Proceed to Voice-Over →") requiring verified asset alignment before Stage 3 unlocks.
5. **Stage 3 (Voice-Over & TTS)**: Real-time neural voice switching (Christopher, Guy, Sonia, Jenny), live audio playback, voice approval gate.
6. **Stage 4 (Procedural Render Engine)**:
   - 60 FPS HTML5 Canvas procedural animations & kinetic typography
   - Visual archetypes (8 styles): Opus Keynote, Cyber HUD / FUI, Swiss Kinetic, Celestial Flow, 80s Retro Synthwave, Geometric Bauhaus, Aurora Glassmorphism, Technical Blueprint
   - Cinematic Film FX Post-Passes: Procedural 35mm film grain, corner lens vignette, and CRT scanlines
   - Transport controls: Play / Pause, scrubbing, loop, speed (0.5x, 1x, 1.5x, 2x)
   - Aspect ratio modes: 9:16 Shorts (1080x1920 viewport), 16:9 Wide, 1:1 Square
   - Mobile safe-zone overlay guidelines
7. **Stage 5 (Social Outro & CTA — Persistent Credentials & Last Frame Card)**:
   - Default Platform: **X (Twitter)**, Channel Name: `Piyushk20`, Handle: `@Piyushk20`, Button: `Follow`.
   - Full persistence: stores settings in `localStorage` (`opusmotion_social_settings`), survives browser reloads, preset changes, and tab switches.
   - Real-time synchronization of Scene 5 voice narration to "Make sure to follow @Piyushk20 on X for more!".
   - Canvas procedural rendering of animated glassmorphic Outro Card on the final video frame with X logo avatar, channel name, blue verified badge (`✓`), handle `@Piyushk20`, and kinetic button (`🔔 FOLLOW @PIYUSHK20 ON X`).
   - "👁 Last Frame" trigger for instant preview on the viewport canvas.
8. **Render Archive Vault**: Dynamic modal loading rendered runs from `renders_manifest.json` with detailed specifications
9. **Dedicated Preview Tab**: `preview.html` running synchronized at 60 FPS with live WebSocket / BroadcastChannel sync
10. **Real-time Web Article URL Scraper & Director Script Engine**:
    - Backend Endpoint: `POST /api/analyze-url` (JSON `{url, handle}`)
    - Scrapes live web pages (e.g., Wikipedia, TechCrunch, blogs, news) using `requests` + `BeautifulSoup`
    - Synthesizes 5 director-grammar narrative beats automatically matched to imagery and configured with `@Piyushk20` outro CTA
    - Live audio synthesis: automatically triggers `/api/tts` in background for continuous timeline playback
11. **Storage Policy & Render Gate: ONLY Save Final Successful Renders**:
    - Script `cleanup_storage.py` and API endpoints `GET /api/storage/status`, `POST /api/storage/clean`:
      - Strict Render Gate: all render scripts (`render_final_video.py`, `render_drone_swarms.py`, `render_quantum_motion_video.py`, `render_emudhra_motion_video.py`) verify `proc.returncode == 0`, file existence, and size > 100KB before creating dedicated package folders or adding entries to `renders_manifest.json`.
      - Automatic Intermediate Cleanup: root-level temporary duplicate MP4s are pruned upon successful packaging, preventing disk bloat.
      - WebCodecs / MediaRecorder Gate (`app.js`): cancels and completely discards recorded chunks on modal abort or incomplete capture, ensuring partial/broken videos are never saved or downloaded.
      - Render Vault UI: displays "Storage Policy: ONLY Final Successful Renders Retained" badge and "🧹 Audit & Prune Storage" trigger.
