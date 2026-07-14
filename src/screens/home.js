import { DB, xpInCurrentLevel } from '../services/db.js';
import { Synth } from '../services/synth.js';

export function renderHome() {
    const container = document.createElement('div');
    container.className = 'screen home-screen';

    container.innerHTML = `
        <div class="home-top-section">
            <!-- Header -->
            <div class="home-header">
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="./src/assets/logo.png" class="home-logo-avatar" alt="Siddha">
                    <span style="font-weight:700; font-size:18px; font-family:var(--font-heading); color:#2c3e38;">Siddha</span>
                    <button id="dev-add-xp" style="font-size:10px; padding:2px 6px; background:transparent; border:1px solid #dcdcdc; border-radius:4px; cursor:pointer; color:#777;">+500 XP</button>
                </div>
                <!-- Inline greeting at top -->
                <div class="home-header-greeting" style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500; font-family: var(--font-body); display: flex; align-items: center; gap: 4px;">
                    Good day, <strong id="home-name">Alex</strong> 👋
                </div>
                <button id="home-profile-btn" class="home-icon-btn" aria-label="Profile">
                    <span class="material-symbols-rounded" style="color:#7a8a81; font-weight:300;">account_circle</span>
                </button>
            </div>
        </div>

        <!-- Hero Area -->
        <div class="home-hero-area">
            <div id="hero-anim-container" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;"></div>
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
            padding: calc(14px + env(safe-area-inset-top, 0px)) 20px 0;
            background: #f4f3ed;
        }

        .home-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
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
                document.querySelector(`[data-target="${target}"]`)?.click();
            }
        });
    });



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
        container.querySelector('#home-today-bar').style.width = `${todayPct}%`;

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
