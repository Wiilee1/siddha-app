import { DB, xpInCurrentLevel } from '../services/db.js';

// All meditation paths
const PATHS = {
    anapana: {
        id: 'anapana',
        label: 'Anapana',
        shortLabel: 'Anapana',
        unlockLevel: 1,
        difficulty: 'Low',
        bgImage: './src/assets/anapana_bg.jpg',
        accentColor: '#705E39',
        nodeAccent: 'rgba(112,94,57,0.15)',
        icon: 'air',
        description: 'Mindfulness of breathing to build concentration',
        nodes: [
            {
                id: 1, label: 'Natural Respiration', subtitle: 'Breath', icon: 'air',
                description: 'Observe the flow of the breath just as it is, without trying to control it.',
                xPct: 45, yPct: 8,
                missions: [
                    { text: 'Sit and observe the touch of the breath at the nostrils.', duration: 10 },
                    { text: 'Notice if the breath is long or short.', duration: 12 },
                    { text: 'Complete a 15-minute natural breath sit.', duration: 15 }
                ]
            },
            {
                id: 2, label: 'The Touchpoint', subtitle: 'Sensation', icon: 'pin_drop',
                description: 'Narrow your focus to the exact area where the breath touches: the upper lip or nostrils.',
                xPct: 60, yPct: 26,
                missions: [
                    { text: 'Locate the exact spot of touch inside the nostrils.', duration: 15 },
                    { text: 'Detect the difference in touch between inhale and exhale.', duration: 15 },
                    { text: 'Sit for 20 minutes maintaining focus on the touchpoint.', duration: 20 }
                ]
            },
            {
                id: 3, label: 'Cool & Warm', subtitle: 'Temperature', icon: 'thermostat',
                description: 'Note the changing temperature of the air as it enters and leaves your body.',
                xPct: 40, yPct: 44,
                missions: [
                    { text: 'Notice the cool air entering the nostrils on inhale.', duration: 15 },
                    { text: 'Notice the warm air exiting on the exhale.', duration: 15 },
                    { text: 'Maintain thermal awareness for a full 25-minute sit.', duration: 25 }
                ]
            },
            {
                id: 4, label: 'Subtle Breath', subtitle: 'Calm', icon: 'waves',
                description: 'As your mind settles, the breath becomes extremely soft, shallow, and quiet. Follow it closely.',
                xPct: 58, yPct: 62,
                missions: [
                    { text: 'Notice the breath becoming very shallow or faint.', duration: 20 },
                    { text: 'Observe the brief gap between the in-breath and out-breath.', duration: 20 },
                    { text: 'Keep single-pointed attention on the faint breath for 30 minutes.', duration: 30 }
                ]
            },
            {
                id: 5, label: 'Absorption', subtitle: 'Ekaggata', icon: 'brightness_5',
                description: 'Mind and breath merge. Focus is effortless and steady, preparing you for deeper insight.',
                xPct: 46, yPct: 80,
                missions: [
                    { text: 'Sit for 20 minutes with zero wandering of attention.', duration: 20 },
                    { text: 'Let go of the effort to concentrate; rest in the focus.', duration: 25 },
                    { text: 'Complete a 30-minute silent concentration session.', duration: 30 }
                ]
            }
        ]
    },
    metta: {
        id: 'metta',
        label: 'Metta',
        shortLabel: 'Metta',
        unlockLevel: 2,
        difficulty: 'Low',
        bgImage: './src/assets/metta_bg.jpg',
        accentColor: '#7C4559',
        nodeAccent: 'rgba(124,69,89,0.15)',
        icon: 'favorite',
        description: 'Loving-kindness to build compassion and dissolve aversion',
        nodes: [
            {
                id: 1, label: 'Self-Compassion', subtitle: 'Self', icon: 'person',
                description: 'Direct wishes of safety, happiness, and peace toward yourself.',
                xPct: 46, yPct: 8,
                missions: [
                    { text: 'Silently repeat: "May I be happy, may I be peaceful."', duration: 10 },
                    { text: 'Notice any internal resistance or self-criticism and release it.', duration: 15 },
                    { text: 'Cultivate a feeling of warmth in your chest area.', duration: 15 },
                    { text: 'Sit for 20 minutes sending metta to yourself.', duration: 20 }
                ]
            },
            {
                id: 2, label: 'The Guide', subtitle: 'Gratitude', icon: 'school',
                description: 'Direct loving-kindness to someone who has guided, helped, or inspired you.',
                xPct: 59, yPct: 26,
                missions: [
                    { text: 'Bring to mind a mentor or teacher and smile internally.', duration: 15 },
                    { text: 'Wish them: "May you be free from suffering, may you be peaceful."', duration: 15 },
                    { text: 'Observe the feeling of gratitude arising in your heart.', duration: 20 },
                    { text: 'Dedicate a 20-minute sit to your benefactor.', duration: 20 }
                ]
            },
            {
                id: 3, label: 'The Stranger', subtitle: 'Friendliness', icon: 'people',
                description: 'Direct loving-kindness to someone you see regularly but do not know personally.',
                xPct: 42, yPct: 44,
                missions: [
                    { text: 'Recall the face of a cashier, neighbor, or driver.', duration: 15 },
                    { text: 'Acknowledge: "Just like me, they wish to be happy."', duration: 15 },
                    { text: 'Wish them: "May you be safe, may you live with ease."', duration: 20 },
                    { text: 'Maintain focus on the neutral person for a 25-minute sit.', duration: 25 }
                ]
            },
            {
                id: 4, label: 'The Difficult Person', subtitle: 'Pardon', icon: 'healing',
                description: 'Gently direct loving-kindness to someone with whom you have minor friction or conflict.',
                xPct: 61, yPct: 62,
                missions: [
                    { text: 'Bring to mind a person with mild friction (avoid major trauma at first).', duration: 15 },
                    { text: 'Observe physical tightness in your body and breathe into it.', duration: 20 },
                    { text: 'Wish them peace: "May you be happy, may we be free from conflict."', duration: 20 },
                    { text: 'Sit for 30 minutes holding the difficult person in kindness.', duration: 30 }
                ]
            },
            {
                id: 5, label: 'Universal Goodwill', subtitle: 'Boundless', icon: 'public',
                description: 'Extend your heart outward to all directions, covering all living beings everywhere.',
                xPct: 48, yPct: 80,
                missions: [
                    { text: 'Radiate metta to your room, your building, and your city.', duration: 20 },
                    { text: 'Extend the field of love to the entire country and continent.', duration: 25 },
                    { text: 'Radiate boundless goodwill to all creatures, seen and unseen.', duration: 25 },
                    { text: 'Abide in the ocean of universal loving-kindness for 40 minutes.', duration: 40 }
                ]
            }
        ]
    },
    vipassana: {
        id: 'vipassana',
        label: 'Vipassana',
        shortLabel: 'Vipassana',
        unlockLevel: 3,
        difficulty: 'High',
        bgImage: './src/assets/vipassana_bg.jpg',
        accentColor: '#1A4A5A',
        nodeAccent: 'rgba(26,74,90,0.15)',
        icon: 'water_drop',
        description: 'Ancient insight practice through body scanning',
        nodes: [
            {
                id: 1, label: 'Body Scan', subtitle: 'Foundation', icon: 'accessibility_new',
                description: 'Learn to feel sensation as pure energy, not concept.',
                xPct: 48, yPct: 8,
                missions: [
                    { text: 'Scan slowly from crown of head to feet without reacting.', duration: 15 },
                    { text: 'Note gross sensations: heat, tingling, pressure.', duration: 15 },
                    { text: 'Scan in both directions, top-to-bottom and bottom-to-top.', duration: 20 },
                    { text: 'Sit for 30 minutes with continuous scanning.', duration: 30 }
                ]
            },
            {
                id: 2, label: 'Impermanence', subtitle: 'Anicca', icon: 'change_circle',
                description: 'Observe that every sensation arises and passes away.',
                xPct: 58, yPct: 26,
                missions: [
                    { text: 'Label each sensation: "arising" or "passing".', duration: 20 },
                    { text: 'Notice a pleasant sensation dissolve without craving.', duration: 20 },
                    { text: 'Notice an unpleasant sensation dissolve without aversion.', duration: 25 },
                    { text: 'Rest in the space between sensations.', duration: 25 }
                ]
            },
            {
                id: 3, label: 'Subtle Body', subtitle: 'Deeper Scan', icon: 'vibration',
                description: 'Move beyond gross sensations to subtle vibrations.',
                xPct: 40, yPct: 44,
                missions: [
                    { text: 'Scan an area of the body that feels "blank" or numb.', duration: 20 },
                    { text: 'Notice the subtle vibration of aliveness beneath stillness.', duration: 25 },
                    { text: 'Scan the entire body as a field of vibration.', duration: 25 },
                    { text: 'Maintain equanimity for an entire 30-minute scan.', duration: 30 }
                ]
            },
            {
                id: 4, label: 'Equanimity', subtitle: 'Non-Reaction', icon: 'balance',
                description: 'Neither craving nor aversion — pure observation.',
                xPct: 58, yPct: 62,
                missions: [
                    { text: 'Sit with discomfort for 5 minutes without shifting.', duration: 15 },
                    { text: 'Smile internally at both pleasant and painful sensations.', duration: 20 },
                    { text: 'Observe an intense sensation with complete stillness.', duration: 25 },
                    { text: 'Dedicate a full sit to metta — loving kindness.', duration: 30 }
                ]
            },
            {
                id: 5, label: 'Insight', subtitle: 'Vipassana', icon: 'remove_red_eye',
                description: 'Direct insight into the three characteristics of experience.',
                xPct: 48, yPct: 80,
                missions: [
                    { text: 'Notice anicca (impermanence) in every breath cycle.', duration: 25 },
                    { text: 'Notice dukkha (unsatisfactoriness) — nothing fully satisfies.', duration: 25 },
                    { text: 'Notice anatta (no-self) — who is observing the observer?', duration: 30 },
                    { text: 'Sit for 45 minutes with continuous insight observation.', duration: 45 }
                ]
            }
        ]
    },
    tmi: {
        id: 'tmi',
        label: 'The Mind Illuminated',
        shortLabel: 'TMI',
        unlockLevel: 4,
        difficulty: 'Medium',
        bgImage: './src/assets/journey_bg.jpg',
        accentColor: '#3F5247',
        nodeAccent: 'rgba(63,82,71,0.15)',
        icon: 'local_florist',
        description: 'Systematic 10-stage framework for deep concentration',
        nodes: [
            {
                id: 1, label: 'Establishing a Practice', subtitle: 'Practice', icon: 'event_seat',
                description: 'Before mastering the mind, you must master your schedule.',
                xPct: 44, yPct: 8,
                missions: [
                    { text: 'Set a non-negotiable time & space for your practice.', duration: 10 },
                    { text: 'Sit for a realistic baseline of 15–20 minutes.', duration: 15 },
                    { text: 'Overcome the initial wave of procrastination.', duration: 15 },
                    { text: 'Establish a streak of 3 consecutive daily sits.', duration: 20 }
                ]
            },
            {
                id: 2, label: 'Interrupted Attention & Mind-Wandering', subtitle: 'Attention', icon: 'psychology',
                description: 'Transition consciously into the practice to stabilize focus.',
                xPct: 62, yPct: 26,
                missions: [
                    { text: 'Review your motivations before each sit.', duration: 15 },
                    { text: 'Set a specific, bite-sized goal for this session.', duration: 15 },
                    { text: 'Perform a mental inventory of current worries.', duration: 20 },
                    { text: 'Adjust posture and alignment for comfort.', duration: 20 }
                ]
            },
            {
                id: 3, label: 'Extended Continuity & Forgetting', subtitle: 'Continuity', icon: 'anchor',
                description: 'Anchor yourself in the space around you.',
                xPct: 38, yPct: 44,
                missions: [
                    { text: 'Maintain broad awareness of the present moment.', duration: 15 },
                    { text: 'Focus solely on raw physical sensations.', duration: 20 },
                    { text: 'Restrict attention to bodily sensations.', duration: 20 },
                    { text: 'Develop grounding in physical support and gravity.', duration: 20 }
                ]
            },
            {
                id: 4, label: 'Continuous Attention & Gross Distraction', subtitle: 'Focus', icon: 'center_focus_strong',
                description: 'Move focus from broad body sensations to the breath.',
                xPct: 60, yPct: 62,
                missions: [
                    { text: 'Observe the somatic rises and falls of breathing.', duration: 20 },
                    { text: 'Find and appreciate a pleasant quality in the breath.', duration: 20 },
                    { text: 'Narrow attention to the tip of the nose.', duration: 25 },
                    { text: 'Observe breath patterns passively without control.', duration: 25 }
                ]
            },
            {
                id: 5, label: 'Overcoming Subtle Dullness', subtitle: 'Dullness', icon: 'visibility',
                description: 'Use mental count markers to bridge focus when distracted.',
                xPct: 44, yPct: 80,
                missions: [
                    { text: 'Silently count "one" at the end of the out-breath.', duration: 20 },
                    { text: 'Maintain counting cycles up to ten.', duration: 20 },
                    { text: 'Restart counting calmly from one if mind wanders.', duration: 25 },
                    { text: 'Intentionally drop counting to sit in pure silence.', duration: 30 }
                ]
            }
        ]
    },
    zen: {
        id: 'zen',
        label: 'Zen',
        shortLabel: 'Zen',
        unlockLevel: 5,
        difficulty: 'High',
        bgImage: './src/assets/zen_bg.jpg',
        accentColor: '#3A3228',
        nodeAccent: 'rgba(58,50,40,0.15)',
        icon: 'circle',
        description: "Just sitting — shikantaza and open awareness",
        nodes: [
            {
                id: 1, label: "Beginner's Mind", subtitle: 'Shoshin', icon: 'child_care',
                description: 'Approach each sit as if for the very first time.',
                xPct: 50, yPct: 8,
                missions: [
                    { text: 'Sit without any goal or technique — just be present.', duration: 15 },
                    { text: 'Notice and release every expectation that arises.', duration: 20 },
                    { text: 'Observe the mind that wants to "do it right".', duration: 20 },
                    { text: 'Sit for 30 minutes with nothing to achieve.', duration: 30 }
                ]
            },
            {
                id: 2, label: 'Just Sitting', subtitle: 'Shikantaza', icon: 'airline_seat_recline_normal',
                description: 'Pure sitting — presence without object.',
                xPct: 55, yPct: 27,
                missions: [
                    { text: 'Sit with eyes half-open, gaze soft on the floor.', duration: 20 },
                    { text: 'Do not follow the breath — let it breathe itself.', duration: 20 },
                    { text: 'When a thought arises, do not grab it or push it away.', duration: 25 },
                    { text: 'Maintain shikantaza for a full 40 minutes.', duration: 40 }
                ]
            },
            {
                id: 3, label: 'Breath Koan', subtitle: 'MU', icon: 'help_outline',
                description: 'Use the question "What is this?" as your anchor.',
                xPct: 44, yPct: 45,
                missions: [
                    { text: 'Silently ask "What is this?" on each exhale.', duration: 20 },
                    { text: 'Don\'t answer — let the question hang open.', duration: 20 },
                    { text: 'Notice the space before a thought forms.', duration: 25 },
                    { text: 'Sit for 35 minutes with the koan.', duration: 35 }
                ]
            },
            {
                id: 4, label: 'Open Awareness', subtitle: 'Choiceless', icon: 'all_inclusive',
                description: 'Rest in awareness itself, without narrowing attention.',
                xPct: 55, yPct: 63,
                missions: [
                    { text: 'Include all sounds, sensations, and thoughts equally.', duration: 20 },
                    { text: 'Let awareness be the ocean, thoughts the waves.', duration: 25 },
                    { text: 'Notice the awareness that is aware of awareness.', duration: 30 },
                    { text: 'Sit for 45 minutes in pure choiceless awareness.', duration: 45 }
                ]
            },
            {
                id: 5, label: 'No-Self', subtitle: 'Anatta', icon: 'person_off',
                description: 'Who is the one who is sitting?',
                xPct: 50, yPct: 82,
                missions: [
                    { text: 'Ask: "Who is aware?" — sit with the question.', duration: 25 },
                    { text: 'Notice: is there a "you" behind your thoughts?', duration: 30 },
                    { text: 'Rest in the not-knowing — what is here without a self?', duration: 35 },
                    { text: 'Sit for 60 minutes: the final recognition.', duration: 60 }
                ]
            }
        ]
    }
};

export function renderJourney() {
    const container = document.createElement('div');
    container.className = 'screen journey-screen';

    container.innerHTML = `
        <!-- Fixed header -->
        <div class="jh-header">
            <div style="flex: 1; min-width: 0;">
                <h1 class="jh-title">Your Journey</h1>
                <p class="jh-subtitle" style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin: 0;">
                    <span id="j-path-subtitle">Loading...</span>
                    <span id="j-path-learn-more" style="color: var(--color-accent-dark); font-weight: 700; cursor: pointer; text-decoration: underline; font-size: 11px; display: inline-flex; align-items: center; gap: 2px;">Learn More <span class="material-symbols-rounded" style="font-size:12px; font-variation-settings: 'FILL' 1;">info</span></span>
                </p>
            </div>
            <!-- Level bar -->
            <div class="jh-level-pill" id="j-level-pill">
                <span class="material-symbols-rounded" style="font-size:14px; color:var(--color-accent-dark);">local_florist</span>
                <span id="j-level-text" style="font-size:12px; font-weight:600;">Lv.1</span>
            </div>
        </div>

        <!-- XP bar -->
        <div class="jh-xp-row">
            <div class="jh-xp-track">
                <div class="jh-xp-fill" id="j-xp-bar"></div>
            </div>
            <span class="jh-xp-label" id="j-xp-label">0 / 500 XP</span>
        </div>

        <!-- Path selector tabs -->
        <div class="jh-path-tabs" id="path-tab-bar">
            <!-- Injected by JS -->
        </div>

        <!-- Scrollable map — only this scrolls -->
        <div class="jh-map-scroll" id="journey-map-scroll">
            <div class="jh-map-inner" id="journey-map-inner">
                <!-- Nodes injected here -->
            </div>
        </div>

        <!-- Daily quest pinned at bottom -->
        <div class="jh-quest-bar" id="journey-quest-bar" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
            <div>
                <p class="jh-quest-title">Daily Quest <span style="color: var(--color-accent-dark); font-weight: 700; margin-left: 6px;">(+25 XP)</span></p>
                <p class="jh-quest-sub" id="journey-quest-sub">Meditate for 20 minutes</p>
            </div>
            <div class="jh-xp-badge" id="journey-quest-badge" style="transition: all 0.2s;">+25 XP</div>
        </div>

        <!-- Mission modal -->
        <div id="mission-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-top-row">
                    <div style="flex:1;">
                        <h2 id="modal-title" class="modal-title"></h2>
                        <p id="modal-subtitle" class="modal-sub"></p>
                        <p id="modal-desc" class="modal-desc"></p>
                    </div>
                    <button id="modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                <div id="modal-missions-list" class="modal-mission-list"></div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        /* ---- Journey screen ---- */
        .journey-screen {
            overflow: hidden;
            padding: calc(14px + env(safe-area-inset-top, 0px)) 16px 48px;
            background-size: cover;
            background-position: center top;
            background-repeat: no-repeat;
            transition: background-image 0.4s ease-in-out;
        }

        /* Add a gradient overlay to the whole screen for readability */
        .journey-screen::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(244,243,237,0.85) 0%, rgba(244,243,237,0.3) 150px, rgba(244,243,237,0.1) 100%);
            z-index: 0;
            pointer-events: none;
        }

        .jh-header, .jh-xp-row, .jh-path-tabs, .jh-map-scroll, .jh-quest-bar {
            position: relative;
            z-index: 1;
        }

        /* Header */
        .jh-header {
            flex-shrink: 0;
            display: flex; justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 6px;
        }
        .jh-title { font-size: 20px; font-weight: 700; margin: 0 0 2px; font-family: var(--font-heading); }
        .jh-subtitle { font-size: 11px; color: var(--color-text-muted); margin: 0; }
        .jh-level-pill {
            display: flex; align-items: center; gap: 4px;
            background: var(--color-accent-light); border-radius: 20px;
            padding: 4px 10px; flex-shrink: 0;
        }

        /* XP row */
        .jh-xp-row {
            flex-shrink: 0;
            display: flex; align-items: center; gap: 8px;
            margin-bottom: 10px;
        }
        .jh-xp-track {
            flex: 1; height: 5px;
            background: var(--color-bg-secondary); border-radius: 3px; overflow: hidden;
        }
        .jh-xp-fill {
            height: 100%; width: 0%;
            background: var(--color-accent-dark); border-radius: 3px;
            transition: width 0.4s;
        }
        .jh-xp-label { font-size: 10px; color: var(--color-text-muted); white-space: nowrap; flex-shrink: 0; }

        /* Path tabs */
        .jh-path-tabs {
            flex-shrink: 0;
            display: flex; gap: 6px;
            margin-bottom: 10px;
            overflow-x: auto;
            scrollbar-width: none;
        }
        .jh-path-tabs::-webkit-scrollbar { display: none; }
        .jh-tab {
            display: flex; align-items: center; gap: 5px;
            padding: 6px 12px; border-radius: 20px;
            border: 1.5px solid var(--color-bg-secondary);
            background: var(--color-bg-card);
            cursor: pointer; white-space: nowrap;
            transition: all 0.2s; flex-shrink: 0;
            font-size: 12px; font-weight: 500;
            color: var(--color-text-muted);
        }
        .jh-tab.active {
            border-color: var(--color-accent-dark);
            color: var(--color-accent-dark);
            background: var(--color-accent-light);
        }
        .jh-tab.locked {
            opacity: 0.55; cursor: default;
        }
        .jh-tab .material-symbols-rounded { font-size: 14px; }

        /* ---- MAP AREA: only this scrolls ---- */
        .jh-map-scroll {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .jh-map-inner {
            width: 100%;
            min-height: 600px;
            position: relative;
            overflow: hidden;
        }

        /* Locked overlay */
        .jh-map-locked-overlay {
            position: absolute; inset: 0;
            z-index: 10;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 10px;
            background: rgba(240,236,230,0.82);
            backdrop-filter: blur(3px);
            border-radius: 14px;
        }
        .jh-map-locked-overlay .material-symbols-rounded { font-size: 40px; color: #9A8F83; }
        .jh-map-locked-overlay p { font-size: 14px; font-weight: 600; color: #6B6059; margin: 0; }
        .jh-map-locked-overlay span.lk-sub { font-size: 11px; color: #9A8F83; }

        /* Nodes */
        .path-node {
            position: absolute;
            display: flex; flex-direction: column; align-items: center; gap: 5px;
            transform: translate(-50%, -50%);
            cursor: pointer; z-index: 2;
            transition: transform 0.2s;
        }
        .path-node:active { transform: translate(-50%, -50%) scale(0.9); }
        .path-node.locked { cursor: default; }

        .node-circle {
            width: 48px; height: 48px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            background: rgba(255,255,255,0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 2px solid rgba(255,255,255,0.7);
            transition: all 0.3s;
        }
        .path-node.locked .node-circle {
            background: rgba(230,225,218,0.3);
            box-shadow: none; border-color: rgba(230,225,218,0.5);
        }
        .path-node.completed .node-circle {
            background: rgba(83, 163, 98, 0.85);
            border-color: rgba(83, 163, 98, 1);
        }
        .path-node.completed .node-circle .material-symbols-rounded { color: white; }
        .path-node.current .node-circle {
            width: 56px; height: 56px;
            background: rgba(255,255,255,0.9);
            border: 3px solid var(--color-accent-dark);
            box-shadow: 0 0 0 7px rgba(63,82,71,0.18), 0 4px 16px rgba(0,0,0,0.22);
        }
        .node-circle .material-symbols-rounded { font-size: 22px; color: var(--color-accent-dark); }
        .path-node.current .node-circle .material-symbols-rounded { font-size: 28px; }

        .node-label {
            font-size: 10px; font-weight: 700;
            color: var(--color-text-primary);
            background: rgba(255,255,255,0.9);
            padding: 2px 8px; border-radius: 6px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            white-space: nowrap;
            backdrop-filter: blur(2px);
        }

        .node-pulse {
            position: absolute;
            width: 74px; height: 74px; border-radius: 50%;
            background: rgba(63,82,71,0.14);
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: -1; animation: node-pulse 2.5s infinite;
        }
        @keyframes node-pulse {
            0%   { transform: translate(-50%, -50%); opacity: 0.8; }
            50%  { transform: translate(-50%, -50%); opacity: 0; }
            100% { transform: translate(-50%, -50%); opacity: 0.8; }
        }

        /* Quest bar */
        .jh-quest-bar {
            flex-shrink: 0;
            display: flex; justify-content: space-between; align-items: center;
            padding: 9px 14px;
            background: var(--color-bg-card);
            border-radius: 14px;
            margin-top: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .jh-quest-title { font-size: 12px; font-weight: 600; margin: 0 0 2px; color: var(--color-text-primary); }
        .jh-quest-sub   { font-size: 11px; color: var(--color-text-muted); margin: 0; }
        .jh-xp-badge {
            background: var(--color-accent-light); color: var(--color-accent-dark);
            padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 700;
        }
        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 4px rgba(226, 184, 87, 0.4); }
            50%      { box-shadow: 0 0 12px rgba(226, 184, 87, 0.8); }
        }

        /* Modal */
        .modal-overlay {
            position: fixed; inset: 0;
            background: rgba(20,28,23,0.45);
            backdrop-filter: blur(6px);
            z-index: 300;
            display: flex; align-items: flex-end;
            opacity: 0; visibility: hidden;
            transition: opacity 0.25s, visibility 0.25s;
        }
        .modal-overlay.active { opacity: 1; visibility: visible; }
        .modal-content {
            background: var(--color-bg-card);
            width: 100%; max-width: 480px;
            margin: 0 auto;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            padding: 22px 20px 40px;
            transform: translateY(100%);
            transition: transform 0.35s cubic-bezier(0.15,0.85,0.35,1);
            box-shadow: 0 -6px 30px rgba(0,0,0,0.12);
            max-height: 80vh;
            overflow-y: auto;
        }
        .modal-overlay.active .modal-content { transform: translateY(0); }
        .modal-top-row {
            display: flex; justify-content: space-between;
            align-items: flex-start; margin-bottom: 16px;
        }
        .modal-title { font-size: 18px; font-weight: 700; margin: 0 0 3px; }
        .modal-sub { font-size: 11px; color: var(--color-text-muted); margin: 0 0 6px; }
        .modal-desc { font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.45; }
        .modal-close-btn {
            background: var(--color-bg-secondary); border: none; cursor: pointer;
            border-radius: 50%; width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center;
            color: var(--color-text-muted); flex-shrink: 0; margin-left: 10px;
        }
        .modal-mission-list { display: flex; flex-direction: column; gap: 8px; }

        /* Mission items */
        .mission-item {
            display: flex; align-items: flex-start; gap: 10px;
            padding: 12px 14px;
            background: var(--color-bg-secondary);
            border-radius: 12px;
            cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
        }
        .mission-item:active { transform: scale(0.98); }
        .mission-item.completed { opacity: 0.6; cursor: default; }
        .mission-item.completed:active { transform: none; }
        .m-check {
            width: 22px; height: 22px; border-radius: 6px;
            border: 2px solid var(--color-text-muted);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; margin-top: 1px;
        }
        .m-check .material-symbols-rounded { font-size: 14px; color: transparent; }
        .mission-item.completed .m-check {
            background: var(--color-accent-dark);
            border-color: var(--color-accent-dark);
        }
        .mission-item.completed .m-check .material-symbols-rounded { color: white; }
        .m-body { flex: 1; }
        .m-text { font-size: 13px; line-height: 1.4; color: var(--color-text-primary); margin: 0; }
        .mission-item.completed .m-text { text-decoration: line-through; color: var(--color-text-muted); }
        .m-meta { font-size: 10px; color: var(--color-text-muted); margin: 3px 0 0; }
        .m-badge {
            font-size: 10px; font-weight: 700;
            color: var(--color-accent-dark);
            background: rgba(134,155,143,0.15);
            padding: 3px 8px; border-radius: 10px; flex-shrink: 0; align-self: center;
        }
    `;
    container.appendChild(style);

    // State
    let activePathId = DB.getActivePath();

    // Modal
    const modal = container.querySelector('#mission-modal');
    container.querySelector('#modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        container.updateData();
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { modal.classList.remove('active'); container.updateData(); }
    });

    container.querySelector('#j-path-learn-more').addEventListener('click', () => {
        const path = PATHS[activePathId];
        openPathInfoModal(path);
    });

    function openPathInfoModal(path) {
        const title = container.querySelector('#modal-title');
        const subtitle = container.querySelector('#modal-subtitle');
        const desc = container.querySelector('#modal-desc');
        const list = container.querySelector('#modal-missions-list');

        title.innerHTML = `${path.label} <span style="font-size:12px; font-weight:bold; padding: 3px 8px; border-radius:10px; margin-left: 8px; background:${path.accentColor}20; color:${path.accentColor}; border: 1px solid ${path.accentColor}40;">Difficulty: ${path.difficulty}</span>`;
        subtitle.textContent = "Lineage & Practical Insights";
        
        let detailsHtml = '';
        if (path.id === 'anapana') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> Anapana is the classic Buddhist practice of mindfulness of breathing. It is the foundation for almost all meditation traditions.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> Rest your focus entirely on the physical touch of air at the rims of your nostrils or upper lip. Notice temperature, friction, and movement without following the breath into the body.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Builds sharp sensory clarity, calms the central nervous system, and prepares the mind for deep analytical body scanning.</p>
            `;
        } else if (path.id === 'vipassana') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> Vipassana translates to "insight" — seeing things as they truly are. It is the heart of Theravada mindfulness lineages.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> Systematically scan physical body sensations from head to toe, observing them with total equanimity. You will observe impermanence (anicca) and non-reaction.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Reprograms the brain to stop reacting with craving or aversion to physical triggers, freeing you from deep-seated habit patterns.</p>
            `;
        } else if (path.id === 'tmi') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> The Mind Illuminated (TMI) is a modern, highly systematic master guide that integrates classical teachings with cognitive science.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> A 10-stage progressive path focused on balancing attention (selecting specific details) with peripheral awareness (keeping track of the background environment).</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Eliminates dullness, stops mind-wandering, and establishes stable, effortless attention through structured metrics.</p>
            `;
        } else if (path.id === 'metta') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> Metta is loving-kindness or goodwill. It is a heart-centered concentration technique rather than analytical scanning.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> Silently repeat phrases of protection, happiness, and peace toward yourself, then expand the circle to a mentor, a dear friend, a neutral stranger, a difficult person, and eventually all living beings.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Actively dissolves anger, builds empathy, increases emotional resilience, and softens self-criticism.</p>
            `;
        } else if (path.id === 'zen') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> Zen (Zazen) meditation comes from East Asian Mahayana traditions. It is the ultimate practice of non-doing and radical presence.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> Direct your eyes downwards, sit with open awareness (Shikantaza — "just sitting"), and allow thoughts to arise and pass without any effort to hold or reject them.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Directly reveals the spacious, non-dual nature of consciousness itself, dissolving the illusion of a separate self.</p>
            `;
        }

        desc.innerHTML = detailsHtml;
        list.innerHTML = ''; // No missions list in the info modal
        modal.classList.add('active');
    }



    function triggerQuestSplash() {
        const bar = container.querySelector('#journey-quest-bar');
        const rect = bar.getBoundingClientRect();
        const parent = container;
        const parentRect = parent.getBoundingClientRect();

        const x = rect.left + rect.width / 2 - parentRect.left;
        const y = rect.top + rect.height / 2 - parentRect.top;

        for (let i = 0; i < 15; i++) {
            const p = document.createElement('span');
            p.className = 'material-symbols-rounded';
            p.textContent = 'eco';
            p.style.position = 'absolute';
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            p.style.fontSize = '20px';
            p.style.color = '#e2b857';
            p.style.pointerEvents = 'none';
            p.style.zIndex = '300';
            p.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';

            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 120;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist - 80;

            parent.appendChild(p);
            setTimeout(() => {
                p.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
                p.style.opacity = '0';
            }, 10);
            setTimeout(() => p.remove(), 1200);
        }
    }

    function openModal(node, path) {
        container.querySelector('#modal-title').textContent = node.label;
        container.querySelector('#modal-subtitle').textContent = `${path.label} · ${node.subtitle}`;
        container.querySelector('#modal-desc').textContent = node.description;

        const list = container.querySelector('#modal-missions-list');
        list.innerHTML = '';
        node.missions.forEach((mission, idx) => {
            const done = DB.isMissionComplete(node.id, idx, path.id);
            const item = document.createElement('div');
            item.className = 'mission-item' + (done ? ' completed' : '');
            if (!done) {
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
            }
            item.innerHTML = `
                <div class="m-check"><span class="material-symbols-rounded">check</span></div>
                <div class="m-body">
                    <p class="m-text">${mission.text}</p>
                    <p class="m-meta">${mission.duration} minute sit · +20 XP on completion</p>
                </div>
                <div class="m-badge">${mission.duration}m</div>
            `;
            if (!done) {
                item.addEventListener('click', () => {
                    modal.classList.remove('active');
                    const breathe = document.querySelector('.breathe-screen');
                    if (breathe) {
                        breathe.activeMission = {
                            nodeId: node.id,
                            missionIndex: idx,
                            pathId: path.id,
                            label: `${node.subtitle}: Mission ${idx + 1}`,
                            description: mission.text,
                            minDuration: mission.duration
                        };
                        breathe.setTimerDuration(mission.duration);
                    }
                    document.querySelector('[data-target="breathe"]')?.click();
                });
            }
            list.appendChild(item);
        });

        modal.classList.add('active');
    }

    function buildMap(path) {
        const mapInner = container.querySelector('#journey-map-inner');
        const scrollArea = container.querySelector('#journey-map-scroll');

        // Dynamic height: enough for all nodes with 130px per node + padding
        const mapHeight = Math.max(600, path.nodes.length * 130 + 60);
        mapInner.style.height = `${mapHeight}px`;
        container.style.backgroundImage = `url('${path.bgImage}')`;
        mapInner.innerHTML = '';

        const progress = DB.getMissionProgress(path.id);
        const stats = DB.getStats();
        let foundCurrent = false;

        path.nodes.forEach(node => {
            const doneCount = progress[node.id] ? progress[node.id].length : 0;
            const allDone = doneCount === node.missions.length;
            let isUnlocked = node.id === 1;
            if (node.id > 1) {
                const prevDone = progress[node.id - 1]?.length || 0;
                isUnlocked = prevDone === path.nodes[node.id - 2].missions.length;
            }

            let cls = 'locked', icon = 'lock';
            if (isUnlocked) {
                icon = node.icon || 'self_improvement';
                if (allDone) { cls = 'completed'; }
                else if (!foundCurrent) { cls = 'current'; foundCurrent = true; }
                else { cls = 'available'; }
            }

            const el = document.createElement('div');
            el.className = `path-node ${cls}`;
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            el.style.left = `${node.xPct}%`;
            el.style.top = `${node.yPct}%`;

            el.innerHTML = `
                ${cls === 'current' ? '<div class="node-pulse"></div>' : ''}
                <div class="node-circle">
                    <span class="material-symbols-rounded">${icon}</span>
                </div>
                <span class="node-label">${node.subtitle}</span>
            `;

            if (isUnlocked) {
                el.addEventListener('click', () => openModal(node, path));
            }
            mapInner.appendChild(el);
        });

        // Show locked overlay if path not unlocked yet
        const pathUnlocked = stats.level >= path.unlockLevel || DB.isPathUnlocked(path.id);
        if (!pathUnlocked) {
            const overlay = document.createElement('div');
            overlay.className = 'jh-map-locked-overlay';
            overlay.innerHTML = `
                <span class="material-symbols-rounded">lock</span>
                <p>${path.label}</p>
                <span class="lk-sub">Unlocks at Level ${path.unlockLevel}</span>
            `;
            mapInner.appendChild(overlay);
        }

        // Reset scroll position when switching paths
        scrollArea.scrollTop = 0;
    }

    function buildTabs() {
        const tabBar = container.querySelector('#path-tab-bar');
        tabBar.innerHTML = '';
        const stats = DB.getStats();

        Object.values(PATHS).forEach(path => {
            const isUnlocked = stats.level >= path.unlockLevel || DB.isPathUnlocked(path.id);
            const tab = document.createElement('button');
            tab.className = 'jh-tab' + (path.id === activePathId ? ' active' : '') + (!isUnlocked ? ' locked' : '');
            tab.innerHTML = `
                <span class="material-symbols-rounded">${isUnlocked ? path.icon : 'lock'}</span>
                ${path.shortLabel}
                ${!isUnlocked ? `<span style="font-size:9px;opacity:0.75;">Lv.${path.unlockLevel}</span>` : ''}
            `;
            if (isUnlocked) {
                tab.addEventListener('click', () => {
                    if (activePathId === path.id) return;
                    activePathId = path.id;
                    DB.setActivePath(path.id);
                    buildTabs();
                    buildMap(PATHS[activePathId]);
                    updateHeader();
                });
            }
            tabBar.appendChild(tab);
        });
    }

    function updateHeader() {
        const path = PATHS[activePathId];
        container.querySelector('#j-path-subtitle').textContent = path.description;
    }

    container.updateData = () => {
        const stats = DB.getStats();
        container.querySelector('#j-level-text').textContent = `Lv.${stats.level}`;
        // XP bar using scaled level thresholds
        const xpProgress = xpInCurrentLevel(stats.xp);
        const xpPct = Math.min(100, (xpProgress.earned / xpProgress.needed) * 100);
        container.querySelector('#j-xp-bar').style.width = `${xpPct}%`;
        container.querySelector('#j-xp-label').textContent = `${xpProgress.earned} / ${xpProgress.needed} XP`;
        activePathId = DB.getActivePath();
        updateHeader();
        buildTabs();
        buildMap(PATHS[activePathId]);

        // Update Daily Quest UI
        const questState = DB.getDailyQuestState();
        const q = questState.quest;
        const questSub = container.querySelector('#journey-quest-sub');
        const questBadge = container.querySelector('#journey-quest-badge');
        const questBar = container.querySelector('#journey-quest-bar');

        if (q) {
            questSub.textContent = q.label;

            if (q.claimed) {
                questBadge.textContent = 'Claimed ✔';
                questBadge.style.background = 'rgba(255,255,255,0.2)';
                questBadge.style.color = 'rgba(255,255,255,0.6)';
                questBadge.style.animation = 'none';
                questBar.style.opacity = '0.7';
                questBar.style.cursor = 'default';
                questBar.onclick = null;
            } else if (q.completed) {
                questBadge.textContent = 'Claim +25 XP';
                questBadge.style.background = '#e2b857';
                questBadge.style.color = '#1b2e26';
                questBadge.style.animation = 'pulseGlow 1.5s infinite';
                questBar.style.opacity = '1';
                questBar.style.cursor = 'pointer';
                questBar.onclick = () => {
                    const success = DB.claimDailyQuest();
                    if (success) {
                        triggerQuestSplash();
                        container.updateData();
                    }
                };
            } else {
                questBadge.textContent = '+25 XP';
                questBadge.style.background = 'rgba(255,255,255,0.15)';
                questBadge.style.color = 'white';
                questBadge.style.animation = 'none';
                questBar.style.opacity = '1';
                questBar.style.cursor = 'pointer';
                questBar.onclick = () => {
                    if (q.type.startsWith('sit_')) {
                        document.querySelector('[data-target="breathe"]')?.click();
                    } else if (q.type.startsWith('log_')) {
                        document.querySelector('[data-target="reflect"]')?.click();
                    } else if (q.type.startsWith('read_')) {
                        document.querySelector('[data-target="wisdom"]')?.click();
                    } else {
                        document.querySelector('[data-target="breathe"]')?.click();
                    }
                };
            }
        }
    };

    return container;
}
