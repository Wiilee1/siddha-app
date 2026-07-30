import { DB } from '../services/db.js';

export function renderProfile(onOpenSettings) {
    const container = document.createElement('div');
    container.className = 'screen scrollable profile-screen';
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; margin: 0;">Profile</h1>
            <div style="display: flex; gap: 8px;">
                <button class="icon-btn" style="color: var(--color-text-primary);" id="open-settings-screen-btn" title="Settings" aria-label="Open Settings">
                    <span class="material-symbols-rounded">settings</span>
                </button>
                <button class="icon-btn" style="color: var(--color-text-primary);" id="logout-btn" title="Logout" aria-label="Logout">
                    <span class="material-symbols-rounded">logout</span>
                </button>
            </div>
        </div>

        <div style="text-align: center; margin-bottom: 32px;">
            <div id="profile-avatar-btn" style="position: relative; width: 100px; height: 100px; margin: 0 auto 16px; cursor: pointer;" title="Change Profile Picture">
                <img id="profile-avatar-img" src="./src/assets/avatar_monk.jpg" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid var(--color-accent); box-shadow: 0 4px 14px rgba(0,0,0,0.1); transition: transform 0.2s;" alt="Profile Avatar">
                <div style="position: absolute; bottom: 0; right: 0; background: var(--color-accent-dark); color: #fff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
                    <span class="material-symbols-rounded" style="font-size: 16px;">photo_camera</span>
                </div>
            </div>
            <h2 id="profile-name" style="font-size: 20px; margin-bottom: 4px;">User Name</h2>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 32px;">
            <div class="card" style="flex: 1; text-align: center;">
                <p class="text-sm" style="margin-bottom: 8px;">Level</p>
                <h2 id="profile-level" style="font-size: 24px; color: var(--color-text-primary);">1</h2>
            </div>
            <div class="card" style="flex: 1; text-align: center;">
                <p class="text-sm" style="margin-bottom: 8px;">Total XP</p>
                <h2 id="profile-xp" style="font-size: 24px; color: var(--color-accent-dark);">0</h2>
            </div>
        </div>

        <!-- Tabbed Analytics Card -->
        <div class="rfl-week-card card" id="rfl-analytics-card" style="margin-bottom: 32px;">
            <div class="rfl-week-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <h3 class="rfl-section-title" id="rfl-card-title" style="margin:0;">Analytics</h3>
                    <button id="open-analytics-modal-btn" style="background:var(--color-bg-secondary); border:none; cursor:pointer; color:var(--color-accent-dark); display:flex; align-items:center; gap:3px; font-size:10.5px; font-weight:700; padding:3px 8px; border-radius:10px;" title="Expand Full Analytics Modal">
                        <span>Expand</span>
                        <span class="material-symbols-rounded" style="font-size:14px;">open_in_full</span>
                    </button>
                </div>
                <!-- Tab pills -->
                <div class="rfl-tab-pills" style="display:flex; background:var(--color-bg-secondary); padding:2px; border-radius:12px;">
                    <button class="rfl-tab-btn active" data-tab="week" style="padding:4px 10px; border:none; background:var(--color-bg-card); border-radius:10px; font-size:11px; font-weight:600; cursor:pointer; color:var(--color-text-primary); transition:all 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.05);">Week</button>
                    <button class="rfl-tab-btn" data-tab="heatmap" style="padding:4px 10px; border:none; background:transparent; border-radius:10px; font-size:11px; font-weight:600; cursor:pointer; color:var(--color-text-muted); transition:all 0.2s;">Heatmap</button>
                    <button class="rfl-tab-btn" data-tab="growth" style="padding:4px 10px; border:none; background:transparent; border-radius:10px; font-size:11px; font-weight:600; cursor:pointer; color:var(--color-text-muted); transition:all 0.2s;">Growth</button>
                </div>
            </div>

            <!-- Tab View 1: 7-Day Bar Chart -->
            <div class="rfl-tab-view" id="rfl-view-week">
                <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
                    <div class="rfl-week-stats">
                        <div class="rfl-stat">
                            <span id="rfl-total-mins" class="rfl-stat-val">0</span>
                            <span class="rfl-stat-label">min</span>
                        </div>
                        <div class="rfl-stat-divider"></div>
                        <div class="rfl-stat">
                            <span id="rfl-total-sessions" class="rfl-stat-val">0</span>
                            <span class="rfl-stat-label">sits</span>
                        </div>
                        <div class="rfl-stat-divider"></div>
                        <div class="rfl-stat">
                            <span id="rfl-streak" class="rfl-stat-val">0</span>
                            <span class="rfl-stat-label">streak</span>
                        </div>
                    </div>
                </div>
                <div class="rfl-chart" id="rfl-chart">
                    <!-- 7 bars injected by JS -->
                </div>
            </div>

            <!-- Tab View 2: 365-Day Consistency Heatmap -->
            <div class="rfl-tab-view hidden" id="rfl-view-heatmap">
                <div id="rfl-heatmap-container" style="overflow-x:auto; padding-bottom:6px; -webkit-overflow-scrolling:touch; scrollbar-width:thin; width:100%;">
                    <!-- Rendered by JS -->
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:10px; color:var(--color-text-muted);">
                    <span id="rfl-heatmap-popover" style="font-weight:600; color:var(--color-text-secondary);">Tap any tile to view sit details</span>
                    <div style="display:flex; align-items:center; gap:3px;">
                        <span>Less</span>
                        <span style="width:8px; height:8px; border-radius:2px; background:var(--color-bg-secondary); display:inline-block;"></span>
                        <span style="width:8px; height:8px; border-radius:2px; background:rgba(74, 144, 98, 0.35); display:inline-block;"></span>
                        <span style="width:8px; height:8px; border-radius:2px; background:rgba(74, 144, 98, 0.7); display:inline-block;"></span>
                        <span style="width:8px; height:8px; border-radius:2px; background:var(--color-accent); display:inline-block;"></span>
                        <span>More</span>
                    </div>
                </div>
            </div>

            <!-- Tab View 3: Growth Wave Area Chart -->
            <div class="rfl-tab-view hidden" id="rfl-view-growth">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span id="rfl-growth-summary" style="font-size:11px; font-weight:600; color:var(--color-text-secondary);">Practice Trend</span>
                    <div class="rfl-growth-toggle" style="display:flex; background:var(--color-bg-secondary); padding:2px; border-radius:8px;">
                        <button class="rfl-growth-btn active" data-period="week" style="padding:2px 8px; border:none; background:var(--color-bg-card); border-radius:6px; font-size:9px; font-weight:700; cursor:pointer; color:var(--color-text-primary); box-shadow:0 1px 2px rgba(0,0,0,0.05);">Week</button>
                        <button class="rfl-growth-btn" data-period="month" style="padding:2px 8px; border:none; background:transparent; border-radius:6px; font-size:9px; font-weight:700; cursor:pointer; color:var(--color-text-muted);">Month</button>
                    </div>
                </div>
                <div id="rfl-growth-chart" style="height:95px; width:100%;">
                    <!-- Rendered by JS -->
                </div>
            </div>
        </div>

        <!-- Milestones Grid -->
        <div class="card collapsible-card collapsed" id="milestones-card" style="margin-bottom: 32px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading); display:flex; align-items:center; gap:8px;">
                    <span class="material-symbols-rounded" style="color: var(--color-accent); font-size:20px;">workspace_premium</span>
                    Milestones & Badges
                </h3>
                <span class="material-symbols-rounded collapsible-toggle" style="color: var(--color-text-muted);">expand_more</span>
            </div>
            <div class="ach-grid collapsible-content" id="achievements-grid" style="margin-top: 12px;">
                <!-- Achievements injected by JS -->
            </div>
        </div>

        <!-- Lifetime Statistics Collapsible Card -->
        <div class="card collapsible-card collapsed" id="lifetime-stats-card" style="margin-bottom: 32px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading); display:flex; align-items:center; gap:8px;">
                    <span class="material-symbols-rounded" style="color: var(--color-accent); font-size:20px;">analytics</span>
                    Lifetime Practice Stats
                </h3>
                <span class="material-symbols-rounded collapsible-toggle" style="color: var(--color-text-muted);">expand_more</span>
            </div>
            
            <div class="collapsible-content" style="margin-top: 14px;">
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Total Sessions</span>
                    <span id="stat-sessions" style="font-weight: 600;">0</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Mindful Minutes</span>
                    <span id="stat-minutes" style="font-weight: 600;">0m</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Current Streak</span>
                    <span id="stat-streak" style="font-weight: 600;">0 days</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Longest Streak</span>
                    <span id="stat-longest-streak" style="font-weight: 600;">0 days</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Avg. Sit Duration</span>
                    <span id="stat-avg-duration" style="font-weight: 600;">0m</span>
                </div>
            </div>
        </div>

        <!-- Sit Reminders Card (Collapsible) -->
        <div class="card collapsible-card collapsed" id="sit-reminders-card" style="margin-bottom: 32px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 20px;">schedule</span>
                    Sit Reminders
                </h3>
                <span class="material-symbols-rounded collapsible-toggle" style="color: var(--color-text-muted);">expand_more</span>
            </div>
            
            <div class="collapsible-content" style="margin-top: 14px;">
                <!-- Sit Reminders -->
                <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">📅 Daily Prompts</span>
                        <button id="add-reminder-btn" class="btn" style="padding: 5px 12px; font-size: 11px; background: var(--color-bg-secondary); color: var(--color-text-primary); border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <span class="material-symbols-rounded" style="font-size: 15px; color: var(--color-accent);">add</span> Add Time
                        </button>
                    </div>
                    <div id="reminders-list-container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>

                <!-- Session End Notification Toggle -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-bg-secondary); padding-top: 14px;">
                    <div>
                        <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">🔔 Session End Notification</span>
                        <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Chime & alert when timer completes</p>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox" id="toggle-session-notification" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <!-- Support Siddha Card (Dedicated Card - Placed Above Community) -->
        <div class="card" style="margin-bottom: 24px; padding: 20px; text-align: center;">
            <span class="material-symbols-rounded" style="color: #e2b857; font-size: 32px; margin-bottom: 6px;">favorite</span>
            <h3 style="font-size: 16px; margin: 0 0 6px; font-family: var(--font-heading); color: var(--color-text-primary);">Support Siddha</h3>
            <p class="text-sm" style="color: var(--color-text-muted); font-size: 11.5px; margin-bottom: 14px; line-height: 1.4;">
                Siddha is free and built with love. If it helps you stay mindful, consider supporting our journey.
            </p>
            <button id="profile-donate-btn" class="btn" style="width: 100%; background: var(--color-accent); color: #fff; border: none; font-size: 13px; font-weight: 700; padding: 12px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 3px 10px rgba(0,0,0,0.12);">
                <span class="material-symbols-rounded" style="font-size: 18px;">coffee</span>
                Support the App ☕
            </button>
        </div>

        <!-- Share & Community Card -->
        <div class="card" style="margin-bottom: 24px; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 24px;">share</span>
                <div>
                    <h3 style="font-size: 15px; margin: 0; font-family: var(--font-heading); color: var(--color-text-primary);">Share & Community</h3>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Connect with our mindfulness journey</p>
                </div>
            </div>

            <!-- Share Button -->
            <button id="profile-share-btn" class="btn" style="width: 100%; padding: 12px; font-size: 13px; background: var(--color-accent); color: #ffffff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.12); margin-bottom: 12px;">
                <span class="material-symbols-rounded" style="font-size: 18px;">share</span>
                Share Siddha App 🧘
            </button>

            <!-- Social Links Row -->
            <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                <!-- Instagram Link -->
                <a id="profile-instagram-link" href="https://instagram.com/siddhamind" target="_blank" rel="noopener noreferrer" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 11.5px; font-weight: 700; box-shadow: 0 2px 8px rgba(131, 58, 180, 0.2);">
                    <span class="material-symbols-rounded" style="font-size: 15px;">photo_camera</span>
                    @siddhamind
                </a>

                <!-- Website Link -->
                <a id="profile-website-link" href="https://siddha.app" target="_blank" rel="noopener noreferrer" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; background: var(--color-bg-secondary); color: var(--color-text-primary); text-decoration: none; border-radius: 10px; font-size: 11.5px; font-weight: 700; border: 1px solid rgba(0,0,0,0.08);">
                    <span class="material-symbols-rounded" style="font-size: 15px; color: var(--color-accent);">language</span>
                    siddha.app
                </a>
            </div>

            <!-- Email Feedback & Bug Report Direct Pill -->
            <a id="profile-email-btn" href="mailto:siddhameditation@gmail.com?subject=Siddha%20App%20Feedback%20%26%20Bug%20Report&body=Hi%20Siddha%20Team%2C%0A%0AHere%20is%20my%20feedback%20or%20bug%20report%3A%0A%0A" style="width: 100%; padding: 11px 12px; font-size: 12px; background: var(--color-bg-secondary); color: var(--color-text-primary); border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box;">
                <span class="material-symbols-rounded" style="font-size: 17px; color: var(--color-accent);">rate_review</span>
                Give Feedback or Report a Bug 💬
            </a>
        </div>

        <!-- Developer Controls (Hidden by default, unlocked by 5 taps on App Version below) -->
        <div id="dev-controls-wrapper" class="dev-only" style="margin-top: 24px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
            <div style="display: flex; gap: 8px;">
                <button id="dev-skip-3-btn" class="btn" style="background: transparent; color: #f39c12; border: 1px solid #f39c12; font-size: 12px; padding: 6px 12px;">
                    Skip 3 Days (No Med)
                </button>
                <button id="dev-skip-7-btn" class="btn" style="background: transparent; color: #e74c3c; border: 1px solid #e74c3c; font-size: 12px; padding: 6px 12px;">
                    Skip 7 Days
                </button>
            </div>
            <button id="dev-reset-btn" class="btn" style="background: transparent; color: #ff6b6b; border: 1px solid #ff6b6b; font-size: 12px; padding: 6px 12px; margin-bottom: 4px;">
                Reset Progress (Dev)
            </button>
            <button id="dev-view-feedback-btn" class="btn" style="background: transparent; color: var(--color-accent); border: 1px solid var(--color-accent); font-size: 12px; padding: 6px 12px;">
                View Saved Feedback (Dev)
            </button>
        </div>

        <!-- App Version Secret Trigger (Tap 5 times to toggle Developer Mode) -->
        <p id="app-version-trigger" style="font-size: 11px; color: var(--color-text-muted); text-align: center; margin-top: 20px; margin-bottom: 24px; cursor: pointer; user-select: none;">Siddha v1.6.8</p>

        <!-- Avatar Selection Modal Overlay -->
        <div id="avatar-modal" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(6px); z-index:999; display:none; justify-content:center; align-items:center; padding:20px;">
            <div style="background:var(--color-bg-card); border-radius:24px; padding:24px; max-width:340px; width:100%; text-align:center; box-shadow:0 12px 32px rgba(0,0,0,0.15); animation:fadeIn 0.2s ease;">
                <h3 style="font-size:18px; margin:0 0 6px; font-family:var(--font-heading); color:var(--color-text-primary);">Choose Profile Avatar</h3>
                <p class="text-sm" style="color:var(--color-text-secondary); margin-bottom:18px;">Select a Zen watercolor avatar</p>
                
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:20px;">
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_monk.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_monk.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Monk">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Monk</span>
                    </div>
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_lotus.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_lotus.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Lotus">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Lotus</span>
                    </div>
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_mascot.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_mascot.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Siddha">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Siddha</span>
                    </div>
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_sun_moon.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_sun_moon.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Sun & Moon">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Sun & Moon</span>
                    </div>
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_mountain.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_mountain.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Mountain">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Mountain</span>
                    </div>
                </div>

                <button id="close-avatar-modal" class="btn" style="width:100%; background:var(--color-bg-secondary); color:var(--color-text-primary); border:none; padding:10px; border-radius:12px; font-weight:600; cursor:pointer;">Close</button>
            </div>
        </div>

        <!-- Full Analytics Pop-Up Modal Overlay -->
        <div id="analytics-modal-overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); z-index:9999; justify-content:center; align-items:center; padding:16px;">
            <div style="background:var(--color-bg-card, #ffffff); width:100%; max-width:440px; max-height:85vh; overflow-y:auto; border-radius:24px; padding:20px; box-shadow:0 16px 40px rgba(0,0,0,0.3); position:relative;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--color-bg-secondary); padding-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="material-symbols-rounded" style="color:var(--color-accent); font-size:22px;">analytics</span>
                        <h3 style="margin:0; font-size:16px; font-family:var(--font-heading); color:var(--color-text-primary);">Full Practice Analytics</h3>
                    </div>
                    <button id="close-analytics-modal-btn" style="background:var(--color-bg-secondary); border:none; color:var(--color-text-secondary); width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                        <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                    </button>
                </div>

                <!-- Modal Subtitle -->
                <p style="font-size:11px; color:var(--color-text-secondary); margin:0 0 14px 0; line-height:1.4;">
                    Detailed breakdown of your meditation consistency, weekly progress, and long-term practice growth trends.
                </p>

                <!-- Expanded Analytics Content -->
                <div id="modal-analytics-content" style="display:flex; flex-direction:column; gap:16px;">
                    <!-- 1. Expanded Heatmap Section (52 Weeks - Sideways Scrollable) -->
                    <div style="background:var(--color-bg-secondary); padding:14px; border-radius:16px;">
                        <h4 style="margin:0 0 8px 0; font-size:13px; font-weight:700; color:var(--color-text-primary);">📅 Practice Consistency Heatmap</h4>
                        
                        <div id="modal-heatmap-container" style="overflow-x:auto; padding-bottom:6px; -webkit-overflow-scrolling:touch; scrollbar-width:thin; width:100%;"></div>
                        <p id="modal-heatmap-popover" style="font-size:10.5px; font-weight:700; color:var(--color-accent); margin:8px 0 0 0; text-align:center;">Tap any tile to view sit details</p>
                    </div>

                    <!-- 2. Practice Trend Summary -->
                    <div style="background:var(--color-bg-secondary); padding:14px; border-radius:16px;">
                        <h4 style="margin:0 0 4px 0; font-size:13px; font-weight:700; color:var(--color-text-primary);">📈 Practice Growth Wave</h4>
                        <div id="modal-growth-chart" style="height:100px; width:100%; margin-top:8px;"></div>
                    </div>
                </div>
            </div>
        </div>

        <div style="height: 48px; flex-shrink: 0;"></div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .rfl-tab-view.hidden { display: none !important; }
        .rfl-week-card { padding: 14px 16px; }
        .rfl-week-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .rfl-section-title { font-size: 14px; font-weight: 600; margin: 0; color: var(--color-text-primary); }
        .rfl-week-stats { display: flex; align-items: center; gap: 10px; }
        .rfl-stat { display: flex; align-items: baseline; gap: 2px; }
        .rfl-stat-val { font-size: 16px; font-weight: 700; color: var(--color-text-primary); }
        .rfl-stat-label { font-size: 10px; color: var(--color-text-muted); }
        .rfl-stat-divider { width: 1px; height: 14px; background: var(--color-bg-secondary); }

        .rfl-chart {
            display: flex; justify-content: space-between; align-items: flex-end;
            height: 68px; gap: 4px;
        }
        .rfl-bar-col {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; gap: 4px; height: 100%;
        }
        .rfl-bar-wrap {
            flex: 1; width: 100%; display: flex; align-items: flex-end;
            background: var(--color-bg-secondary); border-radius: 4px;
            overflow: hidden; min-height: 4px;
        }
        .rfl-bar {
            width: 100%; background: var(--color-accent);
            border-radius: 4px; transition: height 0.5s ease;
            min-height: 0;
        }
        .rfl-bar-day { font-size: 9px; color: var(--color-text-muted); font-weight: 600; }

        /* Toggle Switches for Audio Controls */
        .switch-toggle {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .switch-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            inset: 0;
            background-color: #d0d7d2;
            transition: .3s;
            border-radius: 24px;
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .switch-toggle input:checked + .toggle-slider {
            background-color: var(--color-accent);
        }
        .switch-toggle input:checked + .toggle-slider:before {
            transform: translateX(20px);
        }

        .ach-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
        }
        .ach-item {
            background: var(--color-bg-card);
            border-radius: 12px;
            padding: 10px 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid var(--color-bg-secondary);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .ach-emoji {
            font-size: 24px;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: var(--color-bg-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .ach-item.unlocked .ach-emoji {
            background: var(--color-accent-light);
        }
        .ach-details {
            flex: 1;
            min-width: 0;
        }
        .ach-title {
            font-size: 12px;
            font-weight: 700;
            color: var(--color-text-primary);
            margin: 0 0 2px;
            font-family: var(--font-heading);
        }
        .ach-desc {
            font-size: 9.5px;
            color: var(--color-text-secondary);
            margin: 0 0 6px;
            line-height: 1.35;
        }
        .ach-progress-text {
            font-size: 8.5px;
            font-weight: 700;
            color: var(--color-text-muted);
            text-align: right;
        }
        .ach-reward-tag {
            font-size: 8.5px;
            font-weight: 700;
            color: var(--color-accent-dark);
            background: var(--color-accent-light);
            padding: 1px 5px;
            border-radius: 6px;
            display: inline-block;
        }
        .ach-item.unlocked .ach-reward-tag {
            background: #e2ede4;
            color: #277038;
        }

        /* Collapsible Cards */
        .collapsible-card .collapsible-content {
            transition: max-height 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease, margin-top 0.25s ease;
            overflow: hidden;
            max-height: 3000px;
            opacity: 1;
        }
        .collapsible-card.collapsed .collapsible-content {
            max-height: 0 !important;
            opacity: 0 !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            pointer-events: none;
        }
        .collapsible-card .collapsible-toggle {
            transition: transform 0.3s ease;
            transform: rotate(0deg);
        }
        .collapsible-card.collapsed .collapsible-toggle {
            transform: rotate(-90deg);
        }
    `;
    container.appendChild(style);

    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIdx = (new Date().getDay() + 6) % 7; // 0=Mon, 6=Sun
    let activeAnalyticsTab = 'week';
    let activeGrowthPeriod = 'week';

    // -------------------------------------------------------------
    // Dynamic View Renderers
    // -------------------------------------------------------------
    const renderWeekBarChart = (stats) => {
        const chart = container.querySelector('#rfl-chart');
        if (!chart) return;
        chart.innerHTML = '';
        const weekData = stats.weekData || [0, 0, 0, 0, 0, 0, 0];
        const maxVal = Math.max(...weekData, 1);
        weekData.forEach((mins, i) => {
            const pct = (mins / maxVal) * 100;
            const col = document.createElement('div');
            col.className = 'rfl-bar-col';
            col.innerHTML = `
                <div class="rfl-bar-wrap">
                    <div class="rfl-bar ${i === todayIdx ? 'today' : ''}"
                         style="height: ${pct}%; min-height: ${mins > 0 ? 4 : 0}px;"
                         title="${mins} min">
                    </div>
                </div>
                <span class="rfl-bar-day">${DAYS[i]}</span>
            `;
            chart.appendChild(col);
        });
    };

    const renderHeatmapGrid = (targetContainer = null, targetPopover = null) => {
        const heatmapContainer = targetContainer || container.querySelector('#rfl-heatmap-container');
        if (!heatmapContainer) return;
        heatmapContainer.innerHTML = '';

        const history = (DB.getMeditationHistory ? DB.getMeditationHistory() : (DB.getState ? DB.getState().meditationHistory : [])) || [];
        const minsByDate = {};
        history.forEach(item => {
            if (item.date) {
                const dStr = item.date.split('T')[0];
                const duration = typeof item.duration === 'number' ? item.duration : parseInt(item.duration) || 0;
                minsByDate[dStr] = (minsByDate[dStr] || 0) + duration;
            }
        });

        const today = new Date();
        const daysToRender = 364; // 52 full weeks (Sun-Sat) for 1 full year
        const startDate = new Date();
        startDate.setDate(today.getDate() - (daysToRender - 1));
        // Align start date to previous Sunday for grid symmetry
        startDate.setDate(startDate.getDate() - startDate.getDay());

        // Main Wrapper with Day labels on left
        const mainWrap = document.createElement('div');
        mainWrap.style.cssText = 'display:flex; gap:6px; align-items:flex-start; min-width:max-content;';

        // Day Labels Column (S, M, T, W, T, F, S)
        const dayLabelsCol = document.createElement('div');
        dayLabelsCol.style.cssText = 'display:flex; flex-direction:column; gap:3px; font-size:8px; font-weight:700; color:var(--color-text-muted); margin-top:18px; text-align:right; flex-shrink:0; width:14px;';
        const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        dayLetters.forEach(letter => {
            const lbl = document.createElement('div');
            lbl.style.cssText = 'height:11px; line-height:11px;';
            lbl.textContent = letter;
            dayLabelsCol.appendChild(lbl);
        });
        mainWrap.appendChild(dayLabelsCol);

        // Columns Wrap with Month Headers aligned via CSS Grid
        const gridWrap = document.createElement('div');
        gridWrap.style.cssText = 'display:flex; flex-direction:column; gap:4px; min-width:max-content;';

        const monthRow = document.createElement('div');
        monthRow.style.cssText = 'display:grid; grid-template-columns:repeat(52, 11px); gap:3px; height:14px; position:relative; width:max-content;';

        const colsWrap = document.createElement('div');
        colsWrap.style.cssText = 'display:grid; grid-template-columns:repeat(52, 11px); gap:3px; width:max-content;';

        // 1. Render Month Headers exactly at their column start
        let lastMonth = -1;
        for (let colIdx = 0; colIdx < 52; colIdx++) {
            const colSunDate = new Date(startDate);
            colSunDate.setDate(startDate.getDate() + (colIdx * 7));

            const m = colSunDate.getMonth();
            if (m !== lastMonth) {
                const mSpan = document.createElement('span');
                mSpan.style.cssText = `grid-column-start: ${colIdx + 1}; font-size:9.5px; font-weight:700; color:var(--color-text-secondary); white-space:nowrap; pointer-events:none;`;
                mSpan.textContent = colSunDate.toLocaleDateString('en-US', { month: 'short' });
                monthRow.appendChild(mSpan);
                lastMonth = m;
            }
        }

        // 2. Render 52 Column Tiles
        let currentColumn = null;

        for (let i = 0; i < daysToRender; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const isoStr = d.toISOString().split('T')[0];
            const dayOfWeek = d.getDay();

            if (dayOfWeek === 0 || !currentColumn) {
                currentColumn = document.createElement('div');
                currentColumn.style.cssText = 'display:flex; flex-direction:column; gap:3px;';
                colsWrap.appendChild(currentColumn);
            }

            const mins = minsByDate[isoStr] || 0;
            let bg = 'rgba(0, 0, 0, 0.07)';
            if (mins > 0 && mins <= 15) bg = 'rgba(74, 144, 98, 0.45)';
            else if (mins > 15 && mins <= 30) bg = 'rgba(74, 144, 98, 0.8)';
            else if (mins > 30) bg = '#2e7d32';

            const tile = document.createElement('div');
            tile.style.cssText = `width:11px; height:11px; border-radius:2.5px; background:${bg}; border:1px solid rgba(0,0,0,0.04); cursor:pointer; transition:transform 0.1s; flex-shrink:0;`;
            tile.title = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${mins} min`;

            tile.addEventListener('click', () => {
                const popover = targetPopover || container.querySelector('#rfl-heatmap-popover');
                if (popover) {
                    const formattedDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    popover.textContent = `📅 ${formattedDate}: ${mins > 0 ? `${mins} minutes sit` : 'No sit recorded'}`;
                    popover.style.color = mins > 0 ? 'var(--color-accent)' : 'var(--color-text-muted)';
                }
            });

            currentColumn.appendChild(tile);
        }

        gridWrap.appendChild(monthRow);
        gridWrap.appendChild(colsWrap);
        mainWrap.appendChild(gridWrap);
        heatmapContainer.appendChild(mainWrap);

        // Auto-scroll to show the most recent weeks on the right
        setTimeout(() => {
            heatmapContainer.scrollLeft = heatmapContainer.scrollWidth;
        }, 50);
    };

    const renderGrowthWaveChart = (period, targetEl = null) => {
        const growthChartEl = targetEl || container.querySelector('#rfl-growth-chart');
        const summaryEl = container.querySelector('#rfl-growth-summary');
        if (!growthChartEl) return;
        growthChartEl.innerHTML = '';

        const history = (DB.getMeditationHistory ? DB.getMeditationHistory() : (DB.getState ? DB.getState().meditationHistory : [])) || [];
        const buckets = [];
        const labels = [];
        const today = new Date();

        if (period === 'week') {
            for (let i = 7; i >= 0; i--) {
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - (i * 7 + 6));
                const weekEnd = new Date(today);
                weekEnd.setDate(today.getDate() - (i * 7));

                let totalMins = 0;
                history.forEach(item => {
                    if (item.date) {
                        const itemDate = new Date(item.date);
                        if (itemDate >= weekStart && itemDate <= weekEnd) {
                            totalMins += (typeof item.duration === 'number' ? item.duration : parseInt(item.duration) || 0);
                        }
                    }
                });
                buckets.push(totalMins);
                labels.push(i === 0 ? 'This Wk' : `Wk -${i}`);
            }
        } else {
            for (let i = 5; i >= 0; i--) {
                const mDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthName = mDate.toLocaleDateString('en-US', { month: 'short' });
                const mYear = mDate.getFullYear();
                const mMonth = mDate.getMonth();

                let totalMins = 0;
                history.forEach(item => {
                    if (item.date) {
                        const itemDate = new Date(item.date);
                        if (itemDate.getFullYear() === mYear && itemDate.getMonth() === mMonth) {
                            totalMins += (typeof item.duration === 'number' ? item.duration : parseInt(item.duration) || 0);
                        }
                    }
                });
                buckets.push(totalMins);
                labels.push(monthName);
            }
        }

        const maxMins = Math.max(...buckets, 10);
        const totalPeriodMins = buckets.reduce((a, b) => a + b, 0);
        const prevTotal = buckets.slice(0, Math.floor(buckets.length / 2)).reduce((a, b) => a + b, 0);
        const recentTotal = buckets.slice(Math.floor(buckets.length / 2)).reduce((a, b) => a + b, 0);
        const pctDiff = prevTotal > 0 ? Math.round(((recentTotal - prevTotal) / prevTotal) * 100) : 0;

        if (summaryEl) {
            summaryEl.textContent = `Total: ${totalPeriodMins}m ${pctDiff !== 0 ? `(${pctDiff > 0 ? '+' : ''}${pctDiff}%)` : ''}`;
        }

        const svgW = 280;
        const svgH = 65;
        const points = buckets.map((val, idx) => {
            const x = (idx / (buckets.length - 1)) * svgW;
            const y = svgH - ((val / maxMins) * (svgH - 15));
            return { x, y, val };
        });

        let pathD = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cpX = (p0.x + p1.x) / 2;
            pathD += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
        }

        const areaD = `${pathD} L ${svgW},${svgH} L 0,${svgH} Z`;

        let dotsSVG = '';
        points.forEach((p) => {
            dotsSVG += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="var(--color-accent)" />`;
        });

        let labelsHTML = '<div style="display:flex; justify-content:space-between; margin-top:4px;">';
        labels.forEach((lbl) => {
            labelsHTML += `<span style="font-size:8.5px; color:var(--color-text-muted); text-align:center; flex:1;">${lbl}</span>`;
        });
        labelsHTML += '</div>';

        growthChartEl.innerHTML = `
            <svg viewBox="0 0 ${svgW} ${svgH}" style="width:100%; height:${svgH}px; overflow:visible;">
                <defs>
                    <linearGradient id="growthWaveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.35"/>
                        <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>
                <path d="${areaD}" fill="url(#growthWaveGrad)" />
                <path d="${pathD}" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" />
                ${dotsSVG}
            </svg>
            ${labelsHTML}
        `;
    };

    const renderAchievementsGrid = () => {
        const achGrid = container.querySelector('#achievements-grid');
        if (!achGrid) return;
        achGrid.innerHTML = '';

        const achievements = DB.getAchievementsState();
        achievements.forEach(ach => {
            const item = document.createElement('div');
            item.className = `ach-item ${ach.unlocked ? 'unlocked' : 'locked'}`;

            if (ach.isTiered) {
                const chakra = ach.chakra || { color: '#E53935', bg: 'rgba(229, 57, 53, 0.12)', name: 'Root Chakra' };
                const progressPct = Math.min(100, (ach.val / ach.target) * 100);
                item.style.background = ach.unlocked ? chakra.bg : 'var(--color-bg-card)';
                item.style.borderLeft = `4px solid ${chakra.color}`;

                item.innerHTML = `
                    <div class="ach-emoji" style="${ach.unlocked ? '' : 'filter: grayscale(0.5); opacity: 0.55;'}">${ach.emoji}</div>
                    <div class="ach-details">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:4px; margin-bottom:2px;">
                            <h4 class="ach-title">${ach.title}</h4>
                            <span style="background:${chakra.color}; color:#fff; font-size:9px; font-weight:700; padding:1px 6px; border-radius:8px; white-space:nowrap;">Lvl ${ach.currentLevel}/${ach.maxLevel}</span>
                        </div>
                        <p class="ach-desc">${ach.desc} • <strong style="color:${chakra.color};">${chakra.name}</strong></p>
                        <div class="home-bar-track" style="margin: 0 0 4px; height: 4px; background: rgba(0,0,0,0.05); width: 100%;">
                            <div class="home-bar-fill" style="width: ${progressPct}%; height: 100%; background: ${chakra.color};"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="ach-reward-tag" style="background:${chakra.bg}; color:${chakra.color}; font-weight:700;">+${ach.nextTier ? ach.nextTier.xp : 0} XP</span>
                            <span class="ach-progress-text">${ach.val}/${ach.target}</span>
                        </div>
                    </div>
                `;
            } else if (ach.unlocked) {
                item.innerHTML = `
                    <div class="ach-emoji">${ach.emoji}</div>
                    <div class="ach-details">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:4px;">
                            <h4 class="ach-title">${ach.title}</h4>
                            <span class="material-symbols-rounded" style="font-size:13px; color:#2c8242; font-variation-settings: 'FILL' 1;">check_circle</span>
                        </div>
                        <p class="ach-desc">${ach.desc}</p>
                        <span class="ach-reward-tag">✓ Unlocked (+${ach.xp} XP)</span>
                    </div>
                `;
            } else {
                const progressPct = Math.min(100, (ach.val / ach.target) * 100);
                item.innerHTML = `
                    <div class="ach-emoji" style="filter: grayscale(0.5); opacity: 0.55;">${ach.emoji}</div>
                    <div class="ach-details">
                        <h4 class="ach-title" style="color:var(--color-text-secondary);">${ach.title}</h4>
                        <p class="ach-desc">${ach.desc}</p>
                        <div class="home-bar-track" style="margin: 0 0 4px; height: 4px; background: rgba(0,0,0,0.05); width: 100%;">
                            <div class="home-bar-fill" style="width: ${progressPct}%; height: 100%; background: #abb5ae;"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="ach-reward-tag" style="background:#edece8; color:#777;">+${ach.xp} XP</span>
                            <span class="ach-progress-text">${ach.val}/${ach.target}</span>
                        </div>
                    </div>
                `;
            }
            achGrid.appendChild(item);
        });
    };

    // -------------------------------------------------------------
    // Main updateData function (Only updates dynamic content)
    // -------------------------------------------------------------
    container.updateData = () => {
        const user = DB.getUser();
        const stats = DB.getStats();
        
        if (user) {
            container.querySelector('#profile-name').textContent = user.name || 'User';
            const avatarImg = container.querySelector('#profile-avatar-img');
            if (avatarImg) {
                avatarImg.src = user.avatar || './src/assets/avatar_monk.jpg';
            }
            const goalInput = container.querySelector('#custom-goal-input');
            if (goalInput) {
                goalInput.value = user.dailyCommitment || 20;
            }
            const notifSettings = DB.getNotificationSettings ? DB.getNotificationSettings() : {};
            const toggleSessionNotif = container.querySelector('#toggle-session-notification');
            const toggleVibration = container.querySelector('#toggle-vibration');

            if (typeof container.renderRemindersUI === 'function') {
                container.renderRemindersUI();
            }
            if (toggleSessionNotif) {
                toggleSessionNotif.checked = notifSettings.sessionCompletionEnabled !== false;
            }
            if (toggleVibration) {
                toggleVibration.checked = notifSettings.vibrationEnabled !== false;
            }
        }

        // Initialize Audio Toggle States
        const toggleMeditation = container.querySelector('#toggle-meditation-sound');
        const toggleMenu = container.querySelector('#toggle-menu-sound');
        if (toggleMeditation) {
            const isMeditationMuted = localStorage.getItem('siddha_sound_meditation_muted') === 'true' || localStorage.getItem('siddha_sound_muted') === 'true';
            toggleMeditation.checked = !isMeditationMuted;
        }
        if (toggleMenu) {
            const isMenuMuted = localStorage.getItem('siddha_sound_menu_muted') === 'true';
            toggleMenu.checked = !isMenuMuted;
        }
        
        container.querySelector('#profile-level').textContent = stats.level;
        container.querySelector('#profile-xp').textContent = stats.xp;
        container.querySelector('#stat-sessions').textContent = stats.totalSessions;
        container.querySelector('#stat-minutes').textContent = stats.totalMinutes + 'm';
        container.querySelector('#stat-streak').textContent = stats.streak + ' days';

        const longest = stats.longestStreak || stats.streak || 0;
        const avgDur = stats.totalSessions > 0 ? Math.round(stats.totalMinutes / stats.totalSessions) : 0;
        const longestEl = container.querySelector('#stat-longest-streak');
        if (longestEl) longestEl.textContent = longest + ' days';
        const avgEl = container.querySelector('#stat-avg-duration');
        if (avgEl) avgEl.textContent = avgDur + 'm';

        container.querySelector('#rfl-total-mins').textContent = stats.weekMinutes;
        container.querySelector('#rfl-total-sessions').textContent = stats.weekSessions;
        container.querySelector('#rfl-streak').textContent = stats.streak;

        renderWeekBarChart(stats);
        renderHeatmapGrid();
        renderGrowthWaveChart(activeGrowthPeriod);
        renderAchievementsGrid();
    };

    // -------------------------------------------------------------
    // Static Event Listeners (Bound ONCE at initialization)
    // -------------------------------------------------------------
    
    // 1. Tab Switching (Week, Heatmap, Growth)
    const tabBtns = container.querySelectorAll('.rfl-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            activeAnalyticsTab = targetTab;
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = 'var(--color-text-muted)';
                b.style.boxShadow = 'none';
            });
            btn.classList.add('active');
            btn.style.background = 'var(--color-bg-card)';
            btn.style.color = 'var(--color-text-primary)';
            btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';

            container.querySelectorAll('.rfl-tab-view').forEach(v => v.classList.add('hidden'));
            const targetView = container.querySelector(`#rfl-view-${targetTab}`);
            if (targetView) targetView.classList.remove('hidden');

            if (targetTab === 'heatmap') renderHeatmapGrid();
            if (targetTab === 'growth') renderGrowthWaveChart(activeGrowthPeriod);
        });
    });

    // 2. Growth Period Toggle (Week vs Month)
    const growthToggleBtns = container.querySelectorAll('.rfl-growth-btn');
    growthToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const period = btn.getAttribute('data-period');
            activeGrowthPeriod = period;
            growthToggleBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = 'var(--color-text-muted)';
                b.style.boxShadow = 'none';
            });
            btn.classList.add('active');
            btn.style.background = 'var(--color-bg-card)';
            btn.style.color = 'var(--color-text-primary)';
            btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';

            renderGrowthWaveChart(period);
        });
    });

    // 3. Goal Chips & Custom Goal
    container.querySelectorAll('.goal-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mins = parseInt(btn.getAttribute('data-mins'));
            if (mins) {
                DB.setDailyGoal(mins);
                const customInput = container.querySelector('#custom-goal-input');
                if (customInput) customInput.value = mins;
                container.updateData();
            }
        });
    });

    const saveCustomGoalBtn = container.querySelector('#save-custom-goal-btn');
    if (saveCustomGoalBtn) {
        saveCustomGoalBtn.addEventListener('click', () => {
            const customInput = container.querySelector('#custom-goal-input');
            const val = parseInt(customInput?.value);
            if (val && val > 0) {
                DB.setDailyGoal(val);
                container.updateData();
                alert(`Daily meditation goal updated to ${val} minutes!`);
            }
        });
    }

    // Multiple Reminders Management
    const remindersContainer = container.querySelector('#reminders-list-container');
    const addReminderBtn = container.querySelector('#add-reminder-btn');
    const toggleSessionNotif = container.querySelector('#toggle-session-notification');
    const toggleVibration = container.querySelector('#toggle-vibration');

    const syncNativeReminders = (remindersList) => {
        const notifPlugin = window.Capacitor?.Plugins?.LocalNotifications;
        if (!notifPlugin) return;

        notifPlugin.checkPermissions().then((perm) => {
            if (perm.display === 'granted') {
                proceedWithSync();
            } else if (perm.display === 'prompt' || perm.display === 'prompt-with-rationale') {
                notifPlugin.requestPermissions().then((newPerm) => {
                    if (newPerm.display === 'granted') proceedWithSync();
                });
            }
        });

        function proceedWithSync() {
            notifPlugin.getPending().then((pending) => {
                const idsToCancel = (pending && pending.notifications) ? pending.notifications.map(n => ({ id: n.id })) : [];
                const fallbackIds = Array.from({ length: 20 }, (_, i) => ({ id: 101 + i }));
                const allCancel = [...idsToCancel, ...fallbackIds, { id: 99 }];

                const enabledReminders = (remindersList || []).filter(r => r.enabled);

                notifPlugin.cancel({ notifications: allCancel }).then(() => {
                    if (enabledReminders.length === 0) return;

                    const notificationsToSchedule = enabledReminders.map((r, index) => {
                        const [hrs, mins] = (r.time || '08:00').split(':').map(Number);

                        return {
                            title: "Time for Mindfulness 🧘",
                            body: "Take a few moments to sit and find your center.",
                            id: 101 + index,
                            schedule: {
                                on: { hour: hrs, minute: mins },
                                repeats: true,
                                allowWhileIdle: true
                            }
                        };
                    });

                    notifPlugin.schedule({
                        notifications: notificationsToSchedule
                    }).catch(err => console.warn("[Profile] LocalNotifications schedule error:", err));
                });
            });
        }
    };

    container.renderRemindersUI = () => {
        if (!remindersContainer) return;
        const notifSettings = DB.getNotificationSettings ? DB.getNotificationSettings() : {};
        const reminders = notifSettings.reminders || [];

        remindersContainer.innerHTML = '';
        if (reminders.length === 0) {
            remindersContainer.innerHTML = `<p style="font-size:11.5px; color:var(--color-text-muted); margin:0;">No reminders set. Click "Add Time" to add one.</p>`;
            return;
        }

        reminders.forEach((rem, idx) => {
            const row = document.createElement('div');
            row.className = 'reminder-item-row';
            row.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--color-bg-secondary); border-radius:10px;';
            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="material-symbols-rounded" style="font-size:16px; color:var(--color-text-muted);">schedule</span>
                    <input type="time" class="reminder-time-field" data-id="${rem.id}" value="${rem.time || '08:00'}" style="padding:3px 6px; border-radius:6px; border:1px solid rgba(0,0,0,0.1); font-size:12px; outline:none; font-family:inherit; color:var(--color-text-primary); background:var(--color-bg-card);">
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <label class="switch-toggle" style="transform:scale(0.85); transform-origin:right center;">
                        <input type="checkbox" class="reminder-toggle-field" data-id="${rem.id}" ${rem.enabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    ${reminders.length > 1 ? `
                    <button class="reminder-delete-btn" data-id="${rem.id}" aria-label="Delete" style="background:none; border:none; cursor:pointer; color:#d32f2f; padding:2px; display:flex; align-items:center;">
                        <span class="material-symbols-rounded" style="font-size:16px;">delete</span>
                    </button>
                    ` : ''}
                </div>
            `;
            remindersContainer.appendChild(row);
        });

        // Time change listener
        remindersContainer.querySelectorAll('.reminder-time-field').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const newTime = e.target.value;
                const notifSettings = DB.getNotificationSettings();
                const list = (notifSettings.reminders || []).map(r => r.id === id ? { ...r, time: newTime } : r);
                DB.setNotificationSettings({ reminders: list });
                syncNativeReminders(list);
            });
        });

        // Toggle change listener
        remindersContainer.querySelectorAll('.reminder-toggle-field').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const isChecked = e.target.checked;
                const notifSettings = DB.getNotificationSettings();
                const list = (notifSettings.reminders || []).map(r => r.id === id ? { ...r, enabled: isChecked } : r);
                DB.setNotificationSettings({ reminders: list });
                syncNativeReminders(list);
            });
        });

        // Delete button listener
        remindersContainer.querySelectorAll('.reminder-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const notifSettings = DB.getNotificationSettings();
                const list = (notifSettings.reminders || []).filter(r => r.id !== id);
                DB.setNotificationSettings({ reminders: list });
                container.renderRemindersUI();
                syncNativeReminders(list);
            });
        });
    };

    if (addReminderBtn) {
        addReminderBtn.addEventListener('click', () => {
            const notifSettings = DB.getNotificationSettings();
            const list = notifSettings.reminders || [];
            const newId = 'rem_' + Date.now();
            const defaultTimes = ['08:00', '13:00', '20:00', '21:30'];
            const nextTime = defaultTimes[list.length % defaultTimes.length];
            
            const updated = [...list, { id: newId, time: nextTime, enabled: true }];
            DB.setNotificationSettings({ reminders: updated });
            container.renderRemindersUI();
            syncNativeReminders(updated);
        });
    }

    container.renderRemindersUI();

    if (toggleSessionNotif) {
        toggleSessionNotif.addEventListener('change', (e) => {
            DB.setNotificationSettings({ sessionCompletionEnabled: e.target.checked });
        });
    }

    if (toggleVibration) {
        toggleVibration.addEventListener('change', (e) => {
            DB.setNotificationSettings({ vibrationEnabled: e.target.checked });
        });
    }

    // Audio Toggle Event Listeners
    const toggleMeditation = container.querySelector('#toggle-meditation-sound');
    const toggleMenu = container.querySelector('#toggle-menu-sound');
    const toggleBgMusic = container.querySelector('#toggle-bg-music');
    const selectBgTrack = container.querySelector('#select-bg-music-track');
    const sliderBgVolume = container.querySelector('#slider-bg-music-volume');
    const labelBgVolume = container.querySelector('#label-bg-music-volume');
    const optionsWrapBg = container.querySelector('#bg-music-options-wrap');

    if (toggleBgMusic && selectBgTrack && sliderBgVolume && labelBgVolume) {
        import('../services/synth.js').then(({ MenuMusic }) => {
            const enabled = MenuMusic.isEnabled();
            toggleBgMusic.checked = enabled;
            if (optionsWrapBg) optionsWrapBg.style.opacity = enabled ? '1' : '0.45';

            selectBgTrack.value = MenuMusic.getSelectedTrackId();
            
            const currentVolPct = Math.round(MenuMusic.getVolume() * 100);
            sliderBgVolume.value = currentVolPct;
            labelBgVolume.textContent = currentVolPct + '%';

            toggleBgMusic.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                MenuMusic.setEnabled(isChecked);
                if (optionsWrapBg) optionsWrapBg.style.opacity = isChecked ? '1' : '0.45';
            });

            selectBgTrack.addEventListener('change', (e) => {
                MenuMusic.setSelectedTrackId(e.target.value);
            });

            sliderBgVolume.addEventListener('input', (e) => {
                const pct = parseInt(e.target.value);
                labelBgVolume.textContent = pct + '%';
                MenuMusic.setVolume(pct / 100);
            });
        });
    }

    // Nature Sound Ambiance Listeners & Initial State
    const toggleNature = container.querySelector('#toggle-nature-sound');
    const selectNatureTrack = container.querySelector('#select-nature-sound-track');
    const sliderNatureVolume = container.querySelector('#slider-nature-volume');
    const labelNatureVolume = container.querySelector('#label-nature-volume');
    const optionsWrapNature = container.querySelector('#nature-sound-options-wrap');

    if (toggleNature && selectNatureTrack && sliderNatureVolume && labelNatureVolume) {
        import('../services/synth.js').then(({ NatureMusic }) => {
            const enabled = NatureMusic.isEnabled();
            toggleNature.checked = enabled;
            if (optionsWrapNature) optionsWrapNature.style.opacity = enabled ? '1' : '0.45';

            selectNatureTrack.value = NatureMusic.getSelectedTrackId();

            const currentVolPct = Math.round(NatureMusic.getVolume() * 100);
            sliderNatureVolume.value = currentVolPct;
            labelNatureVolume.textContent = currentVolPct + '%';

            toggleNature.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                NatureMusic.setEnabled(isChecked);
                if (optionsWrapNature) optionsWrapNature.style.opacity = isChecked ? '1' : '0.45';
            });

            selectNatureTrack.addEventListener('change', (e) => {
                NatureMusic.setSelectedTrackId(e.target.value);
            });

            sliderNatureVolume.addEventListener('input', (e) => {
                const pct = parseInt(e.target.value);
                labelNatureVolume.textContent = pct + '%';
                NatureMusic.setVolume(pct / 100);
            });
        });
    }

    if (toggleMeditation) {
        toggleMeditation.addEventListener('change', (e) => {
            const isSoundOn = e.target.checked;
            localStorage.setItem('siddha_sound_meditation_muted', isSoundOn ? 'false' : 'true');
            localStorage.setItem('siddha_sound_muted', isSoundOn ? 'false' : 'true');
        });
    }

    if (toggleMenu) {
        toggleMenu.addEventListener('change', (e) => {
            const isSoundOn = e.target.checked;
            localStorage.setItem('siddha_sound_menu_muted', isSoundOn ? 'false' : 'true');
        });
    }

    // Share App Listener
    const shareBtn = container.querySelector('#profile-share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const shareData = {
                title: 'Siddha Meditation',
                text: 'Find your inner calm and build a mindful habit with Siddha Meditation! 🧘✨',
                url: 'https://siddha.app'
            };

            if (window.Capacitor?.Plugins?.Share) {
                window.Capacitor.Plugins.Share.share(shareData).catch(err => console.log('[Profile] Native share error:', err));
            } else if (navigator.share) {
                navigator.share(shareData).catch(err => console.log('[Profile] Web share error:', err));
            } else {
                navigator.clipboard.writeText('https://siddha.app');
                alert('App link copied to clipboard! (https://siddha.app)');
            }
        });
    }

    // Bug Report Modal Listeners
    const bugBtn = container.querySelector('#profile-bug-report-btn');
    const bugModal = container.querySelector('#bug-report-modal');
    const closeBugBtn = container.querySelector('#close-bug-modal-btn');
    const submitBugBtn = container.querySelector('#submit-bug-btn');

    if (bugBtn && bugModal) {
        bugBtn.addEventListener('click', () => {
            bugModal.style.display = 'flex';
        });
    }

    if (closeBugBtn && bugModal) {
        closeBugBtn.addEventListener('click', () => {
            bugModal.style.display = 'none';
        });
    }

    if (submitBugBtn && bugModal) {
        submitBugBtn.addEventListener('click', async () => {
            const type = container.querySelector('#bug-type-select')?.value || 'bug';
            const desc = container.querySelector('#bug-desc-input')?.value.trim();
            const email = container.querySelector('#bug-email-input')?.value.trim();

            if (!desc) {
                alert('Please provide a brief description of the issue or idea.');
                return;
            }

            submitBugBtn.disabled = true;
            const originalText = submitBugBtn.textContent;
            submitBugBtn.textContent = 'Sending Report... ⏳';

            // Save locally
            DB.saveFeedback({ type, summary: desc, email });

            // Send directly to email inbox via FormSubmit API
            try {
                await fetch("https://formsubmit.co/ajax/siddhameditation@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `[Siddha ${type.toUpperCase()}] ${desc.slice(0, 40)}...`,
                        _template: "table",
                        _captcha: "false",
                        issue_type: type,
                        description: desc,
                        user_email: email || 'Not provided',
                        app_version: "1.6.1 (Build 21)",
                        device_platform: navigator.platform || 'Unknown',
                        submitted_at: new Date().toLocaleString()
                    })
                });
            } catch (err) {
                console.warn('[Profile] Email dispatch error:', err);
            }

            submitBugBtn.disabled = false;
            submitBugBtn.textContent = originalText;

            alert('Thank you! 🐛 Your report has been sent directly to siddhameditation@gmail.com.');

            const descInput = container.querySelector('#bug-desc-input');
            if (descInput) descInput.value = '';
            bugModal.style.display = 'none';
        });
    }

    // 5. Avatar Modal & Options
    const avatarBtn = container.querySelector('#profile-avatar-btn');
    const avatarModal = container.querySelector('#avatar-modal');
    const closeAvatarBtn = container.querySelector('#close-avatar-modal');

    if (avatarBtn && avatarModal) {
        avatarBtn.addEventListener('click', () => {
            avatarModal.style.display = 'flex';
        });
    }
    if (closeAvatarBtn && avatarModal) {
        closeAvatarBtn.addEventListener('click', () => {
            avatarModal.style.display = 'none';
        });
    }
    container.querySelectorAll('.avatar-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const avatarPath = btn.getAttribute('data-avatar');
            if (avatarPath) {
                DB.updateProfileAvatar(avatarPath);
                const avatarImg = container.querySelector('#profile-avatar-img');
                if (avatarImg) avatarImg.src = avatarPath;
                const homeLogo = document.querySelector('.home-logo-avatar');
                if (homeLogo) homeLogo.src = avatarPath;
                if (avatarModal) avatarModal.style.display = 'none';
            }
        });
    });

    // 5.5 Analytics Pop-Up Modal Event Handlers
    const openAnalyticsModalBtn = container.querySelector('#open-analytics-modal-btn');
    const analyticsModalOverlay = container.querySelector('#analytics-modal-overlay');
    const closeAnalyticsModalBtn = container.querySelector('#close-analytics-modal-btn');

    function openAnalyticsModal() {
        if (!analyticsModalOverlay) return;
        analyticsModalOverlay.style.display = 'flex';

        const modalHeatmapContainer = container.querySelector('#modal-heatmap-container');
        const modalHeatmapPopover = container.querySelector('#modal-heatmap-popover');
        if (modalHeatmapContainer) {
            renderHeatmapGrid(modalHeatmapContainer, modalHeatmapPopover);
            setTimeout(() => {
                modalHeatmapContainer.scrollLeft = modalHeatmapContainer.scrollWidth;
            }, 80);
        }

        const modalGrowthChart = container.querySelector('#modal-growth-chart');
        if (modalGrowthChart) {
            renderGrowthWaveChart(activeGrowthPeriod, modalGrowthChart);
        }
    }

    if (openAnalyticsModalBtn) {
        openAnalyticsModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openAnalyticsModal();
        });
    }

    if (closeAnalyticsModalBtn) {
        closeAnalyticsModalBtn.addEventListener('click', () => {
            if (analyticsModalOverlay) analyticsModalOverlay.style.display = 'none';
        });
    }

    if (analyticsModalOverlay) {
        analyticsModalOverlay.addEventListener('click', (e) => {
            if (e.target === analyticsModalOverlay) {
                analyticsModalOverlay.style.display = 'none';
            }
        });
    }

    // 6. Collapsible Cards
    const sitRemindersCard = container.querySelector('#sit-reminders-card');
    if (sitRemindersCard) {
        const header = sitRemindersCard.querySelector('.collapsible-header');
        if (header) {
            header.addEventListener('click', () => {
                sitRemindersCard.classList.toggle('collapsed');
            });
        }
    }

    const lifetimeCard = container.querySelector('#lifetime-stats-card');
    if (lifetimeCard) {
        const header = lifetimeCard.querySelector('.collapsible-header');
        if (header) {
            header.addEventListener('click', () => {
                lifetimeCard.classList.toggle('collapsed');
            });
        }
    }

    const settingsCard = container.querySelector('#profile-settings-card');
    if (settingsCard) {
        const header = settingsCard.querySelector('.collapsible-header');
        if (header) {
            header.addEventListener('click', () => {
                settingsCard.classList.toggle('collapsed');
            });
        }
    }

    const milesCard = container.querySelector('#milestones-card');
    if (milesCard) {
        const header = milesCard.querySelector('.collapsible-header');
        if (localStorage.getItem('siddha_milestones_collapsed') === 'false') {
            milesCard.classList.remove('collapsed');
        } else {
            milesCard.classList.add('collapsed');
        }
        if (header) {
            header.addEventListener('click', () => {
                milesCard.classList.toggle('collapsed');
                localStorage.setItem('siddha_milestones_collapsed', milesCard.classList.contains('collapsed'));
            });
        }
    }

    const feedbackCard = container.querySelector('#feedback-card');
    if (feedbackCard) {
        const header = feedbackCard.querySelector('.collapsible-header');
        if (header) {
            header.addEventListener('click', () => {
                feedbackCard.classList.toggle('collapsed');
            });
        }
    }

    // 7. Feedback Form
    const feedbackForm = container.querySelector('#feedback-form');
    const feedbackSuccess = container.querySelector('#feedback-success-msg');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = container.querySelector('#feedback-type').value;
            const text = container.querySelector('#feedback-text').value.trim();
            
            if (text) {
                DB.saveFeedback(type, text);
                feedbackForm.style.display = 'none';
                if (feedbackSuccess) feedbackSuccess.classList.remove('hidden');
                
                setTimeout(() => {
                    feedbackForm.reset();
                    feedbackForm.style.display = 'flex';
                    if (feedbackSuccess) feedbackSuccess.classList.add('hidden');
                }, 4000);
            }
        });
    }

    // 8. Buttons & Actions
    const donateBtn = container.querySelector('#profile-donate-btn');
    if (donateBtn) {
        donateBtn.addEventListener('click', () => {
            window.open('https://ko-fi.com/siddha', '_blank');
        });
    }

    const openSettingsBtn = container.querySelector('#open-settings-screen-btn');
    if (openSettingsBtn && onOpenSettings) {
        openSettingsBtn.addEventListener('click', () => {
            onOpenSettings();
        });
    }

    const logoutBtn = container.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await DB.logout();
            window.location.reload();
        });
    }

    const resetBtn = container.querySelector('#reset-account-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Delete all progress and return to setup? This action is permanent and cannot be undone.')) {
                DB.resetProgress();
                window.location.reload();
            }
        });
    }

    const privacyBtn = container.querySelector('#open-privacy-policy-btn');
    if (privacyBtn) {
        privacyBtn.addEventListener('click', () => {
            window.open('privacy_policy.html', '_blank');
        });
    }

    const viewFeedbackBtn = container.querySelector('#dev-view-feedback-btn');
    if (viewFeedbackBtn) {
        viewFeedbackBtn.addEventListener('click', () => {
            const history = DB.getFeedbackHistory();
            if (history.length === 0) {
                alert('No feedback submitted yet.');
            } else {
                const formatted = history.map(item => `[${new Date(item.timestamp).toLocaleString()}] ${item.type.toUpperCase()}: ${item.text}`).join('\n\n');
                console.log('Saved Feedback Logs:\n', history);
                alert(`Saved Feedback Logs (also printed to Developer Console):\n\n${formatted}`);
            }
        });
    }

    const skip3Btn = container.querySelector('#dev-skip-3-btn');
    if (skip3Btn) {
        skip3Btn.addEventListener('click', () => {
            DB.devSimulateTimePassing(3);
            container.updateData();
        });
    }

    const skip7Btn = container.querySelector('#dev-skip-7-btn');
    if (skip7Btn) {
        skip7Btn.addEventListener('click', () => {
            DB.devSimulateTimePassing(7);
            container.updateData();
        });
    }

    // Secret 5-Tap Gesture on App Version to toggle Developer Mode
    let tapCount = 0;
    let tapTimer = null;
    const versionTrigger = container.querySelector('#app-version-trigger');
    if (versionTrigger) {
        versionTrigger.addEventListener('click', () => {
            tapCount++;
            if (tapTimer) clearTimeout(tapTimer);
            tapTimer = setTimeout(() => { tapCount = 0; }, 3000);

            if (tapCount >= 5) {
                tapCount = 0;
                clearTimeout(tapTimer);
                const isDev = localStorage.getItem('siddha_dev_mode') !== 'true';
                localStorage.setItem('siddha_dev_mode', isDev ? 'true' : 'false');

                if (isDev) {
                    document.body.classList.add('dev-mode-active');
                } else {
                    document.body.classList.remove('dev-mode-active');
                }

                HapticService.vibrate('completion');
                alert(isDev ? '🛠️ Developer Mode Unlocked!' : '🔒 Developer Mode Hidden!');
            }
        });
    }

    // Populate initial values
    container.updateData();

    return container;
}
