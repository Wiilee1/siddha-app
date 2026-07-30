(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/services/db.js
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
  function xpForNextLevel(xp) {
    const currentLevel = xpToLevel(xp);
    const nextIdx = currentLevel + 1;
    if (nextIdx >= LEVEL_THRESHOLDS.length) {
      const extra = nextIdx - LEVEL_THRESHOLDS.length + 1;
      return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + extra * 2e3;
    }
    return LEVEL_THRESHOLDS[nextIdx];
  }
  function xpInCurrentLevel(xp) {
    const currentLevel = xpToLevel(xp);
    const base = LEVEL_THRESHOLDS[Math.min(currentLevel, LEVEL_THRESHOLDS.length - 1)];
    const next = xpForNextLevel(xp);
    return { earned: xp - base, needed: next - base };
  }
  function getState() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
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
  function toDateStr(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  }
  function checkAndApplyLevelUpRewards(state, oldLevel, newLevel) {
    if (newLevel > oldLevel) {
      if (!state.companion) {
        state.companion = {
          nourish: 45,
          aura: 55,
          sync: 10,
          inventory: { acorns: 1, blossoms: 1, nectar: 0 },
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
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
      comp.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      return true;
    }
    return false;
  }
  var DB_KEY, LEVEL_THRESHOLDS, defaultState, todayDate, CHAKRA_LEVELS, DB, ACHIEVEMENTS;
  var init_db = __esm({
    "src/services/db.js"() {
      DB_KEY = "siddha_db";
      LEVEL_THRESHOLDS = [
        0,
        // level 0 (unused)
        0,
        // level 1: starts here
        100,
        // level 2
        250,
        // level 3
        450,
        // level 4
        700,
        // level 5
        1e3,
        // level 6
        1400,
        // level 7
        1900,
        // level 8
        2500,
        // level 9
        3200,
        // level 10
        4e3,
        // level 11
        5e3,
        // level 12
        6200,
        // level 13
        7600,
        // level 14
        9200
        // level 15
      ];
      defaultState = {
        user: null,
        completedTutorial: false,
        xp: 0,
        streak: 0,
        level: 1,
        meditationHistory: [],
        reflectionHistory: [],
        feedbackHistory: [],
        missionProgress: {},
        // { nodeId_pathId: [missionIndex,...] }
        lastLogin: null,
        activePathId: "anapana",
        // currently selected journey path
        unlockedPathIds: ["anapana"],
        // paths unlocked by the user
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
          unlockedSkins: ["default"],
          activeSkin: "default",
          unlockedSounds: ["default_bell"],
          activeSound: "default_bell",
          unlockedThemes: ["default"],
          activeTheme: "default"
        },
        readArticles: [],
        unlockedAchievements: {}
        // stores { id: unlockTimestamp }
      };
      todayDate = () => toDateStr(/* @__PURE__ */ new Date());
      CHAKRA_LEVELS = [
        { level: 1, name: "Root Chakra", color: "#E53935", bg: "rgba(229, 57, 53, 0.12)", border: "#E53935", emoji: "\u{1F534}" },
        { level: 2, name: "Sacral Chakra", color: "#F57C00", bg: "rgba(245, 124, 0, 0.12)", border: "#F57C00", emoji: "\u{1F7E0}" },
        { level: 3, name: "Solar Plexus", color: "#FBC02D", bg: "rgba(251, 192, 45, 0.18)", border: "#FBC02D", emoji: "\u{1F7E1}" },
        { level: 4, name: "Heart Chakra", color: "#43A047", bg: "rgba(67, 160, 71, 0.12)", border: "#43A047", emoji: "\u{1F7E2}" },
        { level: 5, name: "Throat Chakra", color: "#1E88E5", bg: "rgba(30, 136, 229, 0.12)", border: "#1E88E5", emoji: "\u{1F535}" },
        { level: 6, name: "Third Eye", color: "#3F51B5", bg: "rgba(63, 81, 181, 0.12)", border: "#3F51B5", emoji: "\u{1F7E3}" },
        { level: 7, name: "Crown Chakra", color: "#8E24AA", bg: "linear-gradient(135deg, rgba(142,36,170,0.18), rgba(212,175,55,0.22))", border: "#D4AF37", emoji: "\u{1F451}" }
      ];
      DB = {
        getState: () => getState(),
        getMeditationHistory: () => getState().meditationHistory || [],
        // Auth
        login: async (userData) => {
          const state = getState();
          state.user = userData;
          state.lastLogin = (/* @__PURE__ */ new Date()).toISOString();
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
          if (!state.user) state.user = { name: "Alex" };
          state.user.dailyCommitment = Math.max(1, parseInt(minutes) || 20);
          saveState(state);
          return state.user.dailyCommitment;
        },
        setDailyReminder: (enabled, timeStr) => {
          const state = getState();
          if (!state.user) state.user = { name: "Alex" };
          state.user.reminderSchedule = { enabled, time: timeStr || "08:00" };
          if (!state.user.notificationSettings) {
            state.user.notificationSettings = {
              dailyReminderEnabled: enabled,
              reminderTime: timeStr || "08:00",
              sessionCompletionEnabled: true,
              vibrationEnabled: true
            };
          } else {
            state.user.notificationSettings.dailyReminderEnabled = enabled;
            state.user.notificationSettings.reminderTime = timeStr || "08:00";
          }
          saveState(state);
          return state.user.reminderSchedule;
        },
        getNotificationSettings: () => {
          const state = getState();
          const user = state.user || {};
          const reminder = user.reminderSchedule || {};
          const notif = user.notificationSettings || {};
          let reminders = notif.reminders;
          if (!reminders || !Array.isArray(reminders) || reminders.length === 0) {
            reminders = [
              {
                id: "rem_default",
                time: notif.reminderTime || reminder.time || "08:00",
                enabled: notif.dailyReminderEnabled ?? (reminder.enabled ?? false)
              }
            ];
          }
          return {
            reminders,
            dailyReminderEnabled: reminders.some((r) => r.enabled),
            sessionCompletionEnabled: notif.sessionCompletionEnabled ?? true,
            vibrationEnabled: notif.vibrationEnabled ?? true
          };
        },
        setNotificationSettings: (settings) => {
          const state = getState();
          if (!state.user) state.user = { name: "Alex" };
          const current = DB.getNotificationSettings();
          state.user.notificationSettings = {
            ...current,
            ...settings
          };
          const activeReminder = (state.user.notificationSettings.reminders || []).find((r) => r.enabled);
          state.user.reminderSchedule = {
            enabled: !!activeReminder,
            time: activeReminder ? activeReminder.time : "08:00"
          };
          saveState(state);
          return state.user.notificationSettings;
        },
        updateProfileAvatar: (avatarPath) => {
          const state = getState();
          if (!state.user) state.user = { name: "Alex" };
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
            const dates = [...new Set(history.map((item) => toDateStr(item.date)))].filter(Boolean).sort((a, b) => b.localeCompare(a));
            const todayStr2 = toDateStr(/* @__PURE__ */ new Date());
            const yesterday = /* @__PURE__ */ new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = toDateStr(yesterday);
            if (dates.length > 0 && (dates[0] === todayStr2 || dates[0] === yesterdayStr)) {
              let checkDate = dates[0] === yesterdayStr ? new Date(yesterday) : /* @__PURE__ */ new Date();
              while (true) {
                const expectedStr = toDateStr(checkDate);
                if (dates.includes(expectedStr)) {
                  streak++;
                  checkDate.setDate(checkDate.getDate() - 1);
                } else {
                  break;
                }
              }
            }
          }
          state.streak = streak;
          saveState(state);
          const todayStr = toDateStr(/* @__PURE__ */ new Date());
          const todayMinutes = history.filter((item) => toDateStr(item.date) === todayStr).reduce((acc, cur) => acc + (cur.duration || 0), 0);
          const weekData = [0, 0, 0, 0, 0, 0, 0];
          const now = /* @__PURE__ */ new Date();
          const dayOfWeek = now.getDay();
          const monday = new Date(now);
          monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
          monday.setHours(0, 0, 0, 0);
          let weekSessions = 0;
          history.forEach((item) => {
            const d = new Date(item.date);
            const diff = Math.floor((d - monday) / (1e3 * 60 * 60 * 24));
            if (diff >= 0 && diff < 7) {
              weekData[diff] += item.duration || 0;
              if (item.type === "meditation") {
                weekSessions++;
              }
            }
          });
          let daysSinceLastSession = 0;
          if (history.length > 0) {
            const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
            const lastSessionDate = new Date(sortedHistory[0].date);
            lastSessionDate.setHours(0, 0, 0, 0);
            const today = /* @__PURE__ */ new Date();
            today.setHours(0, 0, 0, 0);
            daysSinceLastSession = Math.floor((today - lastSessionDate) / (1e3 * 60 * 60 * 24));
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
              window.dispatchEvent(new CustomEvent("siddha-levelup", {
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
          const activePath = state.activePathId || "tmi";
          state.meditationHistory.push({
            date: (/* @__PURE__ */ new Date()).toISOString(),
            duration: durationMins,
            type: "meditation",
            path: activePath
          });
          const xpEarned = durationMins * 5;
          state.xp += xpEarned;
          const newLevel = xpToLevel(state.xp);
          const leveledUp = newLevel > oldLevel;
          state.level = newLevel;
          if (!state.companion) {
            state.companion = {
              nourish: 45,
              aura: 55,
              sync: 10,
              inventory: { acorns: 1, blossoms: 1, nectar: 0 },
              lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
            };
          }
          const comp = state.companion;
          if (!comp.inventory) comp.inventory = { acorns: 1, blossoms: 1, nectar: 0 };
          const syncBoost = durationMins * 3;
          comp.sync = Math.min(100, (comp.sync || 0) + syncBoost);
          if (activePath === "tmi" || activePath === "anapana") {
            comp.inventory.acorns = (comp.inventory.acorns || 0) + 1;
          } else if (activePath === "vipassana" || activePath === "metta") {
            comp.inventory.blossoms = (comp.inventory.blossoms || 0) + 1;
          } else if (activePath === "zen") {
            comp.inventory.nectar = (comp.inventory.nectar || 0) + 1;
          }
          comp.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
          checkAndApplyLevelUpRewards(state, oldLevel, newLevel);
          saveState(state);
          if (leveledUp) {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent("siddha-levelup", {
                detail: { oldLevel, newLevel, xp: state.xp }
              }));
            }, 100);
          }
          return xpEarned;
        },
        // Missions — keyed by `${pathId}_${nodeId}`
        completeMission: (nodeId, missionIndex, pathId = "tmi") => {
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
                window.dispatchEvent(new CustomEvent("siddha-levelup", {
                  detail: { oldLevel, newLevel, xp: state.xp }
                }));
              }, 100);
            }
            return { xpEarned: 20, leveledUp };
          }
          return { xpEarned: 0, leveledUp: false };
        },
        isMissionComplete: (nodeId, missionIndex, pathId = "tmi") => {
          const state = getState();
          const key = `${pathId}_${nodeId}`;
          if (!state.missionProgress || !state.missionProgress[key]) return false;
          return state.missionProgress[key].includes(missionIndex);
        },
        getMissionProgress: (pathId = "tmi") => {
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
        getActivePath: () => getState().activePathId || "tmi",
        setActivePath: (pathId) => {
          const state = getState();
          state.activePathId = pathId;
          saveState(state);
        },
        unlockPath: (pathId) => {
          const state = getState();
          if (!state.unlockedPathIds) state.unlockedPathIds = ["tmi"];
          if (!state.unlockedPathIds.includes(pathId)) {
            state.unlockedPathIds.push(pathId);
            saveState(state);
          }
        },
        isPathUnlocked: (pathId) => {
          const state = getState();
          if (pathId === "tmi") return true;
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
            date: (/* @__PURE__ */ new Date()).toISOString()
          });
          saveState(state);
        },
        getReflections: () => {
          const state = getState();
          return [...state.reflectionHistory || []].reverse();
        },
        saveFeedback: (item, maybeText) => {
          const state = getState();
          if (!state.feedbackHistory) state.feedbackHistory = [];
          const payload = typeof item === "object" && item !== null ? item : { type: item, text: maybeText };
          const entry = {
            id: "fb_" + Date.now(),
            date: (/* @__PURE__ */ new Date()).toISOString(),
            ...payload
          };
          state.feedbackHistory.push(entry);
          saveState(state);
          return entry;
        },
        getFeedbackHistory: () => {
          const state = getState();
          return [...state.feedbackHistory || []].reverse();
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
          state.dailyQuests = { completedDate: null, questType: null, label: "", completed: false, claimed: false };
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
          const todayStr = todayDate();
          if (!state.readArticles) state.readArticles = [];
          if (!state.readArticlesWithDates) state.readArticlesWithDates = {};
          state.readArticlesWithDates[articleId] = todayStr;
          if (!state.readArticles.includes(articleId)) {
            state.readArticles.push(articleId);
            saveState(state);
            DB.addXP(15);
            return true;
          }
          saveState(state);
          return true;
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
              lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
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
              const nourishDecay = Math.floor(diffMs / 45e3);
              const auraDecay = Math.floor(diffMs / 6e4);
              if (nourishDecay > 0) {
                comp.nourish = Math.max(10, comp.nourish - nourishDecay);
              }
              if (auraDecay > 0) {
                comp.aura = Math.max(10, comp.aura - auraDecay);
              }
              if (nourishDecay > 0 || auraDecay > 0) {
                comp.lastUpdated = new Date(last + Math.max(nourishDecay * 45e3, auraDecay * 6e4)).toISOString();
                saveState(state);
              }
            }
          } else {
            comp.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
            saveState(state);
          }
          return comp;
        },
        petCompanion: () => {
          const state = getState();
          if (!state.companion) state.companion = { nourish: 45, aura: 55, sync: 10, inventory: { acorns: 1, blossoms: 1, nectar: 0 } };
          state.companion.aura = Math.min(100, (state.companion.aura || 0) + 8);
          state.companion.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
          saveState(state);
          return state.companion;
        },
        ringChime: () => {
          const state = getState();
          if (!state.companion) state.companion = { nourish: 45, aura: 55, sync: 10, inventory: { acorns: 1, blossoms: 1, nectar: 0 } };
          state.companion.aura = Math.min(100, (state.companion.aura || 0) + 5);
          state.companion.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
          saveState(state);
          return state.companion;
        },
        feedCompanion: (itemType) => {
          const state = getState();
          if (!state.companion) return null;
          const comp = state.companion;
          if (!comp.inventory || !comp.inventory[itemType] || comp.inventory[itemType] <= 0) return null;
          comp.inventory[itemType]--;
          if (itemType === "acorns") {
            comp.nourish = Math.min(100, (comp.nourish || 0) + 25);
            comp.aura = Math.min(100, (comp.aura || 0) + 5);
          } else if (itemType === "blossoms") {
            comp.nourish = Math.min(100, (comp.nourish || 0) + 35);
            comp.aura = Math.min(100, (comp.aura || 0) + 10);
          } else if (itemType === "nectar") {
            comp.nourish = Math.min(100, (comp.nourish || 0) + 50);
            comp.aura = Math.min(100, (comp.aura || 0) + 20);
          }
          comp.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
          saveState(state);
          return comp;
        },
        // Daily Quests
        getDailyQuestState: () => {
          const quest = DB.getDailyQuest();
          return {
            completedDate: todayDate(),
            quest
          };
        },
        devSimulateTimePassing: (days) => {
          const state = getState();
          const shiftDate = (dStr) => {
            const d = new Date(dStr);
            d.setDate(d.getDate() - days);
            return d.toISOString();
          };
          if (state.meditationHistory.length === 0) {
            state.meditationHistory.push({ date: (/* @__PURE__ */ new Date()).toISOString(), duration: 5, type: "meditation" });
          }
          state.meditationHistory.forEach((s) => s.date = shiftDate(s.date));
          state.reflectionHistory.forEach((s) => s.date = shiftDate(s.date));
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
              lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
            };
          }
          const comp = state.companion;
          if (!comp.inventory) comp.inventory = { acorns: 1, blossoms: 1, nectar: 0 };
          if ((comp.inventory.acorns || 0) <= 0) {
            comp.inventory.acorns = 1;
          }
          saveState(state);
        },
        // ── Daily Quest ────────────────────────────────────────────────────────────
        getDailyQuest: () => {
          const state = getState();
          const todayStr = todayDate();
          const QUESTS = [
            { type: "meditate", emoji: "\u{1F9D8}", label: "Complete a meditation session", xp: 30, target: "breathe" },
            { type: "reflect", emoji: "\u{1F4DD}", label: "Log a mood reflection", xp: 20, target: "reflect" },
            { type: "wisdom", emoji: "\u{1F4D6}", label: "Read a Wisdom Library article", xp: 25, target: "wisdom" },
            { type: "journey", emoji: "\u{1F5FA}\uFE0F", label: "Complete a Journey path sit", xp: 35, target: "journey" },
            { type: "meditate", emoji: "\u{1F33F}", label: "Meditate for 10+ minutes", xp: 40, target: "breathe" },
            { type: "reflect", emoji: "\u{1F4AD}", label: "Write a reflection note", xp: 20, target: "reflect" },
            { type: "meditate", emoji: "\u{1F525}", label: "Extend your daily streak", xp: 35, target: "breathe" }
          ];
          const dayOfYear = Math.floor((/* @__PURE__ */ new Date() - new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 0)) / 864e5);
          const quest = QUESTS[dayOfYear % QUESTS.length];
          const dq = state.dailyQuests || {};
          const isTodayClaimed = dq.completedDate === todayStr && dq.questType === quest.type && dq.claimed === true;
          const todayHistory = (state.meditationHistory || []).filter((item) => toDateStr(item.date) === todayStr);
          const todayReflections = (state.reflectionHistory || []).filter((item) => toDateStr(item.date) === todayStr);
          const todayReadArticles = Object.keys(state.readArticlesWithDates || {}).filter((id) => state.readArticlesWithDates[id] === todayStr);
          let isCompleted = false;
          if (quest.type === "meditate") {
            if (quest.label.includes("10+")) {
              isCompleted = todayHistory.some((h) => (h.duration || 0) >= 10);
            } else {
              isCompleted = todayHistory.length > 0;
            }
          } else if (quest.type === "reflect") {
            isCompleted = todayReflections.length > 0;
          } else if (quest.type === "wisdom") {
            isCompleted = todayReadArticles.length > 0;
          } else if (quest.type === "journey") {
            isCompleted = todayHistory.some((h) => h.path && h.path !== "free" && h.path !== "standalone");
          }
          if (isTodayClaimed) {
            isCompleted = true;
          }
          return {
            ...quest,
            completed: isCompleted,
            claimed: isTodayClaimed
          };
        },
        claimDailyQuest: (questType) => {
          const state = getState();
          const todayStr = todayDate();
          const dq = state.dailyQuests || {};
          if (dq.claimed && dq.completedDate === todayStr) return false;
          const currentQuest = DB.getDailyQuest();
          if (!currentQuest || !currentQuest.completed || currentQuest.claimed) {
            console.warn("[DB] Attempted to claim incomplete daily quest:", currentQuest);
            return false;
          }
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
            claimed: true
          };
          saveState(state);
          if (newLevel > oldLevel) {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent("siddha-levelup", { detail: { oldLevel, newLevel } }));
            }, 100);
          }
          return xpEarned;
        },
        // ── Achievements & Milestones ──────────────────────────────────────────────
        checkAndTriggerAchievements: (silent = false) => {
          const state = getState();
          if (!state.unlockedAchievements) state.unlockedAchievements = {};
          const newlyUnlocked = [];
          ACHIEVEMENTS.forEach((ach) => {
            if (ach.tiers) {
              const val = ach.getValue(state);
              ach.tiers.forEach((t) => {
                const key = `${ach.id}_lvl_${t.level}`;
                if (val >= t.target && !state.unlockedAchievements[key]) {
                  state.unlockedAchievements[key] = (/* @__PURE__ */ new Date()).toISOString();
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
                      window.dispatchEvent(new CustomEvent("siddha-levelup", { detail: { oldLevel, newLevel } }));
                    }, 2500);
                  }
                }
              });
            } else if (!state.unlockedAchievements[ach.id]) {
              if (ach.check(state)) {
                state.unlockedAchievements[ach.id] = (/* @__PURE__ */ new Date()).toISOString();
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
                    window.dispatchEvent(new CustomEvent("siddha-levelup", { detail: { oldLevel, newLevel } }));
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
                  window.dispatchEvent(new CustomEvent("siddha-achievement", { detail: ach }));
                }, index * 500);
              });
            }
          }
        },
        getAchievementsState: () => {
          const state = getState();
          if (!state.unlockedAchievements) state.unlockedAchievements = {};
          return ACHIEVEMENTS.map((ach) => {
            if (ach.tiers) {
              const val = ach.getValue(state);
              let currentLevel = 0;
              ach.tiers.forEach((t) => {
                if (val >= t.target) currentLevel = t.level;
              });
              const maxLevel = ach.tiers.length;
              const nextTier = ach.tiers.find((t) => t.level === currentLevel + 1) || ach.tiers[maxLevel - 1];
              const currentTier = ach.tiers.find((t) => t.level === currentLevel) || { level: 0, target: 0, xp: 0 };
              const chakra = CHAKRA_LEVELS[Math.min(6, Math.max(0, currentLevel > 0 ? currentLevel - 1 : 0))] || CHAKRA_LEVELS[0];
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
              unlockedSkins: ["default"],
              activeSkin: "default",
              unlockedSounds: ["default_bell"],
              activeSound: "default_bell",
              unlockedThemes: ["default"],
              activeTheme: "default"
            };
          }
          return state.cosmetics;
        },
        unlockCosmetic: (type, id) => {
          const state = getState();
          if (!state.cosmetics) {
            state.cosmetics = {
              unlockedSkins: ["default"],
              activeSkin: "default",
              unlockedSounds: ["default_bell"],
              activeSound: "default_bell",
              unlockedThemes: ["default"],
              activeTheme: "default"
            };
          }
          let listKey = type === "skin" ? "unlockedSkins" : type === "sound" ? "unlockedSounds" : "unlockedThemes";
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
          let activeKey = type === "skin" ? "activeSkin" : type === "sound" ? "activeSound" : "activeTheme";
          let listKey = type === "skin" ? "unlockedSkins" : type === "sound" ? "unlockedSounds" : "unlockedThemes";
          if (state.cosmetics[listKey] && state.cosmetics[listKey].includes(id)) {
            state.cosmetics[activeKey] = id;
            saveState(state);
            return true;
          }
          return false;
        }
      };
      ACHIEVEMENTS = [
        {
          id: "sits_milestone",
          title: "Meditation Sits",
          desc: "Accumulate completed meditation sessions",
          emoji: "\u{1F9D8}",
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
          id: "minutes_milestone",
          title: "Mindful Minutes",
          desc: "Accumulate total minutes spent in quiet sit",
          emoji: "\u23F1\uFE0F",
          tiers: [
            { level: 1, target: 10, xp: 20 },
            { level: 2, target: 50, xp: 30 },
            { level: 3, target: 100, xp: 40 },
            { level: 4, target: 250, xp: 60 },
            { level: 5, target: 500, xp: 80 },
            { level: 6, target: 1e3, xp: 120 },
            { level: 7, target: 2500, xp: 200 }
          ],
          getValue: (state) => (state.meditationHistory || []).reduce((sum, s) => sum + (s.duration || 0), 0)
        },
        {
          id: "streak_milestone",
          title: "Streak Keeper",
          desc: "Maintain consecutive daily sit practice",
          emoji: "\u{1F525}",
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
          id: "pathways_milestone",
          title: "Path Explorer",
          desc: "Practice across unlocked meditation lineages",
          emoji: "\u{1F9ED}",
          tiers: [
            { level: 1, target: 1, xp: 20 },
            { level: 2, target: 2, xp: 30 },
            { level: 3, target: 3, xp: 40 },
            { level: 4, target: 4, xp: 50 },
            { level: 5, target: 5, xp: 70 },
            { level: 6, target: 6, xp: 90 },
            { level: 7, target: 7, xp: 120 }
          ],
          getValue: (state) => (state.unlockedPathIds || ["anapana"]).length
        },
        {
          id: "reflections_milestone",
          title: "Reflective Soul",
          desc: "Log post-meditation mood & mind reflections",
          emoji: "\u{1F4DD}",
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
          id: "wisdom_seeker",
          title: "Wisdom Seeker",
          desc: "Read articles from the Wisdom Library",
          emoji: "\u{1F4D6}",
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
    }
  });

  // src/services/synth.js
  var synth_exports = {};
  __export(synth_exports, {
    MenuMusic: () => MenuMusic,
    NatureMusic: () => NatureMusic,
    SitAudioKeepAlive: () => SitAudioKeepAlive,
    Synth: () => Synth
  });
  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }
  function ensureSilentKeepAlive() {
    try {
      if (!silentAudioEl) {
        silentAudioEl = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
        silentAudioEl.loop = true;
        silentAudioEl.volume = 1e-4;
      }
      silentAudioEl.play().catch(() => {
      });
      if ("mediaSession" in navigator) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: "Meditation Sit \u{1F9D8}",
            artist: "Siddha Mindfulness",
            album: "Mindful Practice"
          });
          navigator.mediaSession.playbackState = "playing";
        } catch (e) {
        }
      }
    } catch (e) {
    }
  }
  function stopSilentKeepAlive() {
    if (silentAudioEl) {
      try {
        silentAudioEl.pause();
        silentAudioEl.currentTime = 0;
      } catch (e) {
      }
    }
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = "paused";
      } catch (e) {
      }
    }
  }
  function playBellAudioWithFade(audioKey, fadeAfterMs = 4500, fadeDurationMs = 2e3) {
    if (localStorage.getItem("siddha_sound_meditation_muted") === "true" || localStorage.getItem("siddha_sound_muted") === "true") return;
    try {
      if (!BELL_AUDIO[audioKey]) {
        BELL_AUDIO[audioKey] = new Audio(BELL_SOURCES[audioKey]);
        BELL_AUDIO[audioKey].preload = "auto";
      }
      const audio = BELL_AUDIO[audioKey];
      if (audio.fadeInterval) clearInterval(audio.fadeInterval);
      if (audio.fadeTimeout) clearTimeout(audio.fadeTimeout);
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      audio.volume = getScaledGain(0.75);
      const playPromise = audio.play();
      if (playPromise !== void 0) {
        playPromise.catch((e) => {
          console.warn(`[Synth] ${audioKey} bell play blocked:`, e);
        });
      }
      if (audio.fadeInterval) clearInterval(audio.fadeInterval);
      if (audio.fadeTimeout) clearTimeout(audio.fadeTimeout);
      if (fadeAfterMs > 0) {
        audio.fadeTimeout = setTimeout(() => {
          if (!audio || audio.paused) return;
          const startVol = audio.volume;
          const steps = 20;
          const stepTime = fadeDurationMs / steps;
          let step = 0;
          audio.fadeInterval = setInterval(() => {
            step++;
            const newVol = Math.max(0, startVol * (1 - step / steps));
            if (audio) audio.volume = newVol;
            if (step >= steps) {
              clearInterval(audio.fadeInterval);
              if (audio) {
                audio.pause();
                audio.currentTime = 0;
              }
            }
          }, stepTime);
        }, fadeAfterMs);
      }
    } catch (e) {
      console.warn("[Synth] Error playing bell:", e);
    }
  }
  function getScaledGain(rawVol) {
    const v = Math.max(0, Math.min(1, parseFloat(rawVol)));
    if (v === 0) return 0;
    return Math.pow(v, 2.4) * 0.08;
  }
  var audioCtx, synthNodes, chimeInterval, silentAudioEl, BELL_SOURCES, BELL_AUDIO, Synth, MENU_TRACKS, bgAudioEl, currentTrackIdx, MenuMusic, NATURE_TRACKS, natureAudioEl, currentNatureIdx, NatureMusic, SitAudioKeepAlive;
  var init_synth = __esm({
    "src/services/synth.js"() {
      audioCtx = null;
      synthNodes = [];
      chimeInterval = null;
      silentAudioEl = null;
      BELL_SOURCES = {
        start: "./src/assets/audio/start_bell.mp3",
        interval: "./src/assets/audio/interval_bell.mp3",
        end: "./src/assets/audio/end_bell.mp3"
      };
      BELL_AUDIO = {
        start: null,
        interval: null,
        end: null
      };
      Synth = {
        ensureKeepAlive: () => {
          initAudioContext();
          ensureSilentKeepAlive();
        },
        stopKeepAlive: () => {
          stopSilentKeepAlive();
        },
        start: (type) => {
          if (window.Capacitor?.getPlatform() === "ios") {
            console.log("[Synth iOS] Soundscapes are disabled on iOS:", type);
            return;
          }
          initAudioContext();
          Synth.stop();
          if (!type || type === "none") return;
          try {
            if (type === "cosmic-drone" || type === "drone") {
              const osc1 = audioCtx.createOscillator();
              const osc2 = audioCtx.createOscillator();
              const gain1 = audioCtx.createGain();
              const gain2 = audioCtx.createGain();
              const filter = audioCtx.createBiquadFilter();
              osc1.type = "sine";
              osc1.frequency.setValueAtTime(110, audioCtx.currentTime);
              osc2.type = "sine";
              osc2.frequency.setValueAtTime(110.5, audioCtx.currentTime);
              gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
              gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
              filter.type = "lowpass";
              filter.frequency.setValueAtTime(180, audioCtx.currentTime);
              osc1.connect(gain1);
              osc2.connect(gain2);
              gain1.connect(filter);
              gain2.connect(filter);
              filter.connect(audioCtx.destination);
              osc1.start();
              osc2.start();
              synthNodes.push(osc1, osc2, gain1, gain2, filter);
            } else if (type === "rain") {
              const bufferSize = 2 * audioCtx.sampleRate;
              const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
              const output = noiseBuffer.getChannelData(0);
              for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
              }
              const noiseNode = audioCtx.createBufferSource();
              noiseNode.buffer = noiseBuffer;
              noiseNode.loop = true;
              const filter = audioCtx.createBiquadFilter();
              filter.type = "bandpass";
              filter.frequency.value = 1e3;
              filter.Q.value = 0.5;
              const gainNode = audioCtx.createGain();
              gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
              noiseNode.connect(filter);
              filter.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              noiseNode.start();
              synthNodes.push(noiseNode, filter, gainNode);
            } else if (type === "ocean-waves" || type === "waves") {
              const bufferSize = 2 * audioCtx.sampleRate;
              const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
              const output = noiseBuffer.getChannelData(0);
              for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
              }
              const noiseNode = audioCtx.createBufferSource();
              noiseNode.buffer = noiseBuffer;
              noiseNode.loop = true;
              const filter = audioCtx.createBiquadFilter();
              filter.type = "lowpass";
              filter.frequency.value = 350;
              const gainNode = audioCtx.createGain();
              gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
              const lfo = audioCtx.createOscillator();
              lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime);
              const lfoGain = audioCtx.createGain();
              lfoGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
              lfo.connect(lfoGain);
              lfoGain.connect(gainNode.gain);
              noiseNode.connect(filter);
              filter.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              noiseNode.start();
              lfo.start();
              synthNodes.push(noiseNode, filter, gainNode, lfo, lfoGain);
            } else if (type === "singing-bowls" || type === "bowls") {
              let playChime = function() {
                if (!audioCtx || audioCtx.state === "closed") return;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(1e-3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(1e-3, audioCtx.currentTime + 6);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 6.5);
              };
              const baseDrone = audioCtx.createOscillator();
              const baseGain = audioCtx.createGain();
              baseDrone.type = "sine";
              baseDrone.frequency.setValueAtTime(220, audioCtx.currentTime);
              baseGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
              baseDrone.connect(baseGain);
              baseGain.connect(audioCtx.destination);
              baseDrone.start();
              synthNodes.push(baseDrone, baseGain);
              const frequencies = [440, 554, 659, 880];
              playChime();
              chimeInterval = setInterval(playChime, 15e3);
            }
          } catch (e) {
            console.warn("Web Audio API failed or blocked: ", e);
          }
        },
        stop: () => {
          if (window.Capacitor?.getPlatform() === "ios") return;
          if (chimeInterval) {
            clearInterval(chimeInterval);
            chimeInterval = null;
          }
          synthNodes.forEach((node) => {
            try {
              node.stop();
            } catch (err) {
            }
            try {
              node.disconnect();
            } catch (err) {
            }
          });
          synthNodes = [];
        },
        playStartBell: () => {
          if (localStorage.getItem("siddha_sound_meditation_muted") === "true" || localStorage.getItem("siddha_sound_muted") === "true") return;
          if (!BELL_AUDIO.start) {
            BELL_AUDIO.start = new Audio(BELL_SOURCES.start);
            BELL_AUDIO.start.preload = "auto";
          }
          playBellAudioWithFade("start", 0, 0);
        },
        playIntervalBell: () => {
          playBellAudioWithFade("interval", 0, 0);
        },
        isEndBellPlaying: () => {
          const audio = BELL_AUDIO["end"];
          if (!audio) return false;
          return !audio.paused && audio.currentTime > 0 && !audio.ended;
        },
        playEndBell: () => {
          MenuMusic.pause();
          NatureMusic.pause();
          playBellAudioWithFade("end", 0, 0);
          const endAudio = BELL_AUDIO["end"];
          if (endAudio) {
            endAudio.onended = () => {
              const currentScreen = document.querySelector(".screen.active")?.id;
              if (currentScreen && currentScreen !== "breathe") {
                MenuMusic.start();
                NatureMusic.start();
              }
            };
          }
        },
        primeBells: () => {
          Object.keys(BELL_SOURCES).forEach((key) => {
            if (!BELL_AUDIO[key]) {
              const audio2 = new Audio(BELL_SOURCES[key]);
              audio2.preload = "auto";
              BELL_AUDIO[key] = audio2;
            }
            const audio = BELL_AUDIO[key];
            if (audio.paused) {
              audio.muted = true;
              const p = audio.play();
              if (p !== void 0) {
                p.then(() => {
                  audio.pause();
                  audio.muted = false;
                }).catch(() => {
                });
              }
            }
          });
        },
        playSingleBell: () => {
          Synth.playStartBell();
        },
        playThreeBells: () => {
          Synth.playEndBell();
        },
        playMenuClick: () => {
          if (localStorage.getItem("siddha_sound_menu_muted") === "true") return;
          try {
            initAudioContext();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(520, audioCtx.currentTime);
            gain.gain.setValueAtTime(1e-3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 0.015);
            gain.gain.exponentialRampToValueAtTime(1e-3, audioCtx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
          } catch (e) {
          }
        },
        playLevelUpChime: () => {
          if (localStorage.getItem("siddha_sound_menu_muted") === "true") return;
          try {
            initAudioContext();
            const now = audioCtx.currentTime;
            const freqs = [523.25, 783.99, 1046.5];
            freqs.forEach((freq, idx) => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              const startTime = now + idx * 0.14;
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(1e-3, startTime);
              gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
              gain.gain.exponentialRampToValueAtTime(1e-3, startTime + 1.6);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start(startTime);
              osc.stop(startTime + 1.6);
            });
          } catch (e) {
          }
        },
        playQuestClaimSound: () => {
          if (localStorage.getItem("siddha_sound_menu_muted") === "true") return;
          try {
            initAudioContext();
            const now = audioCtx.currentTime;
            const freqs = [659.25, 987.77];
            freqs.forEach((freq, idx) => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              const startTime = now + idx * 0.08;
              osc.type = "triangle";
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(1e-3, startTime);
              gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.02);
              gain.gain.exponentialRampToValueAtTime(1e-3, startTime + 0.45);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start(startTime);
              osc.stop(startTime + 0.45);
            });
          } catch (e) {
          }
        },
        playStreakGongSound: () => {
          if (localStorage.getItem("siddha_sound_menu_muted") === "true") return;
          try {
            initAudioContext();
            const now = audioCtx.currentTime;
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            const gain2 = audioCtx.createGain();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(108, now);
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(216, now);
            gain1.gain.setValueAtTime(1e-3, now);
            gain1.gain.exponentialRampToValueAtTime(0.25, now + 0.06);
            gain1.gain.exponentialRampToValueAtTime(1e-3, now + 4.5);
            gain2.gain.setValueAtTime(1e-3, now);
            gain2.gain.exponentialRampToValueAtTime(0.1, now + 0.06);
            gain2.gain.exponentialRampToValueAtTime(1e-3, now + 3.2);
            osc1.connect(gain1);
            osc2.connect(gain2);
            gain1.connect(audioCtx.destination);
            gain2.connect(audioCtx.destination);
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 4.5);
            osc2.stop(now + 3.2);
          } catch (e) {
          }
        },
        playSliderTick: () => {
          if (localStorage.getItem("siddha_sound_menu_muted") === "true") return;
          try {
            initAudioContext();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(1e-3, now);
            gain.gain.exponentialRampToValueAtTime(0.03, now + 4e-3);
            gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.02);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.02);
          } catch (e) {
          }
        },
        playSankalpaHum: () => {
          if (localStorage.getItem("siddha_sound_meditation_muted") === "true" || localStorage.getItem("siddha_sound_muted") === "true") return;
          try {
            initAudioContext();
            const now = audioCtx.currentTime;
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(174, now);
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(261, now);
            gain.gain.setValueAtTime(1e-3, now);
            gain.gain.exponentialRampToValueAtTime(0.12, now + 0.6);
            gain.gain.exponentialRampToValueAtTime(1e-3, now + 3.2);
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 3.2);
            osc2.stop(now + 3.2);
          } catch (e) {
          }
        }
      };
      MENU_TRACKS = [
        { id: "himalayan", name: "Himalayan Sanctuary", src: "./src/assets/audio/himalayan_sanctuary.mp3" },
        { id: "temple_wind", name: "Temple Wind Echoes", src: "./src/assets/audio/temple_wind_echoes.mp3" },
        { id: "fairytale_harp", name: "Fairytale Harp", src: "./src/assets/audio/fairytale_harp.mp3" }
      ];
      bgAudioEl = null;
      currentTrackIdx = 0;
      MenuMusic = {
        tracks: MENU_TRACKS,
        init: () => {
          if (bgAudioEl) return;
          bgAudioEl = new Audio();
          bgAudioEl.preload = "auto";
          bgAudioEl.addEventListener("ended", () => {
            const trackPref = localStorage.getItem("siddha_bg_music_track") || "cycle";
            if (trackPref === "cycle") {
              currentTrackIdx = (currentTrackIdx + 1) % MENU_TRACKS.length;
              MenuMusic.playTrack(currentTrackIdx);
            } else {
              bgAudioEl.currentTime = 0;
              bgAudioEl.play().catch(() => {
              });
            }
          });
          const enableAutoplay = () => {
            if (localStorage.getItem("siddha_bg_music_enabled") !== "false") {
              MenuMusic.start();
            }
            window.removeEventListener("click", enableAutoplay);
            window.removeEventListener("touchstart", enableAutoplay);
          };
          window.addEventListener("click", enableAutoplay, { once: true });
          window.addEventListener("touchstart", enableAutoplay, { once: true });
        },
        getVolume: () => {
          const stored = localStorage.getItem("siddha_bg_music_volume");
          return stored !== null ? parseFloat(stored) : 0.25;
        },
        setVolume: (vol) => {
          const clamped = Math.max(0, Math.min(1, parseFloat(vol)));
          localStorage.setItem("siddha_bg_music_volume", clamped);
          if (bgAudioEl) {
            bgAudioEl.volume = getScaledGain(clamped);
          }
        },
        isEnabled: () => {
          return localStorage.getItem("siddha_bg_music_enabled") !== "false";
        },
        setEnabled: (enabled) => {
          localStorage.setItem("siddha_bg_music_enabled", enabled ? "true" : "false");
          if (enabled) {
            MenuMusic.start();
          } else {
            MenuMusic.pause();
          }
        },
        getSelectedTrackId: () => {
          return localStorage.getItem("siddha_bg_music_track") || "cycle";
        },
        setSelectedTrackId: (trackId) => {
          localStorage.setItem("siddha_bg_music_track", trackId);
          if (trackId === "cycle") {
            currentTrackIdx = 0;
          } else {
            const idx = MENU_TRACKS.findIndex((t) => t.id === trackId);
            if (idx !== -1) currentTrackIdx = idx;
          }
          if (MenuMusic.isEnabled()) {
            MenuMusic.playTrack(currentTrackIdx);
          }
        },
        playTrack: (idx) => {
          if (!bgAudioEl) MenuMusic.init();
          currentTrackIdx = idx % MENU_TRACKS.length;
          const track = MENU_TRACKS[currentTrackIdx];
          if (!track) return;
          bgAudioEl.src = track.src;
          bgAudioEl.volume = getScaledGain(MenuMusic.getVolume());
          const trackPref = MenuMusic.getSelectedTrackId();
          bgAudioEl.loop = trackPref !== "cycle";
          if (MenuMusic.isEnabled()) {
            bgAudioEl.play().catch(() => {
            });
          }
        },
        start: () => {
          if (!MenuMusic.isEnabled()) {
            if (bgAudioEl) bgAudioEl.pause();
            return;
          }
          if (Synth.isEndBellPlaying()) return;
          if (!bgAudioEl) MenuMusic.init();
          const trackPref = MenuMusic.getSelectedTrackId();
          if (trackPref !== "cycle") {
            const idx = MENU_TRACKS.findIndex((t) => t.id === trackPref);
            if (idx !== -1) currentTrackIdx = idx;
          }
          if (!bgAudioEl.src || bgAudioEl.ended || bgAudioEl.paused) {
            MenuMusic.playTrack(currentTrackIdx);
          } else {
            bgAudioEl.volume = getScaledGain(MenuMusic.getVolume());
            bgAudioEl.play().catch(() => {
            });
          }
        },
        pause: () => {
          if (bgAudioEl) {
            bgAudioEl.pause();
          }
        },
        stop: () => {
          MenuMusic.pause();
        },
        playCurrentTrack: () => {
          MenuMusic.start();
        },
        setTrack: (trackId) => {
          MenuMusic.setSelectedTrackId(trackId);
        },
        fadeOut: (durationMs = 800) => {
          if (!bgAudioEl || bgAudioEl.paused) return;
          const startVol = bgAudioEl.volume;
          const steps = 16;
          const stepTime = durationMs / steps;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const newVol = Math.max(0, startVol * (1 - step / steps));
            if (bgAudioEl) bgAudioEl.volume = newVol;
            if (step >= steps) {
              clearInterval(timer);
              if (bgAudioEl) {
                bgAudioEl.pause();
                bgAudioEl.volume = startVol;
              }
            }
          }, stepTime);
        }
      };
      Synth.MenuMusic = MenuMusic;
      NATURE_TRACKS = [
        { id: "water_stream", name: "Water Stream & Creek", src: "./src/assets/audio/water_stream.mp3" },
        { id: "birds_calm_river", name: "Birds & Calm River", src: "./src/assets/audio/birds_calm_river.mp3" }
      ];
      natureAudioEl = null;
      currentNatureIdx = 0;
      NatureMusic = {
        tracks: NATURE_TRACKS,
        init: () => {
          if (natureAudioEl) return;
          natureAudioEl = new Audio();
          natureAudioEl.preload = "auto";
          natureAudioEl.addEventListener("ended", () => {
            const trackPref = localStorage.getItem("siddha_nature_music_track") || "water_stream";
            if (trackPref === "cycle") {
              currentNatureIdx = (currentNatureIdx + 1) % NATURE_TRACKS.length;
              NatureMusic.playTrack(currentNatureIdx);
            } else {
              natureAudioEl.currentTime = 0;
              natureAudioEl.play().catch(() => {
              });
            }
          });
          const enableAutoplay = () => {
            if (localStorage.getItem("siddha_nature_music_enabled") === "true") {
              NatureMusic.start();
            }
            window.removeEventListener("click", enableAutoplay);
            window.removeEventListener("touchstart", enableAutoplay);
          };
          window.addEventListener("click", enableAutoplay, { once: true });
          window.addEventListener("touchstart", enableAutoplay, { once: true });
        },
        getVolume: () => {
          const stored = localStorage.getItem("siddha_nature_music_volume");
          return stored !== null ? parseFloat(stored) : 0.35;
        },
        setVolume: (vol) => {
          const clamped = Math.max(0, Math.min(1, parseFloat(vol)));
          localStorage.setItem("siddha_nature_music_volume", clamped);
          if (natureAudioEl) {
            natureAudioEl.volume = getScaledGain(clamped);
          }
        },
        isEnabled: () => {
          return localStorage.getItem("siddha_nature_music_enabled") === "true";
        },
        setEnabled: (enabled) => {
          localStorage.setItem("siddha_nature_music_enabled", enabled ? "true" : "false");
          if (enabled) {
            NatureMusic.start();
          } else {
            NatureMusic.pause();
          }
        },
        getSelectedTrackId: () => {
          return localStorage.getItem("siddha_nature_music_track") || "water_stream";
        },
        setSelectedTrackId: (trackId) => {
          localStorage.setItem("siddha_nature_music_track", trackId);
          if (trackId === "cycle") {
            currentNatureIdx = 0;
          } else {
            const idx = NATURE_TRACKS.findIndex((t) => t.id === trackId);
            if (idx !== -1) currentNatureIdx = idx;
          }
          if (NatureMusic.isEnabled()) {
            NatureMusic.playTrack(currentNatureIdx);
          }
        },
        playTrack: (idx) => {
          if (!natureAudioEl) NatureMusic.init();
          currentNatureIdx = idx % NATURE_TRACKS.length;
          const track = NATURE_TRACKS[currentNatureIdx];
          if (!track) return;
          natureAudioEl.src = track.src;
          natureAudioEl.volume = getScaledGain(NatureMusic.getVolume());
          const trackPref = NatureMusic.getSelectedTrackId();
          natureAudioEl.loop = trackPref !== "cycle";
          if (NatureMusic.isEnabled()) {
            natureAudioEl.play().catch(() => {
            });
          }
        },
        start: () => {
          if (!NatureMusic.isEnabled()) {
            if (natureAudioEl) natureAudioEl.pause();
            return;
          }
          if (Synth.isEndBellPlaying()) return;
          if (!natureAudioEl) NatureMusic.init();
          const trackPref = NatureMusic.getSelectedTrackId();
          if (trackPref !== "cycle") {
            const idx = NATURE_TRACKS.findIndex((t) => t.id === trackPref);
            if (idx !== -1) currentNatureIdx = idx;
          }
          if (!natureAudioEl.src || natureAudioEl.ended || natureAudioEl.paused) {
            NatureMusic.playTrack(currentNatureIdx);
          } else {
            natureAudioEl.volume = getScaledGain(NatureMusic.getVolume());
            natureAudioEl.play().catch(() => {
            });
          }
        },
        pause: () => {
          if (natureAudioEl) {
            natureAudioEl.pause();
          }
        },
        stop: () => {
          NatureMusic.pause();
        },
        playCurrentTrack: () => {
          NatureMusic.start();
        },
        setTrack: (trackId) => {
          NatureMusic.setSelectedTrackId(trackId);
        },
        fadeOut: (durationMs = 800) => {
          if (!natureAudioEl || natureAudioEl.paused) return;
          const startVol = natureAudioEl.volume;
          const steps = 16;
          const stepTime = durationMs / steps;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const newVol = Math.max(0, startVol * (1 - step / steps));
            if (natureAudioEl) natureAudioEl.volume = newVol;
            if (step >= steps) {
              clearInterval(timer);
              if (natureAudioEl) {
                natureAudioEl.pause();
                natureAudioEl.volume = startVol;
              }
            }
          }, stepTime);
        }
      };
      Synth.NatureMusic = NatureMusic;
      SitAudioKeepAlive = {
        start: () => {
          ensureSilentKeepAlive();
        },
        stop: () => {
          stopSilentKeepAlive();
        }
      };
      Synth.SitAudioKeepAlive = SitAudioKeepAlive;
    }
  });

  // node_modules/@capacitor/core/dist/index.js
  var ExceptionCode, CapacitorException, getPlatformId, createCapacitor, initCapacitorGlobal, Capacitor, registerPlugin, WebPlugin, encode, decode, CapacitorCookiesPluginWeb, CapacitorCookies, readBlobAsBase64, normalizeHttpHeaders, buildUrlParams, buildRequestInit, CapacitorHttpPluginWeb, CapacitorHttp, SystemBarsStyle, SystemBarType, SystemBarsPluginWeb, SystemBars;
  var init_dist = __esm({
    "node_modules/@capacitor/core/dist/index.js"() {
      (function(ExceptionCode2) {
        ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
        ExceptionCode2["Unavailable"] = "UNAVAILABLE";
      })(ExceptionCode || (ExceptionCode = {}));
      CapacitorException = class extends Error {
        constructor(message, code, data) {
          super(message);
          this.message = message;
          this.code = code;
          this.data = data;
        }
      };
      getPlatformId = (win) => {
        var _a, _b;
        if (win === null || win === void 0 ? void 0 : win.androidBridge) {
          return "android";
        } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
          return "ios";
        } else {
          return "web";
        }
      };
      createCapacitor = (win) => {
        const capCustomPlatform = win.CapacitorCustomPlatform || null;
        const cap = win.Capacitor || {};
        const Plugins = cap.Plugins = cap.Plugins || {};
        const getPlatform = () => {
          return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
        };
        const isNativePlatform = () => getPlatform() !== "web";
        const isPluginAvailable = (pluginName) => {
          const plugin = registeredPlugins.get(pluginName);
          if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
            return true;
          }
          if (getPluginHeader(pluginName)) {
            return true;
          }
          return false;
        };
        const getPluginHeader = (pluginName) => {
          var _a;
          return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find((h) => h.name === pluginName);
        };
        const handleError = (err) => win.console.error(err);
        const registeredPlugins = /* @__PURE__ */ new Map();
        const registerPlugin2 = (pluginName, jsImplementations = {}) => {
          const registeredPlugin = registeredPlugins.get(pluginName);
          if (registeredPlugin) {
            console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
            return registeredPlugin.proxy;
          }
          const platform = getPlatform();
          const pluginHeader = getPluginHeader(pluginName);
          let jsImplementation;
          const loadPluginImplementation = async () => {
            if (!jsImplementation && platform in jsImplementations) {
              jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
            } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
              jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
            }
            return jsImplementation;
          };
          const createPluginMethod = (impl, prop) => {
            var _a, _b;
            if (pluginHeader) {
              const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
              if (methodHeader) {
                if (methodHeader.rtype === "promise") {
                  return (options) => cap.nativePromise(pluginName, prop.toString(), options);
                } else {
                  return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
                }
              } else if (impl) {
                return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
              }
            } else if (impl) {
              return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
            } else {
              throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
            }
          };
          const createPluginMethodWrapper = (prop) => {
            let remove;
            const wrapper = (...args) => {
              const p = loadPluginImplementation().then((impl) => {
                const fn = createPluginMethod(impl, prop);
                if (fn) {
                  const p2 = fn(...args);
                  remove = p2 === null || p2 === void 0 ? void 0 : p2.remove;
                  return p2;
                } else {
                  throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
                }
              });
              if (prop === "addListener") {
                p.remove = async () => remove();
              }
              return p;
            };
            wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
            Object.defineProperty(wrapper, "name", {
              value: prop,
              writable: false,
              configurable: false
            });
            return wrapper;
          };
          const addListener = createPluginMethodWrapper("addListener");
          const removeListener = createPluginMethodWrapper("removeListener");
          const addListenerNative = (eventName, callback) => {
            const call = addListener({ eventName }, callback);
            const remove = async () => {
              const callbackId = await call;
              removeListener({
                eventName,
                callbackId
              }, callback);
            };
            const p = new Promise((resolve) => call.then(() => resolve({ remove })));
            p.remove = async () => {
              console.warn(`Using addListener() without 'await' is deprecated.`);
              await remove();
            };
            return p;
          };
          const proxy = new Proxy({}, {
            get(_, prop) {
              switch (prop) {
                // https://github.com/facebook/react/issues/20030
                case "$$typeof":
                  return void 0;
                case "toJSON":
                  return () => ({});
                case "addListener":
                  return pluginHeader ? addListenerNative : addListener;
                case "removeListener":
                  return removeListener;
                default:
                  return createPluginMethodWrapper(prop);
              }
            }
          });
          Plugins[pluginName] = proxy;
          registeredPlugins.set(pluginName, {
            name: pluginName,
            proxy,
            platforms: /* @__PURE__ */ new Set([...Object.keys(jsImplementations), ...pluginHeader ? [platform] : []])
          });
          return proxy;
        };
        if (!cap.convertFileSrc) {
          cap.convertFileSrc = (filePath) => filePath;
        }
        cap.getPlatform = getPlatform;
        cap.handleError = handleError;
        cap.isNativePlatform = isNativePlatform;
        cap.isPluginAvailable = isPluginAvailable;
        cap.registerPlugin = registerPlugin2;
        cap.Exception = CapacitorException;
        cap.DEBUG = !!cap.DEBUG;
        cap.isLoggingEnabled = !!cap.isLoggingEnabled;
        return cap;
      };
      initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
      Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
      registerPlugin = Capacitor.registerPlugin;
      WebPlugin = class {
        constructor() {
          this.listeners = {};
          this.retainedEventArguments = {};
          this.windowListeners = {};
        }
        addListener(eventName, listenerFunc) {
          let firstListener = false;
          const listeners = this.listeners[eventName];
          if (!listeners) {
            this.listeners[eventName] = [];
            firstListener = true;
          }
          this.listeners[eventName].push(listenerFunc);
          const windowListener = this.windowListeners[eventName];
          if (windowListener && !windowListener.registered) {
            this.addWindowListener(windowListener);
          }
          if (firstListener) {
            this.sendRetainedArgumentsForEvent(eventName);
          }
          const remove = async () => this.removeListener(eventName, listenerFunc);
          const p = Promise.resolve({ remove });
          return p;
        }
        async removeAllListeners() {
          this.listeners = {};
          for (const listener in this.windowListeners) {
            this.removeWindowListener(this.windowListeners[listener]);
          }
          this.windowListeners = {};
        }
        notifyListeners(eventName, data, retainUntilConsumed) {
          const listeners = this.listeners[eventName];
          if (!listeners) {
            if (retainUntilConsumed) {
              let args = this.retainedEventArguments[eventName];
              if (!args) {
                args = [];
              }
              args.push(data);
              this.retainedEventArguments[eventName] = args;
            }
            return;
          }
          listeners.forEach((listener) => listener(data));
        }
        hasListeners(eventName) {
          var _a;
          return !!((_a = this.listeners[eventName]) === null || _a === void 0 ? void 0 : _a.length);
        }
        registerWindowListener(windowEventName, pluginEventName) {
          this.windowListeners[pluginEventName] = {
            registered: false,
            windowEventName,
            pluginEventName,
            handler: (event) => {
              this.notifyListeners(pluginEventName, event);
            }
          };
        }
        unimplemented(msg = "not implemented") {
          return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
        }
        unavailable(msg = "not available") {
          return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
        }
        async removeListener(eventName, listenerFunc) {
          const listeners = this.listeners[eventName];
          if (!listeners) {
            return;
          }
          const index = listeners.indexOf(listenerFunc);
          this.listeners[eventName].splice(index, 1);
          if (!this.listeners[eventName].length) {
            this.removeWindowListener(this.windowListeners[eventName]);
          }
        }
        addWindowListener(handle) {
          window.addEventListener(handle.windowEventName, handle.handler);
          handle.registered = true;
        }
        removeWindowListener(handle) {
          if (!handle) {
            return;
          }
          window.removeEventListener(handle.windowEventName, handle.handler);
          handle.registered = false;
        }
        sendRetainedArgumentsForEvent(eventName) {
          const args = this.retainedEventArguments[eventName];
          if (!args) {
            return;
          }
          delete this.retainedEventArguments[eventName];
          args.forEach((arg) => {
            this.notifyListeners(eventName, arg);
          });
        }
      };
      encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
      CapacitorCookiesPluginWeb = class extends WebPlugin {
        async getCookies() {
          const cookies = document.cookie;
          const cookieMap = {};
          cookies.split(";").forEach((cookie) => {
            if (cookie.length <= 0)
              return;
            let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
            key = decode(key).trim();
            value = decode(value).trim();
            cookieMap[key] = value;
          });
          return cookieMap;
        }
        async setCookie(options) {
          try {
            const encodedKey = encode(options.key);
            const encodedValue = encode(options.value);
            const expires = options.expires ? `; expires=${options.expires.replace("expires=", "")}` : "";
            const path = (options.path || "/").replace("path=", "");
            const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
            document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async deleteCookie(options) {
          try {
            document.cookie = `${options.key}=; Max-Age=0`;
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async clearCookies() {
          try {
            const cookies = document.cookie.split(";") || [];
            for (const cookie of cookies) {
              document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async clearAllCookies() {
          try {
            await this.clearCookies();
          } catch (error) {
            return Promise.reject(error);
          }
        }
      };
      CapacitorCookies = registerPlugin("CapacitorCookies", {
        web: () => new CapacitorCookiesPluginWeb()
      });
      readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
      normalizeHttpHeaders = (headers = {}) => {
        const originalKeys = Object.keys(headers);
        const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
        const normalized = loweredKeys.reduce((acc, key, index) => {
          acc[key] = headers[originalKeys[index]];
          return acc;
        }, {});
        return normalized;
      };
      buildUrlParams = (params, shouldEncode = true) => {
        if (!params)
          return null;
        const output = Object.entries(params).reduce((accumulator, entry) => {
          const [key, value] = entry;
          let encodedValue;
          let item;
          if (Array.isArray(value)) {
            item = "";
            value.forEach((str) => {
              encodedValue = shouldEncode ? encodeURIComponent(str) : str;
              item += `${key}=${encodedValue}&`;
            });
            item.slice(0, -1);
          } else {
            encodedValue = shouldEncode ? encodeURIComponent(value) : value;
            item = `${key}=${encodedValue}`;
          }
          return `${accumulator}&${item}`;
        }, "");
        return output.substr(1);
      };
      buildRequestInit = (options, extra = {}) => {
        const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
        const headers = normalizeHttpHeaders(options.headers);
        const type = headers["content-type"] || "";
        if (typeof options.data === "string") {
          output.body = options.data;
        } else if (type.includes("application/x-www-form-urlencoded")) {
          const params = new URLSearchParams();
          for (const [key, value] of Object.entries(options.data || {})) {
            params.set(key, value);
          }
          output.body = params.toString();
        } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
          const form = new FormData();
          if (options.data instanceof FormData) {
            options.data.forEach((value, key) => {
              form.append(key, value);
            });
          } else {
            for (const key of Object.keys(options.data)) {
              form.append(key, options.data[key]);
            }
          }
          output.body = form;
          const headers2 = new Headers(output.headers);
          headers2.delete("content-type");
          output.headers = headers2;
        } else if (type.includes("application/json") || typeof options.data === "object") {
          output.body = JSON.stringify(options.data);
        }
        return output;
      };
      CapacitorHttpPluginWeb = class extends WebPlugin {
        /**
         * Perform an Http request given a set of options
         * @param options Options to build the HTTP request
         */
        async request(options) {
          const requestInit = buildRequestInit(options, options.webFetchExtra);
          const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
          const url = urlParams ? `${options.url}?${urlParams}` : options.url;
          const response = await fetch(url, requestInit);
          const contentType = response.headers.get("content-type") || "";
          let { responseType = "text" } = response.ok ? options : {};
          if (contentType.includes("application/json")) {
            responseType = "json";
          }
          let data;
          let blob;
          switch (responseType) {
            case "arraybuffer":
            case "blob":
              blob = await response.blob();
              data = await readBlobAsBase64(blob);
              break;
            case "json":
              data = await response.json();
              break;
            case "document":
            case "text":
            default:
              data = await response.text();
          }
          const headers = {};
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });
          return {
            data,
            headers,
            status: response.status,
            url: response.url
          };
        }
        /**
         * Perform an Http GET request given a set of options
         * @param options Options to build the HTTP request
         */
        async get(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
        }
        /**
         * Perform an Http POST request given a set of options
         * @param options Options to build the HTTP request
         */
        async post(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
        }
        /**
         * Perform an Http PUT request given a set of options
         * @param options Options to build the HTTP request
         */
        async put(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
        }
        /**
         * Perform an Http PATCH request given a set of options
         * @param options Options to build the HTTP request
         */
        async patch(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
        }
        /**
         * Perform an Http DELETE request given a set of options
         * @param options Options to build the HTTP request
         */
        async delete(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
        }
      };
      CapacitorHttp = registerPlugin("CapacitorHttp", {
        web: () => new CapacitorHttpPluginWeb()
      });
      (function(SystemBarsStyle2) {
        SystemBarsStyle2["Dark"] = "DARK";
        SystemBarsStyle2["Light"] = "LIGHT";
        SystemBarsStyle2["Default"] = "DEFAULT";
      })(SystemBarsStyle || (SystemBarsStyle = {}));
      (function(SystemBarType2) {
        SystemBarType2["StatusBar"] = "StatusBar";
        SystemBarType2["NavigationBar"] = "NavigationBar";
      })(SystemBarType || (SystemBarType = {}));
      SystemBarsPluginWeb = class extends WebPlugin {
        async setStyle() {
          this.unavailable("not available for web");
        }
        async setAnimation() {
          this.unavailable("not available for web");
        }
        async show() {
          this.unavailable("not available for web");
        }
        async hide() {
          this.unavailable("not available for web");
        }
      };
      SystemBars = registerPlugin("SystemBars", {
        web: () => new SystemBarsPluginWeb()
      });
    }
  });

  // node_modules/@capacitor/app/dist/esm/web.js
  var web_exports = {};
  __export(web_exports, {
    AppWeb: () => AppWeb
  });
  var AppWeb;
  var init_web = __esm({
    "node_modules/@capacitor/app/dist/esm/web.js"() {
      init_dist();
      AppWeb = class extends WebPlugin {
        constructor() {
          super();
          this.handleVisibilityChange = () => {
            const data = {
              isActive: document.hidden !== true
            };
            this.notifyListeners("appStateChange", data);
            if (document.hidden) {
              this.notifyListeners("pause", null);
            } else {
              this.notifyListeners("resume", null);
            }
          };
          document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
        }
        exitApp() {
          throw this.unimplemented("Not implemented on web.");
        }
        async getInfo() {
          throw this.unimplemented("Not implemented on web.");
        }
        async getLaunchUrl() {
          return { url: "" };
        }
        async getState() {
          return { isActive: document.hidden !== true };
        }
        async minimizeApp() {
          throw this.unimplemented("Not implemented on web.");
        }
        async toggleBackButtonHandler() {
          throw this.unimplemented("Not implemented on web.");
        }
        async getAppLanguage() {
          return {
            value: navigator.language.split("-")[0].toLowerCase()
          };
        }
      };
    }
  });

  // src/components/onboarding_tutorial.js
  var onboarding_tutorial_exports = {};
  __export(onboarding_tutorial_exports, {
    startOnboardingTutorial: () => startOnboardingTutorial
  });
  function startOnboardingTutorial(onComplete) {
    if (document.getElementById("onboarding-tutorial-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "onboarding-tutorial-overlay";
    overlay.className = "tu-overlay";
    let currentStep = 1;
    let timerInterval = null;
    let timeLeft = 60;
    let timerRunning = false;
    let selectedPath = "anapana";
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
                    \u{1F5FA}\uFE0F <strong>The Journey Map</strong>: Here is your progressive path.
                    <br>
                    <span style="color:var(--color-accent-dark); font-weight:700;">\u{1F449} Try it:</span> Tap the highlighted pulsing node on the map above to inspect its missions!
                </p>
                <button class="btn btn-secondary" id="tu-journey-fallback-btn" style="font-size: 11px; padding: 2px 10px; width:100%; margin-top: 4px;">Skip Map Tour</button>
            </div>

            <!-- Step 5.5: Mission Selection inside Modal (Flipped to Top) -->
            <div class="tu-slide" data-step="55">
                <p class="tu-text" style="font-size: 13px; line-height: 1.5; margin-bottom: 8px; text-align: left;">
                    \u{1F3AF} <strong>Meditation Missions</strong>: Each node contains sequential challenges.
                    <br>
                    <span style="color:var(--color-accent-dark); font-weight:700;">\u{1F449} Try it:</span> Tap the first mission card below to load it onto the meditation timer!
                </p>
                <button class="btn btn-secondary" id="tu-mission-fallback-btn" style="font-size: 11px; padding: 2px 10px; width:100%; margin-top: 4px;">Skip Mission Select</button>
            </div>

            <!-- Step 6: Breathe Timer Page (Flipped to Top) -->
            <div class="tu-slide" data-step="6">
                <p class="tu-text" style="font-size: 13px; line-height: 1.5; margin-bottom: 8px; text-align: left;">
                    \u23F1\uFE0F <strong>Meditate Timer</strong>: The mission's minimum duration is loaded.
                    <br>
                    You can choose a <strong>longer preset</strong>, or enter a custom duration (minimum required sits are enforced). Customize your bell chimes and tap Play when ready.
                </p>
                <button class="btn btn-primary" id="tu-breathe-next-btn" style="padding: 6px 12px; font-size: 12px; width:100%; margin-top: 4px;">Next: Wisdom Library</button>
            </div>

            <!-- Step 7: The Wisdom Library -->
            <div class="tu-slide" data-step="7">
                <p class="tu-text" style="font-size: 13px; line-height: 1.5; margin-bottom: 8px; text-align: left;">
                    \u{1F4D6} <strong>Wisdom & Lineages</strong>: Access guidebooks and posture tips.
                    <br>
                    <span style="color:var(--color-accent-dark); font-weight:700;">\u{1F449} Try it:</span> Tap the highlighted article to open and read lineage insights!
                </p>
                <button class="btn btn-secondary" id="tu-wisdom-fallback-btn" style="font-size: 11px; padding: 2px 10px; width:100%; margin-top: 4px;">Skip Wisdom</button>
            </div>

            <!-- Step 7.5: Reading Wisdom Article (Flipped to Top) -->
            <div class="tu-slide" data-step="75">
                <p class="tu-text" style="font-size: 13px; line-height: 1.5; margin-bottom: 8px; text-align: left;">
                    \u{1F33F} <strong>Wisdom Reader</strong>: Review techniques offline to guide your sitting sessions.
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
    const style = document.createElement("style");
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
    document.getElementById("app").appendChild(overlay);
    const pathCards = overlay.querySelectorAll(".tu-option-card");
    pathCards.forEach((card) => {
      card.addEventListener("click", () => {
        pathCards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        selectedPath = card.dataset.path;
      });
    });
    overlay.querySelector("#tu-select-path-btn").addEventListener("click", () => {
      DB.setActivePath(selectedPath);
      DB.unlockPath(selectedPath);
      goToStep(3);
    });
    const timerBtn = overlay.querySelector("#tu-timer-btn");
    const timerDisplay = overlay.querySelector("#tu-timer-display");
    const timerPrompt = overlay.querySelector("#tu-timer-prompt");
    const timerSkipBtn = overlay.querySelector("#tu-timer-skip-btn");
    const timerInstruction = overlay.querySelector("#tu-timer-instruction");
    const prompts = [
      "Quietly count each exhalation...",
      "If thoughts arise, just return to 'one'...",
      "Anchor your focus in your posture...",
      "Settle into this present moment...",
      "Ten counts, then restart from one..."
    ];
    timerBtn.addEventListener("click", () => {
      if (!timerRunning) {
        timerRunning = true;
        timerBtn.textContent = "Pause";
        timerBtn.classList.remove("btn-primary");
        timerBtn.classList.add("btn-secondary");
        timerSkipBtn.classList.remove("hidden");
        timerInstruction.style.opacity = "0.5";
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
        }, 1e3);
      } else {
        timerRunning = false;
        clearInterval(timerInterval);
        timerBtn.textContent = "Resume Sit";
        timerBtn.classList.remove("btn-secondary");
        timerBtn.classList.add("btn-primary");
      }
    });
    timerSkipBtn.addEventListener("click", () => {
      completeMeditation();
    });
    function updateTimerDisplay() {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      timerDisplay.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    function completeMeditation() {
      clearInterval(timerInterval);
      timerRunning = false;
      goToStep(4);
    }
    overlay.querySelector("#tu-claim-xp-btn").addEventListener("click", () => {
      DB.addXP(75);
      goToStep(5);
    });
    overlay.querySelector("#tu-journey-fallback-btn").addEventListener("click", () => {
      cleanupJourneySpotlight();
      goToStep(6);
    });
    function cleanupJourneySpotlight() {
      const circle = document.querySelector(".path-node .node-circle");
      if (circle) {
        circle.classList.remove("tu-highlight-ring");
      }
    }
    overlay.querySelector("#tu-mission-fallback-btn").addEventListener("click", () => {
      cleanupMissionSpotlight();
      goToStep(6);
    });
    function cleanupMissionSpotlight() {
      const item = document.querySelector("#modal-missions-list .mission-item");
      if (item) {
        item.classList.remove("tu-highlight-ring-rect");
      }
    }
    overlay.querySelector("#tu-breathe-next-btn").addEventListener("click", () => {
      cleanupBreatheSpotlight();
      goToStep(7);
    });
    function cleanupBreatheSpotlight() {
      const presets = document.querySelector("#timer-presets");
      if (presets) {
        presets.classList.remove("tu-highlight-ring-rect");
      }
      const breatheScreen = document.querySelector(".breathe-screen");
      if (breatheScreen) {
        breatheScreen.activeMission = null;
        const banner = breatheScreen.querySelector("#mission-info-banner");
        const titleEl = breatheScreen.querySelector("#breathe-screen-title");
        const descEl = breatheScreen.querySelector("#breathe-screen-desc");
        if (banner) banner.style.display = "none";
        if (titleEl) titleEl.textContent = "Meditation";
        if (descEl) descEl.textContent = "Find your center";
      }
    }
    overlay.querySelector("#tu-wisdom-fallback-btn").addEventListener("click", () => {
      cleanupWisdomSpotlight();
      goToStep(8);
    });
    function cleanupWisdomSpotlight() {
      const card = document.querySelector(".wd-card.unlocked");
      if (card) {
        card.classList.remove("tu-highlight-ring-rect");
      }
    }
    overlay.querySelector("#tu-wisdom-skip-reader-btn").addEventListener("click", () => {
      cleanupReaderEvents();
      goToStep(8);
    });
    let readerInterval = null;
    function cleanupReaderEvents() {
      clearInterval(readerInterval);
    }
    overlay.querySelector("#tu-finish-btn").addEventListener("click", () => {
      DB.completeTutorial();
      overlay.remove();
      cleanupDelegatedEvents();
      if (onComplete) onComplete();
    });
    const onDocumentClick = (e) => {
      if (currentStep === 5) {
        const node = e.target.closest(".path-node");
        if (node) {
          cleanupJourneySpotlight();
          goToStep(55);
        }
      } else if (currentStep === 55) {
        const item = e.target.closest("#modal-missions-list .mission-item");
        if (item) {
          cleanupMissionSpotlight();
          goToStep(6);
        }
      } else if (currentStep === 7) {
        const card = e.target.closest(".wd-card.unlocked");
        if (card) {
          cleanupWisdomSpotlight();
          goToStep(75);
        }
      } else if (currentStep === 75) {
        const completeBtn = e.target.closest("#wd-complete-btn");
        if (completeBtn) {
          setTimeout(() => {
            document.querySelector("#wd-reader-close")?.click();
          }, 400);
        }
      }
    };
    document.addEventListener("click", onDocumentClick);
    function cleanupDelegatedEvents() {
      document.removeEventListener("click", onDocumentClick);
    }
    function goToStep(step) {
      currentStep = step;
      overlay.className = "tu-overlay";
      cleanupJourneySpotlight();
      cleanupMissionSpotlight();
      cleanupBreatheSpotlight();
      cleanupWisdomSpotlight();
      cleanupReaderEvents();
      if (currentStep === 5) {
        document.querySelector('.bottom-nav [data-target="journey"]')?.click();
        overlay.classList.add("spotlight-bottom");
        let tries = 0;
        const interval = setInterval(() => {
          const circle = document.querySelector(".path-node .node-circle");
          if (circle) {
            circle.classList.add("tu-highlight-ring");
            clearInterval(interval);
          }
          if (++tries > 20) clearInterval(interval);
        }, 50);
      } else if (currentStep === 55) {
        overlay.classList.add("spotlight-top");
        let tries = 0;
        const interval = setInterval(() => {
          const item = document.querySelector("#modal-missions-list .mission-item");
          if (item) {
            item.classList.add("tu-highlight-ring-rect");
            clearInterval(interval);
          }
          if (++tries > 20) clearInterval(interval);
        }, 50);
      } else if (currentStep === 6) {
        overlay.classList.add("spotlight-top");
        let tries = 0;
        const interval = setInterval(() => {
          const presets = document.querySelector("#timer-presets");
          if (presets) {
            presets.classList.add("tu-highlight-ring-rect");
            clearInterval(interval);
          }
          if (++tries > 20) clearInterval(interval);
        }, 50);
      } else if (currentStep === 7) {
        window.dispatchEvent(new CustomEvent("siddha-navigate", { detail: { target: "wisdom" } }));
        overlay.classList.add("spotlight-bottom");
        let tries = 0;
        const interval = setInterval(() => {
          const card = document.querySelector(".wd-card.unlocked");
          if (card) {
            card.classList.add("tu-highlight-ring-rect");
            clearInterval(interval);
          }
          if (++tries > 20) clearInterval(interval);
        }, 50);
      } else if (currentStep === 75) {
        overlay.classList.add("spotlight-top");
        readerInterval = setInterval(() => {
          const reader = document.querySelector("#wd-reader-modal");
          if (!reader || !reader.classList.contains("active")) {
            cleanupReaderEvents();
            goToStep(8);
          }
        }, 300);
      } else if (currentStep === 8) {
        document.querySelector("#wd-reader-close")?.click();
        document.querySelector('.bottom-nav [data-target="home"]')?.click();
      }
      overlay.querySelectorAll(".tu-slide").forEach((slide) => {
        const num = parseInt(slide.dataset.step);
        if (num === currentStep) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });
    }
    overlay.querySelectorAll(".tu-btn-next").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextStep = parseInt(btn.dataset.next);
        goToStep(nextStep);
      });
    });
  }
  var init_onboarding_tutorial = __esm({
    "src/components/onboarding_tutorial.js"() {
      init_db();
    }
  });

  // src/screens/home.js
  init_db();
  init_synth();
  var DIALOGUES = [
    "Don't just do something, sit there!",
    "True stillness is not the absence of sound, but the presence of the one who listens.",
    "Silence is not empty. It is full of presence.",
    "When you become aware of the silence around you, immediately you touch the stillness within.",
    "There is a quiet space inside you that remains untouched by any storm. Let us sit there.",
    "You are not your thoughts. You are the spacious awareness in which they arise and dissolve.",
    "Be still. Look. Listen. In this moment, there is nothing else to do.",
    "Allow this moment to be exactly as it is. Let go of the need to change anything.",
    "When you lose touch with inner stillness, you lose yourself in the world. Return here.",
    "Close your eyes, find the touchpoints of the air, and let the rest of the world wait.",
    "Listen to the quiet between two breaths. In that brief gap, you are completely free.",
    "Feel the weight of gravity holding you down. The earth is supporting this sit. Rest into it.",
    "Observe the cool breeze at the tip of the nose on the inhale, and the warm sigh on the exhale.",
    "Let your shoulders drop. Release the tension in your jaw. Let the next breath be completely effortless.",
    "Feel the gentle rise and fall of your chest. Like soft waves on a calm, quiet lake.",
    "Are we meditating today, or are we just sitting here looking extremely peaceful?",
    "Look at a tree, a flower, a leaf. Notice how still they are, how rooted in being. Let them teach you.",
    "The mind is always busy. But beneath the noise, there is a deep reservoir of calm. Dive in.",
    "Watch your thoughts arise and dissolve, like clouds drifting across an infinite sky.",
    "The breath is your anchor. Whenever the storm of thoughts arrives, return to the breath."
  ];
  function renderHome() {
    const container = document.createElement("div");
    container.className = "screen home-screen";
    container.innerHTML = `
        <div class="home-top-section">
            <!-- Header Box Card -->
            <div class="home-header home-header-box">
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="./src/assets/logo.png" class="home-logo-img" alt="Siddha Logo">
                    <span style="font-weight:700; font-size:16px; font-family:var(--font-heading); color:#2c3e38;">Siddha</span>
                    <button id="dev-add-xp" class="dev-only" style="font-size:9px; padding:2px 5px; background:transparent; border:1px solid #dcdcdc; border-radius:4px; cursor:pointer; color:#777;">+500 XP</button>
                </div>
                <!-- Inline greeting at top -->
                <div class="home-header-greeting" style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500; font-family: var(--font-body); display: flex; align-items: center; gap: 4px;">
                    Good day, <strong id="home-name">Alex</strong> \u{1F44B}
                </div>
                <!-- Profile Avatar at top right -->
                <button id="home-profile-btn" aria-label="Profile" style="padding:0; background:none; border:none; cursor:pointer; flex-shrink:0;">
                    <img id="home-profile-avatar-img" src="./src/assets/avatar_monk.jpg" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:2px solid var(--color-accent); box-shadow:0 2px 6px rgba(0,0,0,0.1);" alt="Profile">
                </button>
            </div>
        </div>

        <!-- Hero Area -->
        <div class="home-hero-area">
            <div id="hero-anim-container" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;"></div>
            <div id="companion-speech-bubble" class="companion-bubble">
                <div class="companion-bubble-top-icon">
                    <span class="material-symbols-rounded" style="font-size:16px; color:#5c7866;">spa</span>
                </div>
                <span id="companion-bubble-text"></span>
                <div class="companion-bubble-tail">
                    <div class="companion-bubble-tail-notch"></div>
                </div>
            </div>
        </div>

        <!-- Stats Area -->
        <div class="home-stats-area">


            <!-- Daily goal (Click opens Goal Modal) -->
            <div class="home-stat-card row-card" id="home-goal-card" style="margin-top: 10px; cursor: pointer;">
                <div style="flex:1;">
                    <p class="home-stat-title">Today's Goal</p>
                    <div style="display:flex; align-items:baseline; gap:4px; margin-top:2px;">
                        <span class="home-stat-big" id="home-today-minutes">0</span>
                        <span class="home-stat-title" style="font-size: 14px;">/ <span id="home-goal-minutes">20</span> min</span>
                    </div>
                    <div class="home-bar-track">
                        <div class="home-bar-fill" id="home-today-bar"></div>
                    </div>
                </div>
                <div class="home-icon-badge plant"><span class="material-symbols-rounded">potted_plant</span></div>
            </div>

            <!-- Streak + Level row -->
            <div class="home-stat-row">
                <div class="home-stat-card" data-link="reflect">
                    <p class="home-stat-title">Streak</p>
                    <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                        <span class="material-symbols-rounded" style="color:#e65c00; font-variation-settings: 'FILL' 1;">local_fire_department</span>
                        <div style="display:flex; align-items:baseline; gap:4px;">
                            <span class="home-stat-big" id="home-streak">0</span>
                            <span class="home-stat-title">days</span>
                        </div>
                    </div>
                </div>
                <div class="home-stat-card" data-link="profile" style="flex: 1.5;">
                    <div style="display:flex; justify-content:space-between; width:100%;">
                        <div>
                            <p class="home-stat-title">Level <br><span id="home-level" style="font-size:10px;">1</span></p>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span class="home-stat-big" id="home-xp">0</span>
                            <span class="home-stat-title" style="font-size:10px;">XP</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:8px; width:100%;">
                        <div class="home-bar-track" style="margin:0; flex:1;"><div class="home-bar-fill dark" id="home-xp-bar"></div></div>
                    </div>
                </div>
            </div>

            <!-- Total Info row -->
            <div class="home-stat-row">
                <div class="home-stat-card" data-link="profile">
                    <p class="home-stat-title">Total Sessions</p>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:2px;">
                        <span class="material-symbols-rounded" style="color:#6b8273; font-variation-settings: 'FILL' 1;">self_improvement</span>
                        <span class="home-stat-big" id="home-total-sessions">0</span>
                    </div>
                </div>
                <div class="home-stat-card" data-link="profile">
                    <p class="home-stat-title">Mindful Mins</p>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:2px;">
                        <span class="material-symbols-rounded" style="color:#6b8273;">schedule</span>
                        <div style="display:flex; align-items:baseline; gap:2px;">
                            <span class="home-stat-big" id="home-total-mins">0</span>
                            <span class="home-stat-title">m</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Daily Quest Card -->
            <div class="home-stat-card row-card dq-card" id="home-dq-card" style="margin-top: 10px; cursor: pointer; transition: all 0.2s; width: 100%;">
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:6px;">
                        <p class="home-stat-title" style="font-weight:700;">Daily Quest</p>
                        <span id="home-dq-badge" style="font-size:9.5px; font-weight:700; background:var(--color-accent-light); color:var(--color-accent-dark); padding:2px 6px; border-radius:8px;">+25 XP</span>
                    </div>
                    <p id="home-dq-text" class="text-sm" style="color:var(--color-text-secondary); margin-top:2px; font-size:11px;">Complete your daily practice</p>
                </div>
                <div class="home-icon-badge" id="home-dq-icon" style="background:#e8f4ec; color:#2c8242;">
                    <span class="material-symbols-rounded">task_alt</span>
                </div>
            </div>

            <!-- Wisdom Card -->
            <div class="home-stat-card row-card" data-link="wisdom" style="margin-top: 10px; background: linear-gradient(135deg, #ffffff 0%, #f6f8f6 100%); border-left: 3px solid var(--color-accent); width: 100%;">
                <div style="flex:1;">
                    <p class="home-stat-title" style="color:var(--color-accent-dark); font-weight:700;">Wisdom Library</p>
                    <p class="text-sm" style="color:var(--color-text-secondary); margin-top:2px; font-size:11px;">Expand your understanding of meditation and mindfulness</p>
                </div>
                <div class="home-icon-badge plant" style="background:var(--color-accent-light); color:var(--color-accent-dark);"><span class="material-symbols-rounded">menu_book</span></div>
            </div>

        </div>

        <!-- Daily Goal Modal -->
        <div id="home-goal-modal" class="home-goal-overlay">
            <div style="background:var(--color-bg-card, #ffffff); border-radius:24px; padding:24px; width:90%; max-width:380px; box-shadow:0 12px 40px rgba(0,0,0,0.25);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="material-symbols-rounded" style="color:var(--color-accent); font-size:24px;">target</span>
                        <h3 style="margin:0; font-size:17px; font-family:var(--font-heading); color:var(--color-text-primary);">Set Daily Meditation Goal</h3>
                    </div>
                    <button id="close-goal-modal-btn" style="background:none; border:none; cursor:pointer; padding:4px; color:var(--color-text-muted); display:flex; align-items:center;">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <p style="font-size:12.5px; color:var(--color-text-secondary); margin:0 0 12px; line-height:1.4;">
                    How many total minutes would you like to sit each day?
                </p>

                <!-- Explanation Callout Box -->
                <div style="background:var(--color-bg-secondary); border-radius:14px; padding:10px 12px; margin-bottom:16px;">
                    <div style="display:flex; align-items:flex-start; gap:8px;">
                        <span class="material-symbols-rounded" style="font-size:16px; color:var(--color-accent); margin-top:1px; flex-shrink:0;">info</span>
                        <p style="font-size:11px; color:var(--color-text-secondary); margin:0; line-height:1.45;">
                            <strong>Building a Habit:</strong> Sitting even for 5 minutes counts toward maintaining your daily streak. Reaching your goal completes your daily progress bar and earns bonus XP!
                        </p>
                    </div>
                </div>

                <!-- Preset Chips -->
                <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
                    <button class="goal-modal-chip" data-mins="5" style="flex:1; min-width:42px; padding:8px 0; border:1px solid var(--color-bg-secondary); border-radius:12px; background:var(--color-bg-secondary); font-size:12.5px; font-weight:700; cursor:pointer; color:var(--color-text-primary); text-align:center;">5m</button>
                    <button class="goal-modal-chip" data-mins="10" style="flex:1; min-width:42px; padding:8px 0; border:1px solid var(--color-bg-secondary); border-radius:12px; background:var(--color-bg-secondary); font-size:12.5px; font-weight:700; cursor:pointer; color:var(--color-text-primary); text-align:center;">10m</button>
                    <button class="goal-modal-chip" data-mins="15" style="flex:1; min-width:42px; padding:8px 0; border:1px solid var(--color-bg-secondary); border-radius:12px; background:var(--color-bg-secondary); font-size:12.5px; font-weight:700; cursor:pointer; color:var(--color-text-primary); text-align:center;">15m</button>
                    <button class="goal-modal-chip active" data-mins="20" style="flex:1; min-width:42px; padding:8px 0; border:1px solid var(--color-bg-secondary); border-radius:12px; background:var(--color-bg-secondary); font-size:12.5px; font-weight:700; cursor:pointer; color:var(--color-text-primary); text-align:center;">20m</button>
                    <button class="goal-modal-chip" data-mins="30" style="flex:1; min-width:42px; padding:8px 0; border:1px solid var(--color-bg-secondary); border-radius:12px; background:var(--color-bg-secondary); font-size:12.5px; font-weight:700; cursor:pointer; color:var(--color-text-primary); text-align:center;">30m</button>
                    <button class="goal-modal-chip" data-mins="45" style="flex:1; min-width:42px; padding:8px 0; border:1px solid var(--color-bg-secondary); border-radius:12px; background:var(--color-bg-secondary); font-size:12.5px; font-weight:700; cursor:pointer; color:var(--color-text-primary); text-align:center;">45m</button>
                    <button class="goal-modal-chip" data-mins="60" style="flex:1; min-width:42px; padding:8px 0; border:1px solid var(--color-bg-secondary); border-radius:12px; background:var(--color-bg-secondary); font-size:12.5px; font-weight:700; cursor:pointer; color:var(--color-text-primary); text-align:center;">60m</button>
                </div>

                <!-- Custom Input -->
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:20px;">
                    <input type="number" id="goal-modal-custom-input" placeholder="Custom minutes" min="1" max="480" style="flex:1; padding:10px 14px; border-radius:12px; border:1px solid var(--color-bg-secondary); font-size:13px; outline:none; font-family:inherit; color:var(--color-text-primary); background:var(--color-bg-card);">
                </div>

                <!-- Save Button -->
                <button id="save-goal-modal-btn" class="btn" style="width:100%; padding:12px; font-size:14px; background:var(--color-accent); color:#fff; border:none; border-radius:14px; font-weight:700; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
                    Save Daily Goal \u{1F3AF}
                </button>
            </div>
        </div>
    `;
    const style = document.createElement("style");
    style.textContent = `
        .home-screen {
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0;
            background-color: #f4f3ed;
            background-size: 100% auto;
            background-position: center top;
            background-repeat: no-repeat;
            background-attachment: local;
            flex-direction: column;
        }

        .home-goal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.25s ease, visibility 0.25s ease;
        }

        .home-goal-overlay.active {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .home-screen {
            padding-top: 0 !important;
        }

        .home-top-section {
            padding: 0;
            width: 100%;
            z-index: 20;
            position: relative;
        }

        .home-header-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: calc(12px + env(safe-area-inset-top, 0px)) 18px 12px;
            background: rgba(253, 252, 248, 0.94);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(134, 155, 143, 0.28);
            border-radius: 0;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        }
        .home-logo-img {
            width: 28px; height: 28px;
            object-fit: contain;
            border-radius: 0;
        }
        .home-icon-btn {
            background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center;
        }
        .home-icon-btn .material-symbols-rounded { font-size: 28px; }

        /* Hero Area */
        .home-hero-area {
            width: 100%;
            height: 380px;
            position: relative;
            flex-shrink: 0;
            pointer-events: none;
        }

        /* Stats Area */
        .home-stats-area {
            background: linear-gradient(to bottom, rgba(244, 243, 237, 0) 0%, rgba(244, 243, 237, 0.85) 40px, #f4f3ed 100px);
            padding: 32px 16px 90px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            position: relative;
        }

        /* Cards */
        .home-stat-card {
            background: white;
            border-radius: 16px;
            padding: 12px 14px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            flex: 1;
        }
        .home-stat-card:active { transform: scale(0.97); box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        
        .home-stat-card.companion-card {
            background: rgba(255, 255, 255, 0.82);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.45);
            box-shadow: 0 8px 32px rgba(0,0,0,0.04);
            cursor: default !important;
        }
        .home-stat-card.companion-card:active {
            transform: none !important;
        }
        
        .inventory-slot:active {
            transform: scale(0.94);
        }

        /* Today's Goal card has icon on the right \u2192 use row layout */
        .home-stat-card.row-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        .home-stat-row { display: flex; gap: 8px; }
        .home-stat-card > div:not(.home-icon-badge) { width: 100%; }

        .home-stat-title { font-size: 11px; color: #7a8a81; font-weight: 500; margin: 0; }
        .home-stat-big { font-size: 18px; font-weight: 700; color: #1b2e26; }

        .home-bar-track {
            width: 100%; height: 5px;
            background: #e4ede6;
            border-radius: 3px; margin-top: 6px; overflow: hidden;
        }
        .home-bar-fill {
            height: 100%; width: 0%;
            background: #53a362; /* bright green for today */
            border-radius: 3px;
            transition: width 0.5s;
        }
        .home-bar-fill.dark {
            background: #129eaf; /* teal for sync / dark level indicator */
        }

        .home-icon-badge {
            width: 36px; height: 36px; border-radius: 10px;
            display: flex; justify-content: center; align-items: center;
        }
        .home-icon-badge.plant { background: #f4f3ed; color: #7a8a81; }
        .home-icon-badge .material-symbols-rounded { font-size: 20px; }

        /* Hero Animations */
        .hero-breath-glow {
            position: absolute;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            width: 170px;
            height: 170px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(134, 155, 143, 0.6) 0%, rgba(134, 155, 143, 0) 70%);
            animation: hero-breath 6s ease-in-out infinite;
        }
        @keyframes hero-breath {
            0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.3; }
            50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.95; }
        }

        .steam-wisp {
            position: absolute;
            width: 5px;
            height: 22px;
            background: linear-gradient(to top, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 100%);
            border-radius: 50%;
            filter: blur(1.5px);
            animation: rise-wisp 3.5s infinite ease-in-out;
        }
        @keyframes rise-wisp {
            0% { transform: translateY(0) scaleX(1); opacity: 0; }
            30% { opacity: 0.75; }
            100% { transform: translateY(-60px) scaleX(2.5); opacity: 0; }
        }

        .butterfly {
            position: absolute;
            width: 18px;
            height: 18px;
            filter: drop-shadow(0 2px 5px rgba(0,0,0,0.18));
            animation: path-fly 20s infinite linear, wing-flap 0.1s infinite alternate;
        }
        @keyframes wing-flap {
            0% { transform: scaleX(0.1); }
            100% { transform: scaleX(1); }
        }
        @keyframes path-fly {
            0% { left: 18%; top: 58%; }
            25% { left: 38%; top: 32%; }
            50% { left: 70%; top: 46%; }
            75% { left: 46%; top: 68%; }
            100% { left: 18%; top: 58%; }
        }

        .gold-aura {
            position: absolute;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            width: 180px;
            height: 180px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(226, 184, 87, 0.45) 0%, rgba(226, 184, 87, 0) 70%);
            animation: aura-glow 5s ease-in-out infinite alternate;
        }
        @keyframes aura-glow {
            0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.45; }
            100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.95; }
        }

        .hero-canvas-el {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .companion-bubble {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) scale(0.85);
            background: rgba(246, 245, 239, 0.42);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(134, 155, 143, 0.3);
            border-radius: 20px;
            padding: 10px 16px;
            max-width: 78%;
            min-width: 140px;
            text-align: center;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
            z-index: 10;
            cursor: pointer;
            pointer-events: none;
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
        }
        .companion-bubble.visible {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(-50%) scale(1);
        }
        .companion-bubble-top-icon {
            position: absolute;
            top: -11px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(246, 245, 239, 0.65);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            padding: 0 5px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 16px;
        }
        .companion-bubble.visible:hover {
            transform: translateX(-50%) scale(1.02);
            background: rgba(246, 245, 239, 0.58);
        }
        .companion-bubble.visible:active {
            transform: translateX(-50%) scale(0.97);
        }
        #companion-bubble-text {
            font-size: 11.5px;
            line-height: 1.42;
            color: #243329;
            font-family: var(--font-body);
            font-weight: 600;
            display: inline-block;
        }
        .companion-bubble-tail {
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
        }
        .companion-bubble-tail-notch {
            width: 10px;
            height: 10px;
            background: rgba(246, 245, 239, 0.42);
            border-right: 1px solid rgba(134, 155, 143, 0.3);
            border-bottom: 1px solid rgba(134, 155, 143, 0.3);
            transform: rotate(45deg);
            border-bottom-right-radius: 2px;
        }
        .companion-bubble.visible:hover .companion-bubble-tail {
            background: #ffffff;
        }
    `;
    container.appendChild(style);
    container.querySelector("#home-profile-btn").addEventListener("click", () => {
      document.querySelector('[data-target="profile"]')?.click();
    });
    container.querySelector("#dev-add-xp").addEventListener("click", (e) => {
      e.stopPropagation();
      DB.addXP(500);
      if (typeof container.updateData === "function") container.updateData();
    });
    const goalCard = container.querySelector("#home-goal-card");
    const goalModal = container.querySelector("#home-goal-modal");
    const closeGoalModalBtn = container.querySelector("#close-goal-modal-btn");
    const saveGoalModalBtn = container.querySelector("#save-goal-modal-btn");
    const goalInput = container.querySelector("#goal-modal-custom-input");
    const goalChips = container.querySelectorAll(".goal-modal-chip");
    if (goalCard && goalModal) {
      goalCard.addEventListener("click", (e) => {
        e.stopPropagation();
        const user = DB.getUser ? DB.getUser() : {};
        const currentGoal = user.dailyCommitment || 20;
        if (goalInput) goalInput.value = currentGoal;
        goalChips.forEach((chip) => {
          const mins = parseInt(chip.dataset.mins);
          if (mins === currentGoal) {
            chip.style.background = "var(--color-accent)";
            chip.style.color = "#ffffff";
          } else {
            chip.style.background = "var(--color-bg-secondary)";
            chip.style.color = "var(--color-text-primary)";
          }
        });
        goalModal.classList.add("active");
      });
      const closeGoalModal = () => {
        goalModal.classList.remove("active");
      };
      if (closeGoalModalBtn) closeGoalModalBtn.addEventListener("click", closeGoalModal);
      goalModal.addEventListener("click", (e) => {
        if (e.target === goalModal) closeGoalModal();
      });
      goalChips.forEach((chip) => {
        chip.addEventListener("click", () => {
          const mins = chip.dataset.mins;
          if (goalInput) goalInput.value = mins;
          goalChips.forEach((c) => {
            c.style.background = "var(--color-bg-secondary)";
            c.style.color = "var(--color-text-primary)";
          });
          chip.style.background = "var(--color-accent)";
          chip.style.color = "#ffffff";
        });
      });
      if (saveGoalModalBtn) {
        saveGoalModalBtn.addEventListener("click", () => {
          const val = parseInt(goalInput?.value) || 20;
          DB.setDailyCommitment(val);
          closeGoalModal();
          if (typeof container.updateData === "function") {
            container.updateData();
          }
        });
      }
    }
    const statCards = container.querySelectorAll(".home-stat-card:not(.dq-card):not(#home-goal-card)");
    statCards.forEach((card) => {
      card.addEventListener("click", () => {
        const target = card.getAttribute("data-link");
        if (target) {
          const navBtn = document.querySelector(`[data-target="${target}"]`);
          if (navBtn) navBtn.click();
        }
      });
    });
    const dqCard = container.querySelector("#home-dq-card");
    if (dqCard) {
      dqCard.addEventListener("click", () => {
        const dq = DB.getDailyQuest ? DB.getDailyQuest() : null;
        if (dq && (dq.completed || dq.claimed)) {
          return;
        }
        const targetTab = dq && dq.target ? dq.target : dq && dq.type === "wisdom" ? "wisdom" : dq && dq.type === "reflect" ? "reflect" : dq && dq.type === "journey" ? "journey" : "breathe";
        window.dispatchEvent(new CustomEvent("siddha-navigate", { detail: { target: targetTab } }));
      });
    }
    let currentAnimLevel = null;
    let canvasAnimFrame = null;
    let canvasAnimActive = false;
    function stopCanvasAnimation() {
      canvasAnimActive = false;
      if (canvasAnimFrame) {
        cancelAnimationFrame(canvasAnimFrame);
        canvasAnimFrame = null;
      }
    }
    function startCanvasParticles(canvas, type) {
      const ctx = canvas.getContext("2d");
      let width = canvas.width = canvas.offsetWidth || 350;
      let height = canvas.height = canvas.offsetHeight || 380;
      canvasAnimActive = true;
      const particles = [];
      function resize() {
        if (!canvas) return;
        width = canvas.width = canvas.offsetWidth || 350;
        height = canvas.height = canvas.offsetHeight || 380;
      }
      window.addEventListener("resize", resize);
      class Particle {
        constructor() {
          this.reset();
          this.y = Math.random() * height;
        }
        reset() {
          this.x = Math.random() * width;
          if (type === "gold") {
            this.y = height + 10;
            this.size = 1 + Math.random() * 2.5;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -(0.5 + Math.random() * 0.8);
            this.alpha = 0.2 + Math.random() * 0.6;
            this.alphaSpeed = 3e-3 + Math.random() * 5e-3;
          } else {
            this.x = Math.random() * (width + 100) - 50;
            this.y = -10;
            this.size = 4 + Math.random() * 5;
            this.vx = -0.4 - Math.random() * 0.8;
            this.vy = 0.6 + Math.random() * 0.9;
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = (Math.random() - 0.5) * 0.02;
            this.alpha = 0.5 + Math.random() * 0.4;
          }
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (type === "gold") {
            this.alpha -= this.alphaSpeed;
            if (this.alpha <= 0 || this.y < 0) this.reset();
          } else {
            this.angle += this.spinSpeed;
            if (this.y > height || this.x < -20 || this.x > width + 20) {
              this.reset();
            }
          }
        }
        draw() {
          ctx.save();
          if (type === "gold") {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(226, 184, 87, ${this.alpha})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = "rgba(226, 184, 87, 0.6)";
            ctx.fill();
          } else {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 182, 193, ${this.alpha})`;
            ctx.fill();
          }
          ctx.restore();
        }
      }
      const count = type === "gold" ? 30 : 20;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
      function loop() {
        if (!canvasAnimActive) return;
        if (!container.classList.contains("active")) {
          stopCanvasAnimation();
          return;
        }
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
        canvasAnimFrame = requestAnimationFrame(loop);
      }
      loop();
    }
    function updateHeroAnimations(level, daysSinceLastSession) {
      if (daysSinceLastSession >= 3) {
        stopCanvasAnimation();
        const animCont2 = container.querySelector("#hero-anim-container");
        if (animCont2) animCont2.innerHTML = "";
        currentAnimLevel = null;
        return;
      }
      let animLevel = 1;
      if (level >= 15) animLevel = 15;
      else if (level >= 10) animLevel = 10;
      else if (level >= 7) animLevel = 7;
      else if (level >= 5) animLevel = 5;
      else if (level >= 3) animLevel = 3;
      if (currentAnimLevel === animLevel) {
        if ((animLevel === 10 || animLevel === 15) && !canvasAnimActive) {
          const canvas = container.querySelector(".hero-canvas-el");
          if (canvas) {
            startCanvasParticles(canvas, animLevel === 10 ? "gold" : "sakura");
          }
        }
        return;
      }
      currentAnimLevel = animLevel;
      stopCanvasAnimation();
      const animCont = container.querySelector("#hero-anim-container");
      if (!animCont) return;
      animCont.innerHTML = "";
      if (animLevel === 1) {
        const glow = document.createElement("div");
        glow.className = "hero-breath-glow";
        animCont.appendChild(glow);
      } else if (animLevel === 3) {
        for (let i = 0; i < 3; i++) {
          const wisp = document.createElement("div");
          wisp.className = "steam-wisp";
          wisp.style.left = `${58 + (i - 1) * 2.5}%`;
          wisp.style.setProperty("--wisp-delay", `${i * 1.3}s`);
          animCont.appendChild(wisp);
        }
      } else if (animLevel === 5) {
        const bfly = document.createElement("div");
        bfly.className = "butterfly";
        bfly.innerHTML = `
                <svg viewBox="0 0 20 20" style="width:100%; height:100%;">
                    <path d="M10,10 C6,4 4,6 4,10 C4,14 6,12 10,10 Z" fill="#22d3ee" />
                    <path d="M10,10 C14,4 16,6 16,10 C16,14 14,12 10,10 Z" fill="#22d3ee" />
                </svg>
            `;
        animCont.appendChild(bfly);
      } else if (animLevel === 7) {
        const aura = document.createElement("div");
        aura.className = "gold-aura";
        animCont.appendChild(aura);
      } else if (animLevel === 10) {
        const canvas = document.createElement("canvas");
        canvas.className = "hero-canvas-el";
        animCont.appendChild(canvas);
        startCanvasParticles(canvas, "gold");
      } else if (animLevel === 15) {
        const canvas = document.createElement("canvas");
        canvas.className = "hero-canvas-el";
        animCont.appendChild(canvas);
        startCanvasParticles(canvas, "sakura");
      }
    }
    container.updateData = () => {
      const user = DB.getUser();
      let dailyGoal = 20;
      if (user) {
        container.querySelector("#home-name").textContent = user.name?.split(" ")[0] || "Alex";
        if (user.dailyCommitment) {
          dailyGoal = user.dailyCommitment;
        }
        if (user.avatar) {
          const profileAvatar = container.querySelector("#home-profile-avatar-img");
          if (profileAvatar) profileAvatar.src = user.avatar;
        }
      }
      container.querySelector("#home-goal-minutes").textContent = dailyGoal;
      const stats = DB.getStats();
      const levelNames = [
        "Novice",
        "Initiate",
        "Adept",
        "Seeker",
        "Wanderer",
        "Practitioner",
        "Disciple",
        "Guide",
        "Sage",
        "Master"
      ];
      const lName = levelNames[Math.min(stats.level - 1, levelNames.length - 1)] || "Novice";
      container.querySelector("#home-streak").textContent = stats.streak;
      container.querySelector("#home-level").textContent = `${stats.level} - ${lName}`;
      container.querySelector("#home-xp").textContent = stats.xp;
      container.querySelector("#home-today-minutes").textContent = stats.todayMinutes;
      container.querySelector("#home-total-sessions").textContent = stats.totalSessions;
      container.querySelector("#home-total-mins").textContent = stats.totalMinutes;
      const todayPct = Math.min(100, stats.todayMinutes / dailyGoal * 100);
      container.querySelector("#home-today-bar").style.width = todayPct + "%";
      const dq = DB.getDailyQuest ? DB.getDailyQuest() : null;
      const dqCardEl = container.querySelector("#home-dq-card");
      if (dq && dqCardEl) {
        const dqText = container.querySelector("#home-dq-text");
        const dqBadge = container.querySelector("#home-dq-badge");
        const dqIcon = container.querySelector("#home-dq-icon");
        if (dq.completed && !dq.claimed) {
          dqText.textContent = `\u2713 Completed: ${dq.label}`;
          dqText.style.fontWeight = "600";
          dqText.style.color = "#1b5e20";
          dqBadge.textContent = "\u{1F381} Claim +25 XP";
          dqBadge.style.background = "#277038";
          dqBadge.style.color = "#ffffff";
          dqBadge.style.fontWeight = "700";
          dqBadge.style.boxShadow = "0 3px 10px rgba(39, 112, 56, 0.35)";
          if (dqIcon) {
            dqIcon.style.background = "#277038";
            dqIcon.style.color = "#ffffff";
            dqIcon.style.boxShadow = "0 2px 6px rgba(39, 112, 56, 0.25)";
            dqIcon.innerHTML = '<span class="material-symbols-rounded">card_giftcard</span>';
          }
          dqCardEl.style.background = "linear-gradient(135deg, #e8f5e9 0%, #f1f8f3 100%)";
          dqCardEl.style.border = "1.5px solid #277038";
          dqCardEl.style.boxShadow = "0 3px 12px rgba(39, 112, 56, 0.15)";
          dqCardEl.style.cursor = "pointer";
          dqCardEl.onclick = () => {
            if (typeof DB.claimDailyQuest === "function") {
              const success = DB.claimDailyQuest(dq.type);
              if (success && typeof container.updateData === "function") {
                container.updateData();
              }
            }
          };
        } else if (dq.claimed) {
          dqText.textContent = `\u2713 Completed: ${dq.label}`;
          dqText.style.fontWeight = "500";
          dqText.style.color = "#386641";
          dqBadge.textContent = "\u2713 Claimed (+25 XP)";
          dqBadge.style.background = "#d8e8dc";
          dqBadge.style.color = "#277038";
          dqBadge.style.fontWeight = "600";
          dqBadge.style.boxShadow = "none";
          if (dqIcon) {
            dqIcon.style.background = "#277038";
            dqIcon.style.color = "#ffffff";
            dqIcon.style.boxShadow = "none";
            dqIcon.innerHTML = '<span class="material-symbols-rounded">check_circle</span>';
          }
          dqCardEl.style.background = "#f2f8f3";
          dqCardEl.style.border = "1px solid #c2dec9";
          dqCardEl.style.boxShadow = "none";
          dqCardEl.style.cursor = "default";
          dqCardEl.onclick = null;
        } else {
          dqText.textContent = `${dq.emoji || "\u{1F3AF}"} ${dq.label}`;
          dqText.style.fontWeight = "400";
          dqText.style.color = "var(--color-text-secondary)";
          dqBadge.textContent = `+${dq.xp || 25} XP`;
          dqBadge.style.background = "var(--color-accent-light)";
          dqBadge.style.color = "var(--color-accent-dark)";
          dqBadge.style.boxShadow = "none";
          if (dqIcon) {
            dqIcon.style.background = "#e8f4ec";
            dqIcon.style.color = "#2c8242";
            dqIcon.style.boxShadow = "none";
            dqIcon.innerHTML = '<span class="material-symbols-rounded">task_alt</span>';
          }
          dqCardEl.style.background = "var(--color-bg-card)";
          dqCardEl.style.border = "none";
          dqCardEl.style.boxShadow = "none";
          dqCardEl.style.cursor = "pointer";
          dqCardEl.onclick = () => {
            const targetTab = dq && dq.target ? dq.target : dq && dq.type === "wisdom" ? "wisdom" : dq && dq.type === "reflect" ? "reflect" : dq && dq.type === "journey" ? "journey" : "breathe";
            window.dispatchEvent(new CustomEvent("siddha-navigate", { detail: { target: targetTab } }));
          };
        }
      }
      const xpProgress = xpInCurrentLevel(stats.xp);
      const xpPct = Math.min(100, Math.max(0, xpProgress.earned / xpProgress.needed * 100));
      container.querySelector("#home-xp-bar").style.width = `${xpPct}%`;
      container.querySelector("#home-xp").textContent = stats.xp;
      let bgImg = "Siddha_lvl1.png";
      if (stats.level >= 15) bgImg = "Siddha_lvl15.png";
      else if (stats.level >= 10) bgImg = "Siddha_lvl10.png";
      else if (stats.level >= 7) bgImg = "Siddha_lvl7.png";
      else if (stats.level >= 5) bgImg = "Siddha_lvl5.png";
      else if (stats.level >= 3) bgImg = "Siddha_lvl3.png";
      if (stats.daysSinceLastSession >= 7) {
        bgImg = "Siddha_Nomed_7days.png";
      } else if (stats.daysSinceLastSession >= 3) {
        bgImg = "Siddha_nomed_3day.png";
      }
      container.style.backgroundImage = `url('./src/assets/${bgImg}')`;
      updateHeroAnimations(stats.level, stats.daysSinceLastSession);
      const bubble = container.querySelector("#companion-speech-bubble");
      const bubbleText = container.querySelector("#companion-bubble-text");
      if (window.siddhaBubbleTimer) clearTimeout(window.siddhaBubbleTimer);
      if (window.siddhaBubbleHideTimer) clearTimeout(window.siddhaBubbleHideTimer);
      if (bubble && bubbleText) {
        bubble.classList.remove("visible");
        const showBubble = () => {
          if (!document.contains(bubble)) return;
          let newQuote;
          const current = bubbleText.textContent;
          do {
            newQuote = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
          } while (newQuote === current && DIALOGUES.length > 1);
          bubbleText.textContent = newQuote;
          bubble.classList.add("visible");
          if (window.siddhaBubbleHideTimer) clearTimeout(window.siddhaBubbleHideTimer);
          window.siddhaBubbleHideTimer = setTimeout(() => {
            if (document.contains(bubble)) {
              bubble.classList.remove("visible");
            }
          }, 7e3);
        };
        window.siddhaBubbleTimer = setTimeout(showBubble, 5e3);
        bubble.onclick = (e) => {
          e.stopPropagation();
          bubble.style.transform = "translateX(-50%) scale(0.92)";
          setTimeout(() => {
            bubble.style.transform = "";
            bubble.classList.remove("visible");
            if (window.siddhaBubbleTimer) clearTimeout(window.siddhaBubbleTimer);
            if (window.siddhaBubbleHideTimer) clearTimeout(window.siddhaBubbleHideTimer);
          }, 150);
        };
      }
      container.querySelectorAll("[data-target]").forEach((el) => {
        el.onclick = (e) => {
          e.stopPropagation();
          const target = el.getAttribute("data-target");
          document.querySelector('.bottom-nav [data-target="' + target + '"]')?.click();
        };
      });
      container.querySelectorAll("[data-link]").forEach((el) => {
        el.onclick = (e) => {
          e.stopPropagation();
          const link = el.getAttribute("data-link");
          if (link === "wisdom") {
            window.dispatchEvent(new CustomEvent("siddha-navigate", { detail: { target: "wisdom" } }));
          } else {
            document.querySelector('.bottom-nav [data-target="' + link + '"]')?.click();
          }
        };
      });
    };
    return container;
  }

  // src/screens/journey.js
  init_db();
  init_synth();

  // src/services/haptics.js
  init_db();
  var HapticService2 = {
    /**
     * Triggers a vibration / haptic feedback sequence across iOS, Android, and Web.
     * Respects user's notification/vibration preference in DB.
     * @param {'light'|'medium'|'heavy'|'success'|'completion'|'bell'} style 
     */
    vibrate: async (style = "completion") => {
      try {
        const settings = DB.getNotificationSettings ? DB.getNotificationSettings() : {};
        if (settings.vibrationEnabled === false) {
          return;
        }
      } catch (e) {
      }
      const nativeHaptics = window.Capacitor?.Plugins?.Haptics;
      if (nativeHaptics) {
        try {
          if (style === "completion" || style === "success") {
            const triggerPulse = async () => {
              try {
                if (typeof nativeHaptics.impact === "function") {
                  nativeHaptics.impact({ style: "HEAVY" }).catch(() => {
                  });
                } else if (typeof nativeHaptics.vibrate === "function") {
                  nativeHaptics.vibrate({ duration: 250 }).catch(() => {
                  });
                }
              } catch (e) {
              }
            };
            setTimeout(() => triggerPulse(), 500);
            setTimeout(() => triggerPulse(), 1e4);
            setTimeout(() => triggerPulse(), 17e3);
            return;
          } else if (style === "bell") {
            if (typeof nativeHaptics.impact === "function") {
              await nativeHaptics.impact({ style: "MEDIUM" }).catch(() => {
              });
            } else if (typeof nativeHaptics.vibrate === "function") {
              await nativeHaptics.vibrate({ duration: 120 }).catch(() => {
              });
            }
            return;
          } else if (style === "light") {
            if (typeof nativeHaptics.impact === "function") {
              await nativeHaptics.impact({ style: "LIGHT" });
            }
            return;
          } else if (style === "medium") {
            if (typeof nativeHaptics.impact === "function") {
              await nativeHaptics.impact({ style: "MEDIUM" });
            }
            return;
          } else if (style === "heavy") {
            if (typeof nativeHaptics.impact === "function") {
              await nativeHaptics.impact({ style: "HEAVY" });
            }
            return;
          } else {
            if (typeof nativeHaptics.vibrate === "function") {
              await nativeHaptics.vibrate({ duration: 400 });
            }
            return;
          }
        } catch (err) {
          console.warn("[HapticService] Capacitor Haptics call error, using navigator fallback:", err);
        }
      }
      const globalHaptics = window.Capacitor?.Plugins?.Haptics;
      if (globalHaptics) {
        try {
          if (style === "completion" || style === "success") {
            if (typeof globalHaptics.notification === "function") {
              await globalHaptics.notification({ type: "SUCCESS" });
            } else if (typeof globalHaptics.vibrate === "function") {
              await globalHaptics.vibrate({ duration: 500 });
            }
          } else if (style === "bell") {
            await globalHaptics.impact({ style: "HEAVY" });
          } else {
            await globalHaptics.vibrate({ duration: 400 });
          }
          return;
        } catch (err) {
          console.warn("[HapticService] Global Haptics fallback error:", err);
        }
      }
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        try {
          if (style === "completion") {
            navigator.vibrate([250, 150, 250, 150, 250]);
          } else if (style === "bell") {
            navigator.vibrate([300, 150, 300]);
          } else {
            navigator.vibrate(200);
          }
        } catch (e) {
        }
      }
    }
  };

  // src/screens/journey.js
  var PATHS = {
    anapana: {
      id: "anapana",
      label: "Anapana",
      shortLabel: "Anapana",
      unlockLevel: 1,
      difficulty: "Low",
      bgImage: "./src/assets/anapana_bg.jpg",
      accentColor: "#705E39",
      nodeAccent: "rgba(112,94,57,0.15)",
      icon: "air",
      description: "Mindfulness of breathing to build concentration",
      nodes: [
        {
          id: 1,
          label: "Natural Respiration",
          subtitle: "Breath",
          icon: "air",
          description: "Observe the flow of the breath just as it is, without trying to control it.",
          xPct: 45,
          yPct: 8,
          missions: [
            { text: "Sit and observe the touch of the breath at the nostrils.", duration: 10 },
            { text: "Notice if the breath is long or short.", duration: 12 },
            { text: "Complete a 15-minute natural breath sit.", duration: 15 }
          ]
        },
        {
          id: 2,
          label: "The Touchpoint",
          subtitle: "Sensation",
          icon: "pin_drop",
          description: "Narrow your focus to the exact area where the breath touches: the upper lip or nostrils.",
          xPct: 60,
          yPct: 26,
          missions: [
            { text: "Locate the exact spot of touch inside the nostrils.", duration: 15 },
            { text: "Detect the difference in touch between inhale and exhale.", duration: 15 },
            { text: "Sit for 20 minutes maintaining focus on the touchpoint.", duration: 20 }
          ]
        },
        {
          id: 3,
          label: "Cool & Warm",
          subtitle: "Temperature",
          icon: "thermostat",
          description: "Note the changing temperature of the air as it enters and leaves your body.",
          xPct: 40,
          yPct: 44,
          missions: [
            { text: "Notice the cool air entering the nostrils on inhale.", duration: 15 },
            { text: "Notice the warm air exiting on the exhale.", duration: 15 },
            { text: "Maintain thermal awareness for a full 25-minute sit.", duration: 25 }
          ]
        },
        {
          id: 4,
          label: "Subtle Breath",
          subtitle: "Calm",
          icon: "waves",
          description: "As your mind settles, the breath becomes extremely soft, shallow, and quiet. Follow it closely.",
          xPct: 58,
          yPct: 62,
          missions: [
            { text: "Notice the breath becoming very shallow or faint.", duration: 20 },
            { text: "Observe the brief gap between the in-breath and out-breath.", duration: 20 },
            { text: "Keep single-pointed attention on the faint breath for 30 minutes.", duration: 30 }
          ]
        },
        {
          id: 5,
          label: "Absorption",
          subtitle: "Ekaggata",
          icon: "brightness_5",
          description: "Mind and breath merge. Focus is effortless and steady, preparing you for deeper insight.",
          xPct: 46,
          yPct: 80,
          missions: [
            { text: "Sit for 20 minutes with zero wandering of attention.", duration: 20 },
            { text: "Let go of the effort to concentrate; rest in the focus.", duration: 25 },
            { text: "Complete a 30-minute silent concentration session.", duration: 30 }
          ]
        }
      ]
    },
    metta: {
      id: "metta",
      label: "Metta",
      shortLabel: "Metta",
      unlockLevel: 2,
      difficulty: "Low",
      bgImage: "./src/assets/metta_bg.jpg",
      accentColor: "#7C4559",
      nodeAccent: "rgba(124,69,89,0.15)",
      icon: "favorite",
      description: "Loving-kindness to build compassion and dissolve aversion",
      nodes: [
        {
          id: 1,
          label: "Self-Compassion",
          subtitle: "Self",
          icon: "person",
          description: "Direct wishes of safety, happiness, and peace toward yourself.",
          xPct: 46,
          yPct: 8,
          missions: [
            { text: 'Silently repeat: "May I be happy, may I be peaceful."', duration: 10 },
            { text: "Notice any internal resistance or self-criticism and release it.", duration: 15 },
            { text: "Cultivate a feeling of warmth in your chest area.", duration: 15 },
            { text: "Sit for 20 minutes sending metta to yourself.", duration: 20 }
          ]
        },
        {
          id: 2,
          label: "The Guide",
          subtitle: "Gratitude",
          icon: "school",
          description: "Direct loving-kindness to someone who has guided, helped, or inspired you.",
          xPct: 59,
          yPct: 26,
          missions: [
            { text: "Bring to mind a mentor or teacher and smile internally.", duration: 15 },
            { text: 'Wish them: "May you be free from suffering, may you be peaceful."', duration: 15 },
            { text: "Observe the feeling of gratitude arising in your heart.", duration: 20 },
            { text: "Dedicate a 20-minute sit to your benefactor.", duration: 20 }
          ]
        },
        {
          id: 3,
          label: "The Stranger",
          subtitle: "Friendliness",
          icon: "people",
          description: "Direct loving-kindness to someone you see regularly but do not know personally.",
          xPct: 42,
          yPct: 44,
          missions: [
            { text: "Recall the face of a cashier, neighbor, or driver.", duration: 15 },
            { text: 'Acknowledge: "Just like me, they wish to be happy."', duration: 15 },
            { text: 'Wish them: "May you be safe, may you live with ease."', duration: 20 },
            { text: "Maintain focus on the neutral person for a 25-minute sit.", duration: 25 }
          ]
        },
        {
          id: 4,
          label: "The Difficult Person",
          subtitle: "Pardon",
          icon: "healing",
          description: "Gently direct loving-kindness to someone with whom you have minor friction or conflict.",
          xPct: 61,
          yPct: 62,
          missions: [
            { text: "Bring to mind a person with mild friction (avoid major trauma at first).", duration: 15 },
            { text: "Observe physical tightness in your body and breathe into it.", duration: 20 },
            { text: 'Wish them peace: "May you be happy, may we be free from conflict."', duration: 20 },
            { text: "Sit for 30 minutes holding the difficult person in kindness.", duration: 30 }
          ]
        },
        {
          id: 5,
          label: "Universal Goodwill",
          subtitle: "Boundless",
          icon: "public",
          description: "Extend your heart outward to all directions, covering all living beings everywhere.",
          xPct: 48,
          yPct: 80,
          missions: [
            { text: "Radiate metta to your room, your building, and your city.", duration: 20 },
            { text: "Extend the field of love to the entire country and continent.", duration: 25 },
            { text: "Radiate boundless goodwill to all creatures, seen and unseen.", duration: 25 },
            { text: "Abide in the ocean of universal loving-kindness for 40 minutes.", duration: 40 }
          ]
        }
      ]
    },
    vipassana: {
      id: "vipassana",
      label: "Vipassana",
      shortLabel: "Vipassana",
      unlockLevel: 3,
      difficulty: "High",
      bgImage: "./src/assets/vipassana_bg.jpg",
      accentColor: "#1A4A5A",
      nodeAccent: "rgba(26,74,90,0.15)",
      icon: "water_drop",
      description: "Ancient insight practice through body scanning",
      nodes: [
        {
          id: 1,
          label: "Body Scan",
          subtitle: "Foundation",
          icon: "accessibility_new",
          description: "Learn to feel sensation as pure energy, not concept.",
          xPct: 48,
          yPct: 8,
          missions: [
            { text: "Scan slowly from crown of head to feet without reacting.", duration: 15 },
            { text: "Note gross sensations: heat, tingling, pressure.", duration: 15 },
            { text: "Scan in both directions, top-to-bottom and bottom-to-top.", duration: 20 },
            { text: "Sit for 30 minutes with continuous scanning.", duration: 30 }
          ]
        },
        {
          id: 2,
          label: "Impermanence",
          subtitle: "Anicca",
          icon: "change_circle",
          description: "Observe that every sensation arises and passes away.",
          xPct: 58,
          yPct: 26,
          missions: [
            { text: 'Label each sensation: "arising" or "passing".', duration: 20 },
            { text: "Notice a pleasant sensation dissolve without craving.", duration: 20 },
            { text: "Notice an unpleasant sensation dissolve without aversion.", duration: 25 },
            { text: "Rest in the space between sensations.", duration: 25 }
          ]
        },
        {
          id: 3,
          label: "Subtle Body",
          subtitle: "Deeper Scan",
          icon: "vibration",
          description: "Move beyond gross sensations to subtle vibrations.",
          xPct: 40,
          yPct: 44,
          missions: [
            { text: 'Scan an area of the body that feels "blank" or numb.', duration: 20 },
            { text: "Notice the subtle vibration of aliveness beneath stillness.", duration: 25 },
            { text: "Scan the entire body as a field of vibration.", duration: 25 },
            { text: "Maintain equanimity for an entire 30-minute scan.", duration: 30 }
          ]
        },
        {
          id: 4,
          label: "Equanimity",
          subtitle: "Non-Reaction",
          icon: "balance",
          description: "Neither craving nor aversion \u2014 pure observation.",
          xPct: 58,
          yPct: 62,
          missions: [
            { text: "Sit with discomfort for 5 minutes without shifting.", duration: 15 },
            { text: "Smile internally at both pleasant and painful sensations.", duration: 20 },
            { text: "Observe an intense sensation with complete stillness.", duration: 25 },
            { text: "Dedicate a full sit to metta \u2014 loving kindness.", duration: 30 }
          ]
        },
        {
          id: 5,
          label: "Insight",
          subtitle: "Vipassana",
          icon: "remove_red_eye",
          description: "Direct insight into the three characteristics of experience.",
          xPct: 48,
          yPct: 80,
          missions: [
            { text: "Notice anicca (impermanence) in every breath cycle.", duration: 25 },
            { text: "Notice dukkha (unsatisfactoriness) \u2014 nothing fully satisfies.", duration: 25 },
            { text: "Notice anatta (no-self) \u2014 who is observing the observer?", duration: 30 },
            { text: "Sit for 45 minutes with continuous insight observation.", duration: 45 }
          ]
        }
      ]
    },
    tmi: {
      id: "tmi",
      label: "The Mind Illuminated",
      shortLabel: "TMI",
      unlockLevel: 4,
      difficulty: "Medium",
      bgImage: "./src/assets/journey_bg.jpg",
      accentColor: "#3F5247",
      nodeAccent: "rgba(63,82,71,0.15)",
      icon: "local_florist",
      description: "Systematic 10-stage framework for deep concentration",
      nodes: [
        {
          id: 1,
          label: "Establishing a Practice",
          subtitle: "Practice",
          icon: "event_seat",
          description: "Before mastering the mind, you must master your schedule.",
          xPct: 44,
          yPct: 8,
          missions: [
            { text: "Set a non-negotiable time & space for your practice.", duration: 10 },
            { text: "Sit for a realistic baseline of 15\u201320 minutes.", duration: 15 },
            { text: "Overcome the initial wave of procrastination.", duration: 15 },
            { text: "Establish a streak of 3 consecutive daily sits.", duration: 20 }
          ]
        },
        {
          id: 2,
          label: "Interrupted Attention & Mind-Wandering",
          subtitle: "Attention",
          icon: "psychology",
          description: "Transition consciously into the practice to stabilize focus.",
          xPct: 62,
          yPct: 26,
          missions: [
            { text: "Review your motivations before each sit.", duration: 15 },
            { text: "Set a specific, bite-sized goal for this session.", duration: 15 },
            { text: "Perform a mental inventory of current worries.", duration: 20 },
            { text: "Adjust posture and alignment for comfort.", duration: 20 }
          ]
        },
        {
          id: 3,
          label: "Extended Continuity & Forgetting",
          subtitle: "Continuity",
          icon: "anchor",
          description: "Anchor yourself in the space around you.",
          xPct: 38,
          yPct: 44,
          missions: [
            { text: "Maintain broad awareness of the present moment.", duration: 15 },
            { text: "Focus solely on raw physical sensations.", duration: 20 },
            { text: "Restrict attention to bodily sensations.", duration: 20 },
            { text: "Develop grounding in physical support and gravity.", duration: 20 }
          ]
        },
        {
          id: 4,
          label: "Continuous Attention & Gross Distraction",
          subtitle: "Focus",
          icon: "center_focus_strong",
          description: "Move focus from broad body sensations to the breath.",
          xPct: 60,
          yPct: 62,
          missions: [
            { text: "Observe the somatic rises and falls of breathing.", duration: 20 },
            { text: "Find and appreciate a pleasant quality in the breath.", duration: 20 },
            { text: "Narrow attention to the tip of the nose.", duration: 25 },
            { text: "Observe breath patterns passively without control.", duration: 25 }
          ]
        },
        {
          id: 5,
          label: "Overcoming Subtle Dullness",
          subtitle: "Dullness",
          icon: "visibility",
          description: "Use mental count markers to bridge focus when distracted.",
          xPct: 44,
          yPct: 80,
          missions: [
            { text: 'Silently count "one" at the end of the out-breath.', duration: 20 },
            { text: "Maintain counting cycles up to ten.", duration: 20 },
            { text: "Restart counting calmly from one if mind wanders.", duration: 25 },
            { text: "Intentionally drop counting to sit in pure silence.", duration: 30 }
          ]
        }
      ]
    },
    zen: {
      id: "zen",
      label: "Zen",
      shortLabel: "Zen",
      unlockLevel: 5,
      difficulty: "High",
      bgImage: "./src/assets/zen_bg.jpg",
      accentColor: "#3A3228",
      nodeAccent: "rgba(58,50,40,0.15)",
      icon: "circle",
      description: "Just sitting \u2014 shikantaza and open awareness",
      nodes: [
        {
          id: 1,
          label: "Beginner's Mind",
          subtitle: "Shoshin",
          icon: "child_care",
          description: "Approach each sit as if for the very first time.",
          xPct: 50,
          yPct: 8,
          missions: [
            { text: "Sit without any goal or technique \u2014 just be present.", duration: 15 },
            { text: "Notice and release every expectation that arises.", duration: 20 },
            { text: 'Observe the mind that wants to "do it right".', duration: 20 },
            { text: "Sit for 30 minutes with nothing to achieve.", duration: 30 }
          ]
        },
        {
          id: 2,
          label: "Just Sitting",
          subtitle: "Shikantaza",
          icon: "airline_seat_recline_normal",
          description: "Pure sitting \u2014 presence without object.",
          xPct: 55,
          yPct: 27,
          missions: [
            { text: "Sit with eyes half-open, gaze soft on the floor.", duration: 20 },
            { text: "Do not follow the breath \u2014 let it breathe itself.", duration: 20 },
            { text: "When a thought arises, do not grab it or push it away.", duration: 25 },
            { text: "Maintain shikantaza for a full 40 minutes.", duration: 40 }
          ]
        },
        {
          id: 3,
          label: "Breath Koan",
          subtitle: "MU",
          icon: "help_outline",
          description: 'Use the question "What is this?" as your anchor.',
          xPct: 44,
          yPct: 45,
          missions: [
            { text: 'Silently ask "What is this?" on each exhale.', duration: 20 },
            { text: "Don't answer \u2014 let the question hang open.", duration: 20 },
            { text: "Notice the space before a thought forms.", duration: 25 },
            { text: "Sit for 35 minutes with the koan.", duration: 35 }
          ]
        },
        {
          id: 4,
          label: "Open Awareness",
          subtitle: "Choiceless",
          icon: "all_inclusive",
          description: "Rest in awareness itself, without narrowing attention.",
          xPct: 55,
          yPct: 63,
          missions: [
            { text: "Include all sounds, sensations, and thoughts equally.", duration: 20 },
            { text: "Let awareness be the ocean, thoughts the waves.", duration: 25 },
            { text: "Notice the awareness that is aware of awareness.", duration: 30 },
            { text: "Sit for 45 minutes in pure choiceless awareness.", duration: 45 }
          ]
        },
        {
          id: 5,
          label: "No-Self",
          subtitle: "Anatta",
          icon: "person_off",
          description: "Who is the one who is sitting?",
          xPct: 50,
          yPct: 82,
          missions: [
            { text: 'Ask: "Who is aware?" \u2014 sit with the question.', duration: 25 },
            { text: 'Notice: is there a "you" behind your thoughts?', duration: 30 },
            { text: "Rest in the not-knowing \u2014 what is here without a self?", duration: 35 },
            { text: "Sit for 60 minutes: the final recognition.", duration: 60 }
          ]
        }
      ]
    }
  };
  function renderJourney() {
    const container = document.createElement("div");
    container.className = "screen journey-screen";
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

        <!-- Scrollable map \u2014 only this scrolls -->
        <div class="jh-map-scroll" id="journey-map-scroll">
            <div class="jh-map-inner" id="journey-map-inner">
                <!-- Nodes injected here -->
            </div>
        </div>

        <!-- Daily quest (hidden as requested) -->
        <div class="jh-quest-bar" id="journey-quest-bar" style="display: none !important;">
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
    const style = document.createElement("style");
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
    let activePathId = DB.getActivePath();
    const modal = container.querySelector("#mission-modal");
    container.querySelector("#modal-close").addEventListener("click", () => {
      modal.classList.remove("active");
      container.updateData();
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        container.updateData();
      }
    });
    container.querySelector("#j-path-learn-more").addEventListener("click", () => {
      const path = PATHS[activePathId];
      openPathInfoModal(path);
    });
    function openPathInfoModal(path) {
      const title = container.querySelector("#modal-title");
      const subtitle = container.querySelector("#modal-subtitle");
      const desc = container.querySelector("#modal-desc");
      const list = container.querySelector("#modal-missions-list");
      title.innerHTML = `${path.label} <span style="font-size:12px; font-weight:bold; padding: 3px 8px; border-radius:10px; margin-left: 8px; background:${path.accentColor}20; color:${path.accentColor}; border: 1px solid ${path.accentColor}40;">Difficulty: ${path.difficulty}</span>`;
      subtitle.textContent = "Lineage & Practical Insights";
      let detailsHtml = "";
      if (path.id === "anapana") {
        detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> Anapana is the classic Buddhist practice of mindfulness of breathing. It is the foundation for almost all meditation traditions.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> Rest your focus entirely on the physical touch of air at the rims of your nostrils or upper lip. Notice temperature, friction, and movement without following the breath into the body.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Builds sharp sensory clarity, calms the central nervous system, and prepares the mind for deep analytical body scanning.</p>
            `;
      } else if (path.id === "vipassana") {
        detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> Vipassana translates to "insight" \u2014 seeing things as they truly are. It is the heart of Theravada mindfulness lineages.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> Systematically scan physical body sensations from head to toe, observing them with total equanimity. You will observe impermanence (anicca) and non-reaction.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Reprograms the brain to stop reacting with craving or aversion to physical triggers, freeing you from deep-seated habit patterns.</p>
            `;
      } else if (path.id === "tmi") {
        detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> The Mind Illuminated (TMI) is a modern, highly systematic master guide that integrates classical teachings with cognitive science.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> A 10-stage progressive path focused on balancing attention (selecting specific details) with peripheral awareness (keeping track of the background environment).</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Eliminates dullness, stops mind-wandering, and establishes stable, effortless attention through structured metrics.</p>
            `;
      } else if (path.id === "metta") {
        detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> Metta is loving-kindness or goodwill. It is a heart-centered concentration technique rather than analytical scanning.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> Silently repeat phrases of protection, happiness, and peace toward yourself, then expand the circle to a mentor, a dear friend, a neutral stranger, a difficult person, and eventually all living beings.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Actively dissolves anger, builds empathy, increases emotional resilience, and softens self-criticism.</p>
            `;
      } else if (path.id === "zen") {
        detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Overview:</strong> Zen (Zazen) meditation comes from East Asian Mahayana traditions. It is the ultimate practice of non-doing and radical presence.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Technique:</strong> Direct your eyes downwards, sit with open awareness (Shikantaza \u2014 "just sitting"), and allow thoughts to arise and pass without any effort to hold or reject them.</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>Why practice:</strong> Directly reveals the spacious, non-dual nature of consciousness itself, dissolving the illusion of a separate self.</p>
            `;
      }
      desc.innerHTML = detailsHtml;
      list.innerHTML = "";
      modal.classList.add("active");
    }
    function triggerQuestSplash() {
      const bar = container.querySelector("#journey-quest-bar");
      const rect = bar.getBoundingClientRect();
      const parent = container;
      const parentRect = parent.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - parentRect.left;
      const y = rect.top + rect.height / 2 - parentRect.top;
      for (let i = 0; i < 15; i++) {
        const p = document.createElement("span");
        p.className = "material-symbols-rounded";
        p.textContent = "eco";
        p.style.position = "absolute";
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.fontSize = "20px";
        p.style.color = "#e2b857";
        p.style.pointerEvents = "none";
        p.style.zIndex = "300";
        p.style.transition = "all 1.2s cubic-bezier(0.25, 1, 0.5, 1)";
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 120;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 80;
        parent.appendChild(p);
        setTimeout(() => {
          p.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
          p.style.opacity = "0";
        }, 10);
        setTimeout(() => p.remove(), 1200);
      }
    }
    function openModal(node, path) {
      container.querySelector("#modal-title").textContent = node.label;
      container.querySelector("#modal-subtitle").textContent = `${path.label} \xB7 ${node.subtitle}`;
      container.querySelector("#modal-desc").textContent = node.description;
      const list = container.querySelector("#modal-missions-list");
      list.innerHTML = "";
      node.missions.forEach((mission, idx) => {
        const done = DB.isMissionComplete(node.id, idx, path.id);
        const item = document.createElement("div");
        item.className = "mission-item" + (done ? " completed" : "");
        if (!done) {
          item.setAttribute("role", "button");
          item.setAttribute("tabindex", "0");
        }
        item.innerHTML = `
                <div class="m-check"><span class="material-symbols-rounded">check</span></div>
                <div class="m-body">
                    <p class="m-text">${mission.text}</p>
                    <p class="m-meta">${mission.duration} minute sit \xB7 +20 XP on completion</p>
                </div>
                <div class="m-badge">${mission.duration}m</div>
            `;
        if (!done) {
          item.addEventListener("click", () => {
            modal.classList.remove("active");
            const breathe = document.querySelector(".breathe-screen");
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
            window.dispatchEvent(new CustomEvent("siddha-navigate", { detail: { target: "breathe" } }));
          });
        }
        list.appendChild(item);
      });
      modal.classList.add("active");
    }
    function buildMap(path) {
      const mapInner = container.querySelector("#journey-map-inner");
      const scrollArea = container.querySelector("#journey-map-scroll");
      const mapHeight = Math.max(600, path.nodes.length * 130 + 60);
      mapInner.style.height = `${mapHeight}px`;
      container.style.backgroundImage = `url('${path.bgImage}')`;
      mapInner.innerHTML = "";
      const progress = DB.getMissionProgress(path.id);
      const stats = DB.getStats();
      let foundCurrent = false;
      path.nodes.forEach((node) => {
        const doneCount = progress[node.id] ? progress[node.id].length : 0;
        const allDone = doneCount === node.missions.length;
        let isUnlocked = node.id === 1;
        if (node.id > 1) {
          const prevDone = progress[node.id - 1]?.length || 0;
          isUnlocked = prevDone === path.nodes[node.id - 2].missions.length;
        }
        let cls = "locked", icon = "lock";
        if (isUnlocked) {
          icon = node.icon || "self_improvement";
          if (allDone) {
            cls = "completed";
          } else if (!foundCurrent) {
            cls = "current";
            foundCurrent = true;
          } else {
            cls = "available";
          }
        }
        const el = document.createElement("div");
        el.className = `path-node ${cls}`;
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.style.left = `${node.xPct}%`;
        el.style.top = `${node.yPct}%`;
        el.innerHTML = `
                ${cls === "current" ? '<div class="node-pulse"></div>' : ""}
                <div class="node-circle">
                    <span class="material-symbols-rounded">${icon}</span>
                </div>
                <span class="node-label">${node.subtitle}</span>
            `;
        if (isUnlocked) {
          el.addEventListener("click", () => openModal(node, path));
        }
        mapInner.appendChild(el);
      });
      const pathUnlocked = stats.level >= path.unlockLevel || DB.isPathUnlocked(path.id);
      if (!pathUnlocked) {
        const overlay = document.createElement("div");
        overlay.className = "jh-map-locked-overlay";
        overlay.innerHTML = `
                <span class="material-symbols-rounded">lock</span>
                <p>${path.label}</p>
                <span class="lk-sub">Unlocks at Level ${path.unlockLevel}</span>
            `;
        mapInner.appendChild(overlay);
      }
      scrollArea.scrollTop = 0;
    }
    function buildTabs() {
      const tabBar = container.querySelector("#path-tab-bar");
      tabBar.innerHTML = "";
      const stats = DB.getStats();
      Object.values(PATHS).forEach((path) => {
        const isUnlocked = stats.level >= path.unlockLevel || DB.isPathUnlocked(path.id);
        const tab = document.createElement("button");
        tab.className = "jh-tab" + (path.id === activePathId ? " active" : "") + (!isUnlocked ? " locked" : "");
        tab.innerHTML = `
                <span class="material-symbols-rounded">${isUnlocked ? path.icon : "lock"}</span>
                ${path.shortLabel}
                ${!isUnlocked ? `<span style="font-size:9px;opacity:0.75;">Lv.${path.unlockLevel}</span>` : ""}
            `;
        if (isUnlocked) {
          tab.addEventListener("click", () => {
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
      container.querySelector("#j-path-subtitle").textContent = path.description;
    }
    container.updateData = () => {
      const stats = DB.getStats();
      container.querySelector("#j-level-text").textContent = `Lv.${stats.level}`;
      const xpProgress = xpInCurrentLevel(stats.xp);
      const xpPct = Math.min(100, xpProgress.earned / xpProgress.needed * 100);
      container.querySelector("#j-xp-bar").style.width = `${xpPct}%`;
      container.querySelector("#j-xp-label").textContent = `${xpProgress.earned} / ${xpProgress.needed} XP`;
      activePathId = DB.getActivePath();
      updateHeader();
      buildTabs();
      buildMap(PATHS[activePathId]);
      const q = DB.getDailyQuest();
      const questSub = container.querySelector("#journey-quest-sub");
      const questBadge = container.querySelector("#journey-quest-badge");
      const questBar = container.querySelector("#journey-quest-bar");
      if (q && questSub && questBadge && questBar) {
        questSub.textContent = `${q.emoji || "\u{1F3AF}"} ${q.label}`;
        if (q.claimed) {
          questBadge.textContent = "Claimed \u2714";
          questBadge.style.background = "rgba(255,255,255,0.2)";
          questBadge.style.color = "rgba(255,255,255,0.6)";
          questBadge.style.animation = "none";
          questBar.style.opacity = "0.7";
          questBar.style.cursor = "default";
          questBar.onclick = null;
        } else if (q.completed) {
          questBadge.textContent = "Claim +25 XP";
          questBadge.style.background = "#e2b857";
          questBadge.style.color = "#1b2e26";
          questBadge.style.animation = "pulseGlow 1.5s infinite";
          questBar.style.opacity = "1";
          questBar.style.cursor = "pointer";
          questBar.onclick = () => {
            const success = DB.claimDailyQuest(q.type);
            if (success) {
              Synth.playQuestClaimSound();
              HapticService2.vibrate("medium");
              triggerQuestSplash();
              container.updateData();
            }
          };
        } else {
          questBadge.textContent = "+25 XP";
          questBadge.style.background = "rgba(255,255,255,0.15)";
          questBadge.style.color = "white";
          questBadge.style.animation = "none";
          questBar.style.opacity = "1";
          questBar.style.cursor = "pointer";
          questBar.onclick = () => {
            const targetTab = q && q.target ? q.target : q && q.type === "wisdom" ? "wisdom" : q && q.type === "reflect" ? "reflect" : q && q.type === "journey" ? "journey" : "breathe";
            window.dispatchEvent(new CustomEvent("siddha-navigate", { detail: { target: targetTab } }));
          };
        }
      }
    };
    return container;
  }

  // src/screens/breathe.js
  init_db();
  init_synth();
  function renderBreathe(onComplete) {
    const container = document.createElement("div");
    container.className = "screen breathe-screen";
    let START_MINUTES = 10;
    let timeLeft = START_MINUTES * 60;
    let timerInterval = null;
    let isPaused = true;
    let sessionElapsed = 0;
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
            <!-- Dev skip \u2014 hidden unless developer mode is unlocked -->
            <button class="bh-btn bh-skip dev-only" id="dev-skip-btn" aria-label="Skip (dev)">
                <span class="material-symbols-rounded">fast_forward</span>
            </button>
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

            <!-- Interval Bell Input + Mute Toggle -->
            <div class="bh-soundscape-container" id="soundscape-container" style="margin-bottom: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.7); transition: opacity 0.3s;">
                <span class="material-symbols-rounded" style="font-size:18px;">notifications_active</span>
                <label for="bell-interval-input">Bell every:</label>
                <input type="number" id="bell-interval-input" min="0" placeholder="5" style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; padding: 4px; font-size: 12px; width: 48px; text-align: center; outline: none;" value="5">
                <span>min</span>
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
                <!-- Active Session Intention Anchor Pill (placed just above timer) -->
                <div id="active-intention-anchor" class="bh-active-intention" style="display:none;">
                    <span class="material-symbols-rounded" style="font-size:14px; color:#ffd166;">auto_awesome</span>
                    <span id="active-intention-text"></span>
                </div>

                <h1 class="bh-timer" id="breathe-timer">10:00</h1>
                <p class="bh-timer-hint" id="bh-timer-hint" style="display:none;">Tap \u23ED to finish early</p>
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
                            <strong>What is a Sankalpa?</strong> A heartfelt intention formed in a calm mind. It sets a gentle direction for your sit\u2014such as anchoring in breath or letting go of tension\u2014without creating goals or pressure.
                        </p>
                    </div>
                </div>

                <!-- User Custom Intention Input Box ON TOP -->
                <div style="margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <label style="font-size:11px; font-weight:700; color:rgba(255,255,255,0.9); display:flex; align-items:center; gap:4px;">
                            \u270D\uFE0F Your Intention
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
                        <span id="modal-inspiration-chevron" style="font-size:11px; transition:transform 0.2s;">\u25BC</span>
                    </button>

                    <!-- Collapsible Content -->
                    <div id="modal-inspiration-body" style="display:none; flex-direction:column; gap:10px; margin-top:10px; max-height:260px; overflow-y:auto; padding-right:4px;">
                        
                        <!-- Category 1: Grounding & Calming -->
                        <div class="bh-intent-cat-group">
                            <div class="bh-intent-cat-title">\u{1F33F} Grounding & Calming</div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention for this sit is to step out of the mental chatter and anchor myself in the quiet rhythm of my breath.">
                                <div class="bh-intent-card-title">Anchor in the Breath</div>
                                <div class="bh-intent-card-sub">\u201CStep out of mental chatter and anchor in the quiet rhythm of breath.\u201D</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I intend to give my nervous system permission to rest, letting go of physical tightness and mental stress with every exhale.">
                                <div class="bh-intent-card-title">Nervous System Rest</div>
                                <div class="bh-intent-card-sub">\u201CGive nervous system permission to rest, letting go of stress with every exhale.\u201D</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I sit to create space between my emotions and my actions, so I can meet difficulty with calm rather than impulse.">
                                <div class="bh-intent-card-title">Respond, Not React</div>
                                <div class="bh-intent-card-sub">\u201CCreate space between emotions & actions, meeting difficulty with calm.\u201D</div>
                            </div>
                        </div>

                        <!-- Category 2: Sharpening the Mind -->
                        <div class="bh-intent-cat-group">
                            <div class="bh-intent-cat-title">\u{1F9D8} Sharpening the Mind</div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention is to gently bring my mind back to the breath whenever it wanders, strengthening my ability to focus.">
                                <div class="bh-intent-card-title">Single-Pointed Focus</div>
                                <div class="bh-intent-card-sub">\u201CGently return to breath whenever mind wanders, strengthening focus.\u201D</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I intend to cultivate a bright, clear, and alert presence, resting in awareness without slipping into dullness or sleep.">
                                <div class="bh-intent-card-title">Bright & Alert Presence</div>
                                <div class="bh-intent-card-sub">\u201CCultivate bright, clear presence without slipping into dullness or sleep.\u201D</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I sit to watch the landscape of my thoughts without getting swept up in the storylines.">
                                <div class="bh-intent-card-title">Observe Without Judgment</div>
                                <div class="bh-intent-card-sub">\u201CWatch the landscape of thoughts without getting swept up in storylines.\u201D</div>
                            </div>
                        </div>

                        <!-- Category 3: Openness & Acceptance -->
                        <div class="bh-intent-cat-group">
                            <div class="bh-intent-cat-title">\u{1F30A} Openness & Acceptance</div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention is to meet pleasant, unpleasant, or neutral sensations with equal openness, without trying to push or pull.">
                                <div class="bh-intent-card-title">Welcome Whatever Arises</div>
                                <div class="bh-intent-card-sub">\u201CMeet all sensations with equal openness, without pushing or pulling.\u201D</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I intend to treat my impatient or wandering mind with patience and kindness today, rather than criticism.">
                                <div class="bh-intent-card-title">Self-Compassion & Kindness</div>
                                <div class="bh-intent-card-sub">\u201CTreat impatient mind with patience & kindness today, not criticism.\u201D</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I sit to practice non-striving\u2014releasing the need to accomplish anything and simply being as I am.">
                                <div class="bh-intent-card-title">Non-Striving & Letting Go</div>
                                <div class="bh-intent-card-sub">\u201CRelease the need to accomplish anything and simply be as I am.\u201D</div>
                            </div>
                        </div>

                        <!-- Category 4: Insight & Connection -->
                        <div class="bh-intent-cat-group">
                            <div class="bh-intent-cat-title">\u2728 Insight & Connection</div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention is to sit in the spacious quiet beneath my thoughts and rest in pure awareness.">
                                <div class="bh-intent-card-title">Rest in Pure Awareness</div>
                                <div class="bh-intent-card-sub">\u201CSit in the spacious quiet beneath thoughts and rest in pure awareness.\u201D</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="I sit to cultivate clarity and peace within myself, so I can bring greater patience and kindness to others.">
                                <div class="bh-intent-card-title">Dedicate the Practice</div>
                                <div class="bh-intent-card-sub">\u201CCultivate clarity & peace so I can bring kindness to others.\u201D</div>
                            </div>
                            <div class="bh-modal-intent-card" data-fullintent="My intention is to simply show up for this moment, trusting the practice one breath at a time.">
                                <div class="bh-intent-card-title">Honor the Path</div>
                                <div class="bh-intent-card-sub">\u201CSimply show up for this moment, trusting the practice one breath at a time.\u201D</div>
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
    const style = document.createElement("style");
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
      const timerEl = container.querySelector("#breathe-timer");
      const playBtn = container.querySelector("#play-pause-btn");
      const resetBtn = container.querySelector("#reset-btn");
      const devSkipBtn = container.querySelector("#dev-skip-btn");
      const presetsEl = container.querySelector("#timer-presets");
      const presetBtns = container.querySelectorAll(".bh-preset[data-time]");
      const customBtn = container.querySelector("#custom-preset-btn");
      const customCont = container.querySelector("#custom-timer-input-container");
      const setCustomBtn = container.querySelector("#set-custom-btn");
      const customInput = container.querySelector("#custom-minutes-input");
      const glow = container.querySelector(".bh-glow");
      const closeBtn = container.querySelector("#breathe-close-btn");
      const hint = container.querySelector("#bh-timer-hint");
      const breathePrompt = container.querySelector("#breathe-prompt");
      const muteBtn = container.querySelector("#sound-mute-btn");
      const muteIcon = container.querySelector("#mute-icon");
      let promptInterval = null;
      let lastTickTime = null;
      const intentionTriggerWrap = container.querySelector("#intention-trigger-wrap");
      const openModalBtn = container.querySelector("#open-intention-modal-btn");
      const triggerLabel = container.querySelector("#intention-trigger-label");
      const modalOverlay = container.querySelector("#intention-modal-overlay");
      const closeModalBtn = container.querySelector("#close-intention-modal-btn");
      const saveModalBtn = container.querySelector("#modal-save-intention-btn");
      const clearModalBtn = container.querySelector("#modal-clear-intention-btn");
      const modalCards = container.querySelectorAll(".bh-modal-intent-card");
      const modalInput = container.querySelector("#modal-intention-input");
      const modalClearTextBtn = container.querySelector("#modal-clear-text-btn");
      const inspirationToggle = container.querySelector("#modal-inspiration-toggle");
      const inspirationBody = container.querySelector("#modal-inspiration-body");
      const inspirationChevron = container.querySelector("#modal-inspiration-chevron");
      const activeIntentionAnchor = container.querySelector("#active-intention-anchor");
      const activeIntentionText = container.querySelector("#active-intention-text");
      let currentIntention = "";
      function updateTriggerButtonUI() {
        if (currentIntention) {
          const previewText = currentIntention.length > 28 ? currentIntention.slice(0, 28) + "..." : currentIntention;
          triggerLabel.textContent = `\u2728 Intention: "${previewText}"`;
          openModalBtn.style.borderColor = "rgba(255,209,102,0.5)";
          openModalBtn.style.background = "rgba(255,209,102,0.15)";
          openModalBtn.style.color = "#ffffff";
        } else {
          triggerLabel.textContent = "Set Sit Intention (Optional)";
          openModalBtn.style.borderColor = "rgba(255,255,255,0.18)";
          openModalBtn.style.background = "rgba(255,255,255,0.09)";
          openModalBtn.style.color = "rgba(255,255,255,0.85)";
        }
      }
      if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
          modalOverlay.style.display = "flex";
        });
      }
      if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
          modalOverlay.style.display = "none";
        });
      }
      if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
          if (e.target === modalOverlay) modalOverlay.style.display = "none";
        });
      }
      if (inspirationToggle && inspirationBody) {
        inspirationToggle.addEventListener("click", () => {
          const isHidden = inspirationBody.style.display === "none";
          inspirationBody.style.display = isHidden ? "flex" : "none";
          if (inspirationChevron) {
            inspirationChevron.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
          }
        });
      }
      modalCards.forEach((card) => {
        card.addEventListener("click", () => {
          const fullText = card.dataset.fullintent;
          if (card.classList.contains("active")) {
            card.classList.remove("active");
            modalInput.value = "";
            if (modalClearTextBtn) modalClearTextBtn.style.display = "none";
          } else {
            modalCards.forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
            modalInput.value = fullText;
            if (modalClearTextBtn) modalClearTextBtn.style.display = "inline";
          }
        });
      });
      if (modalInput) {
        modalInput.addEventListener("input", () => {
          const val = modalInput.value.trim();
          if (modalClearTextBtn) modalClearTextBtn.style.display = val ? "inline" : "none";
          modalCards.forEach((c) => {
            if (c.dataset.fullintent === val) {
              c.classList.add("active");
            } else {
              c.classList.remove("active");
            }
          });
        });
      }
      if (modalClearTextBtn) {
        modalClearTextBtn.addEventListener("click", () => {
          modalInput.value = "";
          modalCards.forEach((c) => c.classList.remove("active"));
          modalClearTextBtn.style.display = "none";
        });
      }
      if (clearModalBtn) {
        clearModalBtn.addEventListener("click", () => {
          currentIntention = "";
          modalInput.value = "";
          modalCards.forEach((c) => c.classList.remove("active"));
          if (modalClearTextBtn) modalClearTextBtn.style.display = "none";
          updateTriggerButtonUI();
          modalOverlay.style.display = "none";
        });
      }
      if (saveModalBtn) {
        saveModalBtn.addEventListener("click", () => {
          currentIntention = modalInput.value.trim();
          if (currentIntention) {
            Synth.playSankalpaHum();
          }
          updateTriggerButtonUI();
          modalOverlay.style.display = "none";
        });
      }
      let isMuted = localStorage.getItem("siddha_sound_meditation_muted") === "true" || localStorage.getItem("siddha_sound_muted") === "true";
      function applyMuteState() {
        muteIcon.textContent = isMuted ? "volume_off" : "volume_up";
        muteBtn.style.background = isMuted ? "rgba(255,80,80,0.25)" : "rgba(255,255,255,0.1)";
        muteBtn.style.borderColor = isMuted ? "rgba(255,80,80,0.4)" : "rgba(255,255,255,0.2)";
      }
      applyMuteState();
      muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        localStorage.setItem("siddha_sound_muted", isMuted);
        applyMuteState();
      });
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && !isPaused && lastTickTime) {
          const now = Date.now();
          const delta = Math.floor((now - lastTickTime) / 1e3);
          if (delta > 0) {
            timeLeft = Math.max(0, timeLeft - delta);
            sessionElapsed += delta;
            lastTickTime += delta * 1e3;
            updateDisplay();
            const intervalVal = parseFloat(container.querySelector("#bell-interval-input").value);
            if (intervalVal > 0 && !isMuted) {
              const intervalSeconds = intervalVal * 60;
              const prevElapsed = sessionElapsed - delta;
              const prevBoundary = Math.floor(prevElapsed / intervalSeconds);
              const currentBoundary = Math.floor(sessionElapsed / intervalSeconds);
              if (currentBoundary > prevBoundary && timeLeft > 0) {
                if (!(window.Capacitor?.getPlatform() === "android" && window.Capacitor?.Plugins?.MeditationNative)) {
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
      glow.style.animationPlayState = "paused";
      container.querySelectorAll(".bh-ring").forEach((r) => r.style.animationPlayState = "paused");
      container.querySelector(".bh-core").style.animationPlayState = "paused";
      function updateDisplay() {
        const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
        const s = (timeLeft % 60).toString().padStart(2, "0");
        timerEl.textContent = `${m}:${s}`;
      }
      function updatePresetsState() {
        const minMins = container.activeMission ? container.activeMission.minDuration : 0;
        presetBtns.forEach((btn) => {
          const t = parseInt(btn.dataset.time);
          if (isNaN(t)) return;
          if (t < minMins) {
            btn.classList.add("disabled");
            btn.style.opacity = "0.35";
            btn.style.pointerEvents = "none";
          } else {
            btn.classList.remove("disabled");
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
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
        const banner = container.querySelector("#mission-info-banner");
        const bannerText = container.querySelector("#mission-info-text");
        const titleEl = container.querySelector("#breathe-screen-title");
        const descEl = container.querySelector("#breathe-screen-desc");
        if (container.activeMission) {
          titleEl.textContent = container.activeMission.label;
          descEl.textContent = "Complete the sit to finish the mission";
          presetsEl.style.display = "flex";
          banner.style.display = "block";
          bannerText.textContent = container.activeMission.description;
        } else {
          titleEl.textContent = "Meditation";
          descEl.textContent = "Find your center";
          presetsEl.style.display = "flex";
          banner.style.display = "none";
        }
        updatePresetsState();
      };
      function setRunningUI(running) {
        glow.style.animationPlayState = running ? "running" : "paused";
        container.querySelectorAll(".bh-ring").forEach((r) => r.style.animationPlayState = running ? "running" : "paused");
        container.querySelector(".bh-core").style.animationPlayState = running ? "running" : "paused";
        playBtn.querySelector(".material-symbols-rounded").textContent = running ? "pause" : "play_arrow";
        presetsEl.style.opacity = running ? "0" : "1";
        presetsEl.style.pointerEvents = running ? "none" : "auto";
        resetBtn.style.visibility = running ? "visible" : "hidden";
        hint.style.display = running ? "block" : "none";
        breathePrompt.style.opacity = running ? "1" : "0";
        const soundscapeEl = container.querySelector("#soundscape-container");
        soundscapeEl.style.opacity = running ? "0" : "1";
        soundscapeEl.style.pointerEvents = running ? "none" : "auto";
        if (intentionTriggerWrap) {
          intentionTriggerWrap.style.opacity = running ? "0" : "1";
          intentionTriggerWrap.style.pointerEvents = running ? "none" : "auto";
        }
        const activeIntentionAnchor2 = container.querySelector("#active-intention-anchor");
        const activeIntentionText2 = container.querySelector("#active-intention-text");
        if (activeIntentionAnchor2 && activeIntentionText2) {
          if (running && currentIntention) {
            activeIntentionText2.textContent = `Intention: "${currentIntention}"`;
            activeIntentionAnchor2.style.display = "inline-flex";
          } else {
            activeIntentionAnchor2.style.display = "none";
          }
        }
        if (!running && !container.activeMission && customBtn.classList.contains("active")) {
          customCont.style.display = "flex";
        } else {
          customCont.style.display = "none";
        }
        if (running) {
          let phase = 0;
          breathePrompt.textContent = "Inhale...";
          promptInterval = setInterval(() => {
            phase = 1 - phase;
            breathePrompt.style.opacity = "0";
            setTimeout(() => {
              breathePrompt.textContent = phase === 0 ? "Inhale..." : "Exhale...";
              breathePrompt.style.opacity = "1";
            }, 1e3);
          }, 5e3);
        } else {
          clearInterval(promptInterval);
          breathePrompt.style.opacity = "0";
        }
      }
      let wakeLockSentinel = null;
      function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        Synth.stop();
        Synth.stopKeepAlive();
        if (Synth.SitAudioKeepAlive) Synth.SitAudioKeepAlive.stop();
        if (window.Capacitor?.getPlatform() === "android" && window.Capacitor?.Plugins?.MeditationNative) {
          window.Capacitor.Plugins.MeditationNative.stopService().catch(() => {
          });
        }
        if (wakeLockSentinel) {
          try {
            wakeLockSentinel.release();
          } catch (e) {
          }
          wakeLockSentinel = null;
        }
        if ("mediaSession" in navigator) {
          try {
            navigator.mediaSession.playbackState = "paused";
          } catch (e) {
          }
        }
        if (window.Capacitor?.Plugins?.LocalNotifications) {
          const cancelIds = Array.from({ length: 100 }, (_, i) => ({ id: 201 + i }));
          cancelIds.push({ id: 99 });
          window.Capacitor.Plugins.LocalNotifications.cancel({ notifications: cancelIds }).catch(() => {
          });
          window.Capacitor.Plugins.LocalNotifications.getPending().then((pending) => {
            if (pending && pending.notifications && pending.notifications.length > 0) {
              const sitNotifs = pending.notifications.filter((n) => n.id === 99 || n.id >= 201);
              if (sitNotifs.length > 0) {
                window.Capacitor.Plugins.LocalNotifications.cancel({ notifications: sitNotifs }).catch(() => {
                });
              }
            }
          }).catch(() => {
          });
        }
      }
      function finishSession(minutesOverride) {
        const isNaturalFinish = timeLeft <= 0;
        stopTimer();
        setRunningUI(false);
        const actualMins = minutesOverride != null ? minutesOverride : START_MINUTES;
        DB.completeMeditation(actualMins);
        const activeMission = container.activeMission;
        if (activeMission) {
          DB.completeMission(
            activeMission.nodeId,
            activeMission.missionIndex,
            activeMission.pathId || "tmi"
          );
          container.activeMission = null;
        }
        DB.checkAndTriggerAchievements(false);
        const pathId = activeMission ? activeMission.pathId || "tmi" : DB.getActivePath() || "tmi";
        const itemMap = {
          tmi: "acorns",
          anapana: "acorns",
          vipassana: "blossoms",
          metta: "blossoms",
          zen: "nectar"
        };
        const itemDropped = itemMap[pathId] || "acorns";
        timeLeft = START_MINUTES * 60;
        sessionElapsed = 0;
        updateDisplay();
        if (isNaturalFinish) {
          if (!isMuted) {
            const isAndroidNative = window.Capacitor?.getPlatform() === "android" && window.Capacitor?.Plugins?.MeditationNative;
            if (!isAndroidNative) {
              Synth.playEndBell();
            }
          }
          HapticService2.vibrate("completion");
        }
        if (onComplete) onComplete({ duration: actualMins, mission: activeMission, itemDropped, intention: currentIntention });
      }
      closeBtn.addEventListener("click", () => {
        stopTimer();
        setRunningUI(false);
        container.activeMission = null;
        START_MINUTES = 10;
        timeLeft = START_MINUTES * 60;
        sessionElapsed = 0;
        updateDisplay();
        container.querySelector("#breathe-screen-title").textContent = "Meditation";
        container.querySelector("#breathe-screen-desc").textContent = "Find your center";
        container.querySelector("#mission-info-banner").style.display = "none";
        presetsEl.style.display = "flex";
        document.querySelector('[data-target="home"]')?.click();
      });
      resetBtn.addEventListener("click", () => {
        stopTimer();
        isPaused = true;
        timeLeft = START_MINUTES * 60;
        sessionElapsed = 0;
        updateDisplay();
        setRunningUI(false);
      });
      devSkipBtn.addEventListener("click", () => {
        if (!isPaused) {
          const elapsed = Math.max(1, Math.floor(sessionElapsed / 60));
          finishSession(elapsed);
        } else {
          finishSession(START_MINUTES);
        }
      });
      playBtn.addEventListener("click", () => {
        if (isPaused) {
          isPaused = false;
          setRunningUI(true);
          if (!isMuted) {
            Synth.primeBells();
            setTimeout(() => {
              Synth.playStartBell();
            }, 100);
          }
          Synth.ensureKeepAlive();
          if (Synth.SitAudioKeepAlive) Synth.SitAudioKeepAlive.start();
          if ("wakeLock" in navigator) {
            navigator.wakeLock.request("screen").then((wl) => {
              wakeLockSentinel = wl;
            }).catch(() => {
            });
          }
          if (window.Capacitor?.getPlatform() === "android" && window.Capacitor?.Plugins?.MeditationNative) {
            const intervalVal = parseFloat(container.querySelector("#bell-interval-input").value) || 0;
            window.Capacitor.Plugins.MeditationNative.startService({
              intervalSeconds: isMuted ? 0 : Math.floor(intervalVal * 60),
              totalSeconds: timeLeft
            }).catch((e) => console.error("[Breathe] Native service error:", e));
          }
          if ("mediaSession" in navigator) {
            try {
              navigator.mediaSession.metadata = new MediaMetadata({
                title: "Meditation Sit \u{1F9D8}",
                artist: "Siddha",
                album: "Mindfulness Practice"
              });
              navigator.mediaSession.playbackState = "playing";
            } catch (e) {
            }
          }
          if (window.Capacitor?.Plugins?.LocalNotifications) {
            window.Capacitor.Plugins.LocalNotifications.requestPermissions().catch(() => {
            });
          }
          lastTickTime = Date.now();
          timerInterval = setInterval(() => {
            const now = Date.now();
            const delta = Math.floor((now - lastTickTime) / 1e3);
            if (delta > 0) {
              timeLeft = Math.max(0, timeLeft - delta);
              sessionElapsed += delta;
              lastTickTime += delta * 1e3;
              updateDisplay();
              const intervalVal = parseFloat(container.querySelector("#bell-interval-input").value);
              if (intervalVal > 0 && !isMuted) {
                const intervalSeconds = intervalVal * 60;
                const prevElapsed = sessionElapsed - delta;
                const prevBoundary = Math.floor(prevElapsed / intervalSeconds);
                const currentBoundary = Math.floor(sessionElapsed / intervalSeconds);
                if (currentBoundary > prevBoundary && timeLeft > 0) {
                  if (!(window.Capacitor?.getPlatform() === "android" && window.Capacitor?.Plugins?.MeditationNative)) {
                    Synth.playIntervalBell();
                  }
                }
              }
              if (timeLeft <= 0) finishSession(START_MINUTES);
            }
          }, 500);
        } else {
          stopTimer();
          setRunningUI(false);
        }
      });
      const clearMissionBtn = container.querySelector("#clear-active-mission-btn");
      if (clearMissionBtn) {
        clearMissionBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          container.activeMission = null;
          container.querySelector("#mission-info-banner").style.display = "none";
          container.querySelector("#breathe-screen-title").textContent = "Meditation";
          container.querySelector("#breathe-screen-desc").textContent = "Find your center";
          updatePresetsState();
        });
      }
      presetBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          if (!isPaused) return;
          if (btn.classList.contains("disabled")) return;
          presetBtns.forEach((b) => b.classList.remove("active"));
          customBtn.classList.remove("active");
          customCont.style.display = "none";
          btn.classList.add("active");
          START_MINUTES = parseInt(btn.dataset.time);
          timeLeft = START_MINUTES * 60;
          sessionElapsed = 0;
          updateDisplay();
          updatePresetsState();
        });
      });
      customBtn.addEventListener("click", () => {
        if (!isPaused) return;
        presetBtns.forEach((b) => b.classList.remove("active"));
        customBtn.classList.add("active");
        customCont.style.display = "flex";
      });
      setCustomBtn.addEventListener("click", () => {
        let mins = parseInt(customInput.value);
        if (isNaN(mins) || mins < 1) mins = 1;
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
        customCont.style.display = "none";
      });
      container.updateData = () => {
        if (isPaused && sessionElapsed === 0 && !container.activeMission) {
          const user = DB.getUser();
          if (user && user.dailyCommitment) {
            const commitmentMins = parseInt(user.dailyCommitment);
            if (!isNaN(commitmentMins) && commitmentMins > 0) {
              START_MINUTES = commitmentMins;
              timeLeft = START_MINUTES * 60;
              presetBtns.forEach((btn) => {
                const btnTime = parseInt(btn.dataset.time);
                if (btnTime === START_MINUTES) {
                  btn.classList.add("active");
                } else {
                  btn.classList.remove("active");
                }
              });
              if (customBtn) customBtn.classList.remove("active");
              if (customCont) customCont.style.display = "none";
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

  // src/screens/reflect.js
  init_db();
  function renderReflect(onNewReflection) {
    const container = document.createElement("div");
    container.className = "screen scrollable reflect-screen";
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
            <p class="rfl-quote-text">"You are the sky. Everything else \u2013 it\u2019s just the weather."</p>
            <p class="rfl-quote-author">\u2014 Pema Ch\xF6dr\xF6n</p>
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
    const style = document.createElement("style");
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
    const moodCard = container.querySelector("#rfl-mood-card");
    if (moodCard) {
      const header = moodCard.querySelector(".collapsible-header");
      const content = moodCard.querySelector(".collapsible-content");
      const toggle = moodCard.querySelector(".collapsible-toggle");
      const storageKey = "siddha_reflect_mood_collapsed";
      const isCollapsed = localStorage.getItem(storageKey) === "true";
      if (isCollapsed) {
        moodCard.classList.add("collapsed");
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        toggle.style.transform = "rotate(-90deg)";
      } else {
        moodCard.classList.remove("collapsed");
        content.style.maxHeight = "2000px";
        content.style.opacity = "1";
        toggle.style.transform = "rotate(0deg)";
      }
      header.addEventListener("click", () => {
        const currentlyCollapsed = moodCard.classList.contains("collapsed");
        if (currentlyCollapsed) {
          moodCard.classList.remove("collapsed");
          content.style.maxHeight = "2000px";
          content.style.opacity = "1";
          toggle.style.transform = "rotate(0deg)";
          localStorage.setItem(storageKey, "false");
        } else {
          moodCard.classList.add("collapsed");
          content.style.maxHeight = "0px";
          content.style.opacity = "0";
          toggle.style.transform = "rotate(-90deg)";
          localStorage.setItem(storageKey, "true");
        }
      });
    }
    container.querySelector("#new-reflection-btn").addEventListener("click", () => {
      const nr = document.querySelector(".new-reflection-screen");
      if (nr) {
        nr.sessionData = null;
        nr.activeMission = null;
      }
      if (onNewReflection) onNewReflection();
      else document.querySelector('[data-target="reflect"]')?.click();
    });
    container.querySelector("#rfl-toggle-all-btn").addEventListener("click", () => {
      showAll = !showAll;
      container.querySelector("#rfl-toggle-all-btn").textContent = showAll ? "Hide past" : "Show all";
      container.updateData();
    });
    function formatDate(isoString) {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    }
    container.updateData = () => {
      const reflections = DB.getReflections();
      const moodContainer = container.querySelector("#rfl-mood-flow-container");
      if (moodContainer) {
        if (reflections.length === 0) {
          moodContainer.innerHTML = `
                    <div style="text-align: center; padding: 12px 0; color: var(--color-text-muted); font-size: 12px;">
                        Complete a session or add a reflection to visualize your mind state trends.
                    </div>
                `;
        } else {
          let getMindStateTitle = function(focus, stability, equanimity) {
            if (equanimity >= 65 && focus >= 65 && stability >= 65) return { title: "Open Samadhi", emoji: "\u{1F54A}\uFE0F", color: "#10b981" };
            if (focus >= 60 && stability < 35) return { title: "Striving against Dullness", emoji: "\u{1F634}", color: "#7c3aed" };
            if (focus < 35 && stability < 35 && equanimity < 35) return { title: "Turbulent Mind", emoji: "\u{1F32A}\uFE0F", color: "#e11d48" };
            if (focus < 35 && stability < 35) return { title: "Sleepy Drift", emoji: "\u{1F4A4}", color: "#f59e0b" };
            if (focus >= 65 && stability >= 60) return { title: "Laser Clarity", emoji: "\u{1F3AF}", color: "#6366f1" };
            if (focus >= 65 && equanimity < 35) return { title: "Tense Striving", emoji: "\u26A1", color: "#f43f5e" };
            if (equanimity >= 65 && focus < 40) return { title: "Equanimous Flow", emoji: "\u{1F30A}", color: "#06b6d4" };
            if (stability >= 65 && equanimity >= 60) return { title: "Tranquil Stillness", emoji: "\u{1F30C}", color: "#3b82f6" };
            if (stability >= 45 && focus < 35 && equanimity >= 40) return { title: "Gentle Anchoring", emoji: "\u{1F56F}\uFE0F", color: "#14b8a6" };
            if (focus >= 50 && stability >= 50) return { title: "Focused Clarity", emoji: "\u{1F9D8}", color: "#8b5cf6" };
            return { title: "Gentle Awareness", emoji: "\u{1F331}", color: "#a855f7" };
          }, renderLotusBloomSVG = function(focus, stability, equanimity) {
            let title = "Gentle Bloom";
            if (focus >= 70 && stability >= 70 && equanimity >= 70) title = "Open Samadhi";
            else if (focus >= 60 && stability >= 60) title = "Quiet Presence";
            else if (focus < 40 && stability < 40) title = "Resting Bud";
            const scale = 0.55 + focus / 100 * 0.45;
            const petalSpread = Math.round(18 + stability / 100 * 32);
            let pGrad1Stop1 = "#84a98c", pGrad1Stop2 = "#52796f";
            let pGrad2Stop1 = "#d8f3dc", pGrad2Stop2 = "#74c69d";
            let centerColor = "#e9c46a";
            if (stability >= 70 || focus >= 70) {
              pGrad1Stop1 = "#34d399";
              pGrad1Stop2 = "#059669";
              pGrad2Stop1 = "#fbbf24";
              pGrad2Stop2 = "#d97706";
              centerColor = "#ffd166";
            } else if (stability >= 40 || focus >= 40) {
              pGrad1Stop1 = "#2a9d8f";
              pGrad1Stop2 = "#264653";
              pGrad2Stop1 = "#e9c46a";
              pGrad2Stop2 = "#f4a261";
              centerColor = "#f4a261";
            }
            const particleOpacity = Math.max(0.3, equanimity / 100);
            return `
                        <div style="text-align:center; padding:16px 14px; background:var(--color-bg-card); border-radius:18px; border:1px solid rgba(0,0,0,0.06); box-shadow:0 4px 16px rgba(0,0,0,0.03);">
                            <div style="font-size:18px; font-weight:700; font-family:var(--font-heading); color:var(--color-text-primary); margin-bottom:2px;">\u{1F338} Lotus Bloom</div>
                            <div style="font-size:12px; font-weight:600; color:var(--color-accent); margin-bottom:14px;">"${title}"</div>

                            <div style="position:relative; width:180px; height:140px; margin:0 auto;">
                                <svg width="180" height="140" viewBox="0 0 200 180" style="overflow:visible; animation:lotus-breathe 7s ease-in-out infinite;">
                                    <defs>
                                        <radialGradient id="lotusCenterGlow" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stop-color="${centerColor}" stop-opacity="${0.4 + focus / 100 * 0.5}" />
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
          }, renderCompassMandala = function(focus, stability, equanimity, matrixPts = "") {
            const f = Math.min(100, Math.max(0, focus));
            const s = Math.min(100, Math.max(0, stability));
            const eq = Math.min(100, Math.max(0, equanimity));
            const spread2 = (Math.abs(f - s) + Math.abs(s - eq) + Math.abs(eq - f)) / 3;
            const coherencePct2 = Math.max(0, Math.round(100 - spread2));
            const isBalancedMind = Math.abs(f - s) <= 10 && Math.abs(s - eq) <= 10 && Math.abs(eq - f) <= 10;
            const isHarmonious = coherencePct2 >= 70 || isBalancedMind;
            const pointX = isBalancedMind ? 50 : Math.min(90, Math.max(10, f));
            const pointY = isBalancedMind ? 50 : Math.min(90, Math.max(10, 100 - s));
            const strokeColor = isHarmonious ? "url(#vividGoldGrad)" : `rgba(139, 92, 246, ${Math.max(0.25, coherencePct2 / 100).toFixed(2)})`;
            const glowOpacity = isHarmonious ? "0.85" : Math.max(0.2, coherencePct2 / 100 * 0.75).toFixed(2);
            const centerAuraColor = isHarmonious ? "#fbbf24" : "#8b5cf6";
            const centerAuraOpacity = isHarmonious ? 0.45 : (0.15 + coherencePct2 / 100 * 0.25).toFixed(2);
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
                        <circle cx="110" cy="110" r="100" stroke="${strokeColor}" stroke-width="${isHarmonious ? 2 : 1.2}" fill="none" stroke-dasharray="${isHarmonious ? "6,3" : "4,4"}"/>
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
                        <circle cx="110" cy="110" r="35" stroke="${isHarmonious ? "#ffd166" : "rgba(139,92,246,0.4)"}" stroke-width="2" fill="none"/>
                        <circle cx="110" cy="110" r="18" fill="${isHarmonious ? "#ffd166" : "rgba(139,92,246,0.3)"}" opacity="0.7"/>
                    `;
            return `
                        <div style="background:var(--color-bg-card); border-radius:18px; padding:18px 16px; border:1.5px solid ${isHarmonious ? "var(--color-accent)" : "rgba(0,0,0,0.06)"}; box-shadow:${isHarmonious ? "0 8px 24px rgba(16,185,129,0.15)" : "0 4px 16px rgba(0,0,0,0.03)"};">
                            <div style="font-size:18px; font-weight:700; font-family:var(--font-heading); color:var(--color-text-primary); margin-bottom:2px; text-align:center;">\u{1F9ED} Compass / Mandala</div>
                            <div style="font-size:12px; font-weight:600; color:${isHarmonious ? "var(--color-accent)" : "var(--color-text-muted)"}; margin-bottom:14px; text-align:center;">
                                ${isHarmonious ? "\u2728 Harmonious Sacred Geometry Active" : `Inner Balance Coherence: ${coherencePct2}%`}
                            </div>

                            <div style="position:relative; width:100%; height:230px; background:${isHarmonious ? "radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.12), rgba(245, 158, 11, 0.08), var(--color-bg-secondary))" : "var(--color-bg-secondary)"}; border-radius:16px; border:1.5px solid rgba(0,0,0,0.08); overflow:hidden; padding:8px; box-shadow:inset 0 2px 6px rgba(0,0,0,0.04);">
                                
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
                                <span style="position:absolute; top:8px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--color-text-muted); font-weight:700; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">Clarity \u25B2</span>
                                <span style="position:absolute; bottom:8px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--color-text-muted); font-weight:600; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">\u25BC Equanimity</span>
                                <span style="position:absolute; top:50%; right:10px; transform:translateY(-50%); font-size:10px; color:var(--color-text-muted); font-weight:700; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">Absorption \u25BA</span>
                                <span style="position:absolute; top:50%; left:10px; transform:translateY(-50%); font-size:10px; color:var(--color-text-muted); font-weight:600; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">\u25C4 Focus</span>

                                <!-- Plotted Sit Nodes Constellation -->
                                ${matrixPts}

                                <!-- Luminous Gliding Active State Point (600ms transition) -->
                                <div style="position:absolute; left:${pointX}%; top:${pointY}%; transform:translate(-50%, -50%); width:18px; height:18px; border-radius:50%; background:${isHarmonious ? "#ffd166" : "var(--color-accent)"}; box-shadow:0 0 20px ${isHarmonious ? "#ffd166" : "var(--color-accent)"}, 0 0 8px #ffffff; border:3px solid #ffffff; z-index:10; pointer-events:none; transition:all 600ms cubic-bezier(0.25, 1, 0.5, 1);"></div>
                            </div>

                            <!-- State Alignment Badge -->
                            <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-top:12px;">
                                ${isBalancedMind ? `
                                    <span style="font-size:11.5px; padding:5px 16px; border-radius:14px; font-weight:700; background:linear-gradient(135deg, #10b981, #059669); color:#ffffff; box-shadow:0 3px 10px rgba(16,185,129,0.35);">
                                        \u2728 Balanced Mind (Centred)
                                    </span>
                                ` : isHarmonious ? `
                                    <span style="font-size:11px; padding:4px 14px; border-radius:14px; font-weight:700; background:linear-gradient(135deg, #3b82f6, #8b5cf6); color:#ffffff; box-shadow:0 2px 8px rgba(59,130,246,0.3);">
                                        \u273A Harmonious Flow (${coherencePct2}%)
                                    </span>
                                ` : `
                                    <span style="font-size:10.5px; font-weight:600; color:var(--color-text-muted);">
                                        Current State: Focus ${f}% \u2022 Clarity ${s}% \u2022 Equanimity ${eq}%
                                    </span>
                                `}
                            </div>
                        </div>
                    `;
          }, renderStateMatrixMap = function(focus, stability, equanimity, matrixPts = "") {
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
                                <span style="position:absolute; top:8px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--color-text-muted); font-weight:700; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">High Stability \u25B2</span>
                                <span style="position:absolute; bottom:8px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--color-text-muted); font-weight:600; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">\u25BC Low Stability</span>
                                <span style="position:absolute; top:50%; right:10px; transform:translateY(-50%); font-size:10px; color:var(--color-text-muted); font-weight:700; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">High Focus \u25BA</span>
                                <span style="position:absolute; top:50%; left:10px; transform:translateY(-50%); font-size:10px; color:var(--color-text-muted); font-weight:600; background:rgba(255,255,255,0.75); padding:2px 8px; border-radius:6px; pointer-events:none;">\u25C4 Low Focus</span>

                                <!-- Plotted Sit Nodes Constellation -->
                                ${matrixPts}

                                <!-- Gliding Active Point -->
                                <div style="position:absolute; left:${pointX}%; top:${pointY}%; transform:translate(-50%, -50%); width:18px; height:18px; border-radius:50%; background:var(--color-accent); box-shadow:0 0 16px var(--color-accent), 0 0 6px #ffffff; border:3px solid #ffffff; z-index:10; pointer-events:none; transition:all 600ms cubic-bezier(0.25, 1, 0.5, 1);"></div>
                            </div>

                            <!-- State Alignment Badge -->
                            <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-top:12px;">
                                ${isBalancedMind ? `
                                    <span style="font-size:11.5px; padding:5px 16px; border-radius:14px; font-weight:700; background:linear-gradient(135deg, #10b981, #059669); color:#ffffff; box-shadow:0 3px 10px rgba(16,185,129,0.35);">
                                        \u2728 Balanced Mind (Centred)
                                    </span>
                                ` : `
                                    <span style="font-size:10.5px; font-weight:600; color:var(--color-text-muted);">
                                        Current Point: Focus ${f}% \u2022 Stability ${s}% \u2022 Equanimity ${eq}%
                                    </span>
                                `}
                            </div>
                        </div>
                    `;
          };
          const MOOD_EMOJI2 = { calm: "\u{1F60C}", happy: "\u{1F60A}", tired: "\u{1F634}", anxious: "\u{1F630}", grateful: "\u{1F64F}", neutral: "\u{1F610}", clear: "\u2728", restless: "\u{1F32A}\uFE0F" };
          const MOOD_COLORS = { calm: "#4ea8de", happy: "#ffd166", tired: "#90e0ef", anxious: "#f77f00", grateful: "#06d6a0", neutral: "#a8dadc", clear: "#805ad5", restless: "#e63946" };
          const counts = {};
          let totalFocus = 0;
          let totalStability = 0;
          let totalEquanimity = 0;
          let scoredCount = 0;
          reflections.forEach((r) => {
            const m = r.mood || "calm";
            counts[m] = (counts[m] || 0) + 1;
            if (typeof r.focusScore === "number") {
              totalFocus += r.focusScore;
              totalStability += r.stabilityScore || 50;
              totalEquanimity += r.equanimityScore || 50;
              scoredCount++;
            }
          });
          const total = reflections.length;
          const sortedMoods = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
          const topMood = sortedMoods[0];
          const avgFocus = scoredCount > 0 ? Math.round(totalFocus / scoredCount) : 50;
          const avgStability = scoredCount > 0 ? Math.round(totalStability / scoredCount) : 50;
          const avgEquanimity = scoredCount > 0 ? Math.round(totalEquanimity / scoredCount) : 50;
          const spread = (Math.abs(avgFocus - avgStability) + Math.abs(avgStability - avgEquanimity) + Math.abs(avgEquanimity - avgFocus)) / 3;
          const coherencePct = Math.max(0, Math.round(100 - spread));
          let matrixPoints = "";
          const displayReflections = reflections.slice(0, 15);
          displayReflections.forEach((r, idx) => {
            const fX = r.focusScore !== void 0 ? Math.min(90, Math.max(10, r.focusScore)) : 50;
            const rawS = r.stabilityScore !== void 0 ? r.stabilityScore : 50;
            const sY = Math.min(88, Math.max(12, 100 - rawS));
            const opacity = Math.max(0.4, 1 - idx * 0.05);
            const isLatest = idx === 0;
            matrixPoints += `
                        <div style="position:absolute; left:${fX}%; top:${sY}%; transform:translate(-50%, -50%); width:${isLatest ? 12 : 8}px; height:${isLatest ? 12 : 8}px; border-radius:50%; background:${isLatest ? "var(--color-accent)" : "#8b5cf6"}; opacity:${opacity}; box-shadow:${isLatest ? "0 0 12px var(--color-accent)" : "0 0 4px rgba(139,92,246,0.4)"}; border:${isLatest ? "2px solid #ffffff" : "1.5px solid rgba(255,255,255,0.85)"}; pointer-events:none; transition: all 250ms ease;"></div>
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
                        <button class="rfl-vis-tab active" data-target="pane-map">\u{1F4CD} State Matrix Map</button>
                        <button class="rfl-vis-tab" data-target="pane-mandala">\u{1F9ED} Compass Mandala</button>
                        <button class="rfl-vis-tab" data-target="pane-lotus">\u{1F338} Lotus Bloom</button>
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
                            <span>\u2699\uFE0F Live Visualizer Sandbox (Dev Tool)</span>
                            <span id="rfl-dev-chevron" style="font-size:11px; transition:transform 0.2s;">\u25BC</span>
                        </button>
                        <div id="rfl-dev-body" style="display:none; padding:0 14px 14px; flex-direction:column; gap:12px;">
                            <div style="font-size:10.5px; color:var(--color-text-muted); font-style:italic; margin-bottom:2px;">
                                Adjust sliders below to test how the Siddha visualizers react to different mind state combinations in real-time.
                            </div>
                            
                            <!-- Focus Slider -->
                            <div>
                                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--color-text-primary); margin-bottom:4px;">
                                    <span>\u{1F9D8} Focus & Concentration</span>
                                    <span id="rfl-dev-val-focus" style="color:var(--color-accent); font-weight:700;">${avgFocus}%</span>
                                </div>
                                <input type="range" id="rfl-dev-slider-focus" min="0" max="100" value="${avgFocus}" style="width:100%; accent-color:var(--color-accent); cursor:pointer;" />
                            </div>
                            
                            <!-- Stability Slider -->
                            <div>
                                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--color-text-primary); margin-bottom:4px;">
                                    <span>\u2600\uFE0F Stability & Clarity</span>
                                    <span id="rfl-dev-val-stability" style="color:#3b82f6; font-weight:700;">${avgStability}%</span>
                                </div>
                                <input type="range" id="rfl-dev-slider-stability" min="0" max="100" value="${avgStability}" style="width:100%; accent-color:#3b82f6; cursor:pointer;" />
                            </div>
                            
                            <!-- Equanimity Slider -->
                            <div>
                                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--color-text-primary); margin-bottom:4px;">
                                    <span>\u{1F54A}\uFE0F Equanimity & Openness</span>
                                    <span id="rfl-dev-val-equanimity" style="color:#10b981; font-weight:700;">${avgEquanimity}%</span>
                                </div>
                                <input type="range" id="rfl-dev-slider-equanimity" min="0" max="100" value="${avgEquanimity}" style="width:100%; accent-color:#10b981; cursor:pointer;" />
                            </div>
                        </div>
                    </div>
                `;
          const tabs = moodContainer.querySelectorAll(".rfl-vis-tab");
          const panes = moodContainer.querySelectorAll(".rfl-vis-pane");
          tabs.forEach((t) => {
            t.addEventListener("click", () => {
              tabs.forEach((tab) => tab.classList.remove("active"));
              panes.forEach((pane) => pane.classList.remove("active"));
              t.classList.add("active");
              const targetId = t.dataset.target;
              const targetPane = moodContainer.querySelector(`#${targetId}`);
              if (targetPane) targetPane.classList.add("active");
            });
          });
          const devToggle = moodContainer.querySelector("#rfl-dev-toggle");
          const devBody = moodContainer.querySelector("#rfl-dev-body");
          const devChevron = moodContainer.querySelector("#rfl-dev-chevron");
          if (devToggle && devBody) {
            devToggle.addEventListener("click", () => {
              const isHidden = devBody.style.display === "none";
              devBody.style.display = isHidden ? "flex" : "none";
              if (devChevron) devChevron.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
            });
            const sliderFocus = moodContainer.querySelector("#rfl-dev-slider-focus");
            const sliderStability = moodContainer.querySelector("#rfl-dev-slider-stability");
            const sliderEquanimity = moodContainer.querySelector("#rfl-dev-slider-equanimity");
            const valFocus = moodContainer.querySelector("#rfl-dev-val-focus");
            const valStability = moodContainer.querySelector("#rfl-dev-val-stability");
            const valEquanimity = moodContainer.querySelector("#rfl-dev-val-equanimity");
            const badgeHarmony = moodContainer.querySelector("#rfl-harmony-badge");
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
              const paneMap = moodContainer.querySelector("#pane-map");
              if (paneMap) paneMap.innerHTML = renderStateMatrixMap(f, s, eq, matrixPoints);
              const paneMandala = moodContainer.querySelector("#pane-mandala");
              if (paneMandala) paneMandala.innerHTML = renderCompassMandala(f, s, eq, matrixPoints);
              const paneLotus = moodContainer.querySelector("#pane-lotus");
              if (paneLotus) paneLotus.innerHTML = renderLotusBloomSVG(f, s, eq);
            };
            if (sliderFocus) sliderFocus.addEventListener("input", updateDevVisualizers);
            if (sliderStability) sliderStability.addEventListener("input", updateDevVisualizers);
            if (sliderEquanimity) sliderEquanimity.addEventListener("input", updateDevVisualizers);
          }
        }
      }
      const list = container.querySelector("#reflection-list");
      list.innerHTML = "";
      if (reflections.length === 0) {
        list.innerHTML = '<p class="rfl-empty">No reflections yet. Tap Reflect above to add your first.</p>';
        return;
      }
      const MOOD_EMOJI = { calm: "\u{1F60C}", happy: "\u{1F60A}", tired: "\u{1F634}", anxious: "\u{1F630}", grateful: "\u{1F64F}", neutral: "\u{1F610}", clear: "\u2728", restless: "\u{1F32A}\uFE0F" };
      const FOCUS_LABELS = {
        wandering: "\u{1F300} Wandering",
        unsteady: "\u{1F30A} Unsteady",
        settling: "\u{1F343} Settling",
        focused: "\u{1F9D8} Focused",
        absorbed: "\u2728 Absorbed"
      };
      const HINDRANCE_LABELS = {
        dullness: "\u{1F4A4} Sleepiness",
        restlessness: "\u{1F41D} Restlessness",
        craving: "\u{1F4AD} Craving",
        aversion: "\u26A1 Aversion",
        doubt: "\u2753 Doubt"
      };
      const itemsToShow = showAll ? reflections : reflections.slice(0, 3);
      itemsToShow.forEach((ref) => {
        const item = document.createElement("div");
        item.className = "rfl-item";
        const emoji = MOOD_EMOJI[ref.mood] || "\u{1F60A}";
        const isStandalone = !ref.duration;
        const focusBadge = ref.focusDepth ? `<span style="font-size:10px; font-weight:600; background:var(--color-bg-secondary); padding:2px 8px; border-radius:10px; color:var(--color-text-secondary);">${FOCUS_LABELS[ref.focusDepth] || ref.focusDepth}</span>` : "";
        const hindranceTags = ref.hindrances && ref.hindrances.length > 0 ? `<div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:2px;">
                    ${ref.hindrances.map((h) => `<span style="font-size:10px; padding:2px 6px; border-radius:8px; background:rgba(124,69,89,0.08); color:#7C4559; font-weight:500;">${HINDRANCE_LABELS[h] || h}</span>`).join("")}
                   </div>` : "";
        const intentionTag = ref.intention ? `<div style="font-size:11px; font-weight:600; color:var(--color-accent-dark); background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.15); padding:3px 10px; border-radius:8px; display:inline-flex; align-items:center; gap:4px; margin-top:2px;">
                    \u2728 Intention: "${ref.intention}"
                   </div>` : "";
        item.innerHTML = `
                <div class="rfl-item-top">
                    <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                        <span class="rfl-item-mood">${emoji}</span>
                        ${isStandalone ? '<span class="rfl-item-standalone">Standalone</span>' : `<span class="rfl-item-duration">${ref.duration}m sit</span>`}
                        ${focusBadge}
                    </div>
                    <span class="rfl-item-date">${formatDate(ref.date)}</span>
                </div>
                ${intentionTag}
                ${hindranceTags}
                ${ref.text ? `<p class="rfl-item-text">${ref.text}</p>` : ""}
            `;
        list.appendChild(item);
      });
      if (!showAll && reflections.length > 3) {
        const hiddenMsg = document.createElement("p");
        hiddenMsg.className = "rfl-empty";
        hiddenMsg.textContent = `${reflections.length - 3} older reflections hidden.`;
        list.appendChild(hiddenMsg);
      }
    };
    return container;
  }

  // src/screens/login.js
  init_db();
  function renderLogin(onLoginSuccess) {
    const container = document.createElement("div");
    container.className = "screen login-screen active";
    let currentStep = 0;
    const totalSteps = 6;
    const onboardingData = {
      name: "",
      experience: "beginner",
      goal: "stress",
      commitment: 10
    };
    container.innerHTML = `
        <div class="onboarding-container">
            <!-- Progress Bar -->
            <div class="onboarding-progress-bar" id="progress-bar-container" style="display: none;">
                <div class="onboarding-progress-fill" id="progress-fill"></div>
            </div>

            <!-- Slides Container -->
            <div class="slides-wrapper">
                
                <!-- Slide 0: Welcome -->
                <div class="onboarding-slide active" data-step="0">
                    <div class="welcome-halo-container">
                        <div class="halo-ring ring-1"></div>
                        <div class="halo-ring ring-2"></div>
                        <div class="halo-ring ring-3"></div>
                        <div class="halo-core">
                            <span class="material-symbols-rounded halo-icon">self_improvement</span>
                        </div>
                    </div>
                    <h1 class="welcome-title">Siddha</h1>
                    <p class="welcome-subtitle">Gamified meditation for deep concentration</p>
                    <p class="welcome-text">
                        Welcome to your personal sanctuary. Let\u2019s take a few moments to tailor your journey towards presence and focus.
                    </p>
                    <button class="btn btn-primary btn-next-welcome" style="margin-top: 32px; padding: 16px 40px; font-size: 16px;">
                        Begin Onboarding
                    </button>
                </div>

                <!-- Slide 1: Name Input -->
                <div class="onboarding-slide" data-step="1">
                    <span class="material-symbols-rounded slide-header-icon">badge</span>
                    <h2 class="slide-title">What should we call you?</h2>
                    <p class="slide-description">Your name will be used to personalize your daily mindfulness greeting.</p>
                    
                    <div class="input-group">
                        <input type="text" id="user-name-input" placeholder="Enter your name" autocomplete="off" maxlength="20">
                        <span class="input-focus-line"></span>
                    </div>

                    <p id="name-validation-error" class="validation-error">Please enter your name to proceed.</p>
                </div>

                <!-- Slide 2: Experience Level -->
                <div class="onboarding-slide" data-step="2">
                    <span class="material-symbols-rounded slide-header-icon">insights</span>
                    <h2 class="slide-title">Your meditation experience?</h2>
                    <p class="slide-description">We will adjust the starting session times and guides accordingly.</p>
                    
                    <div class="options-grid">
                        <div class="option-card active" data-value="beginner" data-field="experience">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">spa</span></div>
                            <div class="option-content">
                                <h4 class="option-label">Beginner</h4>
                                <p class="option-desc">New to meditation or sitting occasionally. Let's start with basics.</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="intermediate" data-field="experience">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">psychology_alt</span></div>
                            <div class="option-content">
                                <h4 class="option-label">Intermediate</h4>
                                <p class="option-desc">Have a semi-regular practice. Familiar with focus and distraction.</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="advanced" data-field="experience">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">wb_sunny</span></div>
                            <div class="option-content">
                                <h4 class="option-label">Advanced</h4>
                                <p class="option-desc">Consistent daily sits. Seeking deep concentration or Jhana states.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slide 3: Primary Goal -->
                <div class="onboarding-slide" data-step="3">
                    <span class="material-symbols-rounded slide-header-icon">target</span>
                    <h2 class="slide-title">What is your main goal?</h2>
                    <p class="slide-description">Choose the focus that matters most to you right now.</p>
                    
                    <div class="options-grid">
                        <div class="option-card active" data-value="stress" data-field="goal">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">grass</span></div>
                            <div class="option-content">
                                <h4 class="option-label">Reduce Stress</h4>
                                <p class="option-desc">Calm your nervous system and find peace in everyday moments.</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="focus" data-field="goal">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">center_focus_strong</span></div>
                            <div class="option-content">
                                <h4 class="option-label">Deepen Concentration</h4>
                                <p class="option-desc">Sharpen stable attention, clarity, and cognitive control.</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="habit" data-field="goal">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">calendar_today</span></div>
                            <div class="option-content">
                                <h4 class="option-label">Build a Daily Habit</h4>
                                <p class="option-desc">Establish consistency and discipline in sitting daily.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slide 4: Daily Commitment -->
                <div class="onboarding-slide" data-step="4">
                    <span class="material-symbols-rounded slide-header-icon">schedule</span>
                    <h2 class="slide-title">Daily time commitment?</h2>
                    <p class="slide-description">Setting a small, realistic daily window helps cement the habit.</p>
                    
                    <div class="options-grid">
                        <div class="option-card" data-value="5" data-field="commitment">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">alarm</span></div>
                            <div class="option-content">
                                <h4 class="option-label">5 Minutes</h4>
                                <p class="option-desc">A gentle, bite-sized daily pause.</p>
                            </div>
                        </div>
                        <div class="option-card active" data-value="10" data-field="commitment">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">potted_plant</span></div>
                            <div class="option-content" style="position: relative;">
                                <span class="badge-recommended">RECOMMENDED</span>
                                <h4 class="option-label">10 Minutes</h4>
                                <p class="option-desc">Perfect balance of depth and consistency.</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="15" data-field="commitment">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">hourglass_empty</span></div>
                            <div class="option-content">
                                <h4 class="option-label">15 Minutes</h4>
                                <p class="option-desc">A slightly deeper, traditional practice time.</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="20" data-field="commitment">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">self_improvement</span></div>
                            <div class="option-content">
                                <h4 class="option-label">20+ Minutes</h4>
                                <p class="option-desc">A serious daily commitment to mental training.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slide 5: Summary & Enter Sanctuary -->
                <div class="onboarding-slide" data-step="5">
                    <div class="summary-card glass">
                        <span class="material-symbols-rounded summary-success-icon">verified</span>
                        <h2 class="summary-greeting" id="summary-user-greeting">Welcome, Practitioner!</h2>
                        
                        <div class="summary-details">
                            <div class="summary-row">
                                <span class="material-symbols-rounded summary-row-icon">insights</span>
                                <div class="summary-row-text">
                                    <strong>Experience Level:</strong>
                                    <span id="summary-experience-val">Beginner</span>
                                </div>
                            </div>
                            <div class="summary-row">
                                <span class="material-symbols-rounded summary-row-icon">target</span>
                                <div class="summary-row-text">
                                    <strong>Main Intent:</strong>
                                    <span id="summary-goal-val">Reduce Stress</span>
                                </div>
                            </div>
                            <div class="summary-row">
                                <span class="material-symbols-rounded summary-row-icon">schedule</span>
                                <div class="summary-row-text">
                                    <strong>Daily Commitment:</strong>
                                    <span id="summary-commitment-val">10 minutes</span>
                                </div>
                            </div>
                        </div>

                        <p class="summary-footer">
                            Your personalized Mind Illuminated (TMI) training path is ready. Let\u2019s enter your sanctuary.
                        </p>
                    </div>

                    <button id="btn-enter-sanctuary" class="btn btn-primary" style="margin-top: 24px; padding: 16px 40px; font-size: 16px; width: 100%;">
                        Enter Sanctuary
                    </button>
                </div>

            </div>

            <!-- Bottom Navigation for Onboarding -->
            <div class="onboarding-nav" id="onboarding-nav-container" style="display: none;">
                <button class="btn btn-secondary" id="btn-prev" style="visibility: hidden;">
                    <span class="material-symbols-rounded">arrow_back</span> Back
                </button>
                <button class="btn btn-primary" id="btn-next">
                    Next <span class="material-symbols-rounded">arrow_forward</span>
                </button>
            </div>
        </div>
    `;
    const style = document.createElement("style");
    style.textContent = `
        .login-screen {
            background-color: var(--color-bg-primary);
            z-index: 200; /* Above everything */
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 !important;
            overflow-y: auto;
            position: absolute;
            left: 0; top: 0; width: 100%; height: 100%;
        }

        .login-screen.active {
            display: flex;
        }

        .onboarding-container {
            width: 100%;
            max-width: 400px;
            padding: calc(24px + env(safe-area-inset-top, 0px)) 24px calc(24px + env(safe-area-inset-bottom, 0px)) 24px;
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-between;
        }

        /* Progress Bar */
        .onboarding-progress-bar {
            width: 100%;
            height: 6px;
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-full);
            overflow: hidden;
            margin-bottom: 24px;
        }

        .onboarding-progress-fill {
            height: 100%;
            width: 20%;
            background-color: var(--color-accent-dark);
            border-radius: var(--radius-full);
            transition: width var(--transition-normal);
        }

        /* Slides */
        .slides-wrapper {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .onboarding-slide {
            position: absolute;
            width: 100%;
            opacity: 0;
            visibility: hidden;
            transform: translateX(30px);
            transition: opacity var(--transition-normal), transform var(--transition-normal), visibility var(--transition-normal);
            display: none;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .onboarding-slide.active {
            position: relative;
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
            display: flex;
        }

        .onboarding-slide.slide-out-left {
            opacity: 0;
            visibility: hidden;
            transform: translateX(-30px);
        }

        /* Welcome Screen Styling */
        .welcome-halo-container {
            position: relative;
            width: 160px;
            height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 32px;
        }

        .halo-ring {
            position: absolute;
            border-radius: 50%;
            background-color: var(--color-accent-light);
            opacity: 0.15;
        }

        .ring-1 {
            width: 160px; height: 160px;
            animation: pulse-ring 4s infinite ease-in-out;
        }

        .ring-2 {
            width: 120px; height: 120px;
            animation: pulse-ring 4s infinite ease-in-out 1.3s;
        }

        .ring-3 {
            width: 80px; height: 80px;
            animation: pulse-ring 4s infinite ease-in-out 2.6s;
        }

        .halo-core {
            position: absolute;
            width: 60px;
            height: 60px;
            background-color: var(--color-accent-dark);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-bg-primary);
            box-shadow: var(--shadow-md);
            animation: core-hover 3s infinite ease-in-out;
        }

        .halo-icon {
            font-size: 32px;
        }

        @keyframes pulse-ring {
            0% { transform: scale(0.9); opacity: 0.05; }
            50% { transform: scale(1.15); opacity: 0.25; }
            100% { transform: scale(0.9); opacity: 0.05; }
        }

        @keyframes core-hover {
            0% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0); }
        }

        .welcome-title {
            font-size: 36px;
            color: var(--color-text-primary);
            margin-bottom: 8px;
            font-family: var(--font-heading);
            font-weight: 600;
        }

        .welcome-subtitle {
            font-size: 14px;
            color: var(--color-text-secondary);
            margin-bottom: 24px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 500;
        }

        .welcome-text {
            color: var(--color-text-muted);
            font-size: 15px;
            line-height: 1.6;
            margin: 0 16px;
        }

        /* Slide Titles and Helpers */
        .slide-header-icon {
            font-size: 40px;
            color: var(--color-accent-dark);
            margin-bottom: 16px;
        }

        .slide-title {
            font-size: 24px;
            color: var(--color-text-primary);
            margin-bottom: 8px;
            font-family: var(--font-heading);
            font-weight: 600;
        }

        .slide-description {
            font-size: 14px;
            color: var(--color-text-secondary);
            margin-bottom: 24px;
            line-height: 1.5;
        }

        /* Elegant Name Input */
        .input-group {
            position: relative;
            width: 100%;
            margin-top: 32px;
        }

        #user-name-input {
            width: 100%;
            padding: 12px 4px;
            background: transparent;
            border: none;
            border-bottom: 2px solid var(--color-bg-secondary);
            font-size: 20px;
            color: var(--color-text-primary);
            font-family: var(--font-body);
            text-align: center;
            outline: none;
            transition: border-color var(--transition-fast);
        }

        #user-name-input::placeholder {
            color: var(--color-text-muted);
            opacity: 0.5;
        }

        .input-focus-line {
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 0;
            height: 2px;
            background-color: var(--color-accent-dark);
            transition: width var(--transition-normal) ease, left var(--transition-normal) ease;
        }

        #user-name-input:focus ~ .input-focus-line {
            width: 100%;
            left: 0;
        }

        .validation-error {
            color: #d32f2f;
            font-size: 12px;
            margin-top: 12px;
            opacity: 0;
            transition: opacity var(--transition-fast);
        }

        .validation-error.visible {
            opacity: 1;
        }

        /* Option Grid Cards */
        .options-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
        }

        .option-card {
            background-color: var(--color-bg-card);
            border: 2px solid transparent;
            border-radius: var(--radius-md);
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 16px;
            text-align: left;
            cursor: pointer;
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-fast);
        }

        .option-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        .option-card.active {
            border-color: var(--color-accent-dark);
            background-color: rgba(134, 155, 143, 0.08);
        }

        .option-card:active {
            transform: scale(0.98);
        }

        .option-icon-wrapper {
            width: 44px;
            height: 44px;
            border-radius: var(--radius-sm);
            background-color: var(--color-bg-secondary);
            color: var(--color-text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all var(--transition-fast);
        }

        .option-card.active .option-icon-wrapper {
            background-color: var(--color-accent-dark);
            color: var(--color-bg-primary);
        }

        .option-icon-wrapper .material-symbols-rounded {
            font-size: 24px;
        }

        .option-content {
            flex: 1;
        }

        .option-label {
            font-size: 15px;
            font-weight: 600;
            margin: 0 0 2px 0;
            color: var(--color-text-primary);
        }

        .option-desc {
            font-size: 12px;
            color: var(--color-text-secondary);
            margin: 0;
            line-height: 1.4;
        }

        .badge-recommended {
            position: absolute;
            top: -24px;
            right: 0px;
            background-color: var(--color-accent-dark);
            color: var(--color-bg-primary);
            font-size: 9px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            letter-spacing: 0.5px;
        }

        /* Onboarding Nav */
        .onboarding-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid var(--color-bg-secondary);
        }

        .btn-secondary {
            background-color: transparent;
            color: var(--color-text-secondary);
            border: 1px solid var(--color-bg-secondary);
        }

        .btn-secondary:active {
            background-color: var(--color-bg-secondary);
        }

        /* Summary Card */
        .summary-card {
            width: 100%;
            padding: 24px;
            border-radius: var(--radius-lg);
            border: 1px solid rgba(255, 255, 255, 0.4);
            text-align: center;
            box-shadow: var(--shadow-md);
        }

        .summary-success-icon {
            font-size: 48px;
            color: var(--color-accent-dark);
            margin-bottom: 12px;
        }

        .summary-greeting {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 20px;
            font-family: var(--font-heading);
        }

        .summary-details {
            display: flex;
            flex-direction: column;
            gap: 16px;
            text-align: left;
            margin-bottom: 24px;
        }

        .summary-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .summary-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .summary-row-icon {
            font-size: 20px;
            color: var(--color-accent-dark);
        }

        .summary-row-text {
            font-size: 14px;
            display: flex;
            flex-direction: column;
            color: var(--color-text-primary);
        }

        .summary-row-text strong {
            font-size: 11px;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }

        .summary-footer {
            font-size: 13px;
            color: var(--color-text-secondary);
            line-height: 1.5;
            margin: 0;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            padding-top: 16px;
        }
    `;
    container.appendChild(style);
    setTimeout(() => {
      const slides = container.querySelectorAll(".onboarding-slide");
      const progressBarContainer = container.querySelector("#progress-bar-container");
      const progressFill = container.querySelector("#progress-fill");
      const onboardingNavContainer = container.querySelector("#onboarding-nav-container");
      const btnPrev = container.querySelector("#btn-prev");
      const btnNext = container.querySelector("#btn-next");
      const userNameInput = container.querySelector("#user-name-input");
      const nameValError = container.querySelector("#name-validation-error");
      const btnWelcome = container.querySelector(".btn-next-welcome");
      const btnEnterSanctuary = container.querySelector("#btn-enter-sanctuary");
      const optionCards = container.querySelectorAll(".option-card");
      optionCards.forEach((card) => {
        card.addEventListener("click", () => {
          const field = card.dataset.field;
          const value = card.dataset.value;
          container.querySelectorAll(`.option-card[data-field="${field}"]`).forEach((sibling) => {
            sibling.classList.remove("active");
          });
          card.classList.add("active");
          onboardingData[field] = field === "commitment" ? parseInt(value) : value;
        });
      });
      btnWelcome.addEventListener("click", () => {
        goToStep(1);
      });
      btnPrev.addEventListener("click", () => {
        if (currentStep > 1) {
          goToStep(currentStep - 1);
        }
      });
      btnNext.addEventListener("click", () => {
        if (currentStep === 1) {
          const name = userNameInput.value.trim();
          if (!name) {
            nameValError.classList.add("visible");
            userNameInput.focus();
            return;
          } else {
            nameValError.classList.remove("visible");
            onboardingData.name = name;
          }
        }
        goToStep(currentStep + 1);
      });
      btnEnterSanctuary.addEventListener("click", async () => {
        await DB.login({
          name: onboardingData.name,
          email: "practitioner@siddha.med",
          experience: onboardingData.experience,
          goal: onboardingData.goal,
          dailyCommitment: onboardingData.commitment
        });
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      });
      userNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          btnNext.click();
        }
      });
      function goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= totalSteps) return;
        const activeSlide = container.querySelector(".onboarding-slide.active");
        if (activeSlide) {
          activeSlide.classList.add("slide-out-left");
          setTimeout(() => {
            activeSlide.classList.remove("active", "slide-out-left");
          }, 300);
        }
        currentStep = stepIndex;
        setTimeout(() => {
          slides.forEach((slide) => {
            const stepNum = parseInt(slide.dataset.step);
            if (stepNum === currentStep) {
              slide.classList.add("active");
            } else {
              slide.classList.remove("active", "slide-out-left");
            }
          });
          updateNavUI();
        }, activeSlide ? 150 : 0);
      }
      function updateNavUI() {
        if (currentStep === 0) {
          progressBarContainer.style.display = "none";
          onboardingNavContainer.style.display = "none";
        } else {
          progressBarContainer.style.display = "block";
          const percentage = currentStep / (totalSteps - 1) * 100;
          progressFill.style.width = `${percentage}%`;
          if (currentStep === totalSteps - 1) {
            onboardingNavContainer.style.display = "none";
            populateSummary();
          } else {
            onboardingNavContainer.style.display = "flex";
            btnPrev.style.visibility = currentStep === 1 ? "hidden" : "visible";
          }
        }
        if (currentStep === 1) {
          setTimeout(() => userNameInput.focus(), 200);
        }
      }
      function populateSummary() {
        const displayGreeting = container.querySelector("#summary-user-greeting");
        const displayExp = container.querySelector("#summary-experience-val");
        const displayGoal = container.querySelector("#summary-goal-val");
        const displayCommitment = container.querySelector("#summary-commitment-val");
        const firstName = onboardingData.name.split(" ")[0];
        displayGreeting.textContent = `Welcome, ${firstName}!`;
        const experiences = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
        displayExp.textContent = experiences[onboardingData.experience] || "Beginner";
        const goals = {
          stress: "Reduce Stress & Anxiety",
          focus: "Deepen Concentration",
          habit: "Build a Daily Habit"
        };
        displayGoal.textContent = goals[onboardingData.goal] || "Tailored Path";
        displayCommitment.textContent = `${onboardingData.commitment} minutes`;
      }
    }, 0);
    return container;
  }

  // src/screens/profile.js
  init_db();
  function renderProfile(onOpenSettings) {
    const container = document.createElement("div");
    container.className = "screen scrollable profile-screen";
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; margin: 0;">Profile</h1>
            <div style="display: flex; gap: 8px;">
                <button class="icon-btn" style="color: var(--color-text-primary);" id="open-settings-screen-btn" title="Settings" aria-label="Open Settings">
                    <span class="material-symbols-rounded">settings</span>
                </button>
                <button class="icon-btn" style="color: var(--color-text-primary);" id="logout-btn" title="Logout" aria-label="Logout">
                    <span class="material-symbols-rounded">logout</span>
                </button>
            </div>
        </div>

        <div style="text-align: center; margin-bottom: 32px;">
            <div id="profile-avatar-btn" style="position: relative; width: 100px; height: 100px; margin: 0 auto 16px; cursor: pointer;" title="Change Profile Picture">
                <img id="profile-avatar-img" src="./src/assets/avatar_monk.jpg" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid var(--color-accent); box-shadow: 0 4px 14px rgba(0,0,0,0.1); transition: transform 0.2s;" alt="Profile Avatar">
                <div style="position: absolute; bottom: 0; right: 0; background: var(--color-accent-dark); color: #fff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
                    <span class="material-symbols-rounded" style="font-size: 16px;">photo_camera</span>
                </div>
            </div>
            <h2 id="profile-name" style="font-size: 20px; margin-bottom: 4px;">User Name</h2>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 32px;">
            <div class="card" style="flex: 1; text-align: center;">
                <p class="text-sm" style="margin-bottom: 8px;">Level</p>
                <h2 id="profile-level" style="font-size: 24px; color: var(--color-text-primary);">1</h2>
            </div>
            <div class="card" style="flex: 1; text-align: center;">
                <p class="text-sm" style="margin-bottom: 8px;">Total XP</p>
                <h2 id="profile-xp" style="font-size: 24px; color: var(--color-accent-dark);">0</h2>
            </div>
        </div>

        <!-- Tabbed Analytics Card -->
        <div class="rfl-week-card card" id="rfl-analytics-card" style="margin-bottom: 32px;">
            <div class="rfl-week-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <h3 class="rfl-section-title" id="rfl-card-title" style="margin:0;">Analytics</h3>
                    <button id="open-analytics-modal-btn" style="background:var(--color-bg-secondary); border:none; cursor:pointer; color:var(--color-accent-dark); display:flex; align-items:center; gap:3px; font-size:10.5px; font-weight:700; padding:3px 8px; border-radius:10px;" title="Expand Full Analytics Modal">
                        <span>Expand</span>
                        <span class="material-symbols-rounded" style="font-size:14px;">open_in_full</span>
                    </button>
                </div>
                <!-- Tab pills -->
                <div class="rfl-tab-pills" style="display:flex; background:var(--color-bg-secondary); padding:2px; border-radius:12px;">
                    <button class="rfl-tab-btn active" data-tab="week" style="padding:4px 10px; border:none; background:var(--color-bg-card); border-radius:10px; font-size:11px; font-weight:600; cursor:pointer; color:var(--color-text-primary); transition:all 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.05);">Week</button>
                    <button class="rfl-tab-btn" data-tab="heatmap" style="padding:4px 10px; border:none; background:transparent; border-radius:10px; font-size:11px; font-weight:600; cursor:pointer; color:var(--color-text-muted); transition:all 0.2s;">Heatmap</button>
                    <button class="rfl-tab-btn" data-tab="growth" style="padding:4px 10px; border:none; background:transparent; border-radius:10px; font-size:11px; font-weight:600; cursor:pointer; color:var(--color-text-muted); transition:all 0.2s;">Growth</button>
                </div>
            </div>

            <!-- Tab View 1: 7-Day Bar Chart -->
            <div class="rfl-tab-view" id="rfl-view-week">
                <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
                    <div class="rfl-week-stats">
                        <div class="rfl-stat">
                            <span id="rfl-total-mins" class="rfl-stat-val">0</span>
                            <span class="rfl-stat-label">min</span>
                        </div>
                        <div class="rfl-stat-divider"></div>
                        <div class="rfl-stat">
                            <span id="rfl-total-sessions" class="rfl-stat-val">0</span>
                            <span class="rfl-stat-label">sits</span>
                        </div>
                        <div class="rfl-stat-divider"></div>
                        <div class="rfl-stat">
                            <span id="rfl-streak" class="rfl-stat-val">0</span>
                            <span class="rfl-stat-label">streak</span>
                        </div>
                    </div>
                </div>
                <div class="rfl-chart" id="rfl-chart">
                    <!-- 7 bars injected by JS -->
                </div>
            </div>

            <!-- Tab View 2: 365-Day Consistency Heatmap -->
            <div class="rfl-tab-view hidden" id="rfl-view-heatmap">
                <div id="rfl-heatmap-container" style="overflow-x:auto; padding-bottom:6px; -webkit-overflow-scrolling:touch; scrollbar-width:thin; width:100%;">
                    <!-- Rendered by JS -->
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:10px; color:var(--color-text-muted);">
                    <span id="rfl-heatmap-popover" style="font-weight:600; color:var(--color-text-secondary);">Tap any tile to view sit details</span>
                    <div style="display:flex; align-items:center; gap:3px;">
                        <span>Less</span>
                        <span style="width:8px; height:8px; border-radius:2px; background:var(--color-bg-secondary); display:inline-block;"></span>
                        <span style="width:8px; height:8px; border-radius:2px; background:rgba(74, 144, 98, 0.35); display:inline-block;"></span>
                        <span style="width:8px; height:8px; border-radius:2px; background:rgba(74, 144, 98, 0.7); display:inline-block;"></span>
                        <span style="width:8px; height:8px; border-radius:2px; background:var(--color-accent); display:inline-block;"></span>
                        <span>More</span>
                    </div>
                </div>
            </div>

            <!-- Tab View 3: Growth Wave Area Chart -->
            <div class="rfl-tab-view hidden" id="rfl-view-growth">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span id="rfl-growth-summary" style="font-size:11px; font-weight:600; color:var(--color-text-secondary);">Practice Trend</span>
                    <div class="rfl-growth-toggle" style="display:flex; background:var(--color-bg-secondary); padding:2px; border-radius:8px;">
                        <button class="rfl-growth-btn active" data-period="week" style="padding:2px 8px; border:none; background:var(--color-bg-card); border-radius:6px; font-size:9px; font-weight:700; cursor:pointer; color:var(--color-text-primary); box-shadow:0 1px 2px rgba(0,0,0,0.05);">Week</button>
                        <button class="rfl-growth-btn" data-period="month" style="padding:2px 8px; border:none; background:transparent; border-radius:6px; font-size:9px; font-weight:700; cursor:pointer; color:var(--color-text-muted);">Month</button>
                    </div>
                </div>
                <div id="rfl-growth-chart" style="height:95px; width:100%;">
                    <!-- Rendered by JS -->
                </div>
            </div>
        </div>

        <!-- Milestones Grid -->
        <div class="card collapsible-card collapsed" id="milestones-card" style="margin-bottom: 32px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading); display:flex; align-items:center; gap:8px;">
                    <span class="material-symbols-rounded" style="color: var(--color-accent); font-size:20px;">workspace_premium</span>
                    Milestones & Badges
                </h3>
                <span class="material-symbols-rounded collapsible-toggle" style="color: var(--color-text-muted);">expand_more</span>
            </div>
            <div class="ach-grid collapsible-content" id="achievements-grid" style="margin-top: 12px;">
                <!-- Achievements injected by JS -->
            </div>
        </div>

        <!-- Lifetime Statistics Collapsible Card -->
        <div class="card collapsible-card collapsed" id="lifetime-stats-card" style="margin-bottom: 32px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading); display:flex; align-items:center; gap:8px;">
                    <span class="material-symbols-rounded" style="color: var(--color-accent); font-size:20px;">analytics</span>
                    Lifetime Practice Stats
                </h3>
                <span class="material-symbols-rounded collapsible-toggle" style="color: var(--color-text-muted);">expand_more</span>
            </div>
            
            <div class="collapsible-content" style="margin-top: 14px;">
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Total Sessions</span>
                    <span id="stat-sessions" style="font-weight: 600;">0</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Mindful Minutes</span>
                    <span id="stat-minutes" style="font-weight: 600;">0m</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Current Streak</span>
                    <span id="stat-streak" style="font-weight: 600;">0 days</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-bg-secondary);">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Longest Streak</span>
                    <span id="stat-longest-streak" style="font-weight: 600;">0 days</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                    <span class="text-sm" style="color: var(--color-text-secondary);">Avg. Sit Duration</span>
                    <span id="stat-avg-duration" style="font-weight: 600;">0m</span>
                </div>
            </div>
        </div>

        <!-- Sit Reminders Card (Collapsible) -->
        <div class="card collapsible-card collapsed" id="sit-reminders-card" style="margin-bottom: 32px;">
            <div class="collapsible-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <h3 style="font-size: 16px; margin: 0; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 20px;">schedule</span>
                    Sit Reminders
                </h3>
                <span class="material-symbols-rounded collapsible-toggle" style="color: var(--color-text-muted);">expand_more</span>
            </div>
            
            <div class="collapsible-content" style="margin-top: 14px;">
                <!-- Sit Reminders -->
                <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">\u{1F4C5} Daily Prompts</span>
                        <button id="add-reminder-btn" class="btn" style="padding: 5px 12px; font-size: 11px; background: var(--color-bg-secondary); color: var(--color-text-primary); border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <span class="material-symbols-rounded" style="font-size: 15px; color: var(--color-accent);">add</span> Add Time
                        </button>
                    </div>
                    <div id="reminders-list-container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>

                <!-- Session End Notification Toggle -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-bg-secondary); padding-top: 14px;">
                    <div>
                        <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">\u{1F514} Session End Notification</span>
                        <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Chime & alert when timer completes</p>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox" id="toggle-session-notification" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <!-- Support Siddha Card (Dedicated Card - Placed Above Community) -->
        <div class="card" style="margin-bottom: 24px; padding: 20px; text-align: center;">
            <span class="material-symbols-rounded" style="color: #e2b857; font-size: 32px; margin-bottom: 6px;">favorite</span>
            <h3 style="font-size: 16px; margin: 0 0 6px; font-family: var(--font-heading); color: var(--color-text-primary);">Support Siddha</h3>
            <p class="text-sm" style="color: var(--color-text-muted); font-size: 11.5px; margin-bottom: 14px; line-height: 1.4;">
                Siddha is free and built with love. If it helps you stay mindful, consider supporting our journey.
            </p>
            <button id="profile-donate-btn" class="btn" style="width: 100%; background: var(--color-accent); color: #fff; border: none; font-size: 13px; font-weight: 700; padding: 12px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 3px 10px rgba(0,0,0,0.12);">
                <span class="material-symbols-rounded" style="font-size: 18px;">coffee</span>
                Support the App \u2615
            </button>
        </div>

        <!-- Share & Community Card -->
        <div class="card" style="margin-bottom: 24px; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 24px;">share</span>
                <div>
                    <h3 style="font-size: 15px; margin: 0; font-family: var(--font-heading); color: var(--color-text-primary);">Share & Community</h3>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Connect with our mindfulness journey</p>
                </div>
            </div>

            <!-- Share Button -->
            <button id="profile-share-btn" class="btn" style="width: 100%; padding: 12px; font-size: 13px; background: var(--color-accent); color: #ffffff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.12); margin-bottom: 12px;">
                <span class="material-symbols-rounded" style="font-size: 18px;">share</span>
                Share Siddha App \u{1F9D8}
            </button>

            <!-- Social Links Row -->
            <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                <!-- Instagram Link -->
                <a id="profile-instagram-link" href="https://instagram.com/siddhamind" target="_blank" rel="noopener noreferrer" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 11.5px; font-weight: 700; box-shadow: 0 2px 8px rgba(131, 58, 180, 0.2);">
                    <span class="material-symbols-rounded" style="font-size: 15px;">photo_camera</span>
                    @siddhamind
                </a>

                <!-- Website Link -->
                <a id="profile-website-link" href="https://siddha.app" target="_blank" rel="noopener noreferrer" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; background: var(--color-bg-secondary); color: var(--color-text-primary); text-decoration: none; border-radius: 10px; font-size: 11.5px; font-weight: 700; border: 1px solid rgba(0,0,0,0.08);">
                    <span class="material-symbols-rounded" style="font-size: 15px; color: var(--color-accent);">language</span>
                    siddha.app
                </a>
            </div>

            <!-- Email Feedback & Bug Report Direct Pill -->
            <a id="profile-email-btn" href="mailto:siddhameditation@gmail.com?subject=Siddha%20App%20Feedback%20%26%20Bug%20Report&body=Hi%20Siddha%20Team%2C%0A%0AHere%20is%20my%20feedback%20or%20bug%20report%3A%0A%0A" style="width: 100%; padding: 11px 12px; font-size: 12px; background: var(--color-bg-secondary); color: var(--color-text-primary); border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box;">
                <span class="material-symbols-rounded" style="font-size: 17px; color: var(--color-accent);">rate_review</span>
                Give Feedback or Report a Bug \u{1F4AC}
            </a>
        </div>

        <!-- Developer Controls (Hidden by default, unlocked by 5 taps on App Version below) -->
        <div id="dev-controls-wrapper" class="dev-only" style="margin-top: 24px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
            <div style="display: flex; gap: 8px;">
                <button id="dev-skip-3-btn" class="btn" style="background: transparent; color: #f39c12; border: 1px solid #f39c12; font-size: 12px; padding: 6px 12px;">
                    Skip 3 Days (No Med)
                </button>
                <button id="dev-skip-7-btn" class="btn" style="background: transparent; color: #e74c3c; border: 1px solid #e74c3c; font-size: 12px; padding: 6px 12px;">
                    Skip 7 Days
                </button>
            </div>
            <button id="dev-reset-btn" class="btn" style="background: transparent; color: #ff6b6b; border: 1px solid #ff6b6b; font-size: 12px; padding: 6px 12px; margin-bottom: 4px;">
                Reset Progress (Dev)
            </button>
            <button id="dev-view-feedback-btn" class="btn" style="background: transparent; color: var(--color-accent); border: 1px solid var(--color-accent); font-size: 12px; padding: 6px 12px;">
                View Saved Feedback (Dev)
            </button>
        </div>

        <!-- App Version Secret Trigger (Tap 5 times to toggle Developer Mode) -->
        <p id="app-version-trigger" style="font-size: 11px; color: var(--color-text-muted); text-align: center; margin-top: 20px; margin-bottom: 24px; cursor: pointer; user-select: none;">Siddha v1.6.8</p>

        <!-- Avatar Selection Modal Overlay -->
        <div id="avatar-modal" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(6px); z-index:999; display:none; justify-content:center; align-items:center; padding:20px;">
            <div style="background:var(--color-bg-card); border-radius:24px; padding:24px; max-width:340px; width:100%; text-align:center; box-shadow:0 12px 32px rgba(0,0,0,0.15); animation:fadeIn 0.2s ease;">
                <h3 style="font-size:18px; margin:0 0 6px; font-family:var(--font-heading); color:var(--color-text-primary);">Choose Profile Avatar</h3>
                <p class="text-sm" style="color:var(--color-text-secondary); margin-bottom:18px;">Select a Zen watercolor avatar</p>
                
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:20px;">
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_monk.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_monk.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Monk">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Monk</span>
                    </div>
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_lotus.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_lotus.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Lotus">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Lotus</span>
                    </div>
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_mascot.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_mascot.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Siddha">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Siddha</span>
                    </div>
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_sun_moon.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_sun_moon.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Sun & Moon">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Sun & Moon</span>
                    </div>
                    <div class="avatar-opt-btn" data-avatar="./src/assets/avatar_mountain.jpg" style="cursor:pointer; text-align:center;">
                        <img src="./src/assets/avatar_mountain.jpg" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:3px solid transparent; transition:all 0.2s;" alt="Mountain">
                        <span class="text-sm" style="display:block; margin-top:4px; font-size:11px; font-weight:600; color:var(--color-text-primary);">Mountain</span>
                    </div>
                </div>

                <button id="close-avatar-modal" class="btn" style="width:100%; background:var(--color-bg-secondary); color:var(--color-text-primary); border:none; padding:10px; border-radius:12px; font-weight:600; cursor:pointer;">Close</button>
            </div>
        </div>

        <!-- Full Analytics Pop-Up Modal Overlay -->
        <div id="analytics-modal-overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); z-index:9999; justify-content:center; align-items:center; padding:16px;">
            <div style="background:var(--color-bg-card, #ffffff); width:100%; max-width:440px; max-height:85vh; overflow-y:auto; border-radius:24px; padding:20px; box-shadow:0 16px 40px rgba(0,0,0,0.3); position:relative;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--color-bg-secondary); padding-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="material-symbols-rounded" style="color:var(--color-accent); font-size:22px;">analytics</span>
                        <h3 style="margin:0; font-size:16px; font-family:var(--font-heading); color:var(--color-text-primary);">Full Practice Analytics</h3>
                    </div>
                    <button id="close-analytics-modal-btn" style="background:var(--color-bg-secondary); border:none; color:var(--color-text-secondary); width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                        <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                    </button>
                </div>

                <!-- Modal Subtitle -->
                <p style="font-size:11px; color:var(--color-text-secondary); margin:0 0 14px 0; line-height:1.4;">
                    Detailed breakdown of your meditation consistency, weekly progress, and long-term practice growth trends.
                </p>

                <!-- Expanded Analytics Content -->
                <div id="modal-analytics-content" style="display:flex; flex-direction:column; gap:16px;">
                    <!-- 1. Expanded Heatmap Section (52 Weeks - Sideways Scrollable) -->
                    <div style="background:var(--color-bg-secondary); padding:14px; border-radius:16px;">
                        <h4 style="margin:0 0 8px 0; font-size:13px; font-weight:700; color:var(--color-text-primary);">\u{1F4C5} Practice Consistency Heatmap</h4>
                        
                        <div id="modal-heatmap-container" style="overflow-x:auto; padding-bottom:6px; -webkit-overflow-scrolling:touch; scrollbar-width:thin; width:100%;"></div>
                        <p id="modal-heatmap-popover" style="font-size:10.5px; font-weight:700; color:var(--color-accent); margin:8px 0 0 0; text-align:center;">Tap any tile to view sit details</p>
                    </div>

                    <!-- 2. Practice Trend Summary -->
                    <div style="background:var(--color-bg-secondary); padding:14px; border-radius:16px;">
                        <h4 style="margin:0 0 4px 0; font-size:13px; font-weight:700; color:var(--color-text-primary);">\u{1F4C8} Practice Growth Wave</h4>
                        <div id="modal-growth-chart" style="height:100px; width:100%; margin-top:8px;"></div>
                    </div>
                </div>
            </div>
        </div>

        <div style="height: 48px; flex-shrink: 0;"></div>
    `;
    const style = document.createElement("style");
    style.textContent = `
        .rfl-tab-view.hidden { display: none !important; }
        .rfl-week-card { padding: 14px 16px; }
        .rfl-week-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .rfl-section-title { font-size: 14px; font-weight: 600; margin: 0; color: var(--color-text-primary); }
        .rfl-week-stats { display: flex; align-items: center; gap: 10px; }
        .rfl-stat { display: flex; align-items: baseline; gap: 2px; }
        .rfl-stat-val { font-size: 16px; font-weight: 700; color: var(--color-text-primary); }
        .rfl-stat-label { font-size: 10px; color: var(--color-text-muted); }
        .rfl-stat-divider { width: 1px; height: 14px; background: var(--color-bg-secondary); }

        .rfl-chart {
            display: flex; justify-content: space-between; align-items: flex-end;
            height: 68px; gap: 4px;
        }
        .rfl-bar-col {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; gap: 4px; height: 100%;
        }
        .rfl-bar-wrap {
            flex: 1; width: 100%; display: flex; align-items: flex-end;
            background: var(--color-bg-secondary); border-radius: 4px;
            overflow: hidden; min-height: 4px;
        }
        .rfl-bar {
            width: 100%; background: var(--color-accent);
            border-radius: 4px; transition: height 0.5s ease;
            min-height: 0;
        }
        .rfl-bar-day { font-size: 9px; color: var(--color-text-muted); font-weight: 600; }

        /* Toggle Switches for Audio Controls */
        .switch-toggle {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .switch-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            inset: 0;
            background-color: #d0d7d2;
            transition: .3s;
            border-radius: 24px;
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .switch-toggle input:checked + .toggle-slider {
            background-color: var(--color-accent);
        }
        .switch-toggle input:checked + .toggle-slider:before {
            transform: translateX(20px);
        }

        .ach-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
        }
        .ach-item {
            background: var(--color-bg-card);
            border-radius: 12px;
            padding: 10px 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid var(--color-bg-secondary);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .ach-emoji {
            font-size: 24px;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: var(--color-bg-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .ach-item.unlocked .ach-emoji {
            background: var(--color-accent-light);
        }
        .ach-details {
            flex: 1;
            min-width: 0;
        }
        .ach-title {
            font-size: 12px;
            font-weight: 700;
            color: var(--color-text-primary);
            margin: 0 0 2px;
            font-family: var(--font-heading);
        }
        .ach-desc {
            font-size: 9.5px;
            color: var(--color-text-secondary);
            margin: 0 0 6px;
            line-height: 1.35;
        }
        .ach-progress-text {
            font-size: 8.5px;
            font-weight: 700;
            color: var(--color-text-muted);
            text-align: right;
        }
        .ach-reward-tag {
            font-size: 8.5px;
            font-weight: 700;
            color: var(--color-accent-dark);
            background: var(--color-accent-light);
            padding: 1px 5px;
            border-radius: 6px;
            display: inline-block;
        }
        .ach-item.unlocked .ach-reward-tag {
            background: #e2ede4;
            color: #277038;
        }

        /* Collapsible Cards */
        .collapsible-card .collapsible-content {
            transition: max-height 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease, margin-top 0.25s ease;
            overflow: hidden;
            max-height: 3000px;
            opacity: 1;
        }
        .collapsible-card.collapsed .collapsible-content {
            max-height: 0 !important;
            opacity: 0 !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            pointer-events: none;
        }
        .collapsible-card .collapsible-toggle {
            transition: transform 0.3s ease;
            transform: rotate(0deg);
        }
        .collapsible-card.collapsed .collapsible-toggle {
            transform: rotate(-90deg);
        }
    `;
    container.appendChild(style);
    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayIdx = ((/* @__PURE__ */ new Date()).getDay() + 6) % 7;
    let activeAnalyticsTab = "week";
    let activeGrowthPeriod = "week";
    const renderWeekBarChart = (stats) => {
      const chart = container.querySelector("#rfl-chart");
      if (!chart) return;
      chart.innerHTML = "";
      const weekData = stats.weekData || [0, 0, 0, 0, 0, 0, 0];
      const maxVal = Math.max(...weekData, 1);
      weekData.forEach((mins, i) => {
        const pct = mins / maxVal * 100;
        const col = document.createElement("div");
        col.className = "rfl-bar-col";
        col.innerHTML = `
                <div class="rfl-bar-wrap">
                    <div class="rfl-bar ${i === todayIdx ? "today" : ""}"
                         style="height: ${pct}%; min-height: ${mins > 0 ? 4 : 0}px;"
                         title="${mins} min">
                    </div>
                </div>
                <span class="rfl-bar-day">${DAYS[i]}</span>
            `;
        chart.appendChild(col);
      });
    };
    const renderHeatmapGrid = (targetContainer = null, targetPopover = null) => {
      const heatmapContainer = targetContainer || container.querySelector("#rfl-heatmap-container");
      if (!heatmapContainer) return;
      heatmapContainer.innerHTML = "";
      const history = (DB.getMeditationHistory ? DB.getMeditationHistory() : DB.getState ? DB.getState().meditationHistory : []) || [];
      const minsByDate = {};
      history.forEach((item) => {
        if (item.date) {
          const dStr = item.date.split("T")[0];
          const duration = typeof item.duration === "number" ? item.duration : parseInt(item.duration) || 0;
          minsByDate[dStr] = (minsByDate[dStr] || 0) + duration;
        }
      });
      const today = /* @__PURE__ */ new Date();
      const daysToRender = 364;
      const startDate = /* @__PURE__ */ new Date();
      startDate.setDate(today.getDate() - (daysToRender - 1));
      startDate.setDate(startDate.getDate() - startDate.getDay());
      const mainWrap = document.createElement("div");
      mainWrap.style.cssText = "display:flex; gap:6px; align-items:flex-start; min-width:max-content;";
      const dayLabelsCol = document.createElement("div");
      dayLabelsCol.style.cssText = "display:flex; flex-direction:column; gap:3px; font-size:8px; font-weight:700; color:var(--color-text-muted); margin-top:18px; text-align:right; flex-shrink:0; width:14px;";
      const dayLetters = ["S", "M", "T", "W", "T", "F", "S"];
      dayLetters.forEach((letter) => {
        const lbl = document.createElement("div");
        lbl.style.cssText = "height:11px; line-height:11px;";
        lbl.textContent = letter;
        dayLabelsCol.appendChild(lbl);
      });
      mainWrap.appendChild(dayLabelsCol);
      const gridWrap = document.createElement("div");
      gridWrap.style.cssText = "display:flex; flex-direction:column; gap:4px; min-width:max-content;";
      const monthRow = document.createElement("div");
      monthRow.style.cssText = "display:grid; grid-template-columns:repeat(52, 11px); gap:3px; height:14px; position:relative; width:max-content;";
      const colsWrap = document.createElement("div");
      colsWrap.style.cssText = "display:grid; grid-template-columns:repeat(52, 11px); gap:3px; width:max-content;";
      let lastMonth = -1;
      for (let colIdx = 0; colIdx < 52; colIdx++) {
        const colSunDate = new Date(startDate);
        colSunDate.setDate(startDate.getDate() + colIdx * 7);
        const m = colSunDate.getMonth();
        if (m !== lastMonth) {
          const mSpan = document.createElement("span");
          mSpan.style.cssText = `grid-column-start: ${colIdx + 1}; font-size:9.5px; font-weight:700; color:var(--color-text-secondary); white-space:nowrap; pointer-events:none;`;
          mSpan.textContent = colSunDate.toLocaleDateString("en-US", { month: "short" });
          monthRow.appendChild(mSpan);
          lastMonth = m;
        }
      }
      let currentColumn = null;
      for (let i = 0; i < daysToRender; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const isoStr = d.toISOString().split("T")[0];
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 0 || !currentColumn) {
          currentColumn = document.createElement("div");
          currentColumn.style.cssText = "display:flex; flex-direction:column; gap:3px;";
          colsWrap.appendChild(currentColumn);
        }
        const mins = minsByDate[isoStr] || 0;
        let bg = "rgba(0, 0, 0, 0.07)";
        if (mins > 0 && mins <= 15) bg = "rgba(74, 144, 98, 0.45)";
        else if (mins > 15 && mins <= 30) bg = "rgba(74, 144, 98, 0.8)";
        else if (mins > 30) bg = "#2e7d32";
        const tile = document.createElement("div");
        tile.style.cssText = `width:11px; height:11px; border-radius:2.5px; background:${bg}; border:1px solid rgba(0,0,0,0.04); cursor:pointer; transition:transform 0.1s; flex-shrink:0;`;
        tile.title = `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${mins} min`;
        tile.addEventListener("click", () => {
          const popover = targetPopover || container.querySelector("#rfl-heatmap-popover");
          if (popover) {
            const formattedDate = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            popover.textContent = `\u{1F4C5} ${formattedDate}: ${mins > 0 ? `${mins} minutes sit` : "No sit recorded"}`;
            popover.style.color = mins > 0 ? "var(--color-accent)" : "var(--color-text-muted)";
          }
        });
        currentColumn.appendChild(tile);
      }
      gridWrap.appendChild(monthRow);
      gridWrap.appendChild(colsWrap);
      mainWrap.appendChild(gridWrap);
      heatmapContainer.appendChild(mainWrap);
      setTimeout(() => {
        heatmapContainer.scrollLeft = heatmapContainer.scrollWidth;
      }, 50);
    };
    const renderGrowthWaveChart = (period, targetEl = null) => {
      const growthChartEl = targetEl || container.querySelector("#rfl-growth-chart");
      const summaryEl = container.querySelector("#rfl-growth-summary");
      if (!growthChartEl) return;
      growthChartEl.innerHTML = "";
      const history = (DB.getMeditationHistory ? DB.getMeditationHistory() : DB.getState ? DB.getState().meditationHistory : []) || [];
      const buckets = [];
      const labels = [];
      const today = /* @__PURE__ */ new Date();
      if (period === "week") {
        for (let i = 7; i >= 0; i--) {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - (i * 7 + 6));
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() - i * 7);
          let totalMins = 0;
          history.forEach((item) => {
            if (item.date) {
              const itemDate = new Date(item.date);
              if (itemDate >= weekStart && itemDate <= weekEnd) {
                totalMins += typeof item.duration === "number" ? item.duration : parseInt(item.duration) || 0;
              }
            }
          });
          buckets.push(totalMins);
          labels.push(i === 0 ? "This Wk" : `Wk -${i}`);
        }
      } else {
        for (let i = 5; i >= 0; i--) {
          const mDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthName = mDate.toLocaleDateString("en-US", { month: "short" });
          const mYear = mDate.getFullYear();
          const mMonth = mDate.getMonth();
          let totalMins = 0;
          history.forEach((item) => {
            if (item.date) {
              const itemDate = new Date(item.date);
              if (itemDate.getFullYear() === mYear && itemDate.getMonth() === mMonth) {
                totalMins += typeof item.duration === "number" ? item.duration : parseInt(item.duration) || 0;
              }
            }
          });
          buckets.push(totalMins);
          labels.push(monthName);
        }
      }
      const maxMins = Math.max(...buckets, 10);
      const totalPeriodMins = buckets.reduce((a, b) => a + b, 0);
      const prevTotal = buckets.slice(0, Math.floor(buckets.length / 2)).reduce((a, b) => a + b, 0);
      const recentTotal = buckets.slice(Math.floor(buckets.length / 2)).reduce((a, b) => a + b, 0);
      const pctDiff = prevTotal > 0 ? Math.round((recentTotal - prevTotal) / prevTotal * 100) : 0;
      if (summaryEl) {
        summaryEl.textContent = `Total: ${totalPeriodMins}m ${pctDiff !== 0 ? `(${pctDiff > 0 ? "+" : ""}${pctDiff}%)` : ""}`;
      }
      const svgW = 280;
      const svgH = 65;
      const points = buckets.map((val, idx) => {
        const x = idx / (buckets.length - 1) * svgW;
        const y = svgH - val / maxMins * (svgH - 15);
        return { x, y, val };
      });
      let pathD = `M ${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX = (p0.x + p1.x) / 2;
        pathD += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
      }
      const areaD = `${pathD} L ${svgW},${svgH} L 0,${svgH} Z`;
      let dotsSVG = "";
      points.forEach((p) => {
        dotsSVG += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="var(--color-accent)" />`;
      });
      let labelsHTML = '<div style="display:flex; justify-content:space-between; margin-top:4px;">';
      labels.forEach((lbl) => {
        labelsHTML += `<span style="font-size:8.5px; color:var(--color-text-muted); text-align:center; flex:1;">${lbl}</span>`;
      });
      labelsHTML += "</div>";
      growthChartEl.innerHTML = `
            <svg viewBox="0 0 ${svgW} ${svgH}" style="width:100%; height:${svgH}px; overflow:visible;">
                <defs>
                    <linearGradient id="growthWaveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.35"/>
                        <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>
                <path d="${areaD}" fill="url(#growthWaveGrad)" />
                <path d="${pathD}" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" />
                ${dotsSVG}
            </svg>
            ${labelsHTML}
        `;
    };
    const renderAchievementsGrid = () => {
      const achGrid = container.querySelector("#achievements-grid");
      if (!achGrid) return;
      achGrid.innerHTML = "";
      const achievements = DB.getAchievementsState();
      achievements.forEach((ach) => {
        const item = document.createElement("div");
        item.className = `ach-item ${ach.unlocked ? "unlocked" : "locked"}`;
        if (ach.isTiered) {
          const chakra = ach.chakra || { color: "#E53935", bg: "rgba(229, 57, 53, 0.12)", name: "Root Chakra" };
          const progressPct = Math.min(100, ach.val / ach.target * 100);
          item.style.background = ach.unlocked ? chakra.bg : "var(--color-bg-card)";
          item.style.borderLeft = `4px solid ${chakra.color}`;
          item.innerHTML = `
                    <div class="ach-emoji" style="${ach.unlocked ? "" : "filter: grayscale(0.5); opacity: 0.55;"}">${ach.emoji}</div>
                    <div class="ach-details">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:4px; margin-bottom:2px;">
                            <h4 class="ach-title">${ach.title}</h4>
                            <span style="background:${chakra.color}; color:#fff; font-size:9px; font-weight:700; padding:1px 6px; border-radius:8px; white-space:nowrap;">Lvl ${ach.currentLevel}/${ach.maxLevel}</span>
                        </div>
                        <p class="ach-desc">${ach.desc} \u2022 <strong style="color:${chakra.color};">${chakra.name}</strong></p>
                        <div class="home-bar-track" style="margin: 0 0 4px; height: 4px; background: rgba(0,0,0,0.05); width: 100%;">
                            <div class="home-bar-fill" style="width: ${progressPct}%; height: 100%; background: ${chakra.color};"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="ach-reward-tag" style="background:${chakra.bg}; color:${chakra.color}; font-weight:700;">+${ach.nextTier ? ach.nextTier.xp : 0} XP</span>
                            <span class="ach-progress-text">${ach.val}/${ach.target}</span>
                        </div>
                    </div>
                `;
        } else if (ach.unlocked) {
          item.innerHTML = `
                    <div class="ach-emoji">${ach.emoji}</div>
                    <div class="ach-details">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:4px;">
                            <h4 class="ach-title">${ach.title}</h4>
                            <span class="material-symbols-rounded" style="font-size:13px; color:#2c8242; font-variation-settings: 'FILL' 1;">check_circle</span>
                        </div>
                        <p class="ach-desc">${ach.desc}</p>
                        <span class="ach-reward-tag">\u2713 Unlocked (+${ach.xp} XP)</span>
                    </div>
                `;
        } else {
          const progressPct = Math.min(100, ach.val / ach.target * 100);
          item.innerHTML = `
                    <div class="ach-emoji" style="filter: grayscale(0.5); opacity: 0.55;">${ach.emoji}</div>
                    <div class="ach-details">
                        <h4 class="ach-title" style="color:var(--color-text-secondary);">${ach.title}</h4>
                        <p class="ach-desc">${ach.desc}</p>
                        <div class="home-bar-track" style="margin: 0 0 4px; height: 4px; background: rgba(0,0,0,0.05); width: 100%;">
                            <div class="home-bar-fill" style="width: ${progressPct}%; height: 100%; background: #abb5ae;"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="ach-reward-tag" style="background:#edece8; color:#777;">+${ach.xp} XP</span>
                            <span class="ach-progress-text">${ach.val}/${ach.target}</span>
                        </div>
                    </div>
                `;
        }
        achGrid.appendChild(item);
      });
    };
    container.updateData = () => {
      const user = DB.getUser();
      const stats = DB.getStats();
      if (user) {
        container.querySelector("#profile-name").textContent = user.name || "User";
        const avatarImg = container.querySelector("#profile-avatar-img");
        if (avatarImg) {
          avatarImg.src = user.avatar || "./src/assets/avatar_monk.jpg";
        }
        const goalInput = container.querySelector("#custom-goal-input");
        if (goalInput) {
          goalInput.value = user.dailyCommitment || 20;
        }
        const notifSettings = DB.getNotificationSettings ? DB.getNotificationSettings() : {};
        const toggleSessionNotif2 = container.querySelector("#toggle-session-notification");
        const toggleVibration2 = container.querySelector("#toggle-vibration");
        if (typeof container.renderRemindersUI === "function") {
          container.renderRemindersUI();
        }
        if (toggleSessionNotif2) {
          toggleSessionNotif2.checked = notifSettings.sessionCompletionEnabled !== false;
        }
        if (toggleVibration2) {
          toggleVibration2.checked = notifSettings.vibrationEnabled !== false;
        }
      }
      const toggleMeditation2 = container.querySelector("#toggle-meditation-sound");
      const toggleMenu2 = container.querySelector("#toggle-menu-sound");
      if (toggleMeditation2) {
        const isMeditationMuted = localStorage.getItem("siddha_sound_meditation_muted") === "true" || localStorage.getItem("siddha_sound_muted") === "true";
        toggleMeditation2.checked = !isMeditationMuted;
      }
      if (toggleMenu2) {
        const isMenuMuted = localStorage.getItem("siddha_sound_menu_muted") === "true";
        toggleMenu2.checked = !isMenuMuted;
      }
      container.querySelector("#profile-level").textContent = stats.level;
      container.querySelector("#profile-xp").textContent = stats.xp;
      container.querySelector("#stat-sessions").textContent = stats.totalSessions;
      container.querySelector("#stat-minutes").textContent = stats.totalMinutes + "m";
      container.querySelector("#stat-streak").textContent = stats.streak + " days";
      const longest = stats.longestStreak || stats.streak || 0;
      const avgDur = stats.totalSessions > 0 ? Math.round(stats.totalMinutes / stats.totalSessions) : 0;
      const longestEl = container.querySelector("#stat-longest-streak");
      if (longestEl) longestEl.textContent = longest + " days";
      const avgEl = container.querySelector("#stat-avg-duration");
      if (avgEl) avgEl.textContent = avgDur + "m";
      container.querySelector("#rfl-total-mins").textContent = stats.weekMinutes;
      container.querySelector("#rfl-total-sessions").textContent = stats.weekSessions;
      container.querySelector("#rfl-streak").textContent = stats.streak;
      renderWeekBarChart(stats);
      renderHeatmapGrid();
      renderGrowthWaveChart(activeGrowthPeriod);
      renderAchievementsGrid();
    };
    const tabBtns = container.querySelectorAll(".rfl-tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        activeAnalyticsTab = targetTab;
        tabBtns.forEach((b) => {
          b.classList.remove("active");
          b.style.background = "transparent";
          b.style.color = "var(--color-text-muted)";
          b.style.boxShadow = "none";
        });
        btn.classList.add("active");
        btn.style.background = "var(--color-bg-card)";
        btn.style.color = "var(--color-text-primary)";
        btn.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
        container.querySelectorAll(".rfl-tab-view").forEach((v) => v.classList.add("hidden"));
        const targetView = container.querySelector(`#rfl-view-${targetTab}`);
        if (targetView) targetView.classList.remove("hidden");
        if (targetTab === "heatmap") renderHeatmapGrid();
        if (targetTab === "growth") renderGrowthWaveChart(activeGrowthPeriod);
      });
    });
    const growthToggleBtns = container.querySelectorAll(".rfl-growth-btn");
    growthToggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const period = btn.getAttribute("data-period");
        activeGrowthPeriod = period;
        growthToggleBtns.forEach((b) => {
          b.classList.remove("active");
          b.style.background = "transparent";
          b.style.color = "var(--color-text-muted)";
          b.style.boxShadow = "none";
        });
        btn.classList.add("active");
        btn.style.background = "var(--color-bg-card)";
        btn.style.color = "var(--color-text-primary)";
        btn.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
        renderGrowthWaveChart(period);
      });
    });
    container.querySelectorAll(".goal-chip-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mins = parseInt(btn.getAttribute("data-mins"));
        if (mins) {
          DB.setDailyGoal(mins);
          const customInput = container.querySelector("#custom-goal-input");
          if (customInput) customInput.value = mins;
          container.updateData();
        }
      });
    });
    const saveCustomGoalBtn = container.querySelector("#save-custom-goal-btn");
    if (saveCustomGoalBtn) {
      saveCustomGoalBtn.addEventListener("click", () => {
        const customInput = container.querySelector("#custom-goal-input");
        const val = parseInt(customInput?.value);
        if (val && val > 0) {
          DB.setDailyGoal(val);
          container.updateData();
          alert(`Daily meditation goal updated to ${val} minutes!`);
        }
      });
    }
    const remindersContainer = container.querySelector("#reminders-list-container");
    const addReminderBtn = container.querySelector("#add-reminder-btn");
    const toggleSessionNotif = container.querySelector("#toggle-session-notification");
    const toggleVibration = container.querySelector("#toggle-vibration");
    const syncNativeReminders = (remindersList) => {
      const notifPlugin = window.Capacitor?.Plugins?.LocalNotifications;
      if (!notifPlugin) return;
      notifPlugin.checkPermissions().then((perm) => {
        if (perm.display === "granted") {
          proceedWithSync();
        } else if (perm.display === "prompt" || perm.display === "prompt-with-rationale") {
          notifPlugin.requestPermissions().then((newPerm) => {
            if (newPerm.display === "granted") proceedWithSync();
          });
        }
      });
      function proceedWithSync() {
        notifPlugin.getPending().then((pending) => {
          const idsToCancel = pending && pending.notifications ? pending.notifications.map((n) => ({ id: n.id })) : [];
          const fallbackIds = Array.from({ length: 20 }, (_, i) => ({ id: 101 + i }));
          const allCancel = [...idsToCancel, ...fallbackIds, { id: 99 }];
          const enabledReminders = (remindersList || []).filter((r) => r.enabled);
          notifPlugin.cancel({ notifications: allCancel }).then(() => {
            if (enabledReminders.length === 0) return;
            const notificationsToSchedule = enabledReminders.map((r, index) => {
              const [hrs, mins] = (r.time || "08:00").split(":").map(Number);
              return {
                title: "Time for Mindfulness \u{1F9D8}",
                body: "Take a few moments to sit and find your center.",
                id: 101 + index,
                schedule: {
                  on: { hour: hrs, minute: mins },
                  repeats: true,
                  allowWhileIdle: true
                }
              };
            });
            notifPlugin.schedule({
              notifications: notificationsToSchedule
            }).catch((err) => console.warn("[Profile] LocalNotifications schedule error:", err));
          });
        });
      }
    };
    container.renderRemindersUI = () => {
      if (!remindersContainer) return;
      const notifSettings = DB.getNotificationSettings ? DB.getNotificationSettings() : {};
      const reminders = notifSettings.reminders || [];
      remindersContainer.innerHTML = "";
      if (reminders.length === 0) {
        remindersContainer.innerHTML = `<p style="font-size:11.5px; color:var(--color-text-muted); margin:0;">No reminders set. Click "Add Time" to add one.</p>`;
        return;
      }
      reminders.forEach((rem, idx) => {
        const row = document.createElement("div");
        row.className = "reminder-item-row";
        row.style.cssText = "display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--color-bg-secondary); border-radius:10px;";
        row.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="material-symbols-rounded" style="font-size:16px; color:var(--color-text-muted);">schedule</span>
                    <input type="time" class="reminder-time-field" data-id="${rem.id}" value="${rem.time || "08:00"}" style="padding:3px 6px; border-radius:6px; border:1px solid rgba(0,0,0,0.1); font-size:12px; outline:none; font-family:inherit; color:var(--color-text-primary); background:var(--color-bg-card);">
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <label class="switch-toggle" style="transform:scale(0.85); transform-origin:right center;">
                        <input type="checkbox" class="reminder-toggle-field" data-id="${rem.id}" ${rem.enabled ? "checked" : ""}>
                        <span class="toggle-slider"></span>
                    </label>
                    ${reminders.length > 1 ? `
                    <button class="reminder-delete-btn" data-id="${rem.id}" aria-label="Delete" style="background:none; border:none; cursor:pointer; color:#d32f2f; padding:2px; display:flex; align-items:center;">
                        <span class="material-symbols-rounded" style="font-size:16px;">delete</span>
                    </button>
                    ` : ""}
                </div>
            `;
        remindersContainer.appendChild(row);
      });
      remindersContainer.querySelectorAll(".reminder-time-field").forEach((input) => {
        input.addEventListener("change", (e) => {
          const id = e.target.getAttribute("data-id");
          const newTime = e.target.value;
          const notifSettings2 = DB.getNotificationSettings();
          const list = (notifSettings2.reminders || []).map((r) => r.id === id ? { ...r, time: newTime } : r);
          DB.setNotificationSettings({ reminders: list });
          syncNativeReminders(list);
        });
      });
      remindersContainer.querySelectorAll(".reminder-toggle-field").forEach((chk) => {
        chk.addEventListener("change", (e) => {
          const id = e.target.getAttribute("data-id");
          const isChecked = e.target.checked;
          const notifSettings2 = DB.getNotificationSettings();
          const list = (notifSettings2.reminders || []).map((r) => r.id === id ? { ...r, enabled: isChecked } : r);
          DB.setNotificationSettings({ reminders: list });
          syncNativeReminders(list);
        });
      });
      remindersContainer.querySelectorAll(".reminder-delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = btn.getAttribute("data-id");
          const notifSettings2 = DB.getNotificationSettings();
          const list = (notifSettings2.reminders || []).filter((r) => r.id !== id);
          DB.setNotificationSettings({ reminders: list });
          container.renderRemindersUI();
          syncNativeReminders(list);
        });
      });
    };
    if (addReminderBtn) {
      addReminderBtn.addEventListener("click", () => {
        const notifSettings = DB.getNotificationSettings();
        const list = notifSettings.reminders || [];
        const newId = "rem_" + Date.now();
        const defaultTimes = ["08:00", "13:00", "20:00", "21:30"];
        const nextTime = defaultTimes[list.length % defaultTimes.length];
        const updated = [...list, { id: newId, time: nextTime, enabled: true }];
        DB.setNotificationSettings({ reminders: updated });
        container.renderRemindersUI();
        syncNativeReminders(updated);
      });
    }
    container.renderRemindersUI();
    if (toggleSessionNotif) {
      toggleSessionNotif.addEventListener("change", (e) => {
        DB.setNotificationSettings({ sessionCompletionEnabled: e.target.checked });
      });
    }
    if (toggleVibration) {
      toggleVibration.addEventListener("change", (e) => {
        DB.setNotificationSettings({ vibrationEnabled: e.target.checked });
      });
    }
    const toggleMeditation = container.querySelector("#toggle-meditation-sound");
    const toggleMenu = container.querySelector("#toggle-menu-sound");
    const toggleBgMusic = container.querySelector("#toggle-bg-music");
    const selectBgTrack = container.querySelector("#select-bg-music-track");
    const sliderBgVolume = container.querySelector("#slider-bg-music-volume");
    const labelBgVolume = container.querySelector("#label-bg-music-volume");
    const optionsWrapBg = container.querySelector("#bg-music-options-wrap");
    if (toggleBgMusic && selectBgTrack && sliderBgVolume && labelBgVolume) {
      Promise.resolve().then(() => (init_synth(), synth_exports)).then(({ MenuMusic: MenuMusic2 }) => {
        const enabled = MenuMusic2.isEnabled();
        toggleBgMusic.checked = enabled;
        if (optionsWrapBg) optionsWrapBg.style.opacity = enabled ? "1" : "0.45";
        selectBgTrack.value = MenuMusic2.getSelectedTrackId();
        const currentVolPct = Math.round(MenuMusic2.getVolume() * 100);
        sliderBgVolume.value = currentVolPct;
        labelBgVolume.textContent = currentVolPct + "%";
        toggleBgMusic.addEventListener("change", (e) => {
          const isChecked = e.target.checked;
          MenuMusic2.setEnabled(isChecked);
          if (optionsWrapBg) optionsWrapBg.style.opacity = isChecked ? "1" : "0.45";
        });
        selectBgTrack.addEventListener("change", (e) => {
          MenuMusic2.setSelectedTrackId(e.target.value);
        });
        sliderBgVolume.addEventListener("input", (e) => {
          const pct = parseInt(e.target.value);
          labelBgVolume.textContent = pct + "%";
          MenuMusic2.setVolume(pct / 100);
        });
      });
    }
    const toggleNature = container.querySelector("#toggle-nature-sound");
    const selectNatureTrack = container.querySelector("#select-nature-sound-track");
    const sliderNatureVolume = container.querySelector("#slider-nature-volume");
    const labelNatureVolume = container.querySelector("#label-nature-volume");
    const optionsWrapNature = container.querySelector("#nature-sound-options-wrap");
    if (toggleNature && selectNatureTrack && sliderNatureVolume && labelNatureVolume) {
      Promise.resolve().then(() => (init_synth(), synth_exports)).then(({ NatureMusic: NatureMusic2 }) => {
        const enabled = NatureMusic2.isEnabled();
        toggleNature.checked = enabled;
        if (optionsWrapNature) optionsWrapNature.style.opacity = enabled ? "1" : "0.45";
        selectNatureTrack.value = NatureMusic2.getSelectedTrackId();
        const currentVolPct = Math.round(NatureMusic2.getVolume() * 100);
        sliderNatureVolume.value = currentVolPct;
        labelNatureVolume.textContent = currentVolPct + "%";
        toggleNature.addEventListener("change", (e) => {
          const isChecked = e.target.checked;
          NatureMusic2.setEnabled(isChecked);
          if (optionsWrapNature) optionsWrapNature.style.opacity = isChecked ? "1" : "0.45";
        });
        selectNatureTrack.addEventListener("change", (e) => {
          NatureMusic2.setSelectedTrackId(e.target.value);
        });
        sliderNatureVolume.addEventListener("input", (e) => {
          const pct = parseInt(e.target.value);
          labelNatureVolume.textContent = pct + "%";
          NatureMusic2.setVolume(pct / 100);
        });
      });
    }
    if (toggleMeditation) {
      toggleMeditation.addEventListener("change", (e) => {
        const isSoundOn = e.target.checked;
        localStorage.setItem("siddha_sound_meditation_muted", isSoundOn ? "false" : "true");
        localStorage.setItem("siddha_sound_muted", isSoundOn ? "false" : "true");
      });
    }
    if (toggleMenu) {
      toggleMenu.addEventListener("change", (e) => {
        const isSoundOn = e.target.checked;
        localStorage.setItem("siddha_sound_menu_muted", isSoundOn ? "false" : "true");
      });
    }
    const shareBtn = container.querySelector("#profile-share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const shareData = {
          title: "Siddha Meditation",
          text: "Find your inner calm and build a mindful habit with Siddha Meditation! \u{1F9D8}\u2728",
          url: "https://siddha.app"
        };
        if (window.Capacitor?.Plugins?.Share) {
          window.Capacitor.Plugins.Share.share(shareData).catch((err) => console.log("[Profile] Native share error:", err));
        } else if (navigator.share) {
          navigator.share(shareData).catch((err) => console.log("[Profile] Web share error:", err));
        } else {
          navigator.clipboard.writeText("https://siddha.app");
          alert("App link copied to clipboard! (https://siddha.app)");
        }
      });
    }
    const bugBtn = container.querySelector("#profile-bug-report-btn");
    const bugModal = container.querySelector("#bug-report-modal");
    const closeBugBtn = container.querySelector("#close-bug-modal-btn");
    const submitBugBtn = container.querySelector("#submit-bug-btn");
    if (bugBtn && bugModal) {
      bugBtn.addEventListener("click", () => {
        bugModal.style.display = "flex";
      });
    }
    if (closeBugBtn && bugModal) {
      closeBugBtn.addEventListener("click", () => {
        bugModal.style.display = "none";
      });
    }
    if (submitBugBtn && bugModal) {
      submitBugBtn.addEventListener("click", async () => {
        const type = container.querySelector("#bug-type-select")?.value || "bug";
        const desc = container.querySelector("#bug-desc-input")?.value.trim();
        const email = container.querySelector("#bug-email-input")?.value.trim();
        if (!desc) {
          alert("Please provide a brief description of the issue or idea.");
          return;
        }
        submitBugBtn.disabled = true;
        const originalText = submitBugBtn.textContent;
        submitBugBtn.textContent = "Sending Report... \u23F3";
        DB.saveFeedback({ type, summary: desc, email });
        try {
          await fetch("https://formsubmit.co/ajax/siddhameditation@gmail.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              _subject: `[Siddha ${type.toUpperCase()}] ${desc.slice(0, 40)}...`,
              _template: "table",
              _captcha: "false",
              issue_type: type,
              description: desc,
              user_email: email || "Not provided",
              app_version: "1.6.1 (Build 21)",
              device_platform: navigator.platform || "Unknown",
              submitted_at: (/* @__PURE__ */ new Date()).toLocaleString()
            })
          });
        } catch (err) {
          console.warn("[Profile] Email dispatch error:", err);
        }
        submitBugBtn.disabled = false;
        submitBugBtn.textContent = originalText;
        alert("Thank you! \u{1F41B} Your report has been sent directly to siddhameditation@gmail.com.");
        const descInput = container.querySelector("#bug-desc-input");
        if (descInput) descInput.value = "";
        bugModal.style.display = "none";
      });
    }
    const avatarBtn = container.querySelector("#profile-avatar-btn");
    const avatarModal = container.querySelector("#avatar-modal");
    const closeAvatarBtn = container.querySelector("#close-avatar-modal");
    if (avatarBtn && avatarModal) {
      avatarBtn.addEventListener("click", () => {
        avatarModal.style.display = "flex";
      });
    }
    if (closeAvatarBtn && avatarModal) {
      closeAvatarBtn.addEventListener("click", () => {
        avatarModal.style.display = "none";
      });
    }
    container.querySelectorAll(".avatar-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const avatarPath = btn.getAttribute("data-avatar");
        if (avatarPath) {
          DB.updateProfileAvatar(avatarPath);
          const avatarImg = container.querySelector("#profile-avatar-img");
          if (avatarImg) avatarImg.src = avatarPath;
          const homeLogo = document.querySelector(".home-logo-avatar");
          if (homeLogo) homeLogo.src = avatarPath;
          if (avatarModal) avatarModal.style.display = "none";
        }
      });
    });
    const openAnalyticsModalBtn = container.querySelector("#open-analytics-modal-btn");
    const analyticsModalOverlay = container.querySelector("#analytics-modal-overlay");
    const closeAnalyticsModalBtn = container.querySelector("#close-analytics-modal-btn");
    function openAnalyticsModal() {
      if (!analyticsModalOverlay) return;
      analyticsModalOverlay.style.display = "flex";
      const modalHeatmapContainer = container.querySelector("#modal-heatmap-container");
      const modalHeatmapPopover = container.querySelector("#modal-heatmap-popover");
      if (modalHeatmapContainer) {
        renderHeatmapGrid(modalHeatmapContainer, modalHeatmapPopover);
        setTimeout(() => {
          modalHeatmapContainer.scrollLeft = modalHeatmapContainer.scrollWidth;
        }, 80);
      }
      const modalGrowthChart = container.querySelector("#modal-growth-chart");
      if (modalGrowthChart) {
        renderGrowthWaveChart(activeGrowthPeriod, modalGrowthChart);
      }
    }
    if (openAnalyticsModalBtn) {
      openAnalyticsModalBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openAnalyticsModal();
      });
    }
    if (closeAnalyticsModalBtn) {
      closeAnalyticsModalBtn.addEventListener("click", () => {
        if (analyticsModalOverlay) analyticsModalOverlay.style.display = "none";
      });
    }
    if (analyticsModalOverlay) {
      analyticsModalOverlay.addEventListener("click", (e) => {
        if (e.target === analyticsModalOverlay) {
          analyticsModalOverlay.style.display = "none";
        }
      });
    }
    const sitRemindersCard = container.querySelector("#sit-reminders-card");
    if (sitRemindersCard) {
      const header = sitRemindersCard.querySelector(".collapsible-header");
      if (header) {
        header.addEventListener("click", () => {
          sitRemindersCard.classList.toggle("collapsed");
        });
      }
    }
    const lifetimeCard = container.querySelector("#lifetime-stats-card");
    if (lifetimeCard) {
      const header = lifetimeCard.querySelector(".collapsible-header");
      if (header) {
        header.addEventListener("click", () => {
          lifetimeCard.classList.toggle("collapsed");
        });
      }
    }
    const settingsCard = container.querySelector("#profile-settings-card");
    if (settingsCard) {
      const header = settingsCard.querySelector(".collapsible-header");
      if (header) {
        header.addEventListener("click", () => {
          settingsCard.classList.toggle("collapsed");
        });
      }
    }
    const milesCard = container.querySelector("#milestones-card");
    if (milesCard) {
      const header = milesCard.querySelector(".collapsible-header");
      if (localStorage.getItem("siddha_milestones_collapsed") === "false") {
        milesCard.classList.remove("collapsed");
      } else {
        milesCard.classList.add("collapsed");
      }
      if (header) {
        header.addEventListener("click", () => {
          milesCard.classList.toggle("collapsed");
          localStorage.setItem("siddha_milestones_collapsed", milesCard.classList.contains("collapsed"));
        });
      }
    }
    const feedbackCard = container.querySelector("#feedback-card");
    if (feedbackCard) {
      const header = feedbackCard.querySelector(".collapsible-header");
      if (header) {
        header.addEventListener("click", () => {
          feedbackCard.classList.toggle("collapsed");
        });
      }
    }
    const feedbackForm = container.querySelector("#feedback-form");
    const feedbackSuccess = container.querySelector("#feedback-success-msg");
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = container.querySelector("#feedback-type").value;
        const text = container.querySelector("#feedback-text").value.trim();
        if (text) {
          DB.saveFeedback(type, text);
          feedbackForm.style.display = "none";
          if (feedbackSuccess) feedbackSuccess.classList.remove("hidden");
          setTimeout(() => {
            feedbackForm.reset();
            feedbackForm.style.display = "flex";
            if (feedbackSuccess) feedbackSuccess.classList.add("hidden");
          }, 4e3);
        }
      });
    }
    const donateBtn = container.querySelector("#profile-donate-btn");
    if (donateBtn) {
      donateBtn.addEventListener("click", () => {
        window.open("https://ko-fi.com/siddha", "_blank");
      });
    }
    const openSettingsBtn = container.querySelector("#open-settings-screen-btn");
    if (openSettingsBtn && onOpenSettings) {
      openSettingsBtn.addEventListener("click", () => {
        onOpenSettings();
      });
    }
    const logoutBtn = container.querySelector("#logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await DB.logout();
        window.location.reload();
      });
    }
    const resetBtn = container.querySelector("#reset-account-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Delete all progress and return to setup? This action is permanent and cannot be undone.")) {
          DB.resetProgress();
          window.location.reload();
        }
      });
    }
    const privacyBtn = container.querySelector("#open-privacy-policy-btn");
    if (privacyBtn) {
      privacyBtn.addEventListener("click", () => {
        window.open("privacy_policy.html", "_blank");
      });
    }
    const viewFeedbackBtn = container.querySelector("#dev-view-feedback-btn");
    if (viewFeedbackBtn) {
      viewFeedbackBtn.addEventListener("click", () => {
        const history = DB.getFeedbackHistory();
        if (history.length === 0) {
          alert("No feedback submitted yet.");
        } else {
          const formatted = history.map((item) => `[${new Date(item.timestamp).toLocaleString()}] ${item.type.toUpperCase()}: ${item.text}`).join("\n\n");
          console.log("Saved Feedback Logs:\n", history);
          alert(`Saved Feedback Logs (also printed to Developer Console):

${formatted}`);
        }
      });
    }
    const skip3Btn = container.querySelector("#dev-skip-3-btn");
    if (skip3Btn) {
      skip3Btn.addEventListener("click", () => {
        DB.devSimulateTimePassing(3);
        container.updateData();
      });
    }
    const skip7Btn = container.querySelector("#dev-skip-7-btn");
    if (skip7Btn) {
      skip7Btn.addEventListener("click", () => {
        DB.devSimulateTimePassing(7);
        container.updateData();
      });
    }
    let tapCount = 0;
    let tapTimer = null;
    const versionTrigger = container.querySelector("#app-version-trigger");
    if (versionTrigger) {
      versionTrigger.addEventListener("click", () => {
        tapCount++;
        if (tapTimer) clearTimeout(tapTimer);
        tapTimer = setTimeout(() => {
          tapCount = 0;
        }, 3e3);
        if (tapCount >= 5) {
          tapCount = 0;
          clearTimeout(tapTimer);
          const isDev = localStorage.getItem("siddha_dev_mode") !== "true";
          localStorage.setItem("siddha_dev_mode", isDev ? "true" : "false");
          if (isDev) {
            document.body.classList.add("dev-mode-active");
          } else {
            document.body.classList.remove("dev-mode-active");
          }
          HapticService.vibrate("completion");
          alert(isDev ? "\u{1F6E0}\uFE0F Developer Mode Unlocked!" : "\u{1F512} Developer Mode Hidden!");
        }
      });
    }
    container.updateData();
    return container;
  }

  // src/screens/settings.js
  init_db();
  init_synth();
  function renderSettings(onBack) {
    const container = document.createElement("div");
    container.className = "screen scrollable settings-screen";
    container.innerHTML = `
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <button class="icon-btn" id="settings-back-btn" aria-label="Go back">
                <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <div style="text-align: center;">
                <h1 style="font-size: 20px; margin: 0; font-family: var(--font-heading);">Settings</h1>
                <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Audio, Haptics & Privacy</p>
            </div>
            <div style="width: 40px;"></div><!-- Spacer for centering -->
        </div>

        <!-- 1. Audio & Haptics Card -->
        <div class="card" style="margin-bottom: 20px; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 24px;">headphones</span>
                <div>
                    <h3 style="font-size: 15px; margin: 0; font-family: var(--font-heading); color: var(--color-text-primary);">Audio & Haptics</h3>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Soundscapes, volumes, UI sounds & vibration</p>
                </div>
            </div>

            <!-- Background Menu Music Controls -->
            <div style="margin-bottom: 16px; background: var(--color-bg-secondary); border-radius: 14px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">\u{1F3B6} Background Menu Music</span>
                        <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Looping ambient music in main menus</p>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox" id="toggle-bg-music" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div id="bg-music-options-wrap" style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px; padding-top: 10px; border-top: 1px rgba(0,0,0,0.06) solid;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary);">Select Track</span>
                        <select id="select-bg-music-track" style="padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); font-size: 11.5px; font-weight: 600; background: var(--color-bg-card); color: var(--color-text-primary); outline: none; font-family: inherit; cursor: pointer;">
                            <option value="cycle">\u{1F504} Cycle All 3 Tracks</option>
                            <option value="himalayan">\u{1F3D4}\uFE0F Himalayan Sanctuary</option>
                            <option value="temple_wind">\u{1F343} Temple Wind Echoes</option>
                            <option value="fairytale_harp">\u{1F3B6} Fairytale Harp</option>
                        </select>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span class="material-symbols-rounded" style="font-size: 16px; color: var(--color-text-muted);">volume_up</span>
                            <span style="font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary);">Music Volume</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="range" id="slider-bg-music-volume" min="0" max="100" value="25" style="width: 90px; accent-color: var(--color-accent); cursor: pointer;">
                            <span id="label-bg-music-volume" style="font-size: 11px; font-weight: 700; color: var(--color-accent); min-width: 28px; text-align: right;">25%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nature Sound Ambiance Controls -->
            <div style="margin-bottom: 16px; background: var(--color-bg-secondary); border-radius: 14px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">\u{1F33F} Nature Sound Ambiance</span>
                        <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Birds & stream background soundscapes</p>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox" id="toggle-nature-sound">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div id="nature-sound-options-wrap" style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px; padding-top: 10px; border-top: 1px rgba(0,0,0,0.06) solid;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary);">Select Ambiance</span>
                        <select id="select-nature-sound-track" style="padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); font-size: 11.5px; font-weight: 600; background: var(--color-bg-card); color: var(--color-text-primary); outline: none; font-family: inherit; cursor: pointer;">
                            <option value="water_stream">\u{1F3DE}\uFE0F Water Stream & Creek</option>
                            <option value="birds_calm_river">\u{1F333} Birds & Calm River</option>
                            <option value="cycle">\u{1F504} Cycle All Nature Sounds</option>
                        </select>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span class="material-symbols-rounded" style="font-size: 16px; color: var(--color-text-muted);">volume_up</span>
                            <span style="font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary);">Ambiance Volume</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="range" id="slider-nature-volume" min="0" max="100" value="35" style="width: 90px; accent-color: var(--color-accent); cursor: pointer;">
                            <span id="label-nature-volume" style="font-size: 11px; font-weight: 700; color: var(--color-accent); min-width: 28px; text-align: right;">35%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Haptics / Vibration Toggle -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid var(--color-bg-secondary);">
                <div>
                    <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">\u{1F4F3} Haptics & Vibration</span>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Tactile pulses on iOS, Android & web</p>
                </div>
                <label class="switch-toggle">
                    <input type="checkbox" id="toggle-vibration" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <!-- Meditation Sound Toggle -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid var(--color-bg-secondary);">
                <div>
                    <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">\u{1F9D8} Meditation Bells & Ambient</span>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Sit interval bells & soundscapes</p>
                </div>
                <label class="switch-toggle">
                    <input type="checkbox" id="toggle-meditation-sound" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <!-- Menu / UI Sound Toggle -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--color-bg-secondary);">
                <div>
                    <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">\u{1F3B5} Menu & Navigation Sounds</span>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">UI clicks & feedback audio</p>
                </div>
                <label class="switch-toggle">
                    <input type="checkbox" id="toggle-menu-sound" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <!-- Battery Optimization Note -->
            <div style="background: rgba(226, 184, 87, 0.1); border: 1px solid rgba(226, 184, 87, 0.25); border-radius: 12px; padding: 12px; margin-top: 14px;">
                <h4 style="font-size: 11.5px; font-weight: 700; color: #856404; margin: 0 0 4px; display: flex; align-items: center; gap: 6px;">
                    <span class="material-symbols-rounded" style="font-size: 16px;">battery_saver</span>
                    Android Battery Saver Note
                </h4>
                <p style="font-size: 10.5px; color: #856404; margin: 0; line-height: 1.4;">
                    If meditation bells don't ring while your phone is locked, please disable <strong>"Battery Optimization"</strong> for Siddha in your Android system settings.
                </p>
            </div>
        </div>

        <!-- 2. Privacy & Account Card -->
        <div class="card" style="margin-bottom: 32px; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 24px;">security</span>
                <div>
                    <h3 style="font-size: 15px; margin: 0; font-family: var(--font-heading); color: var(--color-text-primary);">Privacy & Account</h3>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">Manage your data & privacy options</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="open-privacy-policy-btn" style="background: var(--color-bg-secondary); border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; padding: 10px; font-size: 12px; font-weight: 600; color: var(--color-text-primary); cursor: pointer; display: flex; align-items: center; gap: 8px; justify-content: center;">
                    <span class="material-symbols-rounded" style="font-size: 18px; color: var(--color-accent);">policy</span>
                    View Privacy Policy
                </button>

                <button id="reset-account-btn" style="background: transparent; border: 1px dashed #ff6b6b; border-radius: 10px; padding: 10px; font-size: 12px; font-weight: 600; color: #ff6b6b; cursor: pointer; display: flex; align-items: center; gap: 8px; justify-content: center;">
                    <span class="material-symbols-rounded" style="font-size: 18px;">delete_forever</span>
                    Reset Account & Delete All Data
                </button>
            </div>
        </div>
    `;
    setTimeout(() => {
      const backBtn = container.querySelector("#settings-back-btn");
      if (backBtn && onBack) {
        backBtn.addEventListener("click", () => {
          Synth.playMenuClick();
          onBack();
        });
      }
      const notifSettings = DB.getNotificationSettings();
      const toggleBgMusic = container.querySelector("#toggle-bg-music");
      const bgMusicWrap = container.querySelector("#bg-music-options-wrap");
      const selectBgTrack = container.querySelector("#select-bg-music-track");
      const sliderBgVol = container.querySelector("#slider-bg-music-volume");
      const labelBgVol = container.querySelector("#label-bg-music-volume");
      const toggleNature = container.querySelector("#toggle-nature-sound");
      const natureWrap = container.querySelector("#nature-sound-options-wrap");
      const selectNatureTrack = container.querySelector("#select-nature-sound-track");
      const sliderNatureVol = container.querySelector("#slider-nature-volume");
      const labelNatureVol = container.querySelector("#label-nature-volume");
      const toggleVibration = container.querySelector("#toggle-vibration");
      const toggleMeditationSound = container.querySelector("#toggle-meditation-sound");
      const toggleMenuSound = container.querySelector("#toggle-menu-sound");
      if (toggleBgMusic) {
        toggleBgMusic.checked = MenuMusic.isEnabled();
        bgMusicWrap.style.display = toggleBgMusic.checked ? "flex" : "none";
        toggleBgMusic.addEventListener("change", (e) => {
          const val = e.target.checked;
          bgMusicWrap.style.display = val ? "flex" : "none";
          DB.setNotificationSettings({ bgMusicEnabled: val });
          MenuMusic.setEnabled(val);
        });
      }
      if (selectBgTrack) {
        selectBgTrack.value = notifSettings.bgMusicTrack || "cycle";
        selectBgTrack.addEventListener("change", (e) => {
          const track = e.target.value;
          DB.setNotificationSettings({ bgMusicTrack: track });
          MenuMusic.setTrack(track);
        });
      }
      if (sliderBgVol && labelBgVol) {
        const initialVolPct = Math.round((notifSettings.bgMusicVolume != null ? notifSettings.bgMusicVolume : 0.25) * 100);
        sliderBgVol.value = initialVolPct;
        labelBgVol.textContent = `${initialVolPct}%`;
        sliderBgVol.addEventListener("input", (e) => {
          const val = parseInt(e.target.value);
          labelBgVol.textContent = `${val}%`;
          const normVol = val / 100;
          DB.setNotificationSettings({ bgMusicVolume: normVol });
          MenuMusic.setVolume(normVol);
        });
      }
      if (toggleNature) {
        toggleNature.checked = NatureMusic.isEnabled();
        natureWrap.style.display = toggleNature.checked ? "flex" : "none";
        toggleNature.addEventListener("change", (e) => {
          const val = e.target.checked;
          natureWrap.style.display = val ? "flex" : "none";
          DB.setNotificationSettings({ natureSoundEnabled: val });
          NatureMusic.setEnabled(val);
        });
      }
      if (selectNatureTrack) {
        selectNatureTrack.value = notifSettings.natureSoundTrack || "water_stream";
        selectNatureTrack.addEventListener("change", (e) => {
          const track = e.target.value;
          DB.setNotificationSettings({ natureSoundTrack: track });
          NatureMusic.setTrack(track);
        });
      }
      if (sliderNatureVol && labelNatureVol) {
        const initialNatPct = Math.round((notifSettings.natureSoundVolume != null ? notifSettings.natureSoundVolume : 0.35) * 100);
        sliderNatureVol.value = initialNatPct;
        labelNatureVol.textContent = `${initialNatPct}%`;
        sliderNatureVol.addEventListener("input", (e) => {
          const val = parseInt(e.target.value);
          labelNatureVol.textContent = `${val}%`;
          const normVol = val / 100;
          DB.setNotificationSettings({ natureSoundVolume: normVol });
          NatureMusic.setVolume(normVol);
        });
      }
      if (toggleVibration) {
        toggleVibration.checked = notifSettings.vibrationEnabled !== false;
        toggleVibration.addEventListener("change", (e) => {
          const val = e.target.checked;
          DB.setNotificationSettings({ vibrationEnabled: val });
          if (val) HapticService2.vibrate("light");
        });
      }
      if (toggleMeditationSound) {
        toggleMeditationSound.checked = localStorage.getItem("siddha_sound_meditation_muted") !== "true";
        toggleMeditationSound.addEventListener("change", (e) => {
          const isMuted = !e.target.checked;
          localStorage.setItem("siddha_sound_meditation_muted", isMuted);
          DB.setNotificationSettings({ meditationSoundEnabled: !isMuted });
        });
      }
      if (toggleMenuSound) {
        toggleMenuSound.checked = localStorage.getItem("siddha_sound_menu_muted") !== "true";
        toggleMenuSound.addEventListener("change", (e) => {
          const isMuted = !e.target.checked;
          localStorage.setItem("siddha_sound_menu_muted", isMuted);
          DB.setNotificationSettings({ menuSoundEnabled: !isMuted });
        });
      }
      const privacyBtn = container.querySelector("#open-privacy-policy-btn");
      if (privacyBtn) {
        privacyBtn.addEventListener("click", () => {
          Synth.playMenuClick();
          window.open("./src/privacy_policy.html", "_blank");
        });
      }
      const resetBtn = container.querySelector("#reset-account-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          Synth.playMenuClick();
          if (confirm("Are you sure you want to reset your account? All XP, levels, streak and progress will be deleted!")) {
            localStorage.clear();
            window.location.reload();
          }
        });
      }
    }, 50);
    return container;
  }

  // src/screens/new_reflection.js
  init_db();
  init_synth();
  function renderNewReflection(onComplete) {
    const container = document.createElement("div");
    container.className = "screen scrollable new-reflection-screen";
    container.sessionData = null;
    container.innerHTML = `
        <!-- Back button + title + Skip button -->
        <div class="nr-header">
            <button class="nr-back-btn" id="nr-back-btn">
                <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <div style="text-align:center; flex:1;">
                <h1 class="nr-title" id="nr-title">Reflection</h1>
                <p class="nr-subtitle" id="nr-subtitle">How are you feeling?</p>
            </div>
            <button id="nr-skip-btn" class="nr-skip-btn">Skip</button>
        </div>

        <!-- XP celebration (hidden in standalone mode) -->
        <div id="nr-xp-zone" class="nr-xp-zone">
            <div class="nr-coin-wrap">
                <div class="nr-sparkle s1">\u2726</div>
                <div class="nr-sparkle s2">\u2726</div>
                <div class="nr-sparkle s3">\u2726</div>
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
                <div class="nr-mood" data-mood="calm">\u{1F60C}<span class="nr-mood-lbl">Calm</span></div>
                <div class="nr-mood" data-mood="happy">\u{1F60A}<span class="nr-mood-lbl">Happy</span></div>
                <div class="nr-mood" data-mood="tired">\u{1F634}<span class="nr-mood-lbl">Tired</span></div>
                <div class="nr-mood" data-mood="anxious">\u{1F630}<span class="nr-mood-lbl">Anxious</span></div>
                <div class="nr-mood" data-mood="grateful">\u{1F64F}<span class="nr-mood-lbl">Grateful</span></div>
                <div class="nr-mood" data-mood="neutral">\u{1F610}<span class="nr-mood-lbl">Neutral</span></div>
            </div>
        </div>

        <!-- Meditation-Only State Spectrums & Orb -->
        <div id="nr-meditation-spectrums">
            <!-- Zen State Orb Preview -->
            <div class="nr-section" style="text-align: center; margin-bottom: 24px;">
                <div class="nr-orb-container" style="position: relative; width: 110px; height: 110px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
                    <div id="nr-state-orb" style="width: 75px; height: 75px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #8b5cf6, #6d28d9); box-shadow: 0 0 24px rgba(139, 92, 246, 0.4); transition: all 0.25s ease-out; display: flex; align-items: center; justify-content: center;">
                        <span id="nr-orb-emoji" style="font-size: 28px;">\u{1F9D8}</span>
                    </div>
                </div>
                <h4 id="nr-state-title" style="font-size: 15px; font-weight: 700; margin: 0 0 4px; font-family: var(--font-heading); color: var(--color-text-primary);">Focused Clarity</h4>
                <p id="nr-state-desc" class="text-sm" style="color: var(--color-text-secondary); margin: 0; font-size: 12px;">Steady Concentration & Clear Mindfulness</p>
            </div>

            <!-- Dual Polarity Spectrum Sliders -->
            <div class="nr-section">
                <h3 class="nr-section-title" style="margin-bottom:6px;">Mind State Spectrums</h3>

                <!-- Slider 1: Focus Polarity -->
                <div style="margin-bottom: 16px; background: var(--color-bg-card); padding: 14px 16px; border-radius: 16px; border: 1px solid var(--color-bg-secondary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 12px; font-weight: 600; color: var(--color-text-primary);">Focus & Concentration</span>
                        <span id="nr-focus-val" style="font-size: 11px; font-weight: 700; color: var(--color-accent);">50%</span>
                    </div>
                    <p style="font-size: 10px; color: var(--color-text-muted); margin: 0 0 10px 0; line-height: 1.35;">
                        How continuously your attention stayed anchored to your breath object vs wandering.
                    </p>
                    <input type="range" id="nr-focus-slider" min="0" max="100" value="50" style="width: 100%; accent-color: var(--color-accent); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--color-text-muted); margin-top: 6px;">
                        <span>\u{1F300} Wandering</span>
                        <span>\u2728 Absorbed</span>
                    </div>
                </div>

                <!-- Slider 2: Stability & Clarity Polarity -->
                <div style="margin-bottom: 16px; background: var(--color-bg-card); padding: 14px 16px; border-radius: 16px; border: 1px solid var(--color-bg-secondary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 12px; font-weight: 600; color: var(--color-text-primary);">Stability & Clarity</span>
                        <span id="nr-stability-val" style="font-size: 11px; font-weight: 700; color: var(--color-accent);">50%</span>
                    </div>
                    <p style="font-size: 10px; color: var(--color-text-muted); margin: 0 0 10px 0; line-height: 1.35;">
                        Whether your mind felt awake and sharp vs heavy, sluggish, or sleepy.
                    </p>
                    <input type="range" id="nr-stability-slider" min="0" max="100" value="50" style="width: 100%; accent-color: var(--color-accent); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--color-text-muted); margin-top: 6px;">
                        <span>\u{1F4A4} Sleepy / Dull</span>
                        <span>\u2600\uFE0F Vivid / Luminous</span>
                    </div>
                </div>

                <!-- Slider 3: Equanimity & Non-Reactivity Polarity -->
                <div style="margin-bottom: 20px; background: var(--color-bg-card); padding: 14px 16px; border-radius: 16px; border: 1px solid var(--color-bg-secondary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 12px; font-weight: 600; color: var(--color-text-primary);">Equanimity & Openness</span>
                        <span id="nr-equanimity-val" style="font-size: 11px; font-weight: 700; color: var(--color-accent);">50%</span>
                    </div>
                    <p style="font-size: 10px; color: var(--color-text-muted); margin: 0 0 10px 0; line-height: 1.35;">
                        How gracefully you allowed thoughts and sensations to be without pushing or resisting.
                    </p>
                    <input type="range" id="nr-equanimity-slider" min="0" max="100" value="50" style="width: 100%; accent-color: var(--color-accent); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--color-text-muted); margin-top: 6px;">
                        <span>\u26A1 Tense / Resistant</span>
                        <span>\u{1F54A}\uFE0F Open / Equanimous</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mental Hindrances -->
        <div class="nr-section">
            <h3 class="nr-section-title">Mental Obstacles <span class="nr-section-tag">(optional)</span></h3>
            <div class="nr-chips-row" id="hindrances-selector">
                <div class="nr-chip nr-chip-multi" data-hindrance="dullness">\u{1F4A4} Sleepiness</div>
                <div class="nr-chip nr-chip-multi" data-hindrance="restlessness">\u{1F41D} Restlessness</div>
                <div class="nr-chip nr-chip-multi" data-hindrance="craving">\u{1F4AD} Craving</div>
                <div class="nr-chip nr-chip-multi" data-hindrance="aversion">\u26A1 Aversion</div>
                <div class="nr-chip nr-chip-multi" data-hindrance="doubt">\u2753 Doubt</div>
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
                <button class="nr-chip prompt-chip" data-prompt="What arose during the sit: ">\u{1F4A1} What arose?</button>
                <button class="nr-chip prompt-chip" data-prompt="Where was breath felt most clearly: ">\u{1F32C}\uFE0F Breath anchor?</button>
                <button class="nr-chip prompt-chip" data-prompt="Tension softened in: ">\u{1F33F} Tension release?</button>
                <button class="nr-chip prompt-chip" data-prompt="Insight gained today: ">\u2728 Today's insight?</button>
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
    const style = document.createElement("style");
    style.textContent = `
        .new-reflection-screen {
            background: var(--color-bg-primary);
            padding: calc(32px + env(safe-area-inset-top, 0px)) 20px 0;
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
        .nr-skip-btn {
            background: var(--color-bg-secondary);
            border: 1px solid rgba(0,0,0,0.08);
            color: var(--color-text-primary);
            font-weight: 600;
            font-size: 12px;
            padding: 7px 13px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.15s ease;
            flex-shrink: 0;
        }
        .nr-skip-btn:hover {
            background: var(--color-accent);
            color: #ffffff;
        }

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
    let selectedMood = "calm";
    let selectedFocusDepth = "settling";
    const selectedHindrances = /* @__PURE__ */ new Set();
    let earnedXP = 0;
    let currentFocusScore = 50;
    let currentStabilityScore = 50;
    let currentEquanimityScore = 50;
    const moodBtns = container.querySelectorAll(".nr-mood");
    moodBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        moodBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedMood = btn.dataset.mood;
      });
    });
    const defaultMood = container.querySelector('[data-mood="calm"]');
    if (defaultMood) defaultMood.classList.add("active");
    const updateStateOrb = (focus, stability, equanimity) => {
      const focusValEl = container.querySelector("#nr-focus-val");
      const stabilityValEl = container.querySelector("#nr-stability-val");
      const equanimityValEl = container.querySelector("#nr-equanimity-val");
      const orb = container.querySelector("#nr-state-orb");
      const orbEmoji = container.querySelector("#nr-orb-emoji");
      const stateTitle = container.querySelector("#nr-state-title");
      const stateDesc = container.querySelector("#nr-state-desc");
      if (focusValEl) focusValEl.textContent = `${focus}%`;
      if (stabilityValEl) stabilityValEl.textContent = `${stability}%`;
      if (equanimityValEl) equanimityValEl.textContent = `${equanimity}%`;
      const avgScore = (focus + stability + equanimity) / 3;
      const scale = 0.75 + avgScore / 100 * 0.55;
      const shadowBlur = 12 + Math.round(avgScore / 100 * 32);
      let grad = "radial-gradient(circle at 30% 30%, #8b5cf6, #6d28d9)";
      let emoji = "\u{1F9D8}";
      let title = "Balanced Mindfulness";
      let desc = "Harmonious Concentration & Steady Flow";
      let shadowColor = "rgba(139, 92, 246, 0.4)";
      if (equanimity >= 65 && focus >= 65 && stability >= 65) {
        grad = "radial-gradient(circle at 30% 30%, #10b981, #047857)";
        emoji = "\u{1F54A}\uFE0F";
        title = "Open Samadhi";
        desc = "Single-Pointed Absorption, Vivid Clarity & Deep Peace";
        shadowColor = "rgba(16, 185, 129, 0.5)";
        selectedFocusDepth = "absorbed";
      } else if (focus >= 60 && stability < 35) {
        grad = "radial-gradient(circle at 30% 30%, #7c3aed, #4c1d95)";
        emoji = "\u{1F634}";
        title = "Striving against Dullness";
        desc = "High Effort Fighting Sluggishness & Foggy Mind";
        shadowColor = "rgba(124, 58, 237, 0.4)";
        selectedFocusDepth = "unsteady";
      } else if (focus < 35 && stability < 35 && equanimity < 35) {
        grad = "radial-gradient(circle at 30% 30%, #e11d48, #9f1239)";
        emoji = "\u{1F32A}\uFE0F";
        title = "Turbulent Mind";
        desc = "Restless Thoughts & Emotional Agitation";
        shadowColor = "rgba(225, 29, 72, 0.4)";
        selectedFocusDepth = "wandering";
      } else if (focus < 35 && stability < 35) {
        grad = "radial-gradient(circle at 30% 30%, #f59e0b, #d97706)";
        emoji = "\u{1F4A4}";
        title = "Sleepy Drift";
        desc = "Dullness & Sluggish Presence";
        shadowColor = "rgba(245, 158, 11, 0.4)";
        selectedFocusDepth = "wandering";
      } else if (focus >= 65 && stability >= 60 && equanimity < 65) {
        grad = "radial-gradient(circle at 30% 30%, #6366f1, #4338ca)";
        emoji = "\u{1F3AF}";
        title = "Laser Clarity";
        desc = "Intense Single-Pointed Concentration";
        shadowColor = "rgba(99, 102, 241, 0.4)";
        selectedFocusDepth = "focused";
      } else if (focus >= 65 && equanimity < 35) {
        grad = "radial-gradient(circle at 30% 30%, #f43f5e, #be123c)";
        emoji = "\u26A1";
        title = "Tense Striving";
        desc = "High Focus with Internal Tension & Resistance";
        shadowColor = "rgba(244, 63, 94, 0.4)";
        selectedFocusDepth = "unsteady";
      } else if (equanimity >= 65 && focus < 40) {
        grad = "radial-gradient(circle at 30% 30%, #06b6d4, #0891b2)";
        emoji = "\u{1F30A}";
        title = "Equanimous Flow";
        desc = "Open Non-Reactivity to Wandering Thoughts";
        shadowColor = "rgba(6, 182, 212, 0.4)";
        selectedFocusDepth = "settling";
      } else if (stability >= 65 && equanimity >= 60) {
        grad = "radial-gradient(circle at 30% 30%, #3b82f6, #1d4ed8)";
        emoji = "\u{1F30C}";
        title = "Tranquil Stillness";
        desc = "Quiet Physical Stability & Peaceful Presence";
        shadowColor = "rgba(59, 130, 246, 0.4)";
        selectedFocusDepth = "settling";
      } else if (stability >= 45 && focus < 35 && equanimity >= 40) {
        grad = "radial-gradient(circle at 30% 30%, #14b8a6, #0f766e)";
        emoji = "\u{1F56F}\uFE0F";
        title = "Gentle Anchoring";
        desc = "Resting Baseline Stability without Striving Focus";
        shadowColor = "rgba(20, 184, 166, 0.4)";
        selectedFocusDepth = "settling";
      } else if (focus >= 50 && stability >= 50) {
        grad = "radial-gradient(circle at 30% 30%, #8b5cf6, #6d28d9)";
        emoji = "\u{1F9D8}";
        title = "Focused Clarity";
        desc = "Steady Concentration & Clear Mindfulness";
        shadowColor = "rgba(139, 92, 246, 0.4)";
        selectedFocusDepth = "focused";
      } else {
        grad = "radial-gradient(circle at 30% 30%, #a855f7, #7e22ce)";
        emoji = "\u{1F331}";
        title = "Gentle Awareness";
        desc = "Developing Concentration & Quiet Observation";
        shadowColor = "rgba(168, 85, 247, 0.4)";
        selectedFocusDepth = "settling";
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
    const focusSlider = container.querySelector("#nr-focus-slider");
    const stabilitySlider = container.querySelector("#nr-stability-slider");
    const equanimitySlider = container.querySelector("#nr-equanimity-slider");
    if (focusSlider) {
      focusSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        currentFocusScore = isNaN(val) ? 50 : val;
        updateStateOrb(currentFocusScore, currentStabilityScore, currentEquanimityScore);
        HapticService2.vibrate("light");
      });
    }
    if (stabilitySlider) {
      stabilitySlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        currentStabilityScore = isNaN(val) ? 50 : val;
        updateStateOrb(currentFocusScore, currentStabilityScore, currentEquanimityScore);
        HapticService2.vibrate("light");
      });
    }
    if (equanimitySlider) {
      equanimitySlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        currentEquanimityScore = isNaN(val) ? 50 : val;
        updateStateOrb(currentFocusScore, currentStabilityScore, currentEquanimityScore);
        HapticService2.vibrate("light");
      });
    }
    container.querySelectorAll("#guided-prompts-row .prompt-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const promptText = btn.getAttribute("data-prompt");
        const textarea = container.querySelector("#reflection-text");
        if (textarea && promptText) {
          if (textarea.value.trim().length > 0) {
            textarea.value += `
${promptText}`;
          } else {
            textarea.value = promptText;
          }
          textarea.focus();
        }
      });
    });
    const hindranceChips = container.querySelectorAll("#hindrances-selector .nr-chip");
    hindranceChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const h = chip.dataset.hindrance;
        if (selectedHindrances.has(h)) {
          selectedHindrances.delete(h);
          chip.classList.remove("active");
        } else {
          selectedHindrances.add(h);
          chip.classList.add("active");
        }
      });
    });
    const skipBtn = container.querySelector("#nr-skip-btn");
    if (skipBtn) {
      skipBtn.addEventListener("click", () => {
        if (onComplete) {
          onComplete();
        } else {
          window.dispatchEvent(new CustomEvent("siddha-navigate", { detail: { target: "home" } }));
        }
      });
    }
    container.querySelector("#nr-back-btn").addEventListener("click", () => {
      document.querySelector('[data-target="reflect"]')?.click();
    });
    container.querySelector("#finish-reflection-btn").addEventListener("click", () => {
      const text = container.querySelector("#reflection-text").value.trim();
      const isStandalone = !container.sessionData;
      DB.saveReflection({
        mood: selectedMood,
        focusDepth: selectedFocusDepth,
        focusScore: currentFocusScore,
        stabilityScore: currentStabilityScore,
        equanimityScore: currentEquanimityScore,
        hindrances: Array.from(selectedHindrances),
        text,
        intention: container.sessionData?.intention || null,
        xp: isStandalone ? 0 : earnedXP,
        duration: isStandalone ? null : container.sessionData?.duration || null,
        standalone: isStandalone
      });
      DB.checkAndTriggerAchievements(false);
      if (onComplete) onComplete();
    });
    container.updateData = () => {
      const isStandalone = !container.sessionData;
      const xpZone = container.querySelector("#nr-xp-zone");
      const titleEl = container.querySelector("#nr-title");
      const subtitleEl = container.querySelector("#nr-subtitle");
      const spectsEl = container.querySelector("#nr-meditation-spectrums");
      if (container.sessionData?.intention) {
        let intentBanner = container.querySelector("#nr-intention-banner");
        if (!intentBanner) {
          intentBanner = document.createElement("div");
          intentBanner.id = "nr-intention-banner";
          intentBanner.className = "nr-section";
          intentBanner.style.cssText = "background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.2); border-radius:14px; padding:12px 14px; margin-bottom:16px;";
          if (xpZone && xpZone.nextSibling) {
            xpZone.parentNode.insertBefore(intentBanner, xpZone.nextSibling);
          }
        }
        intentBanner.innerHTML = `
                <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--color-accent); margin-bottom:4px; display:flex; align-items:center; gap:4px;">
                    <span class="material-symbols-rounded" style="font-size:14px; color:#ffd166;">psychology_alt</span> Intention set for this sit
                </div>
                <div style="font-size:13.5px; font-weight:600; color:var(--color-text-primary); font-style:italic; line-height:1.4;">
                    "${container.sessionData.intention}"
                </div>
            `;
        intentBanner.style.display = "block";
      } else {
        const intentBanner = container.querySelector("#nr-intention-banner");
        if (intentBanner) intentBanner.style.display = "none";
      }
      if (spectsEl) spectsEl.style.display = "block";
      if (isStandalone) {
        xpZone.classList.add("hidden");
        titleEl.textContent = "Quick Reflection";
        subtitleEl.textContent = "Capture your thoughts & mood";
      } else {
        xpZone.classList.remove("hidden");
        const data = container.sessionData;
        const durationXP = (data.duration || 10) * 5;
        earnedXP = durationXP;
        if (data.mission) {
          earnedXP += 20;
        }
        container.querySelector("#nr-earned-xp").textContent = earnedXP;
        titleEl.textContent = "Reflection";
        subtitleEl.textContent = "Nice work! Session complete.";
        const chip = container.querySelector("#nr-mission-chip");
        if (data.mission) {
          chip.style.display = "inline-block";
          chip.innerHTML = `\u{1F3C6} Mission: <strong>${data.mission.label}</strong> (+20 XP)`;
        } else {
          chip.style.display = "inline-block";
          chip.innerHTML = `\u2728 Completed <strong>${data.duration || 10}-min</strong> meditation session`;
        }
      }
      container.querySelector("#reflection-text").value = "";
      moodBtns.forEach((b) => b.classList.remove("active"));
      const calmBtn = container.querySelector('[data-mood="calm"]');
      if (calmBtn) calmBtn.classList.add("active");
      selectedMood = "calm";
      const fSlider = container.querySelector("#nr-focus-slider");
      const sSlider = container.querySelector("#nr-stability-slider");
      const eSlider = container.querySelector("#nr-equanimity-slider");
      if (fSlider) fSlider.value = 50;
      if (sSlider) sSlider.value = 50;
      if (eSlider) eSlider.value = 50;
      currentFocusScore = 50;
      currentStabilityScore = 50;
      currentEquanimityScore = 50;
      updateStateOrb(50, 50, 50);
      selectedHindrances.clear();
      hindranceChips.forEach((c) => c.classList.remove("active"));
    };
    return container;
  }

  // src/screens/wisdom.js
  init_db();
  var ARTICLES = [
    // ─── FOUNDATIONS OF MINDFULNESS ───────────────────────────────────────────
    {
      id: "intro_breath",
      unlockLevel: 1,
      category: "Foundations of Mindfulness",
      emoji: "\u{1F32C}\uFE0F",
      title: "The Anchor of Breath: Settling the Mind",
      readTime: "4 min",
      summary: "Discover the foundational mechanics of breath observation, correct posture, and the art of returning when the mind wanders.",
      content: `
            <p>Every journey into meditation begins with a single breath. The breath is not merely a biological function \u2014 it is a portable anchor that binds the scattered mind to the immediate present. By resting attention on the physical sensations of breathing, we establish a quiet harbor away from the turbulence of conceptual thoughts.</p>

            <h3>The Posture of Presence</h3>
            <p>Before observing the breath, find a posture that expresses both alertness and ease. Sit with your spine naturally upright \u2014 neither stiffly rigid nor slouched. Relax your shoulders, soften your jaw, and let your hands rest gently on your lap. This physical alignment reflects the mental state we are cultivating: stable, open, and relaxed.</p>

            <h3>Finding Your Anchor Point</h3>
            <p>Direct your attention to where you feel the breath most vividly. For many, this is the cool sensation of air entering the nostrils and the warm sensation exiting. Others find greater clarity in the subtle rising and falling of the chest or abdomen. Choose one location and keep your attention anchored there. Observe the raw physical sensations \u2014 the expansion, the slight friction, the brief pause between inhale and exhale.</p>

            <h3>The Art of Returning</h3>
            <p>Within moments, your mind will wander. You may find yourself planning, daydreaming, or reliving a conversation. Do not view this as failure. The very moment you notice your mind has wandered <em>is</em> the moment of awakening \u2014 a small flash of metacognitive clarity. Smile inwardly, release the distraction without judgment, and gently guide your attention back to the breath.</p>

            <h3>Why This Simple Practice Is So Profound</h3>
            <p>Modern neuroscience confirms what meditators have known for millennia: the practice of repeatedly returning attention trains the prefrontal cortex, the brain's seat of executive function. Each return is a mental "rep," strengthening your capacity for focused attention and emotional regulation over time. Start with five minutes. The breath will always be waiting.</p>
        `
    },
    {
      id: "five_hindrances",
      unlockLevel: 1,
      category: "Foundations of Mindfulness",
      emoji: "\u{1F32B}\uFE0F",
      title: "The Five Hindrances: Knowing Your Inner Weather",
      readTime: "5 min",
      summary: "Identify the five classic mental obstacles that cloud meditation \u2014 desire, aversion, dullness, restlessness, and doubt \u2014 and how to work skillfully with each.",
      content: `
            <p>In the original Buddhist teachings, the Buddha identified five mental qualities that interrupt meditation and obscure clarity. These are called the <em>Pa\xF1ca N\u012Bvara\u1E47a</em> \u2014 the Five Hindrances. Understanding them transforms frustrating meditation sessions into rich opportunities for self-knowledge.</p>

            <h3>1. Sensual Desire (K\u0101macchanda)</h3>
            <p>This is the pull toward pleasant experiences \u2014 craving a better seat, wishing the meditation were over so you could eat, or fantasizing about someone. The antidote is to recognize the mental image or object of craving without chasing it, observing how desire itself feels as a physical sensation in the body: the tightening in the chest, the restless energy in the hands.</p>

            <h3>2. Ill-Will (Vy\u0101p\u0101da)</h3>
            <p>This encompasses irritation, aversion, frustration, or resentment \u2014 toward a sound, a memory, a person. Rather than suppressing it, observe it with curiosity: Where does anger live in the body right now? Notice the heat, the clenching. Name it silently: "there is aversion." This naming activates the prefrontal cortex and reduces the emotional charge.</p>

            <h3>3. Dullness & Drowsiness (Th\u012Bna-Middha)</h3>
            <p>A fog descends on the mind, making attention slippery and the body heavy. Antidotes include: opening the eyes slightly, breathing deeper, straightening the spine, or visualizing a brilliant white light at the center of the forehead.</p>

            <h3>4. Restlessness & Worry (Uddhacca-Kukkucca)</h3>
            <p>The mind races, jumps between thoughts, plans future conversations, or rehashes the past. This is the opposite of dullness \u2014 the mind has too much energy with nowhere to go. Grounding antidotes help: feel the weight of your body, the pressure of feet against the floor, and take several deep, slow exhalations.</p>

            <h3>5. Doubt (Vicikicch\u0101)</h3>
            <p>This is the most insidious hindrance \u2014 the questioning voice that says, "Is this even working? Maybe this tradition isn't right for me." Skillfully examine doubt: ask yourself, "What would it feel like to practice without doubt for just the next five minutes?" Then, simply return to the breath. Doubt dissolves through direct experience, not through arguments.</p>

            <h3>The Bigger Picture</h3>
            <p>The hindrances are not enemies \u2014 they are teachers. Each one is a mirror showing you a conditioned pattern of the mind. When you stop fighting them and start studying them, your mediation shifts from a battle into a laboratory.</p>
        `
    },
    {
      id: "body_scan_basics",
      unlockLevel: 2,
      category: "Foundations of Mindfulness",
      emoji: "\u{1F9E0}",
      title: "The Body Scan: Rediscovering Your Physical Home",
      readTime: "5 min",
      summary: "A systematic guide to the body scan \u2014 one of the most effective tools for developing embodied awareness, reducing stress, and releasing unconscious tension.",
      content: `
            <p>Most of us live from the neck up. Our attention is absorbed in thoughts, plans, and worries, while the body \u2014 our primary home in this world \u2014 is almost entirely ignored. The body scan is a meditation technique that systematically re-inhabits every corner of our physical being, dissolving tension and rebuilding the mind-body connection.</p>

            <h3>Why the Body Holds So Much</h3>
            <p>The somatic therapist Peter Levine observed that trauma and stress are stored not just in memory but in patterns of chronic muscular holding. Even without trauma, daily emotional suppression \u2014 the frustration you didn't express, the anxiety you pushed down \u2014 accumulates in the body as micropatterns of tension. The body scan allows these to surface safely and release.</p>

            <h3>The Basic Practice</h3>
            <p>Lie flat or sit comfortably. Begin by placing attention at the crown of your head. Scan slowly, region by region, moving downward through the face, jaw, neck, shoulders, upper arms, forearms, hands, chest, upper back, belly, lower back, hips, thighs, calves, feet, and finally the toes.</p>
            <p>At each region, pause and <em>feel</em> \u2014 not think. Notice: Is there warmth or coolness? Tingling or numbness? Tension or ease? You are not trying to change anything. You are simply observing what is already there.</p>

            <h3>Working with Difficult Areas</h3>
            <p>If you arrive at a region that holds pain, tightness, or strong emotion, slow down. Breathe into that area \u2014 imagine the inhalation flowing directly into the tension. On the exhalation, let the area soften slightly. Do not force relaxation; simply invite it. After several breaths, continue moving through the body.</p>

            <h3>Physiological Benefits</h3>
            <p>Studies at the MBSR (Mindfulness-Based Stress Reduction) program at the University of Massachusetts show that regular body scan practice reduces cortisol levels, improves sleep quality, reduces chronic pain perception, and increases interoceptive awareness \u2014 the ability to accurately sense one's own internal bodily states, which is closely linked to emotional intelligence.</p>
        `
    },
    {
      id: "overcome_dullness",
      unlockLevel: 2,
      category: "Foundations of Mindfulness",
      emoji: "\u2600\uFE0F",
      title: "Navigating Mental Dullness: Restoring Alert Clarity",
      readTime: "4 min",
      summary: "Learn to identify the spectrum of dullness in meditation and apply targeted antidotes to restore sharp, luminous awareness.",
      content: `
            <p>As your meditation practice stabilizes, you will encounter a subtle but persistent obstacle: dullness. When the mind stops wandering outward, it often collapses inward into a sleepy fog. You enter a warm, pleasant, but murky state. This is dullness, and if left unchecked, it stalls progress by replacing alert clarity with mental haze.</p>

            <h3>Recognizing the Spectrum</h3>
            <p>Dullness exists on a gradient. In its <strong>subtle form</strong>, awareness is continuous but lacks sharpness \u2014 the breath feels distant, details lose definition. In its <strong>strong form</strong>, thoughts become disjointed, concentration slips, and you may not notice the breath for extended periods. In <strong>gross dullness</strong>, you effectively fall asleep with eyes open.</p>
            <p>Mindfulness requires two qualities: <em>stability</em> (remaining on the object) and <em>vividness</em> (crystal-clear awareness). Dullness destroys vividness while leaving a shallow semblance of stability.</p>

            <h3>Active Antidotes</h3>
            <p>When dullness sinks in, apply these progressive correctives:</p>
            <ul>
                <li><strong>Intention sharpening:</strong> Internally commit to observing the <em>finest</em> sensations of the breath \u2014 the exact moment inhalation ends, the microscopic sensations at the very tip of the nostrils.</li>
                <li><strong>Open-eyed posture:</strong> Lift your gaze slightly, open your eyes to a 20% squint, and let more light in.</li>
                <li><strong>Deep breathing:</strong> Take three forceful inhalations and complete exhalations to oxygenate the brain.</li>
                <li><strong>Body tensing:</strong> On an inhale, tense every muscle fully for 5 seconds, then release completely on the exhale.</li>
                <li><strong>Counting:</strong> Pair each breath with a mental count from 1\u201310 to add a mild cognitive load that keeps the mind engaged.</li>
            </ul>

            <h3>Prevention: Practice Timing</h3>
            <p>Dullness is more prevalent after meals, in warm rooms, and in the early afternoon. If possible, schedule demanding meditation sessions in the morning on an empty stomach, when the nervous system is naturally alert. Short, frequent sessions also combat dullness more effectively than long, irregular ones.</p>
        `
    },
    // ─── INSIGHT PRACTICE ─────────────────────────────────────────────────────
    {
      id: "anicca_flow",
      unlockLevel: 3,
      category: "Insight Practice",
      emoji: "\u{1F30A}",
      title: "Anicca: Experiencing the River of Change",
      readTime: "5 min",
      summary: "Deepen body scanning by recognizing that all sensations are fleeting currents of energy, dissolving the illusion of a fixed, solid self.",
      content: `
            <p>In the Vipassana tradition, we move beyond anchoring attention to directly investigating the nature of reality itself. The primary insight we are invited to encounter is <em>Anicca</em> \u2014 impermanence. Nothing in our physical or mental landscape is static; everything is a flowing stream of arising and passing phenomena.</p>

            <h3>The Microscope of Awareness</h3>
            <p>Begin by scanning your body as usual. But now, rather than accepting your habitual labels ("knee pain," "stiff shoulder"), zoom in closer. When you arrive at a sensation, ask: what exactly is here? Not the concept of pain \u2014 but its actual texture. Is it heat? Pressure? A high-frequency vibration? Notice that what you thought was a solid block of sensation actually dissolves, on closer inspection, into a pulsing cloud of smaller events.</p>

            <h3>The Dissolution of the Solid Body</h3>
            <p>As concentration deepens over weeks and months, meditators report that the body begins to feel less like a solid object and more like a field of electrical tingling, or a column of warm light. This is not imagination \u2014 it is the direct experience of what physicists describe as mostly empty space organized by electromagnetic forces. The solidity we experience is a mental construction, not an objective feature of reality.</p>

            <h3>Arising and Passing</h3>
            <p>Sit for twenty minutes observing one prominent sensation. Notice how it is <em>never exactly the same</em> from moment to moment. It has waves of intensity. It shifts location slightly. It has a mood or quality that changes. Eventually, it will fade entirely. This is impermanence operating in real time, in your own body.</p>

            <h3>Freedom Through Impermanence</h3>
            <p>This insight might seem abstract, but its practical consequence is radical: if all sensations are impermanent, there is nothing to cling to and nothing to run from. Even the most intense anxiety or physical pain, observed without resistance, is revealed to be a passing river \u2014 not a permanent state. This recognition is the first major doorway to liberation in the Therav\u0101da tradition.</p>
        `
    },
    {
      id: "equanimity_discomfort",
      unlockLevel: 5,
      category: "Insight Practice",
      emoji: "\u2696\uFE0F",
      title: "Equanimity: The Quiet Harbor of Non-Reaction",
      readTime: "5 min",
      summary: "Develop deep psychological stability by decoupling raw sensations from mental resistance \u2014 the heart of suffering-free awareness.",
      content: `
            <p>Equanimity is often misunderstood as indifference or detachment. In meditation, it refers to something far richer: the capacity to remain mentally balanced and undisturbed in the presence of whatever arises \u2014 whether pleasant, painful, or neutral.</p>

            <h3>The Suffering Equation</h3>
            <p>In meditation, we encounter a liberating equation: <strong>Suffering = Pain \xD7 Resistance</strong>. Physical pain is one component \u2014 the sensation itself. But <em>suffering</em> is produced by the mental reaction: the frustration that the pain is there, the worry it will worsen, the craving for it to stop. While we cannot always avoid pain, we can eliminate resistance through equanimity \u2014 reducing suffering to near zero.</p>

            <h3>Welcoming the Storm</h3>
            <p>When intense discomfort arises during a sit, try this: instead of escaping it, make it your primary meditation object. Relax the muscles around the uncomfortable area. Soften your breath. Imagine your awareness is a boundless sky, and the discomfort is simply a passing weather formation. Ask: does this sensation have a center? Does it have borders? Does it pulse, heat, vibrate?</p>

            <h3>Pleasantness Without Grasping</h3>
            <p>Equanimity also means not clinging to pleasant states. When meditation brings bliss, calm, or joy \u2014 notice the natural tendency to grasp it, to make it last. The skilled practitioner witnesses even these positive states with the same balance: "This too is pleasant, and this too will pass."</p>

            <h3>Equanimity in Daily Life</h3>
            <p>As this quality matures on the cushion, it permeates daily experience. When plans fall through, someone speaks harshly, or the unexpected occurs, you will notice the initial wave of reactivity \u2014 and then a spaciousness that was not there before. From that spacious harbor, you begin to choose responses instead of simply executing reactions.</p>
        `
    },
    {
      id: "anatta_self",
      unlockLevel: 5,
      category: "Insight Practice",
      emoji: "\u{1F50D}",
      title: "Anatt\u0101: The Mystery of No-Self",
      readTime: "6 min",
      summary: "Investigate the most radical insight of the Buddhist path \u2014 that what we call 'I' is a process rather than a fixed entity.",
      content: `
            <p>Of the three marks of existence in Buddhist philosophy \u2014 impermanence, suffering, and no-self \u2014 <em>anatt\u0101</em> (no-self) is the most counterintuitive and transformative. It does not mean that you don't exist; it means that what you call "self" is a dynamic process, not a fixed, independent entity.</p>

            <h3>The Chariot Analogy</h3>
            <p>The Buddhist monk N\u0101gasena explained anatt\u0101 beautifully to King Milinda: "Is this chariot the wheel? No. Is it the axle? No. Is it the frame? No. Then where is the chariot?" The chariot is a conventional label applied to a particular arrangement of parts. It has no independent, permanent existence beyond those parts. In the same way, "self" is a conventional label applied to a particular arrangement of body, feelings, perceptions, mental formations, and consciousness.</p>

            <h3>The Self as Process</h3>
            <p>In meditation, as you watch thoughts arise, you may notice: you did not choose that thought. It appeared. You are more like the space in which mental events occur than the author of those events. The thought-stream, the emotional waves, the sensory impressions \u2014 they all arise due to conditions, not due to a central controller.</p>

            <h3>Investigating "Who Is Aware?"</h3>
            <p>When you notice a thought, there is awareness of that thought. Now look for the one who is aware. Investigate directly: is there a "looker" behind awareness? Many meditators report that when this question is investigated honestly, the sense of a fixed self dissolves into a vast, open field of cognition \u2014 what the Tibetan tradition calls "rigpa" (intrinsic awareness).</p>

            <h3>Liberation, Not Nihilism</h3>
            <p>Anatt\u0101 is frequently misunderstood as nihilism. But the historical Buddha explicitly rejected both the extreme of an eternal self and the extreme of absolute non-existence. What he pointed to was a middle way: there is this body, these thoughts, these feelings \u2014 arising and passing as part of an ongoing river. The burden of defending, maintaining, and glorifying a fixed self lifts, and with it, a profound lightness emerges.</p>
        `
    },
    {
      id: "dependent_origination",
      unlockLevel: 7,
      category: "Insight Practice",
      emoji: "\u{1F517}",
      title: "Dependent Origination: The Web of Becoming",
      readTime: "6 min",
      summary: "Explore the Buddha's map of how suffering arises and ceases through twelve interdependent links \u2014 a profound diagnostic of the human condition.",
      content: `
            <p>Dependent Origination \u2014 <em>Paticca-samupp\u0101da</em> \u2014 is considered by many scholars to be the Buddha's most distinctive and sophisticated philosophical contribution. It maps, in precise causal chains, how suffering arises and how it ceases. Understanding this map transforms meditation from a relaxation technique into a systematic path of liberation.</p>

            <h3>The Twelve Links</h3>
            <p>The chain begins with <strong>ignorance</strong> (not knowing the true nature of reality), which conditions <strong>volitional formations</strong> (karmic impulses), which condition <strong>consciousness</strong>, then <strong>mind-and-body</strong>, the six sense bases, <strong>contact</strong>, <strong>feeling-tone</strong> (pleasant/unpleasant/neutral), <strong>craving</strong>, <strong>clinging</strong>, <strong>becoming</strong>, <strong>birth</strong>, and finally <strong>suffering</strong> (aging, death, grief).</p>

            <h3>The Crucial Pivot: Feeling-Tone</h3>
            <p>Practitioners find the most actionable insight in the link between <em>vedan\u0101</em> (feeling-tone) and <em>craving</em>. Every single moment of experience carries a tonal quality: pleasant, unpleasant, or neutral. Normally, we automatically react \u2014 grasping toward pleasant, pushing away unpleasant. This reflexive reaction is the engine of suffering. Meditation trains us to insert a moment of awareness at this pivot point: to <em>feel</em> a pleasant tone without automatically grasping for more; to feel an unpleasant tone without automatically pushing it away.</p>

            <h3>Breaking the Chain</h3>
            <p>When awareness interrupts the automatic movement from vedan\u0101 to craving, the entire downstream cascade \u2014 clinging, becoming, suffering \u2014 has no fuel. This is not intellectual understanding; it is a shift in the actual mechanics of how the mind processes experience, available to be felt directly in meditation.</p>

            <h3>The Chain Running Backward: Cessation</h3>
            <p>The Buddha also taught the chain of cessation: when ignorance ceases, formations cease; when formations cease, consciousness of a grasping kind ceases \u2014 all the way down the chain to the cessation of suffering. This is Nibb\u0101na \u2014 not a heavenly realm, but the extinguishing of the fires of craving and aversion.</p>
        `
    },
    // ─── ZEN TRADITION ────────────────────────────────────────────────────────
    {
      id: "shikantaza_zen",
      unlockLevel: 3,
      category: "Zen Tradition",
      emoji: "\u{1F3D4}\uFE0F",
      title: "Shikantaza: Resting in the Ocean of Awareness",
      readTime: "5 min",
      summary: "Explore the Zen practice of 'just sitting' \u2014 releasing all focus, techniques, and goals to rest in pure, choiceless awareness.",
      content: `
            <p>In the S\u014Dt\u014D school of Zen, there is a practice called <em>Shikantaza</em> \u2014 literally, "just sitting." Unlike technique-based approaches that instruct you to focus on the breath or scan the body, Shikantaza involves dropping all techniques, objects, and agendas. You sit not to become calm, not to gain insight, and not to achieve enlightenment \u2014 you simply sit.</p>

            <h3>Choiceless Awareness</h3>
            <p>Let your awareness open like the sky. Do not narrow it onto any single object. If a bird chirps outside, let the sound arise in awareness and pass. If a memory surfaces, let it float by like a cloud reflected in still water. If the breath deepens, let it deepen. You are not trying to change or control anything \u2014 you are simply the spacious, luminous mirror that reflects whatever is present.</p>

            <h3>Dropping the Meditator</h3>
            <p>The great challenge of "just sitting" is our deeply conditioned habit of wanting to <em>do</em> something. We want to meditate "well." In Shikantaza, the Japanese Zen master D\u014Dgen instructed us to drop even the identity of the meditator. There is no one sitting \u2014 there is only sitting itself. Thoughts arise in awareness and pass, but they belong to no one.</p>

            <h3>Sitting as the Mountain</h3>
            <p>Sit like a majestic mountain. Clouds gather and disperse around the peak, winds blow, and seasons shift across the landscape, but the mountain remains unmoved \u2014 simply present, witnessing the play of phenomena. In the same way, rest in your natural state of open, luminous presence, realizing that you are already complete, exactly as you are.</p>

            <h3>The Paradox of Effort</h3>
            <p>Shikantaza requires a refined effort: the effort not to effortfully meditate. Master K\u014Dd\u014D Sawaki called it "the most difficult thing in the world, and also the simplest." If you find yourself trying hard to let go, you are not in Shikantaza \u2014 you are in the trying. Gently notice this, and relax the effort. Rest in what is already here.</p>
        `
    },
    {
      id: "koans_gateway",
      unlockLevel: 5,
      category: "Zen Tradition",
      emoji: "\u2753",
      title: "Koans: Questions That Cannot Be Answered by Thinking",
      readTime: "5 min",
      summary: "Understand the purpose and mechanics of koan practice \u2014 how paradoxical riddles are used to exhaust conceptual thought and reveal direct knowing.",
      content: `
            <p>Among the most misunderstood innovations of the Rinzai Zen tradition are <em>koans</em> \u2014 enigmatic riddles or exchanges that seem to defy rational analysis. "What is the sound of one hand clapping?" "What was your original face before your parents were born?" These are not trick questions with clever answers. They are tools designed to drive the conceptual mind to its absolute limit, and beyond.</p>

            <h3>The Purpose of Paradox</h3>
            <p>The rational, analytical mind is extraordinarily powerful \u2014 but it operates by categorizing, dividing, and labeling. It cannot grasp what is prior to categories. A koan is an invitation to leap beyond the thinking mind entirely, into direct, non-conceptual knowing. The great 13th-century Zen master Wumen said: "The koan is the gateless barrier of Zen."</p>

            <h3>Working a Koan</h3>
            <p>The classical method is to hold the koan continuously in awareness during formal sitting and while going about daily activities. Rather than thinking <em>about</em> the koan, you allow it to become a living question that saturates consciousness. The inquiry "What is Mu?" \u2014 from the famous case of Zhaozhou's dog \u2014 is worked like a bellows: the question builds internal pressure until ordinary thinking collapses and a different quality of knowing opens.</p>

            <h3>The Breakthrough (Kensh\u014D)</h3>
            <p>When the koan "breaks open," the result is called <em>kensh\u014D</em> \u2014 seeing one's nature. It is not an intellectual answer, and it cannot be adequately described. Experienced Zen teachers test kensh\u014D not by asking for a verbal explanation but by presenting the student with further probing challenges. The breakthrough is validated through spontaneous, appropriately absurd, or embodied responses that demonstrate experiential understanding.</p>

            <h3>Koans in Daily Practice</h3>
            <p>You need not enter formal koan training to benefit from this spirit. You can hold simple questions in daily awareness: "Who is walking?" "Who is eating?" These questions, held lightly, can thin the membrane between conceptual and direct experience in ordinary moments.</p>
        `
    },
    {
      id: "beginner_mind",
      unlockLevel: 1,
      category: "Zen Tradition",
      emoji: "\u{1F331}",
      title: "Beginner's Mind: The Fullness of Not-Knowing",
      readTime: "3 min",
      summary: "Shunry\u016B Suzuki's foundational teaching that the most fruitful posture toward life and practice is radical openness to every moment as if for the first time.",
      content: `
            <p>"In the beginner's mind there are many possibilities, but in the expert's mind there are few." \u2014 Shunry\u016B Suzuki, <em>Zen Mind, Beginner's Mind</em></p>

            <h3>The Expert's Trap</h3>
            <p>As we develop any skill \u2014 including meditation \u2014 we accumulate frameworks, preferences, and conclusions. "I know how this kind of session goes." "This is what this sensation means." These accumulated judgments, while sometimes useful, are also the very mechanisms that prevent us from seeing what is freshly, actually here. The expert mind perceives through a filter of prior knowledge. The beginner's mind sees directly.</p>

            <h3>Beginner's Mind is Not Ignorance</h3>
            <p>Suzuki Roshi was not praising incompetence. He was pointing to a quality of <em>openness and curiosity</em> that transcends both expertise and ignorance. The experienced meditator with beginner's mind brings years of technical knowledge to the seat, while approaching each breath as if for the first time. This combination \u2014 competence without rigidity \u2014 is the mark of genuine maturity.</p>

            <h3>Practicing Freshness</h3>
            <p>At the beginning of each sit, take a moment to consciously set aside your conclusions about what this session will be like. Meet the first breath as if you have never breathed before. When an experience feels familiar, look for what is actually new about it right now. What texture does this particular moment of breath have that no other moment has ever had?</p>

            <h3>The Rewards of Not-Knowing</h3>
            <p>Practitioners who cultivate beginner's mind report that their meditations feel genuinely fresh even after years of daily practice. Boredom \u2014 which is always the mind's commentary about a moment rather than the moment itself \u2014 rarely arises. Every sit becomes an adventure into undiscovered territory.</p>
        `
    },
    // ─── LOVING-KINDNESS & COMPASSION ─────────────────────────────────────────
    {
      id: "metta_intro",
      unlockLevel: 2,
      category: "Loving-Kindness & Compassion",
      emoji: "\u{1F49A}",
      title: "Mett\u0101: The Radical Practice of Unlimited Goodwill",
      readTime: "5 min",
      summary: "Learn the ancient practice of Loving-Kindness meditation \u2014 generating heartfelt goodwill systematically toward yourself and all beings.",
      content: `
            <p><em>Mett\u0101</em> \u2014 the P\u0101li word for loving-kindness or goodwill \u2014 is one of the four Brahmaviharas (Divine Abodes), a set of contemplative practices designed to cultivate vast, unconditional positive states of mind. Where insight practices like Vipassana investigate the nature of experience, Mett\u0101 actively cultivates the quality of the heart.</p>

            <h3>The Basic Method</h3>
            <p>Begin by settling into meditation posture and becoming aware of the body and breath. Then, bring to mind a genuine wish for your own wellbeing \u2014 not as something you feel obligated to say, but as a real aspiration. Silently or mentally repeat phrases such as:</p>
            <ul>
                <li>May I be safe.</li>
                <li>May I be healthy.</li>
                <li>May I be happy.</li>
                <li>May I live with ease.</li>
            </ul>
            <p>Allow these words to be felt rather than merely thought. If you notice resistance \u2014 "I don't deserve this" \u2014 observe that reaction with curiosity, and gently return to the phrases.</p>

            <h3>Expanding the Circle</h3>
            <p>After five to ten minutes with yourself, gradually expand the circle of goodwill. Move to someone you love easily (a close friend, a pet), then a neutral person (a neighbor you don't know well), then a difficult person, and finally to all beings everywhere \u2014 in all directions, in all states of existence.</p>

            <h3>Neuroscience of Loving-Kindness</h3>
            <p>Research led by Dr. Richard Davidson at the University of Wisconsin found that long-term Mett\u0101 practitioners showed significantly greater activity in the brain's left prefrontal cortex \u2014 a region associated with positive affect and resilience \u2014 compared to controls. Even eight weeks of brief daily Mett\u0101 practice produced measurable changes in grey matter in compassion-related brain regions.</p>

            <h3>Mett\u0101 and Insight</h3>
            <p>The Buddha taught that Mett\u0101 is not merely a feel-good practice \u2014 it is a direct path to liberation. When the heart is fully open with goodwill for all beings without exception, the mechanisms of self-contraction and othering that generate suffering lose their grip. The boundless heart is, itself, a form of freedom.</p>
        `
    },
    {
      id: "compassion_karuna",
      unlockLevel: 3,
      category: "Loving-Kindness & Compassion",
      emoji: "\u{1F90D}",
      title: "Karu\u1E47\u0101: The Trembling of the Heart Before Suffering",
      readTime: "4 min",
      summary: "Understand compassion as an active, intelligent response to suffering \u2014 neither sentimental nor overwhelmed, but grounded and open.",
      content: `
            <p>Compassion \u2014 <em>karu\u1E47\u0101</em> in P\u0101li \u2014 is often mistaken for pity or sadness. In the contemplative tradition, it is something far more powerful: the capacity to be fully present with suffering \u2014 your own and others' \u2014 without being swept away by it, and with the genuine wish that suffering be relieved.</p>

            <h3>The Difference Between Empathy and Compassion</h3>
            <p>Research by neuroscientist Tania Singer distinguishes between <em>empathic distress</em> (feeling another's pain as your own, leading to burnout) and <em>compassion</em> (a warm, outward-oriented concern for the other). The difference is physiological: empathic distress activates the brain's pain matrix; compassion activates reward and affiliation circuits. Crucially, compassion is more sustainable \u2014 it strengthens rather than depletes the caregiver.</p>

            <h3>The Karu\u1E47\u0101 Practice</h3>
            <p>Bring to mind someone who is suffering \u2014 perhaps a person you know who is going through difficulty. Feel their situation in your body. Notice if your heart "trembles" \u2014 this responsive quality is the seed of karu\u1E47\u0101. Then, silently offer:</p>
            <ul>
                <li>May you be free from suffering.</li>
                <li>May you be free from inner pain.</li>
                <li>May you find peace.</li>
            </ul>
            <p>If what arises feels overwhelming, you can first apply these phrases to yourself, ensuring your own ground is stable before extending to others.</p>

            <h3>Equanimity as the Ground</h3>
            <p>True compassion requires the stability of equanimity beneath it. Without equanimity, compassion collapses into overwhelm. With equanimity, you can face the most intense suffering \u2014 your own or another's \u2014 and remain a clear, stable, effective presence. This is the combination that defines the Bodhisattva ideal in Mah\u0101y\u0101na Buddhism: boundless compassion, grounded in unshakeable clarity.</p>
        `
    },
    {
      id: "tonglen_practice",
      unlockLevel: 7,
      category: "Loving-Kindness & Compassion",
      emoji: "\u{1F300}",
      title: "Tonglen: Breathing In Darkness, Breathing Out Light",
      readTime: "5 min",
      summary: "Discover the Tibetan Buddhist practice of giving and receiving \u2014 a radical reversal of self-protective instinct that turns suffering into compassionate action.",
      content: `
            <p>Tonglen \u2014 "sending and receiving" in Tibetan \u2014 is among the most counterintuitive and powerful practices in the entire contemplative canon. Where every instinct tells us to push suffering away and pull pleasantness in, Tonglen deliberately reverses this: on the inhalation, we breathe in suffering, pain, and darkness; on the exhalation, we breathe out relief, spaciousness, and light.</p>

            <h3>Why Reverse the Instinct?</h3>
            <p>Pema Ch\xF6dr\xF6n, who brought this practice to the West, explains that the constant project of avoiding pain and securing pleasure is itself the root of our suffering. By willingly breathing in what we most fear \u2014 difficulty, pain, uncertainty \u2014 we break the habitual contraction of self-protection and discover the spaciousness that was always available beneath it.</p>

            <h3>The Four Stages of Practice</h3>
            <p><strong>Stage 1 \u2014 Resting in openness:</strong> Begin by briefly resting in a flash of open, spacious awareness. Just open, before concepts.</p>
            <p><strong>Stage 2 \u2014 Working with texture:</strong> Breathe in a sense of heaviness, darkness, and heat. Breathe out coolness, lightness, and space. Get the feeling of this in your body.</p>
            <p><strong>Stage 3 \u2014 A specific person:</strong> Call to mind someone who is suffering. On the inhalation, draw their pain into your heart. On the exhalation, send them relief, ease, love.</p>
            <p><strong>Stage 4 \u2014 All beings:</strong> Expand to all beings in a similar situation \u2014 all those experiencing this kind of suffering. Breathe in their pain collectively; breathe out wellbeing to all of them.</p>

            <h3>The Paradox of Transformation</h3>
            <p>Practitioners report that contrary to expectation, Tonglen does not produce depression or heaviness. Because the suffering is not held or suppressed but breathed through, it transforms \u2014 like fuel being consumed in a furnace. The heart grows larger, not heavier. Suffering becomes the very vehicle of compassion's development.</p>
        `
    },
    // ─── MIND & NEUROSCIENCE ──────────────────────────────────────────────────
    {
      id: "default_mode_network",
      unlockLevel: 3,
      category: "Mind & Neuroscience",
      emoji: "\u{1F52C}",
      title: "The Wandering Mind: Default Mode Network & Self-Referential Thought",
      readTime: "5 min",
      summary: "Discover the neuroscience behind mind-wandering, why the brain has a 'default mode,' and how meditation systematically reshapes these circuits.",
      content: `
            <p>In 2001, neurologist Marcus Raichle and his colleagues made a striking discovery: large swaths of the brain become <em>more</em> active when people are at rest and not engaged in a task. They named this the Default Mode Network (DMN). What is the brain doing when it is "at rest"? It is thinking about itself \u2014 planning the future, ruminating on the past, and evaluating the social world. It is, in a word, daydreaming.</p>

            <h3>The Cost of Mind-Wandering</h3>
            <p>Harvard psychologists Matthew Killingsworth and Daniel Gilbert conducted a landmark study by texting participants at random moments and asking what they were doing, what they were thinking, and how they were feeling. Result: people spent nearly 47% of waking hours thinking about something other than what they were actually doing. And \u2014 crucially \u2014 a wandering mind was a reliably unhappy mind, regardless of the activity being interrupted.</p>

            <h3>Meditation's Effect on the DMN</h3>
            <p>Neuroimaging studies comparing experienced meditators with novices show a striking pattern: meditators have significantly reduced activity in the DMN during both meditation and rest. More importantly, when the DMN does activate in meditators \u2014 when their mind does wander \u2014 the brain regions responsible for noticing this (the dorsal attention network and anterior insula) engage more rapidly, enabling a faster "snap back" to present awareness.</p>

            <h3>The Practical Implication</h3>
            <p>Meditation is, in a very literal sense, training the brain to spend less time in self-referential narrative and more time in direct present-moment experience. This shift is associated with reduced rumination (linked to depression), improved emotional regulation, and greater subjective wellbeing. The sitting practice is the training ground; life is the arena where the training is applied.</p>
        `
    },
    {
      id: "neuroplasticity_meditation",
      unlockLevel: 5,
      category: "Mind & Neuroscience",
      emoji: "\u{1F9EC}",
      title: "Neuroplasticity: How Meditation Literally Reshapes the Brain",
      readTime: "5 min",
      summary: "Explore the scientific evidence that meditation produces measurable structural and functional changes in the brain \u2014 and what this means for your practice.",
      content: `
            <p>For most of the 20th century, neuroscience held that the brain's architecture was essentially fixed by early adulthood. Santiago Ram\xF3n y Cajal, the father of modern neuroscience, wrote in 1913 that adult neurons are "fixed, immutable; nothing may be regenerated." We now know this is profoundly wrong. The brain is plastic throughout life \u2014 and meditation is one of the most potent reshaping forces available.</p>

            <h3>The Harvard Studies</h3>
            <p>Neuroscientist Sara Lazar at Harvard Medical School found that meditators had significantly greater cortical thickness in regions including the prefrontal cortex and the right anterior insula \u2014 areas involved in attention, interoception, and sensory processing. The effect was most pronounced in older participants, suggesting meditation may slow age-related cortical thinning.</p>

            <h3>Eight Weeks to a Changed Brain</h3>
            <p>A landmark study by Britta H\xF6lzel and colleagues (published in Psychiatry Research: Neuroimaging, 2011) found that just eight weeks of MBSR practice produced measurable increases in grey matter density in the hippocampus (learning and memory), the posterior cingulate cortex (self-relevance), the cerebellum (coordination), and the temporoparietal junction (compassion and perspective-taking). The amygdala \u2014 the brain's threat-detection center \u2014 showed decreased grey matter density, correlating with reduced stress.</p>

            <h3>Long-Term Transformations</h3>
            <p>In experienced meditators with tens of thousands of hours of practice, changes are even more dramatic. Richard Davidson's studies of expert meditators \u2014 including Tibetan monks \u2014 found gamma-wave synchrony of extraordinary amplitude and duration during compassion meditation. Davidson concluded these individuals had fundamentally restructured the affective circuitry of their brains.</p>

            <h3>What This Means for You</h3>
            <p>Every time you sit and return your attention to the present moment, you are not just having a nice experience \u2014 you are participating in the literal, physical restructuring of your nervous system. The brain changes you are making today will compound over months and years into a genuinely different quality of mind.</p>
        `
    },
    {
      id: "stress_response",
      unlockLevel: 2,
      category: "Mind & Neuroscience",
      emoji: "\u{1F4A1}",
      title: "The Stress Response: Biology, Suffering & the Relaxation Antidote",
      readTime: "4 min",
      summary: "Understand how the body's stress response system works, why it causes so much modern suffering, and how meditation directly interrupts it.",
      content: `
            <p>The stress response was designed for a world of brief, physical dangers: a predator, a fight, a fall. Cortisol and adrenaline flood the body, heart rate spikes, muscles tense, blood flow prioritizes large muscles over digestive organs, and the prefrontal cortex (reasoning) partially cedes control to the amygdala (threat detection). This "fight-or-flight" response is extraordinarily effective for short-term survival.</p>

            <h3>The Modern Mismatch</h3>
            <p>The problem is that our nervous system cannot distinguish between a tiger and an angry email. It responds to both with the same physiological cascade. And while a tiger threat resolves in minutes, an email thread can keep the stress response activated for days. Chronic activation of the stress system leads to elevated inflammatory markers, impaired immune function, cardiovascular damage, impaired memory formation, and heightened anxiety and depression.</p>

            <h3>The Relaxation Response</h3>
            <p>Harvard cardiologist Herbert Benson coined the term "relaxation response" in 1975 to describe the physiological state induced by meditation and related practices \u2014 the functional opposite of the stress response. Characteristic features include: decreased heart rate and blood pressure, reduced cortisol and adrenaline, increased activity in the parasympathetic nervous system, and reduced oxygen consumption.</p>

            <h3>Meditation as a Physiological Reset</h3>
            <p>Each meditation session \u2014 as short as ten minutes \u2014 provides a measurable relaxation response. Over time, regular practice appears to lower the "set point" of the stress system, making individuals less reactive to stressors and quicker to recover when stress does occur. This is measurable in reduced baseline cortisol, lower resting heart rate variability, and improved immune markers.</p>
        `
    },
    // ─── CONTEMPLATIVE PHILOSOPHY ─────────────────────────────────────────────
    {
      id: "stoic_mindfulness",
      unlockLevel: 4,
      category: "Contemplative Philosophy",
      emoji: "\u{1F3DB}\uFE0F",
      title: "Stoic Mindfulness: The Discipline of Attention in Ancient Rome",
      readTime: "5 min",
      summary: "Discover how Stoic philosophers like Marcus Aurelius and Epictetus cultivated present-moment awareness centuries before the word 'mindfulness' existed.",
      content: `
            <p>The Stoic philosophical tradition, flourishing from Athens to Rome between 300 BCE and 200 CE, developed a sophisticated practice of mental training that bears striking resemblance to modern mindfulness. Though separated by culture and language, the Stoics arrived at many of the same insights as the Buddhist contemplative tradition.</p>

            <h3>The Dichotomy of Control</h3>
            <p>Epictetus opened his <em>Enchiridion</em> with the foundational Stoic principle: "Some things are in our control and others not." In our control are our judgments, desires, and responses. Not in our control are circumstances, other people's actions, and the body's condition. This division \u2014 and the discipline of attending only to what is in our control \u2014 is functionally equivalent to the meditation practice of distinguishing between raw sensations (what is here) and our mental stories about them (what we add).</p>

            <h3>Marcus Aurelius: The Meditating Emperor</h3>
            <p>The emperor Marcus Aurelius wrote his famous <em>Meditations</em> as a private journal \u2014 a daily practice of Stoic self-examination. He consistently returned to the same themes: the impermanence of all things, the value of present attention, the folly of distraction, and the importance of equanimity. "You have power over your mind, not outside events. Realize this, and you will find strength."</p>

            <h3>The Practice of Negative Visualization (Premeditatio Malorum)</h3>
            <p>The Stoics practiced deliberate contemplation of potential adversity \u2014 not to induce anxiety, but to cultivate non-attachment and gratitude. By vividly imagining the loss of what you love, you deepen appreciation for its current presence. This practice \u2014 <em>premeditatio malorum</em> \u2014 has modern parallels in meditations on impermanence and death-awareness traditions in both Buddhism and Tibetan practice.</p>

            <h3>Living According to Nature</h3>
            <p>Stoics held that the highest good was living "according to nature" \u2014 meaning in accordance with one's rational nature and the rational order of the cosmos. This produces what they called <em>eudaimonia</em> \u2014 flourishing, or deep wellbeing \u2014 which is neither pleasure nor the absence of pain, but the expression of one's highest virtues in full engagement with life.</p>
        `
    },
    {
      id: "taoist_flow",
      unlockLevel: 4,
      category: "Contemplative Philosophy",
      emoji: "\u262F\uFE0F",
      title: "Tao & Wu Wei: The Art of Effortless Action",
      readTime: "4 min",
      summary: "Understand the Taoist concepts of the Tao (the Way) and wu wei (effortless action) \u2014 and how they offer a profound orientation to both meditation and daily life.",
      content: `
            <p>The Tao Te Ching, attributed to Laozi (6th century BCE), opens: "The Tao that can be spoken is not the eternal Tao." This radical opening acknowledges what the entire text explores: reality, at its deepest level, cannot be captured by concepts. It can only be participated in. This is the Tao \u2014 the Way, the ground of all being.</p>

            <h3>Wu Wei: Non-Forcing</h3>
            <p><em>Wu wei</em> is often translated as "non-action," but more accurately means "non-forcing" or "action that is aligned with the natural flow of things." Water is the Taoist symbol par excellence: it does not force its way around obstacles \u2014 it flows naturally around them, finding the path of least resistance, and yet over time it carves canyons through stone. Wu wei is this quality of effortless, intelligent, non-coercive responsiveness.</p>

            <h3>Wu Wei in Meditation</h3>
            <p>The quality of wu wei is exactly what skilled meditators learn to cultivate on the cushion. The frustrated effort to "make the mind quiet" is the opposite of wu wei \u2014 it is the very grasping that produces turbulence. When we allow the mind to be as it is \u2014 including its movement \u2014 and simply witness without coercion, a natural settling often occurs that forcing never achieves.</p>

            <h3>Te: Virtue as Natural Expression</h3>
            <p>The second great concept of Taoism is <em>Te</em> (virtue, power, or expression). While the Tao is the universal ground, Te is the unique expression of that ground through each individual being. A tree expresses its Te by growing fully and uniquely as the particular tree it is. In the same way, a human being's highest aspiration is to live in such alignment with the Tao that their actions flow naturally from their deepest nature \u2014 neither self-conscious nor mechanical, but spontaneously appropriate.</p>
        `
    },
    {
      id: "advaita_nonduality",
      unlockLevel: 7,
      category: "Contemplative Philosophy",
      emoji: "\u2728",
      title: "Advaita Ved\u0101nta: The Nondual Recognition of Being",
      readTime: "6 min",
      summary: "Explore the ancient Indian philosophy of nonduality \u2014 the recognition that awareness itself is the ground of all experience, and is never born or dies.",
      content: `
            <p>Advaita Ved\u0101nta \u2014 meaning "the teaching that reality is not-two" \u2014 is one of the most radical and influential philosophical systems in human history. Systematized by the 8th-century philosopher \u0100di Shankar\u0101ch\u0101rya, it holds that the deepest truth of human existence is identical to the deepest truth of ultimate reality.</p>

            <h3>The Core Teaching: Tat Tvam Asi</h3>
            <p>The Chandogya Upanishad contains the famous teaching of Udd\u0101laka to his son Shvetaketu: <em>Tat Tvam Asi</em> \u2014 "That thou art." The "That" refers to Brahman \u2014 the infinite, eternal ground of all existence. The "Thou" refers to \u0100tman \u2014 the individual's innermost nature. The teaching is that these are not two different things. What you most fundamentally are is the infinite awareness that pervades all things.</p>

            <h3>The Problem of Ignorance (Avidy\u0101)</h3>
            <p>If we are already the infinite, why don't we experience this? Advaita's answer is <em>avidy\u0101</em> \u2014 ignorance. Not ignorance in the sense of lacking information, but a fundamental misidentification: we take ourselves to be a limited body-mind entity rather than the awareness in which that entity appears. This misidentification is the root of all suffering.</p>

            <h3>Self-Inquiry: The Practice of Ramana Maharshi</h3>
            <p>The 20th-century sage Ramana Maharshi taught a direct method of investigation: holding the question "Who am I?" \u2014 not as intellectual inquiry, but as a pointing of awareness back toward its own source. "Whatever arises, ask 'To whom does this arise?' and the answer will always be 'To me.' Then ask, 'Who is this me?'" This recursive inquiry dissolves into the recognition that the seeker and the sought are the same.</p>

            <h3>Integration with Contemplative Practice</h3>
            <p>Whether one follows Buddhist, Taoist, Stoic, or any other contemplative path, the Advaita inquiry offers a powerful complement: rather than purifying or calming the mind to eventually achieve some future awakening, it points to what is already and always present as the very ground of this moment's awareness. The pathless path \u2014 already home.</p>
        `
    },
    // ─── ADVANCED STATES ──────────────────────────────────────────────────────
    {
      id: "jhana_introduction",
      unlockLevel: 7,
      category: "Advanced States",
      emoji: "\u{1F338}",
      title: "Jh\u0101na: The Four Absorptions of Deep Concentration",
      readTime: "7 min",
      summary: "Understand the classical map of meditative absorption \u2014 four progressive states of refined concentration described in the P\u0101li Canon.",
      content: `
            <p>The Buddha described four sequential states of meditative absorption, called <em>jh\u0101na</em> (Sanskrit: <em>dhy\u0101na</em> \u2014 the source of the word "Zen"). These are not mere relaxation; they are profoundly altered states of consciousness arising from prolonged, sustained attention, characterized by extraordinary clarity, stability, and in the earlier jh\u0101nas, intense bliss.</p>

            <h3>First Jh\u0101na: Applied and Sustained Thought with Joy</h3>
            <p>When sustained attention finally overwhelms distraction, the meditator enters the first jh\u0101na. It is characterized by <em>vitakka</em> (applied attention \u2014 the mind "touching" the meditation object) and <em>vic\u0101ra</em> (sustained attention \u2014 the mind "examining" it). Alongside these cognitive factors arise <em>p\u012Bti</em> (rapture or energetic joy \u2014 often felt as waves, tingling, or light-headedness) and <em>sukha</em> (contentment or happiness). The mind is fully collected; sensory distraction has largely ceased.</p>

            <h3>Second Jh\u0101na: Confidence, Inner Stillness</h3>
            <p>As the jh\u0101na deepens, the deliberate directing of attention to the object (vitakka and vic\u0101ra) drops away, leaving a more unified, effortless absorption. The rapture and happiness remain, now born of the stillness itself rather than the effort of collecting. There is an inner confidence and certainty \u2014 a quality the P\u0101li calls <em>sampas\u0101dana</em>.</p>

            <h3>Third Jh\u0101na: Equanimity and Equanimous Happiness</h3>
            <p>Even the rapture (p\u012Bti) fades, leaving behind a refined happiness (sukha) together with deep equanimity. The meditator is described as "one of equanimous mind who remains mindful and clearly comprehending and experiences happiness in the body." The stillness is extraordinary; the happiness is not excited but deeply peaceful.</p>

            <h3>Fourth Jh\u0101na: Pure Equanimity and Mindfulness</h3>
            <p>Even the refined happiness ceases, leaving pure equanimity and mindfulness \u2014 neither pleasure nor pain, but crystalline, mirror-like awareness. The breath may become so subtle as to be imperceptible. It is from this fourth jh\u0101na that the Buddha is said to have attained enlightenment \u2014 using it as a launching platform for the deep insight investigations that followed.</p>

            <h3>Context and Caution</h3>
            <p>Jh\u0101na states are genuine experiences available to dedicated practitioners, but they require sustained daily practice over months or years to access. They are also somewhat controversial \u2014 different teachers describe their phenomenology differently, and some Buddhist schools deprioritize them in favor of insight practice. Approach these teachings with curiosity and without grasping, as another useful map \u2014 not the territory itself.</p>
        `
    },
    {
      id: "cessation_nirodha",
      unlockLevel: 10,
      category: "Advanced States",
      emoji: "\u{1F30C}",
      title: "Nirodha-Sam\u0101patti: The Cessation of Perception and Feeling",
      readTime: "6 min",
      summary: "An advanced exploration of the highest meditative attainment in the Therav\u0101da tradition \u2014 total cessation of consciousness, and what this reveals about the nature of mind.",
      content: `
            <p>Beyond the four material jh\u0101nas lie four formless absorptions \u2014 attainments of infinite space, infinite consciousness, nothingness, and neither-perception-nor-non-perception. And beyond all of these lies a state described in the P\u0101li Canon as <em>nirodha-sam\u0101patti</em> \u2014 the cessation of perception and feeling. In this state, the meditator's mental activity ceases completely. They are alive, breathing (minimally), but for all intents and purposes, consciousness has stopped.</p>

            <h3>The Philosophical Significance</h3>
            <p>Nirodha-sam\u0101patti raises profound questions for any philosophy of mind. If consciousness can cease and then resume \u2014 and the meditator reports it as "better than any other attainment," having encountered no experiences during the cessation \u2014 what does this reveal about the relationship between consciousness and the brain? The P\u0101li tradition's answer is that nirodha demonstrates that consciousness is not the unchanging witness behind all experience; it is itself a conditioned process that can, under the right conditions, cease entirely.</p>

            <h3>What Happens During Cessation?</h3>
            <p>According to textual descriptions and practitioner reports: the meditator enters the higher jh\u0101nas progressively, continues through the formless absorptions, briefly touches neither-perception-nor-non-perception, and then \u2014 cessation. It is not sleep, not unconsciousness in the ordinary sense. It is, simply, a gap. Afterward, the meditator re-emerges through the formless absorptions and jh\u0101nas in reverse. The entire attainment may last anywhere from minutes to days in a monastic context.</p>

            <h3>Fruition States (Phala)</h3>
            <p>Western practitioners who have followed intensive insight paths (such as in the Mahasi tradition) report states called <em>phala</em> \u2014 "fruition moments" \u2014 which share features with cessation in being brief interruptions of ordinary consciousness followed by a sense of profound relief, clarity, and stillness. These are generally held to be stages along the path of liberation.</p>

            <h3>The Limits of the Map</h3>
            <p>States like nirodha are significant markers on the contemplative map, but the tradition consistently warns against making attainments an end in themselves. Enlightenment, in the fullest sense, is not a state that comes and goes \u2014 it is a permanent shift in the basic orientation of the mind, where grasping at any state, including the most sublime, has ceased.</p>
        `
    },
    {
      id: "rigpa_dzogchen",
      unlockLevel: 10,
      category: "Advanced States",
      emoji: "\u{1F48E}",
      title: "Rigpa: Naked Awareness in Dzogchen",
      readTime: "6 min",
      summary: "Explore the Tibetan Great Perfection teaching that the nature of mind is primordially pure, luminous awareness \u2014 and how this is directly introduced by a teacher.",
      content: `
            <p>Dzogchen \u2014 "the Great Perfection" \u2014 is the pinnacle teaching of the Nyingma school of Tibetan Buddhism. It is said to be the most direct and unelaborated expression of the path to liberation. Unlike gradual practices that purify the mind through progressive steps, Dzogchen points directly to what is already the case: the mind's natural state is primordially pure, self-knowing awareness, untouched by any defilement.</p>

            <h3>Rigpa: The Nature of Mind</h3>
            <p><em>Rigpa</em> \u2014 often translated as "intrinsic awareness" or "naked awareness" \u2014 is the central term of Dzogchen. It refers to the natural state of mind when it is not contracted by the movements of thought, emotion, or the sense of self. It is described as:</p>
            <ul>
                <li><strong>Empty</strong> \u2014 without inherent substance or location</li>
                <li><strong>Luminous</strong> \u2014 self-knowing, radiantly clear</li>
                <li><strong>Unobstructed</strong> \u2014 appearing without effort as compassion, creativity, and awareness</li>
            </ul>

            <h3>Marigpa: The Mistaken State</h3>
            <p>The opposite of rigpa is <em>marigpa</em> \u2014 non-recognition of one's own nature. This is not a moral failure but a simple case of mistaken identity, like failing to recognize your own reflection in a mirror. All of samsara \u2014 all the cycles of suffering \u2014 arise not from some fundamental corruption but from this basic failure of self-recognition.</p>

            <h3>The Introduction to Nature of Mind</h3>
            <p>Traditionally, rigpa cannot be arrived at through effort alone \u2014 it is directly introduced (<em>ngedon</em>) by a qualified teacher in a ceremony or moment called the "pointing-out instruction." The teacher uses various means \u2014 questions, gestures, demonstrations \u2014 to direct the student's attention to the very awareness that is aware. When the student recognizes this directly, even briefly, that recognition is the beginning of Dzogchen practice.</p>

            <h3>Practice After Recognition</h3>
            <p>Once introduced to rigpa, the practice is described as "resting in recognition" \u2014 not creating or modifying anything, but sustaining the naked clarity of awareness as the ground of all activity. Thoughts and emotions still arise, but they are recognized as the spontaneous display of rigpa itself, like reflections in a mirror that do not tarnish the mirror. Over time, this recognition becomes continuous and unshakeable \u2014 the state known as full enlightenment in the Dzogchen tradition.</p>
        `
    },
    // ─── PRACTICAL GUIDANCE ───────────────────────────────────────────────────
    {
      id: "building_habit",
      unlockLevel: 1,
      category: "Practical Guidance",
      emoji: "\u{1F4C5}",
      title: "The Architecture of a Daily Practice",
      readTime: "4 min",
      summary: "Evidence-based guidance for building a sustainable, consistent meditation habit \u2014 including time of day, environment, duration, and dealing with resistance.",
      content: `
            <p>The single most important factor in meditation is not technique, tradition, or teacher \u2014 it is consistency. A five-minute daily practice, maintained steadily for years, will produce more transformation than a powerful weekend retreat that is never followed up. Building a sustainable habit architecture is therefore the most practical wisdom a new meditator can receive.</p>

            <h3>Habit Stacking: Anchoring to Existing Routines</h3>
            <p>BJ Fogg's Tiny Habits research demonstrates that new behaviors attach most easily when anchored to existing ones. The morning coffee is a classic anchor: "After I pour my coffee, I sit for ten minutes before touching my phone." The anchor behavior triggers the new behavior without requiring fresh willpower. Common anchors: waking up, morning hygiene, after lunch, evening tea, before sleep.</p>

            <h3>The Seat: Designating a Sacred Space</h3>
            <p>Designate a consistent location and orientation for practice. Over time, the visual cue of your cushion or chair will trigger a settling response in your nervous system. Keep it minimally furnished \u2014 a cushion or firm chair, perhaps a candle or plant, whatever helps signal "this is different time." The environment becomes a conditioned cue for the meditative state.</p>

            <h3>Duration: The Minimum Effective Dose</h3>
            <p>Research suggests that even 10\u201315 minutes of daily practice produces measurable benefits. However, longer sessions \u2014 30 minutes to one hour \u2014 allow the mind to settle through its initial busy phase and enter deeper states. The recommendation: begin with whatever is genuinely achievable consistently, then gradually extend by five minutes every few weeks. Never make the minimum so high that you will skip on difficult days.</p>

            <h3>Working with Resistance</h3>
            <p>Resistance to sitting is almost universal and is no indication that meditation isn't working. In fact, the days when you most want to skip are often the days when practice is most valuable. A useful commitment: on days of strong resistance, commit only to sitting down and completing three breaths. Very often, once begun, the practice takes over. And on days when it truly doesn't \u2014 the habit of showing up is maintained.</p>
        `
    },
    {
      id: "integration_daily_life",
      unlockLevel: 3,
      category: "Practical Guidance",
      emoji: "\u{1F33F}",
      title: "Informal Practice: Carrying Mindfulness Into Daily Life",
      readTime: "4 min",
      summary: "Extend the benefits of formal meditation into everyday activities \u2014 from washing dishes to walking to difficult conversations \u2014 through informal mindfulness practices.",
      content: `
            <p>Formal meditation \u2014 sitting on a cushion for a defined period \u2014 is essential for building the capacity for mindfulness. But the ultimate aim is a quality of awareness that permeates the entire day. Informal practice bridges the cushion and the rest of life.</p>

            <h3>Single-Tasking as Mindfulness</h3>
            <p>Modern productivity culture celebrates multitasking, but neuroscience consistently shows that what we call "multitasking" is actually rapid task-switching \u2014 and it is costly in both accuracy and cognitive resources. Try this experiment: for one week, commit to doing only one thing at a time. When eating, only eat. When walking, only walk. When in conversation, only be in conversation. Notice the qualitative richness that appears when attention is undivided.</p>

            <h3>The Three Breath Pause</h3>
            <p>Thich Nhat Hanh taught the practice of the telephone bell as a mindfulness cue \u2014 every time the phone rings, take three breaths before answering. You can adapt this to any recurring life event: before a meeting, before opening email, when a child calls your name, when you reach for your phone. Three breaths is enough to interrupt automatic pilot and reestablish conscious presence.</p>

            <h3>STOP Practice</h3>
            <p>The STOP acronym is a powerful micro-practice: <strong>S</strong>top whatever you're doing. <strong>T</strong>ake a breath. <strong>O</strong>bserve what's happening in your body, thoughts, and emotions right now. <strong>P</strong>roceed with awareness. Set a random phone reminder once or twice daily as a cue to STOP. Many practitioners report that these brief interruptions gradually alter their relationship to reactivity throughout the entire day.</p>

            <h3>Difficult Conversations as Practice</h3>
            <p>Challenging interpersonal moments are among the richest opportunities for practice. When a conversation becomes heated, practice: feel your feet on the ground. Take one slow breath. Notice the physical sensations of your emotional state without immediately acting on them. Listen more than you speak. These micro-practices bring formal training into the crucible of real life \u2014 where it matters most.</p>
        `
    },
    {
      id: "working_emotions",
      unlockLevel: 4,
      category: "Practical Guidance",
      emoji: "\u{1F30A}",
      title: "Riding the Waves: Working with Strong Emotions in Meditation",
      readTime: "5 min",
      summary: "Practical guidance for meeting intense emotions \u2014 grief, anger, fear, shame \u2014 in meditation without suppressing them or being swept away.",
      content: `
            <p>Many people begin meditation expecting it to produce peace and calm, and are surprised when strong emotions arise \u2014 sometimes emotions that have been carefully avoided for years. This is not a malfunction. The quieting of mental noise allows previously suppressed feelings to surface. The question is how to work with them skillfully.</p>

            <h3>The RAIN Technique</h3>
            <p>Tara Brach popularized the RAIN practice for working with difficult emotional states:</p>
            <ul>
                <li><strong>R \u2014 Recognize:</strong> Acknowledge what is happening. "There is fear here." "Grief is arising."</li>
                <li><strong>A \u2014 Allow:</strong> Resist the impulse to fix, suppress, or analyze. Let it be as it is, for now.</li>
                <li><strong>I \u2014 Investigate:</strong> With gentle curiosity, explore the physical expression of the emotion. Where in the body? What texture, weight, temperature?</li>
                <li><strong>N \u2014 Nurture:</strong> Offer the emotion the same compassion you would offer a friend in distress. Place a hand on your heart. Breathe kindness toward the feeling.</li>
            </ul>

            <h3>Emotion as Sensation Plus Story</h3>
            <p>Emotions have two distinct components: the physical sensation in the body (tightness in the chest, heaviness, heat) and the narrative or story layer (what the mind says about who is to blame, what it means, what should happen). In meditation, we can practice separating these: feel the pure physical sensation, and notice the story as a separate mental layer. Often, the pure sensation is tolerable; it is the story that is unbearable.</p>

            <h3>The Window of Tolerance</h3>
            <p>Trauma therapist Dan Siegel describes a "window of tolerance" \u2014 a zone of activation where emotional experience can be processed. Below the window is numbness (hypoarousal); above it is overwhelm (hyperarousal). Skilled meditation involves remaining within the window: making contact with difficult emotions without either suppressing them or being overwhelmed. If you become overwhelmed, return attention to the soles of your feet or another grounding sensation.</p>

            <h3>When to Seek Support</h3>
            <p>Meditation is not a substitute for psychotherapy or trauma treatment. If meditation consistently surfaces very intense emotional material \u2014 especially relating to trauma \u2014 working with a skilled therapist or trauma-informed meditation teacher is advisable alongside or before intensive practice. The two modalities can be powerful complements when properly calibrated.</p>
        `
    },
    {
      id: "sleep_meditation",
      unlockLevel: 2,
      category: "Practical Guidance",
      emoji: "\u{1F319}",
      title: "Yoga Nidr\u0101: The Art of Conscious Sleep",
      readTime: "4 min",
      summary: "Explore Yoga Nidr\u0101 \u2014 the 'yoga of sleep' \u2014 a systematic body-mind relaxation practice used for deep restoration, stress relief, and enhanced insight.",
      content: `
            <p>Yoga Nidr\u0101 \u2014 "sleep of the yogis" \u2014 is an ancient technique codified in the 20th century by Swami Satyananda Saraswati. It is typically practiced lying down, guided by a teacher's voice through a systematic relaxation of body, breath, and mind, while maintaining the thin thread of consciousness. Practitioners report that 30 minutes of Yoga Nidr\u0101 feels equivalent to two to four hours of ordinary sleep in terms of restoration.</p>

            <h3>The Hypnagogic State</h3>
            <p>Yoga Nidr\u0101 deliberately cultivates the hypnagogic state \u2014 the transitional zone between waking and sleep consciousness. In this state, the critical, filtering faculty of the prefrontal cortex relaxes, and the mind becomes extraordinarily receptive to suggestion, visualization, and symbolic experience. It is the state in which many artists and scientists have reported flashes of insight \u2014 including Thomas Edison, who famously napped in a chair holding ball bearings that would clatter when he fell asleep, jolting him back to the hypnagogic threshold.</p>

            <h3>Sankalpa: The Seed Intention</h3>
            <p>A core element of classical Yoga Nidr\u0101 is the <em>sankalpa</em> \u2014 a short, positive intention or resolve. It is planted at the beginning and end of the session, when the mind is most relaxed and receptive. Unlike ordinary affirmations, the sankalpa in Yoga Nidr\u0101 is held with effortless certainty \u2014 as if already true \u2014 rather than willfully willed. Examples: "I am at peace," "I live with courage and clarity," "Creativity flows through me naturally."</p>

            <h3>Structural Elements of a Session</h3>
            <p>A full Yoga Nidr\u0101 session typically includes: physical settling and sankalpa; rotation of consciousness through the body (a rapid systematic naming of body parts that produces sensory withdrawal); pairs of opposites (heaviness/lightness, warmth/coolness \u2014 amplifying the capacity to hold contradictory states); visualization; and return to ordinary awareness. The entire process systematically relaxes both the somatic nervous system and the mind.</p>
        `
    }
  ];
  function renderWisdom() {
    const container = document.createElement("div");
    container.className = "screen scrollable wisdom-screen";
    container.innerHTML = `
        <!-- Header -->
        <div class="wd-header">
            <button class="wd-back-btn" id="wd-back-btn" aria-label="Back">
                <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <div style="text-align:center; flex:1;">
                <h1 class="wd-title">Wisdom Library</h1>
                <p class="wd-subtitle">Nourish your mind</p>
            </div>
            <div style="width:40px;"></div>
        </div>

        <!-- Categories List -->
        <div class="wd-content" id="wd-article-list">
            <!-- Articles will be injected here by JS -->
        </div>

        <!-- Article Reader Modal Overlay (Slides up) -->
        <div id="wd-reader-modal" class="wd-reader-overlay">
            <div class="wd-reader-header" style="position: relative;">
                <div class="wd-progress-container" style="position: absolute; bottom: 0; top: auto; left: 0; height: 3px;">
                    <div class="wd-progress-bar" id="wd-reader-progress"></div>
                </div>
                <button class="wd-reader-close" id="wd-reader-close" aria-label="Close reader">
                    <span class="material-symbols-rounded">arrow_back</span>
                </button>
                <div class="wd-reader-meta">
                    <span id="wd-meta-category">Category</span> \xB7 <span id="wd-meta-time">5 min read</span>
                </div>
                <div style="width:36px;"></div>
            </div>

            <div class="wd-reader-body" id="wd-reader-body">
                <h1 class="wd-reader-title" id="wd-reader-title">Article Title</h1>
                <div class="wd-reader-text" id="wd-reader-text">
                    <!-- Text content injected here -->
                </div>

                <div class="wd-completion-zone">
                    <button class="btn btn-primary wd-complete-btn" id="wd-complete-btn">
                        Complete Reading & Claim +15 XP
                    </button>
                </div>
            </div>
        </div>
    `;
    const style = document.createElement("style");
    style.textContent = `
        .wisdom-screen {
            background-color: var(--color-bg-primary);
            padding: calc(14px + env(safe-area-inset-top, 0px)) 20px calc(var(--spacing-xl) + 20px);
            display: flex;
            flex-direction: column;
        }

        /* Header */
        .wd-header {
            display: flex;
            align-items: center;
            margin-bottom: var(--spacing-lg);
            flex-shrink: 0;
        }
        .wd-back-btn {
            background: var(--color-bg-secondary);
            border: none;
            color: var(--color-text-primary);
            border-radius: 10px;
            width: 40px; height: 40px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: background var(--transition-fast);
        }
        .wd-back-btn:active { background: var(--color-accent-light); }
        .wd-back-btn .material-symbols-rounded { font-size: 20px; }
        .wd-title { font-size: 20px; font-weight: 700; }
        .wd-subtitle { font-size: 11px; color: var(--color-text-muted); margin: 2px 0 0; }

        /* Article List Layout */
        .wd-category-section {
            margin-bottom: var(--spacing-lg);
        }
        .wd-category-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--color-text-muted);
            margin-bottom: var(--spacing-sm);
            border-bottom: 1px solid var(--color-bg-secondary);
            padding-bottom: 4px;
        }

        /* Article Cards */
        .wd-card {
            background: var(--color-bg-card);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-sm);
            box-shadow: var(--shadow-sm);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            gap: 6px;
            border: 1px solid transparent;
            transition: all var(--transition-normal);
            position: relative;
            overflow: hidden;
        }
        .wd-card:active {
            transform: scale(0.98);
        }
        .wd-card-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--color-text-primary);
            line-height: 1.4;
        }
        .wd-card-desc {
            font-size: 12px;
            color: var(--color-text-secondary);
            line-height: 1.5;
        }
        .wd-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 4px;
            font-size: 10px;
            color: var(--color-text-muted);
            font-weight: 600;
        }

        /* Locked Card Styling */
        .wd-card.locked {
            background: rgba(239, 236, 230, 0.5);
            border: 1px dashed rgba(134, 155, 143, 0.25);
            cursor: default;
        }
        .wd-card.locked .wd-card-title,
        .wd-card.locked .wd-card-desc {
            opacity: 0.5;
            filter: blur(1.5px);
            user-select: none;
        }
        .wd-lock-badge {
            background: rgba(134, 155, 143, 0.15);
            color: var(--color-text-secondary);
            padding: 3px 8px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 9px;
            font-weight: 700;
        }
        .wd-lock-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            pointer-events: none;
        }
        .wd-lock-icon-btn {
            background: white;
            width: 38px; height: 38px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: var(--shadow-sm);
            color: var(--color-text-muted);
            border: 1.5px solid var(--color-bg-secondary);
        }

        /* Shake animation for locked items */
        .wd-card.shake {
            animation: card-shake 0.4s ease;
        }
        @keyframes card-shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
        }

        /* Read Indicator Badge */
        .wd-read-badge {
            color: #53a362;
            font-size: 10px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 2px;
        }

        /* Reader Overlay sliding pane */
        .wd-reader-overlay {
            position: fixed;
            inset: 0;
            z-index: 500;
            background: var(--color-bg-primary);
            display: flex;
            flex-direction: column;
            transform: translateY(100%);
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wd-reader-overlay.active {
            transform: translateY(0);
        }

        /* Scrollable Reader Body */
        .wd-reader-body {
            flex: 1;
            overflow-y: auto;
            padding: var(--spacing-md) var(--spacing-lg) var(--spacing-xxl);
            box-sizing: border-box;
        }

        /* Reading progress bar */
        .wd-progress-container {
            width: 100%;
            height: 4px;
            background: var(--color-bg-secondary);
            position: absolute;
            top: 0; left: 0;
            z-index: 10;
        }
        .wd-progress-bar {
            width: 0%;
            height: 100%;
            background: var(--color-accent-dark);
            transition: width 0.1s ease-out;
        }

        /* Reader Header bar */
        .wd-reader-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: calc(12px + env(safe-area-inset-top, 0px)) var(--spacing-lg) 12px;
            border-bottom: 1px solid var(--color-bg-secondary);
            background: var(--color-bg-primary);
            z-index: 5;
        }
        .wd-reader-close {
            background: none; border: none;
            color: var(--color-text-secondary);
            cursor: pointer; display: flex; align-items: center;
            padding: 4px;
        }
        .wd-reader-close .material-symbols-rounded { font-size: 22px; }
        .wd-reader-meta {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--color-text-muted);
        }

        /* Typography Lora style */
        .wd-reader-title {
            font-family: var(--font-heading), serif;
            font-size: 24px;
            line-height: 1.35;
            color: var(--color-text-primary);
            margin: var(--spacing-lg) 0 var(--spacing-md);
            font-weight: 500;
        }
        .wd-reader-text {
            font-family: var(--font-heading), serif;
            font-size: 15px;
            line-height: 1.7;
            color: var(--color-text-primary);
        }
        .wd-reader-text p {
            margin-bottom: var(--spacing-md);
            color: var(--color-text-primary);
        }
        .wd-reader-text h3 {
            font-family: var(--font-heading), serif;
            font-size: 18px;
            font-weight: 600;
            margin: var(--spacing-lg) 0 var(--spacing-sm);
        }
        .wd-reader-text ul {
            margin: 0 0 var(--spacing-md) var(--spacing-md);
            padding: 0;
        }
        .wd-reader-text li {
            margin-bottom: var(--spacing-sm);
            line-height: 1.6;
        }

        /* Completion Zone */
        .wd-completion-zone {
            margin-top: var(--spacing-xxl);
            display: flex;
            justify-content: center;
        }
        .wd-complete-btn {
            width: 100%;
            max-width: 320px;
            padding: var(--spacing-md);
        }
        .wd-complete-btn.claimed {
            background-color: #e2ede4;
            color: #277038;
            cursor: default;
            border: 1px solid rgba(83, 163, 98, 0.2);
            pointer-events: none;
        }
    `;
    container.appendChild(style);
    let activeArticleId = null;
    container.querySelector("#wd-back-btn").addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("siddha-navigate", { detail: { target: "home" } }));
    });
    const readerModal = container.querySelector("#wd-reader-modal");
    container.querySelector("#wd-reader-close").addEventListener("click", () => {
      readerModal.classList.remove("active");
      activeArticleId = null;
      container.updateData();
    });
    container.updateData = () => {
      const stats = DB.getStats();
      const userLevel = stats.level;
      const listContainer = container.querySelector("#wd-article-list");
      listContainer.innerHTML = "";
      const grouped = {};
      ARTICLES.forEach((art) => {
        if (!grouped[art.category]) grouped[art.category] = [];
        grouped[art.category].push(art);
      });
      Object.entries(grouped).forEach(([catName, list]) => {
        const section = document.createElement("div");
        section.className = "wd-category-section";
        const title = document.createElement("h2");
        title.className = "wd-category-title";
        title.textContent = catName;
        section.appendChild(title);
        const PATH_BY_CATEGORY = {
          "Foundations of Mindfulness": "anapana",
          "Insight Practice": "vipassana",
          "Zen Tradition": "zen",
          "Loving-Kindness & Compassion": "metta"
        };
        list.forEach((art) => {
          const pathId = PATH_BY_CATEGORY[art.category];
          const isPathUnlocked = !pathId || DB.isPathUnlocked(pathId);
          const isUnlocked = isPathUnlocked && userLevel >= art.unlockLevel;
          const isRead = DB.isArticleRead(art.id);
          const card = document.createElement("div");
          card.className = `wd-card ${isUnlocked ? "unlocked" : "locked"}`;
          if (isUnlocked) {
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.innerHTML = `
                        <div style="display:flex; align-items:flex-start; gap:10px;">
                            <div style="font-size:22px; line-height:1; flex-shrink:0; margin-top:1px;">${art.emoji || "\u{1F4D6}"}</div>
                            <div style="flex:1; min-width:0;">
                                <div class="wd-card-title">${art.title}</div>
                                <div class="wd-card-desc">${art.summary}</div>
                                <div class="wd-card-footer">
                                    <span>${art.readTime}</span>
                                    ${isRead ? `
                                        <span class="wd-read-badge">
                                            <span class="material-symbols-rounded" style="font-size:12px; font-variation-settings: 'FILL' 1;">check_circle</span>
                                            Completed
                                        </span>
                                    ` : ""}
                                </div>
                            </div>
                        </div>
                    `;
            card.addEventListener("click", () => openArticle(art));
          } else {
            let lockText = `Lv.${art.unlockLevel} Required`;
            if (!isPathUnlocked) {
              lockText = "Path Locked";
            }
            card.innerHTML = `
                        <div class="wd-lock-overlay">
                            <div class="wd-lock-icon-btn">
                                <span class="material-symbols-rounded">lock</span>
                            </div>
                        </div>
                        <div style="display:flex; align-items:flex-start; gap:10px;">
                            <div style="font-size:22px; line-height:1; flex-shrink:0; margin-top:1px; opacity:0.35;">${art.emoji || "\u{1F4D6}"}</div>
                            <div style="flex:1; min-width:0;">
                                <div class="wd-card-title">${art.title}</div>
                                <div class="wd-card-desc">${art.summary}</div>
                                <div class="wd-card-footer">
                                    <span>${art.readTime}</span>
                                    <span class="wd-lock-badge">
                                        <span class="material-symbols-rounded" style="font-size:10px;">lock</span>
                                        ${lockText}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;
            card.addEventListener("click", () => {
              card.classList.add("shake");
              setTimeout(() => card.classList.remove("shake"), 400);
            });
          }
          section.appendChild(card);
        });
        listContainer.appendChild(section);
      });
    };
    function openArticle(art) {
      activeArticleId = art.id;
      container.querySelector("#wd-meta-category").textContent = art.category;
      container.querySelector("#wd-meta-time").textContent = art.readTime;
      container.querySelector("#wd-reader-title").textContent = art.title;
      container.querySelector("#wd-reader-text").innerHTML = art.content;
      const completeBtn = container.querySelector("#wd-complete-btn");
      const isRead = DB.isArticleRead(art.id);
      if (isRead) {
        completeBtn.className = "btn wd-complete-btn claimed";
        completeBtn.innerHTML = `
                <span class="material-symbols-rounded" style="font-size:16px; margin-right:4px;">check_circle</span>
                Read Completed (+15 XP Claimed)
            `;
      } else {
        completeBtn.className = "btn btn-primary wd-complete-btn";
        completeBtn.innerHTML = "Complete Reading & Claim +15 XP";
      }
      const readerBody = container.querySelector("#wd-reader-body");
      readerBody.scrollTop = 0;
      container.querySelector("#wd-reader-progress").style.width = "0%";
      readerBody.onscroll = () => {
        const total = readerBody.scrollHeight - readerBody.clientHeight;
        const progress = total > 0 ? readerBody.scrollTop / total * 100 : 0;
        container.querySelector("#wd-reader-progress").style.width = `${progress}%`;
      };
      readerModal.classList.add("active");
    }
    container.querySelector("#wd-complete-btn").addEventListener("click", () => {
      if (!activeArticleId) return;
      const didRead = DB.markArticleAsRead(activeArticleId);
      if (didRead) {
        const completeBtn = container.querySelector("#wd-complete-btn");
        completeBtn.className = "btn wd-complete-btn claimed";
        completeBtn.innerHTML = `
                <span class="material-symbols-rounded" style="font-size:16px; margin-right:4px;">check_circle</span>
                Read Completed (+15 XP Claimed)
            `;
        DB.checkAndTriggerAchievements(false);
        container.updateData();
        setTimeout(() => {
          readerModal.classList.remove("active");
          activeArticleId = null;
          container.updateData();
        }, 600);
      }
    });
    return container;
  }

  // src/main.js
  init_db();
  init_synth();

  // node_modules/@capacitor/app/dist/esm/index.js
  init_dist();
  var App = registerPlugin("App", {
    web: () => Promise.resolve().then(() => (init_web(), web_exports)).then((m) => new m.AppWeb())
  });

  // src/components/levelup_celebration.js
  init_synth();
  var LEVEL_NAMES = [
    "Novice",
    "Initiate",
    "Adept",
    "Seeker",
    "Wanderer",
    "Practitioner",
    "Disciple",
    "Guide",
    "Sage",
    "Master"
  ];
  var GROUNDING_QUOTES = [
    { text: "Be here now.", author: "Ram Dass" },
    { text: "The little things? The little moments? They aren't little.", author: "Jon Kabat-Zinn" },
    { text: "Peace is every step.", author: "Thich Nhat Hanh" },
    { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
    { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" },
    { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
    { text: "Quiet mind, warm heart.", author: "Zen Proverb" },
    { text: "In the midst of movement, make peace in your heart.", author: "Deepak Chopra" }
  ];
  function playSingingBowl() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const freqs = [180, 271, 362, 545, 728];
      const gains = [0.45, 0.28, 0.18, 0.09, 0.04];
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.55, now + 0.18);
      masterGain.gain.exponentialRampToValueAtTime(1e-3, now + 6);
      masterGain.connect(ctx.destination);
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const detune = (Math.random() - 0.5) * 1.8;
        osc.frequency.setValueAtTime(f + detune, now);
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.75 + Math.random() * 0.3, now);
        lfoGain.gain.setValueAtTime(f * 4e-3, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        gain.gain.setValueAtTime(gains[idx], now);
        osc.connect(gain);
        gain.connect(masterGain);
        lfo.start(now);
        osc.start(now);
        osc.stop(now + 6.5);
        lfo.stop(now + 6.5);
      });
    } catch (e) {
      console.warn("[Siddha Audio] Failed to synthesize singing bowl:", e);
    }
  }
  function injectStyles() {
    if (document.getElementById("siddha-levelup-styles")) return;
    const style = document.createElement("style");
    style.id = "siddha-levelup-styles";
    style.textContent = `
        /* Overlay wrapper */
        .lu-overlay {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, rgba(30, 44, 34, 0.95) 0%, rgba(20, 28, 23, 0.97) 100%);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
            color: #f4f3ed;
            font-family: var(--font-body), sans-serif;
            overflow: hidden;
        }

        .lu-overlay.active {
            opacity: 1;
        }

        /* Container Card */
        .lu-card {
            width: 100%;
            max-width: 400px;
            padding: var(--spacing-xl);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 10;
            transform: scale(0.92) translateY(10px);
            opacity: 0;
            transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease;
        }

        .lu-overlay.active .lu-card {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        /* Mandala Container */
        .lu-mandala-wrap {
            position: relative;
            width: 180px;
            height: 180px;
            margin-bottom: var(--spacing-lg);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Sacred Geometry rotating SVGs */
        .lu-svg {
            position: absolute;
            width: 100%;
            height: 100%;
            fill: none;
            stroke: rgba(197, 208, 201, 0.2);
            stroke-width: 1;
        }

        .lu-svg-outer {
            stroke: rgba(197, 208, 201, 0.15);
            animation: lu-spin-cw 35s linear infinite;
        }

        .lu-svg-inner {
            width: 80%;
            height: 80%;
            stroke: rgba(134, 155, 143, 0.4);
            animation: lu-spin-ccw 25s linear infinite;
        }

        @keyframes lu-spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes lu-spin-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }

        /* Central Level Circle */
        .lu-center-badge {
            position: absolute;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 30px rgba(134, 155, 143, 0.4), inset 0 2px 4px rgba(255,255,255,0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            animation: lu-pulse 4s ease-in-out infinite;
        }

        @keyframes lu-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(134, 155, 143, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 45px rgba(134, 155, 143, 0.65); }
        }

        .lu-level-num {
            font-size: 26px;
            font-weight: 700;
            line-height: 1;
            margin: 0;
            color: #f4f3ed;
        }

        .lu-level-lbl {
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 2px;
        }

        /* Text Styling */
        .lu-title {
            font-family: var(--font-heading), serif;
            font-size: 22px;
            color: #f4f3ed;
            margin: 0 0 var(--spacing-xs);
            letter-spacing: 0.5px;
            font-weight: 500;
        }

        .lu-subtitle {
            font-size: 13px;
            color: var(--color-accent-light);
            margin: 0 0 var(--spacing-lg);
            font-weight: 500;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        /* Quote box */
        .lu-quote-box {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-xl);
            max-width: 320px;
            position: relative;
        }

        .lu-quote-text {
            font-family: var(--font-heading), serif;
            font-style: italic;
            font-size: 13px;
            line-height: 1.5;
            color: rgba(255,255,255,0.85);
            margin-bottom: var(--spacing-xs);
        }

        .lu-quote-author {
            font-size: 10px;
            color: var(--color-text-muted);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Action Button */
        .lu-btn {
            background: #f4f3ed;
            color: var(--color-text-primary);
            border: none;
            padding: 12px 32px;
            border-radius: var(--radius-full);
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.5px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
            opacity: 0;
            transform: translateY(10px);
            transition: all var(--transition-normal), opacity 0.8s ease, transform 0.8s ease;
        }

        .lu-btn.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .lu-btn:active {
            transform: scale(0.96);
            background: #e4e3dd;
        }

        /* Evolution Preview Card */
        .lu-image-card {
            width: 100%;
            max-width: 280px;
            height: 160px;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid rgba(255,255,255,0.15);
            margin-bottom: var(--spacing-lg);
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            position: relative;
            opacity: 0;
            transform: scale(0.9) translateY(10px);
            animation: lu-image-appear 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
        }

        .lu-image-el {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 30%;
        }

        @keyframes lu-image-appear {
            to { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* Leaf Particle Canvas */
        .lu-canvas {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
  }
  var ParticleEngine = class {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = [];
      this.active = false;
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
    start() {
      this.active = true;
      this.particles = [];
      for (let i = 0; i < 28; i++) {
        this.particles.push(this.createParticle(true));
      }
      this.loop();
    }
    stop() {
      this.active = false;
    }
    createParticle(randomY = false) {
      return {
        x: Math.random() * this.canvas.width,
        y: randomY ? Math.random() * this.canvas.height : -20,
        size: 8 + Math.random() * 12,
        speedY: 0.6 + Math.random() * 0.9,
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        swayRange: 20 + Math.random() * 30,
        swaySpeed: 5e-3 + Math.random() * 0.01,
        swayOffset: Math.random() * 100,
        opacity: 0.2 + Math.random() * 0.45
      };
    }
    loop() {
      if (!this.active) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const time = Date.now();
      this.particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.speedX * 3;
        p.x += p.speedX + sway;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.globalAlpha = p.opacity;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size / 2);
        this.ctx.quadraticCurveTo(p.size / 2.5, 0, 0, p.size / 2);
        this.ctx.quadraticCurveTo(-p.size / 2.5, 0, 0, -p.size / 2);
        this.ctx.closePath();
        this.ctx.fillStyle = "rgba(134, 155, 143, 0.75)";
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size / 2);
        this.ctx.lineTo(0, p.size / 2);
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();
        if (p.y > this.canvas.height + 20) {
          this.particles[idx] = this.createParticle(false);
        }
      });
      requestAnimationFrame(() => this.loop());
    }
  };
  function renderSacredGeometry(container) {
    const outerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    outerSvg.setAttribute("class", "lu-svg lu-svg-outer");
    outerSvg.setAttribute("viewBox", "0 0 100 100");
    let circlesHTML = "";
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      const cx = 50 + 20 * Math.cos(angle);
      const cy = 50 + 20 * Math.sin(angle);
      circlesHTML += `<circle cx="${cx}" cy="${cy}" r="20" />`;
    }
    circlesHTML += `<circle cx="50" cy="50" r="40" />`;
    circlesHTML += `<circle cx="50" cy="50" r="20" />`;
    outerSvg.innerHTML = circlesHTML;
    const innerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    innerSvg.setAttribute("class", "lu-svg lu-svg-inner");
    innerSvg.setAttribute("viewBox", "0 0 100 100");
    let innerHTML = "";
    for (let r of [15, 30, 45]) {
      let pts = [];
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        pts.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
      }
      innerHTML += `<polygon points="${pts.join(" ")}" />`;
    }
    innerSvg.innerHTML = innerHTML;
    container.appendChild(outerSvg);
    container.appendChild(innerSvg);
  }
  function triggerLevelUpModal(oldLevel, newLevel) {
    injectStyles();
    const appEl = document.getElementById("app") || document.body;
    const existing = document.getElementById("levelup-modal");
    if (existing) existing.remove();
    const overlay = document.createElement("div");
    overlay.id = "levelup-modal";
    overlay.className = "lu-overlay";
    const canvas = document.createElement("canvas");
    canvas.className = "lu-canvas";
    overlay.appendChild(canvas);
    const card = document.createElement("div");
    card.className = "lu-card";
    const mandalaWrap = document.createElement("div");
    mandalaWrap.className = "lu-mandala-wrap";
    renderSacredGeometry(mandalaWrap);
    const badge = document.createElement("div");
    badge.className = "lu-center-badge";
    badge.innerHTML = `
        <span class="lu-level-num">${newLevel}</span>
        <span class="lu-level-lbl">Level</span>
    `;
    mandalaWrap.appendChild(badge);
    card.appendChild(mandalaWrap);
    const titleEl = document.createElement("h2");
    titleEl.className = "lu-title";
    titleEl.textContent = "Consciousness Expanded";
    card.appendChild(titleEl);
    function getLevelImage(level) {
      if (level >= 15) return "Siddha_lvl15.png";
      if (level >= 10) return "Siddha_lvl10.png";
      if (level >= 7) return "Siddha_lvl7.png";
      if (level >= 5) return "Siddha_lvl5.png";
      if (level >= 3) return "Siddha_lvl3.png";
      return "Siddha_lvl1.png";
    }
    const subtitleEl = document.createElement("p");
    subtitleEl.className = "lu-subtitle";
    const oldImg = getLevelImage(oldLevel);
    const newImg = getLevelImage(newLevel);
    const isEvolution = oldImg !== newImg;
    if (isEvolution) {
      subtitleEl.textContent = "Siddha Has Evolved!";
      subtitleEl.style.color = "#e2b857";
      subtitleEl.style.textShadow = "0 0 10px rgba(226,184,87,0.3)";
    } else {
      const titleText = LEVEL_NAMES[Math.min(newLevel - 1, LEVEL_NAMES.length - 1)] || "Novice";
      subtitleEl.textContent = `Level Up \xB7 ${titleText}`;
    }
    card.appendChild(subtitleEl);
    const imgCard = document.createElement("div");
    imgCard.className = "lu-image-card";
    imgCard.innerHTML = `<img class="lu-image-el" src="./src/assets/${newImg}" alt="Siddha Evolution Stage">`;
    card.appendChild(imgCard);
    const quote = GROUNDING_QUOTES[Math.floor(Math.random() * GROUNDING_QUOTES.length)];
    const quoteBox = document.createElement("div");
    quoteBox.className = "lu-quote-box";
    quoteBox.innerHTML = `
        <p class="lu-quote-text">\u201C${quote.text}\u201D</p>
        <span class="lu-quote-author">\u2014 ${quote.author}</span>
    `;
    card.appendChild(quoteBox);
    const btn = document.createElement("button");
    btn.className = "lu-btn";
    btn.textContent = "Return to Practice";
    card.appendChild(btn);
    overlay.appendChild(card);
    appEl.appendChild(overlay);
    const engine = new ParticleEngine(canvas);
    engine.start();
    playSingingBowl();
    setTimeout(() => {
      overlay.classList.add("active");
    }, 50);
    setTimeout(() => {
      btn.classList.add("visible");
    }, 1500);
    const dismiss = () => {
      overlay.classList.remove("active");
      engine.stop();
      setTimeout(() => {
        overlay.remove();
        const activeScreen = document.querySelector(".screen.active");
        if (activeScreen && typeof activeScreen.updateData === "function") {
          try {
            activeScreen.updateData();
          } catch (e) {
            console.error("[Siddha Levelup] Screen refresh error:", e);
          }
        }
      }, 800);
    };
    btn.addEventListener("click", dismiss);
  }
  window.addEventListener("siddha-levelup", (e) => {
    try {
      const raw = localStorage.getItem("siddha_db");
      if (raw) {
        const state = JSON.parse(raw);
        if (state && !state.completedTutorial) return;
      }
    } catch (err) {
    }
    const { oldLevel, newLevel } = e.detail;
    triggerLevelUpModal(oldLevel, newLevel);
  });

  // src/components/achievement_celebration.js
  init_synth();
  function playSingingBowlChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const freqs = [220, 330, 440, 660];
      const gains = [0.4, 0.25, 0.15, 0.08];
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.5, now + 0.15);
      masterGain.gain.exponentialRampToValueAtTime(1e-3, now + 4.5);
      masterGain.connect(ctx.destination);
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const detune = (Math.random() - 0.5) * 1.5;
        osc.frequency.setValueAtTime(f + detune, now);
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.8, now);
        lfoGain.gain.setValueAtTime(f * 3e-3, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        gain.gain.setValueAtTime(gains[idx], now);
        osc.connect(gain);
        gain.connect(masterGain);
        lfo.start(now);
        osc.start(now);
        osc.stop(now + 5);
        lfo.stop(now + 5);
      });
    } catch (e) {
      console.warn("[Siddha Audio] Failed to synthesize singing bowl:", e);
    }
  }
  function injectStyles2() {
    if (document.getElementById("siddha-achievement-styles")) return;
    const style = document.createElement("style");
    style.id = "siddha-achievement-styles";
    style.textContent = `
        /* Achievement Overlay */
        .ac-overlay {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, rgba(26, 36, 30, 0.94) 0%, rgba(18, 24, 20, 0.96) 100%);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
            color: #f4f3ed;
            font-family: var(--font-body), sans-serif;
            overflow: hidden;
        }

        .ac-overlay.active {
            opacity: 1;
        }

        .ac-card {
            width: 100%;
            max-width: 360px;
            padding: var(--spacing-xl) var(--spacing-lg);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 10;
            transform: scale(0.9) translateY(12px);
            opacity: 0;
            transition: transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.7s ease;
        }

        .ac-overlay.active .ac-card {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        /* Rotating geometry wrapper */
        .ac-badge-wrap {
            position: relative;
            width: 150px;
            height: 150px;
            margin-bottom: var(--spacing-lg);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ac-svg {
            position: absolute;
            width: 100%;
            height: 100%;
            fill: none;
            stroke: rgba(197, 208, 201, 0.22);
            stroke-width: 1;
        }

        .ac-svg-outer {
            animation: ac-spin-cw 28s linear infinite;
        }

        .ac-svg-inner {
            width: 80%;
            height: 80%;
            stroke: rgba(134, 155, 143, 0.35);
            animation: ac-spin-ccw 20s linear infinite;
        }

        @keyframes ac-spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes ac-spin-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }

        .ac-emoji-center {
            position: absolute;
            width: 66px;
            height: 66px;
            border-radius: 50%;
            background: linear-gradient(135deg, #44594c 0%, #2b3931 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 0 0 25px rgba(134, 155, 143, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.15);
            animation: ac-pulse 4s ease-in-out infinite;
        }

        @keyframes ac-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.04); }
        }

        .ac-lbl-type {
            font-size: 11px;
            color: var(--color-accent);
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
            margin: 0 0 6px;
        }

        .ac-title {
            font-family: var(--font-heading), serif;
            font-size: 24px;
            font-weight: 500;
            color: #f4f3ed;
            margin: 0 0 var(--spacing-sm);
        }

        .ac-desc {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
            margin: 0 0 var(--spacing-lg);
            max-width: 280px;
        }

        .ac-reward-box {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 20px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 700;
            color: var(--color-accent-light);
            margin-bottom: var(--spacing-xl);
        }

        .ac-btn {
            background: #f4f3ed;
            color: var(--color-text-primary);
            border: none;
            padding: 12px 36px;
            border-radius: 40px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
            opacity: 0;
            transform: translateY(8px);
            transition: all 0.3s ease, opacity 0.8s ease, transform 0.8s ease;
        }

        .ac-btn.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .ac-btn:active {
            transform: scale(0.96);
            background: #e4e3dd;
        }

        .ac-canvas {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
  }
  var SparkleEngine = class {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = [];
      this.active = false;
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
    start() {
      this.active = true;
      this.particles = [];
      for (let i = 0; i < 35; i++) {
        this.particles.push(this.createParticle(true));
      }
      this.loop();
    }
    stop() {
      this.active = false;
    }
    createParticle(randomY = false) {
      return {
        x: Math.random() * this.canvas.width,
        y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 10,
        size: 1.5 + Math.random() * 2.5,
        speedY: -(0.4 + Math.random() * 0.7),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: 0.15 + Math.random() * 0.5,
        alphaSpeed: 1e-3 + Math.random() * 2e-3,
        gold: Math.random() > 0.4
      };
    }
    loop() {
      if (!this.active) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha -= p.alphaSpeed;
        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.gold ? "#dfb04d" : "#869b8f";
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = p.gold ? "rgba(223, 176, 77, 0.4)" : "rgba(134, 155, 143, 0.4)";
        this.ctx.fill();
        this.ctx.restore();
        if (p.y < -10 || p.alpha <= 0) {
          this.particles[idx] = this.createParticle(false);
        }
      });
      requestAnimationFrame(() => this.loop());
    }
  };
  function drawMandalaGeometry(container) {
    const outerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    outerSvg.setAttribute("class", "ac-svg ac-svg-outer");
    outerSvg.setAttribute("viewBox", "0 0 100 100");
    let circles = "";
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const cx = 50 + 16 * Math.cos(angle);
      const cy = 50 + 16 * Math.sin(angle);
      circles += `<circle cx="${cx}" cy="${cy}" r="16" />`;
    }
    circles += `<circle cx="50" cy="50" r="35" />`;
    outerSvg.innerHTML = circles;
    const innerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    innerSvg.setAttribute("class", "ac-svg ac-svg-inner");
    innerSvg.setAttribute("viewBox", "0 0 100 100");
    let innerHTML = "";
    for (let r of [12, 24]) {
      let pts = [];
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        pts.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
      }
      innerHTML += `<polygon points="${pts.join(" ")}" />`;
    }
    innerSvg.innerHTML = innerHTML;
    container.appendChild(outerSvg);
    container.appendChild(innerSvg);
  }
  function triggerAchievementModal(ach) {
    injectStyles2();
    const appEl = document.getElementById("app") || document.body;
    const existing = document.getElementById(`ach-modal-${ach.id}`);
    if (existing) existing.remove();
    const overlay = document.createElement("div");
    overlay.id = `ach-modal-${ach.id}`;
    overlay.className = "ac-overlay";
    const canvas = document.createElement("canvas");
    canvas.className = "ac-canvas";
    overlay.appendChild(canvas);
    const card = document.createElement("div");
    card.className = "ac-card";
    const badgeWrap = document.createElement("div");
    badgeWrap.className = "ac-badge-wrap";
    drawMandalaGeometry(badgeWrap);
    const centerEmoji = document.createElement("div");
    centerEmoji.className = "ac-emoji-center";
    centerEmoji.textContent = ach.emoji;
    badgeWrap.appendChild(centerEmoji);
    card.appendChild(badgeWrap);
    const typeLbl = document.createElement("p");
    typeLbl.className = "ac-lbl-type";
    typeLbl.textContent = "Milestone Unlocked";
    card.appendChild(typeLbl);
    const titleEl = document.createElement("h2");
    titleEl.className = "ac-title";
    titleEl.textContent = ach.title;
    card.appendChild(titleEl);
    const descEl = document.createElement("p");
    descEl.className = "ac-desc";
    descEl.textContent = ach.desc;
    card.appendChild(descEl);
    const rewardBox = document.createElement("div");
    rewardBox.className = "ac-reward-box";
    rewardBox.innerHTML = `
        <span class="material-symbols-rounded" style="font-size:15px; font-variation-settings: 'FILL' 1;">stars</span>
        +${ach.xp} XP Granted
    `;
    card.appendChild(rewardBox);
    const btn = document.createElement("button");
    btn.className = "ac-btn";
    btn.textContent = "Acknowledge";
    card.appendChild(btn);
    overlay.appendChild(card);
    appEl.appendChild(overlay);
    const engine = new SparkleEngine(canvas);
    engine.start();
    playSingingBowlChime();
    Synth.playStreakGongSound();
    setTimeout(() => {
      overlay.classList.add("active");
    }, 50);
    setTimeout(() => {
      btn.classList.add("visible");
    }, 1200);
    const dismiss = () => {
      overlay.classList.remove("active");
      engine.stop();
      setTimeout(() => {
        overlay.remove();
        const activeScreen = document.querySelector(".screen.active");
        if (activeScreen && typeof activeScreen.updateData === "function") {
          try {
            activeScreen.updateData();
          } catch (e) {
            console.error("[Siddha Achievement] Screen refresh error:", e);
          }
        }
      }, 800);
    };
    btn.addEventListener("click", dismiss);
  }
  window.addEventListener("siddha-achievement", (e) => {
    try {
      const raw = localStorage.getItem("siddha_db");
      if (raw) {
        const state = JSON.parse(raw);
        if (state && !state.completedTutorial) return;
      }
    } catch (err) {
    }
    triggerAchievementModal(e.detail);
  });

  // src/main.js
  document.addEventListener("DOMContentLoaded", () => {
    const screenContainer = document.getElementById("screen-container");
    const navItems = document.querySelectorAll(".nav-item");
    const bottomNav = document.querySelector(".bottom-nav");
    if (localStorage.getItem("siddha_dev_mode") === "true") {
      document.body.classList.add("dev-mode-active");
    } else {
      document.body.classList.remove("dev-mode-active");
    }
    MenuMusic.init();
    NatureMusic.init();
    const screens = {
      login: renderLogin(() => handleAuthChange()),
      home: renderHome(),
      journey: renderJourney(),
      breathe: renderBreathe((sessionData) => {
        const reflScreen = screens.new_reflection;
        reflScreen.sessionData = sessionData;
        navigateTo("new_reflection");
      }),
      reflect: renderReflect(() => {
        const reflScreen = screens.new_reflection;
        reflScreen.sessionData = null;
        navigateTo("new_reflection");
      }),
      profile: renderProfile(() => navigateTo("settings")),
      settings: renderSettings(() => navigateTo("profile")),
      new_reflection: renderNewReflection(() => {
        navigateTo("reflect");
      }),
      wisdom: renderWisdom()
    };
    Object.values(screens).forEach((screen) => {
      screenContainer.appendChild(screen);
    });
    function navigateTo(targetId) {
      const noNav = ["login", "breathe", "new_reflection", "wisdom", "settings"];
      bottomNav.style.display = noNav.includes(targetId) ? "none" : "flex";
      currentActiveScreen = targetId;
      if (targetId === "breathe") {
        MenuMusic.fadeOut(800);
        NatureMusic.fadeOut(800);
        if (window.Capacitor?.Plugins?.LocalNotifications) {
          window.Capacitor.Plugins.LocalNotifications.requestPermissions().catch(() => {
          });
        }
      } else if (["home", "journey", "reflect", "profile", "wisdom", "settings"].includes(targetId)) {
        MenuMusic.start();
        NatureMusic.start();
      }
      navItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.target === targetId);
      });
      Object.keys(screens).forEach((id) => {
        const screen = screens[id];
        if (id === targetId) {
          screen.classList.add("active");
          if (typeof screen.updateData === "function") {
            try {
              screen.updateData();
            } catch (e) {
              console.error("[Siddha] Error in", id, "updateData:", e);
            }
          }
        } else {
          screen.classList.remove("active");
        }
      });
    }
    window.addEventListener("siddha-navigate", (e) => {
      if (e.detail && e.detail.target) {
        navigateTo(e.detail.target);
      }
    });
    navItems.forEach((item) => {
      item.addEventListener("click", () => navigateTo(item.dataset.target));
    });
    function handleAuthChange() {
      const user = DB.getUser();
      if (user) {
        DB.checkAndTriggerAchievements(true);
        if (!DB.isTutorialCompleted()) {
          navigateTo("home");
          Promise.resolve().then(() => (init_onboarding_tutorial(), onboarding_tutorial_exports)).then((module) => {
            module.startOnboardingTutorial(() => {
              navigateTo("home");
            });
          });
        } else {
          navigateTo("home");
        }
      } else {
        navigateTo("login");
      }
    }
    let currentActiveScreen = "home";
    function pauseAllAppAudio() {
      MenuMusic.pause();
      NatureMusic.pause();
    }
    function resumeAppAudioIfAppropriate() {
      if (currentActiveScreen !== "breathe") {
        MenuMusic.start();
        NatureMusic.start();
      }
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pauseAllAppAudio();
      } else {
        resumeAppAudioIfAppropriate();
      }
    });
    window.addEventListener("blur", () => {
      pauseAllAppAudio();
    });
    window.addEventListener("focus", () => {
      resumeAppAudioIfAppropriate();
    });
    if (window.Capacitor?.Plugins?.App) {
      window.Capacitor.Plugins.App.addListener("appStateChange", (state) => {
        if (!state.isActive) {
          pauseAllAppAudio();
        } else {
          resumeAppAudioIfAppropriate();
        }
      });
      let lastBackPressTime = 0;
      const handleBack = () => {
        const avatarModal = document.getElementById("avatar-modal");
        const wisdomReader = document.getElementById("wd-reader-modal");
        const journeyModal = document.getElementById("mission-modal");
        const intentionModal = document.getElementById("intention-modal-overlay");
        if (avatarModal && avatarModal.style.display === "flex") {
          avatarModal.style.display = "none";
          return;
        }
        if (wisdomReader && wisdomReader.classList.contains("active")) {
          wisdomReader.querySelector("#wd-reader-close")?.click();
          return;
        }
        if (journeyModal && journeyModal.classList.contains("active")) {
          journeyModal.querySelector("#modal-close")?.click();
          return;
        }
        if (intentionModal && intentionModal.style.display === "flex") {
          intentionModal.querySelector("#close-intention-modal-btn")?.click();
          return;
        }
        if (currentActiveScreen === "settings") {
          navigateTo("profile");
          return;
        }
        if (currentActiveScreen !== "home" && currentActiveScreen !== "login") {
          if (currentActiveScreen === "breathe") {
            document.getElementById("breathe-close-btn")?.click() || navigateTo("home");
          } else if (currentActiveScreen === "new_reflection") {
            document.getElementById("nr-back-btn")?.click() || navigateTo("home");
          } else {
            navigateTo("home");
          }
        } else {
          const now = Date.now();
          if (now - lastBackPressTime < 2e3) {
            App.exitApp();
          } else {
            lastBackPressTime = now;
            const toast = document.createElement("div");
            toast.textContent = "Press back again to exit";
            toast.style.position = "fixed";
            toast.style.bottom = "80px";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.backgroundColor = "rgba(0,0,0,0.85)";
            toast.style.border = "1px solid rgba(255,255,255,0.15)";
            toast.style.color = "white";
            toast.style.padding = "10px 20px";
            toast.style.borderRadius = "20px";
            toast.style.fontSize = "13px";
            toast.style.fontWeight = "500";
            toast.style.zIndex = "9999";
            toast.style.transition = "opacity 0.3s ease";
            toast.style.pointerEvents = "none";
            document.body.appendChild(toast);
            setTimeout(() => {
              toast.style.opacity = "0";
              setTimeout(() => toast.remove(), 300);
            }, 1700);
          }
        }
      };
      try {
        App.addListener("backButton", handleBack);
      } catch (e) {
        console.warn("[Main] App backButton listener error:", e);
      }
    }
    const requestNotifPermissions = async () => {
      try {
        const LocalNotifications = window.Capacitor?.Plugins?.LocalNotifications;
        if (!LocalNotifications) return;
        const check = await LocalNotifications.checkPermissions();
        if (check.display !== "granted") {
          await LocalNotifications.requestPermissions();
        }
        const pending = await LocalNotifications.getPending();
        if (pending && pending.notifications && pending.notifications.length > 0) {
          const sitNotifs = pending.notifications.filter((n) => n.id === 99 || n.id >= 201);
          if (sitNotifs.length > 0) {
            await LocalNotifications.cancel({ notifications: sitNotifs });
          }
        }
      } catch (err) {
        console.warn("[Main] Notification setup fallback:", err);
      }
    };
    requestNotifPermissions();
    handleAuthChange();
  });
})();
/*! Bundled license information:

@capacitor/core/dist/index.js:
  (*! Capacitor: https://capacitorjs.com/ - MIT License *)
*/
