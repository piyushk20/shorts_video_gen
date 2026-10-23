"""
OpusMotion TTS Bridge & Audio Generator
Uses edge-tts to produce studio-grade neural voice-overs directly from script text.
"""

import sys
import asyncio
import argparse
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("Error: edge-tts is not installed. Run: pip install edge-tts", file=sys.stderr)
    sys.exit(1)

DEFAULT_VOICE = "en-US-ChristopherNeural"

VOICE_CATALOG = {
    "christopher": "en-US-ChristopherNeural",   # Deep Authoritative Tech
    "guy": "en-US-GuyNeural",                   # Energetic Documentary
    "jenny": "en-US-JennyNeural",               # Warm Conversational
    "sonia": "en-GB-SoniaNeural",               # British Cinematic Specialist
    "aria": "en-US-AriaNeural"                  # Expressive Narrative
}

async def generate_speech(text: str, voice: str, rate: str, pitch: str, output_path: str):
    print(f"[*] Generating neural voiceover: Voice={voice}, Rate={rate}, Pitch={pitch}")
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await communicate.save(output_path)
    print(f"[+] Voiceover saved to: {output_path}")

async def list_neural_voices():
    voices = await edge_tts.list_voices()
    en_voices = [v for v in voices if v["Locale"].startswith("en-")]
    print(f"Found {len(en_voices)} English neural voices:")
    for v in en_voices[:10]:
        print(f"  - {v['ShortName']}: {v['Gender']} ({v['FriendlyName']})")

def main():
    parser = argparse.ArgumentParser(description="OpusMotion Neural TTS Generator")
    parser.add_argument("--text", type=str, help="Script text to synthesize")
    parser.add_argument("--voice", type=str, default=DEFAULT_VOICE, help="Neural voice name")
    parser.add_argument("--rate", type=str, default="+0%", help="Speech rate (e.g. +5 percent, -10 percent)")
    parser.add_argument("--pitch", type=str, default="+0Hz", help="Speech pitch shift (e.g. +2Hz, -3Hz)")
    parser.add_argument("--output", type=str, default="voiceover.mp3", help="Target output audio file path")
    parser.add_argument("--list-voices", action="store_true", help="List available English neural voices")

    args = parser.parse_args()

    if args.list_voices:
        asyncio.run(list_neural_voices())
        return

    if not args.text:
        sample_text = (
            "Every password on Earth relies on one mathematical assumption: "
            "primes are impossible to factor quickly. Enter Shor's Algorithm. "
            "While a classical supercomputer takes billions of years, a quantum processor factors keys in minutes. "
            "Upgrade your protocols before Q-Day arrives. Subscribe to OpusMotion for the frontier."
        )
        print("[*] No text provided, running with sample procedural script...")
        text = sample_text
    else:
        text = args.text

    selected_voice = VOICE_CATALOG.get(args.voice.lower(), args.voice)
    asyncio.run(generate_speech(text, selected_voice, args.rate, args.pitch, args.output))

if __name__ == "__main__":
    main()
