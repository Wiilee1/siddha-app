import { DB } from '../services/db.js';
import { Synth } from '../services/synth.js';

export function renderBreathe(onComplete) {
    const container = document.createElement('div');
    container.className = 'screen breathe-screen';

    let START_MINUTES = 10;
    let timeLeft = START_MINUTES * 60;
    let timerInterval = null;
    let isPaused = true;
    let sessionElapsed = 0; // Track actual time elapsed for partial credit

    container.activeMission = null;

    container.innerHTML = `
        <!-- Header row -->
        <div class="bh-header">
            <button class="bh-btn" id="breathe-close-btn" aria-label="Close">
                <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <div style="text-align:center; flex:1;">
                <h2 id="breathe-screen-title" class="bh-title">Meditation</h2>
                <p id="breathe-screen-desc" class="bh-desc">Find your center</p>
            </div>
            <!-- Dev skip — always visible for now -->
            <button class="bh-btn bh-skip" id="dev-skip-btn" aria-label="Skip (dev)">
                <span class="material-symbols-rounded">fast_forward</span>
            </button>
        </div>

        <!-- Mission info banner -->
        <div id="mission-info-banner" class="bh-mission-banner" style="display:none;">
            <span class="bh-mission-tag">Active Mission</span>
            <p id="mission-info-text" class="bh-mission-text"></p>
        </div>

        <!-- Animation -->
        <div class="bh-animation">
            <div class="bh-focal">
                <div class="bh-glow"></div>
                <div class="bh-rings">
                    <div class="bh-ring r1"></div>
                    <div class="bh-ring r2"></div>
                    <div class="bh-ring r3"></div>
                </div>
                <div class="bh-core">
                    <span class="material-symbols-rounded" style="font-size:40px; color:rgba(255,255,255,0.85);">spa</span>
                </div>
            </div>
            <div id="breathe-prompt" class="bh-breathe-text" style="opacity:0;">Inhale...</div>
        </div>

        <!-- Controls area -->
        <div class="bh-controls">
            <!-- Soundscape Select + Mute Toggle -->
            <div class="bh-soundscape-container" id="soundscape-container" style="margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.7); transition: opacity 0.3s;">
                <span class="material-symbols-rounded" style="font-size:18px;">graphic_eq</span>
                <label for="ambient-sound-select">Soundscape:</label>
                <select id="ambient-sound-select" style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: white; padding: 4px 8px; font-size: 12px; cursor: pointer; outline: none; text-align: center;">
                    <option value="none" style="background:#1e2c22; color:white;">Silence</option>
                    <option value="bowls" style="background:#1e2c22; color:white;">Singing Bowls</option>
                    <option value="rain" style="background:#1e2c22; color:white;">Deep Forest Rain</option>
                    <option value="waves" style="background:#1e2c22; color:white;">Shore Waves</option>
                    <option value="drone" style="background:#1e2c22; color:white;">Cosmic Drone</option>
                </select>
                <button id="sound-mute-btn" title="Toggle sound" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: rgba(255,255,255,0.85); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background 0.2s;">
                    <span class="material-symbols-rounded" id="mute-icon" style="font-size: 18px;">volume_up</span>
                </button>
            </div>

            <!-- Preset row (hidden when running) -->
            <div class="bh-presets" id="timer-presets">
                <button class="bh-preset" data-time="5">5m</button>
                <button class="bh-preset active" data-time="10">10m</button>
                <button class="bh-preset" data-time="15">15m</button>
                <button class="bh-preset" data-time="20">20m</button>
                <button class="bh-preset" id="custom-preset-btn">Custom</button>
            </div>

            <!-- Custom input -->
            <div id="custom-timer-input-container" style="display:none; align-items:center; justify-content:center; gap:8px; margin-bottom:12px;">
                <input type="number" id="custom-minutes-input" min="1" max="120" value="30" class="bh-custom-input">
                <span style="color:rgba(255,255,255,0.65); font-size:14px;">min</span>
                <button id="set-custom-btn" class="bh-preset" style="background:rgba(255,255,255,0.25); color:white;">Set</button>
            </div>

            <!-- Big timer -->
            <div class="bh-timer-wrap">
                <h1 class="bh-timer" id="breathe-timer">10:00</h1>
                <p class="bh-timer-hint" id="bh-timer-hint" style="display:none;">Tap ⏭ to finish early</p>
            </div>

            <!-- Play / Reset / (Skip is in header) -->
            <div class="bh-main-controls">
                <button class="bh-ctrl-btn" id="reset-btn" aria-label="Reset" style="visibility:hidden;">
                    <span class="material-symbols-rounded">restart_alt</span>
                </button>
                <button class="bh-play-btn" id="play-pause-btn" aria-label="Play/Pause">
                    <span class="material-symbols-rounded" style="font-size:34px;">play_arrow</span>
                </button>
                <div style="width:48px;"></div><!-- spacer to balance reset btn -->
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        /* ---- Breathe screen ---- */
        .breathe-screen {
            background: linear-gradient(160deg, #3D5142 0%, #1E2C22 100%);
            overflow: hidden;
            justify-content: space-between;
            padding: 14px 20px 28px;
            position: relative;
        }

        /* Header */
        .bh-header {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 4px;
            padding-bottom: 4px;
        }
        .bh-btn {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.15);
            color: rgba(255,255,255,0.85);
            border-radius: 10px;
            width: 40px; height: 40px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            transition: background 0.2s;
        }
        .bh-btn:active { background: rgba(255,255,255,0.2); }
        .bh-btn .material-symbols-rounded { font-size: 20px; }
        .bh-skip { color: rgba(255,220,100,0.85); border-color: rgba(255,220,100,0.25); background: rgba(255,220,100,0.08); }

        .bh-title { font-size: 16px; font-weight: 600; color: white; margin: 0; }
        .bh-desc  { font-size: 11px; color: rgba(255,255,255,0.6); margin: 2px 0 0; }

        /* Mission banner */
        .bh-mission-banner {
            flex-shrink: 0;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.13);
            border-radius: 12px;
            padding: 10px 14px;
            margin-top: 8px;
            text-align: center;
            backdrop-filter: blur(4px);
        }
        .bh-mission-tag {
            font-size: 9px; font-weight: 700; letter-spacing: 1.2px;
            color: rgba(200,220,205,0.85); text-transform: uppercase; display: block; margin-bottom: 4px;
        }
        .bh-mission-text { font-size: 13px; color: rgba(255,255,255,0.9); margin: 0; line-height: 1.4; }

        /* Animation */
        .bh-animation {
            flex: 1; min-height: 0;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .bh-focal {
            position: relative;
            width: 200px; height: 200px;
            display: flex; align-items: center; justify-content: center;
        }
        .bh-glow {
            position: absolute; inset: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(134, 155, 143, 0.3) 0%, transparent 70%);
            animation: bh-pulse 10s cubic-bezier(0.42, 0, 0.58, 1) infinite;
        }
        @keyframes bh-pulse {
            0%, 100% { 
                transform: scale(0.72); 
                opacity: 0.45;
                background: radial-gradient(circle, rgba(63, 82, 71, 0.25) 0%, transparent 70%);
            }
            50% { 
                transform: scale(1.35); 
                opacity: 1;
                background: radial-gradient(circle, rgba(134, 155, 143, 0.5) 0%, transparent 70%);
            }
        }
        .bh-rings { position: absolute; inset: 0; }
        .bh-ring {
            position: absolute; border-radius: 50%;
            border: 1.5px solid rgba(255, 255, 255, 0.12);
            animation: bh-ring-expand 10s cubic-bezier(0.42, 0, 0.58, 1) infinite;
            animation-play-state: paused;
        }
        .r1 { inset: 0;          animation-delay: 0s; }
        .r2 { inset: -20px;      animation-delay: 1.8s; }
        .r3 { inset: -40px;      animation-delay: 3.6s; }
        @keyframes bh-ring-expand {
            0%, 100% { opacity: 0.3; transform: scale(0.85) rotate(0deg); border-color: rgba(255, 255, 255, 0.08); }
            50%      { opacity: 0.9; transform: scale(1.2) rotate(180deg); border-color: rgba(134, 155, 143, 0.35); }
        }

        .bh-breathe-text {
            margin-top: 24px;
            font-size: 18px;
            letter-spacing: 2px;
            color: rgba(255,255,255,0.8);
            font-weight: 300;
            text-align: center;
            transition: opacity 1s ease;
        }
        .bh-core {
            width: 90px; height: 90px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.25);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 30px rgba(180, 220, 195, 0.15);
            animation: bh-core-rock 10s cubic-bezier(0.42, 0, 0.58, 1) infinite;
            animation-play-state: paused;
            transition: box-shadow 0.3s;
        }
        @keyframes bh-core-rock {
            0%, 100% { transform: rotate(-8deg) scale(0.95); box-shadow: 0 0 25px rgba(63, 82, 71, 0.1); }
            50%      { transform: rotate(8deg) scale(1.08); box-shadow: 0 0 45px rgba(134, 155, 143, 0.4); }
        }

        /* Controls */
        .bh-controls {
            flex-shrink: 0;
            display: flex; flex-direction: column; align-items: center;
        }

        .bh-presets {
            display: flex; gap: 8px; flex-wrap: wrap;
            justify-content: center; margin-bottom: 12px;
            transition: opacity 0.3s;
        }
        .bh-preset {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.18);
            color: rgba(255,255,255,0.7);
            padding: 7px 15px;
            border-radius: 20px; font-size: 13px;
            cursor: pointer; transition: all 0.2s;
        }
        .bh-preset.active {
            background: rgba(255,255,255,0.28); color: white;
            border-color: rgba(255,255,255,0.5);
        }
        .bh-custom-input {
            width: 58px; text-align: center;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.3);
            color: white; padding: 7px; border-radius: 8px; font-size: 15px;
        }

        .bh-timer-wrap { text-align: center; margin-bottom: 16px; }
        .bh-timer {
            font-size: 52px; font-weight: 300; color: white;
            font-variant-numeric: tabular-nums;
            margin: 0; letter-spacing: -1px;
        }
        .bh-timer-hint { font-size: 10px; color: rgba(255,255,255,0.45); margin: 2px 0 0; }

        .bh-main-controls {
            display: flex; align-items: center;
            gap: 24px;
        }
        .bh-play-btn {
            width: 68px; height: 68px; border-radius: 50%;
            background: rgba(255,255,255,0.18);
            border: 1.5px solid rgba(255,255,255,0.3);
            color: white;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            transition: transform 0.15s, background 0.2s;
            backdrop-filter: blur(4px);
        }
        .bh-play-btn:active { transform: scale(0.93); }
        .bh-ctrl-btn {
            width: 48px; height: 48px; border-radius: 50%;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            color: rgba(255,255,255,0.7);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: background 0.2s;
        }
        .bh-ctrl-btn:active { background: rgba(255,255,255,0.18); }
        .bh-ctrl-btn .material-symbols-rounded { font-size: 22px; }
    `;
    container.appendChild(style);

    setTimeout(() => {
        const timerEl     = container.querySelector('#breathe-timer');
        const playBtn     = container.querySelector('#play-pause-btn');
        const resetBtn    = container.querySelector('#reset-btn');
        const devSkipBtn  = container.querySelector('#dev-skip-btn');
        const presetsEl   = container.querySelector('#timer-presets');
        const presetBtns  = container.querySelectorAll('.bh-preset[data-time]');
        const customBtn   = container.querySelector('#custom-preset-btn');
        const customCont  = container.querySelector('#custom-timer-input-container');
        const setCustomBtn= container.querySelector('#set-custom-btn');
        const customInput = container.querySelector('#custom-minutes-input');
        const glow        = container.querySelector('.bh-glow');
        const closeBtn    = container.querySelector('#breathe-close-btn');
        const hint        = container.querySelector('#bh-timer-hint');
        const breathePrompt = container.querySelector('#breathe-prompt');
        const muteBtn     = container.querySelector('#sound-mute-btn');
        const muteIcon    = container.querySelector('#mute-icon');
        let promptInterval = null;

        // Persist mute state across sessions
        let isMuted = localStorage.getItem('siddha_sound_muted') === 'true';
        function applyMuteState() {
            muteIcon.textContent = isMuted ? 'volume_off' : 'volume_up';
            muteBtn.style.background = isMuted ? 'rgba(255,80,80,0.25)' : 'rgba(255,255,255,0.1)';
            muteBtn.style.borderColor = isMuted ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.2)';
        }
        applyMuteState();

        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            localStorage.setItem('siddha_sound_muted', isMuted);
            applyMuteState();
            if (isMuted && !isPaused) {
                Synth.stop();
            } else if (!isMuted && !isPaused) {
                const soundType = container.querySelector('#ambient-sound-select').value;
                Synth.start(soundType);
            }
        });

        glow.style.animationPlayState = 'paused';
        container.querySelectorAll('.bh-ring').forEach(r => r.style.animationPlayState = 'paused');
        container.querySelector('.bh-core').style.animationPlayState = 'paused';

        function updateDisplay() {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            timerEl.textContent = `${m}:${s}`;
        }

        container.setTimerDuration = (mins) => {
            START_MINUTES = mins;
            timeLeft = mins * 60;
            sessionElapsed = 0;
            updateDisplay();
            const banner = container.querySelector('#mission-info-banner');
            const bannerText = container.querySelector('#mission-info-text');
            const titleEl = container.querySelector('#breathe-screen-title');
            const descEl = container.querySelector('#breathe-screen-desc');

            if (container.activeMission) {
                titleEl.textContent = container.activeMission.label;
                descEl.textContent = 'Complete the sit to finish the mission';
                presetsEl.style.display = 'none';
                banner.style.display = 'block';
                bannerText.textContent = container.activeMission.description;
            } else {
                titleEl.textContent = 'Meditation';
                descEl.textContent = 'Find your center';
                presetsEl.style.display = 'flex';
                banner.style.display = 'none';
            }
        };

        function setRunningUI(running) {
            glow.style.animationPlayState = running ? 'running' : 'paused';
            container.querySelectorAll('.bh-ring').forEach(r => r.style.animationPlayState = running ? 'running' : 'paused');
            container.querySelector('.bh-core').style.animationPlayState = running ? 'running' : 'paused';
            playBtn.querySelector('.material-symbols-rounded').textContent = running ? 'pause' : 'play_arrow';
            presetsEl.style.opacity = running ? '0' : '1';
            presetsEl.style.pointerEvents = running ? 'none' : 'auto';
            resetBtn.style.visibility = running ? 'visible' : 'hidden';
            hint.style.display = running ? 'block' : 'none';
            breathePrompt.style.opacity = running ? '1' : '0';

            const soundscapeEl = container.querySelector('#soundscape-container');
            soundscapeEl.style.opacity = running ? '0' : '1';
            soundscapeEl.style.pointerEvents = running ? 'none' : 'auto';
            
            if (!running && !container.activeMission && customBtn.classList.contains('active')) {
                customCont.style.display = 'flex';
            } else {
                customCont.style.display = 'none';
            }

            if (running) {
                let phase = 0;
                breathePrompt.textContent = "Inhale...";
                promptInterval = setInterval(() => {
                    phase = 1 - phase;
                    breathePrompt.style.opacity = '0';
                    setTimeout(() => {
                        breathePrompt.textContent = phase === 0 ? "Inhale..." : "Exhale...";
                        breathePrompt.style.opacity = '1';
                    }, 1000);
                }, 5000); // 5s inhale, 5s exhale to match the 10s animation
            } else {
                clearInterval(promptInterval);
                breathePrompt.style.opacity = '0';
            }
        }

        function stopTimer() {
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = true;
            Synth.stop();
        }

        function finishSession(minutesOverride) {
            stopTimer();
            setRunningUI(false);
            const actualMins = minutesOverride != null ? minutesOverride : START_MINUTES;
            DB.completeMeditation(actualMins);

            const activeMission = container.activeMission;
            if (activeMission) {
                DB.completeMission(
                    activeMission.nodeId,
                    activeMission.missionIndex,
                    activeMission.pathId || 'tmi'
                );
                container.activeMission = null;
            }

            const pathId = activeMission ? (activeMission.pathId || 'tmi') : (DB.getActivePath() || 'tmi');
            const itemMap = { tmi: 'acorns', vipassana: 'blossoms', zen: 'nectar' };
            const itemDropped = itemMap[pathId] || 'acorns';

            timeLeft = START_MINUTES * 60;
            sessionElapsed = 0;
            updateDisplay();

            // Play completion bell
            if (!isMuted) Synth.playSingleBell();

            if (onComplete) onComplete({ duration: actualMins, mission: activeMission, itemDropped });
        }

        // ---- Button Listeners ----

        closeBtn.addEventListener('click', () => {
            stopTimer();
            setRunningUI(false);
            container.activeMission = null;
            START_MINUTES = 10;
            timeLeft = START_MINUTES * 60;
            sessionElapsed = 0;
            updateDisplay();
            // Reset title/desc
            container.querySelector('#breathe-screen-title').textContent = 'Meditation';
            container.querySelector('#breathe-screen-desc').textContent = 'Find your center';
            container.querySelector('#mission-info-banner').style.display = 'none';
            presetsEl.style.display = 'flex';
            document.querySelector('[data-target="home"]')?.click();
        });

        resetBtn.addEventListener('click', () => {
            stopTimer();
            isPaused = true;
            timeLeft = START_MINUTES * 60;
            sessionElapsed = 0;
            updateDisplay();
            setRunningUI(false);
        });

        devSkipBtn.addEventListener('click', () => {
            if (!isPaused) {
                // Finish with elapsed time so far (min 1 min credit)
                const elapsed = Math.max(1, Math.floor(sessionElapsed / 60));
                finishSession(elapsed);
            } else {
                // Not running: just instantly finish with full duration
                finishSession(START_MINUTES);
            }
        });

        playBtn.addEventListener('click', () => {
            if (isPaused) {
                isPaused = false;
                setRunningUI(true);
                
                // Play bell and start synthesizer sound
                if (!isMuted) {
                    Synth.playSingleBell();
                    const soundType = container.querySelector('#ambient-sound-select').value;
                    Synth.start(soundType);
                }

                timerInterval = setInterval(() => {
                    timeLeft--;
                    sessionElapsed++;
                    updateDisplay();
                    if (timeLeft <= 0) finishSession(START_MINUTES);
                }, 1000);
            } else {
                stopTimer();
                setRunningUI(false);
            }
        });

        // Presets
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!isPaused) return;
                presetBtns.forEach(b => b.classList.remove('active'));
                customBtn.classList.remove('active');
                customCont.style.display = 'none';
                btn.classList.add('active');
                START_MINUTES = parseInt(btn.dataset.time);
                timeLeft = START_MINUTES * 60;
                sessionElapsed = 0;
                updateDisplay();
            });
        });

        customBtn.addEventListener('click', () => {
            if (!isPaused) return;
            presetBtns.forEach(b => b.classList.remove('active'));
            customBtn.classList.add('active');
            customCont.style.display = 'flex';
        });

        setCustomBtn.addEventListener('click', () => {
            let mins = parseInt(customInput.value);
            if (isNaN(mins) || mins < 1) mins = 1;
            START_MINUTES = mins;
            timeLeft = mins * 60;
            sessionElapsed = 0;
            updateDisplay();
            customCont.style.display = 'none';
        });

        container.updateData = () => {
            if (isPaused && sessionElapsed === 0 && !container.activeMission) {
                const user = DB.getUser();
                if (user && user.dailyCommitment) {
                    const commitmentMins = parseInt(user.dailyCommitment);
                    if (!isNaN(commitmentMins) && commitmentMins > 0) {
                        START_MINUTES = commitmentMins;
                        timeLeft = START_MINUTES * 60;
                        
                        presetBtns.forEach(btn => {
                            const btnTime = parseInt(btn.dataset.time);
                            if (btnTime === START_MINUTES) {
                                btn.classList.add('active');
                            } else {
                                btn.classList.remove('active');
                            }
                        });
                        if (customBtn) customBtn.classList.remove('active');
                        if (customCont) customCont.style.display = 'none';
                        updateDisplay();
                    }
                }
            }
        };

        updateDisplay();
    }, 0);

    return container;
}
