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
    completedTutorial: false,
    xp: 0,
    streak: 0,
    level: 1,
    meditationHistory: [],
    reflectionHistory: [],
    feedbackHistory: [],
    missionProgress: {},   // { nodeId_pathId: [missionIndex,...] }
    lastLogin: null,
    activePathId: 'anapana',   // currently selected journey path
    unlockedPathIds: ['anapana'], // paths unlocked by the user
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
        quest: null
    },
    cosmetics: {
        unlockedSkins: ['default'],
        activeSkin: 'default',
        unlockedSounds: ['default_bell'],
        activeSound: 'default_bell',
        unlockedThemes: ['default'],
        activeTheme: 'default'
    },
    readArticles: [],
    unlockedAchievements: {} // stores { id: unlockTimestamp }
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
const todayDate = () => toDateStr(new Date());

// Helper to award items on level up
function checkAndApplyLevelUpRewards(state, oldLevel, newLevel) {
    if (newLevel > oldLevel) {
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

        const levelsGained = newLevel - oldLevel;
        comp.inventory.acorns = (comp.inventory.acorns || 0) + levelsGained;
        comp.inventory.blossoms = (comp.inventory.blossoms || 0) + levelsGained;
        if (newLevel >= 5) {
            comp.inventory.nectar = (comp.inventory.nectar || 0) + levelsGained;
        }
        comp.lastUpdated = new Date().toISOString();
        return true;
    }
    return false;
}

export { xpToLevel, xpForNextLevel, xpInCurrentLevel, LEVEL_THRESHOLDS };

export const CHAKRA_LEVELS = [
    { level: 1, name: "Root Chakra", color: "#E53935", bg: "rgba(229, 57, 53, 0.12)", border: "#E53935", emoji: "🔴" },
    { level: 2, name: "Sacral Chakra", color: "#F57C00", bg: "rgba(245, 124, 0, 0.12)", border: "#F57C00", emoji: "🟠" },
    { level: 3, name: "Solar Plexus", color: "#FBC02D", bg: "rgba(251, 192, 45, 0.18)", border: "#FBC02D", emoji: "🟡" },
    { level: 4, name: "Heart Chakra", color: "#43A047", bg: "rgba(67, 160, 71, 0.12)", border: "#43A047", emoji: "🟢" },
    { level: 5, name: "Throat Chakra", color: "#1E88E5", bg: "rgba(30, 136, 229, 0.12)", border: "#1E88E5", emoji: "🔵" },
    { level: 6, name: "Third Eye", color: "#3F51B5", bg: "rgba(63, 81, 181, 0.12)", border: "#3F51B5", emoji: "🟣" },
    { level: 7, name: "Crown Chakra", color: "#8E24AA", bg: "linear-gradient(135deg, rgba(142,36,170,0.18), rgba(212,175,55,0.22))", border: "#D4AF37", emoji: "👑" }
];

export const DB = {
    getState: () => getState(),
    getMeditationHistory: () => getState().meditationHistory || [],
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

    setDailyGoal: (minutes) => {
        const state = getState();
        if (!state.user) state.user = { name: 'Alex' };
        state.user.dailyCommitment = Math.max(1, parseInt(minutes) || 20);
        saveState(state);
        return state.user.dailyCommitment;
    },

    setDailyReminder: (enabled, timeStr) => {
        const state = getState();
        if (!state.user) state.user = { name: 'Alex' };
        state.user.reminderSchedule = { enabled, time: timeStr || '08:00' };
        saveState(state);
        return state.user.reminderSchedule;
    },

    updateProfileAvatar: (avatarPath) => {
        const state = getState();
        if (!state.user) state.user = { name: 'Alex' };
        state.user.avatar = avatarPath;
        saveState(state);
        return state.user.avatar;
    },

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
        checkAndApplyLevelUpRewards(state, oldLevel, newLevel);
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

        if (activePath === 'tmi' || activePath === 'anapana') {
            comp.inventory.acorns = (comp.inventory.acorns || 0) + 1;
        } else if (activePath === 'vipassana' || activePath === 'metta') {
            comp.inventory.blossoms = (comp.inventory.blossoms || 0) + 1;
        } else if (activePath === 'zen') {
            comp.inventory.nectar = (comp.inventory.nectar || 0) + 1;
        }
        comp.lastUpdated = new Date().toISOString();

        checkAndApplyLevelUpRewards(state, oldLevel, newLevel);
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
            checkAndApplyLevelUpRewards(state, oldLevel, newLevel);
            saveState(state);
            if (leveledUp) {
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('siddha-levelup', {
                        detail: { oldLevel, newLevel, xp: state.xp }
                    }));
                }, 100);
            }
            return { xpEarned: 20, leveledUp };
        }
        return { xpEarned: 0, leveledUp: false };
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
    unlockPath: (pathId) => {
        const state = getState();
        if (!state.unlockedPathIds) state.unlockedPathIds = ['tmi'];
        if (!state.unlockedPathIds.includes(pathId)) {
            state.unlockedPathIds.push(pathId);
            saveState(state);
        }
    },
    isPathUnlocked: (pathId) => {
        const state = getState();
        if (pathId === 'tmi') return true;
        if (state.activePathId === pathId) return true;
        if (state.unlockedPathIds && state.unlockedPathIds.includes(pathId)) return true;
        return false;
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
        state.completedTutorial = false;
        state.readArticles = [];
        saveState(state);
    },

    completeTutorial: () => {
        const state = getState();
        state.completedTutorial = true;
        saveState(state);
    },

    isTutorialCompleted: () => {
        return getState().completedTutorial === true;
    },

    markArticleAsRead: (articleId) => {
        const state = getState();
        if (!state.readArticles) state.readArticles = [];
        if (!state.readArticles.includes(articleId)) {
            state.readArticles.push(articleId);
            saveState(state);
            DB.addXP(15);
            return true;
        }
        return false;
    },

    isArticleRead: (articleId) => {
        const state = getState();
        return (state.readArticles || []).includes(articleId);
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

        if (!state.dailyQuests || state.dailyQuests.completedDate !== todayStr || !state.dailyQuests.quest) {
            const pool = [
                { type: 'sit_commitment', label: `Sit for your daily commitment (${commitment}m)` },
                { type: 'sit_any', label: 'Complete any meditation session' },
                { type: 'log_grateful', label: 'Log a Grateful mood reflection' },
                { type: 'read_wisdom', label: 'Read any Wisdom Library article' },
                { type: 'sit_anapana', label: 'Complete an Anapana session' },
                { type: 'journey_path', label: 'Complete a Journey path session' }
            ];

            const unlocked = state.unlockedPathIds || [];
            if (unlocked.includes('metta')) {
                pool.push({ type: 'sit_metta', label: 'Complete a Kindness (Metta) session' });
            }
            if (unlocked.includes('vipassana')) {
                pool.push({ type: 'sit_vipassana', label: 'Complete an Insight (Vipassana) session' });
            }
            if (unlocked.includes('tmi')) {
                pool.push({ type: 'sit_tmi', label: 'Complete a Focus (TMI) session' });
            }
            if (unlocked.includes('zen')) {
                pool.push({ type: 'sit_zen', label: 'Complete a Stillness (Zen) session' });
            }

            // Pick 1 random quest
            const chosen = pool[Math.floor(Math.random() * pool.length)];

            state.dailyQuests = {
                completedDate: todayStr,
                quest: {
                    type: chosen.type,
                    label: chosen.label,
                    completed: false,
                    claimed: false
                }
            };
            saveState(state);
        }

        const questState = state.dailyQuests;
        const q = questState.quest;
        if (q && !q.completed) {
            const todayHistory = (state.meditationHistory || []).filter(item => toDateStr(item.date) === todayStr);
            const todayReflections = (state.reflectionHistory || []).filter(item => toDateStr(item.date) === todayStr);
            const todayReadArticles = Object.keys(state.readArticlesWithDates || {}).filter(id => state.readArticlesWithDates[id] === todayStr);

            if (q.type === 'sit_commitment') {
                q.completed = todayHistory.some(h => h.duration >= commitment);
            } else if (q.type === 'sit_any') {
                q.completed = todayHistory.length > 0;
            } else if (q.type === 'log_grateful') {
                q.completed = todayReflections.some(r => r.mood === 'grateful');
            } else if (q.type === 'read_wisdom') {
                q.completed = todayReadArticles.length > 0;
            } else if (q.type === 'sit_anapana') {
                q.completed = todayHistory.some(h => h.path === 'anapana');
            } else if (q.type === 'sit_metta') {
                q.completed = todayHistory.some(h => h.path === 'metta');
            } else if (q.type === 'sit_vipassana') {
                q.completed = todayHistory.some(h => h.path === 'vipassana');
            } else if (q.type === 'sit_tmi') {
                q.completed = todayHistory.some(h => h.path === 'tmi');
            } else if (q.type === 'sit_zen') {
                q.completed = todayHistory.some(h => h.path === 'zen');
            } else if (q.type === 'journey_path') {
                q.completed = todayHistory.some(h => h.path && h.path !== 'free' && h.path !== 'standalone');
            }
            if (q.completed) {
                saveState(state);
            }
        }

        return questState;
    },

    claimDailyQuest: () => {
        const state = getState();
        const questState = state.dailyQuests;
        if (questState && questState.quest) {
            const q = questState.quest;
            if (q.completed && !q.claimed) {
                q.claimed = true;
                saveState(state);
                DB.addXP(25);
                return true;
            }
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
    },

    ensureTutorialInventory: () => {
        const state = getState();
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
        
        // Guarantee at least 1 acorn for the companion feeding tutorial
        if ((comp.inventory.acorns || 0) <= 0) {
            comp.inventory.acorns = 1;
        }
        saveState(state);
    },

    saveFeedback: (type, text) => {
        const state = getState();
        if (!state.feedbackHistory) state.feedbackHistory = [];
        const newFeedback = {
            id: 'fb_' + Math.round(Math.random() * 1000000),
            type,
            text,
            timestamp: new Date().toISOString()
        };
        state.feedbackHistory.push(newFeedback);
        saveState(state);
        console.log('[DB] Feedback saved:', newFeedback);
        return newFeedback;
    },

    getFeedbackHistory: () => {
        const state = getState();
        return state.feedbackHistory || [];
    },

    // ── Daily Quest ────────────────────────────────────────────────────────────
    getDailyQuest: () => {
        const state = getState();
        const todayStr = todayDate();

        // Quest pool — rotates by day of year
        const QUESTS = [
            { type: 'meditate', emoji: '🧘', label: 'Complete a meditation session', xp: 30, target: 'breathe' },
            { type: 'reflect',  emoji: '📝', label: 'Log a mood reflection',          xp: 20, target: 'reflect' },
            { type: 'wisdom',   emoji: '📖', label: 'Read a Wisdom Library article',  xp: 25, target: 'wisdom' },
            { type: 'journey',  emoji: '🗺️', label: 'Complete a Journey path sit',     xp: 35, target: 'journey' },
            { type: 'meditate', emoji: '🌿', label: 'Meditate for 10+ minutes',       xp: 40, target: 'breathe' },
            { type: 'reflect',  emoji: '💭', label: 'Write a reflection note',         xp: 20, target: 'reflect' },
            { type: 'meditate', emoji: '🔥', label: 'Extend your daily streak',       xp: 35, target: 'breathe' },
        ];

        // Rotate quest by calendar day
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const quest = QUESTS[dayOfYear % QUESTS.length];

        const dq = state.dailyQuests || {};
        const isTodayClaimed = (dq.completedDate === todayStr) && (dq.questType === quest.type) && (dq.claimed === true);

        // Evaluate dynamic completion for today
        const todayHistory = (state.meditationHistory || []).filter(item => toDateStr(item.date) === todayStr);
        const todayReflections = (state.reflectionHistory || []).filter(item => toDateStr(item.date) === todayStr);
        const todayReadArticles = (state.readArticles || []);

        let isCompleted = false;
        if (quest.type === 'meditate') {
            if (quest.label.includes('10+')) {
                isCompleted = todayHistory.some(h => (h.duration || 0) >= 10);
            } else {
                isCompleted = todayHistory.length > 0;
            }
        } else if (quest.type === 'reflect') {
            isCompleted = todayReflections.length > 0;
        } else if (quest.type === 'wisdom') {
            isCompleted = todayReadArticles.length > 0;
        } else if (quest.type === 'journey') {
            isCompleted = todayHistory.some(h => h.path && h.path !== 'free' && h.path !== 'standalone');
        }

        if (isTodayClaimed) {
            isCompleted = true;
        }

        return {
            ...quest,
            completed: isCompleted,
            claimed: isTodayClaimed,
        };
    },

    claimDailyQuest: (questType) => {
        const state = getState();
        const todayStr = todayDate();
        const dq = state.dailyQuests || {};
        if (dq.claimed && dq.completedDate === todayStr) return false; // already claimed

        const currentQuest = DB.getDailyQuest();
        const xpEarned = currentQuest.xp || 25;

        const oldLevel = state.level;
        state.xp = (state.xp || 0) + xpEarned;
        const newLevel = xpToLevel(state.xp);
        state.level = newLevel;
        checkAndApplyLevelUpRewards(state, oldLevel, newLevel);

        state.dailyQuests = {
            completedDate: todayStr,
            questType: questType || currentQuest.type,
            completed: true,
            claimed: true,
        };
        saveState(state);

        if (newLevel > oldLevel) {
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('siddha-levelup', { detail: { oldLevel, newLevel } }));
            }, 100);
        }

        return xpEarned;
    },


    // ── Achievements & Milestones ──────────────────────────────────────────────
    checkAndTriggerAchievements: (silent = false) => {
        const state = getState();
        if (!state.unlockedAchievements) state.unlockedAchievements = {};
        const newlyUnlocked = [];

        ACHIEVEMENTS.forEach(ach => {
            if (ach.tiers) {
                const val = ach.getValue(state);
                ach.tiers.forEach(t => {
                    const key = `${ach.id}_lvl_${t.level}`;
                    if (val >= t.target && !state.unlockedAchievements[key]) {
                        state.unlockedAchievements[key] = new Date().toISOString();
                        const oldLevel = state.level;
                        state.xp = (state.xp || 0) + t.xp;
                        const newLevel = xpToLevel(state.xp);
                        state.level = newLevel;
                        checkAndApplyLevelUpRewards(state, oldLevel, newLevel);

                        const chakra = CHAKRA_LEVELS[Math.min(6, t.level - 1)];
                        newlyUnlocked.push({
                            id: key,
                            title: `${ach.title} (Level ${t.level})`,
                            desc: `${t.target} milestone reached in ${chakra.name}`,
                            emoji: ach.emoji,
                            xp: t.xp,
                            chakra
                        });

                        if (newLevel > oldLevel && !silent) {
                            setTimeout(() => {
                                window.dispatchEvent(new CustomEvent('siddha-levelup', { detail: { oldLevel, newLevel } }));
                            }, 2500);
                        }
                    }
                });
            } else if (!state.unlockedAchievements[ach.id]) {
                if (ach.check(state)) {
                    state.unlockedAchievements[ach.id] = new Date().toISOString();
                    const oldLevel = state.level;
                    state.xp = (state.xp || 0) + ach.xp;
                    const newLevel = xpToLevel(state.xp);
                    state.level = newLevel;
                    checkAndApplyLevelUpRewards(state, oldLevel, newLevel);

                    newlyUnlocked.push({
                        id: ach.id,
                        title: ach.title,
                        desc: ach.desc,
                        emoji: ach.emoji,
                        xp: ach.xp
                    });

                    if (newLevel > oldLevel && !silent) {
                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('siddha-levelup', { detail: { oldLevel, newLevel } }));
                        }, 2500);
                    }
                }
            }
        });

        if (newlyUnlocked.length > 0) {
            saveState(state);
            if (!silent) {
                newlyUnlocked.forEach((ach, index) => {
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('siddha-achievement', { detail: ach }));
                    }, index * 500);
                });
            }
        }
    },

    getAchievementsState: () => {
        const state = getState();
        if (!state.unlockedAchievements) state.unlockedAchievements = {};

        return ACHIEVEMENTS.map(ach => {
            if (ach.tiers) {
                const val = ach.getValue(state);
                let currentLevel = 0;
                ach.tiers.forEach(t => {
                    if (val >= t.target) currentLevel = t.level;
                });

                const maxLevel = ach.tiers.length;
                const nextTier = ach.tiers.find(t => t.level === currentLevel + 1) || ach.tiers[maxLevel - 1];
                const currentTier = ach.tiers.find(t => t.level === currentLevel) || { level: 0, target: 0, xp: 0 };
                const chakra = CHAKRA_LEVELS[Math.min(6, Math.max(0, (currentLevel > 0 ? currentLevel - 1 : 0)))] || CHAKRA_LEVELS[0];

                return {
                    id: ach.id,
                    title: ach.title,
                    desc: ach.desc,
                    emoji: ach.emoji,
                    isTiered: true,
                    currentLevel,
                    maxLevel,
                    val,
                    target: nextTier.target,
                    currentTier,
                    nextTier,
                    chakra,
                    unlocked: currentLevel > 0
                };
            } else {
                const unlocked = !!state.unlockedAchievements[ach.id];
                const prog = ach.progress(state);
                return {
                    id: ach.id,
                    title: ach.title,
                    desc: ach.desc,
                    emoji: ach.emoji,
                    xp: ach.xp,
                    unlocked,
                    unlockDate: state.unlockedAchievements[ach.id] || null,
                    val: prog.current,
                    target: prog.target
                };
            }
        });
    },

    // Cosmetics (Future IAP Integration)
    getCosmeticsState: () => {
        const state = getState();
        if (!state.cosmetics) {
            state.cosmetics = {
                unlockedSkins: ['default'],
                activeSkin: 'default',
                unlockedSounds: ['default_bell'],
                activeSound: 'default_bell',
                unlockedThemes: ['default'],
                activeTheme: 'default'
            };
        }
        return state.cosmetics;
    },

    unlockCosmetic: (type, id) => {
        const state = getState();
        if (!state.cosmetics) {
            state.cosmetics = {
                unlockedSkins: ['default'],
                activeSkin: 'default',
                unlockedSounds: ['default_bell'],
                activeSound: 'default_bell',
                unlockedThemes: ['default'],
                activeTheme: 'default'
            };
        }
        
        let listKey = type === 'skin' ? 'unlockedSkins' : (type === 'sound' ? 'unlockedSounds' : 'unlockedThemes');
        if (state.cosmetics[listKey] && !state.cosmetics[listKey].includes(id)) {
            state.cosmetics[listKey].push(id);
            saveState(state);
            return true;
        }
        return false;
    },

    selectCosmetic: (type, id) => {
        const state = getState();
        if (!state.cosmetics) return false;
        
        let activeKey = type === 'skin' ? 'activeSkin' : (type === 'sound' ? 'activeSound' : 'activeTheme');
        let listKey = type === 'skin' ? 'unlockedSkins' : (type === 'sound' ? 'unlockedSounds' : 'unlockedThemes');
        
        if (state.cosmetics[listKey] && state.cosmetics[listKey].includes(id)) {
            state.cosmetics[activeKey] = id;
            saveState(state);
            return true;
        }
        return false;
    }
};

// Constant definition of all achievements
const ACHIEVEMENTS = [
    {
        id: 'sits_milestone',
        title: 'Meditation Sits',
        desc: 'Accumulate completed meditation sessions',
        emoji: '🧘',
        tiers: [
            { level: 1, target: 1, xp: 20 },
            { level: 2, target: 5, xp: 30 },
            { level: 3, target: 10, xp: 40 },
            { level: 4, target: 25, xp: 60 },
            { level: 5, target: 50, xp: 80 },
            { level: 6, target: 100, xp: 120 },
            { level: 7, target: 250, xp: 200 }
        ],
        getValue: (state) => (state.meditationHistory || []).length
    },
    {
        id: 'minutes_milestone',
        title: 'Mindful Minutes',
        desc: 'Accumulate total minutes spent in quiet sit',
        emoji: '⏱️',
        tiers: [
            { level: 1, target: 10, xp: 20 },
            { level: 2, target: 50, xp: 30 },
            { level: 3, target: 100, xp: 40 },
            { level: 4, target: 250, xp: 60 },
            { level: 5, target: 500, xp: 80 },
            { level: 6, target: 1000, xp: 120 },
            { level: 7, target: 2500, xp: 200 }
        ],
        getValue: (state) => (state.meditationHistory || []).reduce((sum, s) => sum + (s.duration || 0), 0)
    },
    {
        id: 'streak_milestone',
        title: 'Streak Keeper',
        desc: 'Maintain consecutive daily sit practice',
        emoji: '🔥',
        tiers: [
            { level: 1, target: 1, xp: 15 },
            { level: 2, target: 3, xp: 25 },
            { level: 3, target: 7, xp: 40 },
            { level: 4, target: 14, xp: 60 },
            { level: 5, target: 30, xp: 90 },
            { level: 6, target: 60, xp: 140 },
            { level: 7, target: 108, xp: 250 }
        ],
        getValue: (state) => state.streak || 0
    },
    {
        id: 'pathways_milestone',
        title: 'Path Explorer',
        desc: 'Practice across unlocked meditation lineages',
        emoji: '🧭',
        tiers: [
            { level: 1, target: 1, xp: 20 },
            { level: 2, target: 2, xp: 30 },
            { level: 3, target: 3, xp: 40 },
            { level: 4, target: 4, xp: 50 },
            { level: 5, target: 5, xp: 70 },
            { level: 6, target: 6, xp: 90 },
            { level: 7, target: 7, xp: 120 }
        ],
        getValue: (state) => (state.unlockedPathIds || ['anapana']).length
    },
    {
        id: 'reflections_milestone',
        title: 'Reflective Soul',
        desc: 'Log post-meditation mood & mind reflections',
        emoji: '📝',
        tiers: [
            { level: 1, target: 1, xp: 15 },
            { level: 2, target: 3, xp: 25 },
            { level: 3, target: 5, xp: 35 },
            { level: 4, target: 10, xp: 50 },
            { level: 5, target: 20, xp: 75 },
            { level: 6, target: 35, xp: 100 },
            { level: 7, target: 50, xp: 150 }
        ],
        getValue: (state) => (state.reflectionHistory || []).length
    },
    {
        id: 'wisdom_seeker',
        title: 'Wisdom Seeker',
        desc: 'Read articles from the Wisdom Library',
        emoji: '📖',
        tiers: [
            { level: 1, target: 1, xp: 15 },
            { level: 2, target: 3, xp: 25 },
            { level: 3, target: 5, xp: 35 },
            { level: 4, target: 8, xp: 50 },
            { level: 5, target: 12, xp: 75 },
            { level: 6, target: 16, xp: 100 },
            { level: 7, target: 20, xp: 150 }
        ],
        getValue: (state) => (state.readArticles || []).length
    }
];
