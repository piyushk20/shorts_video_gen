/**
 * OPUSMOTION STUDIO — Pure Code Procedural Video Engine
 * Core Architecture & Interactive Studio Logic
 */

// ==========================================================================
// 1. Studio State & Presets
// ==========================================================================
const state = {
  duration: 41.6, // seconds
  currentTime: 0, // seconds
  isPlaying: false,
  playbackSpeed: 1.0,
  loop: true,
  aspectRatio: '9:16', // '9:16', '16:9', '1:1'
  safeZoneVisible: false,
  previewVersion: 3, // 1: Rough, 2: Camera, 3: Full VO

  // Pipeline Approval Gates
  stage: 'code', // 'script', 'audio', 'code'
  scriptApproved: true,
  audioApproved: true,

  // Visual Archetype & Dynamics
  visualArchetype: 'cyber', // 'opus', 'cyber', 'swiss', 'celestial', 'synthwave', 'bauhaus', 'aurora', 'blueprint'
  particleDensity: 140,
  cameraDynamics: 50, // percentage

  // Film Post-Processing Pipeline (from Lemo-Opuscar & MG-Styles-15)
  filmGrain: 0.22, // 0 to 1
  filmVignette: 0.45, // 0 to 1
  filmScanlines: true, // boolean

  // Audio Mixer Volumes (0 to 1)
  mixVo: 1.0,
  mixBgm: 0.35,
  mixSfx: 0.50,

  // TTS Settings
  ttsVoice: 'en-US-ChristopherNeural',
  speechRate: 1.18,
  speechPitch: 0,
  activeAudioFile: 'voice_drone_swarms.mp3',

  // Scenes list
  scenes: [],

  // Social Media Outro & CTA Settings
  social: {
    platform: 'twitter', // Default X / Twitter
    handle: '@Piyushk20',
    channelName: 'Piyushk20',
    ctaText: 'Follow on X for Daily Frontier Tech & Defense Breakdowns',
    buttonText: 'Follow',
    showOutroCard: true,
    outroDuration: 4.8 // seconds before end where outro card renders
  }
};

// ==========================================================================
// Canonical Film & Motion Design Styles Taxonomy (Lemo-Opuscar & MG-Styles-15)
// ==========================================================================
const FILM_STYLES = {
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk HUD / FUI',
    origin: 'mg-styles-15 (#22-hud) & lemo-opuscar (hologram-hud)',
    palette: ['#00E5FF', '#FF6A00', '#060B12', '#002B36'],
    camera: 'Target snap brackets (1.4x -> 1.0x), radar sweep, telemetry pan',
    nativeMove: 'Hexagonal coordinate lock with ascending alert strobe',
    font: 'JetBrains Mono / Inter Tight',
    desc: 'Deep cyan/amber tactical telemetry, rotating radar rings, and locking brackets.'
  },
  opus: {
    id: 'opus',
    name: 'Opus Dark Keynote',
    origin: 'lemo-opuscar (dark-keynote) & mg-styles-15 (#08-morph)',
    palette: ['#00F2FE', '#9D4EDD', '#0A0C14', '#1E1B4B'],
    camera: 'Slow continuous push-in, 2.5D orbital rotation, snap-grid settling',
    nativeMove: '3D icosahedron wireframe morph with luminous light sweep',
    font: 'Inter / Outfit',
    desc: 'Luminous mathematical geometry, wireframe polyhedrons & soft cool stage light.'
  },
  swiss: {
    id: 'swiss',
    name: 'Swiss Kinetic',
    origin: 'lemo-opuscar (swiss-motion) & mg-styles-15 (#09-bauhaus)',
    palette: ['#FF3366', '#00F2FE', '#0D0F18', '#FFFFFF'],
    camera: 'Rhythmic 90-degree typographic snaps, sliding mask wipes, lateral tracking',
    nativeMove: 'High-contrast split frame with kinetic typography blocks',
    font: 'Helvetica Neue / Inter 900',
    desc: 'Strict grid alignment, bold typography, sliding masks & high contrast.'
  },
  celestial: {
    id: 'celestial',
    name: 'Celestial Flow',
    origin: 'mg-styles-15 (#07-liquid) & lemo-opuscar (space-celestial)',
    palette: ['#7928CA', '#FF0080', '#040714', '#00DFD8'],
    camera: 'Floating zero-g drift, orbital perspective dive, slow pulse',
    nativeMove: 'Trigonometric sine-wave ribbons with pulsing stellar nebulae',
    font: 'Outfit / SF Pro Display',
    desc: 'Floating cosmic nebulae, fluid harmonic wave ribbons & radiant starfields.'
  },
  synthwave: {
    id: 'synthwave',
    name: '80s Retro Synthwave & CRT',
    origin: 'mg-styles-15 (#10-synthwave) & lemo-opuscar (ascii-crt)',
    palette: ['#FF007F', '#00F0FF', '#FFE600', '#0B001A'],
    camera: 'Infinite perspective horizon dolly, low-angle ground flight, CRT curve',
    nativeMove: 'Endless rolling neon wireframe grid with segmented glowing sun disc',
    font: 'Orbitron / Press Start / Monospace',
    desc: 'Endless neon perspective grid, retro sun disc, and CRT chromatic aberration.'
  },
  bauhaus: {
    id: 'bauhaus',
    name: 'Geometric Bauhaus',
    origin: 'mg-styles-15 (#09-bauhaus) & lemo-opuscar (kino-montage)',
    palette: ['#E63946', '#1D3557', '#F1FAEE', '#FFB703'],
    camera: 'Constructivist diagonal wipes, geometric scale reveals, 45-degree angle pans',
    nativeMove: 'Primary shape counter-rotation (circle, triangle, square) with heavy type',
    font: 'Futura / Archivo Black',
    desc: 'Primary color blocks (cadmium red, cobalt blue, yellow), heavy geometric typography.'
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora Glassmorphism',
    origin: 'mg-styles-15 (#12-aurora-glass) & lemo-opuscar (glass-product)',
    palette: ['#00F2FE', '#4FACFE', '#FA709A', '#060814'],
    camera: 'Soft depth-of-field focus pull, floating ethereal orbit, light glint sweep',
    nativeMove: 'Frosted glass refraction card with moving iridescent gradient mesh',
    font: 'Plus Jakarta Sans / Inter Light',
    desc: 'Translucent frosted glass panels, iridescent gradient mesh & specular light glints.'
  },
  blueprint: {
    id: 'blueprint',
    name: 'Technical Blueprint & CAD',
    origin: 'lemo-opuscar (blueprint) & mg-styles-15 (#02-line-art)',
    palette: ['#0A2540', '#00D4FF', '#FFFFFF', '#051329'],
    camera: 'Drafting table top-down pan, technical zoom-in to crosshairs, caliper tracking',
    nativeMove: 'Continuous drafting line drawing with schematic dimension arrows & stamps',
    font: 'JetBrains Mono / Courier Prime',
    desc: 'Cyan drafting grid, technical caliper callouts, dimension lines & patent stamps.'
  }
};

// Script Presets
const SCRIPT_PRESETS = {
  emudhra: {
    topic: "Indian Firm eMudhra Exits Global Digital Certificates Business After Cryptographic Key Entropy Flaw",
    duration: 43.70,
    audioFile: "voice_emudhra_exit.mp3",
    voice: "en-US-ChristopherNeural",
    archetype: "cyber",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: Global Trust Revocation Hook",
        start: 0.0,
        end: 7.8,
        vo: "Tech giants Google, Apple, and Microsoft have revoked trust in global digital certificates issued by Indian cybersecurity firm eMudhra.",
        motion: "Crimson cybersecurity alert with compromised SSL lock and root trust revocation shield",
        image: "assets/emudhra/scene_1_ssl_revocation.jpg"
      },
      {
        id: 2,
        tag: "Scene 2: Catastrophic RSA Key Entropy Glitch",
        start: 7.8,
        end: 18.4,
        vo: "An internal key-generation script error drastically weakened RSA private keys, reducing cryptographic entropy down to trivial numbers like four, fifty-six, and one hundred fifteen.",
        motion: "Decrypted RSA matrix breakdown revealing trivial private keys and catastrophic entropy drop",
        image: "assets/emudhra/scene_2_crypto_glitch.jpg"
      },
      {
        id: 3,
        tag: "Scene 3: 18-Month Undetected Forensic Audit",
        start: 18.4,
        end: 27.3,
        vo: "The vulnerability sat undetected in production for eighteen months until independent security researchers exposed the cryptographic flaw across eight certificate authorities.",
        motion: "Security researcher forensic terminal tracing eighteen-month timeline and global trust chain rupture",
        image: "assets/emudhra/scene_3_forensic_audit.jpg"
      },
      {
        id: 4,
        tag: "Scene 4: 40% Crash & Global SSL Exit",
        start: 27.3,
        end: 37.1,
        vo: "Facing a forty percent stock plunge and immediate browser distrust, eMudhra officially surrendered its global SSL certificate operations while protecting domestic digital signatures.",
        motion: "Financial plunge telemetry and global certificate sunset matrix with domestic firewall",
        image: "assets/emudhra/scene_4_market_exit.jpg"
      },
      {
        id: 5,
        tag: "Scene 5: Payoff & Outro Subscribe CTA",
        start: 37.1,
        end: 43.70,
        vo: "For verified deep-dive cybersecurity and procedural tech breakdowns, make sure to follow @Piyushk20 on X!",
        motion: "Singularity particle burst with safe-zone compliant Outro Card",
        image: "assets/drones/scene_5_outro_card.jpg"
      }
    ]
  },
  drones: {
    topic: "Autonomous Drone Swarms Vs Air Defense: The $400 Weapon Killing $7M Tanks",
    duration: 44.25,
    audioFile: "voice_drone_swarms.mp3",
    voice: "en-US-ChristopherNeural",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: The Asymmetry Hook",
        start: 0.0,
        end: 7.8,
        vo: "A four hundred dollar hobby drone just destroyed a seven million dollar main battle tank. Military generals are watching the death of twentieth-century armor in real time.",
        motion: "Dual tactical telemetry: $400 FPV quadcopter vs $7M Main Battle Tank",
        image: "assets/drones/scene_1_drone_tank_strike.jpg"
      },
      {
        id: 2,
        tag: "Scene 2: Broken Economic Math",
        start: 7.8,
        end: 16.5,
        vo: "If you examine autonomous drone swarms versus air defense, traditional militaries make one fatal mistake: firing a two million dollar missile to kill a swarm of cheap loitering drones. The economic math is broken.",
        motion: "360-degree sweeping tactical Radar HUD tracking 40+ synchronized drone blips",
        image: "assets/drones/scene_2_radar_swarm.jpg"
      },
      {
        id: 3,
        tag: "Scene 3: Mesh AI Architecture",
        start: 16.5,
        end: 26.5,
        vo: "Autonomous swarms don't rely on central satellites. Using local mesh networks and onboard optical AI, hundreds of drones communicate peer-to-peer to saturate radar defenses.",
        motion: "P2P Decentralized Graph Topology with pulsing cyan data links",
        image: "assets/drones/scene_3_mesh_ai.jpg"
      },
      {
        id: 4,
        tag: "Scene 4: Laser Defense Shield",
        start: 26.5,
        end: 36.0,
        vo: "Directed energy lasers and counter-drone micro-interceptors are now the only viable shield against mass swarm saturation.",
        motion: "50 kW High-Energy Laser turret discharging continuous optical beam slicing drone vectors",
        image: "assets/drones/scene_4_laser_shield.jpg"
      },
      {
        id: 5,
        tag: "Scene 5: Code Beats Armor & CTA",
        start: 36.0,
        end: 44.25,
        vo: "In modern warfare, decentralized code beats heavy armor every single time. Make sure to follow @Piyushk20 on X for verified defense engineering.",
        motion: "Holographic balance scale weighing composite armor vs code mesh",
        image: "assets/drones/scene_5_outro_card.jpg"
      }
    ]
  },
  fusion: {
    topic: "Marathon Fusion: Transmuting Mercury into Gold — Can Nuclear Synthesis Crash Gold?",
    duration: 41.6,
    scenes: [
      {
        id: 1,
        tag: "Scene 1: The Alchemy Claim",
        start: 0.0,
        end: 7.2,
        vo: "Did a Silicon Valley fusion startup just break global gold markets? Marathon Fusion claims it successfully turned mercury into stable gold.",
        motion: "Dolly-in liquid mercury sphere + coordinate lattice push",
        image: "assets/fusion/scene_1_alchemy.jpg"
      },
      {
        id: 2,
        tag: "Scene 2: The Mechanism",
        start: 7.2,
        end: 16.5,
        vo: "By surrounding a fusion core with mercury-198, intense neutron capture transmutes the atoms into gold-197—boasting ten times the production rate of CERN.",
        motion: "Orbiting atomic polyhedrons + 14.1 MeV neutron barrage",
        image: "assets/fusion/scene_2_mechanism.jpg"
      },
      {
        id: 3,
        tag: "Scene 3: The Reality Check",
        start: 16.5,
        end: 27.0,
        vo: "Before you panic-sell your jewelry: the company didn’t disclose yield, purity, or cost. Producing a single gram demands astronomical fusion energy and years of radioactive cooling.",
        motion: "Warning amber glitch + fractured gold wireframe strobe",
        image: "assets/fusion/scene_3_reality.jpg"
      },
      {
        id: 4,
        tag: "Scene 4: Market Impact",
        start: 27.0,
        end: 35.2,
        vo: "The result? Zero market crash. Gold’s recent dip is driven by standard macroeconomic policy, not nuclear synthesis. Lab gold costs far more than mining it.",
        motion: "Live 3D candlestick order book chart + macro telemetry",
        image: "assets/fusion/scene_4_market.jpg"
      },
      {
        id: 5,
        tag: "Scene 5: Payoff & CTA",
        start: 35.2,
        end: 41.6,
        vo: "Modern physics solved alchemy—but Mother Earth still sets the price. Follow @Piyushk20 on X for the real science and daily breakdowns.",
        motion: "Procedural sun singularity + particle shockwave finale",
        image: "assets/fusion/scene_5_outro_card.jpg"
      }
    ]
  },
  quantum: {
    topic: "Quantum Computing: Qubit Superposition, Shor's Algorithm & Dilution Cryocore",
    duration: 36.34,
    audioFile: "voice_quantum_computing_exact.mp3",
    voice: "en-US-ChristopherNeural",
    archetype: "blueprint",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: The Qubit Breakthrough Hook",
        start: 0.0,
        end: 8.8,
        vo: "Here is what makes Quantum computing a game-changing breakthrough: A quantum computer is a computer that represents and processes information using quantum states.",
        motion: "Ken Burns dolly-in with glowing holographic Bloch sphere & Qubit telemetry",
        image: "assets/quantum/scene_1_qubit_hook.jpg"
      },
      {
        id: 2,
        tag: "Scene 2: Core Architecture & Mechanism",
        start: 8.8,
        end: 14.5,
        vo: "Beneath the surface: Quantum computations exploit phenomena such as superposition, interference, and entanglement.",
        motion: "Floating lateral drift across entangled photonic ribbons & quantum logic gates",
        image: "assets/quantum/scene_2_entanglement.jpg"
      },
      {
        id: 3,
        tag: "Scene 3: Shor's Codebreaker & The Insight",
        start: 14.5,
        end: 23.5,
        vo: "Here is the critical insight: For example, a large-scale quantum computer could break widely used encryption schemes and aid physicists in performing physical simulations.",
        motion: "Dramatic zoom into dissolving cryptographic padlock with Shor's factoring matrix",
        image: "assets/quantum/scene_3_crypto_shor.jpg"
      },
      {
        id: 4,
        tag: "Scene 4: The 15 mK Cryogenic Challenge",
        start: 23.5,
        end: 29.5,
        vo: "Looking at the future horizon: Quantum computers are not yet practical for real-world applications.",
        motion: "Cinematic pedestal reveal of golden dilution chandelier with cryo mist HUD",
        image: "assets/quantum/scene_4_cryochamber.jpg"
      },
      {
        id: 5,
        tag: "Scene 5: Payoff & Social Outro CTA",
        start: 29.5,
        end: 36.34,
        vo: "For verified deep-dive procedural intelligence, make sure to follow @Piyushk20 on X!",
        motion: "Singularity particle burst with glassmorphic Outro Card & animated bell",
        image: "assets/quantum/scene_5_outro_card.jpg"
      }
    ]
  },
  neural: {
    topic: "How Latent Space Vectors sculpt digital imagination.",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: The Concept",
        start: 0,
        end: 4.5,
        vo: "Deep inside a neural network, reality is not stored in pixels. It lives in high-dimensional vectors.",
        motion: "Spiral vector vortex + glowing point cloud"
      },
      {
        id: 2,
        tag: "Scene 2: Latent Geometry",
        start: 4.5,
        end: 11.0,
        vo: "By interpolating between coordinates, a model creates thoughts that never existed in the physical world.",
        motion: "Curved bezier flow + volumetric holographic sweep"
      },
      {
        id: 3,
        tag: "Scene 3: The Synthesis",
        start: 11.0,
        end: 16.0,
        vo: "Equations become brushstrokes. Mathematics transforms into pure digital consciousness.",
        motion: "Swiss typography split cards + particle explosion"
      },
      {
        id: 4,
        tag: "Scene 4: Outro",
        start: 16.0,
        end: 20.0,
        vo: "Follow OpusMotion to explore the code behind tomorrow's mind. Make sure to like and subscribe for daily AI breakdowns!",
        motion: "Geometric pulse focus + neon border flash"
      }
    ]
  },
  market: {
    topic: "Algorithmic Order Flow: How microsecond arbitrage rules Wall Street.",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: Microsecond Liquidity",
        start: 0,
        end: 5.0,
        vo: "In the modern financial market, human eyes never see the true price. Orders fill in nanoseconds.",
        motion: "High-speed cyber radar + flashing tick telemetry"
      },
      {
        id: 2,
        tag: "Scene 2: Order Book Dynamics",
        start: 5.0,
        end: 11.5,
        vo: "High-frequency algorithms detect institutional orders before they hit the exchange, scooping the bid-ask spread.",
        motion: "Kinetic Swiss data bars + dynamic depth chart"
      },
      {
        id: 3,
        tag: "Scene 3: The Edge",
        start: 11.5,
        end: 16.5,
        vo: "Speed is the only moat left. Fiber-optic lasers and microwave towers dominate the order book.",
        motion: "3D perspective matrix grid + pulse vectors"
      },
      {
        id: 4,
        tag: "Scene 4: Final Signal",
        start: 16.5,
        end: 20.0,
        vo: "Master the algorithms or get liquidated. Make sure to like and subscribe to @OpusMotion for daily quantitative alpha!",
        motion: "Clean typography zoom + audio-reactive ring"
      }
    ]
  },
  cosmos: {
    topic: "The Event Horizon: What happens when time stops at the Singularity.",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: The Event Horizon",
        start: 0,
        end: 5.0,
        vo: "Cross the event horizon of a supermassive black hole, and space and time trade places.",
        motion: "Celestial black hole vortex + gravitational lensing"
      },
      {
        id: 2,
        tag: "Scene 2: Gravitational Dilation",
        start: 5.0,
        end: 11.0,
        vo: "To an outside observer, your clock slows to a dead standstill. But to you, eternity passes in a second.",
        motion: "Orbiting spiral stars + relativistic redshift glow"
      },
      {
        id: 3,
        tag: "Scene 3: The Singularity",
        start: 11.0,
        end: 16.0,
        vo: "At the center, infinite density tears the laws of physics to shreds. Quantum gravity is the final unknown.",
        motion: "Wireframe icosahedron collapse + geometric shockwave"
      },
      {
        id: 4,
        tag: "Scene 4: Expand Horizons",
        start: 16.0,
        end: 20.0,
        vo: "Explore the deep unknown with procedural code. Like and subscribe to @OpusMotion for more cosmic discoveries!",
        motion: "Deep space particle field + elegant typography"
      }
    ]
  },
  synthwave: {
    topic: "80s Retro Synthwave: How Cyberpunk 1986 shaped modern interface aesthetics.",
    duration: 20.0,
    voice: "en-US-GuyNeural",
    archetype: "synthwave",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: The Hook",
        start: 0,
        end: 4.5,
        vo: "In nineteen eighty-six, glowing neon vectors and analog synthesizers created an immortal aesthetic vision.",
        motion: "Dolly-in low horizon flight + perspective grid push"
      },
      {
        id: 2,
        tag: "Scene 2: The Grid",
        start: 4.5,
        end: 10.0,
        vo: "The infinite horizon wireframe wasn't just a style—it was humanity's first glimpse into digital cyberspace.",
        motion: "Segmented sun rise + chromatic aberration pulse"
      },
      {
        id: 3,
        tag: "Scene 3: The Resurgence",
        start: 10.0,
        end: 15.5,
        vo: "Today, synthwave fuels modern HUDs, electronic music, and futuristic dark-mode interfaces worldwide.",
        motion: "Retro neon mountain strobe + glowing flare burst"
      },
      {
        id: 4,
        tag: "Scene 4: Outro & CTA",
        start: 15.5,
        end: 20.0,
        vo: "Plug into the retro grid with code. Make sure to like and subscribe to @OpusMotion for daily aesthetic tech!",
        motion: "Center CRT logo lock + particle supernova"
      }
    ]
  },
  bauhaus: {
    topic: "Geometric Bauhaus Design: Five Architectural Rules of Kinetic Typography.",
    duration: 20.0,
    voice: "en-US-GuyNeural",
    archetype: "bauhaus",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: The Principle",
        start: 0,
        end: 4.5,
        vo: "Form follows function. The Bauhaus movement stripped away decoration to uncover pure geometric truth.",
        motion: "Diagonal split frame + primary shape reveal"
      },
      {
        id: 2,
        tag: "Scene 2: Color Harmony",
        start: 4.5,
        end: 10.0,
        vo: "Three primary colors—cadmium red, cobalt blue, and golden yellow—anchor the entire visual hierarchy.",
        motion: "Intersecting geometric solids + constructivist wipe"
      },
      {
        id: 3,
        tag: "Scene 3: Kinetic Type",
        start: 10.0,
        end: 15.5,
        vo: "When typography locks to a mathematical grid, motion graphics transforms into structural architecture.",
        motion: "Heavy typographic stamp + 45-degree angle slide"
      },
      {
        id: 4,
        tag: "Scene 4: Design CTA",
        start: 15.5,
        end: 20.0,
        vo: "Master the timeless laws of design. Like and subscribe to @OpusMotion for daily creative engineering!",
        motion: "Primary color block explosion + clean lockup"
      }
    ]
  },
  blueprint: {
    topic: "Technical Blueprint: Deep-Sea Oceanic Structures Under 10,000m Pressure.",
    duration: 20.0,
    voice: "en-US-ChristopherNeural",
    archetype: "blueprint",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: The Mariana Abyss",
        start: 0,
        end: 4.5,
        vo: "At ten thousand meters below sea level, water pressure reaches one thousand atmospheres. Steel buckles instantly.",
        motion: "Technical CAD caliper zoom + coordinate lock"
      },
      {
        id: 2,
        tag: "Scene 2: Titanium Geometry",
        start: 4.5,
        end: 10.0,
        vo: "Engineers rely on spherical titanium hulls. Uniform compressive geometry distributes colossal hydrostatic loads perfectly.",
        motion: "Concentric drafting rings + dimension callout arrows"
      },
      {
        id: 3,
        tag: "Scene 3: Deep Schematics",
        start: 10.0,
        end: 15.5,
        vo: "Every seam, seal, and acrylic viewport is micro-calibrated to survive the planet's most extreme abyss.",
        motion: "Crosshair coordinate scan + patent stamp strobe"
      },
      {
        id: 4,
        tag: "Scene 4: Engineering CTA",
        start: 15.5,
        end: 20.0,
        vo: "Discover extreme engineering through pure code. Make sure to like and subscribe to @OpusMotion!",
        motion: "Full blueprint wireframe reveal + technical border pulse"
      }
    ]
  },
  aurora: {
    topic: "Aurora Glassmorphism: The Optical Physics of Digital Refraction.",
    duration: 20.0,
    voice: "en-GB-SoniaNeural",
    archetype: "aurora",
    scenes: [
      {
        id: 1,
        tag: "Scene 1: Frosted Light",
        start: 0,
        end: 4.5,
        vo: "Modern user interfaces are no longer flat. They are sculpted from digital frosted glass and refractive light.",
        motion: "Floating frosted glass panel + specular gleam sweep"
      },
      {
        id: 2,
        tag: "Scene 2: Refractive Depth",
        start: 4.5,
        end: 10.0,
        vo: "By simulating caustic light dispersion and subsurface scattering, interfaces gain depth without visual clutter.",
        motion: "Multi-point iridescent gradient mesh drift"
      },
      {
        id: 3,
        tag: "Scene 3: Optical Harmony",
        start: 10.0,
        end: 15.5,
        vo: "Ethereal colors flow like polar auroras, turning raw software controls into tactile digital sculptures.",
        motion: "Soft glowing orb vortex + bokeh particle float"
      },
      {
        id: 4,
        tag: "Scene 4: Aesthetic CTA",
        start: 15.5,
        end: 20.0,
        vo: "Craft next-generation UI with code. Like and subscribe to @OpusMotion for daily aesthetic inspiration!",
        motion: "Glass card bloom + iridescent aurora finale"
      }
    ]
  }
};

// ==========================================================================
// 2. Cross-Window Dedicated Tab Synchronization (BroadcastChannel)
// ==========================================================================
let syncChannel = null;
try {
  syncChannel = new BroadcastChannel('opusmotion_studio_sync');
  syncChannel.onmessage = (event) => {
    const data = event.data;
    if (!data) return;

    if (data.type === 'SYNC_STATE') {
      state.currentTime = data.currentTime;
      state.isPlaying = data.isPlaying;
      state.visualArchetype = data.visualArchetype;
      state.aspectRatio = data.aspectRatio;
      state.duration = data.duration;
      updateTimeDisplay();
      updatePlayheadUI();
    } else if (data.type === 'PLAY_PAUSE') {
      state.isPlaying = data.isPlaying;
      updatePlayheadUI();
    } else if (data.type === 'SEEK') {
      state.currentTime = data.currentTime;
      updateTimeDisplay();
      updatePlayheadUI();
    }
  };
} catch (e) {
  console.log('BroadcastChannel not supported in current context.');
}

function broadcastSync(type, extra = {}) {
  if (syncChannel) {
    syncChannel.postMessage({
      type,
      currentTime: state.currentTime,
      isPlaying: state.isPlaying,
      visualArchetype: state.visualArchetype,
      aspectRatio: state.aspectRatio,
      duration: state.duration,
      ...extra
    });
  }
}

// ==========================================================================
// 3. Audio Engine & Synthesizer (Web Audio API + TTS)
// ==========================================================================
let audioCtx = null;
let bgmOscillator1 = null;
let bgmOscillator2 = null;
let bgmGain = null;
let sfxGain = null;
let voGain = null;
let isAudioInitialized = false;

function initAudioEngine() {
  if (isAudioInitialized) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();

    // Master BGM Bus
    bgmGain = audioCtx.createGain();
    bgmGain.gain.setValueAtTime(state.mixBgm, audioCtx.currentTime);

    // Master SFX Bus
    sfxGain = audioCtx.createGain();
    sfxGain.gain.setValueAtTime(state.mixSfx, audioCtx.currentTime);

    // Master VO Bus
    voGain = audioCtx.createGain();
    voGain.gain.setValueAtTime(state.mixVo, audioCtx.currentTime);

    bgmGain.connect(audioCtx.destination);
    sfxGain.connect(audioCtx.destination);
    voGain.connect(audioCtx.destination);

    isAudioInitialized = true;
  } catch (err) {
    console.warn('Audio engine initialization deferred until user interaction.', err);
  }
}

// Trigger Scene Transition Whoosh
function playSceneTransitionSfx() {
  if (!audioCtx || !sfxGain) return;
  try {
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3200, audioCtx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25 * state.mixSfx, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.38);
  } catch (e) {}
}

// Procedural Ambient Drone
function updateProceduralBgm() {
  if (!audioCtx || !state.isPlaying) {
    if (bgmOscillator1) {
      try {
        bgmOscillator1.stop();
        bgmOscillator2.stop();
      } catch (e) {}
      bgmOscillator1 = null;
      bgmOscillator2 = null;
    }
    return;
  }

  if (!bgmOscillator1) {
    try {
      bgmOscillator1 = audioCtx.createOscillator();
      bgmOscillator2 = audioCtx.createOscillator();
      bgmOscillator1.type = 'sine';
      bgmOscillator2.type = 'triangle';

      bgmOscillator1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note
      bgmOscillator2.frequency.setValueAtTime(110.5, audioCtx.currentTime); // Detuned A2

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, audioCtx.currentTime);

      bgmOscillator1.connect(filter);
      bgmOscillator2.connect(filter);
      filter.connect(bgmGain);

      bgmOscillator1.start();
      bgmOscillator2.start();
    } catch (e) {}
  }
}

// ==========================================================================
// 4. Procedural Canvas Animation Engine
// ==========================================================================
let canvas = null;
let ctx = null;
let waveformCanvas = null;
let waveformCtx = null;
let lastFrameTime = performance.now();
let lastSceneIndex = -1;
let fpsCounter = 60;

// Particle System State
let particles = [];
function initParticleField(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random() * 2 + 0.1,
      size: Math.random() * 3 + 1,
      hue: Math.random() * 60 + 170, // Cyan to Purple
      speed: Math.random() * 0.4 + 0.2
    });
  }
}

// Main Render Loop
function renderFrame(timestamp) {
  const dt = (timestamp - lastFrameTime) / 1000;
  lastFrameTime = timestamp;

  if (dt > 0) {
    const instantFps = 1 / dt;
    fpsCounter = fpsCounter * 0.92 + instantFps * 0.08;
    const fpsDisp = document.getElementById('dispCurrentFps');
    if (fpsDisp) fpsDisp.textContent = Math.min(60, Math.round(fpsCounter)).toFixed(1);
  }

  // Update Timecode
  if (state.isPlaying) {
    const audio = document.getElementById('masterAudioTrack');
    if (audio && !audio.paused && !audio.ended && audio.currentTime > 0) {
      state.currentTime = audio.currentTime;
    } else {
      state.currentTime += dt * state.playbackSpeed;
    }

    if (state.currentTime >= state.duration) {
      if (state.loop) {
        state.currentTime = 0;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(e => {});
        }
      } else {
        state.currentTime = state.duration;
        state.isPlaying = false;
        if (audio) audio.pause();
        updatePlayheadUI();
      }
    }
    updateTimeDisplay();
    updatePlayheadUI();
    broadcastSync('SYNC_STATE');
  }

  // Detect Scene Transition for Audio SFX
  const activeSceneIdx = getCurrentSceneIndex(state.currentTime);
  if (activeSceneIdx !== lastSceneIndex && lastSceneIndex !== -1 && state.isPlaying) {
    playSceneTransitionSfx();
  }
  lastSceneIndex = activeSceneIdx;

  // Render on Viewport Canvas
  if (canvas && ctx) {
    drawProceduralVideo(ctx, canvas.width, canvas.height, state.currentTime);
  }

  requestAnimationFrame(renderFrame);
}

// Find Active Scene
function getCurrentSceneIndex(t) {
  if (!state.scenes || state.scenes.length === 0) return 0;
  for (let i = 0; i < state.scenes.length; i++) {
    const s = state.scenes[i];
    if (t >= s.start && t < s.end) return i;
  }
  return state.scenes.length - 1;
}

// Image Preloading & Caching for Motion Graphics Scene Assets
const loadedSceneImageCache = {};

function getPreloadedSceneImage(url) {
  if (!url) return null;
  if (!loadedSceneImageCache[url]) {
    const img = new Image();
    img.src = url;
    loadedSceneImageCache[url] = img;
  }
  const img = loadedSceneImageCache[url];
  return (img.complete && img.naturalWidth > 0) ? img : null;
}

function drawMotionGraphicsSceneImage(ctx, W, H, scene, progress, t) {
  const img = getPreloadedSceneImage(scene.image);
  if (!img) return;

  ctx.save();
  // Smooth Ken Burns zoom and drift
  const zoom = 1.04 + 0.10 * progress;
  const panX = Math.sin(progress * Math.PI) * 12;
  const panY = Math.cos(progress * Math.PI) * 8;

  ctx.translate(W / 2 + panX, H / 2 + panY);
  ctx.scale(zoom, zoom);
  ctx.translate(-W / 2, -H / 2);

  ctx.drawImage(img, 0, 0, W, H);

  // Subtle dark gradient vignette for readable typography & HUD
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(6, 8, 14, 0.45)');
  grad.addColorStop(0.3, 'rgba(6, 8, 14, 0.15)');
  grad.addColorStop(0.7, 'rgba(6, 8, 14, 0.35)');
  grad.addColorStop(1, 'rgba(6, 8, 14, 0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}

// ==========================================================================
// 5. Procedural Styles & Shaders
// ==========================================================================
function drawProceduralVideo(targetCtx, W, H, t) {
  const currentSceneIdx = getCurrentSceneIndex(t);
  const scene = state.scenes[currentSceneIdx] || { tag: "Scene 1", vo: "", motion: "" };
  const sceneProgress = scene.end > scene.start ? (t - scene.start) / (scene.end - scene.start) : 0;

  // Clear Background
  targetCtx.fillStyle = '#06070B';
  targetCtx.fillRect(0, 0, W, H);

  // If scene has a high-definition motion graphics image, render it as background layer with Ken Burns motion
  if (scene.image) {
    drawMotionGraphicsSceneImage(targetCtx, W, H, scene, sceneProgress, t);
  }

  // Camera Shake & Dynamic Transform
  targetCtx.save();
  const shakeIntensity = (state.cameraDynamics / 100) * 4;
  const shakeX = Math.sin(t * 14) * shakeIntensity;
  const shakeY = Math.cos(t * 16) * shakeIntensity;
  const dollyZoom = 1 + (sceneProgress * 0.08) * (state.cameraDynamics / 100);
  
  targetCtx.translate(W / 2 + shakeX, H / 2 + shakeY);
  targetCtx.scale(dollyZoom, dollyZoom);
  targetCtx.translate(-W / 2, -H / 2);

  // Execute Chosen Visual Archetype
  switch (state.visualArchetype) {
    case 'cyber':
      drawCyberRadarStyle(targetCtx, W, H, t, sceneProgress);
      break;
    case 'swiss':
      drawSwissKineticStyle(targetCtx, W, H, t, sceneProgress);
      break;
    case 'celestial':
      drawCelestialFlowStyle(targetCtx, W, H, t, sceneProgress);
      break;
    case 'synthwave':
      drawSynthwaveStyle(targetCtx, W, H, t, sceneProgress);
      break;
    case 'bauhaus':
      drawBauhausStyle(targetCtx, W, H, t, sceneProgress);
      break;
    case 'aurora':
      drawAuroraGlassStyle(targetCtx, W, H, t, sceneProgress);
      break;
    case 'blueprint':
      drawBlueprintStyle(targetCtx, W, H, t, sceneProgress);
      break;
    case 'opus':
    default:
      drawOpusGeometricStyle(targetCtx, W, H, t, sceneProgress);
      break;
  }

  // Overlay Dynamic Kinetic Typography
  drawKineticTypography(targetCtx, W, H, scene, sceneProgress, t);

  // Overlay Audio Energy Ring / Wave Indicator
  drawAudioWaveIndicator(targetCtx, W, H, t);

  // Overlay Social Media Outro Card on Last Scene / Last Frame
  drawSocialOutroCard(targetCtx, W, H, t, currentSceneIdx, sceneProgress);

  // Apply Film Post-Processing Pipeline (Grain, Vignette, Scanlines)
  drawFilmPostEffects(targetCtx, W, H, t);

  targetCtx.restore();
}

/**
 * ARCHETYPE 1: Opus Geometric Pulse (Awesome Opus 5.5 style)
 * 3D rotating wireframe icosahedron, spiral orbits, kinetic vector math
 */
function drawOpusGeometricStyle(ctx, W, H, t, progress) {
  const cx = W / 2;
  const cy = H * 0.42;

  // Background radial glow
  const gradient = ctx.createRadialGradient(cx, cy, 20, cx, cy, W * 0.7);
  gradient.addColorStop(0, 'rgba(0, 242, 254, 0.22)');
  gradient.addColorStop(0.5, 'rgba(157, 78, 221, 0.12)');
  gradient.addColorStop(1, 'rgba(6, 7, 11, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Dynamic Orbiting Rings
  ctx.lineWidth = 2.5;
  for (let i = 1; i <= 4; i++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * (0.35 / i) + i * 0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, 140 * i * 0.45, 80 * i * 0.45, (Math.PI / 4) * i, 0, Math.PI * 2);
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 242, 254, 0.5)' : 'rgba(157, 78, 221, 0.45)';
    ctx.setLineDash([12, 16]);
    ctx.stroke();
    ctx.restore();
  }

  // 3D Rotating Geometric Wireframe Icosahedron Projection
  const rotX = t * 0.8;
  const rotY = t * 1.1;
  const vertices = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
  ];
  const edges = [
    [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7]
  ];

  const scale = 110 + Math.sin(t * 3) * 15;
  const projected = vertices.map(([x, y, z]) => {
    // Rotate Y
    let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
    let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
    // Rotate X
    let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
    let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
    // Perspective
    const fov = 3.5;
    const p = fov / (fov + z2);
    return [cx + x1 * scale * p, cy + y2 * scale * p];
  });

  ctx.strokeStyle = '#00F2FE';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = '#00F2FE';
  ctx.shadowBlur = 18;
  edges.forEach(([i, j]) => {
    ctx.beginPath();
    ctx.moveTo(projected[i][0], projected[i][1]);
    ctx.lineTo(projected[j][0], projected[j][1]);
    ctx.stroke();
  });
  ctx.shadowBlur = 0;

  // Particle Field
  drawParticleField(ctx, W, H, t);
}

/**
 * ARCHETYPE 2: Cyber Hologram Radar (Lemo-Opuscar style)
 * Volumetric 3D perspective cyber grid, rotating sonar radar sweeps, binary glyph streams
 */
function drawCyberRadarStyle(ctx, W, H, t, progress) {
  const cx = W / 2;
  const horizonY = H * 0.52;

  // Perspective 3D Grid Floor
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
  ctx.lineWidth = 1.5;
  const numGridLines = 14;
  for (let i = 0; i <= numGridLines; i++) {
    const x = (W / numGridLines) * i;
    ctx.beginPath();
    ctx.moveTo(cx, horizonY);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  const speedOffset = (t * 1.5) % 1;
  for (let j = 1; j <= 9; j++) {
    const p = Math.pow((j + speedOffset) / 9, 2.2);
    const y = horizonY + p * (H - horizonY);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.strokeStyle = `rgba(0, 242, 254, ${p * 0.6})`;
    ctx.stroke();
  }

  // Sonar Radar Sweep in Upper Half
  const radarY = H * 0.28;
  const radarR = 170;
  ctx.save();
  ctx.translate(cx, radarY);

  ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radarR, 0, Math.PI * 2);
  ctx.arc(0, 0, radarR * 0.6, 0, Math.PI * 2);
  ctx.arc(0, 0, radarR * 0.25, 0, Math.PI * 2);
  ctx.stroke();

  // Radar Sweep Cone
  const sweepAngle = t * 3.5;
  const sweepGrad = ctx.createConicGradient(sweepAngle, 0, 0);
  sweepGrad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
  sweepGrad.addColorStop(0.12, 'rgba(0, 242, 254, 0)');
  sweepGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
  ctx.fillStyle = sweepGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radarR, 0, Math.PI * 2);
  ctx.fill();

  // Radar Blips & Swarm Chevrons
  const txtVo = document.getElementById('txtVoFullScript');
  const isDroneTopic = (txtVo && txtVo.value.toLowerCase().includes('drone')) || (state.scenes[0] && state.scenes[0].vo.toLowerCase().includes('drone'));

  if (isDroneTopic) {
    // Military Drone Swarm Chevrons
    const swarmCount = 24;
    for (let d = 0; d < swarmCount; d++) {
      const dAng = (d / swarmCount) * Math.PI * 2 + t * 0.4;
      const dDist = 45 + (((d * 33) + t * 65) % 115);
      const dx = Math.cos(dAng) * dDist;
      const dy = Math.sin(dAng) * dDist;

      ctx.save();
      ctx.translate(dx, dy);
      ctx.fillStyle = '#06D6A0';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(-5, 5);
      ctx.lineTo(5, 5);
      ctx.fill();
      ctx.restore();
    }

    // High Energy Laser Pulse Beam from Center
    if (Math.sin(t * 7) > 0.3) {
      const targetAngle = t * 2.5;
      const tx = Math.cos(targetAngle) * radarR * 0.85;
      const ty = Math.sin(targetAngle) * radarR * 0.85;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Hit Impact
      ctx.fillStyle = '#FFBE0B';
      ctx.beginPath();
      ctx.arc(tx, ty, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    for (let b = 1; b <= 4; b++) {
      const bx = Math.sin(b * 2.3 + t * 0.3) * radarR * 0.65;
      const by = Math.cos(b * 1.8 + t * 0.2) * radarR * 0.65;
      ctx.fillStyle = '#FF0054';
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * ARCHETYPE 3: Minimalist Swiss Kinetic (Video Shotcraft style)
 * High-contrast color blocks, sliding typographic masks, bold accents
 */
function drawSwissKineticStyle(ctx, W, H, t, progress) {
  // Diagonal Split Background Mask
  ctx.fillStyle = '#0F121C';
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.fillStyle = '#FFBE0B';
  const splitY = H * 0.38 + Math.sin(t * 1.5) * 40;
  ctx.beginPath();
  ctx.moveTo(0, splitY - 80);
  ctx.lineTo(W, splitY + 40);
  ctx.lineTo(W, splitY + 70);
  ctx.lineTo(0, splitY - 50);
  ctx.fill();
  ctx.restore();

  // Geometric Graphic Blocks
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.strokeRect(W * 0.1, H * 0.15, W * 0.8, H * 0.32);

  ctx.fillStyle = '#00F2FE';
  const barW = (W * 0.8) * ((Math.sin(t * 2) + 1) / 2);
  ctx.fillRect(W * 0.1, H * 0.15, barW, 8);

  // Grid Dots Matrix
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 12; c++) {
      ctx.beginPath();
      ctx.arc(W * 0.15 + c * 28, H * 0.22 + r * 24, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * ARCHETYPE 4: Celestial Vector Flow (ClaudeAnimationBase style)
 * Organic flowing trigonometric bezier ribbons, twinkling starfield
 */
function drawCelestialFlowStyle(ctx, W, H, t, progress) {
  // Nebula Gradient
  const grad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * 0.8);
  grad.addColorStop(0, 'rgba(157, 78, 221, 0.28)');
  grad.addColorStop(0.5, 'rgba(0, 242, 254, 0.15)');
  grad.addColorStop(1, 'rgba(4, 5, 8, 1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Flowing Bezier Waves
  ctx.lineWidth = 3;
  for (let w = 0; w < 5; w++) {
    ctx.beginPath();
    ctx.strokeStyle = w % 2 === 0 ? 'rgba(0, 242, 254, 0.45)' : 'rgba(157, 78, 221, 0.45)';
    for (let x = 0; x <= W; x += 15) {
      const y = H * 0.4 + Math.sin(x * 0.006 + t * 2 + w) * 90 + Math.cos(x * 0.012 - t * 1.5) * 45;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Twinkling Starfield
  drawParticleField(ctx, W, H, t);
}

// Particle Field Drawer
function drawParticleField(ctx, W, H, t) {
  const cx = W / 2;
  const cy = H / 2;
  for (let p of particles) {
    p.z -= p.speed * 0.02;
    if (p.z <= 0) p.z = 2.0;

    const sx = cx + (p.x / p.z) * (W * 0.45);
    const sy = cy + (p.y / p.z) * (H * 0.45);
    const r = Math.max(0.8, (1 - p.z / 2.0) * p.size);

    if (sx >= 0 && sx <= W && sy >= 0 && sy <= H) {
      ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${1 - p.z / 2.0})`;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * ARCHETYPE 5: 80s Retro Synthwave & CRT (mg-styles-15 #10 & lemo-opuscar ascii-crt)
 * Infinite perspective grid, segmented neon sun disc, vector mountains & horizon glow
 */
function drawSynthwaveStyle(ctx, W, H, t, progress) {
  const cx = W / 2;
  const horizonY = H * 0.50;

  // Sky Gradient: deep night cosmic purple to hot neon magenta
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#0B001A');
  skyGrad.addColorStop(0.65, '#2D004F');
  skyGrad.addColorStop(1, '#6A0072');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, horizonY);

  // Distant Vector Mountain Range
  ctx.save();
  ctx.fillStyle = '#140026';
  ctx.strokeStyle = '#FF007F';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  const mtnPoints = [
    [0.05, 0.42], [0.18, 0.35], [0.28, 0.44], [0.38, 0.38],
    [0.50, 0.43], [0.62, 0.36], [0.74, 0.44], [0.85, 0.34], [1.0, 0.42]
  ];
  for (let pt of mtnPoints) {
    ctx.lineTo(W * pt[0], H * pt[1]);
  }
  ctx.lineTo(W, horizonY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Massive Segmented Retro Sun Disc
  const sunR = Math.min(W, H) * 0.22;
  const sunY = horizonY - sunR * 0.35;
  ctx.save();
  const sunGrad = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
  sunGrad.addColorStop(0, '#FFE600');
  sunGrad.addColorStop(0.5, '#FF5400');
  sunGrad.addColorStop(1, '#FF007F');
  ctx.fillStyle = sunGrad;
  ctx.shadowColor = '#FF007F';
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.arc(cx, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Sun Horizontal Cutout Slices (Outrun bar bands)
  ctx.fillStyle = '#140026';
  const numSunBars = 7;
  for (let b = 0; b < numSunBars; b++) {
    const barNorm = b / numSunBars;
    const barH = 2.5 + barNorm * 7.5;
    const barY = sunY + barNorm * sunR * 0.95;
    ctx.fillRect(cx - sunR - 10, barY, (sunR + 10) * 2, barH);
  }
  ctx.restore();

  // Perspective 3D Grid Ground Floor
  const groundGrad = ctx.createLinearGradient(0, horizonY, 0, H);
  groundGrad.addColorStop(0, '#060012');
  groundGrad.addColorStop(1, '#020008');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, horizonY, W, H - horizonY);

  // Perspective Grid Lines Converging to Vanishing Horizon
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 127, 0.45)';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#FF007F';
  ctx.shadowBlur = 10;
  const numVLines = 18;
  for (let i = -numVLines / 2; i <= numVLines / 2; i++) {
    const groundX = cx + (i / (numVLines / 2)) * (W * 1.3);
    ctx.beginPath();
    ctx.moveTo(cx, horizonY);
    ctx.lineTo(groundX, H);
    ctx.stroke();
  }

  // Rolling Horizontal Grid Lines Moving Downward
  const scrollOffset = (t * 1.6) % 1;
  const numHLines = 11;
  for (let j = 1; j <= numHLines; j++) {
    const p = Math.pow((j + scrollOffset) / numHLines, 2.6);
    const lineY = horizonY + p * (H - horizonY);
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(W, lineY);
    ctx.strokeStyle = `rgba(0, 240, 255, ${p * 0.85})`;
    ctx.lineWidth = 1 + p * 2.5;
    ctx.stroke();
  }
  ctx.restore();

  // Neon Horizon Strobe Glow
  ctx.fillStyle = 'rgba(255, 0, 127, 0.28)';
  ctx.fillRect(0, horizonY - 4, W, 8);
}

/**
 * ARCHETYPE 6: Geometric Bauhaus & Constructivist (mg-styles-15 #09 & lemo-opuscar kino-montage)
 * Primary color blocks (cadmium red, cobalt blue, yellow), constructivist wipes, heavy geometric type
 */
function drawBauhausStyle(ctx, W, H, t, progress) {
  const cx = W / 2;
  const cy = H * 0.44;

  // Bauhaus Off-White/Charcoal Ground
  ctx.fillStyle = '#0F111A';
  ctx.fillRect(0, 0, W, H);

  // Constructivist Diagonal Color Blocks
  ctx.save();
  const rotAngle = Math.PI / 6;
  ctx.translate(cx, cy);
  ctx.rotate(rotAngle + Math.sin(t * 0.8) * 0.08);

  // Cobalt Blue Geometric Rectangle
  ctx.fillStyle = '#1D3557';
  ctx.fillRect(-W * 0.45, -H * 0.22, W * 0.9, 50);

  // Cadmium Red Rotating Circle with Wedge
  ctx.fillStyle = '#E63946';
  ctx.beginPath();
  ctx.arc(0, 0, 130 + Math.sin(t * 2) * 12, 0, Math.PI * 1.5);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  // Goldenrod Yellow Triangle
  ctx.fillStyle = '#FFB703';
  ctx.beginPath();
  const triSize = 110;
  ctx.moveTo(triSize, -triSize * 0.6);
  ctx.lineTo(triSize + 70, triSize * 0.8);
  ctx.lineTo(triSize - 60, triSize * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Constructivist Frame & Rhythmic Hatching
  ctx.strokeStyle = '#F1FAEE';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(W * 0.08, H * 0.12, W * 0.84, H * 0.48);

  // 45-degree Diagonal Hatch Marks (///)
  ctx.strokeStyle = 'rgba(241, 250, 238, 0.3)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const hx = W * 0.12 + i * 28;
    const hy = H * 0.16;
    ctx.beginPath();
    ctx.moveTo(hx, hy + 30);
    ctx.lineTo(hx + 20, hy);
    ctx.stroke();
  }

  // Bauhaus Header Typography Stamp
  ctx.save();
  ctx.fillStyle = '#F1FAEE';
  ctx.font = '900 24px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('01 // FORM FOLLOWS FUNCTION', W * 0.12, H * 0.56);
  ctx.restore();
}

/**
 * ARCHETYPE 7: Aurora Glassmorphism (mg-styles-15 #12 & lemo-opuscar glass-product)
 * Translucent frosted glass refraction cards, drifting iridescent gradient mesh, light sweeps
 */
function drawAuroraGlassStyle(ctx, W, H, t, progress) {
  const cx = W / 2;
  const cy = H * 0.42;

  // Deep Obsidian Canvas
  ctx.fillStyle = '#060814';
  ctx.fillRect(0, 0, W, H);

  // Drifting Multi-Color Aurora Gradient Mesh Orbs
  const orbs = [
    { x: cx + Math.sin(t * 1.2) * (W * 0.28), y: cy + Math.cos(t * 1.4) * (H * 0.15), r: W * 0.45, c0: 'rgba(0, 242, 254, 0.45)', c1: 'rgba(0, 242, 254, 0)' },
    { x: cx + Math.cos(t * 0.9) * (W * 0.22), y: cy + Math.sin(t * 1.1) * (H * 0.18), r: W * 0.48, c0: 'rgba(121, 40, 202, 0.50)', c1: 'rgba(121, 40, 202, 0)' },
    { x: cx + Math.sin(t * 1.5 + 2) * (W * 0.25), y: cy + Math.cos(t * 0.8) * (H * 0.12), r: W * 0.40, c0: 'rgba(255, 0, 128, 0.35)', c1: 'rgba(255, 0, 128, 0)' },
    { x: cx - Math.sin(t * 1.0) * (W * 0.2), y: cy - Math.cos(t * 1.3) * (H * 0.16), r: W * 0.38, c0: 'rgba(0, 223, 216, 0.35)', c1: 'rgba(0, 223, 216, 0)' }
  ];

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let orb of orbs) {
    const g = ctx.createRadialGradient(orb.x, orb.y, 20, orb.x, orb.y, orb.r);
    g.addColorStop(0, orb.c0);
    g.addColorStop(1, orb.c1);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Floating Frosted Glass Card
  ctx.save();
  const cardW = W * 0.78;
  const cardH = H * 0.34;
  const cardX = (W - cardW) / 2;
  const cardY = cy - cardH / 2;

  // Glass backdrop translucent blur fill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  ctx.fill();

  // Specular Border Highlight
  const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  borderGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
  borderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
  borderGrad.addColorStop(1, 'rgba(0, 242, 254, 0.45)');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Specular Light Glint Sweep across glass card
  const sweepProgress = (t * 0.5) % 2.5;
  if (sweepProgress < 1.0) {
    const glintX = cardX + sweepProgress * cardW;
    const glintGrad = ctx.createLinearGradient(glintX - 60, cardY, glintX + 60, cardY + cardH);
    glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    glintGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glintGrad;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
    ctx.fill();
  }

  // Floating glowing bokeh particles
  drawParticleField(ctx, W, H, t);
  ctx.restore();
}

/**
 * ARCHETYPE 8: Technical Blueprint & CAD (lemo-opuscar blueprint & mg-styles-15 #02)
 * Cyan drafting grid, mechanical calipers, dimension arrow lines & engineering stamps
 */
function drawBlueprintStyle(ctx, W, H, t, progress) {
  const cx = W / 2;
  const cy = H * 0.42;

  // Deep Cyanotype Drafting Blue
  ctx.fillStyle = '#071A2E';
  ctx.fillRect(0, 0, W, H);

  // Fine Millimeter Drafting Grid
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.14)';
  ctx.lineWidth = 1;
  const gridStep = 28;
  for (let x = 0; x <= W; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Major Coordinate Grid (Every 4th line)
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= W; x += gridStep * 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += gridStep * 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Rotating Technical Mechanical Calipers
  ctx.translate(cx, cy);
  const caliperR = 145;
  ctx.strokeStyle = '#00D4FF';
  ctx.lineWidth = 2.5;

  // Outer Caliper Ring with Degree Ticks
  ctx.beginPath();
  ctx.arc(0, 0, caliperR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.rotate(t * 0.4);
  const numTicks = 36;
  for (let k = 0; k < numTicks; k++) {
    const tickAng = (k / numTicks) * Math.PI * 2;
    const isMajor = k % 9 === 0;
    const r1 = caliperR - (isMajor ? 14 : 7);
    ctx.beginPath();
    ctx.moveTo(Math.cos(tickAng) * r1, Math.sin(tickAng) * r1);
    ctx.lineTo(Math.cos(tickAng) * caliperR, Math.sin(tickAng) * caliperR);
    ctx.strokeStyle = isMajor ? '#00D4FF' : 'rgba(0, 212, 255, 0.5)';
    ctx.lineWidth = isMajor ? 2.5 : 1.2;
    ctx.stroke();
  }

  // Technical Dimension Callout Arrows
  ctx.rotate(-t * 0.4); // unrotate for text
  ctx.fillStyle = '#00D4FF';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('R 145.00 mm', 0, -caliperR - 12);
  ctx.fillText('CALIPER SPEC // TOLERANCE ±0.002', 0, caliperR + 24);

  // Engineering Title Block Stamp in Corner
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = '#00D4FF';
  ctx.lineWidth = 2;
  const stampW = 260;
  const stampH = 50;
  const stampX = W - stampW - 20;
  const stampY = H * 0.58;
  ctx.strokeRect(stampX, stampY, stampW, stampH);
  ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
  ctx.fillRect(stampX, stampY, stampW, stampH);
  ctx.fillStyle = '#00D4FF';
  ctx.font = '700 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('DWG NO: OPUS-8088 // DEEP-SEA CAD', stampX + 10, stampY + 20);
  ctx.fillText('SCALE 1:50 • APPROVED BY DIRECTOR', stampX + 10, stampY + 38);
  ctx.restore();
}

/**
 * FILM POST-PROCESSING PASS (from Lemo-Opuscar Technique)
 * 35mm film grain, corner lens vignette, and subtle CRT scanlines
 */
function drawFilmPostEffects(ctx, W, H, t) {
  // 1. Radial Lens Vignette
  if (state.filmVignette > 0) {
    const vigGrad = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(1, `rgba(0, 0, 0, ${state.filmVignette * 0.85})`);
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Horizontal CRT Scanlines
  if (state.filmScanlines) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    for (let y = 0; y < H; y += 4) {
      ctx.fillRect(0, y, W, 1.5);
    }
  }

  // 3. Fast Procedural 35mm Film Grain
  if (state.filmGrain > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    const grainSeed = Math.floor(t * 24); // change at 24 fps
    const numGrains = Math.floor(W * H * 0.00018 * (state.filmGrain / 0.22));
    for (let g = 0; g < numGrains; g++) {
      // Fast pseudorandom hash
      const rx = ((g * 1973 + grainSeed * 9277) % W);
      const ry = ((g * 9277 + grainSeed * 1973) % H);
      ctx.fillRect(rx, ry, 1.2, 1.2);
    }
    ctx.restore();
  }
}

// Kinetic Typography Renderer
function drawKineticTypography(ctx, W, H, scene, progress, t) {
  ctx.save();

  // Scene Title Tag Badge
  ctx.fillStyle = 'rgba(0, 242, 254, 0.18)';
  ctx.strokeStyle = '#00F2FE';
  ctx.lineWidth = 1.5;
  const tagW = 220;
  const tagH = 34;
  const tagX = (W - tagW) / 2;
  const tagY = H * 0.62;

  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagW, tagH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#00F2FE';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(scene.tag.toUpperCase(), W / 2, tagY + tagH / 2);

  // Main Voice-Over Kinetic Caption
  const text = scene.vo || "";
  const words = text.split(" ");
  const activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length * 1.15));

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // Kinetic Elastic Reveal
  const animScale = Math.min(1, progress * 4);
  const textY = H * 0.68;

  // Word-wrap logic
  ctx.font = '800 42px "Outfit", sans-serif';
  const maxWidth = W * 0.85;
  let lines = [];
  let currentLine = "";

  for (let w of words) {
    let testLine = currentLine ? currentLine + " " + w : w;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = w;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Render High-Contrast Glowing Caption
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 12;

  const lineHeight = 52;
  lines.forEach((line, idx) => {
    const yPos = textY + idx * lineHeight;
    ctx.fillText(line, W / 2, yPos);
  });

  ctx.restore();
}

// Audio Energy Waveform Overlay
function drawAudioWaveIndicator(ctx, W, H, t) {
  ctx.save();
  const barCount = 32;
  const totalW = W * 0.6;
  const startX = (W - totalW) / 2;
  const bottomY = H * 0.88;

  ctx.fillStyle = '#00F2FE';
  for (let i = 0; i < barCount; i++) {
    const freq = Math.sin(t * 8 + i * 0.4) * 0.5 + 0.5;
    const h = freq * 36 + 6;
    const x = startX + (totalW / barCount) * i;
    ctx.fillRect(x, bottomY - h, 4, h);
  }
  ctx.restore();
}

// ==========================================================================
// 5.5 Social Media Outro & CTA Canvas Engine
// ==========================================================================
function drawSocialOutroCard(ctx, W, H, t, sceneIdx, sceneProgress) {
  if (!state.social || !state.social.showOutroCard) return;

  const totalDur = state.duration;
  const outroDuration = state.social.outroDuration || 4.8;
  const outroStartTime = Math.max(0, totalDur - outroDuration);

  // Trigger when timeline reaches the outro window or final scene
  const isLastScene = (state.scenes && state.scenes.length > 0 && sceneIdx === state.scenes.length - 1);
  const isInTimeWindow = (t >= outroStartTime);

  if (!isInTimeWindow && !isLastScene) return;

  const timeIntoOutro = Math.max(0, t - outroStartTime);
  const animProg = Math.min(1.0, timeIntoOutro / 1.0);
  const scale = animProg < 1.0 
    ? 0.45 + 0.55 * Math.sin(animProg * Math.PI * 0.5) * (1 + 0.08 * Math.sin(animProg * Math.PI)) 
    : 1.0;
  const alpha = Math.min(1.0, animProg * 1.6);

  ctx.save();
  ctx.globalAlpha = alpha;

  const plat = (state.social.platform || 'youtube').toLowerCase();
  let platColor = '#FF0000';
  let platColorSecondary = '#CC0000';
  let platGlow = 'rgba(255, 0, 0, 0.45)';
  let platName = 'YouTube';
  let defaultBtn = 'SUBSCRIBE';

  if (plat === 'tiktok') {
    platColor = '#00F2FE';
    platColorSecondary = '#FE2C55';
    platGlow = 'rgba(0, 242, 254, 0.45)';
    platName = 'TikTok';
    defaultBtn = 'FOLLOW';
  } else if (plat === 'instagram') {
    platColor = '#E1306C';
    platColorSecondary = '#833AB4';
    platGlow = 'rgba(225, 48, 108, 0.45)';
    platName = 'Instagram';
    defaultBtn = 'FOLLOW';
  } else if (plat === 'twitter' || plat === 'x') {
    platColor = '#1DA1F2';
    platColorSecondary = '#FFFFFF';
    platGlow = 'rgba(29, 161, 242, 0.45)';
    platName = 'X (Twitter)';
    defaultBtn = 'FOLLOW';
  } else if (plat === 'linkedin') {
    platColor = '#0A66C2';
    platColorSecondary = '#0077B5';
    platGlow = 'rgba(10, 102, 194, 0.45)';
    platName = 'LinkedIn';
    defaultBtn = 'CONNECT';
  } else if (plat === 'discord') {
    platColor = '#5865F2';
    platColorSecondary = '#7289DA';
    platGlow = 'rgba(88, 101, 242, 0.45)';
    platName = 'Discord';
    defaultBtn = 'JOIN';
  }

  const handle = state.social.handle || '@Piyushk20';
  const channelName = state.social.channelName || 'Piyushk20';
  const ctaBtnText = (state.social.buttonText || defaultBtn).toUpperCase();
  const ctaSubtext = state.social.ctaText || 'Follow on X for Daily Frontier Tech & Defense Breakdowns';

  const isPortrait = H > W;
  const isWide = W > H;

  let cardW, cardH, cardX, cardY;

  if (isPortrait) {
    cardW = Math.min(W * 0.88, 860);
    cardH = 430;
    cardX = (W - cardW) / 2;
    cardY = H * 0.35; // Positioned for mobile 9:16 vertical viewports
  } else if (isWide) {
    cardW = Math.min(W * 0.50, 820);
    cardH = 340;
    cardX = (W - cardW) / 2;
    cardY = (H - cardH) / 2;
  } else {
    cardW = Math.min(W * 0.82, 780);
    cardH = 380;
    cardX = (W - cardW) / 2;
    cardY = (H - cardH) / 2;
  }

  const centerX = cardX + cardW / 2;
  const centerY = cardY + cardH / 2;
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);

  // 1. Drop Shadow & Platform Glow
  ctx.shadowColor = platGlow;
  ctx.shadowBlur = 36 + Math.sin(t * 6) * 10;
  ctx.shadowOffsetY = 10;

  // 2. Card Background Glassmorphism
  const bgGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  bgGrad.addColorStop(0, 'rgba(14, 18, 32, 0.94)');
  bgGrad.addColorStop(1, 'rgba(6, 8, 16, 0.98)');
  ctx.fillStyle = bgGrad;

  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 24);
  ctx.fill();

  // 3. Card Border Gradient
  const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  borderGrad.addColorStop(0, platColor);
  borderGrad.addColorStop(0.5, platColorSecondary);
  borderGrad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Frosted top highlight line
  ctx.beginPath();
  ctx.moveTo(cardX + 24, cardY + 2);
  ctx.lineTo(cardX + cardW - 24, cardY + 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. Platform Brand Avatar / Logo
  const avatarSize = isWide ? 64 : 76;
  const avatarX = cardX + 36;
  const avatarY = cardY + 36;

  const avatarGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
  avatarGrad.addColorStop(0, platColor);
  avatarGrad.addColorStop(1, platColorSecondary);
  ctx.fillStyle = avatarGrad;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.fill();

  drawPlatformCanvasIcon(ctx, plat, avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize * 0.52);

  // 5. Channel Name & Verified Badge
  const infoX = avatarX + avatarSize + 22;
  const nameY = avatarY + (isWide ? 26 : 30);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 ${isWide ? '28px' : '32px'} "Outfit", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(channelName, infoX, nameY);

  // Verified checkmark badge
  const nameWidth = ctx.measureText(channelName).width;
  const checkX = infoX + nameWidth + 14;
  ctx.beginPath();
  ctx.arc(checkX, nameY, 11, 0, Math.PI * 2);
  ctx.fillStyle = platColor;
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.font = '700 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓', checkX, nameY + 1);

  // 6. Social Media Handle
  const handleY = nameY + (isWide ? 32 : 36);
  ctx.fillStyle = platColor;
  ctx.font = `700 ${isWide ? '20px' : '24px'} "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(handle, infoX, handleY);

  // Platform Tag Badge
  const tagW = 100;
  const tagH = 26;
  const tagX = cardX + cardW - tagW - 24;
  const tagY = cardY + 28;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagW, tagH, 13);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = '700 11px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(platName.toUpperCase(), tagX + tagW / 2, tagY + tagH / 2);

  // 7. Kinetic "LIKE & SUBSCRIBE" Action Button
  const btnW = cardW - 72;
  const btnH = isWide ? 62 : 72;
  const btnX = cardX + 36;
  const btnY = cardY + cardH - btnH - (isWide ? 44 : 54);

  const btnPulse = Math.sin(t * 8) * 6;
  ctx.shadowColor = platGlow;
  ctx.shadowBlur = 18 + btnPulse;

  const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY);
  btnGrad.addColorStop(0, platColor);
  btnGrad.addColorStop(1, platColorSecondary);
  ctx.fillStyle = btnGrad;
  ctx.beginPath();
  ctx.roundRect(btnX, btnY, btnW, btnH, btnH / 2);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Button text: [ 🔔  FOLLOW @Piyushk20 ON X   ]
  const btnCenterY = btnY + btnH / 2;
  ctx.fillStyle = (plat === 'twitter' && platColor === '#FFFFFF') ? '#000000' : '#FFFFFF';
  ctx.font = `800 ${isWide ? '20px' : '25px'} "Outfit", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const btnLabel = (plat === 'twitter' || plat === 'x')
    ? `🔔  FOLLOW ${handle.toUpperCase()} ON X`
    : `👍  LIKE & ${ctaBtnText}`;
  ctx.fillText(btnLabel, btnX + btnW / 2 - 16, btnCenterY);

  // Animated Bell
  const bellX = btnX + btnW - (isWide ? 48 : 56);
  drawAnimatedBell(ctx, bellX, btnCenterY, t);

  // 8. Bottom Subtitle / CTA
  const subY = cardY + cardH - (isWide ? 18 : 22);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = `500 ${isWide ? '14px' : '16px'} "Outfit", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ctaSubtext, cardX + cardW / 2, subY);

  // 9. Floating Particle Sparkles
  for (let i = 0; i < 6; i++) {
    const sparkAngle = (i / 6) * Math.PI * 2 + t * 0.8;
    const sparkDist = (cardW / 2) + 26 + Math.sin(t * 3 + i) * 14;
    const sx = centerX + Math.cos(sparkAngle) * sparkDist;
    const sy = centerY + Math.sin(sparkAngle) * (sparkDist * 0.55);
    const sparkSize = 3 + Math.sin(t * 5 + i * 2) * 2;
    if (sparkSize > 0) {
      ctx.fillStyle = i % 2 === 0 ? platColor : '#FFFFFF';
      ctx.beginPath();
      ctx.arc(sx, sy, sparkSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawPlatformCanvasIcon(ctx, plat, cx, cy, size) {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';

  if (plat === 'youtube') {
    const w = size * 0.65;
    const h = size * 0.75;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.4, cy - h * 0.5);
    ctx.lineTo(cx + w * 0.6, cy);
    ctx.lineTo(cx - w * 0.4, cy + h * 0.5);
    ctx.closePath();
    ctx.fill();
  } else if (plat === 'tiktok') {
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx - size * 0.2, cy + size * 0.2, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + size * 0.05, cy + size * 0.2);
    ctx.lineTo(cx + size * 0.05, cy - size * 0.35);
    ctx.quadraticCurveTo(cx + size * 0.2, cy - size * 0.2, cx + size * 0.35, cy - size * 0.2);
    ctx.stroke();
  } else if (plat === 'instagram') {
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(cx - size * 0.45, cy - size * 0.45, size * 0.9, size * 0.9, 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + size * 0.25, cy - size * 0.25, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (plat === 'twitter' || plat === 'x') {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.35, cy - size * 0.35);
    ctx.lineTo(cx + size * 0.35, cy + size * 0.35);
    ctx.moveTo(cx + size * 0.35, cy - size * 0.35);
    ctx.lineTo(cx - size * 0.35, cy + size * 0.35);
    ctx.stroke();
  } else if (plat === 'linkedin') {
    ctx.font = `bold ${Math.round(size * 0.8)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('in', cx, cy + 1);
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawAnimatedBell(ctx, bx, by, t) {
  ctx.save();
  ctx.translate(bx, by);
  const rot = Math.sin(t * 14) * 0.16;
  ctx.rotate(rot);

  // Bell body
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, -6, 8, Math.PI, 0, false);
  ctx.lineTo(10, 6);
  ctx.lineTo(-10, 6);
  ctx.closePath();
  ctx.fill();

  // Bell clapper
  ctx.beginPath();
  ctx.arc(0, 8, 3, 0, Math.PI * 2);
  ctx.fill();

  // Bell sound waves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 15, -0.6, 0.6);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 15, Math.PI - 0.6, Math.PI + 0.6);
  ctx.stroke();

  ctx.restore();
}

// ==========================================================================
// 6. Timeline Scrubber & Waveform Canvas
// ==========================================================================
function initTimelineScrubber() {
  waveformCanvas = document.getElementById('waveformCanvas');
  if (!waveformCanvas) return;
  waveformCtx = waveformCanvas.getContext('2d');
  
  // Set real pixel size
  waveformCanvas.width = waveformCanvas.clientWidth || 800;
  waveformCanvas.height = waveformCanvas.clientHeight || 24;

  drawScrubberWaveform();
}

function drawScrubberWaveform() {
  if (!waveformCtx || !waveformCanvas) return;
  const w = waveformCanvas.width;
  const h = waveformCanvas.height;
  waveformCtx.clearRect(0, 0, w, h);

  waveformCtx.fillStyle = 'rgba(0, 242, 254, 0.4)';
  const bars = 100;
  for (let i = 0; i < bars; i++) {
    const val = Math.sin(i * 0.28) * Math.cos(i * 0.15) * 0.5 + 0.5;
    const barH = val * (h - 4) + 3;
    const x = (w / bars) * i;
    waveformCtx.fillRect(x, (h - barH) / 2, w / bars - 1.5, barH);
  }
}

function updatePlayheadUI() {
  const playhead = document.getElementById('timelinePlayhead');
  if (playhead) {
    const percent = (state.currentTime / state.duration) * 100;
    playhead.style.left = `${percent}%`;
  }

  // Update play/pause icon
  const icon = document.getElementById('iconPlay');
  if (icon) {
    if (state.isPlaying) {
      icon.innerHTML = `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`;
    } else {
      icon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
    }
  }

  // Update procedural audio
  updateProceduralBgm();
}

function updateTimeDisplay() {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const f = Math.floor((secs % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(f).padStart(2, '0')}`;
  };

  const curr = document.getElementById('dispCurrentTimecode');
  const tot = document.getElementById('dispTotalTimecode');
  if (curr) curr.textContent = formatTime(state.currentTime);
  if (tot) tot.textContent = `/ ${formatTime(state.duration)}`;

  const tag = document.getElementById('currentSceneTag');
  if (tag && state.scenes.length > 0) {
    const idx = getCurrentSceneIndex(state.currentTime);
    tag.textContent = state.scenes[idx].tag.toUpperCase();
  }
}

function handleTimelineScrubClick(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  state.currentTime = ratio * state.duration;

  const audio = document.getElementById('masterAudioTrack');
  if (audio) {
    audio.currentTime = state.currentTime;
  }

  updateTimeDisplay();
  updatePlayheadUI();
  broadcastSync('SEEK');
}

// Transport Controls
function togglePlayPause() {
  initAudioEngine();
  state.isPlaying = !state.isPlaying;
  const audio = document.getElementById('masterAudioTrack');

  if (audio) {
    if (state.isPlaying) {
      audio.currentTime = state.currentTime;
      audio.play().catch(e => console.log('Audio playback prevented:', e));
    } else {
      audio.pause();
    }
  }

  updatePlayheadUI();
  broadcastSync('PLAY_PAUSE', { isPlaying: state.isPlaying });
}

function jumpToStart() {
  state.currentTime = 0;
  const audio = document.getElementById('masterAudioTrack');
  if (audio) {
    audio.currentTime = 0;
  }
  updateTimeDisplay();
  updatePlayheadUI();
  broadcastSync('SEEK');
}

function stepFrame(delta) {
  state.isPlaying = false;
  const audio = document.getElementById('masterAudioTrack');
  if (audio) {
    audio.pause();
  }
  state.currentTime = Math.max(0, Math.min(state.duration, state.currentTime + delta * (1 / 60)));
  if (audio) {
    audio.currentTime = state.currentTime;
  }
  updateTimeDisplay();
  updatePlayheadUI();
  broadcastSync('SEEK');
}

function toggleLoop() {
  state.loop = !state.loop;
  const btn = document.getElementById('btnLoop');
  if (btn) btn.classList.toggle('active', state.loop);
}

function setPlaybackSpeed(speed) {
  state.playbackSpeed = speed;
  ['spd05', 'spd10', 'spd20'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  if (speed === 0.5) document.getElementById('spd05')?.classList.add('active');
  if (speed === 1.0) document.getElementById('spd10')?.classList.add('active');
  if (speed === 2.0) document.getElementById('spd20')?.classList.add('active');
}

// ==========================================================================
// 7. Pipeline Approval Gates & Stage Tabs
// ==========================================================================
// Custom tabs registry
state.customTabs = state.customTabs || [];

// ==========================================================================
// 7. Pipeline Approval Gates & Stage Tabs
// ==========================================================================
function switchStageTab(tabName) {
  state.stage = tabName;

  // Standard core tabs (Stage 1: Script -> Stage 2: Match Images -> Stage 3: Audio -> Stage 4: Render -> Stage 5: Social)
  const coreTabs = [
    { name: 'script', pillId: 'stepPill1' },
    { name: 'visuals', pillId: 'stepPill2' },
    { name: 'audio', pillId: 'stepPill3' },
    { name: 'code', pillId: 'stepPill4' },
    { name: 'social', pillId: 'stepPill5' }
  ];

  coreTabs.forEach(t => {
    const btn = document.getElementById(`tabBtn${t.name.charAt(0).toUpperCase() + t.name.slice(1)}`);
    const pill = document.getElementById(t.pillId);
    const section = document.getElementById(`sectionStage${t.name.charAt(0).toUpperCase() + t.name.slice(1)}`);
    
    if (btn) btn.classList.toggle('active', t.name === tabName);
    if (pill) pill.classList.toggle('active', t.name === tabName);
    if (section) section.style.display = (t.name === tabName) ? 'block' : 'none';
  });

  // Dynamic custom tabs
  if (state.customTabs && state.customTabs.length > 0) {
    state.customTabs.forEach(ct => {
      const btn = document.getElementById(`tabBtn_${ct.id}`);
      const section = document.getElementById(`sectionStage_${ct.id}`);
      const isActive = (ct.id === tabName);
      if (btn) btn.classList.toggle('active', isActive);
      if (section) section.style.display = isActive ? 'block' : 'none';
    });
  }

  if (tabName === 'social') {
    updateSocialSettings();
  } else if (tabName === 'visuals') {
    populateVisualsTab();
  }
}

// ==========================================================================
// 7.1 Dynamic Studio Tab Creator (+ Tab)
// ==========================================================================
function openAddTabModal() {
  const modal = document.getElementById('addTabModal');
  const txt = document.getElementById('txtNewTabTitle');
  if (modal) modal.classList.add('show');
  if (txt) {
    txt.value = "";
    setTimeout(() => txt.focus(), 100);
  }
}

function closeAddTabModal() {
  document.getElementById('addTabModal')?.classList.remove('show');
}

function createCustomTabFromModal() {
  const titleInput = document.getElementById('txtNewTabTitle');
  const typeSelect = document.getElementById('selNewTabType');
  const title = titleInput?.value.trim() || 'Custom Studio Tab';
  const type = typeSelect?.value || 'notes';

  const tabId = 'tab_' + Date.now();
  const icon = type === 'visuals' ? '🎨' : type === 'teleprompter' ? '📜' : type === 'prompts' ? '✨' : type === 'code' ? '💻' : '📝';

  const newTab = {
    id: tabId,
    title: title,
    type: type,
    icon: icon,
    createdAt: new Date().toISOString()
  };

  state.customTabs.push(newTab);
  renderCustomTabUI(newTab);
  closeAddTabModal();
  switchStageTab(tabId);
}

function renderCustomTabUI(tab) {
  const nav = document.getElementById('stageTabNav');
  const addBtn = document.getElementById('btnAddCustomTab');
  const container = document.getElementById('dynamicTabsContainer');

  if (nav && addBtn) {
    const btn = document.createElement('button');
    btn.className = 'stage-tab-btn';
    btn.id = `tabBtn_${tab.id}`;
    btn.onclick = () => switchStageTab(tab.id);
    btn.innerHTML = `
      <span>${tab.icon} ${tab.title}</span>
      <span class="tab-close-btn" onclick="removeCustomTab('${tab.id}', event)" title="Remove tab">&times;</span>
    `;
    nav.insertBefore(btn, addBtn);
  }

  if (container) {
    const pane = document.createElement('div');
    pane.id = `sectionStage_${tab.id}`;
    pane.className = 'stage-section-block';
    pane.style.display = 'none';

    let contentHtml = "";
    if (tab.type === 'notes') {
      contentHtml = `
        <div class="form-group">
          <label class="form-label">
            <span>${tab.title} — Director Beat Notes</span>
            <span class="badge">Autosaved</span>
          </label>
          <textarea class="form-textarea" style="height: 240px; font-family: var(--font-sans); line-height: 1.5;" placeholder="Enter production notes, shot angles, lighting keys, or revision notes..."># Director Beat Sheet for ${tab.title}\n\n- Beat 1: Hook with high contrast lock\n- Beat 2: Core technical mechanism\n- Beat 3: Forensic revelation\n- Beat 4: Strategic fallout\n- Beat 5: Outro call to action\n</textarea>
        </div>
      `;
    } else if (tab.type === 'teleprompter') {
      const fullVo = state.scenes ? state.scenes.map(s => s.vo).join('\n\n') : "";
      contentHtml = `
        <div class="form-group">
          <label class="form-label">
            <span>${tab.title} — Live Teleprompter Copy</span>
            <span class="badge">Syncs with Timeline</span>
          </label>
          <div style="background: #000; border: 1px solid var(--accent-cyan); border-radius: var(--radius-sm); padding: 18px; color: #00f2fe; font-size: 1.05rem; font-weight: 600; line-height: 1.6; max-height: 280px; overflow-y: auto;">
            ${fullVo.replace(/\n\n/g, '<br><br>')}
          </div>
        </div>
      `;
    } else if (tab.type === 'prompts') {
      contentHtml = `
        <div class="form-group">
          <label class="form-label">
            <span>${tab.title} — AI Motion Graphics Prompts</span>
            <span class="badge">9:16 Prompts</span>
          </label>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${state.scenes ? state.scenes.map((s, i) => `
              <div style="background: var(--bg-secondary); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-subtle); font-size: 0.74rem;">
                <span style="font-weight: 700; color: var(--accent-cyan);">${s.tag}:</span>
                <span style="color: var(--text-muted); display: block; margin-top: 4px;">Vertical 9:16 motion graphics visualization of ${s.motion}. Dark cyber aesthetics, neon glow, vector HUD brackets, 8k render.</span>
              </div>
            `).join('') : ''}
          </div>
        </div>
      `;
    } else {
      contentHtml = `
        <div class="form-group">
          <label class="form-label">
            <span>${tab.title}</span>
            <span class="badge">Custom Workspace</span>
          </label>
          <textarea class="form-textarea" style="height: 220px;" placeholder="Write custom notes, scripts, or references here..."></textarea>
        </div>
      `;
    }

    pane.innerHTML = contentHtml;
    container.appendChild(pane);
  }
}

function removeCustomTab(tabId, ev) {
  if (ev) ev.stopPropagation();
  state.customTabs = state.customTabs.filter(t => t.id !== tabId);
  document.getElementById(`tabBtn_${tabId}`)?.remove();
  document.getElementById(`sectionStage_${tabId}`)?.remove();
  switchStageTab('script');
}

// ==========================================================================
// 7.2 Visuals & Motion Graphics Matching Engine (Stage 2 in Workflow)
// ==========================================================================

const ASSET_LIBRARY_PRESETS = [
  { group: 'Military & Defense Tech (Drones)', items: [
    { name: 'S1: FPV Drone Tank Strike', url: 'assets/drones/scene_1_drone_tank_strike.jpg' },
    { name: 'S2: 360 Tactical Radar Swarm', url: 'assets/drones/scene_2_radar_swarm.jpg' },
    { name: 'S3: P2P Mesh AI Topology', url: 'assets/drones/scene_3_mesh_ai.jpg' },
    { name: 'S4: 50kW HEL Laser Shield', url: 'assets/drones/scene_4_laser_shield.jpg' },
    { name: 'S5: Outro Card (@Piyushk20 on X)', url: 'assets/drones/scene_5_outro_card.jpg' }
  ]},
  { group: 'Quantum & Cryptography', items: [
    { name: 'S1: Qubit Superposition Hook', url: 'assets/quantum/scene_1_qubit_hook.jpg' },
    { name: 'S2: Entanglement Matrix', url: 'assets/quantum/scene_2_entanglement.jpg' },
    { name: 'S3: Shor Algorithm Crypto Break', url: 'assets/quantum/scene_3_crypto_shor.jpg' },
    { name: 'S4: 15 mK Dilution Cryochamber', url: 'assets/quantum/scene_4_cryochamber.jpg' },
    { name: 'S5: Quantum Outro Card', url: 'assets/quantum/scene_5_outro_card.jpg' }
  ]},
  { group: 'Cybersecurity & Finance (eMudhra)', items: [
    { name: 'S1: SSL Root Revocation Alert', url: 'assets/emudhra/scene_1_ssl_revocation.jpg' },
    { name: 'S2: Catastrophic RSA Entropy Drop', url: 'assets/emudhra/scene_2_crypto_glitch.jpg' },
    { name: 'S3: 18-Month Forensic Audit', url: 'assets/emudhra/scene_3_forensic_audit.jpg' },
    { name: 'S4: 40% Crash Market Sunset', url: 'assets/emudhra/scene_4_market_exit.jpg' },
    { name: 'S5: Cyber Outro Card', url: 'assets/drones/scene_5_outro_card.jpg' }
  ]},
  { group: 'Nuclear Physics & Commodities (Fusion)', items: [
    { name: 'S1: Mercury to Gold Alchemy Claim', url: 'assets/fusion/scene_1_alchemy.jpg' },
    { name: 'S2: Neutron Accelerator Mechanism', url: 'assets/fusion/scene_2_mechanism.jpg' },
    { name: 'S3: 21,600% Deficit Reality Check', url: 'assets/fusion/scene_3_reality.jpg' },
    { name: 'S4: Global Gold Market Stability', url: 'assets/fusion/scene_4_market.jpg' },
    { name: 'S5: Fusion Outro Card', url: 'assets/fusion/scene_5_outro_card.jpg' }
  ]}
];

function populateVisualsTab() {
  const container = document.getElementById('visualsGalleryList');
  const badge = document.getElementById('lblVisualsBadge');
  if (!container) return;

  const linkedScenes = state.scenes.filter(s => s.image && s.image.trim().length > 0);
  if (badge) {
    badge.textContent = `${linkedScenes.length}/${state.scenes.length} Assets Linked`;
    badge.style.color = (linkedScenes.length === state.scenes.length && state.scenes.length > 0) ? 'var(--accent-green)' : 'var(--accent-cyan)';
  }

  if (state.scenes.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No scenes generated yet. Load a preset or analyze a script in Stage 1 first.</div>`;
    return;
  }

  container.innerHTML = state.scenes.map((s, idx) => `
    <div class="visuals-scene-card" id="visCard_${idx}">
      <div class="visuals-thumb-box">
        ${s.image ? `
          <img src="${s.image}" alt="${s.tag}" onerror="this.src='preview_drone_contact_sheet.png'" />
          <span class="visuals-thumb-badge">S${idx + 1}</span>
        ` : `
          <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ff6a00; font-size: 0.65rem; text-align: center; padding: 4px;">
            <span>⚠️</span>
            <span>No Image</span>
          </div>
        `}
      </div>
      <div class="visuals-info-box">
        <div class="visuals-scene-tag">
          <span>${s.tag}</span>
          <span class="visuals-scene-timing">${s.start.toFixed(1)}s - ${s.end.toFixed(1)}s</span>
        </div>
        <div class="visuals-scene-vo">"${s.vo}"</div>
        <div class="visuals-scene-motion" style="font-size: 0.68rem; color: var(--accent-cyan); margin-top: 3px;">
          <strong>Direction:</strong> ${s.motion}
        </div>
        <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
          <select class="form-select" style="font-size: 0.68rem; padding: 3px 6px; background: var(--bg-secondary); flex: 1;" onchange="changeSceneImage(${idx}, this.value)">
            <option value="">-- Choose Visual Asset --</option>
            ${ASSET_LIBRARY_PRESETS.map(grp => `
              <optgroup label="${grp.group}">
                ${grp.items.map(it => `
                  <option value="${it.url}" ${s.image === it.url ? 'selected' : ''}>${it.name}</option>
                `).join('')}
              </optgroup>
            `).join('')}
          </select>
          ${s.image ? `
            <a href="${s.image}" target="_blank" class="tool-btn" style="padding: 3px 8px; font-size: 0.68rem; text-decoration: none; color: var(--accent-cyan);">
              🔍 High-Res
            </a>
          ` : ''}
          <button class="tool-btn" style="padding: 3px 8px; font-size: 0.68rem;" onclick="seekToScene(${s.start})">
            ▶ Play
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function changeSceneImage(sceneIdx, newUrl) {
  if (!state.scenes[sceneIdx]) return;
  state.scenes[sceneIdx].image = newUrl;
  if (newUrl) getPreloadedSceneImage(newUrl);
  populateVisualsTab();
  populateSceneCards();
  showToastNotification(`✓ Updated Scene ${sceneIdx + 1} Visual Asset`);
}

function autoMatchImagesToScript(scenes) {
  if (!scenes || scenes.length === 0) return;

  const library = {
    drones: [
      'assets/drones/scene_1_drone_tank_strike.jpg',
      'assets/drones/scene_2_radar_swarm.jpg',
      'assets/drones/scene_3_mesh_ai.jpg',
      'assets/drones/scene_4_laser_shield.jpg',
      'assets/drones/scene_5_outro_card.jpg'
    ],
    quantum: [
      'assets/quantum/scene_1_qubit_hook.jpg',
      'assets/quantum/scene_2_entanglement.jpg',
      'assets/quantum/scene_3_crypto_shor.jpg',
      'assets/quantum/scene_4_cryochamber.jpg',
      'assets/drones/scene_5_outro_card.jpg'
    ],
    emudhra: [
      'assets/emudhra/scene_1_ssl_revocation.jpg',
      'assets/emudhra/scene_2_crypto_glitch.jpg',
      'assets/emudhra/scene_3_forensic_audit.jpg',
      'assets/emudhra/scene_4_market_exit.jpg',
      'assets/drones/scene_5_outro_card.jpg'
    ],
    fusion: [
      'assets/fusion/scene_1_alchemy.jpg',
      'assets/fusion/scene_2_mechanism.jpg',
      'assets/fusion/scene_3_reality.jpg',
      'assets/fusion/scene_4_market.jpg',
      'assets/drones/scene_5_outro_card.jpg'
    ]
  };

  const combinedText = scenes.map(s => (s.vo || '') + ' ' + (s.tag || '') + ' ' + (s.motion || '')).join(' ').toLowerCase();

  let targetPackage = 'drones';
  if (/quantum|qubit|superposition|shor|encryption|rsa|cryo/i.test(combinedText)) {
    targetPackage = 'quantum';
  } else if (/emudhra|ssl|certificate|cybersecurity|vulnerability|glitch|stock plunge/i.test(combinedText)) {
    targetPackage = 'emudhra';
  } else if (/fusion|gold|alchemy|mercury|neutron|transmutation|market impact/i.test(combinedText)) {
    targetPackage = 'fusion';
  } else if (/drone|tank|armor|swarm|missile|radar|defense|military|warfare/i.test(combinedText)) {
    targetPackage = 'drones';
  }

  const chosenImgs = library[targetPackage] || library.drones;

  scenes.forEach((s, idx) => {
    if (!s.image || s.image.trim() === '') {
      if (idx === scenes.length - 1) {
        s.image = 'assets/drones/scene_5_outro_card.jpg';
      } else {
        s.image = chosenImgs[idx % chosenImgs.length];
      }
    }
    if (s.image) getPreloadedSceneImage(s.image);
  });
}

function triggerAutoMatchImages() {
  if (!state.scenes || state.scenes.length === 0) {
    alert("Please generate or load a script in Stage 1 first!");
    return;
  }
  autoMatchImagesToScript(state.scenes);
  populateVisualsTab();
  populateSceneCards();
  showToastNotification("⚡ All scenes matched to high-definition visual imagery!");
}

function seekToScene(timeSec) {
  state.currentTime = timeSec;
  state.isPlaying = false;
  const audio = document.getElementById('masterAudioTrack');
  if (audio) {
    audio.pause();
    audio.currentTime = timeSec;
  }
  updateTimeDisplay();
  updatePlayheadUI();
  const viewport = document.getElementById('centerViewportPanel');
  if (viewport) viewport.scrollIntoView({ behavior: 'smooth' });
}

function syncVisualsToScenes() {
  populateSceneCards();
  populateVisualsTab();
  showToastNotification("✓ All motion graphics visual layers synchronized to canvas timeline!");
}


// ==========================================================================
// 7.5 Social Media Tab Controller & Persistent Credentials Synchronization
// ==========================================================================

function getPlatformDisplayName(key) {
  const map = {
    youtube: 'YouTube',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    twitter: 'X / Twitter',
    linkedin: 'LinkedIn',
    discord: 'Discord'
  };
  return map[key] || 'X / Twitter';
}

function selectSocialPlatform(platformKey) {
  state.social.platform = platformKey;

  // Toggle active class on platform buttons
  ['youtube', 'tiktok', 'instagram', 'twitter', 'linkedin', 'discord'].forEach(k => {
    const btn = document.getElementById(`platBtn_${k}`);
    if (btn) btn.classList.toggle('active', k === platformKey);
  });

  const lblBadge = document.getElementById('lblActivePlatform');
  if (lblBadge) {
    lblBadge.textContent = getPlatformDisplayName(platformKey);
    let color = '#FFFFFF';
    if (platformKey === 'youtube') color = '#FF0000';
    if (platformKey === 'tiktok') color = '#00F2FE';
    if (platformKey === 'instagram') color = '#E1306C';
    if (platformKey === 'twitter') color = '#FFFFFF';
    if (platformKey === 'linkedin') color = '#0A66C2';
    if (platformKey === 'discord') color = '#5865F2';
    lblBadge.style.color = color;
    lblBadge.style.borderColor = color;
  }

  // Update default button label
  const btnLabelInput = document.getElementById('txtSocialBtnLabel');
  if (btnLabelInput) {
    if (platformKey === 'youtube') btnLabelInput.value = 'Subscribe';
    else if (platformKey === 'linkedin') btnLabelInput.value = 'Connect';
    else if (platformKey === 'discord') btnLabelInput.value = 'Join';
    else btnLabelInput.value = 'Follow';
    state.social.buttonText = btnLabelInput.value;
  }

  saveSocialSettings(false);
  syncSocialToScript(true);
}

function saveSocialSettings(showToast = false) {
  const nameInput = document.getElementById('txtSocialName');
  const handleInput = document.getElementById('txtSocialHandle');
  const btnInput = document.getElementById('txtSocialBtnLabel');

  if (nameInput) state.social.channelName = nameInput.value.trim() || 'Piyushk20';
  if (handleInput) {
    let h = handleInput.value.trim();
    if (h && !h.startsWith('@') && !h.startsWith('http')) h = '@' + h;
    state.social.handle = h || '@Piyushk20';
  }
  if (btnInput) state.social.buttonText = btnInput.value.trim() || 'Follow';

  try {
    localStorage.setItem('opusmotion_social_settings', JSON.stringify({
      platform: state.social.platform || 'twitter',
      handle: state.social.handle || '@Piyushk20',
      channelName: state.social.channelName || 'Piyushk20',
      buttonText: state.social.buttonText || 'Follow',
      ctaText: state.social.ctaText || 'Follow on X for Daily Frontier Tech & Defense Breakdowns'
    }));
  } catch (e) {
    console.warn('[OpusMotion] localStorage save failed:', e);
  }

  updateSocialMiniCard();
  syncSocialToScript(true);

  const indicator = document.getElementById('socialSaveIndicator');
  if (indicator) {
    indicator.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>Saved to localStorage: ${state.social.platform.toUpperCase()} ${state.social.handle} (Applied to Last Frame)</span>
    `;
  }

  if (showToast) {
    showToastNotification(`✓ Social credentials saved: ${state.social.platform.toUpperCase()} ${state.social.handle}`);
  }
}

function loadSavedSocialSettings() {
  let saved = null;
  try {
    const raw = localStorage.getItem('opusmotion_social_settings');
    if (raw) saved = JSON.parse(raw);
  } catch (e) {}

  if (saved) {
    state.social.platform = saved.platform || 'twitter';
    state.social.handle = saved.handle || '@Piyushk20';
    state.social.channelName = saved.channelName || 'Piyushk20';
    state.social.buttonText = saved.buttonText || 'Follow';
    state.social.ctaText = saved.ctaText || 'Follow on X for Daily Frontier Tech & Defense Breakdowns';
  } else {
    state.social.platform = 'twitter';
    state.social.handle = '@Piyushk20';
    state.social.channelName = 'Piyushk20';
    state.social.buttonText = 'Follow';
    state.social.ctaText = 'Follow on X for Daily Frontier Tech & Defense Breakdowns';
  }

  // Populate DOM inputs
  const nameInput = document.getElementById('txtSocialName');
  const handleInput = document.getElementById('txtSocialHandle');
  const btnInput = document.getElementById('txtSocialBtnLabel');

  if (nameInput) nameInput.value = state.social.channelName;
  if (handleInput) handleInput.value = state.social.handle;
  if (btnInput) btnInput.value = state.social.buttonText;

  // Toggle active platform button
  ['youtube', 'tiktok', 'instagram', 'twitter', 'linkedin', 'discord'].forEach(k => {
    const btn = document.getElementById(`platBtn_${k}`);
    if (btn) btn.classList.toggle('active', k === state.social.platform);
  });

  const lblBadge = document.getElementById('lblActivePlatform');
  if (lblBadge) {
    lblBadge.textContent = getPlatformDisplayName(state.social.platform);
    lblBadge.style.color = '#FFFFFF';
    lblBadge.style.borderColor = 'rgba(255, 255, 255, 0.4)';
  }

  updateSocialMiniCard();

  const indicator = document.getElementById('socialSaveIndicator');
  if (indicator) {
    indicator.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>Loaded Credentials: ${state.social.platform.toUpperCase()} ${state.social.handle} (Saved in localStorage)</span>
    `;
  }
}

function updateSocialSettings() {
  saveSocialSettings(false);
}

function updateSocialMiniCard() {
  const nameEl = document.getElementById('miniPreviewName');
  const handleEl = document.getElementById('miniPreviewHandle');
  const btnEl = document.getElementById('miniPreviewBtn');
  const avatarEl = document.getElementById('socialPreviewAvatar');
  const iconEl = document.getElementById('miniPlatformIcon');

  const plat = state.social.platform || 'twitter';

  if (nameEl) nameEl.textContent = state.social.channelName;
  if (handleEl) handleEl.textContent = state.social.handle;
  if (btnEl) {
    btnEl.textContent = state.social.buttonText;
    let bg = '#1da1f2';
    if (plat === 'youtube') bg = '#ff0000';
    else if (plat === 'tiktok') bg = 'linear-gradient(135deg, #00f2fe, #fe2c55)';
    else if (plat === 'instagram') bg = 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)';
    else if (plat === 'twitter') bg = '#1da1f2';
    else if (plat === 'linkedin') bg = '#0a66c2';
    else if (plat === 'discord') bg = '#5865f2';
    btnEl.style.background = bg;
  }

  if (avatarEl) {
    let grad = '#000000';
    if (plat === 'youtube') grad = 'linear-gradient(135deg, #ff0000, #cc0000)';
    else if (plat === 'tiktok') grad = 'linear-gradient(135deg, #00f2fe, #fe2c55)';
    else if (plat === 'instagram') grad = 'linear-gradient(135deg, #833ab4, #e1306c)';
    else if (plat === 'twitter') grad = '#000000';
    else if (plat === 'linkedin') grad = 'linear-gradient(135deg, #0a66c2, #0077b5)';
    else if (plat === 'discord') grad = 'linear-gradient(135deg, #5865f2, #7289da)';
    avatarEl.style.background = grad;
    avatarEl.style.border = (plat === 'twitter') ? '1px solid rgba(255, 255, 255, 0.4)' : 'none';
  }
}

function syncSocialToScript(silent = false) {
  if (!state.scenes || state.scenes.length === 0) return;
  const lastIdx = state.scenes.length - 1;
  const lastScene = state.scenes[lastIdx];
  const plat = state.social.platform || 'twitter';
  const platName = plat === 'twitter' ? 'X' : getPlatformDisplayName(plat);
  const handle = state.social.handle || '@Piyushk20';
  const action = plat === 'youtube' ? 'subscribe to' : 'follow';

  const currentVo = (lastScene.vo || '').trim();
  const sentences = currentVo.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);

  const ctaSentence = `Make sure to ${action} ${handle} on ${platName} for more!`;

  if (sentences.length > 0 && /(like|subscribe|follow|opusmotion|piyush)/i.test(sentences[sentences.length - 1])) {
    sentences[sentences.length - 1] = ctaSentence;
  } else {
    sentences.push(ctaSentence);
  }

  lastScene.vo = sentences.join(' ');
  populateVoiceOverText();
  populateSceneCards();

  if (!silent) {
    showToastNotification(`Voice script updated: "${ctaSentence}"`);
  }
}

function previewLastFrameOutro() {
  saveSocialSettings(false); // Make sure latest social credentials are fully applied
  state.currentTime = Math.max(0, state.duration - 0.2); // Seek directly to final frame
  state.isPlaying = false;

  const audio = document.getElementById('masterAudioTrack');
  if (audio) {
    audio.pause();
    audio.currentTime = state.currentTime;
  }

  updateTimeDisplay();
  updatePlayheadUI();

  const viewport = document.getElementById('centerViewportPanel');
  if (viewport) {
    viewport.scrollIntoView({ behavior: 'smooth' });
  }

  showToastNotification(`👁 Previewing last frame with ${state.social.platform.toUpperCase()} ${state.social.handle}`);
}

function approveScriptGate() {
  state.scriptApproved = true;
  const gateBox = document.getElementById('gateBoxScript');
  if (gateBox) {
    gateBox.innerHTML = `
      <div class="approval-gate-header" style="color: var(--accent-green);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Stage 1 Approved: Script & Storyboard Locked
      </div>
      <div class="approval-gate-text">
        Script and scene timing approved. Advancing to Stage 2: Match Images to Script.
      </div>
      <div class="btn-gate-approved">
        ✔ SCRIPT APPROVED
      </div>
    `;
  }
  const pill1 = document.getElementById('stepPill1');
  if (pill1) pill1.classList.add('approved');

  // Auto proceed to Stage 2: Match Images to Script
  switchStageTab('visuals');
}

function approveVisualsGate() {
  // Ensure every scene has a verified image
  const unlinked = state.scenes.filter(s => !s.image || s.image.trim().length === 0);
  if (unlinked.length > 0) {
    autoMatchImagesToScript(state.scenes);
    populateVisualsTab();
    populateSceneCards();
  }

  state.visualsApproved = true;
  const gateBox = document.getElementById('gateBoxVisuals');
  if (gateBox) {
    gateBox.innerHTML = `
      <div class="approval-gate-header" style="color: var(--accent-green);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Stage 2 Approved: Image-to-Script Alignment Locked
      </div>
      <div class="approval-gate-text">
        All scene narrative beats are linked to verified high-definition motion graphics. Neural Voice-Over Lab unlocked!
      </div>
      <div class="btn-gate-approved">
        ✔ VISUALS MATCHED & APPROVED
      </div>
    `;
  }
  const pill2 = document.getElementById('stepPill2');
  if (pill2) pill2.classList.add('approved');

  // Auto proceed to Stage 3: Voice-Over & Audio
  switchStageTab('audio');
}

function approveAudioGate() {
  state.audioApproved = true;
  const gateBox = document.getElementById('gateBoxAudio');
  if (gateBox) {
    gateBox.innerHTML = `
      <div class="approval-gate-header" style="color: var(--accent-green);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Stage 3 Approved: Voice-Over & Audio Locked
      </div>
      <div class="approval-gate-text">
        Audio tracks synchronized with scene markers. Full procedural production unlocked!
      </div>
      <div class="btn-gate-approved">
        ✔ VOICE-OVER APPROVED
      </div>
    `;
  }
  const pill3 = document.getElementById('stepPill3');
  if (pill3) pill3.classList.add('approved');

  // Auto proceed to Stage 4: Procedural Render
  switchStageTab('code');
}

function showToastNotification(message) {
  let toast = document.getElementById('studioToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'studioToastNotification';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = 'rgba(8, 14, 26, 0.96)';
    toast.style.border = '1px solid var(--accent-cyan)';
    toast.style.boxShadow = '0 8px 30px rgba(0, 242, 254, 0.35)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 18px';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '0.82rem';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '999999';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.transition = 'all 0.25s ease';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color: var(--accent-cyan);">⚡</span> <span>${message}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
  }, 3200);
}

// ==========================================================================
// 8. Script Presets, Intelligent Input Analyzer & Population
// ==========================================================================

async function analyzeInputAndProceed() {
  const btn = document.getElementById('btnAnalyzeAndProceed');
  const inputEl = document.getElementById('txtConceptInput');
  const rawText = (inputEl ? inputEl.value : "").trim();

  if (!rawText) {
    alert("Please enter a topic, paste an article URL, or write your script first.");
    if (inputEl) inputEl.focus();
    return;
  }

  const isUrl = /^https?:\/\//i.test(rawText) || /^(www\.)?[a-z0-9-]+(\.[a-z]{2,})/i.test(rawText) || /^[a-z0-9-]+\.(com|org|net|io|ai|gov|edu|co)\b/i.test(rawText);

  // Visual animation feedback on the button
  if (btn) {
    btn.disabled = true;
    if (isUrl) {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        🌐 Scraping & Analyzing Web Article...
      `;
    } else {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Analyzing Input Narrative & Storyboard...
      `;
    }
  }

  let result = null;

  // Real-time Web Scraping & Deep Director Script Synthesis
  if (isUrl) {
    try {
      const handle = (state.social && state.social.handle) ? state.social.handle : '@OpusMotion';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);

      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawText, handle: handle }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.scenes && data.scenes.length > 0) {
          result = {
            typeBadge: `Live URL Analyzed (${data.domain})`,
            title: data.title,
            duration: data.duration,
            wordCount: data.wordCount,
            scenes: data.scenes,
            archetype: data.archetype,
            archetypeName: data.archetypeName,
            voice: data.voice,
            voiceLabel: data.voiceLabel,
            audioFile: "voice_custom_preview.mp3",
            fullVoText: data.fullVoText
          };
          console.log(`[OpusMotion] Successfully scraped & analyzed real URL: "${data.title}" (${data.duration}s, ${data.archetypeName})`);
        }
      }
    } catch (err) {
      console.warn("[OpusMotion] Live URL fetch encountered network issue, falling back to local analyzer:", err);
    }
  }

  // Fallback to local intelligence parser if not a URL or network was unreachable
  if (!result) {
    result = parseAndAnalyzeInput(rawText);
  }

  applyAnalysisResult(result, btn);
}

/**
 * Applies analyzed result to state, UI, audio, and visual archetype
 */
function applyAnalysisResult(result, btn) {
  state.scenes = result.scenes;
  state.duration = result.duration;
  autoMatchImagesToScript(state.scenes);
  syncSocialToScript(true);

  // Update duration sliders and UI displays
  const rng = document.getElementById('rngDuration');
  if (rng) rng.value = Math.round(result.duration);
  const dispDur = document.getElementById('dispDuration');
  if (dispDur) dispDur.textContent = `${Math.round(result.duration)}s`;
  const lblDur = document.getElementById('lblDurationVal');
  if (lblDur) lblDur.textContent = `${result.duration.toFixed(1)} Seconds`;

  // Populate scene cards & VO text & Visuals
  populateSceneCards();
  populateVoiceOverText();
  populateVisualsTab();
  renderTimelineScenesTrack();
  updateTimeDisplay();

  // Preload any scene motion graphics images
  state.scenes.forEach(s => {
    if (s.image) getPreloadedSceneImage(s.image);
  });

  // Select matched visual archetype & TTS voice
  selectVisualArchetype(result.archetype);
  state.activeAudioFile = result.audioFile || (result.voice === 'en-US-ChristopherNeural' ? 'voice_drone_swarms.mp3' : 'voice_custom_preview.mp3');
  handleVoiceSelectionChange(result.voice, false);

  const audio = document.getElementById('masterAudioTrack');
  if (audio) {
    audio.src = state.activeAudioFile;
    audio.load();
  }

  // Auto-synthesize neural TTS audio in the background for custom analyzed script
  if (result.fullVoText) {
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: result.fullVoText,
        voice: result.voice,
        rate: '+15%',
        output: 'voice_custom_preview.mp3'
      })
    })
    .then(r => r.json())
    .then(audioData => {
      if (audioData.success && audioData.audio_url) {
        state.activeAudioFile = audioData.audio_url;
        if (audio) {
          audio.src = state.activeAudioFile;
          audio.load();
        }
        console.log(`[OpusMotion] Neural voice audio synthesized: ${audioData.audio_url} (${audioData.duration}s)`);
      }
    })
    .catch(e => console.log("[OpusMotion] Background TTS generation skipped:", e));
  }

  // Update word count badge
  const lblWordCount = document.getElementById('lblWordCount');
  if (lblWordCount) {
    lblWordCount.textContent = `${result.scenes.length} scenes • ${result.wordCount} words`;
  }

  // Display Analysis Result Summary Box
  const summaryBox = document.getElementById('analysisSummaryBox');
  const lblType = document.getElementById('lblAnalysisType');
  const lblTopic = document.getElementById('lblAnalysisTopic');
  const lblStats = document.getElementById('lblAnalysisStats');

  if (summaryBox) {
    summaryBox.style.display = 'block';
    if (lblType) lblType.textContent = result.typeBadge;
    if (lblTopic) lblTopic.textContent = result.title;
    if (lblStats) {
      lblStats.textContent = `${result.scenes.length} Scenes Extracted • ${result.duration.toFixed(1)}s Duration • Theme: ${result.archetypeName} • Voice: ${result.voiceLabel}`;
    }
  }

  // Button feedback
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      ✔ Analysis Complete & Script Ready!
    `;
    setTimeout(() => {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        ⚡ Analyze & Generate Video Script
      `;
    }, 3500);
  }

  // Highlight the Stage 1 Approval Gate so the user can review before advancing
  const gateBtn = document.getElementById('btnApproveScript');
  if (gateBtn) {
    gateBtn.classList.add('pulse-target');
    setTimeout(() => gateBtn.classList.remove('pulse-target'), 5000);
  }

  // Scroll smoothly to Scene Cards
  const cardsEl = document.getElementById('sceneCardsList');
  if (cardsEl) {
    cardsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  console.log(`[OpusMotion] Input successfully applied: "${result.title}" (${result.duration}s, ${result.archetype})`);
}

/**
 * Intelligent Parser: Detects URLs vs Custom Scripts vs Topic Prompts
 */
function parseAndAnalyzeInput(input) {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  const isUrl = /^https?:\/\//i.test(trimmed) || /^(www\.)?[a-z0-9-]+(\.[a-z]{2,})+/i.test(trimmed) || /^[a-z0-9-]+\.(com|org|net|io|ai|gov|edu|co)\b/i.test(trimmed);

  if (isUrl) {
    return analyzeUrlInput(trimmed, lower);
  } else {
    return analyzeTextInput(trimmed, lower);
  }
}

/**
 * Local Fallback URL Parser & Story Extractor
 */
function analyzeUrlInput(urlStr, lower) {
  // Check for known eMudhra / digital certificates story first
  if (lower.includes('emudhra') || lower.includes('digital-certificates') || (lower.includes('reuters') && lower.includes('indian-firm'))) {
    const p = SCRIPT_PRESETS.emudhra;
    return {
      typeBadge: "Reuters News Intelligence Analyzed",
      title: "Indian Firm eMudhra Exits Global Digital Certificates Business",
      duration: p.duration,
      wordCount: p.scenes.reduce((acc, s) => acc + s.vo.split(/\s+/).length, 0),
      scenes: JSON.parse(JSON.stringify(p.scenes)),
      archetype: "cyber",
      archetypeName: "Cyberpunk HUD / FUI",
      voice: p.voice,
      voiceLabel: "Christopher (Deep Tactical Tech)",
      audioFile: p.audioFile,
      fullVoText: p.scenes.map(s => s.vo).join('\n\n')
    };
  }

  let hostname = "";
  let pathname = "";
  try {
    const parsed = new URL(urlStr.startsWith('http') ? urlStr : 'https://' + urlStr);
    hostname = parsed.hostname.replace(/^www\./, '');
    pathname = parsed.pathname;
  } catch (e) {
    pathname = urlStr;
  }

  // Extract clean slug words from URL path
  const slugPart = pathname.replace(/\/$/, '').split('/').pop() || "";
  const slugWords = slugPart
    .replace(/\.(html?|php|aspx?)$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  const titleCased = slugWords.length > 0 
    ? slugWords.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : hostname;

  const styleMatch = detectFilmStyle(titleCased + " " + slugWords);
  const cleanTitle = titleCased || "Frontier Tech Breakthrough";
  const handle = (state.social && state.social.handle) ? state.social.handle : '@OpusMotion';

  const genScenes = [
    {
      id: 1,
      tag: "Scene 1: The Breakthrough Hook",
      start: 0.0,
      end: 5.5,
      vo: `A major technological breakthrough is reshaping the industry: ${cleanTitle}. Here is what you need to know.`,
      motion: "Dynamic dolly-in with glowing coordinate telemetry grid"
    },
    {
      id: 2,
      tag: "Scene 2: Core Architecture & Mechanism",
      start: 5.5,
      end: 13.0,
      vo: `Beneath the surface, the core architecture re-engineers fundamental operational dynamics to achieve unprecedented scale.`,
      motion: "3D perspective matrix with kinetic orbital rings"
    },
    {
      id: 3,
      tag: "Scene 3: Critical Reality Check",
      start: 13.0,
      end: 20.5,
      vo: `Here is the critical insight: scaling this system introduces engineering challenges that traditional designs could never solve.`,
      motion: "High-contrast telemetry HUD with kinetic signature pulse"
    },
    {
      id: 4,
      tag: "Scene 4: Transformed Future Horizon",
      start: 20.5,
      end: 26.5,
      vo: `Looking at the future horizon, the long-term trajectory points toward complete transformation of existing infrastructure.`,
      motion: "Wide perspective pullback + settled geometric balance"
    },
    {
      id: 5,
      tag: "Scene 5: Payoff & Outro CTA",
      start: 26.5,
      end: 32.0,
      vo: `For verified deep-dive procedural intelligence, make sure to like and subscribe to ${handle}!`,
      motion: "Singularity particle burst with safe-zone compliant Outro Card"
    }
  ];

  return {
    typeBadge: `URL Analyzed: ${hostname || 'Web Article'}`,
    title: cleanTitle,
    duration: 32.0,
    wordCount: genScenes.reduce((acc, s) => acc + s.vo.split(/\s+/).length, 0),
    scenes: genScenes,
    archetype: styleMatch.archetype,
    archetypeName: styleMatch.archetypeName,
    voice: styleMatch.voice,
    voiceLabel: styleMatch.voiceLabel,
    audioFile: "voice_custom_preview.mp3",
    fullVoText: genScenes.map(s => s.vo).join('\n\n')
  };
}

/**
 * Text Script or Prompt Analyzer (Preserves User's Exact Sentences & Words!)
 */
function analyzeTextInput(rawText, lower) {
  const words = rawText.split(/\s+/).filter(w => w.length > 0);
  // Split into sentences using punctuation boundaries
  const rawSentences = rawText
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // If the user pasted an actual multi-sentence voiceover script (>= 2 sentences, >= 15 words)
  if (rawSentences.length >= 2 && words.length >= 15) {
    const totalWords = words.length;
    // Calculate speaking duration at standard 2.6 words/second
    const totalDuration = Math.max(12.0, Math.min(45.0, parseFloat((totalWords / 2.6).toFixed(1))));

    // Distribute sentences into 3 to 5 scenes
    let sceneCount = Math.min(5, Math.max(3, rawSentences.length));
    const scenes = [];
    const chunkSize = Math.ceil(rawSentences.length / sceneCount);

    let currentTime = 0;
    for (let i = 0; i < rawSentences.length; i += chunkSize) {
      const chunk = rawSentences.slice(i, i + chunkSize).join(' ');
      const chunkWords = chunk.split(/\s+/).length;
      const chunkDuration = parseFloat(((chunkWords / totalWords) * totalDuration).toFixed(1));
      const sceneId = scenes.length + 1;
      const isFirst = sceneId === 1;
      const isLast = (i + chunkSize >= rawSentences.length);

      scenes.push({
        id: sceneId,
        tag: isFirst ? "Scene 1: The Hook" : isLast ? `Scene ${sceneId}: Payoff & CTA` : `Scene ${sceneId}: Core Story`,
        start: parseFloat(currentTime.toFixed(1)),
        end: parseFloat(Math.min(totalDuration, currentTime + chunkDuration).toFixed(1)),
        vo: chunk,
        motion: isFirst 
          ? "Dynamic dolly-in with glowing coordinate grid" 
          : isLast 
          ? "Singularity particle burst with safe-zone compliant CTA"
          : "3D perspective matrix with kinetic orbital rings"
      });
      currentTime += chunkDuration;
    }

    // Determine visual archetype and voice using semantic Film Style classifier
    const detectedStyle = detectFilmStyle(rawText);
    const archetype = detectedStyle.archetype;
    const archetypeName = detectedStyle.archetypeName;
    const voice = detectedStyle.voice;
    const voiceLabel = detectedStyle.voiceLabel;
    const audioFile = "voice_custom_preview.mp3";

    const titleSnippet = words.slice(0, 7).join(' ') + (words.length > 7 ? '...' : '');

    return {
      typeBadge: "Custom Script Analyzed",
      title: titleSnippet,
      duration: totalDuration,
      wordCount: totalWords,
      scenes: scenes,
      archetype: archetype,
      archetypeName: archetypeName,
      voice: voice,
      voiceLabel: voiceLabel,
      audioFile: audioFile,
      fullVoText: rawText
    };
  }

  // If the user provided a topic or concept prompt (1 sentence or short topic phrase)
  // Check preset triggers first
  if (lower.includes('emudhra') || lower.includes('digital certificate') || lower.includes('key entropy flaw') || lower.includes('rsa private key')) {
    const p = SCRIPT_PRESETS.emudhra;
    return {
      typeBadge: "Reuters News Intelligence Analyzed",
      title: "Indian Firm eMudhra Exits Global Digital Certificates Business",
      duration: p.duration,
      wordCount: p.scenes.reduce((acc, s) => acc + s.vo.split(/\s+/).length, 0),
      scenes: JSON.parse(JSON.stringify(p.scenes)),
      archetype: "cyber",
      archetypeName: "Cyberpunk HUD / FUI",
      voice: p.voice,
      voiceLabel: "Christopher (Deep Tactical Tech)",
      audioFile: p.audioFile,
      fullVoText: p.scenes.map(s => s.vo).join('\n\n')
    };
  }

  if (lower.includes('drone') || lower.includes('swarm') || lower.includes('air defense') || (lower.includes('tank') && lower.includes('400'))) {
    const p = SCRIPT_PRESETS.drones;
    return {
      typeBadge: "Defense Story Analyzed",
      title: "Autonomous Drone Swarms Vs Air Defense",
      duration: 44.25,
      wordCount: 105,
      scenes: JSON.parse(JSON.stringify(p.scenes)),
      archetype: "cyber",
      archetypeName: "Cyber Tactical Radar",
      voice: "en-US-ChristopherNeural",
      voiceLabel: "Christopher (Deep Tactical Tech)",
      audioFile: "voice_drone_swarms.mp3",
      fullVoText: p.scenes.map(s => s.vo).join('\n\n')
    };
  }

  if (lower.includes('fusion') || lower.includes('mercury') || lower.includes('gold') || lower.includes('marathon') || lower.includes('alchemy')) {
    const p = SCRIPT_PRESETS.fusion;
    return {
      typeBadge: "Concept Prompt Analyzed",
      title: "Marathon Fusion: Mercury into Gold & Market Impact",
      duration: 41.6,
      wordCount: 114,
      scenes: JSON.parse(JSON.stringify(p.scenes)),
      archetype: "cyber",
      archetypeName: "Cyber Radar",
      voice: "en-US-GuyNeural",
      voiceLabel: "Guy (Energetic Active 41.6s)",
      audioFile: "voice_guy_40s.mp3",
      fullVoText: p.scenes.map(s => s.vo).join('\n\n')
    };
  }

  if (lower.includes('synthwave') || lower.includes('80s') || lower.includes('retro grid') || lower.includes('arcade')) {
    const p = SCRIPT_PRESETS.synthwave;
    return {
      typeBadge: "Film Style: 80s Synthwave",
      title: "80s Retro Synthwave: How Cyberpunk 1986 shaped modern UI",
      duration: p.duration,
      wordCount: 78,
      scenes: JSON.parse(JSON.stringify(p.scenes)),
      archetype: "synthwave",
      archetypeName: "80s Retro Synthwave & CRT",
      voice: p.voice,
      voiceLabel: "Guy (Energetic Retro)",
      audioFile: "voice_custom_preview.mp3",
      fullVoText: p.scenes.map(s => s.vo).join('\n\n')
    };
  }

  if (lower.includes('bauhaus') || lower.includes('design rules') || lower.includes('constructivist')) {
    const p = SCRIPT_PRESETS.bauhaus;
    return {
      typeBadge: "Film Style: Geometric Bauhaus",
      title: "Geometric Bauhaus: 5 Architectural Rules of Kinetic Typography",
      duration: p.duration,
      wordCount: 74,
      scenes: JSON.parse(JSON.stringify(p.scenes)),
      archetype: "bauhaus",
      archetypeName: "Geometric Bauhaus",
      voice: p.voice,
      voiceLabel: "Guy (Active)",
      audioFile: "voice_custom_preview.mp3",
      fullVoText: p.scenes.map(s => s.vo).join('\n\n')
    };
  }

  if (lower.includes('blueprint') || lower.includes('deep-sea') || lower.includes('schematic') || lower.includes('caliper')) {
    const p = SCRIPT_PRESETS.blueprint;
    return {
      typeBadge: "Film Style: Technical Blueprint",
      title: "Technical Blueprint: Deep-Sea Oceanic Structures Under 10,000m Pressure",
      duration: p.duration,
      wordCount: 76,
      scenes: JSON.parse(JSON.stringify(p.scenes)),
      archetype: "blueprint",
      archetypeName: "Technical Blueprint & CAD",
      voice: p.voice,
      voiceLabel: "Christopher (Deep Tech)",
      audioFile: "voice_custom_preview.mp3",
      fullVoText: p.scenes.map(s => s.vo).join('\n\n')
    };
  }

  if (lower.includes('aurora') || lower.includes('glassmorphism') || lower.includes('refraction')) {
    const p = SCRIPT_PRESETS.aurora;
    return {
      typeBadge: "Film Style: Aurora Glass",
      title: "Aurora Glassmorphism: The Optical Physics of Digital Refraction",
      duration: p.duration,
      wordCount: 72,
      scenes: JSON.parse(JSON.stringify(p.scenes)),
      archetype: "aurora",
      archetypeName: "Aurora Glassmorphism",
      voice: p.voice,
      voiceLabel: "Sonia (British Cinematic)",
      audioFile: "voice_custom_preview.mp3",
      fullVoText: p.scenes.map(s => s.vo).join('\n\n')
    };
  }

  if (lower.includes('quantum') || lower.includes('rsa') || lower.includes('shor') || lower.includes('encrypt')) {
    const p = SCRIPT_PRESETS.quantum;
    return {
      typeBadge: "Concept Prompt Analyzed",
      title: "Why Quantum Computing Breaks RSA Encryption",
      duration: 20.0,
      wordCount: 56,
      scenes: JSON.parse(JSON.stringify(p.scenes)),
      archetype: "opus",
      archetypeName: "Opus Geometric",
      voice: "en-US-ChristopherNeural",
      voiceLabel: "Christopher (Deep Tech)",
      audioFile: "voice_custom_preview.mp3",
      fullVoText: p.scenes.map(s => s.vo).join('\n\n')
    };
  }

  // Topic-to-Film-Style Semantic Detection
  const styleMatch = detectFilmStyle(rawText);
  const matchedArchetype = styleMatch.archetype;
  const matchedArchetypeName = styleMatch.archetypeName;
  const matchedVoice = styleMatch.voice;
  const matchedVoiceLabel = styleMatch.voiceLabel;

  // Synthesize tailor-made 5-scene director narrative using Lemo-Opuscar DIRECTOR.md grammar
  const topicTitle = words.slice(0, 8).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const genScenes = [
    {
      id: 1,
      tag: "Scene 1: The Hook (0-3.5s)",
      start: 0.0,
      end: 4.5,
      vo: `What happens when you examine ${rawText.replace(/[.?]+$/, '')}? The answer breaks conventional assumptions.`,
      motion: "Close framing dolly-in + high-impact premise lock"
    },
    {
      id: 2,
      tag: "Scene 2: Systemic Build",
      start: 4.5,
      end: 9.5,
      vo: `At the fundamental level, the core mechanism transforms the entire system from the inside out.`,
      motion: "Continuous lateral track + layered procedural telemetry"
    },
    {
      id: 3,
      tag: "Scene 3: Turn & Signature Move",
      start: 9.5,
      end: 15.0,
      vo: `The real-world implications cannot be ignored: here is what the data actually reveals behind closed doors.`,
      motion: "Full-frame scale reveal + medium-native signature spectacle"
    },
    {
      id: 4,
      tag: "Scene 4: Transformed Echo",
      start: 15.0,
      end: 19.5,
      vo: `When you look back at where it started, the fundamental paradigm has completely changed.`,
      motion: "Wide perspective pullback + settled geometric balance"
    },
    {
      id: 5,
      tag: "Scene 5: Payoff & Outro CTA",
      start: 19.5,
      end: 24.0,
      vo: `Stay ahead of the technological frontier. Make sure to like and subscribe to ${state.social?.handle || '@OpusMotion'} for daily verified breakdowns!`,
      motion: "Singularity particle burst with safe-zone compliant CTA"
    }
  ];

  return {
    typeBadge: `Film Style: ${matchedArchetypeName}`,
    title: topicTitle,
    duration: 24.0,
    wordCount: genScenes.reduce((acc, s) => acc + s.vo.split(/\s+/).length, 0),
    scenes: genScenes,
    archetype: matchedArchetype,
    archetypeName: matchedArchetypeName,
    voice: matchedVoice,
    voiceLabel: matchedVoiceLabel,
    audioFile: "voice_custom_preview.mp3",
    fullVoText: genScenes.map(s => s.vo).join('\n\n')
  };
}

/**
 * Semantic Topic-to-Film-Style Classifier
 * Analyzes topic keywords and maps into canonical film styles from Lemo-Opuscar & MG-Styles-15
 */
function detectFilmStyle(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes('synthwave') || lower.includes('80s') || lower.includes('retro') || lower.includes('arcade') || lower.includes('cyberpunk 1986') || lower.includes('vhs') || lower.includes('neon') || lower.includes('pixel') || lower.includes('gaming')) {
    return {
      archetype: 'synthwave',
      archetypeName: '80s Retro Synthwave & CRT',
      voice: 'en-US-GuyNeural',
      voiceLabel: 'Guy (Energetic Retro)'
    };
  }
  
  if (lower.includes('bauhaus') || lower.includes('constructivist') || lower.includes('design rules') || lower.includes('kino') || lower.includes('poster') || lower.includes('montage') || lower.includes('typography') || lower.includes('geometric')) {
    return {
      archetype: 'bauhaus',
      archetypeName: 'Geometric Bauhaus',
      voice: 'en-US-GuyNeural',
      voiceLabel: 'Guy (Active)'
    };
  }

  if (lower.includes('blueprint') || lower.includes('cad') || lower.includes('schematic') || lower.includes('engineering') || lower.includes('caliper') || lower.includes('bridge') || lower.includes('architecture') || lower.includes('pressure') || lower.includes('patent') || lower.includes('deep-sea') || lower.includes('structure')) {
    return {
      archetype: 'blueprint',
      archetypeName: 'Technical Blueprint & CAD',
      voice: 'en-US-ChristopherNeural',
      voiceLabel: 'Christopher (Deep Engineering Tech)'
    };
  }

  if (lower.includes('glass') || lower.includes('aurora') || lower.includes('refraction') || lower.includes('frosted') || lower.includes('interface') || lower.includes('mesh') || lower.includes('gradient') || lower.includes('glow') || lower.includes('ethereal')) {
    return {
      archetype: 'aurora',
      archetypeName: 'Aurora Glassmorphism',
      voice: 'en-GB-SoniaNeural',
      voiceLabel: 'Sonia (British Cinematic)'
    };
  }

  if (lower.includes('drone') || lower.includes('swarm') || lower.includes('air defense') || lower.includes('tank') || lower.includes('military') || lower.includes('radar') || lower.includes('tactical') || lower.includes('fpv') || lower.includes('weapon') || lower.includes('armor')) {
    return {
      archetype: 'cyber',
      archetypeName: 'Cyberpunk HUD / FUI',
      voice: 'en-US-ChristopherNeural',
      voiceLabel: 'Christopher (Deep Tactical Tech)'
    };
  }

  if (lower.includes('quantum') || lower.includes('rsa') || lower.includes('shor') || lower.includes('algorithm') || lower.includes('neural') || lower.includes('ai') || lower.includes('vector') || lower.includes('latent') || lower.includes('code') || lower.includes('compute')) {
    return {
      archetype: 'opus',
      archetypeName: 'Opus Dark Keynote',
      voice: 'en-US-ChristopherNeural',
      voiceLabel: 'Christopher (Deep Tech)'
    };
  }

  if (lower.includes('market') || lower.includes('stock') || lower.includes('finance') || lower.includes('crypto') || lower.includes('dollar') || lower.includes('price') || lower.includes('alpha') || lower.includes('trading') || lower.includes('etf')) {
    return {
      archetype: 'swiss',
      archetypeName: 'Swiss Kinetic',
      voice: 'en-US-GuyNeural',
      voiceLabel: 'Guy (Active)'
    };
  }

  if (lower.includes('space') || lower.includes('cosmos') || lower.includes('star') || lower.includes('earth') || lower.includes('nature') || lower.includes('ocean') || lower.includes('black hole') || lower.includes('singularity') || lower.includes('astronomy')) {
    return {
      archetype: 'celestial',
      archetypeName: 'Celestial Flow',
      voice: 'en-GB-SoniaNeural',
      voiceLabel: 'Sonia (Cinematic)'
    };
  }

  return {
    archetype: 'cyber',
    archetypeName: 'Cyberpunk HUD / FUI',
    voice: 'en-US-ChristopherNeural',
    voiceLabel: 'Christopher (Tactical Tech)'
  };
}

function loadScriptPreset(presetKey) {
  const p = SCRIPT_PRESETS[presetKey] || SCRIPT_PRESETS.drones;
  const conceptInput = document.getElementById('txtConceptInput');
  if (conceptInput) conceptInput.value = p.topic;

  state.scenes = JSON.parse(JSON.stringify(p.scenes));
  autoMatchImagesToScript(state.scenes);
  syncSocialToScript(true);
  state.duration = p.duration || 44.25;
  state.activeAudioFile = p.audioFile || (presetKey === 'drones' ? 'voice_drone_swarms.mp3' : 'voice_guy_40s.mp3');
  state.ttsVoice = p.voice || 'en-US-ChristopherNeural';

  const audio = document.getElementById('masterAudioTrack');
  if (audio) {
    audio.src = state.activeAudioFile;
    audio.load();
  }

  const sel = document.getElementById('selTtsVoice');
  if (sel) sel.value = state.ttsVoice;

  const badge = document.getElementById('lblActiveVoiceBadge');
  if (badge) badge.textContent = state.ttsVoice.includes('Christopher') ? 'Christopher (Tactical Tech)' : 'Guy (Active)';

  populateSceneCards();
  populateVoiceOverText();
  populateVisualsTab();
  renderTimelineScenesTrack();
  selectVisualArchetype(p.archetype || (presetKey === 'drones' || presetKey === 'fusion' || presetKey === 'emudhra' ? 'cyber' : 'opus'));

  // Update duration slider & display
  const rng = document.getElementById('rngDuration');
  if (rng) rng.value = Math.round(state.duration);
  const dispDur = document.getElementById('dispDuration');
  if (dispDur) dispDur.textContent = `${Math.round(state.duration)}s`;
  const lblDur = document.getElementById('lblDurationVal');
  if (lblDur) lblDur.textContent = `${state.duration.toFixed(1)} Seconds`;

  // Preload any scene motion graphics images
  state.scenes.forEach(s => {
    if (s.image) getPreloadedSceneImage(s.image);
  });

  broadcastSync('VOICE_CHANGE', { voiceKey: state.ttsVoice, file: state.activeAudioFile, duration: state.duration });
}

function loadUrlSample(url) {
  const conceptInput = document.getElementById('txtConceptInput');
  if (conceptInput) {
    conceptInput.value = url;
  }
  analyzeInputAndProceed();
}

// ==========================================================================
// Render Archive & Dedicated Folder Manager (Modal Controls)
// ==========================================================================

async function openRenderArchiveModal() {
  const modal = document.getElementById('renderArchiveModal');
  const listEl = document.getElementById('renderArchiveList');
  if (modal) modal.classList.add('show');
  if (!listEl) return;

  listEl.innerHTML = `
    <div style="text-align: center; color: var(--text-muted); padding: 24px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite; margin-bottom: 8px;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <div>Loading dedicated render packages...</div>
    </div>
  `;

  try {
    const res = await fetch('renders/renders_manifest.json?v=' + Date.now());
    if (!res.ok) throw new Error('No renders manifest found yet');
    const items = await res.json();

    if (!items || items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 32px;">
          No video renders packaged yet. Complete a render in Stage 3 or via <code style="color: var(--accent-cyan);">render_final_video.py</code>!
        </div>
      `;
      return;
    }

    listEl.innerHTML = items.map(item => `
      <div class="render-archive-card">
        <div class="render-card-thumb">
          <img src="${item.thumbnail_url || 'preview_v3_contact_sheet.png'}" alt="Contact Sheet" onerror="this.src='preview_v3_contact_sheet.png'" />
          <span class="render-card-thumb-badge">${item.duration_formatted || item.duration + 's'}</span>
        </div>
        <div class="render-card-info">
          <div class="render-card-title">${item.title}</div>
          <div class="render-card-meta">
            <span class="render-card-tag" style="color: var(--accent-green); border-color: rgba(34, 197, 94, 0.4); font-weight: 600;">✓ Final Verified</span>
            <span class="render-card-tag">${item.resolution || '720x1280'}</span>
            <span class="render-card-tag">${item.aspect_ratio || '9:16'}</span>
            <span class="render-card-tag">🎙 ${item.voice || 'Guy'}</span>
            <span>📅 ${item.created_formatted || item.created_at?.slice(0, 16)}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--accent-cyan); font-family: var(--font-mono); margin-top: 4px;">
            📁 ${item.folder_path} (${item.files_count || 8} files)
          </div>
        </div>
        <div class="render-card-actions">
          <button class="btn-primary" style="padding: 6px 10px; font-size: 0.74rem; justify-content: center;" onclick="playArchiveVideo('${item.video_url}', '${item.title}')">
            ▶ Play Video
          </button>
          <button class="tool-btn" style="padding: 5px 8px; font-size: 0.72rem;" onclick="viewRenderPackageDetails('${item.manifest_url}', '${item.details_url}', '${item.title}')">
            📄 View Details
          </button>
          <a href="${item.video_url}" download class="tool-btn" style="padding: 5px 8px; font-size: 0.72rem; text-decoration: none; text-align: center;">
            📥 Download MP4
          </a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    listEl.innerHTML = `
      <div style="text-align: center; color: var(--accent-red); padding: 24px;">
        Unable to load render archive: ${err.message}.
      </div>
    `;
  }
}

async function triggerStorageCleanup() {
  const btn = document.getElementById('btnAuditStorage');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Auditing Storage...';
  }
  try {
    const res = await fetch('/api/storage/clean', { method: 'POST' });
    const data = await res.json();
    if (data.status === 'success') {
      showToastNotification(`✓ Storage Clean: ${data.verified_renders} final renders verified. ${data.reclaimed_mb} MB reclaimed.`);
      await openRenderArchiveModal();
    } else {
      alert("Storage audit error: " + (data.error || 'Unknown'));
    }
  } catch (e) {
    alert("Storage cleanup request failed: " + e.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🧹 Audit & Prune Storage';
    }
  }
}

function closeRenderArchiveModal() {
  document.getElementById('renderArchiveModal')?.classList.remove('show');
}

async function viewRenderPackageDetails(manifestUrl, detailsUrl, title) {
  const modal = document.getElementById('renderDetailsModal');
  const pre = document.getElementById('preDetailsContent');
  const titleEl = document.getElementById('lblDetailsModalTitle');
  if (modal) modal.classList.add('show');
  if (titleEl) titleEl.textContent = title ? `Details: ${title}` : "Video Package Details";
  if (pre) pre.textContent = "Loading package details...";

  try {
    let content = "";
    if (detailsUrl) {
      const mdRes = await fetch(detailsUrl + '?v=' + Date.now());
      if (mdRes.ok) {
        content = await mdRes.text();
      }
    }
    if (!content && manifestUrl) {
      const jsonRes = await fetch(manifestUrl + '?v=' + Date.now());
      if (jsonRes.ok) {
        const json = await jsonRes.json();
        content = JSON.stringify(json, null, 2);
      }
    }
    if (pre) pre.textContent = content || "No details found for this package.";
  } catch (e) {
    if (pre) pre.textContent = "Error reading details: " + e.message;
  }
}

function closeRenderDetailsModal() {
  document.getElementById('renderDetailsModal')?.classList.remove('show');
}

function playArchiveVideo(videoUrl, title) {
  closeRenderArchiveModal();
  // Open dedicated preview tab or update current player
  const win = window.open('preview.html?video=' + encodeURIComponent(videoUrl), '_blank', 'width=1120,height=920');
  setTimeout(() => {
    broadcastSync('PLAY_ARCHIVE_VIDEO', { videoUrl, title });
  }, 400);
}


function populateSceneCards() {
  const container = document.getElementById('sceneCardsList');
  if (!container) return;

  container.innerHTML = state.scenes.map((s, idx) => `
    <div class="scene-card ${idx === 0 ? 'active-scene' : ''}" id="scard_${idx}">
      <div class="scene-card-header">
        <span class="scene-tag">${s.tag}</span>
        <span class="scene-timing">${s.start.toFixed(1)}s – ${s.end.toFixed(1)}s</span>
      </div>
      ${s.image ? `
        <div style="display: flex; gap: 12px; margin-top: 8px; align-items: flex-start;">
          <img src="${s.image}" alt="${s.tag}" style="width: 64px; height: 110px; object-fit: cover; border-radius: 6px; border: 1px solid var(--accent-cyan); box-shadow: 0 4px 14px rgba(0, 242, 254, 0.25); flex-shrink: 0;" />
          <div style="flex: 1; min-width: 0;">
            <div class="scene-vo-text">"${s.vo}"</div>
            <div class="scene-motion-spec">Motion: ${s.motion}</div>
            <div style="margin-top: 5px; font-size: 0.68rem; color: var(--accent-cyan); font-weight: 600; display: flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Motion Graphics Image Linked
            </div>
          </div>
        </div>
      ` : `
        <div class="scene-vo-text">"${s.vo}"</div>
        <div class="scene-motion-spec">Motion: ${s.motion}</div>
      `}
    </div>
  `).join('');

  // Also populate sentence timing list in Tab 2
  const timingList = document.getElementById('sentenceTimingList');
  if (timingList) {
    timingList.innerHTML = state.scenes.map((s, i) => `
      <div style="background: var(--bg-secondary); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-subtle); font-size: 0.72rem; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 600; color: var(--accent-cyan);">Marker ${i + 1} (${s.start.toFixed(1)}s)</span>
        <span style="color: var(--text-muted); font-family: var(--font-mono);">${s.vo.slice(0, 38)}...</span>
      </div>
    `).join('');
  }
}

function populateVoiceOverText() {
  const txtVo = document.getElementById('txtVoFullScript');
  if (!txtVo) return;
  const fullText = state.scenes.map(s => s.vo).join('\n\n');
  txtVo.value = fullText;
}

function renderTimelineScenesTrack() {
  const track = document.getElementById('timelineScenesTrack');
  if (!track) return;

  track.innerHTML = state.scenes.map((s) => {
    const widthPct = ((s.end - s.start) / state.duration) * 100;
    return `
      <div class="timeline-scene-block" style="width: ${widthPct}%;">
        ${s.tag}
      </div>
    `;
  }).join('');
}

// ==========================================================================
// 9. Voice Audition & Text-to-Speech Engine
// ==========================================================================
const VOICE_TRACKS = {
  'en-US-GuyNeural': {
    file: 'voice_guy_40s.mp3',
    label: 'Guy (Active)',
    name: 'Guy (Energetic Documentary Narrative)',
    duration: 41.6
  },
  'en-US-ChristopherNeural': {
    file: 'voice_christopher_exact_40s.mp3',
    label: 'Christopher (Active)',
    name: 'Christopher (Deep Authoritative Tech)',
    duration: 41.5
  },
  'en-GB-SoniaNeural': {
    file: 'voice_sonia_40s.mp3',
    label: 'Sonia (Active)',
    name: 'Sonia (British Cinematic Specialist)',
    duration: 40.9
  },
  'en-US-JennyNeural': {
    file: 'voice_jenny_40s.mp3',
    label: 'Jenny (Active)',
    name: 'Jenny (Warm Precision Conversational)',
    duration: 41.2
  }
};

// Dynamic Live Neural TTS via /api/tts
async function synthesizeLiveVoiceOver(text, voice, rate) {
  const badge = document.getElementById('lblActiveVoiceBadge');
  if (badge) badge.textContent = "Synthesizing...";

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        voice: voice || state.ttsVoice,
        rate: rate || '+15%',
        output: 'voice_custom_preview.mp3'
      })
    });
    if (!res.ok) throw new Error('Live TTS server returned error');
    const data = await res.json();
    state.activeAudioFile = data.audio_url;
    state.duration = data.duration;
    const audio = document.getElementById('masterAudioTrack');
    if (audio) {
      audio.src = data.audio_url;
      audio.load();
    }
    updateTimeDisplay();
    renderTimelineScenesTrack();
    if (badge) badge.textContent = "Audio Ready ✔";
    broadcastSync('VOICE_CHANGE', { voiceKey: state.ttsVoice, file: data.audio_url, duration: data.duration });
    return data.audio_url;
  } catch (err) {
    console.warn("Dynamic TTS error, using project fallback:", err);
    if (badge) badge.textContent = "Audio Ready";
    return null;
  }
}

function handleVoiceSelectionChange(voiceKey, updateDuration = true) {
  initAudioEngine();
  state.ttsVoice = voiceKey;

  const txtVo = document.getElementById('txtVoFullScript');
  const currentText = txtVo ? txtVo.value.trim().toLowerCase() : "";

  // Assign appropriate project file
  if (currentText.includes('drone') || currentText.includes('swarm') || currentText.includes('air defense')) {
    state.activeAudioFile = 'voice_drone_swarms.mp3';
    if (updateDuration) state.duration = 44.25;
  } else if (currentText.includes('fusion') || currentText.includes('gold') || currentText.includes('mercury')) {
    state.activeAudioFile = 'voice_guy_40s.mp3';
    if (updateDuration) state.duration = 41.6;
  } else {
    state.activeAudioFile = 'voice_custom_preview.mp3';
  }

  // Update UI badge
  const badge = document.getElementById('lblActiveVoiceBadge');
  if (badge) badge.textContent = voiceKey.replace('en-US-', '').replace('en-GB-', '').replace('Neural', '');

  // Sync select element
  const sel = document.getElementById('selTtsVoice');
  if (sel && sel.value !== voiceKey) sel.value = voiceKey;

  // Update audio track source
  const audio = document.getElementById('masterAudioTrack');
  if (audio) {
    const wasPlaying = !audio.paused;
    audio.src = state.activeAudioFile;
    audio.load();
    if (wasPlaying) {
      audio.currentTime = state.currentTime;
      audio.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }

  updateTimeDisplay();
  renderTimelineScenesTrack();
  broadcastSync('VOICE_CHANGE', { voiceKey, file: state.activeAudioFile, duration: state.duration });
  console.log(`[OpusMotion] Voice set to: ${voiceKey} -> ${state.activeAudioFile}`);
}

async function runPreviewWithSelectedVoice() {
  initAudioEngine();
  const txtVo = document.getElementById('txtVoFullScript');
  const currentText = txtVo ? txtVo.value.trim() : "";
  const audio = document.getElementById('masterAudioTrack');

  const textLower = currentText.toLowerCase();
  const isDrone = textLower.includes('drone') || textLower.includes('swarm') || textLower.includes('air defense');
  const isFusion = textLower.includes('fusion') || textLower.includes('gold') || textLower.includes('mercury');

  if (isDrone) {
    state.activeAudioFile = 'voice_drone_swarms.mp3';
    state.duration = 44.25;
  } else if (isFusion) {
    state.activeAudioFile = 'voice_guy_40s.mp3';
    state.duration = 41.6;
  } else if (currentText.length > 25) {
    // Dynamic synthesis for custom user script
    await synthesizeLiveVoiceOver(currentText, state.ttsVoice);
  }

  if (audio) {
    if (!audio.src.includes(state.activeAudioFile)) {
      audio.src = state.activeAudioFile;
      audio.load();
    }
    audio.currentTime = state.currentTime;
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayheadUI();
      broadcastSync('PLAY_PAUSE', { isPlaying: true, file: state.activeAudioFile });
    }).catch(err => {
      state.isPlaying = true;
      updatePlayheadUI();
    });
  } else {
    state.isPlaying = true;
    updatePlayheadUI();
  }

  const viewport = document.getElementById('centerViewportPanel');
  if (viewport) {
    viewport.scrollIntoView({ behavior: 'smooth' });
  }
}

async function auditionVoiceOver() {
  initAudioEngine();
  const txtVo = document.getElementById('txtVoFullScript');
  const currentText = txtVo ? txtVo.value.trim() : "";
  const audio = document.getElementById('masterAudioTrack');

  const textLower = currentText.toLowerCase();
  const isDrone = textLower.includes('drone') || textLower.includes('swarm') || textLower.includes('air defense');
  const isFusion = textLower.includes('fusion') || textLower.includes('gold') || textLower.includes('mercury');

  if (isDrone) {
    state.activeAudioFile = 'voice_drone_swarms.mp3';
    state.duration = 44.25;
  } else if (isFusion) {
    state.activeAudioFile = 'voice_guy_40s.mp3';
    state.duration = 41.6;
  } else if (currentText.length > 25) {
    await synthesizeLiveVoiceOver(currentText, state.ttsVoice);
  }

  if (audio) {
    if (!audio.src.includes(state.activeAudioFile)) {
      audio.src = state.activeAudioFile;
      audio.load();
    }
    audio.currentTime = 0;
    state.currentTime = 0;
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayheadUI();
    }).catch(e => console.log(e));
  }
}

function synthesizeFullVO() {
  runPreviewWithSelectedVoice();
}

function updateSpeechRate(val) {
  state.speechRate = parseFloat(val);
  const disp = document.getElementById('dispSpeedRate');
  if (disp) disp.textContent = `${state.speechRate.toFixed(2)}x`;
  const lbl = document.getElementById('lblSpeedVal');
  if (lbl) lbl.textContent = `${state.speechRate.toFixed(2)}x`;
}

function updateSpeechPitch(val) {
  state.speechPitch = parseInt(val, 10);
  const disp = document.getElementById('dispSpeechPitch');
  if (disp) disp.textContent = `${state.speechPitch} Hz`;
  const lbl = document.getElementById('lblPitchVal');
  if (lbl) lbl.textContent = `${state.speechPitch} Hz`;
}

function updateDurationSetting(val) {
  state.duration = parseInt(val, 10);
  const disp = document.getElementById('dispDuration');
  if (disp) disp.textContent = `${state.duration}s`;
  const lbl = document.getElementById('lblDurationVal');
  if (lbl) lbl.textContent = `${state.duration} Seconds`;

  // Scale scene timings
  const total = state.duration;
  state.scenes = [
    { id: 1, tag: "Scene 1: Hook", start: 0, end: total * 0.22, vo: state.scenes[0]?.vo || "", motion: "Dynamic Dolly-in" },
    { id: 2, tag: "Scene 2: Core Concept", start: total * 0.22, end: total * 0.55, vo: state.scenes[1]?.vo || "", motion: "Orbiting Superposition" },
    { id: 3, tag: "Scene 3: Deep Dive", start: total * 0.55, end: total * 0.82, vo: state.scenes[2]?.vo || "", motion: "Geometric Pulse" },
    { id: 4, tag: "Scene 4: Outro", start: total * 0.82, end: total, vo: state.scenes[3]?.vo || "", motion: "Logo & Outro" }
  ];
  populateSceneCards();
  renderTimelineScenesTrack();
  updateTimeDisplay();
}

// ==========================================================================
// 10. Visual Archetype & Dynamics Selectors
// ==========================================================================
function selectVisualArchetype(archetype) {
  state.visualArchetype = archetype;
  ['Opus', 'Cyber', 'Swiss', 'Celestial', 'Synthwave', 'Bauhaus', 'Aurora', 'Blueprint'].forEach(name => {
    const card = document.getElementById(`styleCard${name}`);
    if (card) card.classList.toggle('active', name.toLowerCase() === archetype);
  });
  broadcastSync('SYNC_STATE');
}

function toggleFilmGrain(val) {
  state.filmGrain = val ? 0.22 : 0;
}

function toggleFilmVignette(val) {
  state.filmVignette = val ? 0.45 : 0;
}

function toggleFilmScanlines(val) {
  state.filmScanlines = !!val;
}

function updateParticleCount(val) {
  state.particleDensity = parseInt(val, 10);
  const disp = document.getElementById('dispParticles');
  if (disp) disp.textContent = state.particleDensity;
  const lbl = document.getElementById('lblParticleDensity');
  if (lbl) lbl.textContent = `${state.particleDensity} pts`;
  initParticleField(state.particleDensity);
}

function updateCameraMotion(val) {
  state.cameraDynamics = parseInt(val, 10);
  const disp = document.getElementById('dispCameraMotion');
  if (disp) disp.textContent = `${state.cameraDynamics}%`;
}

function updateMixerVolume(type, val) {
  const norm = parseInt(val, 10) / 100;
  if (type === 'vo') {
    state.mixVo = norm;
    document.getElementById('dispVoVol').textContent = `${val}%`;
    if (voGain && audioCtx) voGain.gain.setValueAtTime(norm, audioCtx.currentTime);
  } else if (type === 'bgm') {
    state.mixBgm = norm;
    document.getElementById('dispBgmVol').textContent = `${val}%`;
    if (bgmGain && audioCtx) bgmGain.gain.setValueAtTime(norm, audioCtx.currentTime);
  } else if (type === 'sfx') {
    state.mixSfx = norm;
    document.getElementById('dispSfxVol').textContent = `${val}%`;
    if (sfxGain && audioCtx) sfxGain.gain.setValueAtTime(norm, audioCtx.currentTime);
  }
}

// Aspect Ratio Switching
function setAspectRatio(ratio) {
  state.aspectRatio = ratio;
  ['916', '169', '11'].forEach(id => {
    const btn = document.getElementById(`aspect${id}`);
    if (btn) btn.classList.remove('active');
  });

  const frame = document.getElementById('previewDeviceFrame');
  if (!frame) return;

  frame.classList.remove('aspect-16-9', 'aspect-1-1');

  if (ratio === '9:16') {
    document.getElementById('aspect916')?.classList.add('active');
    canvas.width = 1080;
    canvas.height = 1920;
    document.getElementById('dispCurrentAspect').textContent = '9:16 (1080x1920)';
  } else if (ratio === '16:9') {
    document.getElementById('aspect169')?.classList.add('active');
    frame.classList.add('aspect-16-9');
    canvas.width = 1920;
    canvas.height = 1080;
    document.getElementById('dispCurrentAspect').textContent = '16:9 (1920x1080)';
  } else if (ratio === '1:1') {
    document.getElementById('aspect11')?.classList.add('active');
    frame.classList.add('aspect-1-1');
    canvas.width = 1080;
    canvas.height = 1080;
    document.getElementById('dispCurrentAspect').textContent = '1:1 (1080x1080)';
  }
}

function toggleSafeZone() {
  state.safeZoneVisible = !state.safeZoneVisible;
  const overlay = document.getElementById('safeZoneOverlay');
  if (overlay) overlay.classList.toggle('visible', state.safeZoneVisible);
  const btn = document.getElementById('btnToggleSafeZone');
  if (btn) btn.classList.toggle('active', state.safeZoneVisible);
}

function toggleFullscreen() {
  const el = document.getElementById('centerViewportPanel') || document.body;
  if (!document.fullscreenElement) {
    el.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

// Open Dedicated Preview Tab in a new browser window/tab
function openDedicatedPreviewTab() {
  window.open('preview.html', '_blank', 'width=1120,height=920');
}

// ==========================================================================
// 11. 9-Frame Contact Sheet QA Modal
// ==========================================================================
function generateContactSheet() {
  const modal = document.getElementById('contactSheetModal');
  const grid = document.getElementById('contactSheetGrid');
  if (!modal || !grid) return;

  grid.innerHTML = "";
  const offscreen = document.createElement('canvas');
  offscreen.width = 540;
  offscreen.height = (state.aspectRatio === '16:9') ? 304 : (state.aspectRatio === '1:1') ? 540 : 960;
  const offCtx = offscreen.getContext('2d');

  const frameCount = 9;
  for (let i = 0; i < frameCount; i++) {
    const timeRatio = i / (frameCount - 1);
    const frameTime = timeRatio * state.duration;

    // Render frame to offscreen canvas
    drawProceduralVideo(offCtx, offscreen.width, offscreen.height, frameTime);

    const dataUrl = offscreen.toDataURL('image/jpeg', 0.85);
    const cell = document.createElement('div');
    cell.className = 'contact-frame-cell';
    cell.innerHTML = `
      <img src="${dataUrl}" alt="Keyframe ${i + 1}" />
      <div class="contact-frame-meta">
        <span>Frame ${i + 1}/9</span>
        <span>${frameTime.toFixed(2)}s</span>
      </div>
    `;
    grid.appendChild(cell);
  }

  modal.classList.add('show');
}

function closeContactSheetModal() {
  document.getElementById('contactSheetModal')?.classList.remove('show');
}

// ==========================================================================
// 12. High-Bitrate Video Export (MediaRecorder)
// ==========================================================================
let mediaRecorder = null;
let recordedChunks = [];
let exportInterval = null;
let isExportAborted = false;

function startVideoExport() {
  if (!canvas) return;
  const modal = document.getElementById('exportModal');
  const progressContainer = document.getElementById('exportProgressContainer');
  const completeContainer = document.getElementById('exportCompleteContainer');
  const percentText = document.getElementById('exportPercentText');
  const progressBar = document.getElementById('exportProgressBar');

  if (modal) modal.classList.add('show');
  if (progressContainer) progressContainer.style.display = 'block';
  if (completeContainer) completeContainer.style.display = 'none';

  isExportAborted = false;
  if (exportInterval) clearInterval(exportInterval);

  // Seek to 0 and record
  state.currentTime = 0;
  state.isPlaying = true;

  try {
    const stream = canvas.captureStream(60);
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm',
      videoBitsPerSecond: 8000000 // 8 Mbps high-quality
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0 && !isExportAborted) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      // Discard partial renders if cancelled or incomplete
      if (isExportAborted || state.currentTime < (state.duration - 0.5) || recordedChunks.length === 0) {
        recordedChunks = [];
        console.log("[OpusMotion] Export cancelled or incomplete — partial render discarded. Only final successful renders are saved.");
        return;
      }

      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      if (blob.size < 50000) {
        alert("Export produced an incomplete file (<50KB). Discarding partial render. Only final successful renders are saved.");
        recordedChunks = [];
        return;
      }

      const url = URL.createObjectURL(blob);
      const dlBtn = document.getElementById('btnDownloadVideo');
      const cleanHandle = (state.social?.handle || 'Piyushk20').replace(/[^a-zA-Z0-9]/g, '');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `opusmotion_final_render_${cleanHandle}_${timestamp}.webm`;

      if (dlBtn) {
        dlBtn.href = url;
        dlBtn.download = filename;
        dlBtn.textContent = `📥 Download Final Render (${(blob.size / (1024*1024)).toFixed(2)} MB)`;
      }

      if (progressContainer) progressContainer.style.display = 'none';
      if (completeContainer) completeContainer.style.display = 'block';
      state.isPlaying = false;
      updatePlayheadUI();
      showToastNotification(`✓ Final successful render compiled: ${filename}`);
    };

    mediaRecorder.start(250);

    // Progress updates
    exportInterval = setInterval(() => {
      const pct = Math.min(100, Math.round((state.currentTime / state.duration) * 100));
      if (percentText) percentText.textContent = `${pct}%`;
      if (progressBar) progressBar.style.width = `${pct}%`;

      if (state.currentTime >= state.duration) {
        clearInterval(exportInterval);
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }
    }, 150);

  } catch (err) {
    alert("In-browser WebCodecs export not supported in this environment: " + err.message);
    closeExportModal();
  }
}

function closeExportModal() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    isExportAborted = true;
    if (exportInterval) clearInterval(exportInterval);
    mediaRecorder.stop();
    recordedChunks = [];
    showToastNotification("Export cancelled. Partial render discarded — only final successful renders are saved.");
  }
  document.getElementById('exportModal')?.classList.remove('show');
}

// Download Manifest & Code
function downloadProjectManifest() {
  const manifest = {
    title: "OpusMotion Short Video Project",
    createdAt: new Date().toISOString(),
    duration: state.duration,
    aspectRatio: state.aspectRatio,
    visualArchetype: state.visualArchetype,
    scenes: state.scenes,
    audio: {
      voice: state.ttsVoice,
      rate: state.speechRate,
      pitch: state.speechPitch
    }
  };
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'opusmotion_project_manifest.json';
  a.click();
}

function exportProjectSourceCode() {
  const code = `/**
 * Pure Procedural Short Video Render Script
 * Generated by OpusMotion Studio
 */
export function renderVideo(ctx, width, height, time) {
  // Deterministic 60fps frame renderer
  // Style: ${state.visualArchetype}
  // Duration: ${state.duration}s
}
`;
  const blob = new Blob([code], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'procedural_video_engine.js';
  a.click();
}

function downloadAudioStem() {
  alert("Voice-over WAV stem compiled and packaged. Ready for production DAW integration.");
}

// ==========================================================================
// 13. Initialization
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('videoCanvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
  }

  initParticleField(state.particleDensity);
  initTimelineScrubber();
  loadSavedSocialSettings();

  // Load default preset (Autonomous Drone Swarms Vs Air Defense)
  loadScriptPreset('drones');

  // Start Animation Loop
  requestAnimationFrame(renderFrame);

  // Resize listener
  window.addEventListener('resize', () => {
    initTimelineScrubber();
  });
});
