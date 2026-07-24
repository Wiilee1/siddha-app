import { DB } from '../services/db.js';

export function renderProfile() {
    const container = document.createElement('div');
    container.className = 'screen scrollable profile-screen';
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px;">
            <h1 style="font-size: 24px;">Profile</h1>
            <button class="icon-btn" style="color: var(--color-text-primary);" id="logout-btn">
                <span class="material-symbols-rounded">logout</span>
            </button>
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
                <p style="font-size:10.5px; color:var(--color-text-secondary); margin:0 0 8px 0; line-height:1.35;">
                    💡 <strong>Consistency Grid:</strong> Each vertical column is 1 week (Sun–Sat). Darker tiles indicate longer sits.
                </p>
                <div id="rfl-heatmap-container" style="overflow-x:auto; padding-bottom:6px; scrollbar-width:none;">
                    <!-- Rendered by JS -->
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:10px; color:var(--color-text-muted);">
                    <span id="rfl-heatmap-popover" style="font-weight:600; color:var(--color-text-secondary);">Tap any tile to view sit details</span>
                    <div style="display:flex; align-items:center; gap:3px;">
                        <span>Less</span>
                        <span style="width:8px; height:8px; border-radius:2px; background:var(--color-bg-secondary); display:inline-block;"></span>
                        <span style="width:8px; height:8px; border-radius:2px; background:rgba(99, 102, 241, 0.35); display:inline-block;"></span>
                        <span style="width:8px; height:8px; border-radius:2px; background:rgba(99, 102, 241, 0.7); display:inline-block;"></span>
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
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading);">Milestones & Badges</h3>
                <span class="material-symbols-rounded collapsible-toggle">expand_more</span>
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

        <!-- Settings Card (Collapsible, Daily Goal removed) -->
        <div class="card collapsible-card collapsed" id="profile-settings-card" style="margin-bottom: 32px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading); display:flex; align-items:center; gap:8px;">
                    <span class="material-symbols-rounded" style="color: var(--color-accent);">settings</span>
                    Settings & Preferences
                </h3>
                <span class="material-symbols-rounded collapsible-toggle" style="color: var(--color-text-muted);">expand_more</span>
            </div>
            
            <div class="collapsible-content" style="margin-top: 16px;">
                <!-- Notifications & Reminders Controls -->
                <div>
                    <h4 style="font-size: 13px; font-weight: 600; color: var(--color-text-primary); margin: 0 0 12px; font-family: var(--font-heading);">Notifications & Reminders</h4>
                    
                    <!-- Multiple Sit Reminders -->
                    <div style="margin-bottom: 14px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                            <div>
                                <span style="font-weight: 600; font-size: 12.5px; color:var(--color-text-primary);">📅 Sit Reminders</span>
                                <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin:2px 0 0;">Multiple daily mindfulness prompts</p>
                            </div>
                            <button id="add-reminder-btn" class="btn" style="padding:4px 10px; font-size:11px; background:var(--color-bg-secondary); color:var(--color-text-primary); border:1px solid rgba(0,0,0,0.1); border-radius:8px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:4px;">
                                <span class="material-symbols-rounded" style="font-size:15px; color:var(--color-accent);">add</span> Add Time
                            </button>
                        </div>
                        
                        <div id="reminders-list-container" style="display:flex; flex-direction:column; gap:8px;"></div>
                    </div>   </div>

                    <!-- Session Completion Notification Toggle -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                        <div>
                            <span style="font-weight: 600; font-size: 12.5px; color:var(--color-text-primary);">🔔 Session End Notification</span>
                            <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin:2px 0 0;">Alert when timer completes</p>
                        </div>
                        <label class="switch-toggle">
                            <input type="checkbox" id="toggle-session-notification" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- Audio & Haptics Controls -->
                <div style="border-top: 1px solid var(--color-bg-secondary); padding-top: 16px; margin-top: 16px;">
                    <h4 style="font-size: 13px; font-weight: 600; color: var(--color-text-primary); margin: 0 0 12px; font-family: var(--font-heading);">Audio & Haptics Controls</h4>
                    
                    <!-- Haptics / Vibration Toggle -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                        <div>
                            <span style="font-weight: 600; font-size: 12.5px; color:var(--color-text-primary);">📳 Haptics & Vibration</span>
                            <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin:2px 0 0;">Tactile pulses on iOS, Android & web</p>
                        </div>
                        <label class="switch-toggle">
                            <input type="checkbox" id="toggle-vibration" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Meditation Sound Toggle -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                        <div>
                            <span style="font-weight: 600; font-size: 12.5px; color:var(--color-text-primary);">🧘 Meditation Bells & Ambient</span>
                            <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin:2px 0 0;">Sit interval bells & soundscapes</p>
                        </div>
                        <label class="switch-toggle">
                            <input type="checkbox" id="toggle-meditation-sound" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Menu / UI Sound Toggle -->
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="font-weight: 600; font-size: 12.5px; color:var(--color-text-primary);">🎵 Menu & Navigation Sounds</span>
                            <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin:2px 0 0;">UI clicks & feedback audio</p>
                        </div>
                        <label class="switch-toggle">
                            <input type="checkbox" id="toggle-menu-sound" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Share & Community Card -->
        <div class="card" style="margin-bottom: 16px; padding: 20px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
                <span class="material-symbols-rounded" style="color:var(--color-accent); font-size:26px;">share</span>
                <div>
                    <h3 style="font-size: 15px; margin: 0; font-family: var(--font-heading); color:var(--color-text-primary);">Share & Community</h3>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11.5px; margin:2px 0 0;">Connect with our mindfulness journey</p>
                </div>
            </div>

            <!-- Share Button -->
            <button id="profile-share-btn" class="btn" style="width:100%; padding:12px; font-size:13.5px; background:var(--color-accent); color:#ffffff; border:none; border-radius:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 12px rgba(0,0,0,0.12); margin-bottom:12px;">
                <span class="material-symbols-rounded" style="font-size:18px;">share</span>
                Share Siddha App 🧘
            </button>

            <!-- Social Links Row -->
            <div style="display:flex; gap:10px;">
                <!-- Instagram Link -->
                <a id="profile-instagram-link" href="https://instagram.com/siddhamind" target="_blank" rel="noopener noreferrer" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:10px; background:linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color:#ffffff; text-decoration:none; border-radius:12px; font-size:12px; font-weight:700; box-shadow:0 2px 8px rgba(131, 58, 180, 0.25);">
                    <span class="material-symbols-rounded" style="font-size:16px;">photo_camera</span>
                    @siddhamind
                </a>

                <!-- Website Link -->
                <a id="profile-website-link" href="https://siddha.app" target="_blank" rel="noopener noreferrer" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:10px; background:var(--color-bg-secondary); color:var(--color-text-primary); text-decoration:none; border-radius:12px; font-size:12px; font-weight:700; border:1px solid rgba(0,0,0,0.08);">
                    <span class="material-symbols-rounded" style="font-size:16px; color:var(--color-accent);">language</span>
                    siddha.app
                </a>
            </div>
        </div>

        <!-- Support & Donation Card -->
        <div class="card" style="margin-bottom: 32px; text-align: center; padding: 20px;">
            <span class="material-symbols-rounded" style="color: #e2b857; font-size: 32px; margin-bottom: 8px;">favorite</span>
            <h3 style="font-size: 16px; margin: 0 0 8px; font-family: var(--font-heading);">Support Siddha</h3>
            <p class="text-sm" style="color: var(--color-text-secondary); margin-bottom: 16px; line-height: 1.4;">
                Siddha is free and built with love. If it helps you stay mindful, consider supporting our journey.
            </p>
            <button id="profile-donate-btn" class="btn" style="background: var(--color-accent); color: #fff; border: none; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 20px; width: 100%;">
                Support the App ☕
            </button>
        </div>

        <!-- Feedback Card -->
        <div class="card collapsible-card collapsed" id="feedback-card" style="margin-bottom: 32px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 20px;">rate_review</span>
                    Give Feedback
                </h3>
                <span class="material-symbols-rounded collapsible-toggle">expand_more</span>
            </div>
            <div class="collapsible-content" style="margin-top: 12px;">
                <form id="feedback-form" style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label class="text-sm" style="font-weight: 600; color: var(--color-text-secondary);">Feedback Type</label>
                        <select id="feedback-type" style="padding: 10px; border-radius: 8px; border: 1px solid var(--color-bg-secondary); background: var(--color-bg-card); font-family: inherit; font-size: 13px; color: var(--color-text-primary); outline: none;">
                            <option value="suggestion">💡 Suggestion</option>
                            <option value="bug">🐛 Bug Report</option>
                            <option value="compliment">🌸 Compliment</option>
                            <option value="other">💬 Other</option>
                        </select>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label class="text-sm" style="font-weight: 600; color: var(--color-text-secondary);">Your thoughts</label>
                        <textarea id="feedback-text" placeholder="Share your experience or report an issue..." required style="padding: 12px; border-radius: 8px; border: 1px solid var(--color-bg-secondary); min-height: 100px; resize: vertical; font-family: inherit; font-size: 13px; outline: none; line-height: 1.5; color: var(--color-text-primary); background: var(--color-bg-card);"></textarea>
                    </div>
                    <button type="submit" class="btn" style="background: var(--color-accent); color: #fff; border: none; font-size: 13px; font-weight: 600; padding: 10px 16px; align-self: flex-end; border-radius: 20px;">
                        Submit Feedback
                    </button>
                </form>
                <div id="feedback-success-msg" class="hidden" style="text-align: center; padding: 16px 0; animation: fadeIn 0.3s ease;">
                    <span class="material-symbols-rounded" style="font-size: 48px; color: var(--color-accent); margin-bottom: 8px; display: block;">check_circle</span>
                    <h4 style="font-size: 15px; margin-bottom: 4px; font-family: var(--font-heading);">Thank you!</h4>
                    <p class="text-sm" style="color: var(--color-text-secondary);">Your feedback helps us shape the journey of Siddha.</p>
                </div>
            </div>
        </div>

        <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
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
                    <!-- 1. Expanded Heatmap Section -->
                    <div style="background:var(--color-bg-secondary); padding:14px; border-radius:16px;">
                        <h4 style="margin:0 0 4px 0; font-size:13px; font-weight:700; color:var(--color-text-primary);">📅 Practice Consistency Heatmap</h4>
                        <p style="font-size:10px; color:var(--color-text-muted); margin:0 0 10px 0;">Each vertical column is 1 week (Sun to Sat). Tap any tile to inspect.</p>
                        
                        <div id="modal-heatmap-container" style="overflow-x:auto; padding-bottom:4px; scrollbar-width:none;"></div>
                        <p id="modal-heatmap-popover" style="font-size:10.5px; font-weight:700; color:var(--color-accent); margin:8px 0 0 0; text-align:center;">Tap a tile to view sit details</p>
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
        const daysToRender = 112; // 16 columns of 7 days (Sun-Sat)
        const startDate = new Date();
        startDate.setDate(today.getDate() - (daysToRender - 1));
        // Align start date to previous Sunday for grid symmetry
        startDate.setDate(startDate.getDate() - startDate.getDay());

        // Main Wrapper with Day labels on left
        const mainWrap = document.createElement('div');
        mainWrap.style.cssText = 'display:flex; gap:6px; align-items:flex-start;';

        // Day Labels Column (S, M, T, W, T, F, S)
        const dayLabelsCol = document.createElement('div');
        dayLabelsCol.style.cssText = 'display:flex; flex-direction:column; gap:3px; font-size:8px; font-weight:700; color:var(--color-text-muted); margin-top:14px; text-align:right; flex-shrink:0;';
        const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        dayLetters.forEach(letter => {
            const lbl = document.createElement('div');
            lbl.style.cssText = 'height:10px; line-height:10px;';
            lbl.textContent = letter;
            dayLabelsCol.appendChild(lbl);
        });
        mainWrap.appendChild(dayLabelsCol);

        // Columns Wrap with Month Headers
        const gridWrap = document.createElement('div');
        gridWrap.style.cssText = 'display:flex; flex-direction:column; gap:2px; min-width:max-content;';

        const monthRow = document.createElement('div');
        monthRow.style.cssText = 'display:flex; gap:3px; font-size:8.5px; font-weight:700; color:var(--color-text-secondary); height:12px; margin-bottom:2px;';

        const colsWrap = document.createElement('div');
        colsWrap.style.cssText = 'display:flex; gap:3px; align-items:center;';

        let currentColumn = null;
        let lastMonth = -1;

        for (let i = 0; i < daysToRender; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const isoStr = d.toISOString().split('T')[0];
            const dayOfWeek = d.getDay();
            const currentMonth = d.getMonth();

            if (dayOfWeek === 0 || !currentColumn) {
                currentColumn = document.createElement('div');
                currentColumn.style.cssText = 'display:flex; flex-direction:column; gap:3px;';
                colsWrap.appendChild(currentColumn);

                if (currentMonth !== lastMonth) {
                    const mName = d.toLocaleDateString('en-US', { month: 'short' });
                    const mSpan = document.createElement('span');
                    mSpan.style.cssText = 'font-size:8.5px; color:var(--color-text-muted); width:26px; text-align:left; font-weight:700;';
                    mSpan.textContent = mName;
                    monthRow.appendChild(mSpan);
                    lastMonth = currentMonth;
                }
            }

            const mins = minsByDate[isoStr] || 0;
            let bg = 'var(--color-bg-secondary)';
            if (mins > 0 && mins <= 15) bg = 'rgba(99, 102, 241, 0.35)';
            else if (mins > 15 && mins <= 30) bg = 'rgba(99, 102, 241, 0.7)';
            else if (mins > 30) bg = 'var(--color-accent)';

            const tile = document.createElement('div');
            tile.style.cssText = `width:10px; height:10px; border-radius:2.5px; background:${bg}; cursor:pointer; transition:transform 0.1s;`;
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

        // Cancel all pending notifications to prevent ghost notifications
        notifPlugin.getPending().then((pending) => {
            const idsToCancel = (pending && pending.notifications) ? pending.notifications.map(n => ({ id: n.id })) : [];
            const fallbackIds = Array.from({ length: 20 }, (_, i) => ({ id: 101 + i }));
            const allCancel = [...idsToCancel, ...fallbackIds, { id: 99 }];

            notifPlugin.cancel({ notifications: allCancel }).then(() => {
                const enabledReminders = (remindersList || []).filter(r => r.enabled);
                if (enabledReminders.length === 0) return;

                const notificationsToSchedule = enabledReminders.map((r, index) => {
                    const [hrs, mins] = (r.time || '08:00').split(':').map(Number);
                    const now = new Date();
                    const schedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hrs, mins, 0, 0);
                    // Crucial Android Fix: If time has passed today, schedule for tomorrow so Android AlarmManager doesn't fire immediately
                    if (schedDate <= now) {
                        schedDate.setDate(schedDate.getDate() + 1);
                    }

                    return {
                        title: "Time for Mindfulness 🧘",
                        body: "Take a few moments to sit and find your center.",
                        id: 101 + index,
                        schedule: {
                            at: schedDate,
                            repeats: true,
                            every: 'day'
                        }
                    };
                });

                notifPlugin.schedule({
                    notifications: notificationsToSchedule
                }).catch(err => console.log("[Profile] LocalNotifications schedule error:", err));
            }).catch(err => console.log("[Profile] LocalNotifications cancel error:", err));
        }).catch(() => {
            // Fallback cancel
            notifPlugin.cancel({ notifications: Array.from({ length: 20 }, (_, i) => ({ id: 101 + i })) });
        });
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

    if (toggleMeditation) {
        toggleMeditation.addEventListener('change', (e) => {
            const isSoundOn = e.target.checked;
            localStorage.setItem('siddha_sound_meditation_muted', isSoundOn ? 'false' : 'true');
            localStorage.setItem('siddha_sound_muted', isSoundOn ? 'false' : 'true');
        });
    }

    if (toggleMenu) {
        toggleMenu.addEventListener('click', (e) => {
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

    const logoutBtn = container.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await DB.logout();
            window.location.reload();
        });
    }

    const resetBtn = container.querySelector('#dev-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset all progress and return to setup? This cannot be undone.')) {
                DB.resetProgress();
                window.location.reload();
            }
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

    // Populate initial values
    container.updateData();

    return container;
}
