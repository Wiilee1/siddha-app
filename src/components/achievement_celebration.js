// Siddha Meditation App - Achievement Celebration Component
// Plays a singing bowl chord, shows rotating geometry, leaf particles, and the unlocked badge name & description.

// Synth chime using Web Audio API (singing bowl)
function playSingingBowlChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        // Rich singing bowl frequencies for a peaceful chord
        const freqs = [220, 330, 440, 660];
        const gains = [0.4, 0.25, 0.15, 0.08];

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.5, now + 0.15); // soft attack
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5); // decay

        masterGain.connect(ctx.destination);

        freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Tiny detuning for a organic vibration
            const detune = (Math.random() - 0.5) * 1.5;
            osc.frequency.setValueAtTime(f + detune, now);

            // Volume modulation LFO
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.setValueAtTime(0.8, now);
            lfoGain.gain.setValueAtTime(f * 0.003, now);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            gain.gain.setValueAtTime(gains[idx], now);
            osc.connect(gain);
            gain.connect(masterGain);

            lfo.start(now);
            osc.start(now);

            osc.stop(now + 5.0);
            lfo.stop(now + 5.0);
        });
    } catch (e) {
        console.warn("[Siddha Audio] Failed to synthesize singing bowl:", e);
    }
}

function injectStyles() {
    if (document.getElementById("siddha-achievement-styles")) return;

    const style = document.createElement("style");
    style.id = "siddha-achievement-styles";
    style.textContent = `
        /* Achievement Overlay */
        .ac-overlay {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, rgba(26, 36, 30, 0.94) 0%, rgba(18, 24, 20, 0.96) 100%);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
            color: #f4f3ed;
            font-family: var(--font-body), sans-serif;
            overflow: hidden;
        }

        .ac-overlay.active {
            opacity: 1;
        }

        .ac-card {
            width: 100%;
            max-width: 360px;
            padding: var(--spacing-xl) var(--spacing-lg);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 10;
            transform: scale(0.9) translateY(12px);
            opacity: 0;
            transition: transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.7s ease;
        }

        .ac-overlay.active .ac-card {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        /* Rotating geometry wrapper */
        .ac-badge-wrap {
            position: relative;
            width: 150px;
            height: 150px;
            margin-bottom: var(--spacing-lg);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ac-svg {
            position: absolute;
            width: 100%;
            height: 100%;
            fill: none;
            stroke: rgba(197, 208, 201, 0.22);
            stroke-width: 1;
        }

        .ac-svg-outer {
            animation: ac-spin-cw 28s linear infinite;
        }

        .ac-svg-inner {
            width: 80%;
            height: 80%;
            stroke: rgba(134, 155, 143, 0.35);
            animation: ac-spin-ccw 20s linear infinite;
        }

        @keyframes ac-spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes ac-spin-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }

        .ac-emoji-center {
            position: absolute;
            width: 66px;
            height: 66px;
            border-radius: 50%;
            background: linear-gradient(135deg, #44594c 0%, #2b3931 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 0 0 25px rgba(134, 155, 143, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.15);
            animation: ac-pulse 4s ease-in-out infinite;
        }

        @keyframes ac-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.04); }
        }

        .ac-lbl-type {
            font-size: 11px;
            color: var(--color-accent);
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
            margin: 0 0 6px;
        }

        .ac-title {
            font-family: var(--font-heading), serif;
            font-size: 24px;
            font-weight: 500;
            color: #f4f3ed;
            margin: 0 0 var(--spacing-sm);
        }

        .ac-desc {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
            margin: 0 0 var(--spacing-lg);
            max-width: 280px;
        }

        .ac-reward-box {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 20px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 700;
            color: var(--color-accent-light);
            margin-bottom: var(--spacing-xl);
        }

        .ac-btn {
            background: #f4f3ed;
            color: var(--color-text-primary);
            border: none;
            padding: 12px 36px;
            border-radius: 40px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
            opacity: 0;
            transform: translateY(8px);
            transition: all 0.3s ease, opacity 0.8s ease, transform 0.8s ease;
        }

        .ac-btn.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .ac-btn:active {
            transform: scale(0.96);
            background: #e4e3dd;
        }

        .ac-canvas {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
}

// Particle System for floating sparkles
class SparkleEngine {
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
        for (let i = 0; i < 35; i++) {
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
            y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 10,
            size: 1.5 + Math.random() * 2.5,
            speedY: -(0.4 + Math.random() * 0.7),
            speedX: (Math.random() - 0.5) * 0.3,
            alpha: 0.15 + Math.random() * 0.5,
            alphaSpeed: 0.001 + Math.random() * 0.002,
            gold: Math.random() > 0.4
        };
    }

    loop() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, idx) => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.alpha -= p.alphaSpeed;

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.gold ? "#dfb04d" : "#869b8f";
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = p.gold ? "rgba(223, 176, 77, 0.4)" : "rgba(134, 155, 143, 0.4)";
            this.ctx.fill();
            this.ctx.restore();

            if (p.y < -10 || p.alpha <= 0) {
                this.particles[idx] = this.createParticle(false);
            }
        });

        requestAnimationFrame(() => this.loop());
    }
}

function drawMandalaGeometry(container) {
    // Outer svg
    const outerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    outerSvg.setAttribute("class", "ac-svg ac-svg-outer");
    outerSvg.setAttribute("viewBox", "0 0 100 100");

    let circles = "";
    // Draw 8-point geometric star lines
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const cx = 50 + 16 * Math.cos(angle);
        const cy = 50 + 16 * Math.sin(angle);
        circles += `<circle cx="${cx}" cy="${cy}" r="16" />`;
    }
    circles += `<circle cx="50" cy="50" r="35" />`;
    outerSvg.innerHTML = circles;

    // Inner svg
    const innerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    innerSvg.setAttribute("class", "ac-svg ac-svg-inner");
    innerSvg.setAttribute("viewBox", "0 0 100 100");

    let innerHTML = "";
    // Draw hexagons
    for (let r of [12, 24]) {
        let pts = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            pts.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
        }
        innerHTML += `<polygon points="${pts.join(" ")}" />`;
    }
    innerSvg.innerHTML = innerHTML;

    container.appendChild(outerSvg);
    container.appendChild(innerSvg);
}

export function triggerAchievementModal(ach) {
    injectStyles();

    const appEl = document.getElementById("app") || document.body;

    // Remove duplicates
    const existing = document.getElementById(`ach-modal-${ach.id}`);
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = `ach-modal-${ach.id}`;
    overlay.className = "ac-overlay";

    const canvas = document.createElement("canvas");
    canvas.className = "ac-canvas";
    overlay.appendChild(canvas);

    const card = document.createElement("div");
    card.className = "ac-card";

    // Badge Circle
    const badgeWrap = document.createElement("div");
    badgeWrap.className = "ac-badge-wrap";
    drawMandalaGeometry(badgeWrap);

    const centerEmoji = document.createElement("div");
    centerEmoji.className = "ac-emoji-center";
    centerEmoji.textContent = ach.emoji;
    badgeWrap.appendChild(centerEmoji);
    card.appendChild(badgeWrap);

    // Labels
    const typeLbl = document.createElement("p");
    typeLbl.className = "ac-lbl-type";
    typeLbl.textContent = "Milestone Unlocked";
    card.appendChild(typeLbl);

    const titleEl = document.createElement("h2");
    titleEl.className = "ac-title";
    titleEl.textContent = ach.title;
    card.appendChild(titleEl);

    const descEl = document.createElement("p");
    descEl.className = "ac-desc";
    descEl.textContent = ach.desc;
    card.appendChild(descEl);

    // Reward indicator
    const rewardBox = document.createElement("div");
    rewardBox.className = "ac-reward-box";
    rewardBox.innerHTML = `
        <span class="material-symbols-rounded" style="font-size:15px; font-variation-settings: 'FILL' 1;">stars</span>
        +${ach.xp} XP Granted
    `;
    card.appendChild(rewardBox);

    // Action Button
    const btn = document.createElement("button");
    btn.className = "ac-btn";
    btn.textContent = "Acknowledge";
    card.appendChild(btn);

    overlay.appendChild(card);
    appEl.appendChild(overlay);

    const engine = new SparkleEngine(canvas);
    engine.start();

    playSingingBowlChime();

    setTimeout(() => {
        overlay.classList.add("active");
    }, 50);

    setTimeout(() => {
        btn.classList.add("visible");
    }, 1200);

    const dismiss = () => {
        overlay.classList.remove("active");
        engine.stop();
        setTimeout(() => {
            overlay.remove();

            // Refresh UI if needed
            const activeScreen = document.querySelector(".screen.active");
            if (activeScreen && typeof activeScreen.updateData === "function") {
                try { activeScreen.updateData(); }
                catch (e) { console.error("[Siddha Achievement] Screen refresh error:", e); }
            }
        }, 800);
    };

    btn.addEventListener("click", dismiss);
}

// Global window event listener initialization
window.addEventListener("siddha-achievement", (e) => {
    try {
        const raw = localStorage.getItem('siddha_db');
        if (raw) {
            const state = JSON.parse(raw);
            if (state && !state.completedTutorial) return;
        }
    } catch(err) {}
    triggerAchievementModal(e.detail);
});
