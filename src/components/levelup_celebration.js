// Siddha Meditation App - Level Up Celebration Component
// Plays a synthetic singing bowl chime, shows rotating sacred geometry, falling leaf particles, and a grounding quote.

const LEVEL_NAMES = [
    "Novice", "Initiate", "Adept", "Seeker", "Wanderer",
    "Practitioner", "Disciple", "Guide", "Sage", "Master"
];

const GROUNDING_QUOTES = [
    { text: "Be here now.", author: "Ram Dass" },
    { text: "The little things? The little moments? They aren't little.", author: "Jon Kabat-Zinn" },
    { text: "Peace is every step.", author: "Thich Nhat Hanh" },
    { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
    { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" },
    { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
    { text: "Quiet mind, warm heart.", author: "Zen Proverb" },
    { text: "In the midst of movement, make peace in your heart.", author: "Deepak Chopra" }
];

// Synth chime using Web Audio API (metal singing bowl tone)
function playSingingBowl() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        // Warm, rich metal bowl frequencies
        // A deep fundamental and detuned higher harmonics
        const freqs = [180, 271, 362, 545, 728];
        const gains = [0.45, 0.28, 0.18, 0.09, 0.04];

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.55, now + 0.18); // Soft attack
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 6.0); // Long gentle decay

        masterGain.connect(ctx.destination);

        freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Add tiny detune for acoustic beating (warmth)
            const detune = (Math.random() - 0.5) * 1.8;
            osc.frequency.setValueAtTime(f + detune, now);

            // Add LFO for pitch/volume wobble
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.setValueAtTime(0.75 + Math.random() * 0.3, now); // ~0.8Hz wobble
            lfoGain.gain.setValueAtTime(f * 0.004, now); // Tiny wobble range

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            gain.gain.setValueAtTime(gains[idx], now);
            osc.connect(gain);
            gain.connect(masterGain);

            lfo.start(now);
            osc.start(now);

            osc.stop(now + 6.5);
            lfo.stop(now + 6.5);
        });
    } catch (e) {
        console.warn("[Siddha Audio] Failed to synthesize singing bowl:", e);
    }
}

// Injects the necessary styles into the head
function injectStyles() {
    if (document.getElementById("siddha-levelup-styles")) return;

    const style = document.createElement("style");
    style.id = "siddha-levelup-styles";
    style.textContent = `
        /* Overlay wrapper */
        .lu-overlay {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, rgba(30, 44, 34, 0.95) 0%, rgba(20, 28, 23, 0.97) 100%);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
            color: #f4f3ed;
            font-family: var(--font-body), sans-serif;
            overflow: hidden;
        }

        .lu-overlay.active {
            opacity: 1;
        }

        /* Container Card */
        .lu-card {
            width: 100%;
            max-width: 400px;
            padding: var(--spacing-xl);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 10;
            transform: scale(0.92) translateY(10px);
            opacity: 0;
            transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease;
        }

        .lu-overlay.active .lu-card {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        /* Mandala Container */
        .lu-mandala-wrap {
            position: relative;
            width: 180px;
            height: 180px;
            margin-bottom: var(--spacing-lg);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Sacred Geometry rotating SVGs */
        .lu-svg {
            position: absolute;
            width: 100%;
            height: 100%;
            fill: none;
            stroke: rgba(197, 208, 201, 0.2);
            stroke-width: 1;
        }

        .lu-svg-outer {
            stroke: rgba(197, 208, 201, 0.15);
            animation: lu-spin-cw 35s linear infinite;
        }

        .lu-svg-inner {
            width: 80%;
            height: 80%;
            stroke: rgba(134, 155, 143, 0.4);
            animation: lu-spin-ccw 25s linear infinite;
        }

        @keyframes lu-spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes lu-spin-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }

        /* Central Level Circle */
        .lu-center-badge {
            position: absolute;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 30px rgba(134, 155, 143, 0.4), inset 0 2px 4px rgba(255,255,255,0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            animation: lu-pulse 4s ease-in-out infinite;
        }

        @keyframes lu-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(134, 155, 143, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 45px rgba(134, 155, 143, 0.65); }
        }

        .lu-level-num {
            font-size: 26px;
            font-weight: 700;
            line-height: 1;
            margin: 0;
            color: #f4f3ed;
        }

        .lu-level-lbl {
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 2px;
        }

        /* Text Styling */
        .lu-title {
            font-family: var(--font-heading), serif;
            font-size: 22px;
            color: #f4f3ed;
            margin: 0 0 var(--spacing-xs);
            letter-spacing: 0.5px;
            font-weight: 500;
        }

        .lu-subtitle {
            font-size: 13px;
            color: var(--color-accent-light);
            margin: 0 0 var(--spacing-lg);
            font-weight: 500;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        /* Quote box */
        .lu-quote-box {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-xl);
            max-width: 320px;
            position: relative;
        }

        .lu-quote-text {
            font-family: var(--font-heading), serif;
            font-style: italic;
            font-size: 13px;
            line-height: 1.5;
            color: rgba(255,255,255,0.85);
            margin-bottom: var(--spacing-xs);
        }

        .lu-quote-author {
            font-size: 10px;
            color: var(--color-text-muted);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Action Button */
        .lu-btn {
            background: #f4f3ed;
            color: var(--color-text-primary);
            border: none;
            padding: 12px 32px;
            border-radius: var(--radius-full);
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.5px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
            opacity: 0;
            transform: translateY(10px);
            transition: all var(--transition-normal), opacity 0.8s ease, transform 0.8s ease;
        }

        .lu-btn.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .lu-btn:active {
            transform: scale(0.96);
            background: #e4e3dd;
        }

        /* Leaf Particle Canvas */
        .lu-canvas {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
}

// Particle System for falling leaves
class ParticleEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.particles = [];
        this.active = false;
        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.active = true;
        this.particles = [];
        for (let i = 0; i < 28; i++) {
            this.particles.push(this.createParticle(true));
        }
        this.loop();
    }

    stop() {
        this.active = false;
    }

    createParticle(randomY = false) {
        return {
            x: Math.random() * this.canvas.width,
            y: randomY ? Math.random() * this.canvas.height : -20,
            size: 8 + Math.random() * 12,
            speedY: 0.6 + Math.random() * 0.9,
            speedX: (Math.random() - 0.5) * 0.4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            swayRange: 20 + Math.random() * 30,
            swaySpeed: 0.005 + Math.random() * 0.01,
            swayOffset: Math.random() * 100,
            opacity: 0.2 + Math.random() * 0.45
        };
    }

    loop() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now();

        this.particles.forEach((p, idx) => {
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            
            // Sway back and forth using sine wave
            const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.speedX * 3;
            p.x += p.speedX + sway;

            // Draw a simplified leaf shape (grounding organic particle)
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.globalAlpha = p.opacity;
            
            // Draw dual-curved leaf path
            this.ctx.beginPath();
            this.ctx.moveTo(0, -p.size / 2);
            this.ctx.quadraticCurveTo(p.size / 2.5, 0, 0, p.size / 2);
            this.ctx.quadraticCurveTo(-p.size / 2.5, 0, 0, -p.size / 2);
            this.ctx.closePath();

            // Soft sage green color
            this.ctx.fillStyle = "rgba(134, 155, 143, 0.75)";
            this.ctx.fill();

            // Add center leaf vein line
            this.ctx.beginPath();
            this.ctx.moveTo(0, -p.size / 2);
            this.ctx.lineTo(0, p.size / 2);
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            this.ctx.restore();

            // Reset when falling off screen
            if (p.y > this.canvas.height + 20) {
                this.particles[idx] = this.createParticle(false);
            }
        });

        requestAnimationFrame(() => this.loop());
    }
}

// Injects SVG Sacred Geometry mandala nodes into the element
function renderSacredGeometry(container) {
    // Outer mandala: Flower of Life-inspired node lines
    const outerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    outerSvg.setAttribute("class", "lu-svg lu-svg-outer");
    outerSvg.setAttribute("viewBox", "0 0 100 100");

    let circlesHTML = "";
    // Draw 6 interlocking petals around center
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const cx = 50 + 20 * Math.cos(angle);
        const cy = 50 + 20 * Math.sin(angle);
        circlesHTML += `<circle cx="${cx}" cy="${cy}" r="20" />`;
    }
    circlesHTML += `<circle cx="50" cy="50" r="40" />`;
    circlesHTML += `<circle cx="50" cy="50" r="20" />`;
    outerSvg.innerHTML = circlesHTML;

    // Inner mandala: Concentric geometry
    const innerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    innerSvg.setAttribute("class", "lu-svg lu-svg-inner");
    innerSvg.setAttribute("viewBox", "0 0 100 100");
    
    let innerHTML = "";
    // Draw nesting polygons/stars
    for (let r of [15, 30, 45]) {
        let pts = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            pts.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
        }
        innerHTML += `<polygon points="${pts.join(" ")}" />`;
    }
    innerSvg.innerHTML = innerHTML;

    container.appendChild(outerSvg);
    container.appendChild(innerSvg);
}

// Shows the celebration modal
export function triggerLevelUpModal(oldLevel, newLevel) {
    injectStyles();

    // Ensure we place it in the main container `#app`
    const appEl = document.getElementById("app") || document.body;

    // Remove any existing overlay
    const existing = document.getElementById("levelup-modal");
    if (existing) existing.remove();

    // Elements
    const overlay = document.createElement("div");
    overlay.id = "levelup-modal";
    overlay.className = "lu-overlay";

    const canvas = document.createElement("canvas");
    canvas.className = "lu-canvas";
    overlay.appendChild(canvas);

    const card = document.createElement("div");
    card.className = "lu-card";

    // Mandala Wrap
    const mandalaWrap = document.createElement("div");
    mandalaWrap.className = "lu-mandala-wrap";
    renderSacredGeometry(mandalaWrap);

    // Inner level indicator badge
    const badge = document.createElement("div");
    badge.className = "lu-center-badge";
    badge.innerHTML = `
        <span class="lu-level-num">${newLevel}</span>
        <span class="lu-level-lbl">Level</span>
    `;
    mandalaWrap.appendChild(badge);
    card.appendChild(mandalaWrap);

    // Title & Level Information
    const titleEl = document.createElement("h2");
    titleEl.className = "lu-title";
    titleEl.textContent = "Consciousness Expanded";
    card.appendChild(titleEl);

    const subtitleEl = document.createElement("p");
    subtitleEl.className = "lu-subtitle";
    const titleText = LEVEL_NAMES[Math.min(newLevel - 1, LEVEL_NAMES.length - 1)] || "Novice";
    subtitleEl.textContent = `Level Up · ${titleText}`;
    card.appendChild(subtitleEl);

    // Calming quote selection
    const quote = GROUNDING_QUOTES[Math.floor(Math.random() * GROUNDING_QUOTES.length)];
    const quoteBox = document.createElement("div");
    quoteBox.className = "lu-quote-box";
    quoteBox.innerHTML = `
        <p class="lu-quote-text">“${quote.text}”</p>
        <span class="lu-quote-author">— ${quote.author}</span>
    `;
    card.appendChild(quoteBox);

    // Button
    const btn = document.createElement("button");
    btn.className = "lu-btn";
    btn.textContent = "Return to Practice";
    card.appendChild(btn);

    overlay.appendChild(card);
    appEl.appendChild(overlay);

    // Start particles
    const engine = new ParticleEngine(canvas);
    engine.start();

    // Trigger singing bowl chord
    playSingingBowl();

    // Animate in overlay & card
    setTimeout(() => {
        overlay.classList.add("active");
    }, 50);

    // Delay button fade-in to prompt pause/reflection
    setTimeout(() => {
        btn.classList.add("visible");
    }, 1500);

    // Dismiss trigger
    const dismiss = () => {
        overlay.classList.remove("active");
        engine.stop();
        setTimeout(() => {
            overlay.remove();
            
            // Refresh active screen display so new level registers in UI
            const activeScreen = document.querySelector(".screen.active");
            if (activeScreen && typeof activeScreen.updateData === "function") {
                try { activeScreen.updateData(); }
                catch (e) { console.error("[Siddha Levelup] Screen refresh error:", e); }
            }
        }, 800);
    };

    btn.addEventListener("click", dismiss);
}

// Global window event listener initialization
window.addEventListener("siddha-levelup", (e) => {
    const { oldLevel, newLevel } = e.detail;
    triggerLevelUpModal(oldLevel, newLevel);
});
