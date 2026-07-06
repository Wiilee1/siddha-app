import { DB } from '../services/db.js';

// All meditation paths
const PATHS = {
    tmi: {
        id: 'tmi',
        label: 'The Mind Illuminated',
        shortLabel: 'TMI',
        unlockLevel: 1,
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
    vipassana: {
        id: 'vipassana',
        label: 'Vipassana',
        shortLabel: 'Vipassana',
        unlockLevel: 3,
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
    zen: {
        id: 'zen',
        label: 'Zen',
        shortLabel: 'Zen',
        unlockLevel: 5,
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
            <div>
                <h1 class="jh-title">Your Journey</h1>
                <p class="jh-subtitle" id="j-path-subtitle">Loading...</p>
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
                <p class="jh-quest-title">Daily Quest</p>
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
            padding: 14px 16px 8px;
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
            0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
            50%  { transform: translate(-50%, -50%) scale(1.45); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
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
            0%, 100% { transform: scale(1); box-shadow: 0 0 4px rgba(226, 184, 87, 0.4); }
            50%      { transform: scale(1.04); box-shadow: 0 0 12px rgba(226, 184, 87, 0.8); }
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

    container.querySelector('#journey-quest-bar').addEventListener('click', () => {
        const success = DB.claimDailyQuest();
        if (success) {
            triggerQuestSplash();
            container.updateData();
        }
    });

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
                            description: mission.text
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
        const pathUnlocked = stats.level >= path.unlockLevel;
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
            const isUnlocked = stats.level >= path.unlockLevel;
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
        const xpInLevel = stats.xp - (stats.level - 1) * 500;
        container.querySelector('#j-xp-bar').style.width = `${Math.min(100, (xpInLevel / 500) * 100)}%`;
        container.querySelector('#j-xp-label').textContent = `${xpInLevel} / 500 XP`;
        activePathId = DB.getActivePath();
        updateHeader();
        buildTabs();
        buildMap(PATHS[activePathId]);

        // Update Daily Quest UI
        const quest = DB.getDailyQuestState();
        const questSub = container.querySelector('#journey-quest-sub');
        const questBadge = container.querySelector('#journey-quest-badge');
        const questBar = container.querySelector('#journey-quest-bar');

        questSub.textContent = quest.label;

        if (quest.claimed) {
            questBadge.textContent = 'Claimed ✔';
            questBadge.style.background = 'rgba(255,255,255,0.2)';
            questBadge.style.color = 'rgba(255,255,255,0.6)';
            questBadge.style.animation = 'none';
            questBar.style.opacity = '0.7';
            questBar.style.cursor = 'default';
        } else if (quest.completed) {
            questBadge.textContent = 'Claim +25 XP';
            questBadge.style.background = '#e2b857';
            questBadge.style.color = '#1b2e26';
            questBadge.style.animation = 'pulseGlow 1.5s infinite';
            questBar.style.opacity = '1';
            questBar.style.cursor = 'pointer';
        } else {
            questBadge.textContent = '+25 XP';
            questBadge.style.background = 'rgba(255,255,255,0.15)';
            questBadge.style.color = 'white';
            questBadge.style.animation = 'none';
            questBar.style.opacity = '1';
            questBar.style.cursor = 'default';
        }
    };

    return container;
}
