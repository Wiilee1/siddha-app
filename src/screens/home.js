import { DB } from '../services/db.js';
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
        <div class="home-hero-area">
            <div class="mascot-home-avatar" id="mascot-home-avatar" title="Pet Siddha">
                <svg width="150" height="150" viewBox="0 0 64 64" fill="none" style="filter: drop-shadow(0 8px 16px rgba(0,0,0,0.12));">
                    <!-- Outer Aura Glow -->
                    <circle cx="32" cy="28" r="24" fill="#8b5cf6" fill-opacity="0.05" class="siddha-aura-circle" id="siddha-aura" style="transition: fill-opacity 0.3s;"/>
                    <!-- Body -->
                    <path d="M32 8C20.9543 8 12 16.9543 12 28C12 33.8268 14.4828 39.0741 18.4375 42.75C17.5 45 14.5 48.5 10 50C15 50.5 20.5 48.5 22.8125 45.75C25.6641 47.1641 28.7422 48 32 48C43.0457 48 52 39.0457 52 28C52 16.9543 43.0457 8 32 8Z" fill="#8b5cf6" fill-opacity="0.25" stroke="#e2b857" stroke-width="2.5" id="siddha-body" style="transition: fill 0.3s;"/>
                    <!-- Eyes -->
                    <circle cx="24" cy="26" r="3.5" fill="#f8fafc" id="siddha-left-eye"/>
                    <circle cx="40" cy="26" r="3.5" fill="#f8fafc" id="siddha-right-eye"/>
                    <!-- Mouth -->
                    <path d="M28 33C28 33 30 35 32 35C34 35 36 33 36 33" stroke="#e2b857" stroke-width="2.5" stroke-linecap="round" id="siddha-mouth"/>
                    <!-- Rosy Cheeks -->
                    <circle cx="19" cy="29" r="2" fill="#ef4444" fill-opacity="0.6" class="siddha-cheek"/>
                    <circle cx="45" cy="29" r="2" fill="#ef4444" fill-opacity="0.6" class="siddha-cheek"/>
                    <!-- Forehead gem -->
                    <circle cx="32" cy="18" r="1.5" fill="#22d3ee" class="siddha-gem"/>
                </svg>
            </div>
            <div id="mascot-home-particles" style="position:absolute; inset:0; pointer-events:none; overflow:hidden;"></div>
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

            <!-- Companion Sanctuary Card -->
            <div class="home-stat-card companion-card" style="width: 100%; display: flex; flex-direction: column; gap: 10px; margin-top: 10px; cursor: default;">
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                    <p class="home-stat-title" style="margin: 0; font-size:15px; font-weight:700; color:#1b2e26;">Siddha Sanctuary</p>
                    <span class="companion-status-tag" id="companion-status-val" style="font-size:11px; font-weight:600; padding:2px 8px; border-radius:12px; background:#e6f4ea; color:#137333;">Sync High</span>
                </div>
                
                <p id="companion-bubble-text" style="font-size: 13px; color:#555; line-height: 1.4; margin: 4px 0; font-style: italic;">
                    "Greetings traveler. Breathe with me..."
                </p>

                <div style="display: flex; gap: 8px; width: 100%; margin: 4px 0;">
                    <!-- Nourish Bar -->
                    <div class="comp-gauge" style="flex:1;">
                        <div style="display:flex; justify-content:space-between; font-size:10px; color:#666; margin-bottom:2px;">
                            <span>Nourish</span>
                            <span id="gauge-nourish-val">45%</span>
                        </div>
                        <div class="comp-bar-track" style="height:6px; background:#eee; border-radius:3px; overflow:hidden;">
                            <div class="comp-bar-fill" id="gauge-nourish-fill" style="height:100%; background:#e2b857; border-radius:3px; width:45%;"></div>
                        </div>
                    </div>
                    <!-- Aura Bar -->
                    <div class="comp-gauge" style="flex:1;">
                        <div style="display:flex; justify-content:space-between; font-size:10px; color:#666; margin-bottom:2px;">
                            <span>Aura</span>
                            <span id="gauge-aura-val">55%</span>
                        </div>
                        <div class="comp-bar-track" style="height:6px; background:#eee; border-radius:3px; overflow:hidden;">
                            <div class="comp-bar-fill" id="gauge-aura-fill" style="height:100%; background:#8b5cf6; border-radius:3px; width:55%;"></div>
                        </div>
                    </div>
                    <!-- Sync Bar -->
                    <div class="comp-gauge" style="flex:1;">
                        <div style="display:flex; justify-content:space-between; font-size:10px; color:#666; margin-bottom:2px;">
                            <span>Sync</span>
                            <span id="gauge-sync-val">10%</span>
                        </div>
                        <div class="comp-bar-track" style="height:6px; background:#eee; border-radius:3px; overflow:hidden;">
                            <div class="comp-bar-fill" id="gauge-sync-fill" style="height:100%; background:#22d3ee; border-radius:3px; width:10%;"></div>
                        </div>
                    </div>
                </div>

                <!-- Feed Offerings -->
                <div style="display:flex; flex-direction:column; width:100%; gap:6px; border-top:1px solid #f0f0f0; padding-top:10px; margin-top:4px;">
                    <div style="font-size:11px; color:#777; font-weight:600;">Feed Offerings:</div>
                    <div style="display:flex; gap:8px;">
                        <div class="inventory-slot" data-item="acorns" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:6px; background:#fafafa; border:1px solid #e0e0e0; border-radius:10px; cursor:pointer; user-select:none; transition: all 0.2s;">
                            <span style="font-size:18px;">🌰</span>
                            <div style="display:flex; flex-direction:column; align-items:flex-start;">
                                <span style="font-size:10px; font-weight:600; color:#333;">Acorn</span>
                                <span id="qty-acorns" style="font-size:9px; color:#777;">1 available</span>
                            </div>
                        </div>
                        <div class="inventory-slot" data-item="blossoms" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:6px; background:#fafafa; border:1px solid #e0e0e0; border-radius:10px; cursor:pointer; user-select:none; transition: all 0.2s;">
                            <span style="font-size:18px;">🌸</span>
                            <div style="display:flex; flex-direction:column; align-items:flex-start;">
                                <span style="font-size:10px; font-weight:600; color:#333;">Blossom</span>
                                <span id="qty-blossoms" style="font-size:9px; color:#777;">1 available</span>
                            </div>
                        </div>
                        <div class="inventory-slot" data-item="nectar" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:6px; background:#fafafa; border:1px solid #e0e0e0; border-radius:10px; cursor:pointer; user-select:none; transition: all 0.2s;">
                            <span style="font-size:18px;">🍯</span>
                            <div style="display:flex; flex-direction:column; align-items:flex-start;">
                                <span style="font-size:10px; font-weight:600; color:#333;">Nectar</span>
                                <span id="qty-nectar" style="font-size:9px; color:#777;">0 available</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mascot Action buttons -->
                <div style="display:flex; gap:8px; width:100%; border-top:1px solid #f0f0f0; padding-top:10px; margin-top:4px;">
                    <button id="pet-chime-btn" style="flex:1; padding:8px 12px; font-size:12px; border:1px solid #e2b857; border-radius:10px; background:#fffbf0; color:#b58a1c; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; font-weight:600; transition:all 0.2s;">
                        🔔 Play Chime
                    </button>
                    <button id="pet-stroke-btn" style="flex:1; padding:8px 12px; font-size:12px; border:1px solid #f48fb1; border-radius:10px; background:#fff0f5; color:#c2185b; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; font-weight:600; transition:all 0.2s;">
                        💗 Pet Siddha
                    </button>
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

        /* Hero Area */
        .home-hero-area {
            width: 100%;
            height: 380px;
            position: relative;
            flex-shrink: 0;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
        }

        .mascot-home-avatar {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            animation: floatMascot 4s ease-in-out infinite;
            cursor: pointer;
        }
        @keyframes floatMascot {
            0%, 100% { transform: translate(-50%, -54%); }
            50%      { transform: translate(-50%, -46%); }
        }

        .inventory-slot:hover {
            border-color: #999 !important;
            background: #f0f0f0 !important;
        }

        @keyframes leaf-burst {
            0% { transform: translate(0, 0) rotate(var(--r1)) scale(0.5); opacity: 1; }
            100% { transform: translate(var(--dx), var(--dy)) rotate(var(--r2)) scale(1.2); opacity: 0; }
        }

        .leaf-particle {
            position: absolute;
            font-size: 24px;
            pointer-events: none;
            color: rgba(83, 163, 98, 0.85); /* Vibrant leaf green */
            animation: leaf-burst 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            z-index: 20;
            text-shadow: 0 2px 6px rgba(0,0,0,0.15);
            font-variation-settings: 'FILL' 1;
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

    // Siddha interactive animation
    const heroArea = container.querySelector('.home-hero-area');
    heroArea.addEventListener('click', (e) => {
        const rect = heroArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spawn 4-6 leaves
        const count = 4 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            const leaf = document.createElement('span');
            leaf.className = 'material-symbols-rounded leaf-particle';
            leaf.textContent = 'eco'; // Leaf icon
            
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;
            leaf.style.left = `${x + offsetX}px`;
            leaf.style.top = `${y + offsetY}px`;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 80;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance + 60; // Bias downward like falling leaves
            
            leaf.style.setProperty('--dx', `${destX}px`);
            leaf.style.setProperty('--dy', `${destY}px`);
            leaf.style.setProperty('--r1', `${Math.random() * 90 - 45}deg`);
            leaf.style.setProperty('--r2', `${Math.random() * 360}deg`);
            
            heroArea.appendChild(leaf);
            setTimeout(() => leaf.remove(), 1200);
        }
    });

    // Pet / Companion Sanctuary handlers
    const handlePet = (e) => {
        if (e) {
            e.stopPropagation();
        }
        DB.petCompanion();
        triggerPetHeartParticles();
        container.updateData();
    };

    container.querySelector('#pet-stroke-btn').addEventListener('click', handlePet);
    container.querySelector('#mascot-home-avatar').addEventListener('click', handlePet);

    container.querySelector('#pet-chime-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        DB.ringChime();
        Synth.playSingleBell();
        triggerChimeParticles();
        container.updateData();
    });

    container.querySelectorAll('.inventory-slot').forEach(slot => {
        slot.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = slot.dataset.item;
            const updated = DB.feedCompanion(item);
            if (updated) {
                triggerFeedParticles(item);
                container.updateData();
            }
        });
    });

    function triggerPetHeartParticles() {
        const partContainer = container.querySelector('#mascot-home-particles');
        const mascot = container.querySelector('#mascot-home-avatar');
        const rect = mascot.getBoundingClientRect();
        const parentRect = partContainer.getBoundingClientRect();
        
        const x = rect.left + rect.width / 2 - parentRect.left;
        const y = rect.top + rect.height / 2 - parentRect.top;

        for (let i = 0; i < 6; i++) {
            const heart = document.createElement('span');
            heart.style.position = 'absolute';
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.fontSize = '18px';
            heart.innerHTML = '❤️';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '30';
            
            const dx = (Math.random() - 0.5) * 80;
            const dy = -(Math.random() * 80 + 30);
            
            heart.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            partContainer.appendChild(heart);
            
            setTimeout(() => {
                heart.style.transform = `translate(${dx}px, ${dy}px) scale(1.5)`;
                heart.style.opacity = '0';
            }, 10);
            
            setTimeout(() => heart.remove(), 800);
        }
    }

    function triggerChimeParticles() {
        const partContainer = container.querySelector('#mascot-home-particles');
        const mascot = container.querySelector('#mascot-home-avatar');
        const rect = mascot.getBoundingClientRect();
        const parentRect = partContainer.getBoundingClientRect();
        
        const x = rect.left + rect.width / 2 - parentRect.left;
        const y = rect.top + rect.height / 2 - parentRect.top;

        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('span');
            spark.style.position = 'absolute';
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            spark.style.fontSize = '16px';
            spark.innerHTML = '✨';
            spark.style.pointerEvents = 'none';
            spark.style.zIndex = '30';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            spark.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
            partContainer.appendChild(spark);
            
            setTimeout(() => {
                spark.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
                spark.style.opacity = '0';
            }, 10);
            
            setTimeout(() => spark.remove(), 1000);
        }
    }

    function triggerFeedParticles(item) {
        const partContainer = container.querySelector('#mascot-home-particles');
        const mascot = container.querySelector('#mascot-home-avatar');
        const rect = mascot.getBoundingClientRect();
        const parentRect = partContainer.getBoundingClientRect();
        
        const x = rect.left + rect.width / 2 - parentRect.left;
        const y = rect.top + rect.height / 2 - parentRect.top;
        
        const icons = { acorns: '🌰', blossoms: '🌸', nectar: '🍯' };
        const icon = icons[item] || '🍬';

        for (let i = 0; i < 5; i++) {
            const food = document.createElement('span');
            food.style.position = 'absolute';
            food.style.left = `${x}px`;
            food.style.top = `${y}px`;
            food.style.fontSize = '18px';
            food.innerHTML = icon;
            food.style.pointerEvents = 'none';
            food.style.zIndex = '30';
            
            const dx = (Math.random() - 0.5) * 60;
            const dy = -(Math.random() * 40 + 20);
            
            food.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            partContainer.appendChild(food);
            
            setTimeout(() => {
                food.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
                food.style.opacity = '0';
            }, 10);
            
            setTimeout(() => food.remove(), 800);
        }
    }

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

        const levelBase = (stats.level - 1) * 500;
        const xpPct = Math.min(100, Math.max(0, ((stats.xp - levelBase) / 500) * 100));
        container.querySelector('#home-xp-bar').style.width = `${xpPct}%`;

        // Update Companion status
        const comp = DB.getCompanionState();
        if (comp) {
            container.querySelector('#gauge-nourish-val').textContent = `${comp.nourish}%`;
            container.querySelector('#gauge-nourish-fill').style.width = `${comp.nourish}%`;
            container.querySelector('#gauge-aura-val').textContent = `${comp.aura}%`;
            container.querySelector('#gauge-aura-fill').style.width = `${comp.aura}%`;
            container.querySelector('#gauge-sync-val').textContent = `${comp.sync}%`;
            container.querySelector('#gauge-sync-fill').style.width = `${comp.sync}%`;

            container.querySelector('#qty-acorns').textContent = `${comp.inventory.acorns || 0} available`;
            container.querySelector('#qty-blossoms').textContent = `${comp.inventory.blossoms || 0} available`;
            container.querySelector('#qty-nectar').textContent = `${comp.inventory.nectar || 0} available`;

            const slots = container.querySelectorAll('.inventory-slot');
            slots.forEach(slot => {
                const item = slot.dataset.item;
                const qty = comp.inventory[item] || 0;
                if (qty === 0) {
                    slot.style.opacity = '0.5';
                    slot.style.cursor = 'not-allowed';
                } else {
                    slot.style.opacity = '1';
                    slot.style.cursor = 'pointer';
                }
            });

            let quote = `"Greetings traveler. Let us quiet the busy world and breathe together."`;
            let statusText = "Synchronized";
            let statusColor = "#137333";
            let statusBg = "#e6f4ea";
            
            if (comp.nourish < 30) {
                quote = `"I am feeling a bit tired, traveler... A small acorn or blossom would nourish me."`;
                statusText = "Hungry";
                statusColor = "#c5221f";
                statusBg = "#fce8e6";
            } else if (comp.aura < 30) {
                quote = `"My aura is feeling slightly dim. Perhaps we could pet or ring a bell?"`;
                statusText = "Dim Aura";
                statusColor = "#b06000";
                statusBg = "#fef7e0";
            } else if (comp.sync > 75 && comp.aura > 75) {
                quote = `"Our minds are in harmony. I feel a deep presence within us!"`;
                statusText = "Radiant Sync";
                statusColor = "#129eaf";
                statusBg = "#e4f7fb";
            } else if (comp.sync < 20) {
                quote = `"Let's sit for a meditation quest soon. I want to sync our spirits."`;
                statusText = "Desynced";
                statusColor = "#5f6368";
                statusBg = "#f1f3f4";
            }

            container.querySelector('#companion-bubble-text').textContent = quote;
            const statusTag = container.querySelector('#companion-status-val');
            statusTag.textContent = statusText;
            statusTag.style.color = statusColor;
            statusTag.style.backgroundColor = statusBg;

            const leftEye = container.querySelector('#siddha-left-eye');
            const rightEye = container.querySelector('#siddha-right-eye');
            const body = container.querySelector('#siddha-body');
            const aura = container.querySelector('#siddha-aura');

            if (comp.nourish < 30) {
                leftEye.setAttribute('r', '1.5');
                rightEye.setAttribute('r', '1.5');
            } else {
                leftEye.setAttribute('r', '3.5');
                rightEye.setAttribute('r', '3.5');
            }

            aura.setAttribute('fill-opacity', (comp.aura / 100) * 0.25);
            body.setAttribute('fill-opacity', 0.15 + (comp.sync / 100) * 0.35);
        }

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
        
        // Attach click listeners to home screen elements to navigate to other tabs
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
