/**
 * ==========================================================================
 * MOODIFY BY NEXASOUL — ART-DIRECTED INTERACTIVE MUSIC EXPERIENCE
 * Living Digital Harmonium Controller, Unified 60 FPS RAF & 2x Retina Canvas
 * PixelCraft CSS Competition Specification · NexaSoul Creative Lab 2026
 * ==========================================================================
 */

// ===== 1. UNIFIED APPLICATION STATE =====
const AppState = {
    currentStep: 1,
    selectedMood: null,
    isGenerating: false,
    hasInteractedWithHarmonium: false,

    // Bellows System (Air Pressure & Mechanical State)
    bellows: {
        pressure: 0.25,          // Normalized 0.05 (empty) -> 1.0 (max pressure)
        targetPressure: 0.25,
        idlePhase: 0,
        isDragging: false,
        dragStartY: 0,
        dragStartPressure: 0.25
    },

    // Keyboard System (Active Notes & Frequencies)
    keys: {
        activeKeys: new Set(),
        lastFrequency: 432.0,
        lastNoteName: "Sa"
    },

    // Progressive Web Audio (Muted by Default, Progressive Enhancement)
    audio: {
        ctx: null,
        isMuted: true,
        masterGain: null,
        activeOscs: new Map()
    },

    // Custom Morphing Cursor (Inertia & Geometry)
    cursor: {
        x: -100,
        y: -100,
        currentX: -100,
        currentY: -100,
        isOverHarmonium: false,
        isTouch: false
    }
};

// Detect touch devices
if (window.matchMedia("(hover: none) or (pointer: coarse)").matches) {
    AppState.cursor.isTouch = true;
}

// Preload the Clean Alpha NexaSoul Brand Logo Asset for Canvas
const nexasoulLogo = new Image();
let logoLoaded = false;

nexasoulLogo.onload = () => {
    logoLoaded = true;
};
nexasoulLogo.onerror = () => {
    nexasoulLogo.src = 'nexasoul-logo-core.jpg';
    nexasoulLogo.onload = () => { logoLoaded = true; };
    nexasoulLogo.onerror = () => {
        nexasoulLogo.src = 'nexasoul-logo.jpg';
        nexasoulLogo.onload = () => { logoLoaded = true; };
    };
};
nexasoulLogo.src = 'nexasoul-logo-alpha.png';

// ===== 2. 8 SONIC MOOD PALETTES & ATTRIBUTES =====
const moodProfiles = {
    "Gothic Grunge": {
        name: "Gothic Grunge",
        emoji: "🖤",
        tagline: "Dark distortion, nocturnal grunge & obsidian frequencies",
        primary: "#a855f7",
        secondary: "#ec4899",
        gradient: ["#07040e", "#160822", "#280a3a", "#4a126d"],
        accentRgb: "168, 85, 247",
        vibeValues: { chill: 0.35, groove: 0.72, voltage: 0.94, aura: 0.88 },
        waveformColor: "#c084fc",
        telemetryText: "GOTHIC GRUNGE"
    },
    "Cozy Lo-Fi": {
        name: "Cozy Lo-Fi",
        emoji: "☕",
        tagline: "Analog tape saturation, rain ambience & dusty beats",
        primary: "#f59e0b",
        secondary: "#10b981",
        gradient: ["#100d08", "#20160a", "#32220d", "#4b2f0a"],
        accentRgb: "245, 158, 11",
        vibeValues: { chill: 0.96, groove: 0.65, voltage: 0.38, aura: 0.85 },
        waveformColor: "#fbbf24",
        telemetryText: "COZY LO-FI"
    },
    "Electric Energy": {
        name: "Electric Energy",
        emoji: "⚡",
        tagline: "Overdriven synthesizers, cyber gold & high-voltage surge",
        primary: "#00e5ff",
        secondary: "#b8ff24",
        gradient: ["#060f16", "#0a1f2e", "#0e3146", "#026fa8"],
        accentRgb: "0, 229, 255",
        vibeValues: { chill: 0.22, groove: 0.91, voltage: 0.98, aura: 0.79 },
        waveformColor: "#38efff",
        telemetryText: "ELECTRIC ENERGY"
    },
    "Dreamy Synthwave": {
        name: "Dreamy Synthwave",
        emoji: "🌌",
        tagline: "Neon-soaked nostalgia, retro arpeggios & purple twilight",
        primary: "#f43f5e",
        secondary: "#00e5ff",
        gradient: ["#0c0617", "#1a0c2e", "#331149", "#560f58"],
        accentRgb: "244, 63, 94",
        vibeValues: { chill: 0.60, groove: 0.88, voltage: 0.82, aura: 0.95 },
        waveformColor: "#ff6ec7",
        telemetryText: "DREAMY SYNTHWAVE"
    },
    "Chill R&B": {
        name: "Chill R&B",
        emoji: "💜",
        tagline: "Velvet midnight harmonies, lush 808s & slow grooves",
        primary: "#c084fc",
        secondary: "#818cf8",
        gradient: ["#090714", "#130f28", "#1f183f", "#312882"],
        accentRgb: "192, 132, 252",
        vibeValues: { chill: 0.92, groove: 0.86, voltage: 0.54, aura: 0.90 },
        waveformColor: "#e879f9",
        telemetryText: "CHILL R&B"
    },
    "Indie Folk": {
        name: "Indie Folk",
        emoji: "🍂",
        tagline: "Raw acoustic resonance, campfire storytelling & forest warmth",
        primary: "#eab308",
        secondary: "#f97316",
        gradient: ["#120c06", "#201408", "#331f0a", "#4d2a08"],
        accentRgb: "234, 179, 8",
        vibeValues: { chill: 0.85, groove: 0.62, voltage: 0.48, aura: 0.89 },
        waveformColor: "#facc15",
        telemetryText: "INDIE FOLK"
    },
    "Hype Hip-Hop": {
        name: "Hype Hip-Hop",
        emoji: "🔥",
        tagline: "Pounding 808s, aggressive flow & explosive stadium heat",
        primary: "#ef4444",
        secondary: "#f97316",
        gradient: ["#140505", "#240909", "#3b0c0c", "#680f0f"],
        accentRgb: "239, 68, 68",
        vibeValues: { chill: 0.20, groove: 0.95, voltage: 0.99, aura: 0.84 },
        waveformColor: "#f87171",
        telemetryText: "HYPE HIP-HOP"
    },
    "Peaceful Classical": {
        name: "Peaceful Classical",
        emoji: "🎻",
        tagline: "Crystalline strings, grand piano stillness & celestial clarity",
        primary: "#38bdf8",
        secondary: "#818cf8",
        gradient: ["#040d16", "#081b2a", "#0c2b42", "#024a73"],
        accentRgb: "56, 189, 248",
        vibeValues: { chill: 0.98, groove: 0.40, voltage: 0.35, aura: 0.97 },
        waveformColor: "#7dd3fc",
        telemetryText: "PEACEFUL CLASSICAL"
    }
};

// ===== 3. TOAST NOTIFICATION =====
function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}

// ===== 4. PROGRESSIVE WEB AUDIO SYNTHESIZER =====
function initAudioEngine() {
    if (AppState.audio.ctx) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        AppState.audio.ctx = new AudioContext();
        AppState.audio.masterGain = AppState.audio.ctx.createGain();
        AppState.audio.masterGain.gain.setValueAtTime(0.25, AppState.audio.ctx.currentTime);
        AppState.audio.masterGain.connect(AppState.audio.ctx.destination);
    } catch (e) {
        console.warn("Web Audio initialization skipped:", e);
    }
}

function toggleAudioEngine() {
    initAudioEngine();
    AppState.audio.isMuted = !AppState.audio.isMuted;
    
    if (AppState.audio.ctx && AppState.audio.ctx.state === "suspended") {
        AppState.audio.ctx.resume();
    }

    const soundBtn = document.getElementById("soundToggleBtn");
    const audioIcon = document.getElementById("audioIcon");
    const audioLabel = document.getElementById("audioLabel");

    if (AppState.audio.isMuted) {
        soundBtn.classList.remove("active");
        audioIcon.textContent = "🔇";
        audioLabel.textContent = "AUDIO: MUTED";
        showToast("🔇 Audio Engine Muted");
    } else {
        soundBtn.classList.add("active");
        audioIcon.textContent = "🔊";
        audioLabel.textContent = "AUDIO: ACTIVE";
        showToast("🔊 Audio Engine Active — Play Keys!");
    }
    dismissHarmoniumHint();
}

function playHarmonicTone(freq, keyId) {
    if (AppState.audio.isMuted || !AppState.audio.ctx) return;
    if (AppState.audio.ctx.state === "suspended") {
        AppState.audio.ctx.resume();
    }

    // Stop existing tone for this key if active
    stopHarmonicTone(keyId);

    try {
        const ctx = AppState.audio.ctx;
        const now = ctx.currentTime;

        // Rich Warm Harmonium Simulation (Triangle Oscillator + Gentle Lowpass)
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "triangle";
        // Frequency is slightly modulated by bellows pressure
        const modulatedFreq = freq * (1 + (AppState.bellows.pressure - 0.25) * 0.05);
        osc.frequency.setValueAtTime(modulatedFreq, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(900 + AppState.bellows.pressure * 800, now);

        // Gentle envelope: Quick attack, sustained while pressed
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(0.35 * Math.max(0.2, AppState.bellows.pressure), now + 0.04);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(AppState.audio.masterGain);

        osc.start(now);
        AppState.audio.activeOscs.set(keyId, { osc, gainNode });
    } catch (e) {
        // Safe fail
    }
}

function stopHarmonicTone(keyId) {
    const node = AppState.audio.activeOscs.get(keyId);
    if (!node || !AppState.audio.ctx) return;

    try {
        const now = AppState.audio.ctx.currentTime;
        node.gainNode.gain.cancelScheduledValues(now);
        node.gainNode.gain.setValueAtTime(node.gainNode.gain.value, now);
        node.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        setTimeout(() => {
            try {
                node.osc.stop();
                node.osc.disconnect();
            } catch (e) {}
        }, 280);
    } catch (e) {}
    AppState.audio.activeOscs.delete(keyId);
}

// ===== 5. HARMONIUM INTERACTION CONTROLLER =====
function dismissHarmoniumHint() {
    if (!AppState.hasInteractedWithHarmonium) {
        AppState.hasInteractedWithHarmonium = true;
        const hint = document.getElementById("harmoniumHint");
        if (hint) hint.classList.add("hidden");
    }
}

// Bellows Pointer Drag Controller
const bellowsAssembly = document.getElementById("harmoniumBellows");
const bellowsHandle = document.getElementById("bellowsHandle");
const pressureValDisplay = document.getElementById("pressureVal");

if (bellowsAssembly && bellowsHandle) {
    bellowsAssembly.addEventListener("pointerdown", (e) => {
        AppState.bellows.isDragging = true;
        AppState.bellows.dragStartY = e.clientY;
        AppState.bellows.dragStartPressure = AppState.bellows.pressure;
        bellowsAssembly.setPointerCapture(e.pointerId);

        const harmoniumCursor = document.getElementById("harmoniumCursor");
        if (harmoniumCursor) harmoniumCursor.classList.add("dragging");

        dismissHarmoniumHint();
        e.preventDefault();
    });

    bellowsAssembly.addEventListener("pointermove", (e) => {
        if (!AppState.bellows.isDragging) return;
        const deltaY = AppState.bellows.dragStartY - e.clientY;
        // Dragging upward or sideways compresses the bellows
        const newPressure = Math.min(1.0, Math.max(0.08, AppState.bellows.dragStartPressure + deltaY / 120));
        AppState.bellows.targetPressure = newPressure;
        AppState.bellows.pressure = newPressure;
        updateBellowsVisuals();
    });

    const endBellowsDrag = (e) => {
        if (!AppState.bellows.isDragging) return;
        AppState.bellows.isDragging = false;
        try {
            bellowsAssembly.releasePointerCapture(e.pointerId);
        } catch (err) {}

        const harmoniumCursor = document.getElementById("harmoniumCursor");
        if (harmoniumCursor) harmoniumCursor.classList.remove("dragging");
    };

    bellowsAssembly.addEventListener("pointerup", endBellowsDrag);
    bellowsAssembly.addEventListener("pointercancel", endBellowsDrag);
}

function updateBellowsVisuals() {
    const pleats = document.getElementById("bellowsPleats");
    const handle = document.getElementById("bellowsHandle");
    const p = AppState.bellows.pressure;

    if (pleats) {
        // Compress the pleats horizontally
        const scale = 1.15 - p * 0.35;
        pleats.style.transform = `scaleX(${scale.toFixed(3)})`;
    }

    if (handle) {
        const offset = (p - 0.25) * 16;
        handle.style.transform = `rotate(180deg) translateX(${-offset}px)`;
    }

    if (pressureValDisplay) {
        const percent = Math.round(p * 100);
        pressureValDisplay.textContent = AppState.bellows.isDragging ? `PUMP ${percent}%` : `AIR ${percent}%`;
    }

    // Update cursor label if dragging
    const cursorPillText = document.getElementById("cursorPillText");
    if (cursorPillText && AppState.bellows.isDragging) {
        cursorPillText.textContent = `PUMPING ${Math.round(p * 100)}%`;
    }

    // Update global CSS custom property
    document.documentElement.style.setProperty("--bellows-compress", p.toFixed(2));
}

// Keybed Interaction Controller
const harmoniumKeys = document.querySelectorAll(".h-key");
const freqReadout = document.getElementById("freqReadout");
const velocityReadout = document.getElementById("velocityReadout");

harmoniumKeys.forEach(key => {
    const keyId = key.dataset.key;
    const freq = parseFloat(key.dataset.freq);
    const note = key.dataset.note;
    const label = key.dataset.label || note;

    const activateKey = () => {
        key.classList.add("key-pressed");
        AppState.keys.activeKeys.add(keyId);
        AppState.keys.lastFrequency = freq;
        AppState.keys.lastNoteName = note;

        if (freqReadout) {
            freqReadout.textContent = `${freq.toFixed(1)} Hz // ${note} (${label})`;
        }
        if (velocityReadout) {
            velocityReadout.textContent = `VELOCITY ${(0.6 + AppState.bellows.pressure * 0.4).toFixed(2)}`;
        }

        playHarmonicTone(freq, keyId);
        dismissHarmoniumHint();

        // Cursor micro-label feedback
        const cursorPillText = document.getElementById("cursorPillText");
        if (cursorPillText && AppState.cursor.isOverHarmonium) {
            cursorPillText.textContent = `PLAYING ${note} (${label})`;
        }
    };

    const deactivateKey = () => {
        key.classList.remove("key-pressed");
        AppState.keys.activeKeys.delete(keyId);
        stopHarmonicTone(keyId);

        if (velocityReadout) {
            velocityReadout.textContent = `VELOCITY 0.0`;
        }

        const cursorPillText = document.getElementById("cursorPillText");
        if (cursorPillText && AppState.cursor.isOverHarmonium) {
            cursorPillText.textContent = "PLAY / PUMP";
        }
    };

    key.addEventListener("pointerdown", (e) => {
        activateKey();
        key.setPointerCapture(e.pointerId);
    });

    key.addEventListener("pointerup", (e) => {
        deactivateKey();
        try { key.releasePointerCapture(e.pointerId); } catch (err) {}
    });

    key.addEventListener("pointercancel", (e) => {
        deactivateKey();
        try { key.releasePointerCapture(e.pointerId); } catch (err) {}
    });

    key.addEventListener("mouseenter", () => {
        const cursorPillText = document.getElementById("cursorPillText");
        if (cursorPillText && AppState.cursor.isOverHarmonium) {
            cursorPillText.textContent = `KEY ${note} (${label})`;
        }
    });

    key.addEventListener("mouseleave", () => {
        const cursorPillText = document.getElementById("cursorPillText");
        if (cursorPillText && AppState.cursor.isOverHarmonium && !AppState.bellows.isDragging) {
            cursorPillText.textContent = "PLAY / PUMP";
        }
    });
});

// Keyboard hotkeys: 1 through 0 play the 10 keys
window.addEventListener("keydown", (e) => {
    // Only if not focused on an input element
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    const num = parseInt(e.key, 10);
    if (!isNaN(num)) {
        const targetIndex = num === 0 ? 9 : num - 1;
        const targetKey = harmoniumKeys[targetIndex];
        if (targetKey && !targetKey.classList.contains("key-pressed")) {
            targetKey.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1 }));
        }
    }
});

window.addEventListener("keyup", (e) => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    const num = parseInt(e.key, 10);
    if (!isNaN(num)) {
        const targetIndex = num === 0 ? 9 : num - 1;
        const targetKey = harmoniumKeys[targetIndex];
        if (targetKey) {
            targetKey.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 }));
        }
    }
});

// Harmonium Stage 3D Tilt & Cursor Area Tracking
const harmoniumSystem = document.getElementById("harmoniumSystem");
const harmoniumStage = document.getElementById("harmoniumStage");
const harmoniumCursor = document.getElementById("harmoniumCursor");

if (harmoniumSystem && !AppState.cursor.isTouch) {
    harmoniumSystem.addEventListener("mouseenter", () => {
        AppState.cursor.isOverHarmonium = true;
        if (harmoniumCursor) harmoniumCursor.classList.add("active");
    });

    harmoniumSystem.addEventListener("mouseleave", () => {
        AppState.cursor.isOverHarmonium = false;
        if (harmoniumCursor) harmoniumCursor.classList.remove("active");
        if (harmoniumStage) {
            harmoniumStage.style.transform = "rotateX(12deg) rotateY(-8deg)";
        }
    });

    harmoniumSystem.addEventListener("mousemove", (e) => {
        if (!harmoniumStage) return;
        const rect = harmoniumSystem.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        // Subtle 3D perspective tilt
        const rotY = -8 + normX * 12;
        const rotX = 12 - normY * 10;
        harmoniumStage.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });
}

// Track Global Mouse Position
document.addEventListener("mousemove", (e) => {
    AppState.cursor.x = e.clientX;
    AppState.cursor.y = e.clientY;
});

// ===== 6. RESONATOR WAVEFORM CANVAS RENDERER =====
const waveCanvas = document.getElementById("harmoniumWaveCanvas");
const waveCtx = waveCanvas ? waveCanvas.getContext("2d") : null;
let wavePhase = 0;

function drawResonatorWaveform() {
    if (!waveCtx || !waveCanvas) return;
    const W = waveCanvas.width;
    const H = waveCanvas.height;

    waveCtx.clearRect(0, 0, W, H);

    const hasKeys = AppState.keys.activeKeys.size > 0;
    const p = AppState.bellows.pressure;
    const moodProfile = moodProfiles[AppState.selectedMood] || moodProfiles["Electric Energy"];
    const accentCol = moodProfile.primary;

    // Draw Subtle Cyber Center Guide
    waveCtx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    waveCtx.lineWidth = 1;
    waveCtx.beginPath();
    waveCtx.moveTo(0, H / 2);
    waveCtx.lineTo(W, H / 2);
    waveCtx.stroke();

    // Primary Harmonic Wave
    waveCtx.beginPath();
    const primaryAmp = (10 + p * 24) * (hasKeys ? 1.4 : 0.6);
    const freqFactor = hasKeys ? (AppState.keys.lastFrequency / 120) : 1.5;

    for (let x = 0; x < W; x += 3) {
        const norm = x / W;
        const env = Math.sin(norm * Math.PI); // Window envelope (tapers at edges)
        const y = H / 2 + Math.sin(norm * freqFactor * 12 + wavePhase) * primaryAmp * env;
        if (x === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
    }
    waveCtx.strokeStyle = accentCol;
    waveCtx.lineWidth = 2.5;
    waveCtx.shadowColor = accentCol;
    waveCtx.shadowBlur = 12;
    waveCtx.stroke();
    waveCtx.shadowBlur = 0;

    // Secondary Sub-Harmonic Wave (Dual Frequency)
    waveCtx.beginPath();
    const secAmp = primaryAmp * 0.45;
    for (let x = 0; x < W; x += 4) {
        const norm = x / W;
        const env = Math.sin(norm * Math.PI);
        const y = H / 2 + Math.cos(norm * freqFactor * 6 - wavePhase * 1.5) * secAmp * env;
        if (x === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
    }
    waveCtx.strokeStyle = "rgba(184, 255, 36, 0.65)";
    waveCtx.lineWidth = 1.5;
    waveCtx.stroke();

    wavePhase += 0.04 + p * 0.06 + (hasKeys ? 0.05 : 0);
}

// ===== 7. CONSTELLATION PARTICLES (SUBTLE, 0 TEXT INTERFERENCE) =====
const particleCanvas = document.getElementById("particleCanvas");
const pCtx = particleCanvas ? particleCanvas.getContext("2d") : null;
let particles = [];
const PARTICLE_COUNT = 32;

function resizeParticleCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener("resize", resizeParticleCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * (particleCanvas ? particleCanvas.width : window.innerWidth);
        this.y = Math.random() * (particleCanvas ? particleCanvas.height : window.innerHeight);
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.28 + 0.08;
        this.isCyan = Math.random() > 0.4;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > particleCanvas.width || this.y < 0 || this.y > particleCanvas.height) {
            this.reset();
        }
    }
    draw() {
        if (!pCtx) return;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = this.isCyan 
            ? `rgba(0, 229, 255, ${this.opacity})` 
            : `rgba(184, 255, 36, ${this.opacity * 0.8})`;
        pCtx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

function updateParticles() {
    if (!pCtx || document.hidden) return;
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 95) {
                pCtx.beginPath();
                pCtx.strokeStyle = `rgba(0, 229, 255, ${0.05 * (1 - dist / 95)})`;
                pCtx.lineWidth = 0.5;
                pCtx.moveTo(particles[i].x, particles[i].y);
                pCtx.lineTo(particles[j].x, particles[j].y);
                pCtx.stroke();
            }
        }
    }
}

// ===== 8. UNIFIED 60 FPS MAIN LOOP =====
const cursorGlow = document.getElementById("cursorGlow");

function masterEngineLoop() {
    // 1. Interpolate Cursor Position with Smooth Inertia
    if (!AppState.cursor.isTouch) {
        AppState.cursor.currentX += (AppState.cursor.x - AppState.cursor.currentX) * 0.18;
        AppState.cursor.currentY += (AppState.cursor.y - AppState.cursor.currentY) * 0.18;

        if (cursorGlow) {
            cursorGlow.style.transform = `translate(${AppState.cursor.currentX}px, ${AppState.cursor.currentY}px)`;
        }

        if (harmoniumCursor && AppState.cursor.isOverHarmonium) {
            harmoniumCursor.style.transform = `translate3d(${AppState.cursor.currentX + 12}px, ${AppState.cursor.currentY + 12}px, 0)`;
        }
    }

    // 2. Natural Bellows Breathing (If not being dragged)
    if (!AppState.bellows.isDragging) {
        AppState.bellows.idlePhase += 0.035;
        // Natural gentle breath oscillating between 0.22 and 0.28
        const breath = 0.25 + Math.sin(AppState.bellows.idlePhase) * 0.05;
        AppState.bellows.pressure += (breath - AppState.bellows.pressure) * 0.08;
        updateBellowsVisuals();
    }

    // 3. Render Resonator Waveform
    drawResonatorWaveform();

    // 4. Update Constellation Particles
    updateParticles();

    requestAnimationFrame(masterEngineLoop);
}
requestAnimationFrame(masterEngineLoop);

// ===== 9. CELEBRATION CONFETTI ENGINE =====
const confettiCanvas = document.getElementById("confettiCanvas");
const cCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
let confettiPieces = [];
let confettiActive = false;

function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener("resize", resizeConfetti);

class Confetti {
    constructor() {
        this.x = Math.random() * (confettiCanvas ? confettiCanvas.width : window.innerWidth);
        this.y = -20;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 3.5 + 2.5;
        this.speedX = (Math.random() - 0.5) * 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 8;
        this.color = ["#00e5ff", "#b8ff24", "#a855f7", "#ec4899", "#38efff"][Math.floor(Math.random() * 5)];
        this.shape = Math.random() > 0.4 ? "rect" : "circle";
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedX *= 0.99;
    }
    draw() {
        if (!cCtx) return;
        cCtx.save();
        cCtx.translate(this.x, this.y);
        cCtx.rotate((this.rotation * Math.PI) / 180);
        cCtx.fillStyle = this.color;
        if (this.shape === "rect") {
            cCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        } else {
            cCtx.beginPath();
            cCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            cCtx.fill();
        }
        cCtx.restore();
    }
}

function launchConfetti(count = 160) {
    if (!confettiCanvas || !cCtx) return;
    confettiPieces = [];
    for (let i = 0; i < count; i++) {
        confettiPieces.push(new Confetti());
    }
    confettiActive = true;
    animateConfetti();
}

function animateConfetti() {
    if (!confettiActive || !cCtx) return;
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(c => {
        c.update();
        c.draw();
    });
    confettiPieces = confettiPieces.filter(c => c.y < confettiCanvas.height + 30);
    if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

// ===== 10. SCROLL OBSERVER & NAVBAR STYLING =====
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}, { passive: true });

// ===== 11. RESPONSIVE NAVIGATION =====
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const hamburger = document.getElementById("hamburgerBtn");
    const backdrop = document.getElementById("mobileNavBackdrop");

    if (!navLinks) return;
    const isOpen = navLinks.classList.toggle("mobile-open");
    if (hamburger) {
        hamburger.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (backdrop) {
        backdrop.classList.toggle("active", isOpen);
    }
}

function scrollToForm() {
    const formSec = document.getElementById("formSection");
    if (formSec) {
        formSec.scrollIntoView({ behavior: "smooth" });
    }
    const navLinks = document.getElementById("navLinks");
    if (navLinks && navLinks.classList.contains("mobile-open")) {
        toggleMenu();
    }
}

function scrollToHow() {
    const howSec = document.getElementById("how-it-works");
    if (howSec) {
        howSec.scrollIntoView({ behavior: "smooth" });
    }
    const navLinks = document.getElementById("navLinks");
    if (navLinks && navLinks.classList.contains("mobile-open")) {
        toggleMenu();
    }
}

// ===== 12. REAL-TIME INPUT MIRRORING (LIVE FEEDBACK) =====
const trackNameInput = document.getElementById("trackName");
const trackArtistInput = document.getElementById("trackArtist");
const previewTitleDisplay = document.getElementById("previewTitleDisplay");
const previewArtistDisplay = document.getElementById("previewArtistDisplay");

if (trackNameInput) {
    trackNameInput.addEventListener("input", (e) => {
        const val = e.target.value.trim() || "Your Track Name";
        if (previewTitleDisplay) previewTitleDisplay.textContent = val;
    });
}

if (trackArtistInput) {
    trackArtistInput.addEventListener("input", (e) => {
        const val = e.target.value.trim() || "Your Track Artist";
        if (previewArtistDisplay) previewArtistDisplay.textContent = val;
    });
}

// Support Enter key progression on text inputs
document.querySelectorAll(".tactile-input-container input").forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            if (AppState.currentStep === 1) nextStep(1);
            else if (AppState.currentStep === 2) nextStep(2);
        }
    });
});

// ===== 13. FORM NAVIGATION & STEPPER VALIDATION =====
function shakeElement(el) {
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "shake 0.45s ease";
}

function nextStep(from) {
    if (from === 1) {
        const a1 = document.getElementById("artist1").value.trim();
        const a2 = document.getElementById("artist2").value.trim();
        const a3 = document.getElementById("artist3").value.trim();
        if (!a1 || !a2 || !a3) {
            shakeElement(document.getElementById("step1"));
            showToast("⚠️ Enter all 3 artists shaping your sound.");
            return;
        }
    }

    if (from === 2) {
        const track = document.getElementById("trackName").value.trim();
        const artist = document.getElementById("trackArtist").value.trim();
        if (!track || !artist) {
            shakeElement(document.getElementById("step2"));
            showToast("⚠️ Please enter both track title and artist.");
            return;
        }
    }

    document.getElementById("step" + from).classList.remove("active");
    document.getElementById("step" + (from + 1)).classList.add("active");
    updateProgress(from + 1);
    AppState.currentStep = from + 1;
}

function prevStep(from) {
    document.getElementById("step" + from).classList.remove("active");
    document.getElementById("step" + (from - 1)).classList.add("active");
    updateProgress(from - 1);
    AppState.currentStep = from - 1;
}

function updateProgress(step) {
    const progressFill = document.getElementById("progressFill");
    const consoleStatus = document.getElementById("consoleStatus");

    if (step === 1) {
        progressFill.style.width = "0%";
        consoleStatus.textContent = "PHASE 01 // WHO SHAPES YOUR SOUND?";
    } else if (step === 2) {
        progressFill.style.width = "50%";
        consoleStatus.textContent = "PHASE 02 // WHAT'S ON REPEAT?";
    } else if (step === 3) {
        progressFill.style.width = "100%";
        consoleStatus.textContent = "PHASE 03 // WHAT'S YOUR SONIC ENERGY?";
    }

    document.querySelectorAll(".milestone-point").forEach((node) => {
        const nodeStep = parseInt(node.dataset.step, 10);
        if (nodeStep <= step) {
            node.classList.add("active");
        } else {
            node.classList.remove("active");
        }
    });
}

// ===== 14. MOOD SELECTION & HARMONIUM RE-TUNING =====
function selectMood(el) {
    document.querySelectorAll(".mood-tile").forEach(c => {
        c.classList.remove("selected");
        c.setAttribute("aria-checked", "false");
    });

    el.classList.add("selected");
    el.setAttribute("aria-checked", "true");
    AppState.selectedMood = el.dataset.mood;

    const profile = moodProfiles[AppState.selectedMood];
    if (profile) {
        // Shift global CSS custom properties
        document.documentElement.style.setProperty("--mood-accent", profile.primary);
        document.documentElement.style.setProperty("--mood-accent-rgb", profile.accentRgb);
        document.documentElement.style.setProperty("--mood-glow", `rgba(${profile.accentRgb}, 0.38)`);
        document.documentElement.style.setProperty("--mood-secondary", profile.secondary);

        // Update form live indicator pill
        const moodText = document.getElementById("currentSelectedMoodText");
        if (moodText) {
            moodText.textContent = `${profile.emoji} ${profile.name}`;
            moodText.style.color = profile.primary;
        }

        // Update Harmonium Mood Aura Tag
        const harmoniumMoodTag = document.getElementById("harmoniumMoodTag");
        if (harmoniumMoodTag) {
            harmoniumMoodTag.textContent = profile.telemetryText;
            harmoniumMoodTag.style.color = profile.primary;
        }

        // Haptic feedback bounce
        el.style.transform = "scale(0.96)";
        setTimeout(() => {
            el.style.transform = "scale(1.02)";
        }, 100);
    }
}

// Keyboard accessibility for mood tiles (Space or Enter to select)
document.querySelectorAll(".mood-tile").forEach(tile => {
    tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectMood(tile);
        }
    });
});

// ===== 15. 1.4s CINEMATIC GENERATION SEQUENCE =====
function generateCard() {
    if (!AppState.selectedMood) {
        const grid = document.getElementById("moodGrid");
        shakeElement(grid);
        showToast("⚠️ Select your sonic mood to calibrate the engine!");
        return;
    }

    if (AppState.isGenerating) return;
    AppState.isGenerating = true;

    // Trigger visual harmonium cascade
    AppState.bellows.pressure = 0.95;
    updateBellowsVisuals();

    // Cascading key wave
    harmoniumKeys.forEach((key, idx) => {
        setTimeout(() => {
            key.classList.add("key-pressed");
            setTimeout(() => key.classList.remove("key-pressed"), 180);
        }, idx * 60);
    });

    const overlay = document.getElementById("generationOverlay");
    const statusTitle = document.getElementById("genStatusTitle");
    const statusDesc = document.getElementById("genStatusDesc");
    const progressBar = document.getElementById("genProgressBar");

    overlay.classList.add("active");
    progressBar.style.width = "10%";

    // 0ms - 400ms: Frequency Harmonics Analysis
    statusTitle.textContent = "Harmonium Bellows Engaging...";
    statusDesc.textContent = "Pumping acoustic air pressure through neural frequency matrix.";
    progressBar.style.width = "30%";

    // 400ms - 850ms: Mood Engine Calibration
    setTimeout(() => {
        const profile = moodProfiles[AppState.selectedMood];
        statusTitle.textContent = `Calibrating ${profile.name} Aura...`;
        statusDesc.textContent = `Aligning chill, groove & voltage parameters (${profile.emoji})`;
        progressBar.style.width = "65%";
    }, 400);

    // 850ms - 1200ms: Canvas Poster Synthesis
    setTimeout(() => {
        statusTitle.textContent = "Synthesizing NexaSoul Identity Artifact...";
        statusDesc.textContent = "Baking 2x Retina canvas & verified authenticity stamp.";
        progressBar.style.width = "100%";
    }, 850);

    // 1400ms: Complete and Reveal!
    setTimeout(() => {
        renderCanvasCard();
        overlay.classList.remove("active");
        AppState.isGenerating = false;

        document.getElementById("step3").classList.remove("active");
        document.querySelector(".stepper-bar-wrapper").style.display = "none";
        document.getElementById("cardSection").classList.add("active");

        // Celebration fireworks
        launchConfetti(180);

        setTimeout(() => {
            document.getElementById("cardSection").scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);

    }, 1400);
}

// ===== 16. 2X RETINA CANVAS POSTER RENDERER (900x1300) =====
function renderCanvasCard() {
    const canvas = document.getElementById("musicCard");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const W = canvas.width;  // 900
    const H = canvas.height; // 1300

    const artist1 = document.getElementById("artist1").value.trim() || "Primary Artist";
    const artist2 = document.getElementById("artist2").value.trim() || "Second Artist";
    const artist3 = document.getElementById("artist3").value.trim() || "Third Artist";
    const trackName = document.getElementById("trackName").value.trim() || "Obsessive Anthem";
    const trackArtist = document.getElementById("trackArtist").value.trim() || "Featured Artist";

    const profile = moodProfiles[AppState.selectedMood] || moodProfiles["Dreamy Synthwave"];

    // 1. RICH BACKGROUND GRADIENT MESH
    const bgGrad = ctx.createLinearGradient(0, 0, W * 0.85, H);
    bgGrad.addColorStop(0, profile.gradient[0]);
    bgGrad.addColorStop(0.35, profile.gradient[1]);
    bgGrad.addColorStop(0.7, profile.gradient[2]);
    bgGrad.addColorStop(1, profile.gradient[3]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. ABSTRACT AMBIENT GLOW ORBS
    ctx.save();
    const orb1 = ctx.createRadialGradient(W - 120, 160, 20, W - 120, 160, 320);
    orb1.addColorStop(0, `rgba(${profile.accentRgb}, 0.35)`);
    orb1.addColorStop(1, "transparent");
    ctx.fillStyle = orb1;
    ctx.beginPath();
    ctx.arc(W - 120, 160, 320, 0, Math.PI * 2);
    ctx.fill();

    const orb2 = ctx.createRadialGradient(100, H - 250, 20, 100, H - 250, 280);
    orb2.addColorStop(0, "rgba(0, 229, 255, 0.2)");
    orb2.addColorStop(1, "transparent");
    ctx.fillStyle = orb2;
    ctx.beginPath();
    ctx.arc(100, H - 250, 280, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. SOUND FREQUENCY GRID
    ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    ctx.lineWidth = 1;
    for (let x = 60; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
    }
    for (let y = 60; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }

    // 4. OUTER BORDER & TOP ACCENT BEAM
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 16, 16, W - 32, H - 32, 28);
    ctx.stroke();

    const beamGrad = ctx.createLinearGradient(0, 0, W, 0);
    beamGrad.addColorStop(0, "#00e5ff");
    beamGrad.addColorStop(0.5, profile.primary);
    beamGrad.addColorStop(1, "#b8ff24");
    ctx.fillStyle = beamGrad;
    drawRoundedRect(ctx, 30, 20, W - 60, 6, 3);
    ctx.fill();

    // 5. OFFICIAL NEXASOUL LOGO DRAWING (Clean Optical Frame, High Contrast)
    const logoBoxX = 54;
    const logoBoxY = 48;
    const logoBoxW = 164;
    const logoBoxH = 68;

    if (logoLoaded && nexasoulLogo.naturalWidth > 0) {
        ctx.drawImage(nexasoulLogo, logoBoxX, logoBoxY + 4, logoBoxW, logoBoxH - 8);
    } else {
        ctx.fillStyle = "#00e5ff";
        ctx.font = "bold 24px 'Outfit', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("NEXASOUL", logoBoxX, logoBoxY + 42);
    }

    // Sub-title Header
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 24px 'Outfit', sans-serif";
    ctx.fillText("MOODIFY", W - 54, 76);

    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.font = "700 13px 'JetBrains Mono', monospace";
    ctx.fillText("VISUAL MUSIC IDENTITY // 2026", W - 54, 98);

    // Divider Line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(54, 136);
    ctx.lineTo(W - 54, 136);
    ctx.stroke();

    // 6. MOOD BADGE & SONIC DESCRIPTION
    const moodBadgeW = 340;
    const moodBadgeH = 54;
    const moodBadgeX = W / 2 - moodBadgeW / 2;
    const moodBadgeY = 160;

    ctx.fillStyle = `rgba(${profile.accentRgb}, 0.22)`;
    drawRoundedRect(ctx, moodBadgeX, moodBadgeY, moodBadgeW, moodBadgeH, 27);
    ctx.fill();
    ctx.strokeStyle = profile.primary;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px 'Outfit', sans-serif";
    ctx.fillText(`${profile.emoji}  ${profile.name.toUpperCase()}`, W / 2, moodBadgeY + 35);

    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.font = "italic 15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`"${profile.tagline}"`, W / 2, moodBadgeY + 84);

    // 7. HEAVY ROTATION ARCHITECTS SECTION
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "700 13px 'JetBrains Mono', monospace";
    ctx.fillText("// TOP 3 HEAVY ROTATION ARCHITECTS", 54, 300);

    const artists = [artist1, artist2, artist3];
    const artistCardY = 320;
    const artistCardH = 64;

    artists.forEach((art, i) => {
        const y = artistCardY + i * (artistCardH + 12);

        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        drawRoundedRect(ctx, 54, y, W - 108, artistCardH, 12);
        ctx.fill();
        ctx.strokeStyle = i === 0 ? "rgba(0, 229, 255, 0.35)" : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = i === 0 ? "rgba(0, 229, 255, 0.2)" : "rgba(255, 255, 255, 0.1)";
        drawRoundedRect(ctx, 70, y + 14, 36, 36, 8);
        ctx.fill();

        ctx.fillStyle = i === 0 ? "#00e5ff" : "rgba(255, 255, 255, 0.9)";
        ctx.font = "bold 16px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(`0${i + 1}`, 88, y + 38);

        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(truncateText(ctx, art, 560), 126, y + 40);

        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "13px 'JetBrains Mono', monospace";
        ctx.fillText(i === 0 ? "★ DOMINANT" : "IN ROTATION", W - 74, y + 38);
    });

    // 8. ON-REPEAT ANTHEM SPOTLIGHT
    const anthemBoxY = 570;
    const anthemBoxH = 135;

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "700 13px 'JetBrains Mono', monospace";
    ctx.fillText("// FEATURED ON-REPEAT ANTHEM", 54, anthemBoxY - 14);

    const anthemGrad = ctx.createLinearGradient(54, anthemBoxY, W - 54, anthemBoxY + anthemBoxH);
    anthemGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
    anthemGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
    ctx.fillStyle = anthemGrad;
    drawRoundedRect(ctx, 54, anthemBoxY, W - 108, anthemBoxH, 16);
    ctx.fill();
    ctx.strokeStyle = `rgba(${profile.accentRgb}, 0.45)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Stylized Vinyl Record
    const vinylX = 115;
    const vinylY = anthemBoxY + anthemBoxH / 2;
    ctx.beginPath();
    ctx.arc(vinylX, vinylY, 44, 0, Math.PI * 2);
    ctx.fillStyle = "#0c0f17";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(vinylX, vinylY, 28, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(vinylX, vinylY, 14, 0, Math.PI * 2);
    ctx.fillStyle = profile.primary;
    ctx.fill();

    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px 'Outfit', sans-serif";
    ctx.fillText(truncateText(ctx, trackName, 480), 185, anthemBoxY + 56);

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "600 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(truncateText(ctx, `by ${trackArtist}`, 480), 185, anthemBoxY + 92);

    // 9. VIBE SPECTRUM METERS
    const vibeBoxY = 740;
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "700 13px 'JetBrains Mono', monospace";
    ctx.fillText("// SONIC VIBE SPECTRUM", 54, vibeBoxY - 14);

    const metrics = [
        { label: "CHILL RESONANCE", val: profile.vibeValues.chill, col: "#00e5ff" },
        { label: "GROOVE COEFFICIENT", val: profile.vibeValues.groove, col: "#a855f7" },
        { label: "VOLTAGE / DRIVE", val: profile.vibeValues.voltage, col: "#f59e0b" },
        { label: "ATMOSPHERIC DEPTH", val: profile.vibeValues.aura, col: profile.primary }
    ];

    const barW = W - 108 - 250;
    metrics.forEach((m, idx) => {
        const y = vibeBoxY + idx * 46;

        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "700 14px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText(m.label, 54, y + 16);

        const trackX = W - 54 - barW;
        ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
        drawRoundedRect(ctx, trackX, y + 2, barW, 16, 8);
        ctx.fill();

        ctx.fillStyle = m.col;
        drawRoundedRect(ctx, trackX, y + 2, barW * m.val, 16, 8);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.textAlign = "right";
        ctx.fillText(`${Math.round(m.val * 100)}%`, trackX - 12, y + 15);
    });

    // 10. DIGITAL WAVEFORM & VERIFICATION BARCODE
    const stampY = 960;
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    drawRoundedRect(ctx, 54, stampY, W - 108, 120, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const waveStartX = 80;
    const waveW = W - 160;
    const barCount = 44;
    const step = waveW / barCount;

    for (let i = 0; i < barCount; i++) {
        const barHeight = Math.sin(i * 0.25) * 22 + Math.cos(i * 0.7) * 16 + 26;
        const bx = waveStartX + i * step;
        const by = stampY + 60 - barHeight / 2;

        ctx.fillStyle = i % 3 === 0 ? profile.primary : "rgba(0, 229, 255, 0.6)";
        ctx.fillRect(bx, by, 3.5, barHeight);
    }

    const today = new Date();
    const dateFormatted = today.toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
    });
    const randomHex = Math.floor(Math.random() * 89999 + 10000);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "600 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`ID: NS-${randomHex}-VIBE // 48kHz / 24-BIT`, 80, stampY + 102);

    ctx.textAlign = "right";
    ctx.fillText(`SYNTHESIZED: ${dateFormatted.toUpperCase()}`, W - 80, stampY + 102);

    // 11. FOOTER BRANDING
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    ctx.moveTo(54, H - 140);
    ctx.lineTo(W - 54, H - 140);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px 'Outfit', sans-serif";
    ctx.fillText("NEXASOUL CREATIVE TECHNOLOGY LAB", W / 2, H - 98);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Developed at Chandigarh University // Living Harmonium Identity Engine", W / 2, H - 74);

    ctx.fillStyle = "rgba(184, 255, 36, 0.85)";
    ctx.font = "700 11px 'JetBrains Mono', monospace";
    ctx.fillText("VERIFIED CREATIVE TECHNOLOGY ARTIFACT", W / 2, H - 50);
}

// Rounded Rectangle Helper
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function truncateText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) {
        return text;
    }
    let truncated = text;
    while (truncated.length > 0 && ctx.measureText(truncated + "...").width > maxWidth) {
        truncated = truncated.slice(0, -1);
    }
    return truncated + "...";
}

// ===== 17. CARD ACTIONS (DOWNLOAD WITH POLISHED FEEDBACK) =====
function downloadCard() {
    const canvas = document.getElementById("musicCard");
    const downloadBtn = document.getElementById("downloadBtn");
    const downloadBtnText = document.getElementById("downloadBtnText");
    if (!canvas) return;

    if (downloadBtnText) {
        downloadBtnText.textContent = "Downloading...";
    }

    const safeMood = AppState.selectedMood ? AppState.selectedMood.toLowerCase().replace(/\s+/g, "-") : "identity";
    const fileName = `nexasoul-moodify-${safeMood}.png`;

    setTimeout(() => {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        link.click();

        if (downloadBtnText) {
            downloadBtnText.textContent = "Downloaded ✓";
        }
        showToast("✨ High-Resolution Identity Card Downloaded!");
        launchConfetti(80);

        setTimeout(() => {
            if (downloadBtnText) {
                downloadBtnText.textContent = "Download High-Res PNG";
            }
        }, 2500);
    }, 400);
}

async function shareCard() {
    const canvas = document.getElementById("musicCard");
    if (!canvas) return;

    const shareTitle = "My NexaSoul Music Identity Card";
    const shareText = `Check out my visual music identity card on Moodify by NexaSoul! Mood: ${AppState.selectedMood || "Electric"}`;

    if (navigator.share && navigator.canShare) {
        try {
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    fallbackShareCopy();
                    return;
                }
                const file = new File([blob], "music-identity.png", { type: "image/png" });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: shareTitle,
                        text: shareText
                    });
                    showToast("🚀 Card shared successfully!");
                } else {
                    await navigator.share({
                        title: shareTitle,
                        text: shareText,
                        url: window.location.href
                    });
                    showToast("🚀 Shared successfully!");
                }
            });
            return;
        } catch (err) {
            if (err.name !== "AbortError") {
                fallbackShareCopy();
            }
            return;
        }
    }

    fallbackShareCopy();
}

function fallbackShareCopy() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast("🔗 Moodify share link copied to clipboard!");
        }).catch(() => {
            showToast("✨ Share link: " + window.location.href);
        });
    } else {
        showToast("✨ Copy link from your browser to share!");
    }
}

function restartForm() {
    document.getElementById("cardSection").classList.remove("active");
    document.querySelector(".stepper-bar-wrapper").style.display = "block";
    document.getElementById("step1").classList.add("active");
    updateProgress(1);
    AppState.currentStep = 1;
    AppState.selectedMood = null;

    document.querySelectorAll(".mood-tile").forEach(c => {
        c.classList.remove("selected");
        c.setAttribute("aria-checked", "false");
    });

    const moodText = document.getElementById("currentSelectedMoodText");
    if (moodText) {
        moodText.textContent = "None selected";
        moodText.style.color = "var(--text-secondary)";
    }

    const harmoniumMoodTag = document.getElementById("harmoniumMoodTag");
    if (harmoniumMoodTag) {
        harmoniumMoodTag.textContent = "SYNTHWAVE";
        harmoniumMoodTag.style.color = "var(--text-primary)";
    }

    document.querySelectorAll("input").forEach(i => i.value = "");
    if (previewTitleDisplay) previewTitleDisplay.textContent = "Your Track Name";
    if (previewArtistDisplay) previewArtistDisplay.textContent = "Your Track Artist";

    // Reset root variables
    document.documentElement.style.setProperty("--mood-accent", "#00e5ff");
    document.documentElement.style.setProperty("--mood-accent-rgb", "0, 229, 255");
    document.documentElement.style.setProperty("--mood-glow", "rgba(0, 229, 255, 0.3)");

    scrollToForm();
}