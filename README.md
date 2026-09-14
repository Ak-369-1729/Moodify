# 🎹 Moodify by NexaSoul — The Living Digital Harmonium

> **PixelCraft CSS Competition Submission**  
> *Transforming Human Emotion into Acoustic Resonance and Generative Visual Identity.*

[![Pure Vanilla](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20JS-FF7A00?style=for-the-badge)](https://github.com/Ak-369-1729/Moodify)
[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-00F5D4?style=for-the-badge)](https://github.com/Ak-369-1729/Moodify)
[![Design System](https://img.shields.io/badge/Design-PixelCraft%20Competition-7B2CBF?style=for-the-badge)](https://github.com/Ak-369-1729/Moodify)

---

## 🌟 Overview

**Moodify** is an art-directed interactive music and emotion platform crafted for the **PixelCraft CSS Competition**. Moving beyond generic dark-mode SaaS templates, Moodify introduces a tactile **Living Digital Harmonium** — an organic visual instrument that converts user touch, keyboard interaction, and emotional intent into rich polyphonic sound and generative visual art.

Equipped with the official **NexaSoul** branding, real-time Web Audio API synthesis, dynamic air-pressure bellows physics, and an interactive 2x Retina canvas exporter, Moodify represents the union of traditional craftsmanship and modern creative web technology.

---

## 💎 The Six-Pillar Progression

Moodify was developed strictly adhering to the official **PixelCraft** engineering lifecycle:

```
IDENTIFY ➔ FIX ➔ IMPROVE ➔ BRAND ➔ ENHANCE ➔ INNOVATE
```

### 1. 🔍 Identify
- Diagnosed common landing-page flaws: excessive vertical dead space, washed-out low-contrast grays, detached decorative visualizers, and generic button templates.

### 2. 🛠️ Fix
- Implemented **WCAG AAA high-contrast typography** (`#FFFFFF` on deep cosmic obsidian `#0B0C10`).
- Restructured layout using fluid `clamp()` sizing, responsive multi-track CSS grid layouts, and zero horizontal overflow.
- Unified event loops into a single `requestAnimationFrame` loop at a steady 60 FPS.

### 3. 🎨 Improve
- Built an authentic **3D Harmonium Stage** featuring Burmese Teak wood grain (`repeating-linear-gradient`), brushed brass drone stops, ivory & ebony weighted key textures, and leather accordion folds.
- Added smooth tactile hover feedback, key depression depth (`translateY(4px)`), and acoustic vibration pulses.

### 4. 🏷️ Brand
- Deeply integrated the supplied **NexaSoul emblem** throughout the entire user journey:
  - Transparent luminescent navigation crest with glowing status badge.
  - Hero interactive badge and soundstage header.
  - Imprinted brass brand medallion on the harmonium wood body.
  - Cryptographic authenticity seal on exported mood identity posters.

### 5. ⚡ Enhance
- **Progressive Web Audio API Synthesizer**:
  - Dual band-limited oscillators (Sawtooth + Pulse) emulating authentic free-reed vibration.
  - Sub-octave bass warmth for resonant physical presence.
  - Exponential gain envelope shaping with release tails.
  - Dynamic Low-Pass Resonant Filter coupled to the bellows air pressure.
- **Morphing Bellows Cursor**: Custom interactive cursor that transforms dynamically into an accordion icon when hovering over interactive instrument components.

### 6. 🚀 Innovate
- **Interactive Bellows Physics**: Drag the right-hand handle to charge real-time air reservoir pressure (`0%` to `100%`) directly altering volume and spectral timbre.
- **Generative 2x Retina Poster Engine**: Generates high-resolution downloadable mood identity artwork featuring acoustic waveforms, celestial gradients, color frequencies, and NexaSoul verification seals.
- **Bespoke Interactive Curation**: Live mood switching (Euphoric Dawn, Melancholy Rain, Astral Drift, Primal Groove, Ethereal Peace) that instantly remaps the instrument's sound palette and particle aura.

---

## 🎹 Keyboard Controls & Harmonium Map

You can play the harmonium directly using your keyboard or by tapping/clicking keys on screen:

| Key | Note | Sargam Swara | Frequency | Key Type |
|:---:|:----:|:------------:|:---------:|:--------:|
| **A** | C4  | Sa (सा)     | 261.63 Hz | Natural (Ivory) |
| **W** | C#4 | re (रे॒)     | 277.18 Hz | Sharp (Ebony)   |
| **S** | D4  | Re (रे)     | 293.66 Hz | Natural (Ivory) |
| **E** | D#4 | ga (ग॒)     | 311.13 Hz | Sharp (Ebony)   |
| **D** | E4  | Ga (ग)     | 329.63 Hz | Natural (Ivory) |
| **F** | F4  | Ma (म)     | 349.23 Hz | Natural (Ivory) |
| **T** | F#4 | ma (म॑)     | 369.99 Hz | Sharp (Ebony)   |
| **G** | G4  | Pa (प)     | 392.00 Hz | Natural (Ivory) |
| **Y** | G#4 | dha (ध॒)    | 415.30 Hz | Sharp (Ebony)   |
| **H** | A4  | Dha (ध)    | 440.00 Hz | Natural (Ivory) |

> 💡 **Pro-Tip**: Click and drag the **Bellows Pump** on the right side to build up acoustic pressure before playing!

---

## 📁 Project Architecture

```
Moodify/
├── index.html               # Semantic HTML5 markup & 3D instrument structure
├── style.css                # Custom CSS design system, 3D harmonium stage & animations
├── script.js                # Web Audio API engine, bellows physics, RAF particle visualizer
├── nexasoul-logo-alpha.png  # Official transparent NexaSoul crest asset
├── nexasoul-logo-core.jpg   # NexaSoul primary emblem
├── nexasoul-logo.jpg        # NexaSoul heritage banner asset
├── .gitignore               # Ignored system and temporary artifacts
└── README.md                # Comprehensive documentation
```

---

## 🚀 Getting Started Locally

No build tools, Node.js packages, or bundlers required. Moodify runs purely on modern web standards!

### Quick Start:
1. Clone this repository:
   ```bash
   git clone https://github.com/Ak-369-1729/Moodify.git
   ```
2. Open the directory:
   ```bash
   cd Moodify
   ```
3. Serve with any static web server:
   ```bash
   # Using Python 3
   python -m http.server 8080

   # Or using Node http-server / npx serve
   npx serve .
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## 🏆 Competition Highlights

- **Zero Third-Party CSS Frameworks**: 100% handcrafted Vanilla CSS demonstrating deep mastery of modern layout, 3D transforms, custom properties, and animations.
- **Zero Audio Libraries**: Pure Web Audio API utilizing custom oscillator nodes, biquad filter nodes, dynamics compressors, and gain ramps.
- **High Performance 60 FPS**: Unified hardware-accelerated canvas rendering on 2x device pixel ratio screens.
- **Accessibility Conscious**: Full keyboard navigation, `aria-*` tags, focus states, and high contrast ratios throughout.

---

## 👥 Credits & Attribution

- **Project**: Moodify by NexaSoul
- **Author / Developer**: [Ak-369-1729](https://github.com/Ak-369-1729)
- **Brand Partner**: NexaSoul Creative Technology Lab
- **Event**: PixelCraft CSS Competition

---

*Crafted with passion, acoustics, and pure CSS.*
