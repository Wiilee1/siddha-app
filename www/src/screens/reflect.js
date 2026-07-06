import { DB } from '../services/db.js';

export function renderReflect(onNewReflection) {
    const container = document.createElement('div');
    container.className = 'screen scrollable reflect-screen';

    container.innerHTML = `
        <!-- Header -->
        <div class="rfl-header">
            <div>
                <h1 class="rfl-title">Reflections</h1>
                <p class="rfl-subtitle">Your mindfulness journey</p>
            </div>
            <button class="rfl-new-btn" id="new-reflection-btn">
                <span class="material-symbols-rounded" style="font-size:18px;">add</span>
                Reflect
            </button>
        </div>

        <!-- Quote Banner -->
        <div class="rfl-quote-card">
            <span class="material-symbols-rounded" style="font-size:24px; color:var(--color-accent); opacity:0.6; margin-bottom:8px;">format_quote</span>
            <p class="rfl-quote-text">"You are the sky. Everything else – it’s just the weather."</p>
            <p class="rfl-quote-author">— Pema Chödrön</p>
        </div>

        <!-- Past reflections -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:10px;">
            <h3 class="rfl-section-title" style="margin:0;">Recent Reflections</h3>
            <button id="rfl-toggle-all-btn" class="rfl-toggle-btn">Show all</button>
        </div>
        <div id="reflection-list" class="rfl-list">
            <p class="rfl-empty">No reflections yet. Tap Reflect above to add your first.</p>
        </div>
        <!-- bottom padding so last item isn't cut off -->
        <div style="height: 16px; flex-shrink: 0;"></div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .reflect-screen {
            padding: 16px 20px 0;
        }

        /* Header */
        .rfl-header {
            flex-shrink: 0;
            display: flex; justify-content: space-between; align-items: flex-start;
            margin-bottom: 24px;
        }
        .rfl-title { font-size: 20px; font-weight: 700; margin: 0 0 2px; font-family: var(--font-heading); }
        .rfl-subtitle { font-size: 11px; color: var(--color-text-muted); margin: 0; }
        .rfl-new-btn {
            display: flex; align-items: center; gap: 5px;
            background: var(--color-accent-dark); color: white;
            border: none; border-radius: 20px;
            padding: 8px 14px; font-size: 13px; font-weight: 600;
            cursor: pointer; flex-shrink: 0;
            transition: opacity 0.2s, transform 0.15s;
        }
        .rfl-new-btn:active { transform: scale(0.96); }

        .rfl-section-title { font-size: 14px; font-weight: 600; margin: 0; color: var(--color-text-primary); }
        .rfl-toggle-btn {
            background: none; border: none; font-size: 11px;
            font-weight: 600; color: var(--color-accent-dark);
            cursor: pointer; padding: 4px 8px; border-radius: 10px;
            transition: background 0.2s;
        }
        .rfl-toggle-btn:active { background: var(--color-bg-secondary); }

        /* Quote Card */
        .rfl-quote-card {
            background: var(--color-bg-card);
            border-radius: 14px;
            padding: 20px 24px;
            margin-bottom: 24px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
            display: flex; flex-direction: column; align-items: center;
        }
        .rfl-quote-text {
            font-size: 14px; font-family: var(--font-heading);
            font-style: italic; color: var(--color-text-primary);
            line-height: 1.5; margin: 0 0 8px 0;
        }
        .rfl-quote-author {
            font-size: 11px; color: var(--color-text-muted);
            margin: 0; font-weight: 600;
        }

        /* Reflection list */
        .rfl-list { display: flex; flex-direction: column; gap: 10px; }
        .rfl-empty { font-size: 13px; color: var(--color-text-muted); text-align: center; padding: 24px 0; margin: 0; }
        .rfl-item {
            background: var(--color-bg-card);
            border-radius: 14px; padding: 13px 15px;
            display: flex; flex-direction: column; gap: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .rfl-item-top {
            display: flex; justify-content: space-between; align-items: center;
        }
        .rfl-item-mood { font-size: 22px; }
        .rfl-item-date { font-size: 11px; color: var(--color-text-muted); }
        .rfl-item-duration {
            font-size: 11px; font-weight: 600;
            color: var(--color-accent-dark);
            background: var(--color-accent-light);
            padding: 2px 8px; border-radius: 10px;
        }
        .rfl-item-text {
            font-size: 13px; color: var(--color-text-secondary);
            line-height: 1.5; margin: 0;
            background: var(--color-bg-secondary);
            border-radius: 8px; padding: 8px 10px;
        }
        .rfl-item-standalone {
            font-size: 9px; font-weight: 700; letter-spacing: 1px;
            color: var(--color-text-muted); text-transform: uppercase;
        }
    `;
    container.appendChild(style);

    let showAll = false;

    // New reflection button → navigate to new_reflection screen in standalone mode
    container.querySelector('#new-reflection-btn').addEventListener('click', () => {
        const nr = document.querySelector('.new-reflection-screen');
        if (nr) {
            nr.sessionData = null; // null = standalone mode, no meditation
            nr.activeMission = null;
        }
        if (onNewReflection) onNewReflection();
        else document.querySelector('[data-target="reflect"]')?.click(); // fallback
    });

    container.querySelector('#rfl-toggle-all-btn').addEventListener('click', () => {
        showAll = !showAll;
        container.querySelector('#rfl-toggle-all-btn').textContent = showAll ? "Hide past" : "Show all";
        container.updateData();
    });

    function formatDate(isoString) {
        const d = new Date(isoString);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    container.updateData = () => {
        const reflections = DB.getReflections();

        // Reflections list — always fully rebuild to avoid stale data
        const list = container.querySelector('#reflection-list');
        list.innerHTML = '';

        if (reflections.length === 0) {
            list.innerHTML = '<p class="rfl-empty">No reflections yet. Tap Reflect above to add your first.</p>';
            return;
        }

        const MOOD_EMOJI = { calm: '😌', happy: '😊', tired: '😴', anxious: '😰', grateful: '🙏', neutral: '😐' };

        // Hide if not showAll. (Maybe we just show 0 or maybe recent 1)
        // the user said: "show a few reflections just not all"
        const itemsToShow = showAll ? reflections : reflections.slice(0, 3);

        itemsToShow.forEach(ref => {
            const item = document.createElement('div');
            item.className = 'rfl-item';
            const emoji = MOOD_EMOJI[ref.mood] || '😊';
            const isStandalone = !ref.duration;

            item.innerHTML = `
                <div class="rfl-item-top">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="rfl-item-mood">${emoji}</span>
                        ${isStandalone
                            ? '<span class="rfl-item-standalone">Standalone</span>'
                            : `<span class="rfl-item-duration">${ref.duration}m sit</span>`
                        }
                    </div>
                    <span class="rfl-item-date">${formatDate(ref.date)}</span>
                </div>
                ${ref.text ? `<p class="rfl-item-text">${ref.text}</p>` : ''}
            `;
            list.appendChild(item);
        });

        if (!showAll && reflections.length > 3) {
            const hiddenMsg = document.createElement('p');
            hiddenMsg.className = 'rfl-empty';
            hiddenMsg.textContent = `${reflections.length - 3} older reflections hidden.`;
            list.appendChild(hiddenMsg);
        }
    };

    return container;
}
