/**
 * Database abstraction layer.
 * Currently uses localStorage for local testing.
 * Can be swapped out for Firebase Firestore later.
 */

const DB_KEY = 'siddha_db';

// Total XP needed to REACH each level (index = level number, 0 = never used)
// Early levels are quick to encourage new users; later levels scale steeply
const LEVEL_THRESHOLDS = [
    0,    // level 0 (unused)
    0,    // level 1: starts here
    100,  // level 2
    250,  // level 3
    450,  // level 4
    700,  // level 5
    1000, // level 6
    1400, // level 7
    1900, // level 8
    2500, // level 9
    3200, // level 10
    4000, // level 11
    5000, // level 12
    6200, // level 13
    7600, // level 14
    9200, // level 15
];

// Returns the level number for a given total XP amount
function xpToLevel(xp) {
    let level = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 1; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i;
            break;
        }
    }
    return level;
}

// Returns XP needed to reach the next level from current total XP
function xpForNextLevel(xp) {
    const currentLevel = xpToLevel(xp);
    const nextIdx = currentLevel + 1;
    if (nextIdx >= LEVEL_THRESHOLDS.length) {
        // Beyond defined thresholds: each extra level costs 2000 more
        const extra = nextIdx - LEVEL_THRESHOLDS.length + 1;
        return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + extra * 2000;
    }
    return LEVEL_THRESHOLDS[nextIdx];
}

// XP within the current level (for progress bars)
function xpInCurrentLevel(xp) {
    const currentLevel = xpToLevel(xp);
    const base = LEVEL_THRESHOLDS[Math.min(currentLevel, LEVEL_THRESHOLDS.length - 1)];
    const next = xpForNextLevel(xp);
    return { earned: xp - base, needed: next - base };
}


const defaultState = {
    user: null,
    xp: 0,
    streak: 0,
    level: 1,
    meditationHistory: [],
    reflectionHistory: [],
    missionProgress: {},   // { nodeId_pathId: [missionIndex,...] }
    lastLogin: null,
    activePathId: 'tmi',   // currently selected journey path
    companion: {
        nourish: 45,
        aura: 55,
        sync: 10,
        inventory: {
            acorns: 1,
            blossoms: 1,
            nectar: 0
        },
        lastUpdated: null
    },
    dailyQuests: {
        completedDate: null,
        questType: null,
        label: '',
        completed: false,
        claimed: false
    }
};

function getState() {
    try {
        const raw = localStorage.getItem(DB_KEY);
        if (!raw) return { ...defaultState };
        const parsed = JSON.parse(raw);
        // Ensure new keys exist for old saves
        return { ...defaultState, ...parsed };
    } catch (e) {
        return window.siddha_mem_state || { ...defaultState };
    }
}

function saveState(state) {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(state));
    } catch (e) {
        window.siddha_mem_state = state;
    }
}

// Local date string helper  YYYY-MM-DD
function toDateStr(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
}

export { xpToLevel, xpForNextLevel, xpInCurrentLevel, LEVEL_THRESHOLDS };

export const DB = {
    // Auth
    login: async (userData) => {
        const state = getState();
        state.user = userData;
        state.lastLogin = new Date().toISOString();
        saveState(state);
        return state.user;
    },

    logout: async () => {
        const state = getState();
        state.user = null;
        saveState(state);
    },

    getUser: () => getState().user,

    // Progress & Stats
    getStats: () => {
        const state = getState();
        const history = state.meditationHistory || [];

        let streak = 0;
        if (history.length > 0) {
            const dates = [...new Set(history.map(item => toDateStr(item.date)))]
                .sort((a, b) => new Date(b) - new Date(a));

            const todayStr = toDateStr(new Date());
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = toDateStr(yesterday);

            if (dates[0] === todayStr || dates[0] === yesterdayStr) {
                let checkDate = new Date(dates[0]);
                for (const date of dates) {
                    const expected = toDateStr(checkDate);
                    if (date === expected) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
                    else break;
                }
            }
        }

        state.streak = streak;
        saveState(state);

        const todayStr = toDateStr(new Date());
        const todayMinutes = history
            .filter(item => toDateStr(item.date) === todayStr)
            .reduce((acc, cur) => acc + (cur.duration || 0), 0);

        // Weekly data: Mon-Sun current week
        const weekData = [0, 0, 0, 0, 0, 0, 0]; // Mon=0 .. Sun=6
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
        const monday = new Date(now);
        monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0);

        let weekSessions = 0;
        history.forEach(item => {
            const d = new Date(item.date);
            const diff = Math.floor((d - monday) / (1000 * 60 * 60 * 24));
            if (diff >= 0 && diff < 7) {
                weekData[diff] += (item.duration || 0);
                if (item.type === 'meditation') {
                    weekSessions++;
                }
            }
        });

        let daysSinceLastSession = 0;
        if (history.length > 0) {
            const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
            const lastSessionDate = new Date(sortedHistory[0].date);
            lastSessionDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            daysSinceLastSession = Math.floor((today - lastSessionDate) / (1000 * 60 * 60 * 24));
        }

        return {
            xp: state.xp,
            level: state.level,
            streak,
            todayMinutes,
            totalSessions: history.length,
            totalMinutes: history.reduce((acc, cur) => acc + (cur.duration || 0), 0),
            weekData,
            weekMinutes: weekData.reduce((acc, cur) => acc + cur, 0),
            weekSessions,
            daysSinceLastSession
        };
    },

    addXP: (amount) => {
        const state = getState();
        const oldLevel = state.level;
        state.xp += amount;
        const newLevel = xpToLevel(state.xp);
        const leveledUp = newLevel > oldLevel;
        state.level = newLevel;
        saveState(state);
        if (leveledUp) {
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('siddha-levelup', {
                    detail: { oldLevel, newLevel, xp: state.xp }
                }));
            }, 100);
        }
        return { xp: state.xp, level: state.level, leveledUp };
    },

    // Meditations
    completeMeditation: (durationMins) => {
        const state = getState();
        const oldLevel = state.level;
        const activePath = state.activePathId || 'tmi';
        
        state.meditationHistory.push({
            date: new Date().toISOString(),
            duration: durationMins,
            type: 'meditation',
            path: activePath
        });
        
        const xpEarned = durationMins * 5;
        state.xp += xpEarned;
        const newLevel = xpToLevel(state.xp);
        const leveledUp = newLevel > oldLevel;
        state.level = newLevel;

        // Companion Sync & Inventory drops
        if (!state.companion) {
            state.companion = {
                nourish: 45,
                aura: 55,
                sync: 10,
                inventory: { acorns: 1, blossoms: 1, nectar: 0 },
                lastUpdated: new Date().toISOString()
            };
        }
        const comp = state.companion;
        if (!comp.inventory) comp.inventory = { acorns: 1, blossoms: 1, nectar: 0 };

        const syncBoost = durationMins * 3;
        comp.sync = Math.min(100, (comp.sync || 0) + syncBoost);

        if (activePath === 'tmi') {
            comp.inventory.acorns = (comp.inventory.acorns || 0) + 1;
        } else if (activePath === 'vipassana') {
            comp.inventory.blossoms = (comp.inventory.blossoms || 0) + 1;
        } else if (activePath === 'zen') {
            comp.inventory.nectar = (comp.inventory.nectar || 0) + 1;
        }
        comp.lastUpdated = new Date().toISOString();

        saveState(state);
        if (leveledUp) {
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('siddha-levelup', {
                    detail: { oldLevel, newLevel, xp: state.xp }
                }));
            }, 100);
        }
        return xpEarned;
    },

    // Missions — keyed by `${pathId}_${nodeId}`
    completeMission: (nodeId, missionIndex, pathId = 'tmi') => {
        const state = getState();
        if (!state.missionProgress) state.missionProgress = {};
        const key = `${pathId}_${nodeId}`;
        if (!state.missionProgress[key]) state.missionProgress[key] = [];

        if (!state.missionProgress[key].includes(missionIndex)) {
            const oldLevel = state.level;
            state.missionProgress[key].push(missionIndex);
            state.xp += 20;
            const newLevel = xpToLevel(state.xp);
            const leveledUp = newLevel > oldLevel;
            state.level = newLevel;
            saveState(state);
            if (leveledUp) {
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('siddha-levelup', {
                        detail: { oldLevel, newLevel, xp: state.xp }
                    }));
                }, 100);
            }
        }
    },

    isMissionComplete: (nodeId, missionIndex, pathId = 'tmi') => {
        const state = getState();
        const key = `${pathId}_${nodeId}`;
        if (!state.missionProgress || !state.missionProgress[key]) return false;
        return state.missionProgress[key].includes(missionIndex);
    },

    getMissionProgress: (pathId = 'tmi') => {
        const state = getState();
        const result = {};
        const prefix = `${pathId}_`;
        Object.entries(state.missionProgress || {}).forEach(([key, val]) => {
            if (key.startsWith(prefix)) {
                result[key.slice(prefix.length)] = val;
            }
        });
        return result;
    },

    // Path selection
    getActivePath: () => getState().activePathId || 'tmi',
    setActivePath: (pathId) => {
        const state = getState();
        state.activePathId = pathId;
        saveState(state);
    },

    // Reflections
    saveReflection: (reflectionData) => {
        const state = getState();
        if (!state.reflectionHistory) state.reflectionHistory = [];
        state.reflectionHistory.push({
            ...reflectionData,
            date: new Date().toISOString()
        });
        saveState(state);
    },

    getReflections: () => {
        const state = getState();
        return [...(state.reflectionHistory || [])].reverse();
    },

    // Dev Tools
    resetProgress: () => {
        const state = getState();
        state.user = null;
        state.xp = 0;
        state.level = 1;
        state.streak = 0;
        state.meditationHistory = [];
        state.reflectionHistory = [];
        state.missionProgress = {};
        state.dailyQuests = { completedDate: null, questType: null, label: '', completed: false, claimed: false };
        saveState(state);
    },
    
    // Companion/Pet Sanctuary
    getCompanionState: () => {
        const state = getState();
        if (!state.companion) {
            state.companion = {
                nourish: 45,
                aura: 55,
                sync: 10,
                inventory: { acorns: 1, blossoms: 1, nectar: 0 },
                lastUpdated: new Date().toISOString()
            };
            saveState(state);
            return state.companion;
        }

        const comp = state.companion;
        if (!comp.inventory) comp.inventory = { acorns: 1, blossoms: 1, nectar: 0 };
        
        if (comp.lastUpdated) {
            const now = Date.now();
            const last = new Date(comp.lastUpdated).getTime();
            const diffMs = now - last;
            if (diffMs > 0) {
                const nourishDecay = Math.floor(diffMs / 45000);
                const auraDecay = Math.floor(diffMs / 60000);
                if (nourishDecay > 0) {
                    comp.nourish = Math.max(10, comp.nourish - nourishDecay);
                }
                if (auraDecay > 0) {
                    comp.aura = Math.max(10, comp.aura - auraDecay);
                }
                if (nourishDecay > 0 || auraDecay > 0) {
                    comp.lastUpdated = new Date(last + Math.max(nourishDecay * 45000, auraDecay * 60000)).toISOString();
                    saveState(state);
                }
            }
        } else {
            comp.lastUpdated = new Date().toISOString();
            saveState(state);
        }
        return comp;
    },

    petCompanion: () => {
        const state = getState();
        if (!state.companion) state.companion = { nourish: 45, aura: 55, sync: 10, inventory: { acorns: 1, blossoms: 1, nectar: 0 } };
        state.companion.aura = Math.min(100, (state.companion.aura || 0) + 8);
        state.companion.lastUpdated = new Date().toISOString();
        saveState(state);
        return state.companion;
    },

    ringChime: () => {
        const state = getState();
        if (!state.companion) state.companion = { nourish: 45, aura: 55, sync: 10, inventory: { acorns: 1, blossoms: 1, nectar: 0 } };
        state.companion.aura = Math.min(100, (state.companion.aura || 0) + 5);
        state.companion.lastUpdated = new Date().toISOString();
        saveState(state);
        return state.companion;
    },

    feedCompanion: (itemType) => {
        const state = getState();
        if (!state.companion) return null;
        const comp = state.companion;
        if (!comp.inventory || !comp.inventory[itemType] || comp.inventory[itemType] <= 0) return null;

        comp.inventory[itemType]--;
        if (itemType === 'acorns') {
            comp.nourish = Math.min(100, (comp.nourish || 0) + 25);
            comp.aura = Math.min(100, (comp.aura || 0) + 5);
        } else if (itemType === 'blossoms') {
            comp.nourish = Math.min(100, (comp.nourish || 0) + 35);
            comp.aura = Math.min(100, (comp.aura || 0) + 10);
        } else if (itemType === 'nectar') {
            comp.nourish = Math.min(100, (comp.nourish || 0) + 50);
            comp.aura = Math.min(100, (comp.aura || 0) + 20);
        }
        comp.lastUpdated = new Date().toISOString();
        saveState(state);
        return comp;
    },

    // Daily Quests
    getDailyQuestState: () => {
        const state = getState();
        const todayStr = toDateStr(new Date());
        const user = state.user;
        const commitment = user ? parseInt(user.dailyCommitment) || 10 : 10;

        if (!state.dailyQuests || state.dailyQuests.completedDate !== todayStr) {
            const quests = [
                { type: 'sit_commitment', label: `Sit for your daily commitment (${commitment}m)` },
                { type: 'sit_any', label: 'Complete any meditation session' },
                { type: 'log_grateful', label: 'Log a Grateful mood reflection' },
                { type: 'sit_tmi', label: 'Complete a Mind Illuminated (TMI) session' }
            ];
            if (state.level >= 3) {
                quests.push({ type: 'sit_vipassana', label: 'Complete a Vipassana session' });
            }
            if (state.level >= 5) {
                quests.push({ type: 'sit_zen', label: 'Complete a Zen session' });
            }

            const dayNum = new Date().getDate();
            const chosen = quests[dayNum % quests.length];

            state.dailyQuests = {
                completedDate: todayStr,
                questType: chosen.type,
                label: chosen.label,
                completed: false,
                claimed: false
            };
            saveState(state);
        }

        const quest = state.dailyQuests;
        if (!quest.completed) {
            const todayHistory = (state.meditationHistory || []).filter(item => toDateStr(item.date) === todayStr);
            const todayReflections = (state.reflectionHistory || []).filter(item => toDateStr(item.date) === todayStr);

            if (quest.questType === 'sit_commitment') {
                quest.completed = todayHistory.some(h => h.duration >= commitment);
            } else if (quest.questType === 'sit_any') {
                quest.completed = todayHistory.length > 0;
            } else if (quest.questType === 'log_grateful') {
                quest.completed = todayReflections.some(r => r.mood === 'grateful');
            } else if (quest.questType === 'sit_tmi') {
                quest.completed = todayHistory.some(h => h.path === 'tmi');
            } else if (quest.questType === 'sit_vipassana') {
                quest.completed = todayHistory.some(h => h.path === 'vipassana');
            } else if (quest.questType === 'sit_zen') {
                quest.completed = todayHistory.some(h => h.path === 'zen');
            }
            if (quest.completed) {
                saveState(state);
            }
        }

        return quest;
    },

    claimDailyQuest: () => {
        const state = getState();
        const quest = state.dailyQuests;
        if (quest && quest.completed && !quest.claimed) {
            quest.claimed = true;
            saveState(state);
            DB.addXP(25);
            return true;
        }
        return false;
    },

    devSimulateTimePassing: (days) => {
        const state = getState();
        const shiftDate = (dStr) => {
            const d = new Date(dStr);
            d.setDate(d.getDate() - days);
            return d.toISOString();
        };
        if (state.meditationHistory.length === 0) {
            state.meditationHistory.push({ date: new Date().toISOString(), duration: 5, type: 'meditation' });
        }
        state.meditationHistory.forEach(s => s.date = shiftDate(s.date));
        state.reflectionHistory.forEach(s => s.date = shiftDate(s.date));
        if (state.companion && state.companion.lastUpdated) {
            const d = new Date(state.companion.lastUpdated);
            d.setDate(d.getDate() - days);
            state.companion.lastUpdated = d.toISOString();
        }
        saveState(state);
    }
};
