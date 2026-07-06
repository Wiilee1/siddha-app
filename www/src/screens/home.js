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
                <button id="home-profile-btn" class="home-icon-btn" aria-label="Profile">
                    <span class="material-symbols-rounded" style="color:#7a8a81; font-weight:300;">account_circle</span>
                </button>
            </div>

            <!-- Greeting -->
            <div class="home-greeting">
                <p class="home-greeting-sub">Good day,</p>
                <h1 class="home-greeting-name" id="home-name">Alex</h1>
            </div>
        </div>

        <!-- Hero Area -->
        <div class="home-hero-area"></div>

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

        .home-top-section {
            padding: 16px 20px 0;
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

        .home-greeting {
            text-align: center;
            padding: 0 0 16px;
        }
        .home-greeting-sub {
            font-size: 14px;
            color: #63736a;
            margin: 0 0 2px;
            font-weight: 500;
        }
        .home-greeting-name {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            font-family: var(--font-heading);
            color: #1b2e26;
        }

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
            background: #4a5c50; /* dark grey-green for level */
        }

        .home-icon-badge {
            width: 36px; height: 36px; border-radius: 10px;
            display: flex; justify-content: center; align-items: center;
        }
        .home-icon-badge.plant { background: #f4f3ed; color: #7a8a81; }
        .home-icon-badge .material-symbols-rounded { font-size: 20px; }
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
    const statCards = container.querySelectorAll('.home-stat-card');
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

        // Update Companion status (sanctuary removed — no longer displayed)

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
                document.querySelector('.bottom-nav [data-target="' + link + '"]')?.click();
            };
        });
    };

    return container;
}
