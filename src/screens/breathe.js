import { DB } from '../services/db.js';
import { Synth } from '../services/synth.js';
import { HapticService } from '../services/haptics.js';

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
            <div style="text-align:center; flex:1; padding:0 4px;">
                <h2 id="breathe-screen-title" class="bh-title">Meditation</h2>
                <p id="breathe-screen-desc" class="bh-desc">Find your center</p>
            </div>
            <!-- Dev skip — hidden unless developer mode is unlocked -->
            <button class="bh-btn bh-skip dev-only" id="dev-skip-btn" aria-label="Skip (dev)">
                <span class="material-symbols-rounded">fast_forward</span>
            </button>
            <div class="bh-header-spacer" style="width:40px; height:40px; flex-shrink:0;"></div>
        </div>

        <!-- Mission info banner -->
        <div id="mission-info-banner" class="bh-mission-banner" style="display:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span class="bh-mission-tag">Active Mission</span>
                <button id="clear-active-mission-btn" aria-label="Cancel Mission" style="background:rgba(255,255,255,0.15); border:none; color:rgba(255,255,255,0.85); cursor:pointer; font-size:12px; padding:2px 8px; border-radius:12px; display:flex; align-items:center; gap:2px;">
                    <span class="material-symbols-rounded" style="font-size:14px;">close</span> Exit
                </button>
            </div>
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
            <!-- Trigger Button for Intention Pop-Up Modal -->
            <div id="intention-trigger-wrap" style="margin-bottom: 12px; transition: opacity 0.3s;">
                <button id="open-intention-modal-btn" class="bh-intention-trigger-btn">
                    <span class="material-symbols-rounded" style="font-size:16px; color:#ffd166;">psychology_alt</span>
                    <span id="intention-trigger-label">Set Sit Intention (Optional)</span>
                    <span class="material-symbols-rounded" style="font-size:14px; opacity:0.6;">edit</span>
                </button>
            </div>

            <!-- Interval Bell Input + Master Session Audio Toggle -->
            <div class="bh-soundscape-container" id="soundscape-container" style="margin-bottom: 14px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 13px; color: rgba(255,255,255,0.85); transition: opacity 0.3s; flex-wrap: wrap;">
                <!-- Interval Bell Pill -->
                <div style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 4px 10px; height: 32px; box-sizing: border-box;">
                    <span class="material-symbols-rounded" style="font-size:16px; color: rgba(255,255,255,0.85);">notifications_active</span>
                    <label for="bell-interval-input" style="font-size: 12px; font-weight: 500;">Interval:</label>
                    <input type="number" id="bell-interval-input" min="0" placeholder="5" style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; padding: 2px 4px; font-size: 12px; width: 38px; text-align: center; outline: none;" value="5">
                    <span style="font-size: 12px; opacity: 0.85;">min</span>
                </div>

                <!-- Meditation Bells Toggle Button -->
                <button id="sound-mute-btn" title="Toggle meditation bells" style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; color: rgba(255,255,255,0.9); padding: 4px 12px; height: 32px; font-size: 12px; font-weight: 500; cursor: pointer; flex-shrink: 0; transition: all 0.2s; box-sizing: border-box;">
                    <span class="material-symbols-rounded" id="mute-icon" style="font-size: 16px;">volume_up</span>
                    <span id="mute-label">Bells On</span>
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
                <!-- Active Session Intention Anchor Pill (placed just above timer) -->
                <div id="active-intention-anchor" class="bh-active-intention" style="display:none;">
                    <span class="material-symbols-rounded" style="font-size:14px; color:#ffd166;">auto_awesome</span>
                    <span id="active-intention-text"></span>
                </div>

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

        <!-- Intention Pop-Up Modal Window -->
        <div id="intention-modal-overlay" class="bh-modal-overlay" style="display:none;">
            <div class="bh-modal-window">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <div>
                        <h3 style="font-size:15px; font-weight:700; font-family:var(--font-heading); color:#ffffff; margin:0 0 3px 0; display:flex; align-items:center; gap:6px;">
                            <span class="material-symbols-rounded" style="font-size:18px; color:#ffd166;">psychology_alt</span>
                            Set Sit Intention (Sankalpa)
                        </h3>
                        <p style="font-size:11px; color:rgba(255,255,255,0.7); margin:0; line-height:1.4;">
                            Ground your mind before sitting. Write your personal intention or pick an inspiration below.
                        </p>
                    </div>
                    <button id="close-intention-modal-btn" style="background:rgba(255,255,255,0.12); border:none; color:rgba(255,255,255,0.8); width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; margin-left:8px;">
                        <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                    </button>
                </div>

                <!-- Explanation Callout Box -->
                <div style="background:rgba(255, 209, 102, 0.1); border:1px solid rgba(255, 209, 102, 0.25); border-radius:12px; padding:10px 12px; margin-bottom:14px;">
                    <div style="display:flex; align-items:flex-start; gap:8px;">
                        <span class="material-symbols-rounded" style="font-size:16px; color:#ffd166; margin-top:1px; flex-shrink:0;">info</span>
                        <p style="font-size:11px; color:rgba(255,255,255,0.9); margin:0; line-height:1.45;">
                            <strong>What is a Sankalpa?</strong> A heartfelt intention formed in a calm mind. It sets a gentle direction for your sit—such as anchoring in breath or letting go of tension—without creating goals or pressure.
                        </p>
                    </div>
                </div>

                <!-- User Custom Intention Input Box ON TOP -->
                <div style="margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <label style="font-size:11px; font-weight:700; color:rgba(255,255,255,0.9); display:flex; align-items:center; gap:4px;">
                            ✍️ Your Intention
                        </label>
                        <span id="modal-clear-text-btn" style="font-size:10.5px; color:rgba(255,255,255,0.5); cursor:pointer; display:none;">Clear text</span>
                    </div>
                    <textarea id="modal-intention-input" placeholder="What is your intention or motivation for this sit?" class="bh-modal-intention-field" rows="3"></textarea>
                </div>

                <!-- Collapsible Inspiration Accordion Trigger -->
                <div style="margin-bottom:12px;">
                    <button id="modal-inspiration-toggle" style="width:100%; text-align:left; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); border-radius:12px; padding:9px 12px; color:#ffd166; font-size:11.5px; font-weight:700; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span style="display:flex; align-items:center; gap:6px;">
                            <span class="material-symbols-rounded" style="font-size:16px; color:#ffd166;">auto_awesome</span>
                            Need Inspiration? Explore Intentions
                        </span>
                        <span id="modal-inspiration-chevron" style="font-size:11px; transition:transform 0.2s;">▼</span>
                    </button>

                    <!-- Collapsible Content -->
                    <div id="modal-inspiration-body" style="display:none; flex-direction:column; gap:10px; margin-top:10px; max-height:260px; overflow-y:auto; padding-right:4px;">
                        
                        <!-- Category 1: Grounding & Calming -->
                        <div class="bh-intent-cat-group">
                            <div class="bh-intent-cat-title">🌿 Grounding & Calming</div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention for this sit is to step out of the mental chatter and anchor myself in the quiet rhythm of my breath.">
                                <div class="bh-intent-card-title">Anchor in the Breath</div>
                                <div class="bh-intent-card-sub">“Step out of mental chatter and anchor in the quiet rhythm of breath.”</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I intend to give my nervous system permission to rest, letting go of physical tightness and mental stress with every exhale.">
                                <div class="bh-intent-card-title">Nervous System Rest</div>
                                <div class="bh-intent-card-sub">“Give nervous system permission to rest, letting go of stress with every exhale.”</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I sit to create space between my emotions and my actions, so I can meet difficulty with calm rather than impulse.">
                                <div class="bh-intent-card-title">Respond, Not React</div>
                                <div class="bh-intent-card-sub">“Create space between emotions & actions, meeting difficulty with calm.”</div>
                            </div>
                        </div>

                        <!-- Category 2: Sharpening the Mind -->
                        <div class="bh-intent-cat-group">
                            <div class="bh-intent-cat-title">🧘 Sharpening the Mind</div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention is to gently bring my mind back to the breath whenever it wanders, strengthening my ability to focus.">
                                <div class="bh-intent-card-title">Single-Pointed Focus</div>
                                <div class="bh-intent-card-sub">“Gently return to breath whenever mind wanders, strengthening focus.”</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I intend to cultivate a bright, clear, and alert presence, resting in awareness without slipping into dullness or sleep.">
                                <div class="bh-intent-card-title">Bright & Alert Presence</div>
                                <div class="bh-intent-card-sub">“Cultivate bright, clear presence without slipping into dullness or sleep.”</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I sit to watch the landscape of my thoughts without getting swept up in the storylines.">
                                <div class="bh-intent-card-title">Observe Without Judgment</div>
                                <div class="bh-intent-card-sub">“Watch the landscape of thoughts without getting swept up in storylines.”</div>
                            </div>
                        </div>

                        <!-- Category 3: Openness & Acceptance -->
                        <div class="bh-intent-cat-group">
                            <div class="bh-intent-cat-title">🌊 Openness & Acceptance</div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention is to meet pleasant, unpleasant, or neutral sensations with equal openness, without trying to push or pull.">
                                <div class="bh-intent-card-title">Welcome Whatever Arises</div>
                                <div class="bh-intent-card-sub">“Meet all sensations with equal openness, without pushing or pulling.”</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I intend to treat my impatient or wandering mind with patience and kindness today, rather than criticism.">
                                <div class="bh-intent-card-title">Self-Compassion & Kindness</div>
                                <div class="bh-intent-card-sub">“Treat impatient mind with patience & kindness today, not criticism.”</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I sit to practice non-striving—releasing the need to accomplish anything and simply being as I am.">
                                <div class="bh-intent-card-title">Non-Striving & Letting Go</div>
                                <div class="bh-intent-card-sub">“Release the need to accomplish anything and simply be as I am.”</div>
                            </div>
                        </div>

                        <!-- Category 4: Insight & Connection -->
                        <div class="bh-intent-cat-group">
                            <div class="bh-intent-cat-title">✨ Insight & Connection</div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention is to sit in the spacious quiet beneath my thoughts and rest in pure awareness.">
                                <div class="bh-intent-card-title">Rest in Pure Awareness</div>
                                <div class="bh-intent-card-sub">“Sit in the spacious quiet beneath thoughts and rest in pure awareness.”</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I sit to cultivate clarity and peace within myself, so I can bring greater patience and kindness to others.">
                                <div class="bh-intent-card-title">Dedicate the Practice</div>
                                <div class="bh-intent-card-sub">“Cultivate clarity & peace so I can bring kindness to others.”</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention is to simply show up for this moment, trusting the practice one breath at a time.">
                                <div class="bh-intent-card-title">Honor the Path</div>
                                <div class="bh-intent-card-sub">“Simply show up for this moment, trusting the practice one breath at a time.”</div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Footer Action Buttons -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; gap:8px;">
                    <button id="modal-clear-intention-btn" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.18); color:rgba(255,255,255,0.7); font-size:12px; font-weight:600; padding:8px 14px; border-radius:12px; cursor:pointer;">
                        Clear
                    </button>
                    <button id="modal-save-intention-btn" style="background:linear-gradient(135deg, #ffd166, #f59e0b); border:none; color:#1a1a1a; font-size:13px; font-weight:700; padding:9px 20px; border-radius:12px; cursor:pointer; box-shadow:0 3px 12px rgba(255,209,102,0.3);">
                        Set Intention
                    </button>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        /* Intention Pop-Up Modal & Trigger Button */
        .bh-intention-trigger-btn {
            background: rgba(255, 255, 255, 0.09);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 20px;
            padding: 7px 16px;
            color: rgba(255, 255, 255, 0.85);
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            backdrop-filter: blur(4px);
            transition: all 0.2s ease;
        }
        .bh-intention-trigger-btn:active {
            transform: scale(0.96);
            background: rgba(255, 255, 255, 0.16);
        }

        .bh-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 18, 0.78);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .bh-modal-window {
            width: 100%;
            max-width: 360px;
            max-height: 85vh;
            overflow-y: auto;
            background: linear-gradient(160deg, #2D3D32 0%, #1A261D 100%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 18px 16px;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
            box-sizing: border-box;
        }

        .bh-intent-cat-group {
            display: flex; flex-direction: column; gap: 6px;
        }
        .bh-intent-cat-title {
            font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.85);
            margin: 4px 0 2px 0;
        }

        .bh-modal-intent-card {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 8px 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .bh-modal-intent-card:active {
            transform: scale(0.98);
        }
        .bh-modal-intent-card.active {
            background: rgba(255, 209, 102, 0.16);
            border-color: #ffd166;
            box-shadow: 0 0 10px rgba(255, 209, 102, 0.15);
        }
        .bh-intent-card-title {
            font-size: 11.5px;
            font-weight: 700;
            color: #ffffff;
        }
        .bh-intent-card-sub {
            font-size: 10.5px;
            color: rgba(255, 255, 255, 0.65);
            margin-top: 2px;
            line-height: 1.35;
            font-style: italic;
        }
        .bh-modal-intention-field {
            width: 100%;
            background: rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 12px;
            color: #ffffff;
            font-size: 12.5px;
            padding: 10px 12px;
            outline: none;
            box-sizing: border-box;
            font-family: inherit;
            resize: none;
            line-height: 1.4;
        }
        .bh-active-intention {
            margin: 0 auto 10px auto; font-size: 12px; font-weight: 600;
            color: rgba(255, 230, 160, 0.95); background: rgba(255, 255, 255, 0.12);
            padding: 5px 16px; border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 16px rgba(255, 209, 102, 0.2);
            display: inline-flex; align-items: center; justify-content: center; gap: 6px;
            max-width: 280px; text-align: center;
            animation: fadeIn 0.8s ease;
        }
        /* ---- Breathe screen ---- */
        .breathe-screen {
            background: linear-gradient(160deg, #3D5142 0%, #1E2C22 100%);
            overflow: hidden;
            justify-content: space-between;
            padding: calc(14px + env(safe-area-inset-top, 0px)) 20px calc(28px + env(safe-area-inset-bottom, 0px)) 20px;
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
        let lastTickTime = null;

        // Intention Modal State & Elements
        const intentionTriggerWrap = container.querySelector('#intention-trigger-wrap');
        const openModalBtn = container.querySelector('#open-intention-modal-btn');
        const triggerLabel = container.querySelector('#intention-trigger-label');
        const modalOverlay = container.querySelector('#intention-modal-overlay');
        const closeModalBtn = container.querySelector('#close-intention-modal-btn');
        const saveModalBtn = container.querySelector('#modal-save-intention-btn');
        const clearModalBtn = container.querySelector('#modal-clear-intention-btn');
        const modalCards = container.querySelectorAll('.bh-modal-intent-card');
        const modalInput = container.querySelector('#modal-intention-input');
        const modalClearTextBtn = container.querySelector('#modal-clear-text-btn');
        const inspirationToggle = container.querySelector('#modal-inspiration-toggle');
        const inspirationBody = container.querySelector('#modal-inspiration-body');
        const inspirationChevron = container.querySelector('#modal-inspiration-chevron');
        const activeIntentionAnchor = container.querySelector('#active-intention-anchor');
        const activeIntentionText = container.querySelector('#active-intention-text');

        let currentIntention = '';

        function updateTriggerButtonUI() {
            if (currentIntention) {
                const previewText = currentIntention.length > 28 ? currentIntention.slice(0, 28) + '...' : currentIntention;
                triggerLabel.textContent = `✨ Intention: "${previewText}"`;
                openModalBtn.style.borderColor = 'rgba(255,209,102,0.5)';
                openModalBtn.style.background = 'rgba(255,209,102,0.15)';
                openModalBtn.style.color = '#ffffff';
            } else {
                triggerLabel.textContent = 'Set Sit Intention (Optional)';
                openModalBtn.style.borderColor = 'rgba(255,255,255,0.18)';
                openModalBtn.style.background = 'rgba(255,255,255,0.09)';
                openModalBtn.style.color = 'rgba(255,255,255,0.85)';
            }
        }

        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                modalOverlay.style.display = 'flex';
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modalOverlay.style.display = 'none';
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) modalOverlay.style.display = 'none';
            });
        }

        if (inspirationToggle && inspirationBody) {
            inspirationToggle.addEventListener('click', () => {
                const isHidden = inspirationBody.style.display === 'none';
                inspirationBody.style.display = isHidden ? 'flex' : 'none';
                if (inspirationChevron) {
                    inspirationChevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        }

        modalCards.forEach(card => {
            card.addEventListener('click', () => {
                const fullText = card.dataset.fullintent;
                if (card.classList.contains('active')) {
                    card.classList.remove('active');
                    modalInput.value = '';
                    if (modalClearTextBtn) modalClearTextBtn.style.display = 'none';
                } else {
                    modalCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    modalInput.value = fullText;
                    if (modalClearTextBtn) modalClearTextBtn.style.display = 'inline';
                }
            });
        });

        if (modalInput) {
            modalInput.addEventListener('input', () => {
                const val = modalInput.value.trim();
                if (modalClearTextBtn) modalClearTextBtn.style.display = val ? 'inline' : 'none';
                modalCards.forEach(c => {
                    if (c.dataset.fullintent === val) {
                        c.classList.add('active');
                    } else {
                        c.classList.remove('active');
                    }
                });
            });
        }

        if (modalClearTextBtn) {
            modalClearTextBtn.addEventListener('click', () => {
                modalInput.value = '';
                modalCards.forEach(c => c.classList.remove('active'));
                modalClearTextBtn.style.display = 'none';
            });
        }

        if (clearModalBtn) {
            clearModalBtn.addEventListener('click', () => {
                currentIntention = '';
                modalInput.value = '';
                modalCards.forEach(c => c.classList.remove('active'));
                if (modalClearTextBtn) modalClearTextBtn.style.display = 'none';
                updateTriggerButtonUI();
                modalOverlay.style.display = 'none';
            });
        }

        if (saveModalBtn) {
            saveModalBtn.addEventListener('click', () => {
                currentIntention = modalInput.value.trim();
                if (currentIntention) {
                    Synth.playSankalpaHum();
                }
                updateTriggerButtonUI();
                modalOverlay.style.display = 'none';
            });
        }

        // Persist mute state across sessions
        let isMuted = localStorage.getItem('siddha_sound_meditation_muted') === 'true' || localStorage.getItem('siddha_sound_muted') === 'true';
        const muteLabel = container.querySelector('#mute-label');
        function applyMuteState() {
            muteIcon.textContent = isMuted ? 'volume_off' : 'volume_up';
            if (muteLabel) muteLabel.textContent = isMuted ? 'Bells Off' : 'Bells On';
            muteBtn.style.background = isMuted ? 'rgba(255,80,80,0.25)' : 'rgba(255,255,255,0.08)';
            muteBtn.style.borderColor = isMuted ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.15)';
            muteBtn.style.color = isMuted ? '#ffaaaa' : 'rgba(255,255,255,0.9)';
        }
        applyMuteState();

        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            localStorage.setItem('siddha_sound_muted', isMuted);
            applyMuteState();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && !isPaused && lastTickTime) {
                const now = Date.now();
                const delta = Math.floor((now - lastTickTime) / 1000);
                if (delta > 0) {
                    timeLeft = Math.max(0, timeLeft - delta);
                    sessionElapsed += delta;
                    lastTickTime += delta * 1000;
                    updateDisplay();
                    
                    // Interval bell catch up check
                    const intervalVal = parseFloat(container.querySelector('#bell-interval-input').value);
                    if (intervalVal > 0 && !isMuted) {
                        const intervalSeconds = intervalVal * 60;
                        const prevElapsed = sessionElapsed - delta;
                        const prevBoundary = Math.floor(prevElapsed / intervalSeconds);
                        const currentBoundary = Math.floor(sessionElapsed / intervalSeconds);
                        if (currentBoundary > prevBoundary && timeLeft > 0) {
                            if (!(window.Capacitor?.getPlatform() === 'android' && window.Capacitor?.Plugins?.MeditationNative)) {
                                Synth.playIntervalBell();
                            }
                        }
                    }

                    if (timeLeft <= 0) {
                        finishSession(START_MINUTES);
                    }
                }
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

        function updatePresetsState() {
            const minMins = container.activeMission ? container.activeMission.minDuration : 0;
            presetBtns.forEach(btn => {
                const t = parseInt(btn.dataset.time);
                if (isNaN(t)) return;
                if (t < minMins) {
                    btn.classList.add('disabled');
                    btn.style.opacity = '0.35';
                    btn.style.pointerEvents = 'none';
                } else {
                    btn.classList.remove('disabled');
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                }
            });
        }

        container.setTimerDuration = (mins) => {
            const minMins = container.activeMission ? container.activeMission.minDuration : 0;
            if (mins < minMins) {
                mins = minMins;
            }

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
                presetsEl.style.display = 'flex'; // Keep presets visible
                banner.style.display = 'block';
                bannerText.textContent = container.activeMission.description;
            } else {
                titleEl.textContent = 'Meditation';
                descEl.textContent = 'Find your center';
                presetsEl.style.display = 'flex';
                banner.style.display = 'none';
            }
            updatePresetsState();
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

            if (intentionTriggerWrap) {
                intentionTriggerWrap.style.opacity = running ? '0' : '1';
                intentionTriggerWrap.style.pointerEvents = running ? 'none' : 'auto';
            }

            const activeIntentionAnchor = container.querySelector('#active-intention-anchor');
            const activeIntentionText = container.querySelector('#active-intention-text');
            if (activeIntentionAnchor && activeIntentionText) {
                if (running && currentIntention) {
                    activeIntentionText.textContent = `Intention: "${currentIntention}"`;
                    activeIntentionAnchor.style.display = 'inline-flex';
                } else {
                    activeIntentionAnchor.style.display = 'none';
                }
            }
            
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

        let wakeLockSentinel = null;

        function stopTimer(isNaturalFinish = false) {
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = true;
            Synth.stop();
            Synth.stopKeepAlive();
            if (Synth.SitAudioKeepAlive) Synth.SitAudioKeepAlive.stop();

            // Stop Native Foreground Service (Android only)
            if (window.Capacitor?.getPlatform() === 'android' && window.Capacitor?.Plugins?.MeditationNative) {
                if (!isNaturalFinish) {
                    window.Capacitor.Plugins.MeditationNative.stopService().catch(() => {});
                }
            }

            if (wakeLockSentinel) {
                try { wakeLockSentinel.release(); } catch(e) {}
                wakeLockSentinel = null;
            }

            if ('mediaSession' in navigator && (!window.Synth || !window.Synth.isEndBellPlaying || !window.Synth.isEndBellPlaying())) {
                try { navigator.mediaSession.playbackState = 'paused'; } catch(e) {}
            }

            if (window.Capacitor?.Plugins?.LocalNotifications) {
                const cancelIds = Array.from({ length: 100 }, (_, i) => ({ id: 201 + i }));
                cancelIds.push({ id: 99 });
                window.Capacitor.Plugins.LocalNotifications.cancel({ notifications: cancelIds }).catch(() => {});
                window.Capacitor.Plugins.LocalNotifications.getPending().then(pending => {
                    if (pending && pending.notifications && pending.notifications.length > 0) {
                        const sitNotifs = pending.notifications.filter(n => n.id === 99 || n.id >= 201);
                        if (sitNotifs.length > 0) {
                            window.Capacitor.Plugins.LocalNotifications.cancel({ notifications: sitNotifs }).catch(() => {});
                        }
                    }
                }).catch(() => {});
            }
        }

        function finishSession(minutesOverride) {
            const isNaturalFinish = (timeLeft <= 0);
            stopTimer(isNaturalFinish);
            setRunningUI(false);
            const actualMins = minutesOverride != null ? minutesOverride : START_MINUTES;
            DB.completeMeditation(actualMins, true, currentIntention);

            const activeMission = container.activeMission;
            if (activeMission) {
                DB.completeMission(
                    activeMission.nodeId,
                    activeMission.missionIndex,
                    activeMission.pathId || 'tmi',
                    true
                );
                container.activeMission = null;
            }

            DB.checkAndTriggerAchievements(false, true);

            const pathId = activeMission ? (activeMission.pathId || 'tmi') : (DB.getActivePath() || 'tmi');
            const itemMap = { 
                tmi: 'acorns', 
                anapana: 'acorns', 
                vipassana: 'blossoms', 
                metta: 'blossoms', 
                zen: 'nectar' 
            };
            const itemDropped = itemMap[pathId] || 'acorns';

            timeLeft = START_MINUTES * 60;
            sessionElapsed = 0;
            updateDisplay();

            // Play end of meditation bell & vibration pulses ONLY on natural finish (when timer reaches 0)
            if (isNaturalFinish) {
                const isAndroidNative = window.Capacitor?.getPlatform() === 'android' && window.Capacitor?.Plugins?.MeditationNative;
                
                if (!isAndroidNative) {
                    if (!isMuted) {
                        Synth.playEndBell();
                    }
                    HapticService.vibrate('completion');
                }
            }

            if (onComplete) onComplete({ duration: actualMins, mission: activeMission, itemDropped, intention: currentIntention });
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
                
                // Play starting bell & start audio keep-alive
                if (!isMuted) {
                    Synth.primeBells();
                    // Small delay to ensure priming play() doesn't conflict with start bell play()
                    setTimeout(() => {
                        Synth.playStartBell();
                    }, 100);
                }
                Synth.ensureKeepAlive();
                if (Synth.SitAudioKeepAlive) Synth.SitAudioKeepAlive.start();

                // Request Screen WakeLock to prevent Android Doze CPU sleep
                if ('wakeLock' in navigator) {
                    navigator.wakeLock.request('screen').then(wl => {
                        wakeLockSentinel = wl;
                    }).catch(() => {});
                }

                // Start Native Foreground Service (Android only)
                if (window.Capacitor?.getPlatform() === 'android' && window.Capacitor?.Plugins?.MeditationNative) {
                    const intervalVal = parseFloat(container.querySelector('#bell-interval-input').value) || 0;
                    window.Capacitor.Plugins.MeditationNative.startService({
                        intervalSeconds: isMuted ? 0 : Math.floor(intervalVal * 60),
                        totalSeconds: timeLeft
                    }).catch(e => console.error('[Breathe] Native service error:', e));
                }

                // MediaSession Keep-Alive
                if ('mediaSession' in navigator) {
                    try {
                        navigator.mediaSession.metadata = new MediaMetadata({
                            title: 'Meditation Sit 🧘',
                            artist: 'Siddha',
                            album: 'Mindfulness Practice'
                        });
                        navigator.mediaSession.playbackState = 'playing';
                    } catch(e) {}
                }

                // Ensure notification permissions are requested/granted for the Foreground Service
                if (window.Capacitor?.Plugins?.LocalNotifications) {
                    window.Capacitor.Plugins.LocalNotifications.requestPermissions().catch(() => {});
                }

                lastTickTime = Date.now();
                timerInterval = setInterval(() => {
                    const now = Date.now();
                    const delta = Math.floor((now - lastTickTime) / 1000);
                    if (delta > 0) {
                        timeLeft = Math.max(0, timeLeft - delta);
                        sessionElapsed += delta;
                        lastTickTime += delta * 1000;
                        updateDisplay();

                        // Play interval bell every X minutes if set
                        const intervalVal = parseFloat(container.querySelector('#bell-interval-input').value);
                        if (intervalVal > 0 && !isMuted) {
                            const intervalSeconds = intervalVal * 60;
                            const prevElapsed = sessionElapsed - delta;
                            const prevBoundary = Math.floor(prevElapsed / intervalSeconds);
                            const currentBoundary = Math.floor(sessionElapsed / intervalSeconds);
                            if (currentBoundary > prevBoundary && timeLeft > 0) {
                                if (!(window.Capacitor?.getPlatform() === 'android' && window.Capacitor?.Plugins?.MeditationNative)) {
                                    Synth.playIntervalBell();
                                }
                            }
                        }

                        if (timeLeft <= 0) finishSession(START_MINUTES);
                    }
                }, 500); // Check every 500ms for high responsiveness
            } else {
                stopTimer();
                setRunningUI(false);
            }
        });

        // Clear mission button listener
        const clearMissionBtn = container.querySelector('#clear-active-mission-btn');
        if (clearMissionBtn) {
            clearMissionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                container.activeMission = null;
                container.querySelector('#mission-info-banner').style.display = 'none';
                container.querySelector('#breathe-screen-title').textContent = 'Meditation';
                container.querySelector('#breathe-screen-desc').textContent = 'Find your center';
                updatePresetsState();
            });
        }

        // Presets
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!isPaused) return;
                if (btn.classList.contains('disabled')) return; // Disable clicking muted/disabled buttons

                presetBtns.forEach(b => b.classList.remove('active'));
                customBtn.classList.remove('active');
                customCont.style.display = 'none';
                btn.classList.add('active');
                START_MINUTES = parseInt(btn.dataset.time);
                timeLeft = START_MINUTES * 60;
                sessionElapsed = 0;
                updateDisplay();
                updatePresetsState();
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

            // Restrict duration if an active mission is loaded
            const minMins = container.activeMission ? container.activeMission.minDuration : 0;
            if (mins < minMins) {
                alert(`This mission requires at least a ${minMins}-minute sit. Duration adjusted to ${minMins} minutes.`);
                mins = minMins;
                customInput.value = minMins;
            }

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
            updatePresetsState();
        };

        updateDisplay();
    }, 0);

    return container;
}
