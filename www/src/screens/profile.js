import { DB } from '../services/db.js';

export function renderProfile() {
    const container = document.createElement('div');
    container.className = 'screen scrollable profile-screen';
    
    // We will update this dynamically when rendered
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px;">
            <h1 style="font-size: 24px;">Profile</h1>
            <button class="icon-btn" style="color: var(--color-text-primary);" id="logout-btn">
                <span class="material-symbols-rounded">logout</span>
            </button>
        </div>

        <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 100px; height: 100px; background-color: var(--color-accent); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 40px; color: var(--color-bg-primary);">
                <span id="profile-initial">A</span>
            </div>
            <h2 id="profile-name" style="font-size: 20px; margin-bottom: 4px;">User Name</h2>
            <p id="profile-email" class="text-sm">user@example.com</p>
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

        <!-- Weekly stats summary -->
        <div class="rfl-week-card card" style="margin-bottom: 32px;">
            <div class="rfl-week-header">
                <h3 class="rfl-section-title">This Week</h3>
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

            <!-- Dynamic bar chart -->
            <div class="rfl-chart" id="rfl-chart">
                <!-- 7 bars injected by JS -->
            </div>
        </div>

        <!-- Milestones Grid -->
        <div class="card collapsible-card" id="milestones-card" style="margin-bottom: 32px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading);">Milestones & Badges</h3>
                <span class="material-symbols-rounded collapsible-toggle" style="transition: transform 0.2s;">expand_more</span>
            </div>
            <div class="ach-grid collapsible-content" id="achievements-grid" style="margin-top: 12px; transition: max-height 0.3s ease-out, opacity 0.2s; overflow: hidden; max-height: 1000px;">
                <!-- Achievements injected by JS -->
            </div>
        </div>

        <div class="card" style="margin-bottom: 32px;">
            <h3 style="font-size: 16px; margin-bottom: 16px;">Lifetime Statistics</h3>
            
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                <span class="text-sm" style="color: var(--color-text-secondary);">Total Sessions</span>
                <span id="stat-sessions" style="font-weight: 600;">0</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                <span class="text-sm" style="color: var(--color-text-secondary);">Mindful Minutes</span>
                <span id="stat-minutes" style="font-weight: 600;">0m</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0;">
                <span class="text-sm" style="color: var(--color-text-secondary);">Current Streak</span>
                <span id="stat-streak" style="font-weight: 600;">0 days</span>
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
                <span class="material-symbols-rounded collapsible-toggle" style="transition: transform 0.2s;">expand_more</span>
            </div>
            <div class="collapsible-content" style="margin-top: 12px; transition: max-height 0.3s ease-out, opacity 0.2s; overflow: hidden; max-height: 400px;">
                <form id="feedback-form" style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label class="text-sm" style="font-weight: 600; color: var(--color-text-secondary);">Feedback Type</label>
                        <select id="feedback-type" style="padding: 10px; border-radius: 8px; border: 1px solid var(--color-bg-secondary); background: #fff; font-family: inherit; font-size: 13px; color: var(--color-text-primary); outline: none;">
                            <option value="suggestion">💡 Suggestion</option>
                            <option value="bug">🐛 Bug Report</option>
                            <option value="compliment">🌸 Compliment</option>
                            <option value="other">💬 Other</option>
                        </select>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label class="text-sm" style="font-weight: 600; color: var(--color-text-secondary);">Your thoughts</label>
                        <textarea id="feedback-text" placeholder="Share your experience or report an issue..." required style="padding: 12px; border-radius: 8px; border: 1px solid var(--color-bg-secondary); min-height: 100px; resize: vertical; font-family: inherit; font-size: 13px; outline: none; line-height: 1.5; color: var(--color-text-primary);"></textarea>
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
        <div style="height: 32px; flex-shrink: 0;"></div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        /* Week card styles */
        .rfl-week-card { padding: 14px 16px; }
        .rfl-week-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .rfl-section-title { font-size: 14px; font-weight: 600; margin: 0; color: var(--color-text-primary); }
        .rfl-week-stats { display: flex; align-items: center; gap: 10px; }
        .rfl-stat { display: flex; align-items: baseline; gap: 2px; }
        .rfl-stat-val { font-size: 16px; font-weight: 700; color: var(--color-text-primary); }
        .rfl-stat-label { font-size: 10px; color: var(--color-text-muted); }
        .rfl-stat-divider { width: 1px; height: 14px; background: var(--color-bg-secondary); }

        /* Bar chart */
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

        /* Switch Styles */
        .switch {
            position: relative; display: inline-block; width: 40px; height: 20px;
        }
        .switch input {
            opacity: 0; width: 0; height: 0;
        }
        .slider {
            position: absolute; cursor: pointer; inset: 0; background-color: #ccc; transition: .3s; border-radius: 20px;
        }
        .slider:before {
            position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%;
        }
        .switch input:checked + .slider:before {
            transform: translateX(20px);
        }

        /* Collapsible Card Rules */
        .collapsible-card.collapsed .collapsible-content {
            max-height: 0 !important;
            margin-top: 0 !important;
            opacity: 0;
            pointer-events: none;
        }
        .collapsible-card.collapsed .collapsible-toggle {
            transform: rotate(-90deg);
        }

        /* Achievements Grid */
        .ach-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 4px;
        }
        @media (min-width: 320px) {
            .ach-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        .ach-item {
            background: #ffffff;
            border: 1px solid var(--color-bg-secondary);
            border-radius: 12px;
            padding: 12px;
            display: flex;
            gap: 10px;
            align-items: flex-start;
            position: relative;
            box-shadow: 0 1px 4px rgba(0,0,0,0.02);
            transition: all 0.3s ease;
        }
        .ach-item.unlocked {
            border-left: 3px solid var(--color-accent);
            background: linear-gradient(135deg, #ffffff 0%, #f7faf8 100%);
        }
        .ach-item.locked {
            opacity: 0.85;
            background: #fdfdfc;
        }
        .ach-emoji {
            font-size: 22px;
            line-height: 1;
            flex-shrink: 0;
            padding: 6px;
            background: var(--color-bg-secondary);
            border-radius: 10px;
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
    `;
    container.appendChild(style);

    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIdx = (new Date().getDay() + 6) % 7; // 0=Mon, 6=Sun

    // Add update function to refresh data when screen is shown
    container.updateData = () => {
        const user = DB.getUser();
        const stats = DB.getStats();
        
        if (user) {
            container.querySelector('#profile-name').textContent = user.name || 'User';
            container.querySelector('#profile-email').textContent = user.email || '';
            container.querySelector('#profile-initial').textContent = (user.name || 'U').charAt(0).toUpperCase();
        }
        
        container.querySelector('#profile-level').textContent = stats.level;
        container.querySelector('#profile-xp').textContent = stats.xp;
        container.querySelector('#stat-sessions').textContent = stats.totalSessions;
        container.querySelector('#stat-minutes').textContent = stats.totalMinutes + 'm';
        container.querySelector('#stat-streak').textContent = stats.streak + ' days';

        // Week stats
        container.querySelector('#rfl-total-mins').textContent = stats.weekMinutes;
        container.querySelector('#rfl-total-sessions').textContent = stats.weekSessions;
        container.querySelector('#rfl-streak').textContent = stats.streak;

        // Dynamic bar chart
        const chart = container.querySelector('#rfl-chart');
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

        // Update achievements grid
        const achGrid = container.querySelector('#achievements-grid');
        if (achGrid) {
            achGrid.innerHTML = '';
            const achievements = DB.getAchievementsState();
            achievements.forEach(ach => {
                const item = document.createElement('div');
                item.className = `ach-item ${ach.unlocked ? 'unlocked' : 'locked'}`;

                if (ach.unlocked) {
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
                    const progressPct = Math.min(100, (ach.current / ach.target) * 100);
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
                                <span class="ach-progress-text">${ach.current}/${ach.target}</span>
                            </div>
                        </div>
                    `;
                }
                achGrid.appendChild(item);
            });
        }
    };

    setTimeout(() => {
        const milesCard = container.querySelector('#milestones-card');
        if (milesCard) {
            const header = milesCard.querySelector('.collapsible-header');
            if (localStorage.getItem('siddha_milestones_collapsed') === 'true') {
                milesCard.classList.add('collapsed');
            }
            header.addEventListener('click', () => {
                milesCard.classList.toggle('collapsed');
                localStorage.setItem('siddha_milestones_collapsed', milesCard.classList.contains('collapsed'));
            });
        }

        const feedbackCard = container.querySelector('#feedback-card');
        if (feedbackCard) {
            const header = feedbackCard.querySelector('.collapsible-header');
            header.addEventListener('click', () => {
                feedbackCard.classList.toggle('collapsed');
            });
        }

        const feedbackForm = container.querySelector('#feedback-form');
        const feedbackSuccess = container.querySelector('#feedback-success-msg');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const type = container.querySelector('#feedback-type').value;
                const text = container.querySelector('#feedback-text').value.trim();
                
                if (text) {
                    DB.saveFeedback(type, text);
                    
                    // Show success
                    feedbackForm.style.display = 'none';
                    feedbackSuccess.classList.remove('hidden');
                    
                    // Reset and show form again after 4 seconds
                    setTimeout(() => {
                        feedbackForm.reset();
                        feedbackForm.style.display = 'flex';
                        feedbackSuccess.classList.add('hidden');
                    }, 4000);
                }
            });
        }

        const donateBtn = container.querySelector('#profile-donate-btn');
        if (donateBtn) {
            donateBtn.addEventListener('click', () => {
                window.open('https://ko-fi.com/siddha', '_blank');
            });
        }

        const logoutBtn = container.querySelector('#logout-btn');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await DB.logout();
                window.location.reload();
            });
        }

        const resetBtn = container.querySelector('#dev-reset-btn');
        if(resetBtn) {
            resetBtn.addEventListener('click', () => {
                if(confirm('Reset all progress and return to setup? This cannot be undone.')) {
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
        if(skip3Btn) {
            skip3Btn.addEventListener('click', () => {
                DB.devSimulateTimePassing(3);
                container.updateData();
            });
        }

        const skip7Btn = container.querySelector('#dev-skip-7-btn');
        if(skip7Btn) {
            skip7Btn.addEventListener('click', () => {
                DB.devSimulateTimePassing(7);
                container.updateData();
            });
        }
    }, 0);

    return container;
}
