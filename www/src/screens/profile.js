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



        <div class="card">
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

        <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
            <div style="display: flex; gap: 8px;">
                <button id="dev-skip-3-btn" class="btn" style="background: transparent; color: #f39c12; border: 1px solid #f39c12; font-size: 12px; padding: 6px 12px;">
                    Skip 3 Days (No Med)
                </button>
                <button id="dev-skip-7-btn" class="btn" style="background: transparent; color: #e74c3c; border: 1px solid #e74c3c; font-size: 12px; padding: 6px 12px;">
                    Skip 7 Days
                </button>
            </div>
            <button id="dev-reset-btn" class="btn" style="background: transparent; color: #ff6b6b; border: 1px solid #ff6b6b; font-size: 12px; padding: 6px 12px;">
                Reset Progress (Dev)
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
        .switch input:checked + .slider {
            background-color: var(--color-accent);
        }
        .switch input:checked + .slider:before {
            transform: translateX(20px);
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
    };

    setTimeout(() => {
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
