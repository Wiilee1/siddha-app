import { DB } from '../services/db.js';

export function startOnboardingTutorial(onComplete) {
    // Prevent creating multiple overlays
    if (document.getElementById('onboarding-tutorial-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'onboarding-tutorial-overlay';
    overlay.className = 'tu-overlay';

    let currentStep = 1;
    let timerInterval = null;
    let timeLeft = 60;
    let timerRunning = false;
    let selectedPath = 'anapana';

    overlay.innerHTML = `
        <div class="tu-card">
            <!-- Step 1: Introduction -->
            <div class="tu-slide active" data-step="1">
                <div class="tu-mascot-container">
                    <img src="./src/assets/logo.png" alt="Siddha Mascot" class="tu-mascot">
                </div>
                <h2 class="tu-title">Welcome, Traveler</h2>
                <p class="tu-text">
                    I am <strong>Siddha</strong>, your companion on this path. Together, we will walk the path inward to train attention, quiet the mind, and find clarity.
                </p>
                <button class="btn btn-primary tu-btn-next" data-next="2" style="margin-top: 24px;">Begin Journey</button>
            </div>

            <!-- Step 2: Choose Path -->
            <div class="tu-slide" data-step="2">
                <h2 class="tu-title" style="font-size: 18px; margin-bottom: 4px;">Choose Your Starting Path</h2>
                <p class="tu-subtitle" style="margin-bottom: 12px;">This path will be unlocked instantly. You can switch anytime.</p>
                
                <div class="tu-options-list">
                    <div class="tu-option-card active" data-path="anapana">
                        <div class="tu-option-icon"><span class="material-symbols-rounded">air</span></div>
                        <div class="tu-option-info">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h4 class="tu-option-label">Calm (Anapana)</h4>
                                <span class="tu-difficulty-tag low">Low</span>
                            </div>
                            <p class="tu-option-desc">Focus strictly on natural breath sensations. Best for beginners.</p>
                        </div>
                    </div>
                    <div class="tu-option-card" data-path="metta">
                        <div class="tu-option-icon"><span class="material-symbols-rounded">favorite</span></div>
                        <div class="tu-option-info">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h4 class="tu-option-label">Kindness (Metta)</h4>
                                <span class="tu-difficulty-tag low">Low</span>
                            </div>
                            <p class="tu-option-desc">Heart-centered phrases to cultivate boundless goodwill and empathy.</p>
                        </div>
                    </div>
                    <div class="tu-option-card" data-path="vipassana">
                        <div class="tu-option-icon"><span class="material-symbols-rounded">water_drop</span></div>
                        <div class="tu-option-info">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h4 class="tu-option-label">Insight (Vipassana)</h4>
                                <span class="tu-difficulty-tag high">High</span>
                            </div>
                            <p class="tu-option-desc">Observe physical body scan sensations to learn non-reactivity.</p>
                        </div>
                    </div>
                    <div class="tu-option-card" data-path="tmi">
                        <div class="tu-option-icon"><span class="material-symbols-rounded">local_florist</span></div>
                        <div class="tu-option-info">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h4 class="tu-option-label">Focus (TMI)</h4>
                                <span class="tu-difficulty-tag medium">Medium</span>
                            </div>
                            <p class="tu-option-desc">Structured 10-stage attention training. Excellent for mental discipline.</p>
                        </div>
                    </div>
                    <div class="tu-option-card" data-path="zen">
                        <div class="tu-option-icon"><span class="material-symbols-rounded">circle</span></div>
                        <div class="tu-option-info">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h4 class="tu-option-label">Stillness (Zen)</h4>
                                <span class="tu-difficulty-tag high">High</span>
                            </div>
                            <p class="tu-option-desc">Radical silent presence (Shikantaza). Choiceless open awareness.</p>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary tu-btn-next" id="tu-select-path-btn" data-next="3" style="margin-top: 14px;">Confirm & Unlock Path</button>
            </div>

            <!-- Step 3: First Meditation (Counting Sit) -->
            <div class="tu-slide" data-step="3">
                <div class="tu-mascot-container small">
                    <img src="./src/assets/logo.png" alt="Siddha Mascot" class="tu-mascot">
                </div>
                <h2 class="tu-title">Your First Meditation</h2>
                <p class="tu-text" id="tu-timer-instruction" style="font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
                    Let us sit for a simple 1-minute meditation. 
                    <br><br>
                    <strong>Anchor</strong>: Close your eyes, settle into your body, and observe your breath. At the end of each exhalation, silently count <strong>"one"</strong>, then <strong>"two"</strong>, up to ten. If your mind wanders, gently return to one.
                </p>

                <!-- Timer Display -->
                <div class="tu-timer-container">
                    <div class="tu-timer" id="tu-timer-display">01:00</div>
                    <p class="tu-timer-prompt" id="tu-timer-prompt" style="font-size: 12px; color: var(--color-accent-dark); height: 16px; margin: 4px 0 0 0; font-style: italic; font-weight: 500;"></p>
                </div>

                <!-- Timer Controls -->
                <button class="btn btn-primary" id="tu-timer-btn" style="margin-top: 16px;">Begin Sit</button>
                <button class="btn btn-secondary hidden" id="tu-timer-skip-btn" style="margin-top: 8px; font-size: 11px; padding: 4px 12px;">Skip to End</button>
            </div>

            <!-- Step 4: Practice Completed! -->
            <div class="tu-slide" data-step="4">
                <div class="tu-mascot-container">
                    <img src="./src/assets/logo.png" alt="Siddha Mascot" class="tu-mascot">
                </div>
                <h2 class="tu-title">Practice Completed!</h2>
                <p class="tu-text">
                    Well done. You have successfully completed your first sit and earned <strong>+75 XP</strong>!
                </p>
                <button class="btn btn-primary" id="tu-claim-xp-btn" style="margin-top: 24px; width: 100%;">Claim Rewards</button>
            </div>

            <!-- Step 5: Journey Map & Node -->
            <div class="tu-slide" data-step="5">
                <p class="tu-text" style="font-size: 13px; line-height: 1.5; margin-bottom: 8px; text-align: left;">
                    🗺️ <strong>The Journey Map</strong>: Here is your progressive path.
                    <br>
                    <span style="color:var(--color-accent-dark); font-weight:700;">👉 Try it:</span> Tap the highlighted pulsing node on the map above to inspect its missions!
                </p>
                <button class="btn btn-secondary" id="tu-journey-fallback-btn" style="font-size: 11px; padding: 2px 10px; width:100%; margin-top: 4px;">Skip Map Tour</button>
            </div>

            <!-- Step 5.5: Mission Selection inside Modal (Flipped to Top) -->
            <div class="tu-slide" data-step="55">
                <p class="tu-text" style="font-size: 13px; line-height: 1.5; margin-bottom: 8px; text-align: left;">
                    🎯 <strong>Meditation Missions</strong>: Each node contains sequential challenges.
                    <br>
                    <span style="color:var(--color-accent-dark); font-weight:700;">👉 Try it:</span> Tap the first mission card below to load it onto the meditation timer!
                </p>
                <button class="btn btn-secondary" id="tu-mission-fallback-btn" style="font-size: 11px; padding: 2px 10px; width:100%; margin-top: 4px;">Skip Mission Select</button>
            </div>

            <!-- Step 6: Breathe Timer Page (Flipped to Top) -->
            <div class="tu-slide" data-step="6">
                <p class="tu-text" style="font-size: 13px; line-height: 1.5; margin-bottom: 8px; text-align: left;">
                    ⏱️ <strong>Meditate Timer</strong>: The mission's minimum duration is loaded.
                    <br>
                    You can choose a <strong>longer preset</strong>, or enter a custom duration (minimum required sits are enforced). Customize your bell chimes and tap Play when ready.
                </p>
                <button class="btn btn-primary" id="tu-breathe-next-btn" style="padding: 6px 12px; font-size: 12px; width:100%; margin-top: 4px;">Next: Wisdom Library</button>
            </div>

            <!-- Step 7: The Wisdom Library -->
            <div class="tu-slide" data-step="7">
                <p class="tu-text" style="font-size: 13px; line-height: 1.5; margin-bottom: 8px; text-align: left;">
                    📖 <strong>Wisdom & Lineages</strong>: Access guidebooks and posture tips.
                    <br>
                    <span style="color:var(--color-accent-dark); font-weight:700;">👉 Try it:</span> Tap the highlighted article to open and read lineage insights!
                </p>
                <button class="btn btn-secondary" id="tu-wisdom-fallback-btn" style="font-size: 11px; padding: 2px 10px; width:100%; margin-top: 4px;">Skip Wisdom</button>
            </div>

            <!-- Step 7.5: Reading Wisdom Article (Flipped to Top) -->
            <div class="tu-slide" data-step="75">
                <p class="tu-text" style="font-size: 13px; line-height: 1.5; margin-bottom: 8px; text-align: left;">
                    🌿 <strong>Wisdom Reader</strong>: Review techniques offline to guide your sitting sessions.
                    <br>
                    Once done, tap the back arrow or **Mark as Read** to earn <strong>+25 XP</strong> and complete the tour.
                </p>
                <button class="btn btn-secondary" id="tu-wisdom-skip-reader-btn" style="font-size: 11px; padding: 2px 10px; width:100%; margin-top: 4px;">Skip Reader</button>
            </div>

            <!-- Step 8: Outro -->
            <div class="tu-slide" data-step="8">
                <div class="tu-mascot-container">
                    <img src="./src/assets/logo.png" alt="Siddha Mascot" class="tu-mascot">
                </div>
                <h2 class="tu-title">Your Sanctuary Awaits</h2>
                <p class="tu-text">
                    You are now ready to explore the <strong>Journey Map</strong>, complete daily quests, and delve into teachings. Take a deep breath and step inside.
                </p>
                <button class="btn btn-primary" id="tu-finish-btn" style="margin-top: 28px; padding: 16px 40px; font-size: 16px; width: 100%;">Enter Sanctuary</button>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .tu-overlay {
            position: fixed;
            inset: 0;
            background: rgba(30, 44, 34, 0.65);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.4s ease;
            transition: background var(--transition-normal);
        }

        /* Non-intrusive spotlight positioning: dims screen but lets clicks pass through */
        .tu-overlay.spotlight-bottom, .tu-overlay.spotlight-top {
            background: none;
            pointer-events: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            width: 0;
            height: 0;
            overflow: visible;
            inset: auto;
        }

        .tu-card {
            background-color: var(--color-bg-primary);
            border-radius: var(--radius-lg);
            padding: 24px;
            width: 100%;
            max-width: 380px;
            box-shadow: var(--shadow-lg), 0 10px 40px rgba(0,0,0,0.15);
            border: 1px solid rgba(255,255,255,0.7);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            pointer-events: auto; /* Elements inside card remain clickable */
            transition: all var(--transition-normal);
        }

        .tu-overlay.spotlight-bottom .tu-card {
            position: fixed;
            bottom: 85px; /* Floats right above bottom nav */
            top: auto;
            left: 16px;
            right: 16px;
            width: auto;
            max-width: none;
            padding: 12px 18px;
            border-radius: var(--radius-md);
            background: rgba(246, 248, 246, 0.96);
            border: 1px solid rgba(134, 155, 143, 0.4);
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
        }

        .tu-overlay.spotlight-top .tu-card {
            position: fixed;
            top: 75px; /* Floats at the top of the screen */
            bottom: auto;
            left: 16px;
            right: 16px;
            width: auto;
            max-width: none;
            padding: 12px 18px;
            border-radius: var(--radius-md);
            background: rgba(246, 248, 246, 0.96);
            border: 1px solid rgba(134, 155, 143, 0.4);
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
        }

        .tu-slide {
            width: 100%;
            display: none;
            flex-direction: column;
            align-items: center;
            animation: slideIn 0.3s ease;
        }

        .tu-slide.active {
            display: flex;
        }

        .tu-mascot-container {
            width: 100px;
            height: 100px;
            margin-bottom: 16px;
            border-radius: 50%;
            background-color: var(--color-bg-secondary);
            border: 2px solid var(--color-accent-light);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
        }

        .tu-mascot-container.small {
            width: 50px;
            height: 50px;
            margin-bottom: 8px;
        }

        .tu-mascot {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .tu-title {
            font-family: var(--font-heading);
            font-size: 20px;
            font-weight: 600;
            color: var(--color-text-primary);
            margin: 0 0 10px 0;
        }

        .tu-subtitle {
            font-size: 12px;
            color: var(--color-text-secondary);
            margin: 0 0 16px 0;
        }

        .tu-text {
            font-size: 14px;
            color: var(--color-text-secondary);
            line-height: 1.6;
            margin: 0;
        }

        /* Options for 5 paths */
        .tu-options-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
            max-height: 290px;
            overflow-y: auto;
            padding-right: 2px;
        }

        .tu-option-card {
            background-color: white;
            border: 1px solid rgba(134, 155, 143, 0.2);
            border-radius: var(--radius-md);
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            text-align: left;
            cursor: pointer;
            box-shadow: var(--shadow-xs);
            transition: all var(--transition-fast);
        }

        .tu-option-card.active {
            border-color: var(--color-accent-dark);
            background-color: rgba(134, 155, 143, 0.08);
            border-width: 2px;
        }

        .tu-option-icon {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-sm);
            background-color: var(--color-bg-secondary);
            color: var(--color-accent-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .tu-option-card.active .tu-option-icon {
            background-color: var(--color-accent-dark);
            color: white;
        }

        .tu-option-info {
            flex: 1;
            min-width: 0;
        }

        .tu-option-label {
            font-size: 13px;
            font-weight: 600;
            margin: 0;
            color: var(--color-text-primary);
        }

        .tu-option-desc {
            font-size: 10px;
            color: var(--color-text-muted);
            margin: 1px 0 0 0;
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .tu-difficulty-tag {
            font-size: 9px;
            font-weight: bold;
            padding: 1px 5px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .tu-difficulty-tag.low { background: rgba(83,163,98,0.15); color: #2e693b; }
        .tu-difficulty-tag.medium { background: rgba(226,184,87,0.18); color: #8e681c; }
        .tu-difficulty-tag.high { background: rgba(211,47,47,0.12); color: #c62828; }

        /* Timer UI */
        .tu-timer-container {
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-md);
            width: 100%;
            padding: 16px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
            margin-top: 12px;
        }

        .tu-timer {
            font-size: 40px;
            font-weight: 700;
            color: var(--color-text-primary);
            font-family: monospace;
            line-height: 1;
        }

        /* Pulsing Glow Effect for highlighted components */
        @keyframes tu-glow-pulse {
            0% { box-shadow: 0 0 0 0 rgba(83, 163, 98, 0.8); }
            70% { box-shadow: 0 0 0 15px rgba(83, 163, 98, 0); }
            100% { box-shadow: 0 0 0 0 rgba(83, 163, 98, 0); }
        }

        .tu-highlight-ring {
            animation: tu-glow-pulse 1.6s infinite !important;
            outline: 3px solid var(--color-accent-dark) !important;
            outline-offset: 4px !important;
            border-radius: 50% !important;
            position: relative !important;
            z-index: 600 !important;
            pointer-events: auto !important;
        }

        .tu-highlight-ring-rect {
            animation: tu-glow-pulse 1.6s infinite !important;
            outline: 3px solid var(--color-accent-dark) !important;
            outline-offset: 4px !important;
            border-radius: var(--radius-md) !important;
            position: relative !important;
            z-index: 600 !important;
            pointer-events: auto !important;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.getElementById('app').appendChild(overlay);

    // Wire up path selection clicks
    const pathCards = overlay.querySelectorAll('.tu-option-card');
    pathCards.forEach(card => {
        card.addEventListener('click', () => {
            pathCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedPath = card.dataset.path;
        });
    });

    overlay.querySelector('#tu-select-path-btn').addEventListener('click', () => {
        DB.setActivePath(selectedPath);
        DB.unlockPath(selectedPath); // Unlock chosen path instantly
        goToStep(3);
    });

    // Step 3: Timer Logics
    const timerBtn = overlay.querySelector('#tu-timer-btn');
    const timerDisplay = overlay.querySelector('#tu-timer-display');
    const timerPrompt = overlay.querySelector('#tu-timer-prompt');
    const timerSkipBtn = overlay.querySelector('#tu-timer-skip-btn');
    const timerInstruction = overlay.querySelector('#tu-timer-instruction');

    const prompts = [
        "Quietly count each exhalation...",
        "If thoughts arise, just return to 'one'...",
        "Anchor your focus in your posture...",
        "Settle into this present moment...",
        "Ten counts, then restart from one..."
    ];

    timerBtn.addEventListener('click', () => {
        if (!timerRunning) {
            timerRunning = true;
            timerBtn.textContent = 'Pause';
            timerBtn.classList.remove('btn-primary');
            timerBtn.classList.add('btn-secondary');
            timerSkipBtn.classList.remove('hidden');
            timerInstruction.style.opacity = '0.5';

            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();

                if (timeLeft % 12 === 0) {
                    timerPrompt.textContent = prompts[Math.floor(Math.random() * prompts.length)];
                    timerPrompt.style.opacity = 1;
                } else if (timeLeft % 12 === 10) {
                    timerPrompt.style.opacity = 0;
                }

                if (timeLeft <= 0) {
                    completeMeditation();
                }
            }, 1000);
        } else {
            timerRunning = false;
            clearInterval(timerInterval);
            timerBtn.textContent = 'Resume Sit';
            timerBtn.classList.remove('btn-secondary');
            timerBtn.classList.add('btn-primary');
        }
    });

    timerSkipBtn.addEventListener('click', () => {
        completeMeditation();
    });

    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function completeMeditation() {
        clearInterval(timerInterval);
        timerRunning = false;
        goToStep(4);
    }

    // Step 4: Claim rewards
    overlay.querySelector('#tu-claim-xp-btn').addEventListener('click', () => {
        DB.addXP(75);
        goToStep(5);
    });

    // Step 5: Journey Fallback
    overlay.querySelector('#tu-journey-fallback-btn').addEventListener('click', () => {
        cleanupJourneySpotlight();
        goToStep(6);
    });

    function cleanupJourneySpotlight() {
        const circle = document.querySelector('.path-node .node-circle');
        if (circle) {
            circle.classList.remove('tu-highlight-ring');
        }
    }

    // Step 5.5: Mission Fallback
    overlay.querySelector('#tu-mission-fallback-btn').addEventListener('click', () => {
        cleanupMissionSpotlight();
        goToStep(6);
    });

    function cleanupMissionSpotlight() {
        const item = document.querySelector('#modal-missions-list .mission-item');
        if (item) {
            item.classList.remove('tu-highlight-ring-rect');
        }
    }

    // Step 6: Breathe Next Button
    overlay.querySelector('#tu-breathe-next-btn').addEventListener('click', () => {
        cleanupBreatheSpotlight();
        goToStep(7);
    });

    function cleanupBreatheSpotlight() {
        const presets = document.querySelector('#timer-presets');
        if (presets) {
            presets.classList.remove('tu-highlight-ring-rect');
        }
    }

    // Step 7: Wisdom Fallback
    overlay.querySelector('#tu-wisdom-fallback-btn').addEventListener('click', () => {
        cleanupWisdomSpotlight();
        goToStep(8);
    });

    function cleanupWisdomSpotlight() {
        const card = document.querySelector('.wd-card.unlocked');
        if (card) {
            card.classList.remove('tu-highlight-ring-rect');
        }
    }

    // Step 7.5: Wisdom Reader finished fallback
    overlay.querySelector('#tu-wisdom-skip-reader-btn').addEventListener('click', () => {
        cleanupReaderEvents();
        goToStep(8);
    });

    let readerInterval = null;
    function cleanupReaderEvents() {
        clearInterval(readerInterval);
    }

    // Step 8: Finish Outro
    overlay.querySelector('#tu-finish-btn').addEventListener('click', () => {
        DB.completeTutorial();
        overlay.remove();
        cleanupDelegatedEvents();
        if (onComplete) onComplete();
    });

    // Event Delegation: Robust event listeners attached to document to capture clicks instantly without race conditions
    const onDocumentClick = (e) => {
        if (currentStep === 5) {
            // Did they click a journey node?
            const node = e.target.closest('.path-node');
            if (node) {
                cleanupJourneySpotlight();
                goToStep(55);
            }
        } else if (currentStep === 55) {
            // Did they click a mission item inside modal?
            const item = e.target.closest('#modal-missions-list .mission-item');
            if (item) {
                cleanupMissionSpotlight();
                goToStep(6);
            }
        } else if (currentStep === 7) {
            // Did they click an unlocked wisdom article card?
            const card = e.target.closest('.wd-card.unlocked');
            if (card) {
                cleanupWisdomSpotlight();
                goToStep(75);
            }
        } else if (currentStep === 75) {
            // Did they click the Complete Reading and Claim XP button?
            const completeBtn = e.target.closest('#wd-complete-btn');
            if (completeBtn) {
                // Auto-progress by simulating close button click after they claim their XP
                setTimeout(() => {
                    document.querySelector('#wd-reader-close')?.click();
                }, 400);
            }
        }
    };

    document.addEventListener('click', onDocumentClick);

    function cleanupDelegatedEvents() {
        document.removeEventListener('click', onDocumentClick);
    }

    // Navigation slides transitions
    function goToStep(step) {
        currentStep = step;
        
        // Reset overlay spotlight styles
        overlay.className = 'tu-overlay';
        cleanupJourneySpotlight();
        cleanupMissionSpotlight();
        cleanupBreatheSpotlight();
        cleanupWisdomSpotlight();
        cleanupReaderEvents();

        if (currentStep === 5) {
            // Take user to Journey tab
            document.querySelector('.bottom-nav [data-target="journey"]')?.click();
            overlay.classList.add('spotlight-bottom'); // Node is at top, card at bottom

            // Highlight the node circle as soon as it renders
            let tries = 0;
            const interval = setInterval(() => {
                const circle = document.querySelector('.path-node .node-circle');
                if (circle) {
                    circle.classList.add('tu-highlight-ring');
                    clearInterval(interval);
                }
                if (++tries > 20) clearInterval(interval);
            }, 50);
        } else if (currentStep === 55) {
            overlay.classList.add('spotlight-top'); // Missions modal is at bottom, flip card to top!

            // Highlight first mission inside modal
            let tries = 0;
            const interval = setInterval(() => {
                const item = document.querySelector('#modal-missions-list .mission-item');
                if (item) {
                    item.classList.add('tu-highlight-ring-rect');
                    clearInterval(interval);
                }
                if (++tries > 20) clearInterval(interval);
            }, 50);
        } else if (currentStep === 6) {
            overlay.classList.add('spotlight-top'); // Breathe presets/controls are in lower half, flip card to top!

            // Highlight presets row
            let tries = 0;
            const interval = setInterval(() => {
                const presets = document.querySelector('#timer-presets');
                if (presets) {
                    presets.classList.add('tu-highlight-ring-rect');
                    clearInterval(interval);
                }
                if (++tries > 20) clearInterval(interval);
            }, 50);
        } else if (currentStep === 7) {
            // Navigate to Wisdom Library
            window.dispatchEvent(new CustomEvent('siddha-navigate', { detail: { target: 'wisdom' } }));
            overlay.classList.add('spotlight-bottom'); // Article cards are at the top, card at bottom is perfect

            // Highlight first unlocked article
            let tries = 0;
            const interval = setInterval(() => {
                const card = document.querySelector('.wd-card.unlocked');
                if (card) {
                    card.classList.add('tu-highlight-ring-rect');
                    clearInterval(interval);
                }
                if (++tries > 20) clearInterval(interval);
            }, 50);
        } else if (currentStep === 75) {
            overlay.classList.add('spotlight-top'); // Reader content is long, flip card to top to avoid blocking "Mark as Read" at bottom

            // Monitor reader modal close to progress to Step 8
            readerInterval = setInterval(() => {
                const reader = document.querySelector('#wd-reader-modal');
                if (!reader || !reader.classList.contains('active')) {
                    cleanupReaderEvents();
                    goToStep(8);
                }
            }, 300);
        } else if (currentStep === 8) {
            document.querySelector('#wd-reader-close')?.click();
            document.querySelector('.bottom-nav [data-target="home"]')?.click();
        }

        overlay.querySelectorAll('.tu-slide').forEach(slide => {
            const num = parseInt(slide.dataset.step);
            if (num === currentStep) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    overlay.querySelectorAll('.tu-btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            goToStep(nextStep);
        });
    });
}
