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

        <!-- Collapsible Mood & Mind State Flow Card -->
        <div class="card collapsible-card collapsed" id="rfl-mood-card" style="margin-bottom: 20px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 14px; margin: 0; font-family: var(--font-heading); display: flex; align-items: center; gap: 6px; color: var(--color-text-primary);">
                    <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 18px;">insights</span>
                    Mind State Flow
                </h3>
                <span class="material-symbols-rounded collapsible-toggle" style="transition: transform 0.2s;">expand_more</span>
            </div>
            <div class="collapsible-content" style="margin-top: 12px; transition: max-height 0.3s ease-out, opacity 0.2s; overflow: hidden; max-height: 400px;">
                <div id="rfl-mood-flow-container">
                    <!-- Rendered by updateData() -->
                </div>
            </div>
        </div>

        <!-- Past reflections -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:10px;">
            <h3 class="rfl-section-title" style="margin:0;">Recent Reflections</h3>
            <button id="rfl-toggle-all-btn" class="rfl-toggle-btn">Show all</button>
        </div>
        <div id="reflection-list" class="rfl-list">
            <p class="rfl-empty">No reflections yet. Tap Reflect above to add your first.</p>
        </div>
        <!-- bottom padding so last item isn't cut off by floating nav button -->
        <div style="height: 48px; flex-shrink: 0;"></div>
    `;

    const style = document.createElement('style');
    style.textContent = `
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
    // Collapsible Mood Card Handler
    const moodCard = container.querySelector('#rfl-mood-card');
    if (moodCard) {
        const header = moodCard.querySelector('.collapsible-header');
        const content = moodCard.querySelector('.collapsible-content');
        const toggle = moodCard.querySelector('.collapsible-toggle');
        const storageKey = 'siddha_reflect_mood_collapsed';
        
        const isCollapsed = localStorage.getItem(storageKey) === 'true';
        if (isCollapsed) {
            moodCard.classList.add('collapsed');
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
            toggle.style.transform = 'rotate(-90deg)';
        } else {
            moodCard.classList.remove('collapsed');
            content.style.maxHeight = '400px';
            content.style.opacity = '1';
            toggle.style.transform = 'rotate(0deg)';
        }

        header.addEventListener('click', () => {
            const currentlyCollapsed = moodCard.classList.contains('collapsed');
            if (currentlyCollapsed) {
                moodCard.classList.remove('collapsed');
                content.style.maxHeight = '400px';
                content.style.opacity = '1';
                toggle.style.transform = 'rotate(0deg)';
                localStorage.setItem(storageKey, 'false');
            } else {
                moodCard.classList.add('collapsed');
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                toggle.style.transform = 'rotate(-90deg)';
                localStorage.setItem(storageKey, 'true');
            }
        });
    }

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

        // Render Mood & Mind State Flow visualization
        const moodContainer = container.querySelector('#rfl-mood-flow-container');
        if (moodContainer) {
            if (reflections.length === 0) {
                moodContainer.innerHTML = `
                    <div style="text-align: center; padding: 12px 0; color: var(--color-text-muted); font-size: 12px;">
                        Complete a session or add a reflection to visualize your mind state trends.
                    </div>
                `;
            } else {
                const MOOD_EMOJI = { calm: '😌', happy: '😊', tired: '😴', anxious: '😰', grateful: '🙏', neutral: '😐', clear: '✨', restless: '🌪️' };
                const MOOD_COLORS = { calm: '#4ea8de', happy: '#ffd166', tired: '#90e0ef', anxious: '#f77f00', grateful: '#06d6a0', neutral: '#a8dadc', clear: '#805ad5', restless: '#e63946' };

                // Calculate distribution and average focus/stability/equanimity
                const counts = {};
                let totalFocus = 0;
                let totalStability = 0;
                let totalEquanimity = 0;
                let scoredCount = 0;

                reflections.forEach(r => {
                    const m = r.mood || 'calm';
                    counts[m] = (counts[m] || 0) + 1;

                    if (typeof r.focusScore === 'number') {
                        totalFocus += r.focusScore;
                        totalStability += (r.stabilityScore || 50);
                        totalEquanimity += (r.equanimityScore || 50);
                        scoredCount++;
                    }
                });

                const total = reflections.length;
                const sortedMoods = Object.keys(counts).sort((a,b) => counts[b] - counts[a]);
                const topMood = sortedMoods[0];
                const avgFocus = scoredCount > 0 ? Math.round(totalFocus / scoredCount) : 50;
                const avgStability = scoredCount > 0 ? Math.round(totalStability / scoredCount) : 50;
                const avgEquanimity = scoredCount > 0 ? Math.round(totalEquanimity / scoredCount) : 50;

                // Build stacked horizontal spectrum bar
                let spectrumBars = '';
                sortedMoods.forEach(m => {
                    const pct = Math.round((counts[m] / total) * 100);
                    const color = MOOD_COLORS[m] || 'var(--color-accent)';
                    spectrumBars += `<div style="width:${pct}%; background:${color}; height:100%;" title="${m}: ${pct}%"></div>`;
                });

                // Build points for 2D Polarity Matrix
                let matrixPoints = '';
                reflections.slice(0, 10).forEach((r, idx) => {
                    const fX = r.focusScore !== undefined ? r.focusScore : 50;
                    const sY = r.stabilityScore !== undefined ? (100 - r.stabilityScore) : 50; // invert Y for SVG CSS top
                    const opacity = Math.max(0.3, 1 - (idx * 0.08));
                    const isLatest = idx === 0;

                    matrixPoints += `
                        <div style="position:absolute; left:${fX}%; top:${sY}%; transform:translate(-50%, -50%); width:${isLatest ? 12 : 8}px; height:${isLatest ? 12 : 8}px; border-radius:50%; background:${isLatest ? 'var(--color-accent)' : '#8b5cf6'}; opacity:${opacity}; box-shadow:0 0 ${isLatest ? 10 : 4}px ${isLatest ? 'var(--color-accent)' : '#8b5cf6'}; cursor:pointer;" title="${formatDate(r.date)}: Focus ${fX}%, Stability ${100 - sY}%"></div>
                    `;
                });

                moodContainer.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:11px; font-weight:600; color:var(--color-text-secondary);">Top State: ${MOOD_EMOJI[topMood] || '✨'} ${topMood.toUpperCase()}</span>
                        <span style="font-size:9.5px; color:var(--color-text-muted);">Focus: ${avgFocus}% • Stability: ${avgStability}% • Equanimity: ${avgEquanimity}%</span>
                    </div>
                    
                    <div style="height:8px; width:100%; background:var(--color-bg-secondary); border-radius:4px; overflow:hidden; display:flex; margin-bottom:12px;">
                        ${spectrumBars}
                    </div>

                    <!-- 2D Polarity Matrix Field -->
                    <div style="position:relative; width:100%; height:110px; background:var(--color-bg-secondary); border-radius:12px; border:1px solid rgba(0,0,0,0.05); overflow:hidden; margin-bottom:8px; padding:6px;">
                        <!-- Matrix Quadrant Crosshairs -->
                        <div style="position:absolute; left:50%; top:0; bottom:0; width:1px; background:rgba(0,0,0,0.06);"></div>
                        <div style="position:absolute; top:50%; left:0; right:0; height:1px; background:rgba(0,0,0,0.06);"></div>
                        
                        <!-- Quadrant Labels -->
                        <span style="position:absolute; top:4px; left:6px; font-size:8.5px; color:var(--color-text-muted); font-weight:600;">🍃 Ease</span>
                        <span style="position:absolute; top:4px; right:6px; font-size:8.5px; color:var(--color-accent); font-weight:700;">✨ Samadhi</span>
                        <span style="position:absolute; bottom:4px; left:6px; font-size:8.5px; color:var(--color-text-muted); font-weight:600;">💤 Drift</span>
                        <span style="position:absolute; bottom:4px; right:6px; font-size:8.5px; color:#e63946; font-weight:600;">🐝 Restless</span>
                        
                        <!-- Reflection State Nodes -->
                        ${matrixPoints}
                    </div>
                    <div style="text-align:center; font-size:9.5px; color:var(--color-text-muted);">
                        2D Mind State Matrix (Focus ↔ vs Stability ↕)
                    </div>
                `;
            }
        }

        // Reflections list — always fully rebuild to avoid stale data
        const list = container.querySelector('#reflection-list');
        list.innerHTML = '';

        if (reflections.length === 0) {
            list.innerHTML = '<p class="rfl-empty">No reflections yet. Tap Reflect above to add your first.</p>';
            return;
        }

        const MOOD_EMOJI = { calm: '😌', happy: '😊', tired: '😴', anxious: '😰', grateful: '🙏', neutral: '😐', clear: '✨', restless: '🌪️' };
        const FOCUS_LABELS = {
            wandering: '🌀 Wandering',
            unsteady: '🌊 Unsteady',
            settling: '🍃 Settling',
            focused: '🧘 Focused',
            absorbed: '✨ Absorbed'
        };
        const HINDRANCE_LABELS = {
            dullness: '💤 Sleepiness',
            restlessness: '🐝 Restlessness',
            craving: '💭 Craving',
            aversion: '⚡ Aversion',
            doubt: '❓ Doubt'
        };

        const itemsToShow = showAll ? reflections : reflections.slice(0, 3);

        itemsToShow.forEach(ref => {
            const item = document.createElement('div');
            item.className = 'rfl-item';
            const emoji = MOOD_EMOJI[ref.mood] || '😊';
            const isStandalone = !ref.duration;

            const focusBadge = ref.focusDepth
                ? `<span style="font-size:10px; font-weight:600; background:var(--color-bg-secondary); padding:2px 8px; border-radius:10px; color:var(--color-text-secondary);">${FOCUS_LABELS[ref.focusDepth] || ref.focusDepth}</span>`
                : '';

            const hindranceTags = (ref.hindrances && ref.hindrances.length > 0)
                ? `<div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:2px;">
                    ${ref.hindrances.map(h => `<span style="font-size:10px; padding:2px 6px; border-radius:8px; background:rgba(124,69,89,0.08); color:#7C4559; font-weight:500;">${HINDRANCE_LABELS[h] || h}</span>`).join('')}
                   </div>`
                : '';

            item.innerHTML = `
                <div class="rfl-item-top">
                    <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                        <span class="rfl-item-mood">${emoji}</span>
                        ${isStandalone
                            ? '<span class="rfl-item-standalone">Standalone</span>'
                            : `<span class="rfl-item-duration">${ref.duration}m sit</span>`
                        }
                        ${focusBadge}
                    </div>
                    <span class="rfl-item-date">${formatDate(ref.date)}</span>
                </div>
                ${hindranceTags}
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
