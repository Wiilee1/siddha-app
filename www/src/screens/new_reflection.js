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

        <!-- Meditation-Only State Spectrums & Orb -->
        <div id="nr-meditation-spectrums">
            <!-- Zen State Orb Preview & Polarity Descriptor -->
            <div class="nr-section" style="text-align: center; margin-bottom: 24px;">
                <div class="nr-orb-container" style="position: relative; width: 110px; height: 110px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
                    <div id="nr-state-orb" style="width: 75px; height: 75px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #8b5cf6, #6d28d9); box-shadow: 0 0 24px rgba(139, 92, 246, 0.4); transition: all 0.25s ease-out; display: flex; align-items: center; justify-content: center;">
                        <span id="nr-orb-emoji" style="font-size: 28px;">🧘</span>
                    </div>
                </div>
                <h4 id="nr-state-title" style="font-size: 15px; font-weight: 700; margin: 0 0 4px; font-family: var(--font-heading); color: var(--color-text-primary);">Focused Clarity</h4>
                <p id="nr-state-desc" class="text-sm" style="color: var(--color-text-secondary); margin: 0; font-size: 12px;">Steady Concentration & Clear Mindfulness</p>
            </div>

            <!-- Dual Polarity Spectrum Sliders -->
            <div class="nr-section">
                <h3 class="nr-section-title">Mind State Spectrums</h3>

                <!-- Slider 1: Focus Polarity -->
                <div style="margin-bottom: 16px; background: var(--color-bg-card); padding: 14px 16px; border-radius: 16px; border: 1px solid var(--color-bg-secondary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 12px; font-weight: 600; color: var(--color-text-primary);">Focus & Concentration</span>
                        <span id="nr-focus-val" style="font-size: 11px; font-weight: 700; color: var(--color-accent);">50%</span>
                    </div>
                    <input type="range" id="nr-focus-slider" min="0" max="100" value="50" style="width: 100%; accent-color: var(--color-accent); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--color-text-muted); margin-top: 6px;">
                        <span>🌀 Wandering</span>
                        <span>✨ Absorbed</span>
                    </div>
                </div>

                <!-- Slider 2: Stability & Clarity Polarity -->
                <div style="margin-bottom: 16px; background: var(--color-bg-card); padding: 14px 16px; border-radius: 16px; border: 1px solid var(--color-bg-secondary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 12px; font-weight: 600; color: var(--color-text-primary);">Stability & Clarity</span>
                        <span id="nr-stability-val" style="font-size: 11px; font-weight: 700; color: var(--color-accent);">50%</span>
                    </div>
                    <input type="range" id="nr-stability-slider" min="0" max="100" value="50" style="width: 100%; accent-color: var(--color-accent); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--color-text-muted); margin-top: 6px;">
                        <span>💤 Sleepy / Dull</span>
                        <span>☀️ Vivid / Luminous</span>
                    </div>
                </div>

                <!-- Slider 3: Equanimity & Non-Reactivity Polarity -->
                <div style="margin-bottom: 20px; background: var(--color-bg-card); padding: 14px 16px; border-radius: 16px; border: 1px solid var(--color-bg-secondary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 12px; font-weight: 600; color: var(--color-text-primary);">Equanimity & Openness</span>
                        <span id="nr-equanimity-val" style="font-size: 11px; font-weight: 700; color: var(--color-accent);">50%</span>
                    </div>
                    <input type="range" id="nr-equanimity-slider" min="0" max="100" value="50" style="width: 100%; accent-color: var(--color-accent); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--color-text-muted); margin-top: 6px;">
                        <span>⚡ Tense / Resistant</span>
                        <span>🕊️ Open / Equanimous</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mental Hindrances -->
        <div class="nr-section">
            <h3 class="nr-section-title">Mental Obstacles <span class="nr-section-tag">(optional)</span></h3>
            <div class="nr-chips-row" id="hindrances-selector">
                <div class="nr-chip nr-chip-multi" data-hindrance="dullness">💤 Sleepiness</div>
                <div class="nr-chip nr-chip-multi" data-hindrance="restlessness">🐝 Restlessness</div>
                <div class="nr-chip nr-chip-multi" data-hindrance="craving">💭 Craving</div>
                <div class="nr-chip nr-chip-multi" data-hindrance="aversion">⚡ Aversion</div>
                <div class="nr-chip nr-chip-multi" data-hindrance="doubt">❓ Doubt</div>
            </div>
        </div>

        <!-- Reflection Prompts & Notes -->
        <div class="nr-section">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h3 class="nr-section-title" style="margin:0;">Notes & Insights</h3>
                <span style="font-size:10px; color:var(--color-text-muted);">Tap prompt to insert</span>
            </div>
            <!-- Interactive Guided Prompt Chips -->
            <div class="nr-chips-row" id="guided-prompts-row" style="margin-bottom:10px;">
                <button class="nr-chip prompt-chip" data-prompt="What arose during the sit: ">💡 What arose?</button>
                <button class="nr-chip prompt-chip" data-prompt="Where was breath felt most clearly: ">🌬️ Breath anchor?</button>
                <button class="nr-chip prompt-chip" data-prompt="Tension softened in: ">🌿 Tension release?</button>
                <button class="nr-chip prompt-chip" data-prompt="Insight gained today: ">✨ Today's insight?</button>
            </div>
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

        /* Chips Section */
        .nr-section-tag { font-size: 11px; font-weight: 400; color: var(--color-text-muted); }
        .nr-chips-row {
            display: flex; flex-wrap: wrap; gap: 8px;
            margin-top: 4px;
        }
        .nr-chip {
            padding: 6px 12px;
            background: var(--color-bg-secondary);
            border: 1px solid rgba(0,0,0,0.05);
            border-radius: 20px;
            font-size: 12px; font-weight: 500;
            color: var(--color-text-secondary);
            cursor: pointer; user-select: none;
            transition: all 0.2s ease;
        }
        .nr-chip:active { transform: scale(0.95); }
        .nr-chip.active {
            background: var(--color-accent-light);
            border-color: var(--color-accent);
            color: var(--color-accent-dark);
            font-weight: 600;
        }
        .nr-chip-multi.active {
            background: rgba(124, 69, 89, 0.12);
            border-color: rgba(124, 69, 89, 0.3);
            color: #7C4559;
        }

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
    let selectedFocusDepth = 'settling';
    const selectedHindrances = new Set();
    let earnedXP = 0;

    let currentFocusScore = 50;
    let currentStabilityScore = 50;
    let currentEquanimityScore = 50;

    // Mood selector
    const moodBtns = container.querySelectorAll('.nr-mood');
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedMood = btn.dataset.mood;
        });
    });
    const defaultMood = container.querySelector('[data-mood="calm"]');
    if (defaultMood) defaultMood.classList.add('active');

    // 3-Pillar Zen State Orb & Mandala Updater
    const updateStateOrb = (focus, stability, equanimity) => {
        const focusValEl = container.querySelector('#nr-focus-val');
        const stabilityValEl = container.querySelector('#nr-stability-val');
        const equanimityValEl = container.querySelector('#nr-equanimity-val');
        const orb = container.querySelector('#nr-state-orb');
        const orbEmoji = container.querySelector('#nr-orb-emoji');
        const stateTitle = container.querySelector('#nr-state-title');
        const stateDesc = container.querySelector('#nr-state-desc');

        if (focusValEl) focusValEl.textContent = `${focus}%`;
        if (stabilityValEl) stabilityValEl.textContent = `${stability}%`;
        if (equanimityValEl) equanimityValEl.textContent = `${equanimity}%`;

        const avgScore = (focus + stability + equanimity) / 3;
        const scale = 0.75 + (avgScore / 100) * 0.55;
        const shadowBlur = 12 + Math.round((avgScore / 100) * 32);

        let grad = 'radial-gradient(circle at 30% 30%, #8b5cf6, #6d28d9)';
        let emoji = '🧘';
        let title = 'Focused Clarity';
        let desc = 'Steady Concentration & Clear Mindfulness';
        let shadowColor = 'rgba(139, 92, 246, 0.4)';

        if (equanimity >= 75 && focus >= 75 && stability >= 75) {
            grad = 'radial-gradient(circle at 30% 30%, #10b981, #047857)';
            emoji = '🕊️';
            title = 'Open Samadhi';
            desc = 'Single-Pointed Absorption & Deep Equanimity';
            shadowColor = 'rgba(16, 185, 129, 0.5)';
            selectedFocusDepth = 'absorbed';
        } else if (equanimity >= 70 && focus < 40) {
            grad = 'radial-gradient(circle at 30% 30%, #06b6d4, #0891b2)';
            emoji = '🌊';
            title = 'Equanimous Ease';
            desc = 'Open Non-Reactivity to Wandering Thoughts';
            shadowColor = 'rgba(6, 182, 212, 0.4)';
            selectedFocusDepth = 'settling';
        } else if (equanimity < 35 && focus >= 60) {
            grad = 'radial-gradient(circle at 30% 30%, #f43f5e, #be123c)';
            emoji = '⚡';
            title = 'Striving Focus';
            desc = 'Tense Concentration with Mild Resistance';
            shadowColor = 'rgba(244, 63, 94, 0.4)';
            selectedFocusDepth = 'unsteady';
        } else if (focus < 40 && stability < 40) {
            grad = 'radial-gradient(circle at 30% 30%, #f59e0b, #d97706)';
            emoji = '💤';
            title = 'Sleepy Drift';
            desc = 'Dullness & Sluggish Presence';
            shadowColor = 'rgba(245, 158, 11, 0.4)';
            selectedFocusDepth = 'wandering';
        } else if (focus >= 50 && stability >= 50) {
            grad = 'radial-gradient(circle at 30% 30%, #8b5cf6, #6d28d9)';
            emoji = '🧘';
            title = 'Focused Clarity';
            desc = 'Steady Concentration & Clear Mindfulness';
            shadowColor = 'rgba(139, 92, 246, 0.4)';
            selectedFocusDepth = 'focused';
        }

        if (orb) {
            orb.style.transform = `scale(${scale})`;
            orb.style.background = grad;
            orb.style.boxShadow = `0 0 ${shadowBlur}px ${shadowColor}`;
        }
        if (orbEmoji) orbEmoji.textContent = emoji;
        if (stateTitle) stateTitle.textContent = title;
        if (stateDesc) stateDesc.textContent = desc;
    };

    // Sliders input listeners
    const focusSlider = container.querySelector('#nr-focus-slider');
    const stabilitySlider = container.querySelector('#nr-stability-slider');
    const equanimitySlider = container.querySelector('#nr-equanimity-slider');

    if (focusSlider) {
        focusSlider.addEventListener('input', (e) => {
            currentFocusScore = parseInt(e.target.value) || 50;
            updateStateOrb(currentFocusScore, currentStabilityScore, currentEquanimityScore);
        });
    }
    if (stabilitySlider) {
        stabilitySlider.addEventListener('input', (e) => {
            currentStabilityScore = parseInt(e.target.value) || 50;
            updateStateOrb(currentFocusScore, currentStabilityScore, currentEquanimityScore);
        });
    }
    if (equanimitySlider) {
        equanimitySlider.addEventListener('input', (e) => {
            currentEquanimityScore = parseInt(e.target.value) || 50;
            updateStateOrb(currentFocusScore, currentStabilityScore, currentEquanimityScore);
        });
    }

    // Guided Prompt Chips listener
    container.querySelectorAll('#guided-prompts-row .prompt-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const promptText = btn.getAttribute('data-prompt');
            const textarea = container.querySelector('#reflection-text');
            if (textarea && promptText) {
                if (textarea.value.trim().length > 0) {
                    textarea.value += `\n${promptText}`;
                } else {
                    textarea.value = promptText;
                }
                textarea.focus();
            }
        });
    });

    // Hindrance selector (multi-select)
    const hindranceChips = container.querySelectorAll('#hindrances-selector .nr-chip');
    hindranceChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const h = chip.dataset.hindrance;
            if (selectedHindrances.has(h)) {
                selectedHindrances.delete(h);
                chip.classList.remove('active');
            } else {
                selectedHindrances.add(h);
                chip.classList.add('active');
            }
        });
    });

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
            focusDepth: selectedFocusDepth,
            focusScore: currentFocusScore,
            stabilityScore: currentStabilityScore,
            equanimityScore: currentEquanimityScore,
            hindrances: Array.from(selectedHindrances),
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
        const spectsEl = container.querySelector('#nr-meditation-spectrums');

        if (isStandalone) {
            // Hide XP celebration, meditation spectrums & orb for quick standalone reflection
            xpZone.classList.add('hidden');
            if (spectsEl) spectsEl.style.display = 'none';
            titleEl.textContent = 'Quick Reflection';
            subtitleEl.textContent = 'Capture your thoughts & mood';
        } else {
            xpZone.classList.remove('hidden');
            if (spectsEl) spectsEl.style.display = 'block';
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

            if (data.mission) {
                chip.style.display = 'inline-block';
                chip.innerHTML = `🏆 Mission: <strong>${data.mission.label}</strong> (+20 XP)`;
            } else {
                chip.style.display = 'inline-block';
                chip.innerHTML = `✨ Completed <strong>${data.duration || 10}-min</strong> meditation session`;
            }
        }

        // Reset textarea, mood, focus depth and hindrances
        container.querySelector('#reflection-text').value = '';
        moodBtns.forEach(b => b.classList.remove('active'));
        container.querySelector('[data-mood="calm"]').classList.add('active');
        selectedMood = 'calm';

        focusChips.forEach(c => c.classList.remove('active'));
        const defaultFocusChip = container.querySelector('[data-depth="settling"]');
        if (defaultFocusChip) defaultFocusChip.classList.add('active');
        selectedFocusDepth = 'settling';

        selectedHindrances.clear();
        hindranceChips.forEach(c => c.classList.remove('active'));
    };

    return container;
}
