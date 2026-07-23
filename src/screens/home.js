import { DB, xpInCurrentLevel } from '../services/db.js';
import { Synth } from '../services/synth.js';

const DIALOGUES = [
    "Don't just do something, sit there!",
    "True stillness is not the absence of sound, but the presence of the one who listens.",
    "Silence is not empty. It is full of presence.",
    "When you become aware of the silence around you, immediately you touch the stillness within.",
    "There is a quiet space inside you that remains untouched by any storm. Let us sit there.",
    "You are not your thoughts. You are the spacious awareness in which they arise and dissolve.",
    "Be still. Look. Listen. In this moment, there is nothing else to do.",
    "Allow this moment to be exactly as it is. Let go of the need to change anything.",
    "When you lose touch with inner stillness, you lose yourself in the world. Return here.",
    "Close your eyes, find the touchpoints of the air, and let the rest of the world wait.",
    "Listen to the quiet between two breaths. In that brief gap, you are completely free.",
    "Feel the weight of gravity holding you down. The earth is supporting this sit. Rest into it.",
    "Observe the cool breeze at the tip of the nose on the inhale, and the warm sigh on the exhale.",
    "Let your shoulders drop. Release the tension in your jaw. Let the next breath be completely effortless.",
    "Feel the gentle rise and fall of your chest. Like soft waves on a calm, quiet lake.",
    "Are we meditating today, or are we just sitting here looking extremely peaceful?",
    "Look at a tree, a flower, a leaf. Notice how still they are, how rooted in being. Let them teach you.",
    "The mind is always busy. But beneath the noise, there is a deep reservoir of calm. Dive in.",
    "Watch your thoughts arise and dissolve, like clouds drifting across an infinite sky.",
    "The breath is your anchor. Whenever the storm of thoughts arrives, return to the breath."
];

export function renderHome() {
    const container = document.createElement('div');
    container.className = 'screen home-screen';

    container.innerHTML = `
        <div class="home-top-section">
            <!-- Header Box Card -->
            <div class="home-header home-header-box">
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="./src/assets/logo.png" class="home-logo-avatar" alt="Siddha">
                    <span style="font-weight:700; font-size:16px; font-family:var(--font-heading); color:#2c3e38;">Siddha</span>
                    <button id="dev-add-xp" style="font-size:9px; padding:2px 5px; background:transparent; border:1px solid #dcdcdc; border-radius:4px; cursor:pointer; color:#777;">+500 XP</button>
                </div>
                <!-- Inline greeting at top -->
                <div class="home-header-greeting" style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500; font-family: var(--font-body); display: flex; align-items: center; gap: 4px;">
                    Good day, <strong id="home-name">Alex</strong> 👋
                </div>
                <!-- Profile Avatar at top right -->
                <button id="home-profile-btn" aria-label="Profile" style="padding:0; background:none; border:none; cursor:pointer; flex-shrink:0;">
                    <img id="home-profile-avatar-img" src="./src/assets/avatar_monk.jpg" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:2px solid var(--color-accent); box-shadow:0 2px 6px rgba(0,0,0,0.1);" alt="Profile">
                </button>
            </div>
        </div>

        <!-- Hero Area -->
        <div class="home-hero-area">
            <div id="hero-anim-container" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;"></div>
            <div id="companion-speech-bubble" class="companion-bubble">
                <div class="companion-bubble-top-icon">
                    <span class="material-symbols-rounded" style="font-size:16px; color:#5c7866;">spa</span>
                </div>
                <span id="companion-bubble-text"></span>
                <div class="companion-bubble-tail">
                    <div class="companion-bubble-tail-notch"></div>
                </div>
            </div>
        </div>

        <!-- Stats Area -->
        <div class="home-stats-area">


            <!-- Daily goal -->
            <div class="home-stat-card row-card" data-link="profile" style="margin-top: 10px;">
                <div style="flex:1;">
                    <p class="home-stat-title">Today's Goal</p>
                    <div style="display:flex; align-items:baseline; gap:4px; margin-top:2px;">
                        <span class="home-stat-big" id="home-today-minutes">0</span>
                        <span class="home-stat-title" style="font-size: 14px;">/ <span id="home-goal-minutes">20</span> min</span>
                    </div>
                    <div class="home-bar-track">
                        <div class="home-bar-fill" id="home-today-bar"></div>
                    </div>
                </div>
                <div class="home-icon-badge plant"><span class="material-symbols-rounded">potted_plant</span></div>
            </div>

            <!-- Streak + Level row -->
            <div class="home-stat-row">
                <div class="home-stat-card" data-link="reflect">
                    <p class="home-stat-title">Streak</p>
                    <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                        <span class="material-symbols-rounded" style="color:#e65c00; font-variation-settings: 'FILL' 1;">local_fire_department</span>
                        <div style="display:flex; align-items:baseline; gap:4px;">
                            <span class="home-stat-big" id="home-streak">0</span>
                            <span class="home-stat-title">days</span>
                        </div>
                    </div>
                </div>
                <div class="home-stat-card" data-link="profile" style="flex: 1.5;">
                    <div style="display:flex; justify-content:space-between; width:100%;">
                        <div>
                            <p class="home-stat-title">Level <br><span id="home-level" style="font-size:10px;">1</span></p>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span class="home-stat-big" id="home-xp">0</span>
                            <span class="home-stat-title" style="font-size:10px;">XP</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:8px; width:100%;">
                        <div class="home-bar-track" style="margin:0; flex:1;"><div class="home-bar-fill dark" id="home-xp-bar"></div></div>
                    </div>
                </div>
            </div>

            <!-- Total Info row -->
            <div class="home-stat-row">
                <div class="home-stat-card" data-link="profile">
                    <p class="home-stat-title">Total Sessions</p>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:2px;">
                        <span class="material-symbols-rounded" style="color:#6b8273; font-variation-settings: 'FILL' 1;">self_improvement</span>
                        <span class="home-stat-big" id="home-total-sessions">0</span>
                    </div>
                </div>
                <div class="home-stat-card" data-link="profile">
                    <p class="home-stat-title">Mindful Mins</p>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:2px;">
                        <span class="material-symbols-rounded" style="color:#6b8273;">schedule</span>
                        <div style="display:flex; align-items:baseline; gap:2px;">
                            <span class="home-stat-big" id="home-total-mins">0</span>
                            <span class="home-stat-title">m</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Daily Quest Card -->
            <div class="home-stat-card row-card dq-card" id="home-dq-card" style="margin-top: 10px; cursor: pointer; transition: all 0.2s; width: 100%;">
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:6px;">
                        <p class="home-stat-title" style="font-weight:700;">Daily Quest</p>
                        <span id="home-dq-badge" style="font-size:9.5px; font-weight:700; background:var(--color-accent-light); color:var(--color-accent-dark); padding:2px 6px; border-radius:8px;">+25 XP</span>
                    </div>
                    <p id="home-dq-text" class="text-sm" style="color:var(--color-text-secondary); margin-top:2px; font-size:11px;">Complete your daily practice</p>
                </div>
                <div class="home-icon-badge" id="home-dq-icon" style="background:#e8f4ec; color:#2c8242;">
                    <span class="material-symbols-rounded">task_alt</span>
                </div>
            </div>

            <!-- Wisdom Card -->
            <div class="home-stat-card row-card" data-link="wisdom" style="margin-top: 10px; background: linear-gradient(135deg, #ffffff 0%, #f6f8f6 100%); border-left: 3px solid var(--color-accent); width: 100%;">
                <div style="flex:1;">
                    <p class="home-stat-title" style="color:var(--color-accent-dark); font-weight:700;">Wisdom Library</p>
                    <p class="text-sm" style="color:var(--color-text-secondary); margin-top:2px; font-size:11px;">Expand your understanding of meditation and mindfulness</p>
                </div>
                <div class="home-icon-badge plant" style="background:var(--color-accent-light); color:var(--color-accent-dark);"><span class="material-symbols-rounded">menu_book</span></div>
            </div>

        </div>
    `;


    const style = document.createElement('style');
    style.textContent = `
        .home-screen {
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0;
            background-color: #f4f3ed;
            background-size: 100% auto;
            background-position: center top;
            background-repeat: no-repeat;
            background-attachment: local;
            flex-direction: column;
        }

        .home-screen {
            padding-top: 0 !important;
        }

        .home-top-section {
            padding: 0;
            width: 100%;
            z-index: 20;
            position: relative;
        }

        .home-header-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: calc(12px + env(safe-area-inset-top, 0px)) 18px 12px;
            background: rgba(253, 252, 248, 0.94);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(134, 155, 143, 0.28);
            border-radius: 0;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        }
        .home-logo-avatar {
            width: 28px; height: 28px;
            border-radius: 50%;
            object-fit: cover;
        }
        .home-icon-btn {
            background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center;
        }
        .home-icon-btn .material-symbols-rounded { font-size: 28px; }

        /* Hero Area — background image only, no mascot */
        .home-hero-area {
            width: 100%;
            height: 380px;
            position: relative;
            flex-shrink: 0;
            pointer-events: none;
        }

        /* Stats Area */
        .home-stats-area {
            background: linear-gradient(to bottom, rgba(244, 243, 237, 0) 0%, rgba(244, 243, 237, 0.85) 40px, #f4f3ed 100px);
            padding: 32px 16px 90px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            position: relative;
        }

        /* Cards */
        .home-stat-card {
            background: white;
            border-radius: 16px;
            padding: 12px 14px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            flex: 1;
        }
        .home-stat-card:active { transform: scale(0.97); box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        
        .home-stat-card.companion-card {
            background: rgba(255, 255, 255, 0.82);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.45);
            box-shadow: 0 8px 32px rgba(0,0,0,0.04);
            cursor: default !important;
        }
        .home-stat-card.companion-card:active {
            transform: none !important;
        }
        
        .inventory-slot:active {
            transform: scale(0.94);
        }

        /* Today's Goal card has icon on the right → use row layout */
        .home-stat-card.row-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        .home-stat-row { display: flex; gap: 8px; }
        .home-stat-card > div:not(.home-icon-badge) { width: 100%; }

        .home-stat-title { font-size: 11px; color: #7a8a81; font-weight: 500; margin: 0; }
        .home-stat-big { font-size: 18px; font-weight: 700; color: #1b2e26; }

        .home-bar-track {
            width: 100%; height: 5px;
            background: #e4ede6;
            border-radius: 3px; margin-top: 6px; overflow: hidden;
        }
        .home-bar-fill {
            height: 100%; width: 0%;
            background: #53a362; /* bright green for today */
            border-radius: 3px;
            transition: width 0.5s;
        }
        .home-bar-fill.dark {
            background: #129eaf; /* teal for sync / dark level indicator */
        }

        .home-icon-badge {
            width: 36px; height: 36px; border-radius: 10px;
            display: flex; justify-content: center; align-items: center;
        }
        .home-icon-badge.plant { background: #f4f3ed; color: #7a8a81; }
        .home-icon-badge .material-symbols-rounded { font-size: 20px; }

        /* Hero Animations */
        .hero-breath-glow {
            position: absolute;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            width: 170px;
            height: 170px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(134, 155, 143, 0.6) 0%, rgba(134, 155, 143, 0) 70%);
            animation: hero-breath 6s ease-in-out infinite;
        }
        @keyframes hero-breath {
            0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.3; }
            50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.95; }
        }

        .steam-wisp {
            position: absolute;
            width: 5px;
            height: 22px;
            background: linear-gradient(to top, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 100%);
            border-radius: 50%;
            filter: blur(1.5px);
            animation: rise-wisp 3.5s infinite ease-in-out;
        }
        @keyframes rise-wisp {
            0% { transform: translateY(0) scaleX(1); opacity: 0; }
            30% { opacity: 0.75; }
            100% { transform: translateY(-60px) scaleX(2.5); opacity: 0; }
        }

        .butterfly {
            position: absolute;
            width: 18px;
            height: 18px;
            filter: drop-shadow(0 2px 5px rgba(0,0,0,0.18));
            animation: path-fly 20s infinite linear, wing-flap 0.1s infinite alternate;
        }
        @keyframes wing-flap {
            0% { transform: scaleX(0.1); }
            100% { transform: scaleX(1); }
        }
        @keyframes path-fly {
            0% { left: 18%; top: 58%; }
            25% { left: 38%; top: 32%; }
            50% { left: 70%; top: 46%; }
            75% { left: 46%; top: 68%; }
            100% { left: 18%; top: 58%; }
        }

        .gold-aura {
            position: absolute;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            width: 180px;
            height: 180px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(226, 184, 87, 0.45) 0%, rgba(226, 184, 87, 0) 70%);
            animation: aura-glow 5s ease-in-out infinite alternate;
        }
        @keyframes aura-glow {
            0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.45; }
            100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.95; }
        }

        .hero-canvas-el {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .companion-bubble {
            position: absolute;
            top: 68px;
            left: 50%;
            transform: translateX(-50%) scale(0.85);
            background: rgba(246, 245, 239, 0.42);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(134, 155, 143, 0.3);
            border-radius: 20px;
            padding: 10px 16px;
            max-width: 78%;
            min-width: 140px;
            text-align: center;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
            z-index: 10;
            cursor: pointer;
            pointer-events: none;
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
        }
        .companion-bubble.visible {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(-50%) scale(1);
        }
        .companion-bubble-top-icon {
            position: absolute;
            top: -11px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(246, 245, 239, 0.65);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            padding: 0 5px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 16px;
        }
        .companion-bubble.visible:hover {
            transform: translateX(-50%) scale(1.02);
            background: rgba(246, 245, 239, 0.58);
        }
        .companion-bubble.visible:active {
            transform: translateX(-50%) scale(0.97);
        }
        #companion-bubble-text {
            font-size: 11.5px;
            line-height: 1.42;
            color: #243329;
            font-family: var(--font-body);
            font-weight: 600;
            display: inline-block;
        }
        .companion-bubble-tail {
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
        }
        .companion-bubble-tail-notch {
            width: 10px;
            height: 10px;
            background: rgba(246, 245, 239, 0.42);
            border-right: 1px solid rgba(134, 155, 143, 0.3);
            border-bottom: 1px solid rgba(134, 155, 143, 0.3);
            transform: rotate(45deg);
            border-bottom-right-radius: 2px;
        }
        .companion-bubble.visible:hover .companion-bubble-tail {
            background: #ffffff;
        }
    `;

    container.appendChild(style);

    // Wire up buttons
    container.querySelector('#home-profile-btn').addEventListener('click', () => {
        document.querySelector('[data-target="profile"]')?.click();
    });


    // Dev tools
    container.querySelector('#dev-add-xp').addEventListener('click', (e) => {
        e.stopPropagation();
        DB.addXP(500);
        if (typeof container.updateData === 'function') container.updateData();
    });

    // Make stats interactive
    const statCards = container.querySelectorAll('.home-stat-card:not(.dq-card)');
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-link');
            if (target) {
                const navBtn = document.querySelector(`[data-target="${target}"]`);
                if (navBtn) navBtn.click();
                if (card.querySelector('#home-today-minutes')) {
                    setTimeout(() => {
                        const goalCard = document.querySelector('#profile-goal-card');
                        if (goalCard) goalCard.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                }
            }
        });
    });

    // Daily Quest card click
    const dqCard = container.querySelector('#home-dq-card');
    if (dqCard) {
        dqCard.addEventListener('click', () => {
            const dq = DB.getDailyQuest ? DB.getDailyQuest() : null;
            if (dq && (dq.completed || dq.claimed)) {
                return;
            }
            if (dq && dq.target) {
                document.querySelector(`[data-target="${dq.target}"]`)?.click();
            } else if (dq && dq.type === 'journey') {
                document.querySelector('[data-target="journey"]')?.click();
            } else if (dq && dq.type === 'wisdom') {
                document.querySelector('[data-target="wisdom"]')?.click();
            } else if (dq && dq.type === 'reflect') {
                document.querySelector('[data-target="reflect"]')?.click();
            } else {
                document.querySelector('[data-target="breathe"]')?.click();
            }
        });
    }



    let currentAnimLevel = null;
    let canvasAnimFrame = null;
    let canvasAnimActive = false;

    function stopCanvasAnimation() {
        canvasAnimActive = false;
        if (canvasAnimFrame) {
            cancelAnimationFrame(canvasAnimFrame);
            canvasAnimFrame = null;
        }
    }

    function startCanvasParticles(canvas, type) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth || 350;
        let height = canvas.height = canvas.offsetHeight || 380;
        
        canvasAnimActive = true;
        const particles = [];
        
        function resize() {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth || 350;
            height = canvas.height = canvas.offsetHeight || 380;
        }
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * height;
            }

            reset() {
                this.x = Math.random() * width;
                if (type === 'gold') {
                    this.y = height + 10;
                    this.size = 1 + Math.random() * 2.5;
                    this.vx = (Math.random() - 0.5) * 0.4;
                    this.vy = -(0.5 + Math.random() * 0.8);
                    this.alpha = 0.2 + Math.random() * 0.6;
                    this.alphaSpeed = 0.003 + Math.random() * 0.005;
                } else {
                    this.x = Math.random() * (width + 100) - 50;
                    this.y = -10;
                    this.size = 4 + Math.random() * 5;
                    this.vx = -0.4 - Math.random() * 0.8;
                    this.vy = 0.6 + Math.random() * 0.9;
                    this.angle = Math.random() * Math.PI * 2;
                    this.spinSpeed = (Math.random() - 0.5) * 0.02;
                    this.alpha = 0.5 + Math.random() * 0.4;
                }
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (type === 'gold') {
                    this.alpha -= this.alphaSpeed;
                    if (this.alpha <= 0 || this.y < 0) this.reset();
                } else {
                    this.angle += this.spinSpeed;
                    if (this.y > height || this.x < -20 || this.x > width + 20) {
                        this.reset();
                    }
                }
            }

            draw() {
                ctx.save();
                if (type === 'gold') {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(226, 184, 87, ${this.alpha})`;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = 'rgba(226, 184, 87, 0.6)';
                    ctx.fill();
                } else {
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 182, 193, ${this.alpha})`;
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        const count = type === 'gold' ? 30 : 20;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function loop() {
            if (!canvasAnimActive) return;
            if (!container.classList.contains('active')) {
                stopCanvasAnimation();
                return;
            }
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            canvasAnimFrame = requestAnimationFrame(loop);
        }

        loop();
    }

    function updateHeroAnimations(level, daysSinceLastSession) {
        if (daysSinceLastSession >= 3) {
            stopCanvasAnimation();
            const animCont = container.querySelector('#hero-anim-container');
            if (animCont) animCont.innerHTML = '';
            currentAnimLevel = null;
            return;
        }

        let animLevel = 1;
        if (level >= 15) animLevel = 15;
        else if (level >= 10) animLevel = 10;
        else if (level >= 7) animLevel = 7;
        else if (level >= 5) animLevel = 5;
        else if (level >= 3) animLevel = 3;

        if (currentAnimLevel === animLevel) {
            // Restart canvas loop if it was stopped by navigating away
            if ((animLevel === 10 || animLevel === 15) && !canvasAnimActive) {
                const canvas = container.querySelector('.hero-canvas-el');
                if (canvas) {
                    startCanvasParticles(canvas, animLevel === 10 ? 'gold' : 'sakura');
                }
            }
            return;
        }
        currentAnimLevel = animLevel;

        stopCanvasAnimation();
        const animCont = container.querySelector('#hero-anim-container');
        if (!animCont) return;
        animCont.innerHTML = '';

        if (animLevel === 1) {
            const glow = document.createElement('div');
            glow.className = 'hero-breath-glow';
            animCont.appendChild(glow);
        } 
        else if (animLevel === 3) {
            for (let i = 0; i < 3; i++) {
                const wisp = document.createElement('div');
                wisp.className = 'steam-wisp';
                wisp.style.left = `${58 + (i - 1) * 2.5}%`;
                wisp.style.setProperty('--wisp-delay', `${i * 1.3}s`);
                animCont.appendChild(wisp);
            }
        } 
        else if (animLevel === 5) {
            const bfly = document.createElement('div');
            bfly.className = 'butterfly';
            bfly.innerHTML = `
                <svg viewBox="0 0 20 20" style="width:100%; height:100%;">
                    <path d="M10,10 C6,4 4,6 4,10 C4,14 6,12 10,10 Z" fill="#22d3ee" />
                    <path d="M10,10 C14,4 16,6 16,10 C16,14 14,12 10,10 Z" fill="#22d3ee" />
                </svg>
            `;
            animCont.appendChild(bfly);
        } 
        else if (animLevel === 7) {
            const aura = document.createElement('div');
            aura.className = 'gold-aura';
            animCont.appendChild(aura);
        } 
        else if (animLevel === 10) {
            const canvas = document.createElement('canvas');
            canvas.className = 'hero-canvas-el';
            animCont.appendChild(canvas);
            startCanvasParticles(canvas, 'gold');
        } 
        else if (animLevel === 15) {
            const canvas = document.createElement('canvas');
            canvas.className = 'hero-canvas-el';
            animCont.appendChild(canvas);
            startCanvasParticles(canvas, 'sakura');
        }
    }

    container.updateData = () => {
        const user = DB.getUser();
        let dailyGoal = 20;
        if (user) {
            container.querySelector('#home-name').textContent = user.name?.split(' ')[0] || 'Alex';
            if (user.dailyCommitment) {
                dailyGoal = user.dailyCommitment;
            }
            if (user.avatar) {
                const profileAvatar = container.querySelector('#home-profile-avatar-img');
                if (profileAvatar) profileAvatar.src = user.avatar;
            }
        }
        container.querySelector('#home-goal-minutes').textContent = dailyGoal;

        const stats = DB.getStats();
        const levelNames = [
            "Novice", "Initiate", "Adept", "Seeker", "Wanderer",
            "Practitioner", "Disciple", "Guide", "Sage", "Master"
        ];
        const lName = levelNames[Math.min(stats.level - 1, levelNames.length - 1)] || "Novice";

        container.querySelector('#home-streak').textContent = stats.streak;
        container.querySelector('#home-level').textContent = `${stats.level} - ${lName}`;
        container.querySelector('#home-xp').textContent = stats.xp;
        container.querySelector('#home-today-minutes').textContent = stats.todayMinutes;
        container.querySelector('#home-total-sessions').textContent = stats.totalSessions;
        container.querySelector('#home-total-mins').textContent = stats.totalMinutes;

        const todayPct = Math.min(100, (stats.todayMinutes / dailyGoal) * 100);
        container.querySelector('#home-today-bar').style.width = todayPct + '%';

        // Daily Quest card state
        const dq = DB.getDailyQuest ? DB.getDailyQuest() : null;
        const dqCardEl = container.querySelector('#home-dq-card');
        if (dq && dqCardEl) {
            const dqText = container.querySelector('#home-dq-text');
            const dqBadge = container.querySelector('#home-dq-badge');
            const dqIcon = container.querySelector('#home-dq-icon');

            if (dq.completed && !dq.claimed) {
                dqText.textContent = `✓ Completed: ${dq.label}`;
                dqText.style.fontWeight = '600';
                dqText.style.color = '#1b5e20';
                dqBadge.textContent = '🎁 Claim +25 XP';
                dqBadge.style.background = '#277038';
                dqBadge.style.color = '#ffffff';
                dqBadge.style.fontWeight = '700';
                dqBadge.style.boxShadow = '0 3px 10px rgba(39, 112, 56, 0.35)';
                if (dqIcon) {
                    dqIcon.style.background = '#277038';
                    dqIcon.style.color = '#ffffff';
                    dqIcon.style.boxShadow = '0 2px 6px rgba(39, 112, 56, 0.25)';
                    dqIcon.innerHTML = '<span class="material-symbols-rounded">card_giftcard</span>';
                }
                dqCardEl.style.background = 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f3 100%)';
                dqCardEl.style.border = '1.5px solid #277038';
                dqCardEl.style.boxShadow = '0 3px 12px rgba(39, 112, 56, 0.15)';
                dqCardEl.style.cursor = 'pointer';
                
                dqCardEl.onclick = () => {
                    if (typeof DB.claimDailyQuest === 'function') {
                        DB.claimDailyQuest(dq.type);
                    }
                    if (typeof container.updateData === 'function') {
                        container.updateData();
                    }
                };
            } else if (dq.claimed) {
                dqText.textContent = `✓ Completed: ${dq.label}`;
                dqText.style.fontWeight = '500';
                dqText.style.color = '#386641';
                dqBadge.textContent = '✓ Claimed (+25 XP)';
                dqBadge.style.background = '#d8e8dc';
                dqBadge.style.color = '#277038';
                dqBadge.style.fontWeight = '600';
                dqBadge.style.boxShadow = 'none';
                if (dqIcon) {
                    dqIcon.style.background = '#277038';
                    dqIcon.style.color = '#ffffff';
                    dqIcon.style.boxShadow = 'none';
                    dqIcon.innerHTML = '<span class="material-symbols-rounded">check_circle</span>';
                }
                dqCardEl.style.background = '#f2f8f3';
                dqCardEl.style.border = '1px solid #c2dec9';
                dqCardEl.style.boxShadow = 'none';
                dqCardEl.style.cursor = 'default';
                dqCardEl.onclick = null;
            } else {
                dqText.textContent = `${dq.emoji || '🎯'} ${dq.label}`;
                dqText.style.fontWeight = '400';
                dqText.style.color = 'var(--color-text-secondary)';
                dqBadge.textContent = `+${dq.xp || 25} XP`;
                dqBadge.style.background = 'var(--color-accent-light)';
                dqBadge.style.color = 'var(--color-accent-dark)';
                dqBadge.style.boxShadow = 'none';
                if (dqIcon) {
                    dqIcon.style.background = '#e8f4ec';
                    dqIcon.style.color = '#2c8242';
                    dqIcon.style.boxShadow = 'none';
                    dqIcon.innerHTML = '<span class="material-symbols-rounded">task_alt</span>';
                }
                dqCardEl.style.background = 'var(--color-bg-card)';
                dqCardEl.style.border = 'none';
                dqCardEl.style.boxShadow = 'none';
                dqCardEl.style.cursor = 'pointer';
                
                dqCardEl.onclick = () => {
                    const targetTab = (dq && dq.target) ? dq.target : (dq && dq.type === 'wisdom' ? 'wisdom' : dq && dq.type === 'reflect' ? 'reflect' : dq && dq.type === 'journey' ? 'journey' : 'breathe');
                    const nav = document.querySelector('.bottom-nav [data-target="' + targetTab + '"]');
                    if (nav) nav.click();
                };
            }
        }

        // XP bar using scaled level thresholds
        const xpProgress = xpInCurrentLevel(stats.xp);
        const xpPct = Math.min(100, Math.max(0, (xpProgress.earned / xpProgress.needed) * 100));
        container.querySelector('#home-xp-bar').style.width = `${xpPct}%`;
        container.querySelector('#home-xp').textContent = stats.xp;


        // Dynamic Hero Image based on Level
        let bgImg = 'Siddha_lvl1.png';
        if (stats.level >= 15) bgImg = 'Siddha_lvl15.png';
        else if (stats.level >= 10) bgImg = 'Siddha_lvl10.png';
        else if (stats.level >= 7) bgImg = 'Siddha_lvl7.png';
        else if (stats.level >= 5) bgImg = 'Siddha_lvl5.png';
        else if (stats.level >= 3) bgImg = 'Siddha_lvl3.png';
        
        // Losing streak overrides
        if (stats.daysSinceLastSession >= 7) {
            bgImg = 'Siddha_Nomed_7days.png';
        } else if (stats.daysSinceLastSession >= 3) {
            bgImg = 'Siddha_nomed_3day.png';
        }
        
        container.style.backgroundImage = `url('./src/assets/${bgImg}')`;
        updateHeroAnimations(stats.level, stats.daysSinceLastSession);

        // Siddha Speech Bubble Dialogue (Pops in after 1.5s, stays visible)
        const bubble = container.querySelector('#companion-speech-bubble');
        const bubbleText = container.querySelector('#companion-bubble-text');
        
        // Clean up any existing timers attached to the window
        if (window.siddhaBubbleTimer) clearTimeout(window.siddhaBubbleTimer);
        if (window.siddhaBubbleHideTimer) clearTimeout(window.siddhaBubbleHideTimer);

        if (bubble && bubbleText) {
            const showBubble = () => {
                if (!document.contains(bubble)) return;

                let newQuote;
                const current = bubbleText.textContent;
                do {
                    newQuote = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
                } while (newQuote === current && DIALOGUES.length > 1);
                
                bubbleText.textContent = newQuote;
                bubble.classList.add('visible');

                // Display for exactly 7 seconds then disappear
                if (window.siddhaBubbleHideTimer) clearTimeout(window.siddhaBubbleHideTimer);
                window.siddhaBubbleHideTimer = setTimeout(() => {
                    if (document.contains(bubble)) {
                        bubble.classList.remove('visible');
                        
                        // Schedule next appearance
                        const nextWait = 14000 + Math.random() * 10000;
                        window.siddhaBubbleTimer = setTimeout(showBubble, nextWait);
                    }
                }, 7000);
            };

            // Entrance after 5 seconds (with text ready)
            window.siddhaBubbleTimer = setTimeout(showBubble, 5000);
            
            bubble.onclick = (e) => {
                e.stopPropagation();
                bubble.style.transform = 'translateX(-50%) scale(0.92)';
                setTimeout(() => {
                    bubble.style.transform = '';
                    bubble.classList.remove('visible');
                    
                    if (window.siddhaBubbleTimer) clearTimeout(window.siddhaBubbleTimer);
                    if (window.siddhaBubbleHideTimer) clearTimeout(window.siddhaBubbleHideTimer);
                    
                    const nextWait = 10000 + Math.random() * 10000;
                    window.siddhaBubbleTimer = setTimeout(showBubble, nextWait);
                }, 200);
            };
        }

        container.querySelectorAll('[data-target]').forEach(el => {
            el.onclick = (e) => {
                e.stopPropagation();
                const target = el.getAttribute('data-target');
                document.querySelector('.bottom-nav [data-target="' + target + '"]')?.click();
            };
        });

        container.querySelectorAll('[data-link]').forEach(el => {
            el.onclick = (e) => {
                e.stopPropagation();
                const link = el.getAttribute('data-link');
                if (link === 'wisdom') {
                    window.dispatchEvent(new CustomEvent('siddha-navigate', { detail: { target: 'wisdom' } }));
                } else {
                    document.querySelector('.bottom-nav [data-target="' + link + '"]')?.click();
                }
            };
        });
    };

    return container;
}
