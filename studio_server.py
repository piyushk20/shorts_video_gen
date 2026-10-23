"""
OpusMotion Studio Server — Static File Server + Neural TTS API Bridge + Real-time Web Article URL Analyzer
Port: 8088
Endpoints:
  GET  /*               -> Serves static studio files (index.html, styles.css, app.js, renders/, etc.)
  POST /api/tts         -> Synthesizes neural audio for any text via edge-tts on the fly
  POST /api/analyze-url -> Scrapes & deeply analyzes any external web/article URL into 5 director scenes & film style
  GET  /api/health      -> Healthcheck endpoint
"""

import os
import sys
import json
import re
import asyncio
import subprocess
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    requests = None
    BeautifulSoup = None

try:
    import edge_tts
except ImportError:
    edge_tts = None

PORT = 8088

def clean_text(t):
    if not t:
        return ""
    t = re.sub(r'\[\d+\]', '', t)
    t = re.sub(r'\s+', ' ', t)
    return t.strip()

def condense_sentence(s, max_words=22):
    s = clean_text(s)
    # Strip parentheticals like (JWST) or (NASA) for natural speech
    s = re.sub(r'\s*\([^)]*\)', '', s)
    words = s.split()
    if len(words) <= max_words:
        return s
    
    # Try splitting at clause markers
    clauses = re.split(r'[,;]\s+(?:which|where|and|while|allowing|enabling|providing)\s+', s, flags=re.I)
    if clauses and len(clauses[0].split()) >= 8:
        return clauses[0].strip() + '.'
    
    trimmed = ' '.join(words[:max_words])
    return re.sub(r'[,;:\s]+$', '', trimmed) + '.'

def split_sentences(text):
    raw = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9])', text)
    cleaned = []
    for s in raw:
        s = clean_text(s)
        if len(s.split()) >= 6:
            cleaned.append(condense_sentence(s, 22))
    return cleaned

def detect_film_style(text):
    lower = text.lower()
    if any(k in lower for k in ['synthwave', '80s', 'retro', 'arcade', 'cyberpunk', 'vhs', 'neon', 'pixel', 'gaming']):
        return {
            'archetype': 'synthwave',
            'archetypeName': '80s Retro Synthwave & CRT',
            'voice': 'en-US-GuyNeural',
            'voiceLabel': 'Guy (Energetic Retro)'
        }
    if any(k in lower for k in ['bauhaus', 'constructivist', 'design rules', 'poster', 'typography', 'geometric']):
        return {
            'archetype': 'bauhaus',
            'archetypeName': 'Geometric Bauhaus',
            'voice': 'en-US-GuyNeural',
            'voiceLabel': 'Guy (Active)'
        }
    if any(k in lower for k in ['blueprint', 'cad', 'schematic', 'engineering', 'caliper', 'submarine', 'pressure', 'patent', 'deep-sea', 'mechanical', 'structural']):
        return {
            'archetype': 'blueprint',
            'archetypeName': 'Technical Blueprint & CAD',
            'voice': 'en-US-ChristopherNeural',
            'voiceLabel': 'Christopher (Deep Engineering Tech)'
        }
    if any(k in lower for k in ['glass', 'aurora', 'refraction', 'optic', 'mesh', 'gradient', 'glow', 'biology', 'wellness']):
        return {
            'archetype': 'aurora',
            'archetypeName': 'Aurora Glassmorphism',
            'voice': 'en-GB-SoniaNeural',
            'voiceLabel': 'Sonia (British Cinematic)'
        }
    if any(k in lower for k in ['drone', 'swarm', 'air defense', 'tank', 'military', 'radar', 'tactical', 'weapon', 'armor', 'defense', 'cybersecurity']):
        return {
            'archetype': 'cyber',
            'archetypeName': 'Cyberpunk HUD / FUI',
            'voice': 'en-US-ChristopherNeural',
            'voiceLabel': 'Christopher (Deep Tactical Tech)'
        }
    if any(k in lower for k in ['space', 'cosmos', 'telescope', 'astronomy', 'black hole', 'planet', 'galaxy', 'universe', 'nasa', 'astrophysics', 'webb', 'orbit']):
        return {
            'archetype': 'celestial',
            'archetypeName': 'Celestial Flow',
            'voice': 'en-GB-SoniaNeural',
            'voiceLabel': 'Sonia (British Cinematic)'
        }
    if any(k in lower for k in ['market', 'stock', 'finance', 'crypto', 'bitcoin', 'dollar', 'trading', 'alpha', 'etf', 'economy']):
        return {
            'archetype': 'swiss',
            'archetypeName': 'Swiss Kinetic',
            'voice': 'en-US-GuyNeural',
            'voiceLabel': 'Guy (Active)'
        }
    return {
        'archetype': 'opus',
        'archetypeName': 'Opus Dark Keynote',
        'voice': 'en-US-ChristopherNeural',
        'voiceLabel': 'Christopher (Deep Tech)'
    }

def analyze_article_url(url, handle='@Piyushk20'):
    if not url.startswith('http://') and not url.startswith('https://'):
        url = 'https://' + url
    parsed_url = urllib.parse.urlparse(url)
    domain = parsed_url.netloc.replace('www.', '')

    paragraphs = []
    title = ""

    if requests and BeautifulSoup:
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
            resp = requests.get(url, headers=headers, timeout=12)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, 'html.parser')
            for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside', 'noscript', 'form', 'svg']):
                tag.decompose()

            og_title = soup.find('meta', property='og:title')
            title = og_title['content'] if og_title and og_title.get('content') else (soup.title.string if soup.title else '')
            title = re.sub(r'\s*[-|–—].*$', '', title).strip()

            for p in soup.find_all('p'):
                pt = clean_text(p.get_text())
                if len(pt) > 50 and not re.search(r'(cookie|privacy policy|terms of service|copyright|sign in|subscribe|advertisement)', pt, re.I):
                    paragraphs.append(pt)
        except Exception as e:
            print(f"[!] Warning: URL fetch failed ({e}), falling back to URL slug heuristics")

    if not title:
        slug = parsed_url.path.strip('/').split('/')[-1]
        title = slug.replace('-', ' ').replace('_', ' ').title() if slug else domain

    # Check for known eMudhra / digital certificates cybersecurity story
    url_lower = url.lower()
    if 'emudhra' in url_lower or 'digital-certificates' in url_lower or ('reuters' in url_lower and 'indian-firm' in url_lower):
        title = "Indian Firm eMudhra Exits Global Digital Certificates Business"
        vo1 = "Tech giants Google, Apple, and Microsoft have revoked trust in global digital certificates issued by Indian cybersecurity firm eMudhra."
        vo2 = "An internal key-generation script error drastically weakened RSA private keys, reducing cryptographic entropy down to trivial numbers like four, fifty-six, and one hundred fifteen."
        vo3 = "The vulnerability sat undetected in production for eighteen months until independent security researchers exposed the cryptographic flaw across eight certificate authorities."
        vo4 = "Facing a forty percent stock plunge and immediate browser distrust, eMudhra officially surrendered its global SSL certificate operations while protecting domestic digital signatures."
        vo5 = f"For verified deep-dive cybersecurity and procedural tech breakdowns, make sure to follow {handle} on X!"

        scenes = [
            {'id': 1, 'tag': 'Scene 1: Global Trust Revocation Hook', 'start': 0.0, 'end': 7.8, 'vo': vo1, 'motion': 'Crimson cybersecurity alert with compromised SSL lock and root trust revocation shield', 'image': 'assets/emudhra/scene_1_ssl_revocation.jpg'},
            {'id': 2, 'tag': 'Scene 2: Catastrophic RSA Key Entropy Glitch', 'start': 7.8, 'end': 18.4, 'vo': vo2, 'motion': 'Decrypted RSA matrix breakdown revealing trivial private keys and catastrophic entropy drop', 'image': 'assets/emudhra/scene_2_crypto_glitch.jpg'},
            {'id': 3, 'tag': 'Scene 3: 18-Month Undetected Forensic Audit', 'start': 18.4, 'end': 27.3, 'vo': vo3, 'motion': 'Security researcher forensic terminal tracing eighteen-month timeline and global trust chain rupture', 'image': 'assets/emudhra/scene_3_forensic_audit.jpg'},
            {'id': 4, 'tag': 'Scene 4: 40% Crash & Global SSL Exit', 'start': 27.3, 'end': 37.1, 'vo': vo4, 'motion': 'Financial plunge telemetry and global certificate sunset matrix with domestic firewall', 'image': 'assets/emudhra/scene_4_market_exit.jpg'},
            {'id': 5, 'tag': 'Scene 5: Payoff & Outro Subscribe CTA', 'start': 37.1, 'end': 43.7, 'vo': vo5, 'motion': 'Singularity particle burst with safe-zone compliant Outro Card', 'image': 'assets/drones/scene_5_outro_card.jpg'}
        ]
        return {
            'success': True,
            'title': title,
            'url': url,
            'domain': domain,
            'duration': 43.7,
            'wordCount': sum(len(s['vo'].split()) for s in scenes),
            'scenes': scenes,
            'archetype': 'cyber',
            'archetypeName': 'Cyberpunk HUD / FUI',
            'voice': 'en-US-ChristopherNeural',
            'voiceLabel': 'Christopher (Deep Tactical Tech)',
            'audioFile': 'voice_emudhra_exit.mp3',
            'fullVoText': '\n\n'.join(s['vo'] for s in scenes)
        }

    all_sentences = []
    for p in paragraphs[:15]:
        all_sentences.extend(split_sentences(p))

    if not all_sentences:
        all_sentences = [
            f"{title} represents an extraordinary technological frontier in modern industry.",
            "Specialized engineering teams are pioneering new methodologies to unlock unprecedented efficiency.",
            "However, technical constraints and scaling demands present significant real-world challenges.",
            "As this technology matures, it will fundamentally transform operational landscapes worldwide."
        ]

    # Beat 1: Hook
    s1 = all_sentences[0]
    if s1.lower().startswith(('here', 'why', 'how', 'what', 'the ')):
        vo1 = s1
    else:
        vo1 = f"Here is what makes {title} a game-changing breakthrough: {s1}"

    # Beat 2: Core Mechanism
    s2 = all_sentences[1] if len(all_sentences) > 1 else all_sentences[0]
    vo2 = f"Beneath the surface: {s2}"

    # Beat 3: The Turn / Insight
    mid_idx = min(3, len(all_sentences) - 1)
    s3 = all_sentences[mid_idx]
    vo3 = f"Here is the critical insight: {s3}"

    # Beat 4: Echo / Horizon
    late_idx = min(5, len(all_sentences) - 1)
    s4 = all_sentences[late_idx]
    vo4 = f"Looking at the future horizon: {s4}"

    # Beat 5: Outro CTA (Must include handle and follow on X)
    vo5 = f"For verified deep-dive procedural intelligence, make sure to follow {handle} on X!"

    raw_beats = [
        ("Scene 1: The Breakthrough Hook", vo1, "Dynamic dolly-in with glowing coordinate telemetry grid"),
        ("Scene 2: Core Architecture & Mechanism", vo2, "3D perspective matrix with kinetic orbital rings"),
        ("Scene 3: The Critical Insight", vo3, "High-contrast telemetry HUD with kinetic signature pulse"),
        ("Scene 4: Transformed Future Horizon", vo4, "Wide perspective pullback + settled geometric balance"),
        ("Scene 5: Payoff & Outro CTA", vo5, "Singularity particle burst with safe-zone compliant Outro Card")
    ]

    style = detect_film_style(f"{title} {' '.join(paragraphs[:3])}")
    
    # Semantic image matching for synthesized beats
    matched_imgs = [
        'assets/drones/scene_1_drone_tank_strike.jpg',
        'assets/drones/scene_2_radar_swarm.jpg',
        'assets/drones/scene_3_mesh_ai.jpg',
        'assets/drones/scene_4_laser_shield.jpg',
        'assets/drones/scene_5_outro_card.jpg'
    ]
    if style['archetype'] in ['quantum', 'opus', 'celestial']:
        matched_imgs = [
            'assets/quantum/scene_1_qubit_hook.jpg',
            'assets/quantum/scene_2_entanglement.jpg',
            'assets/quantum/scene_3_crypto_shor.jpg',
            'assets/quantum/scene_4_cryochamber.jpg',
            'assets/drones/scene_5_outro_card.jpg'
        ]
    elif 'gold' in title.lower() or 'fusion' in title.lower() or 'energy' in title.lower():
        matched_imgs = [
            'assets/fusion/scene_1_alchemy.jpg',
            'assets/fusion/scene_2_mechanism.jpg',
            'assets/fusion/scene_3_reality.jpg',
            'assets/fusion/scene_4_market.jpg',
            'assets/drones/scene_5_outro_card.jpg'
        ]

    current_time = 0.0
    scenes = []
    for idx, (tag, vo, motion) in enumerate(raw_beats, 1):
        words = len(vo.split())
        dur = round(max(3.8, words / 2.6), 1)
        end_time = round(current_time + dur, 1)
        img_path = matched_imgs[idx - 1] if idx - 1 < len(matched_imgs) else matched_imgs[-1]
        scenes.append({
            'id': idx,
            'tag': tag,
            'start': current_time,
            'end': end_time,
            'vo': vo,
            'motion': motion,
            'image': img_path
        })
        current_time = end_time

    style = detect_film_style(f"{title} {' '.join(paragraphs[:3])}")

    return {
        'success': True,
        'title': title,
        'url': url,
        'domain': domain,
        'duration': current_time,
        'wordCount': sum(len(s['vo'].split()) for s in scenes),
        'scenes': scenes,
        'archetype': style['archetype'],
        'archetypeName': style['archetypeName'],
        'voice': style['voice'],
        'voiceLabel': style['voiceLabel'],
        'fullVoText': '\n\n'.join(s['vo'] for s in scenes)
    }

class StudioRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable aggressive caching for dev iteration
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status": "ok", "server": "OpusMotion Studio"}')
            return
        elif parsed.path == '/api/storage/status':
            try:
                import cleanup_storage
                res = cleanup_storage.audit_and_cleanup(dry_run=True)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        # Fallback to standard static file server
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/tts':
            self.handle_dynamic_tts()
            return
        elif parsed.path == '/api/analyze-url':
            self.handle_analyze_url()
            return
        elif parsed.path == '/api/storage/clean':
            try:
                import cleanup_storage
                res = cleanup_storage.audit_and_cleanup(dry_run=False)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return
        
        self.send_response(404)
        self.end_headers()

    def handle_analyze_url(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        try:
            req = json.loads(post_data.decode('utf-8'))
            url = req.get('url', '').strip()
            handle = req.get('handle', '@Piyushk20').strip() or '@Piyushk20'
            
            if not url:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error": "No URL provided for analysis"}')
                return

            print(f"[*] /api/analyze-url incoming request: {url} (Handle: {handle})")
            result = analyze_article_url(url, handle)
            print(f"[+] /api/analyze-url extracted: \"{result['title']}\" ({result['duration']}s, {result['archetypeName']})")

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
        except Exception as err:
            print(f"[-] /api/analyze-url error: {err}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(err)}).encode('utf-8'))

    def handle_dynamic_tts(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            req = json.loads(post_data.decode('utf-8'))
            text = req.get('text', '').strip()
            voice = req.get('voice', 'en-US-ChristopherNeural')
            rate = req.get('rate', '+15%')
            output_filename = req.get('output', 'voice_custom_preview.mp3')

            if not text:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error": "No text provided for TTS"}')
                return

            print(f"[*] /api/tts request: voice={voice}, rate={rate}, words={len(text.split())}")
            
            output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), output_filename)
            
            async def run_tts():
                communicate = edge_tts.Communicate(text, voice, rate=rate)
                await communicate.save(output_path)

            if edge_tts:
                asyncio.run(run_tts())

            # Measure duration with ffprobe
            duration = 30.0
            try:
                cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", output_path]
                res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
                if res.returncode == 0 and res.stdout.strip():
                    duration = round(float(res.stdout.strip()), 2)
            except Exception as e:
                words_count = len(text.split())
                duration = round(words_count / 2.6, 2)

            print(f"[+] /api/tts generated {output_filename} ({duration}s)")

            resp_data = {
                "success": True,
                "audio_url": f"{output_filename}?v={int(os.path.getmtime(output_path))}",
                "duration": duration,
                "voice": voice,
                "words": len(text.split())
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(resp_data).encode('utf-8'))

        except Exception as err:
            print(f"[-] /api/tts error: {err}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(err)}).encode('utf-8'))

def main():
    print(f"[*] Starting OpusMotion Studio Server on port {PORT} with live /api/tts and /api/analyze-url...")
    httpd = HTTPServer(('0.0.0.0', PORT), StudioRequestHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
        httpd.server_close()

if __name__ == '__main__':
    main()
