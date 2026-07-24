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
            <div class="collapsible-content" style="margin-top: 12px; transition: max-height 0.35s ease-out, opacity 0.2s; overflow: hidden; max-height: 2000px;">
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
            margin: 0;
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

        /* Visualization Pane System */
        .rfl-vis-tab {
            padding: 6px 14px;
            border-radius: 16px;
            border: 1.5px solid var(--color-bg-secondary);
            background: var(--color-bg-card);
            color: var(--color-text-secondary);
            font-size: 11.5px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s ease;
        }
        .rfl-vis-tab.active {
            background: var(--color-accent);
            color: #ffffff;
            border-color: var(--color-accent);
            box-shadow: 0 2px 8px rgba(139,92,246,0.3);
        }
        .rfl-vis-pane {
            display: none;
        }
        .rfl-vis-pane.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
    `;
    container.appendChild(style);

    let showAll = false;

    // Collapsible card setup
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
            content.style.maxHeight = '2000px';
            content.style.opacity = '1';
            toggle.style.transform = 'rotate(0deg)';
        }

        header.addEventListener('click', () => {
            const currentlyCollapsed = moodCard.classList.contains('collapsed');
            if (currentlyCollapsed) {
                moodCard.classList.remove('collapsed');
                content.style.maxHeight = '2000px';
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

                // Calculate mind coherence %
                const spread = (Math.abs(avgFocus - avgStability) + Math.abs(avgStability - avgEquanimity) + Math.abs(avgEquanimity - avgFocus)) / 3;
                const coherencePct = Math.max(0, Math.round(100 - spread));

                function getMindStateTitle(focus, stability, equanimity) {
                    if (equanimity >= 65 && focus >= 65 && stability >= 65) return { title: 'Open Samadhi', emoji: '🕊️', color: '#10b981' };
                    if (focus >= 60 && stability < 35) return { title: 'Striving against Dullness', emoji: '😴', color: '#7c3aed' };
                    if (focus < 35 && stability < 35 && equanimity < 35) return { title: 'Turbulent Mind', emoji: '🌪️', color: '#e11d48' };
                    if (focus < 35 && stability < 35) return { title: 'Sleepy Drift', emoji: '💤', color: '#f59e0b' };
                    if (focus >= 65 && stability >= 60) return { title: 'Laser Clarity', emoji: '🎯', color: '#6366f1' };
                    if (focus >= 65 && equanimity < 35) return { title: 'Tense Striving', emoji: '⚡', color: '#f43f5e' };
                    if (equanimity >= 65 && focus < 40) return { title: 'Equanimous Flow', emoji: '🌊', color: '#06b6d4' };
                    if (stability >= 65 && equanimity >= 60) return { title: 'Tranquil Stillness', emoji: '🌌', color: '#3b82f6' };
                    if (stability >= 45 && focus < 35 && equanimity >= 40) return { title: 'Gentle Anchoring', emoji: '🕯️', color: '#14b8a6' };
                    if (focus >= 50 && stability >= 50) return { title: 'Focused Clarity', emoji: '🧘', color: '#8b5cf6' };
                    return { title: 'Gentle Awareness', emoji: '🌱', color: '#a855f7' };
                }

                function renderLotusBloomSVG(focus, stability, equanimity) {
                    // Title determination
                    let title = "Gentle Bloom";
                    if (focus >= 70 && stability >= 70 && equanimity >= 70) title = "Open Samadhi";
                    else if (focus >= 60 && stability >= 60) title = "Quiet Presence";
                    else if (focus < 40 && stability < 40) title = "Resting Bud";

                    const scale = 0.55 + (focus / 100) * 0.45;
                    const petalSpread = Math.round(18 + (stability / 100) * 32);
                    
                    // Color progression: Very Low (Sage/Beige) -> Medium (Earth/Gold) -> High (Jade/Sunlight)
                    let pGrad1Stop1 = "#84a98c", pGrad1Stop2 = "#52796f";
                    let pGrad2Stop1 = "#d8f3dc", pGrad2Stop2 = "#74c69d";
                    let centerColor = "#e9c46a";

                    if (stability >= 70 || focus >= 70) {
                        pGrad1Stop1 = "#34d399"; pGrad1Stop2 = "#059669";
                        pGrad2Stop1 = "#fbbf24"; pGrad2Stop2 = "#d97706";
                        centerColor = "#ffd166";
                    } else if (stability >= 40 || focus >= 40) {
                        pGrad1Stop1 = "#2a9d8f"; pGrad1Stop2 = "#264653";
                        pGrad2Stop1 = "#e9c46a"; pGrad2Stop2 = "#f4a261";
                        centerColor = "#f4a261";
                    }

                    // Equanimity controls particle glow count & symmetry
                    const particleOpacity = Math.max(0.3, equanimity / 100);

                    return `
                        <div style="text-align:center; padding:16px 14px; background:var(--color-bg-card); border-radius:18px; border:1px solid rgba(0,0,0,0.06); box-shadow:0 4px 16px rgba(0,0,0,0.03);">
                            <div style="font-size:18px; font-weight:700; font-family:var(--font-heading); color:var(--color-text-primary); margin-bottom:2px;">🌸 Lotus Bloom</div>
                            <div style="font-size:12px; font-weight:600; color:var(--color-accent); margin-bottom:14px;">"${title}"</div>

                            <div style="position:relative; width:180px; height:140px; margin:0 auto;">
                                <svg width="180" height="140" viewBox="0 0 200 180" style="overflow:visible; animation:lotus-breathe 7s ease-in-out infinite;">
                                    <defs>
                                        <radialGradient id="lotusCenterGlow" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stop-color="${centerColor}" stop-opacity="${0.4 + (focus/100)*0.5}" />
                                            <stop offset="100%" stop-color="${centerColor}" stop-opacity="0" />
                                        </radialGradient>
                                        <linearGradient id="petalGradFocus" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stop-color="${pGrad1Stop1}" stop-opacity="0.75" />
                                            <stop offset="100%" stop-color="${pGrad1Stop2}" stop-opacity="0.3" />
                                        </linearGradient>
                                        <linearGradient id="petalGradStab" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stop-color="${pGrad2Stop1}" stop-opacity="0.75" />
                                            <stop offset="100%" stop-color="${pGrad2Stop2}" stop-opacity="0.3" />
                                        </linearGradient>
                                    </defs>

                                    <!-- Core Aura Glow -->
                                    <circle cx="100" cy="90" r="${70 * scale}" fill="url(#lotusCenterGlow)" />

                                    <!-- Floating Pollen/Light Particles -->
                                    <circle cx="70" cy="50" r="2.5" fill="${centerColor}" opacity="${particleOpacity}" style="animation:stardust-float 4s ease-in-out infinite;" />
                                    <circle cx="130" cy="45" r="2" fill="${centerColor}" opacity="${particleOpacity * 0.8}" style="animation:stardust-float 5s ease-in-out 1s infinite;" />
                                    <circle cx="100" cy="30" r="3" fill="#ffffff" opacity="${particleOpacity}" style="animation:stardust-float 3.5s ease-in-out 0.5s infinite;" />

                                    <!-- Living Lotus Flower -->
                                    <g transform="translate(100, 90) scale(${scale})">
                                        <path d="M 0 0 C -${petalSpread} -50, -${petalSpread} -80, 0 -115 C ${petalSpread} -80, ${petalSpread} -50, 0 0" fill="url(#petalGradFocus)" transform="rotate(0)"/>
                                        <path d="M 0 0 C -${petalSpread} -50, -${petalSpread} -80, 0 -115 C ${petalSpread} -80, ${petalSpread} -50, 0 0" fill="url(#petalGradFocus)" transform="rotate(45)"/>
                                        <path d="M 0 0 C -${petalSpread} -50, -${petalSpread} -80, 0 -115 C ${petalSpread} -80, ${petalSpread} -50, 0 0" fill="url(#petalGradFocus)" transform="rotate(90)"/>
                                        <path d="M 0 0 C -${petalSpread} -50, -${petalSpread} -80, 0 -115 C ${petalSpread} -80, ${petalSpread} -50, 0 0" fill="url(#petalGradFocus)" transform="rotate(135)"/>
                                        <path d="M 0 0 C -${petalSpread} -50, -${petalSpread} -80, 0 -115 C ${petalSpread} -80, ${petalSpread} -50, 0 0" fill="url(#petalGradStab)" transform="rotate(180)"/>
                                        <path d="M 0 0 C -${petalSpread} -50, -${petalSpread} -80, 0 -115 C ${petalSpread} -80, ${petalSpread} -50, 0 0" fill="url(#petalGradStab)" transform="rotate(225)"/>
                                        <path d="M 0 0 C -${petalSpread} -50, -${petalSpread} -80, 0 -115 C ${petalSpread} -80, ${petalSpread} -50, 0 0" fill="url(#petalGradStab)" transform="rotate(270)"/>
                                        <path d="M 0 0 C -${petalSpread} -50, -${petalSpread} -80, 0 -115 C ${petalSpread} -80, ${petalSpread} -50, 0 0" fill="url(#petalGradStab)" transform="rotate(315)"/>
                                        
                                        <!-- Center Golden Pearl -->
                                        <circle cx="0" cy="0" r="18" fill="#ffffff" filter="drop-shadow(0 0 10px ${centerColor})" />
                                        <circle cx="0" cy="0" r="11" fill="${centerColor}" />
                                    </g>
                                </svg>
                            </div>

                            <!-- Values Breakdown matching Layout spec -->
                            <div style="display:flex; justify-content:center; gap:16px; margin-top:10px; font-size:11px; color:var(--color-text-secondary); font-weight:600;">
                                <span>Focus <strong>${focus}%</strong></span>
                                <span>Clarity <strong>${stability}%</strong></span>
                                <span>Equanimity <strong>${equanimity}%</strong></span>
                            </div>
                        </div>
                    `;
                }

                function renderCompassMandala(focus, stability, equanimity, matrixPts = '') {
                    const f = Math.min(100, Math.max(0, focus));
                    const s = Math.min(100, Math.max(0, stability));
                    const eq = Math.min(100, Math.max(0, equanimity));

                    // Harmony calculation: spread between the 3 spectrums
                    const spread = (Math.abs(f - s) + Math.abs(s - eq) + Math.abs(eq - f)) / 3;
                    const coherencePct = Math.max(0, Math.round(100 - spread));

                    const isBalancedMind = Math.abs(f - s) <= 10 && Math.abs(s - eq) <= 10 && Math.abs(eq - f) <= 10;
                    const isHarmonious = coherencePct >= 70 || isBalancedMind;

                    // Point location: X = Focus (0..100), Y = Stability (100 - Stability)
                    const pointX = isBalancedMind ? 50 : Math.min(90, Math.max(10, f));
                    const pointY = isBalancedMind ? 50 : Math.min(90, Math.max(10, 100 - s));

                    // Dynamic stroke & opacity based on harmony level
                    const strokeColor = isHarmonious ? "url(#vividGoldGrad)" : `rgba(139, 92, 246, ${Math.max(0.25, coherencePct / 100).toFixed(2)})`;
                    const glowOpacity = isHarmonious ? "0.85" : Math.max(0.2, (coherencePct / 100) * 0.75).toFixed(2);
                    const centerAuraColor = isHarmonious ? '#fbbf24' : '#8b5cf6';
                    const centerAuraOpacity = isHarmonious ? 0.45 : (0.15 + (coherencePct / 100) * 0.25).toFixed(2);

                    const mandalaTierSvg = `
                        <defs>
                            <linearGradient id="vividGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#34d399" />
                                <stop offset="50%" stop-color="#fbbf24" />
                                <stop offset="100%" stop-color="#60a5fa" />
                            </linearGradient>
                            <radialGradient id="vividCenterAura" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="${centerAuraColor}" stop-opacity="${centerAuraOpacity}" />
                                <stop offset="100%" stop-color="#34d399" stop-opacity="0" />
                            </radialGradient>
                        </defs>

                        <!-- Central Radial Aura Glow -->
                        <circle cx="110" cy="110" r="95" fill="url(#vividCenterAura)" />

                        <!-- Outer Sacred Geometry Flower Ring -->
                        <circle cx="110" cy="110" r="100" stroke="${strokeColor}" stroke-width="${isHarmonious ? 2 : 1.2}" fill="none" stroke-dasharray="${isHarmonious ? '6,3' : '4,4'}"/>
                        <circle cx="110" cy="110" r="75" stroke="${strokeColor}" stroke-width="${isHarmonious ? 1.8 : 1}" fill="none"/>

                        <!-- 12 Radiating Geometric Petals / Star Geometry -->
                        <g opacity="${glowOpacity}">
                            <polygon points="110,10 196,160 24,160" stroke="${strokeColor}" stroke-width="1.2" fill="none"/>
                            <polygon points="110,210 196,60 24,60" stroke="${strokeColor}" stroke-width="1.2" fill="none"/>
                            <polygon points="10,110 160,196 160,24" stroke="${strokeColor}" stroke-width="1.2" fill="none"/>
                            <polygon points="210,110 60,196 60,24" stroke="${strokeColor}" stroke-width="1.2" fill="none"/>
                        </g>

                        <!-- Interlocking Flower of Life Geometry -->
                        <circle cx="110" cy="60" r="50" stroke="${strokeColor}" stroke-width="1" fill="none" opacity="0.4"/>
                        <circle cx="110" cy="160" r="50" stroke="${strokeColor}" stroke-width="1" fill="none" opacity="0.4"/>
                        <circle cx="60" cy="110" r="50" stroke="${strokeColor}" stroke-width="1" fill="none" opacity="0.4"/>
                        <circle cx="160" cy="110" r="50" stroke="${strokeColor}" stroke-width="1" fill="none" opacity="0.4"/>

                        <!-- Center Core Sacred Geometry -->
                        <circle cx="110" cy="110" r="35" stroke="${isHarmonious ? '#ffd166' : 'rgba(139,92,246,0.4)'}" stroke-width="2" fill="none"/>
                        <circle cx="110" cy="110" r="18" fill="${isHarmonious ? '#ffd166' : 'rgba(139,92,246,0.3)'}" opacity="0.7"/>
                    `;

                    return `
                        <div style="background:var(--color-bg-card); border-radius:18px; padding:18px 16px; border:1.5px solid ${isHarmonious ? 'var(--color-accent)' : 'rgba(0,0,0,0.06)'}; box-shadow:${isHarmonious ? '0 8px 24px rgba(16,185,129,0.15)' : '0 4px 16px rgba(0,0,0,0.03)'};">
                            <div style="font-size:18px; font-weight:700; font-family:var(--font-heading); color:var(--color-text-primary); margin-bottom:2px; text-align:center;">🧭 Compass / Mandala</div>
                            <div style="font-size:12px; font-weight:600; color:${isHarmonious ? 'var(--color-accent)' : 'var(--color-text-muted)'}; margin-bottom:14px; text-align:center;">
                                ${isHarmonious ? '✨ Harmonious Sacred Geometry Active' : `Inner Balance Coherence: ${coherencePct}%`}
                            </div>

                            <div style="position:relative; width:100%; height:230px; background:${isHarmonious ? 'radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.12), rgba(245, 158, 11, 0.08), var(--color-bg-secondary))' : 'var(--color-bg-secondary)'}; border-radius:16px; border:1.5px solid rgba(0,0,0,0.08); overflow:hidden; padding:8px; box-shadow:inset 0 2px 6px rgba(0,0,0,0.04);">
                                
                                <!-- Vivid Sacred Geometry Mandala Rotating Background (0.5deg/sec) -->
                                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:230px; height:230px; pointer-events:none; animation:mandala-rotate 720s linear infinite;">
                                    <svg width="230" height="230" viewBox="0 0 220 220">
                                        ${mandalaTierSvg}
                                    </svg>
                                </div>

                                <!-- Crosshairs -->
                                <div style="position:absolute; left:50%; top:0; bottom:0; width:1.5px; background:rgba(0,0,0,0.09); border-left:1px dashed rgba(0,0,0,0.15); pointer-events:none;"></div>
                                <div style="position:absolute; top:50%; left:0; right:0; height:1.5px; background:rgba(0,0,0,0.09); border-top:1px dashed rgba(0,0,0,0.15); pointer-events:none;"></div>
                                
                                <!-- Mandala Axes Labels -->
                                <span style="position:absolute; top:8px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--color-text-muted); font-weight:700; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">Clarity ▲</span>
                                <span style="position:absolute; bottom:8px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--color-text-muted); font-weight:600; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">▼ Equanimity</span>
                                <span style="position:absolute; top:50%; right:10px; transform:translateY(-50%); font-size:10px; color:var(--color-text-muted); font-weight:700; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">Absorption ►</span>
                                <span style="position:absolute; top:50%; left:10px; transform:translateY(-50%); font-size:10px; color:var(--color-text-muted); font-weight:600; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">◄ Focus</span>

                                <!-- Plotted Sit Nodes Constellation -->
                                ${matrixPts}

                                <!-- Luminous Gliding Active State Point (600ms transition) -->
                                <div style="position:absolute; left:${pointX}%; top:${pointY}%; transform:translate(-50%, -50%); width:18px; height:18px; border-radius:50%; background:${isHarmonious ? '#ffd166' : 'var(--color-accent)'}; box-shadow:0 0 20px ${isHarmonious ? '#ffd166' : 'var(--color-accent)'}, 0 0 8px #ffffff; border:3px solid #ffffff; z-index:10; pointer-events:none; transition:all 600ms cubic-bezier(0.25, 1, 0.5, 1);"></div>
                            </div>

                            <!-- State Alignment Badge -->
                            <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-top:12px;">
                                ${isBalancedMind ? `
                                    <span style="font-size:11.5px; padding:5px 16px; border-radius:14px; font-weight:700; background:linear-gradient(135deg, #10b981, #059669); color:#ffffff; box-shadow:0 3px 10px rgba(16,185,129,0.35);">
                                        ✨ Balanced Mind (Centred)
                                    </span>
                                ` : isHarmonious ? `
                                    <span style="font-size:11px; padding:4px 14px; border-radius:14px; font-weight:700; background:linear-gradient(135deg, #3b82f6, #8b5cf6); color:#ffffff; box-shadow:0 2px 8px rgba(59,130,246,0.3);">
                                        ✺ Harmonious Flow (${coherencePct}%)
                                    </span>
                                ` : `
                                    <span style="font-size:10.5px; font-weight:600; color:var(--color-text-muted);">
                                        Current State: Focus ${f}% • Clarity ${s}% • Equanimity ${eq}%
                                    </span>
                                `}
                            </div>
                        </div>
                    `;
                }

                function renderStateMatrixMap(focus, stability, equanimity, matrixPts = '') {
                    const f = Math.min(100, Math.max(0, focus));
                    const s = Math.min(100, Math.max(0, stability));
                    const eq = Math.min(100, Math.max(0, equanimity));

                    const isBalancedMind = Math.abs(f - s) <= 10 && Math.abs(s - eq) <= 10 && Math.abs(eq - f) <= 10;
                    const pointX = isBalancedMind ? 50 : Math.min(90, Math.max(10, f));
                    const pointY = isBalancedMind ? 50 : Math.min(90, Math.max(10, 100 - s));

                    return `
                        <div style="background:var(--color-bg-card); border-radius:18px; padding:18px 16px; border:1px solid rgba(0,0,0,0.06); box-shadow:0 4px 16px rgba(0,0,0,0.03);">
                            <div style="position:relative; width:100%; height:230px; background:var(--color-bg-secondary); border-radius:16px; border:1.5px solid rgba(0,0,0,0.08); overflow:hidden; padding:8px; box-shadow:inset 0 2px 6px rgba(0,0,0,0.04);">
                                
                                <!-- Axis Grid Lines -->
                                <div style="position:absolute; left:50%; top:0; bottom:0; width:1.5px; background:rgba(0,0,0,0.09); border-left:1px dashed rgba(0,0,0,0.15); pointer-events:none;"></div>
                                <div style="position:absolute; top:50%; left:0; right:0; height:1.5px; background:rgba(0,0,0,0.09); border-top:1px dashed rgba(0,0,0,0.15); pointer-events:none;"></div>
                                
                                <!-- Axes Labels -->
                                <span style="position:absolute; top:8px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--color-text-muted); font-weight:700; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">High Stability ▲</span>
                                <span style="position:absolute; bottom:8px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--color-text-muted); font-weight:600; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">▼ Low Stability</span>
                                <span style="position:absolute; top:50%; right:10px; transform:translateY(-50%); font-size:10px; color:var(--color-text-muted); font-weight:700; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">High Focus ►</span>
                                <span style="position:absolute; top:50%; left:10px; transform:translateY(-50%); font-size:10px; color:var(--color-text-muted); font-weight:600; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">◄ Low Focus</span>

                                <!-- Plotted Sit Nodes Constellation -->
                                ${matrixPts}

                                <!-- Gliding Active Point -->
                                <div style="position:absolute; left:${pointX}%; top:${pointY}%; transform:translate(-50%, -50%); width:18px; height:18px; border-radius:50%; background:var(--color-accent); box-shadow:0 0 16px var(--color-accent), 0 0 6px #ffffff; border:3px solid #ffffff; z-index:10; pointer-events:none; transition:all 600ms cubic-bezier(0.25, 1, 0.5, 1);"></div>
                            </div>

                            <!-- State Alignment Badge -->
                            <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-top:12px;">
                                ${isBalancedMind ? `
                                    <span style="font-size:11.5px; padding:5px 16px; border-radius:14px; font-weight:700; background:linear-gradient(135deg, #10b981, #059669); color:#ffffff; box-shadow:0 3px 10px rgba(16,185,129,0.35);">
                                        ✨ Balanced Mind (Centred)
                                    </span>
                                ` : `
                                    <span style="font-size:10.5px; font-weight:600; color:var(--color-text-muted);">
                                        Current Point: Focus ${f}% • Stability ${s}% • Equanimity ${eq}%
                                    </span>
                                `}
                            </div>
                        </div>
                    `;
                }

                // Visualization 1: 2D Mind State Matrix Trajectory Constellation Points
                let matrixPoints = '';
                const displayReflections = reflections.slice(0, 15);
                displayReflections.forEach((r, idx) => {
                    const fX = r.focusScore !== undefined ? Math.min(90, Math.max(10, r.focusScore)) : 50;
                    const rawS = r.stabilityScore !== undefined ? r.stabilityScore : 50;
                    const sY = Math.min(88, Math.max(12, 100 - rawS)); // invert for CSS top
                    const opacity = Math.max(0.4, 1 - (idx * 0.05));
                    const isLatest = idx === 0;

                    matrixPoints += `
                        <div style="position:absolute; left:${fX}%; top:${sY}%; transform:translate(-50%, -50%); width:${isLatest ? 12 : 8}px; height:${isLatest ? 12 : 8}px; border-radius:50%; background:${isLatest ? 'var(--color-accent)' : '#8b5cf6'}; opacity:${opacity}; box-shadow:${isLatest ? '0 0 12px var(--color-accent)' : '0 0 4px rgba(139,92,246,0.4)'}; border:${isLatest ? '2px solid #ffffff' : '1.5px solid rgba(255,255,255,0.85)'}; pointer-events:none; transition: all 250ms ease;"></div>
                    `;
                });

                moodContainer.innerHTML = `
                    <style>
                        @keyframes lotus-breathe {
                            0%, 100% { transform: scale(1); }
                            42.8% { transform: scale(1.07); }
                            57.1% { transform: scale(1.07); }
                        }
                        @keyframes mandala-rotate {
                            from { transform: translate(-50%, -50%) rotate(0deg); }
                            to { transform: translate(-50%, -50%) rotate(360deg); }
                        }
                    </style>

                    <!-- Switchable Visualization Tabs -->
                    <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:6px; margin-bottom:12px; scrollbar-width:none;" id="rfl-vis-tabs">
                        <button class="rfl-vis-tab active" data-target="pane-map">📍 State Matrix Map</button>
                        <button class="rfl-vis-tab" data-target="pane-mandala">🧭 Compass Mandala</button>
                        <button class="rfl-vis-tab" data-target="pane-lotus">🌸 Lotus Bloom</button>
                    </div>

                    <!-- Pane 1: 2D State Matrix Map -->
                    <div class="rfl-vis-pane active" id="pane-map">
                        ${renderStateMatrixMap(avgFocus, avgStability, avgEquanimity, matrixPoints)}
                    </div>

                    <!-- Pane 2: Vivid Sacred Geometry Compass Mandala Visualizer -->
                    <div class="rfl-vis-pane" id="pane-mandala">
                        ${renderCompassMandala(avgFocus, avgStability, avgEquanimity, matrixPoints)}
                    </div>

                    <!-- Pane 3: Lotus Bloom -->
                    <div class="rfl-vis-pane" id="pane-lotus">
                        ${renderLotusBloomSVG(avgFocus, avgStability, avgEquanimity)}
                    </div>

                    <!-- Developer State Visualizer Sandbox Control Panel -->
                    <div style="margin-top:14px; background:var(--color-bg-secondary); border-radius:16px; border:1px solid rgba(139,92,246,0.2); overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.02);">
                        <button id="rfl-dev-toggle" style="width:100%; text-align:left; background:none; border:none; padding:12px 14px; font-size:12px; font-weight:700; color:var(--color-accent); cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                            <span>⚙️ Live Visualizer Sandbox (Dev Tool)</span>
                            <span id="rfl-dev-chevron" style="font-size:11px; transition:transform 0.2s;">▼</span>
                        </button>
                        <div id="rfl-dev-body" style="display:none; padding:0 14px 14px; flex-direction:column; gap:12px;">
                            <div style="font-size:10.5px; color:var(--color-text-muted); font-style:italic; margin-bottom:2px;">
                                Adjust sliders below to test how the Siddha visualizers react to different mind state combinations in real-time.
                            </div>
                            
                            <!-- Focus Slider -->
                            <div>
                                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--color-text-primary); margin-bottom:4px;">
                                    <span>🧘 Focus & Concentration</span>
                                    <span id="rfl-dev-val-focus" style="color:var(--color-accent); font-weight:700;">${avgFocus}%</span>
                                </div>
                                <input type="range" id="rfl-dev-slider-focus" min="0" max="100" value="${avgFocus}" style="width:100%; accent-color:var(--color-accent); cursor:pointer;" />
                            </div>
                            
                            <!-- Stability Slider -->
                            <div>
                                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--color-text-primary); margin-bottom:4px;">
                                    <span>☀️ Stability & Clarity</span>
                                    <span id="rfl-dev-val-stability" style="color:#3b82f6; font-weight:700;">${avgStability}%</span>
                                </div>
                                <input type="range" id="rfl-dev-slider-stability" min="0" max="100" value="${avgStability}" style="width:100%; accent-color:#3b82f6; cursor:pointer;" />
                            </div>
                            
                            <!-- Equanimity Slider -->
                            <div>
                                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--color-text-primary); margin-bottom:4px;">
                                    <span>🕊️ Equanimity & Openness</span>
                                    <span id="rfl-dev-val-equanimity" style="color:#10b981; font-weight:700;">${avgEquanimity}%</span>
                                </div>
                                <input type="range" id="rfl-dev-slider-equanimity" min="0" max="100" value="${avgEquanimity}" style="width:100%; accent-color:#10b981; cursor:pointer;" />
                            </div>
                        </div>
                    </div>
                `;

                // Tab Switcher Listener
                const tabs = moodContainer.querySelectorAll('.rfl-vis-tab');
                const panes = moodContainer.querySelectorAll('.rfl-vis-pane');
                tabs.forEach(t => {
                    t.addEventListener('click', () => {
                        tabs.forEach(tab => tab.classList.remove('active'));
                        panes.forEach(pane => pane.classList.remove('active'));
                        t.classList.add('active');
                        const targetId = t.dataset.target;
                        const targetPane = moodContainer.querySelector(`#${targetId}`);
                        if (targetPane) targetPane.classList.add('active');
                    });
                });

                // Developer Sandbox Collapsible Toggle & Real-time Live Sliders Listener
                const devToggle = moodContainer.querySelector('#rfl-dev-toggle');
                const devBody = moodContainer.querySelector('#rfl-dev-body');
                const devChevron = moodContainer.querySelector('#rfl-dev-chevron');

                if (devToggle && devBody) {
                    devToggle.addEventListener('click', () => {
                        const isHidden = devBody.style.display === 'none';
                        devBody.style.display = isHidden ? 'flex' : 'none';
                        if (devChevron) devChevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
                    });

                    const sliderFocus = moodContainer.querySelector('#rfl-dev-slider-focus');
                    const sliderStability = moodContainer.querySelector('#rfl-dev-slider-stability');
                    const sliderEquanimity = moodContainer.querySelector('#rfl-dev-slider-equanimity');

                    const valFocus = moodContainer.querySelector('#rfl-dev-val-focus');
                    const valStability = moodContainer.querySelector('#rfl-dev-val-stability');
                    const valEquanimity = moodContainer.querySelector('#rfl-dev-val-equanimity');
                    const badgeHarmony = moodContainer.querySelector('#rfl-harmony-badge');

                    const updateDevVisualizers = () => {
                        const f = parseInt(sliderFocus.value);
                        const s = parseInt(sliderStability.value);
                        const eq = parseInt(sliderEquanimity.value);

                        if (valFocus) valFocus.textContent = `${f}%`;
                        if (valStability) valStability.textContent = `${s}%`;
                        if (valEquanimity) valEquanimity.textContent = `${eq}%`;

                        const devSpread = (Math.abs(f - s) + Math.abs(s - eq) + Math.abs(eq - f)) / 3;
                        const devHarmonyPct = Math.max(0, Math.round(100 - devSpread));
                        if (badgeHarmony) badgeHarmony.textContent = `${devHarmonyPct}% Harmony`;

                        // Dynamic live re-render 2D State Matrix Map pane
                        const paneMap = moodContainer.querySelector('#pane-map');
                        if (paneMap) paneMap.innerHTML = renderStateMatrixMap(f, s, eq, matrixPoints);

                        // Dynamic live re-render Compass Mandala pane
                        const paneMandala = moodContainer.querySelector('#pane-mandala');
                        if (paneMandala) paneMandala.innerHTML = renderCompassMandala(f, s, eq, matrixPoints);

                        // Dynamic live re-render Lotus Bloom pane
                        const paneLotus = moodContainer.querySelector('#pane-lotus');
                        if (paneLotus) paneLotus.innerHTML = renderLotusBloomSVG(f, s, eq);
                    };

                    if (sliderFocus) sliderFocus.addEventListener('input', updateDevVisualizers);
                    if (sliderStability) sliderStability.addEventListener('input', updateDevVisualizers);
                    if (sliderEquanimity) sliderEquanimity.addEventListener('input', updateDevVisualizers);
                }
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

            const intentionTag = ref.intention
                ? `<div style="font-size:11px; font-weight:600; color:var(--color-accent-dark); background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.15); padding:3px 10px; border-radius:8px; display:inline-flex; align-items:center; gap:4px; margin-top:2px;">
                    ✨ Intention: "${ref.intention}"
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
                ${intentionTag}
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
