import { DB } from '../services/db.js';

export function renderHome() {
    const container = document.createElement('div');
    container.className = 'screen home-screen';

    container.innerHTML = `
        <!-- Header -->
        <div class="home-header">
            <div style="display:flex; align-items:center; gap:8px;">
                <img src="./src/assets/logo.png" class="home-logo-avatar" alt="Siddha">
                <span style="font-weight:700; font-size:18px; font-family:var(--font-heading); color:#2c3e38;">Siddha</span>
                <button id="dev-add-xp" style="font-size:10px; padding:2px 6px; background:var(--color-bg-secondary); border-radius:4px; border:none; cursor:pointer; color:var(--color-text-muted);">+500 XP</button>
            </div>
            <button id="home-profile-btn" class="home-icon-btn" aria-label="Profile">
                <span class="material-symbols-rounded" style="color:#7a8a81; font-weight:300;">account_circle</span>
            </button>
        </div>

        <!-- Greeting -->
        <div class="home-greeting">
            <p class="home-greeting-sub">Good day,</p>
            <h1 class="home-greeting-name" id="home-name">Alex</h1>
            <div class="home-greeting-divider"><span class="material-symbols-rounded">eco</span></div>
        </div>

        <!-- Hero Siddha Area -->
        <div class="home-hero" id="home-hero-btn">
            <!-- Glowing outer ring -->
            <div class="home-ring-outer">
                <!-- Inner circle for Siddha -->
                <div class="home-ring-inner">
                    <img src="./src/assets/logo.png" class="home-siddha-img" alt="Siddha" id="home-siddha-img">
                </div>
                <!-- Text integrated into the ring -->
                <div class="home-hero-text">
                    <span class="home-hero-label">Meditate</span>
                    <span class="home-hero-sub">Tap to sit</span>
                </div>
            </div>
        </div>

        <!-- Stats -->
        <div class="home-stats">
            <!-- Daily goal -->
            <div class="home-stat-card-white" data-link="profile">
                <div style="flex:1;">
                    <p class="home-stat-label">Today's Goal</p>
                    <div style="display:flex; align-items:baseline; gap:4px; margin-top:4px;">
                        <span class="home-stat-big" id="home-today-minutes">0</span>
                        <span class="home-stat-label" style="font-size: 14px;">/ 20 min</span>
                    </div>
                    <div class="home-bar-track">
                        <div class="home-bar-fill" id="home-today-bar"></div>
                    </div>
                </div>
                <div class="home-icon-circle plant"><span class="material-symbols-rounded">potted_plant</span></div>
            </div>

            <!-- Streak + Level row -->
            <div class="home-stat-row">
                <div class="home-stat-card-white" data-link="reflect">
                    <div class="home-icon-circle-small fire"><span class="material-symbols-rounded" style="color:#e68a35;">local_fire_department</span></div>
                    <div>
                        <p class="home-stat-label">Streak</p>
                        <div style="display:flex; align-items:baseline; gap:4px; margin-top:2px;">
                            <span class="home-stat-big" id="home-streak">0</span>
                            <span class="home-stat-label">days</span>
                        </div>
                    </div>
                </div>
                <div class="home-stat-card-white" data-link="profile" style="flex-direction:column; align-items:flex-start; gap:6px;">
                    <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start;">
                        <div>
                            <p class="home-stat-label">Level <span id="home-level">1</span></p>
                            <div style="display:flex; align-items:baseline; gap:3px; margin-top:2px;">
                                <span class="home-stat-big" id="home-xp">0</span>
                                <span class="home-stat-label">XP</span>
                            </div>
                        </div>
                        <div class="home-icon-circle-small mountain"><span class="material-symbols-rounded" style="color:#5e735e;">terrain</span></div>
                    </div>
                    <div class="home-bar-track" style="width:100%;"><div class="home-bar-fill" id="home-xp-bar"></div></div>
                </div>
            </div>

            <!-- Total Info row -->
            <div class="home-stat-row">
                <div class="home-stat-card-white" data-link="profile">
                    <div class="home-icon-circle-small session"><span class="material-symbols-rounded" style="color:#6b8273;">self_improvement</span></div>
                    <div>
                        <p class="home-stat-label">Total Sessions</p>
                        <div style="margin-top:2px;">
                            <span class="home-stat-big" id="home-total-sessions">0</span>
                        </div>
                    </div>
                </div>
                <div class="home-stat-card-white" data-link="profile">
                    <div class="home-icon-circle-small clock"><span class="material-symbols-rounded" style="color:#6b8273;">schedule</span></div>
                    <div>
                        <p class="home-stat-label">Mindful Mins</p>
                        <div style="display:flex; align-items:baseline; gap:3px; margin-top:2px;">
                            <span class="home-stat-big" id="home-total-mins">0</span>
                            <span class="home-stat-label">m</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        /* ---- Home screen layout ---- */
        .home-screen {
            overflow-y: auto;
            overflow-x: hidden;
            padding: 16px 20px 100px;
            background: url('./src/assets/home_bg.jpg') no-repeat center center;
            background-size: cover;
            min-height: 100vh;
        }

        /* Header */
        .home-header {
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 24px;
        }
        .home-logo-avatar {
            width: 28px; height: 28px;
            border-radius: 50%;
            object-fit: cover;
        }
        .home-icon-btn {
            background: none; border: none; cursor: pointer;
            padding: 4px;
            display: flex; align-items: center;
        }
        .home-icon-btn .material-symbols-rounded { font-size: 28px; }

        /* Greeting */
        .home-greeting {
            flex-shrink: 0;
            text-align: center;
            padding: 0 0 20px;
        }
        .home-greeting-sub {
            font-size: 15px;
            color: #63736a;
            margin: 0 0 2px;
            font-weight: 500;
        }
        .home-greeting-name {
            font-size: 32px;
            font-weight: 700;
            margin: 0;
            font-family: var(--font-heading);
            color: #1b2e26;
        }
        .home-greeting-divider {
            display: flex; justify-content: center; align-items: center;
            margin-top: 4px; opacity: 0.4;
        }
        .home-greeting-divider::before, .home-greeting-divider::after {
            content: ''; height: 1px; width: 30px; background: #63736a; margin: 0 8px;
        }
        .home-greeting-divider .material-symbols-rounded {
            font-size: 14px; color: #63736a;
        }

        /* Hero area */
        .home-hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 16px 0 32px;
            position: relative;
            cursor: pointer;
        }
        .home-hero:active {
            transform: scale(0.98);
        }

        .home-ring-outer {
            width: 280px; height: 280px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(228,237,230,0.4) 60%, rgba(228,237,230,0) 100%);
            border: 1px solid rgba(255,255,255,0.6);
            box-shadow: 0 0 40px rgba(230,240,230,0.6), inset 0 0 20px rgba(255,255,255,0.9);
            display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
            position: relative;
            padding-top: 18px;
        }

        .home-ring-inner {
            width: 200px; height: 200px;
            border-radius: 50%;
            background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(224,233,225,0.9) 100%);
            border: 3px solid #d5e0d7;
            box-shadow: 0 10px 20px rgba(0,0,0,0.05), inset 0 -4px 12px rgba(255,255,255,0.8);
            display: flex; justify-content: center; align-items: center;
            overflow: hidden;
            position: relative;
        }

        .home-siddha-img { 
            width: 100%; height: 100%; 
            object-fit: contain; 
            margin-top: 5px;
            transition: transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        
        .home-hero:hover .home-siddha-img {
            animation: siddha-hop 0.55s ease infinite alternate;
        }
        
        @keyframes siddha-hop {
            from { transform: translateY(0) scale(1); }
            to   { transform: translateY(-8px) scale(1.04); }
        }

        .home-hero-text {
            position: absolute;
            bottom: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .home-hero-label {
            font-size: 18px; font-weight: 700;
            color: #1b2e26; font-family: var(--font-heading);
        }
        .home-hero-sub {
            font-size: 12px;
            color: #63736a;
            margin-top: 2px;
        }

        /* Stats strip */
        .home-stats {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .home-stat-row { display: flex; gap: 12px; }
        .home-stat-card-white {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            border: 1px solid rgba(255,255,255,0.8);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            flex: 1;
        }
        .home-stat-card-white:active {
            transform: scale(0.97);
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .home-icon-circle {
            width: 54px; height: 54px; border-radius: 50%;
            background: #eef2ed;
            display: flex; justify-content: center; align-items: center;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .home-icon-circle-small {
            width: 44px; height: 44px; border-radius: 50%;
            background: #f5f0e6; /* warm beige for streak */
            display: flex; justify-content: center; align-items: center;
        }
        .home-icon-circle-small.mountain { background: #eff2eb; } /* sage for level */
        .home-icon-circle-small.session { background: #eff2eb; } 
        .home-icon-circle-small.clock { background: #eff2eb; } 

        .home-stat-label { font-size: 12px; color: #63736a; margin: 0; font-weight: 500;}
        .home-stat-big { font-size: 24px; font-weight: 700; color: #1b2e26; }
        
        .home-bar-track {
            width: 100%; height: 6px;
            background: #e4ede6;
            border-radius: 3px; margin-top: 10px; overflow: hidden;
        }
        .home-bar-fill {
            height: 100%; width: 0%;
            background: #77927d;
            border-radius: 3px;
            transition: width 0.5s;
        }
    `;
    container.appendChild(style);

    // Wire up buttons
    container.querySelector('#home-profile-btn').addEventListener('click', () => {
        document.querySelector('[data-target="profile"]')?.click();
    });
    container.querySelector('#home-hero-btn').addEventListener('click', () => {
        document.querySelector('[data-target="breathe"]')?.click();
    });

    // Dev tools
    container.querySelector('#dev-add-xp').addEventListener('click', () => {
        DB.addXP(500);
        if (typeof container.updateData === 'function') container.updateData();
    });

    // Make stats interactive
    const statCards = container.querySelectorAll('.home-stat-card-white');
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-link');
            if (target) {
                document.querySelector(`[data-target="${target}"]`)?.click();
            }
        });
    });

    container.updateData = () => {
        const user = DB.getUser();
        if (user) {
            container.querySelector('#home-name').textContent = user.name?.split(' ')[0] || 'Alex';
        }

        const stats = DB.getStats();
        
        const levelNames = ["Novice", "Initiate", "Adept", "Seeker", "Wanderer", "Practitioner", "Disciple", "Guide", "Sage", "Master"];
        const lName = levelNames[Math.min(stats.level - 1, levelNames.length - 1)] || "Novice";

        container.querySelector('#home-streak').textContent = stats.streak;
        container.querySelector('#home-level').textContent = `${stats.level} - ${lName}`;
        container.querySelector('#home-xp').textContent = stats.xp;
        container.querySelector('#home-today-minutes').textContent = stats.todayMinutes;
        
        container.querySelector('#home-total-sessions').textContent = stats.totalSessions;
        container.querySelector('#home-total-mins').textContent = stats.totalMinutes;

        const todayPct = Math.min(100, (stats.todayMinutes / 20) * 100);
        container.querySelector('#home-today-bar').style.width = `${todayPct}%`;

        const levelBase = (stats.level - 1) * 500;
        const xpPct = Math.min(100, Math.max(0, ((stats.xp - levelBase) / 500) * 100));
        container.querySelector('#home-xp-bar').style.width = `${xpPct}%`;
    };

    return container;
}
