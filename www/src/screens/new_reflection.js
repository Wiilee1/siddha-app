import { DB } from '../services/db.js';

export function renderNewReflection(onComplete) {
    const container = document.createElement('div');
    container.className = 'screen scrollable new-reflection-screen';

    container.sessionData = null; // null = standalone mode

    container.innerHTML = `
        <!-- Back button + title -->
        <div class="nr-header">
            <button class="nr-back-btn" id="nr-back-btn">
                <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <div style="text-align:center; flex:1;">
                <h1 class="nr-title" id="nr-title">Reflection</h1>
                <p class="nr-subtitle" id="nr-subtitle">How are you feeling?</p>
            </div>
            <div style="width:40px;"></div>
        </div>

        <!-- XP celebration (hidden in standalone mode) -->
        <div id="nr-xp-zone" class="nr-xp-zone">
            <div class="nr-coin-wrap">
                <div class="nr-sparkle s1">✦</div>
                <div class="nr-sparkle s2">✦</div>
                <div class="nr-sparkle s3">✦</div>
                <div class="nr-coin">
                    <div class="nr-coin-inner">
                        <span class="material-symbols-rounded" style="font-size:44px; color:var(--color-accent-dark);">eco</span>
                    </div>
                </div>
            </div>
            <h2 class="nr-xp-num">+<span id="nr-earned-xp">0</span></h2>
            <p class="nr-xp-label">Calm Points Earned</p>
            <p id="nr-mission-chip" class="nr-mission-chip" style="display:none;"></p>
        </div>

        <!-- Mood -->
        <div class="nr-section">
            <h3 class="nr-section-title">How are you feeling?</h3>
            <div class="nr-mood-row" id="mood-selector">
                <div class="nr-mood" data-mood="calm">😌<span class="nr-mood-lbl">Calm</span></div>
                <div class="nr-mood" data-mood="happy">😊<span class="nr-mood-lbl">Happy</span></div>
                <div class="nr-mood" data-mood="tired">😴<span class="nr-mood-lbl">Tired</span></div>
                <div class="nr-mood" data-mood="anxious">😰<span class="nr-mood-lbl">Anxious</span></div>
                <div class="nr-mood" data-mood="grateful">🙏<span class="nr-mood-lbl">Grateful</span></div>
                <div class="nr-mood" data-mood="neutral">😐<span class="nr-mood-lbl">Neutral</span></div>
            </div>
        </div>

        <!-- Reflection text -->
        <div class="nr-section">
            <h3 class="nr-section-title">Notes</h3>
            <textarea id="reflection-text" class="nr-textarea"
                placeholder="Write down your insights, thoughts, or feelings..."></textarea>
        </div>

        <!-- Finish -->
        <button id="finish-reflection-btn" class="btn btn-primary nr-finish-btn">
            Save Reflection
        </button>
        <div style="height:12px; flex-shrink:0;"></div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .new-reflection-screen {
            background: var(--color-bg-primary);
            padding: 14px 20px 0;
        }

        /* Header */
        .nr-header {
            flex-shrink: 0;
            display: flex; align-items: center;
            margin-bottom: 16px;
        }
        .nr-back-btn {
            width: 40px; height: 40px; border-radius: 10px;
            background: var(--color-bg-secondary); border: none;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: var(--color-text-primary); flex-shrink: 0;
        }
        .nr-back-btn .material-symbols-rounded { font-size: 20px; }
        .nr-title { font-size: 18px; font-weight: 700; margin: 0 0 2px; }
        .nr-subtitle { font-size: 12px; color: var(--color-text-muted); margin: 0; }

        /* XP zone */
        .nr-xp-zone {
            flex-shrink: 0;
            text-align: center;
            margin-bottom: 20px;
        }
        .nr-xp-zone.hidden { display: none !important; }

        .nr-coin-wrap {
            position: relative; width: 120px; height: 120px;
            margin: 0 auto 8px;
            display: flex; align-items: center; justify-content: center;
        }
        .nr-coin {
            width: 100px; height: 100px; border-radius: 50%;
            background: linear-gradient(135deg, #E6E4DA 0%, #CFCDBF 100%);
            box-shadow: inset 2px 2px 5px rgba(255,255,255,0.8),
                        inset -4px -4px 10px rgba(0,0,0,0.1),
                        0 8px 20px rgba(0,0,0,0.1);
            display: flex; align-items: center; justify-content: center;
            animation: nr-float 3s ease-in-out infinite;
        }
        .nr-coin-inner {
            width: 76px; height: 76px; border-radius: 50%;
            background: var(--color-bg-primary);
            display: flex; align-items: center; justify-content: center;
        }
        @keyframes nr-float {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-8px); }
        }
        .nr-sparkle {
            position: absolute; color: #D4AF37; font-size: 14px;
            animation: nr-twinkle 1.5s infinite alternate;
        }
        .s1 { top: 4px; left: 20px; animation-delay: 0s; }
        .s2 { top: 16px; right: 4px; font-size: 20px; animation-delay: 0.5s; }
        .s3 { bottom: 10px; left: 4px; animation-delay: 1s; }
        @keyframes nr-twinkle {
            0%   { opacity: 0.2; transform: scale(0.8); }
            100% { opacity: 1;   transform: scale(1.2); }
        }

        .nr-xp-num { font-size: 28px; font-weight: 700; margin: 0 0 2px; }
        .nr-xp-label { font-size: 12px; color: var(--color-accent-dark); font-weight: 600; margin: 0 0 6px; }
        .nr-mission-chip {
            font-size: 11px; font-weight: 600;
            background: var(--color-bg-secondary);
            padding: 4px 12px; border-radius: 12px;
            display: inline-block; margin: 0;
            border: 1px solid rgba(0,0,0,0.05);
        }

        /* Sections */
        .nr-section { flex-shrink: 0; margin-bottom: 18px; }
        .nr-section-title { font-size: 13px; font-weight: 600; margin: 0 0 10px; color: var(--color-text-secondary); }

        /* Mood row */
        .nr-mood-row {
            display: flex; gap: 8px; flex-wrap: wrap;
        }
        .nr-mood {
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            padding: 10px 12px; border-radius: 12px;
            background: var(--color-bg-secondary);
            cursor: pointer; font-size: 22px;
            border: 2px solid transparent;
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), 
                        background-color 0.2s, 
                        border-color 0.2s,
                        box-shadow 0.2s;
            flex: 1; min-width: 48px;
        }
        .nr-mood:active {
            transform: scale(0.92);
        }
        .nr-mood.active {
            border-color: var(--color-accent-dark);
            background: var(--color-accent-light);
            transform: scale(1.08);
            box-shadow: 0 4px 12px rgba(63, 82, 71, 0.12);
            animation: mood-bloom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes mood-bloom {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1.08); }
        }
        .nr-mood-lbl { font-size: 9px; font-weight: 600; color: var(--color-text-muted); transition: color 0.2s; }
        .nr-mood.active .nr-mood-lbl { color: var(--color-accent-dark); }

        /* Textarea */
        .nr-textarea {
            width: 100%; min-height: 100px;
            padding: 12px 14px;
            border-radius: 12px;
            background: var(--color-bg-secondary);
            border: 1.5px solid transparent;
            font-family: var(--font-body); font-size: 13px;
            color: var(--color-text-primary);
            resize: none; outline: none;
            box-sizing: border-box; line-height: 1.5;
            transition: border-color 0.2s;
        }
        .nr-textarea:focus { border-color: var(--color-accent); }

        /* Finish btn */
        .nr-finish-btn { 
            width: 100%; 
            flex-shrink: 0; 
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .nr-finish-btn:active {
            transform: scale(0.97);
            background-color: #1A241E;
        }
    `;
    container.appendChild(style);

    let selectedMood = 'calm';
    let earnedXP = 0;

    // Mood selector
    const moodBtns = container.querySelectorAll('.nr-mood');
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedMood = btn.dataset.mood;
        });
    });
    // Default selection
    container.querySelector('[data-mood="calm"]').classList.add('active');

    // Back button → cancel, go home or back to reflect
    container.querySelector('#nr-back-btn').addEventListener('click', () => {
        document.querySelector('[data-target="reflect"]')?.click();
    });

    // Finish
    container.querySelector('#finish-reflection-btn').addEventListener('click', () => {
        const text = container.querySelector('#reflection-text').value.trim();
        const isStandalone = !container.sessionData;

        DB.saveReflection({
            mood: selectedMood,
            text: text,
            xp: isStandalone ? 0 : earnedXP,
            duration: isStandalone ? null : (container.sessionData?.duration || null),
            standalone: isStandalone
        });

        DB.checkAndTriggerAchievements(false);

        if (onComplete) onComplete();
    });

    container.updateData = () => {
        const isStandalone = !container.sessionData;
        const xpZone = container.querySelector('#nr-xp-zone');
        const titleEl = container.querySelector('#nr-title');
        const subtitleEl = container.querySelector('#nr-subtitle');

        if (isStandalone) {
            // Hide XP celebration, simplify heading
            xpZone.classList.add('hidden');
            titleEl.textContent = 'Quick Reflection';
            subtitleEl.textContent = 'No meditation required';
        } else {
            xpZone.classList.remove('hidden');
            const data = container.sessionData;
            const durationXP = (data.duration || 10) * 5;
            earnedXP = durationXP;
            if (data.mission) {
                earnedXP += 20;
            }

            container.querySelector('#nr-earned-xp').textContent = earnedXP;
            titleEl.textContent = 'Reflection';
            subtitleEl.textContent = 'Nice work! Session complete.';

            const chip = container.querySelector('#nr-mission-chip');
            const itemNames = { acorns: '🌰 Oak Acorn', blossoms: '🌸 Sage Blossom', nectar: '🍯 Lotus Nectar' };
            const droppedItem = data.itemDropped;

            if (data.mission) {
                chip.style.display = 'inline-block';
                let html = `🏆 Mission: <strong>${data.mission.label}</strong> +20 XP`;
                if (droppedItem && itemNames[droppedItem]) {
                    html += `<br>🌟 Harvested: <strong>${itemNames[droppedItem]}</strong> + Sync Boost!`;
                }
                chip.innerHTML = html;
            } else if (droppedItem && itemNames[droppedItem]) {
                chip.style.display = 'inline-block';
                chip.innerHTML = `🌟 Completed sit in <strong>Sanctuary</strong>.<br>Harvested: <strong>${itemNames[droppedItem]}</strong> + Sync Boost!`;
            } else {
                chip.style.display = 'none';
            }
        }

        // Reset textarea and mood
        container.querySelector('#reflection-text').value = '';
        moodBtns.forEach(b => b.classList.remove('active'));
        container.querySelector('[data-mood="calm"]').classList.add('active');
        selectedMood = 'calm';
    };

    return container;
}
