import { DB } from './db.js';

export const HapticService = {
    /**
     * Triggers a vibration / haptic feedback sequence across iOS, Android, and Web.
     * Respects user's notification/vibration preference in DB.
     * @param {'light'|'medium'|'heavy'|'success'|'completion'|'bell'} style 
     */
    vibrate: async (style = 'completion') => {
        // Check user settings
        try {
            const settings = DB.getNotificationSettings ? DB.getNotificationSettings() : {};
            if (settings.vibrationEnabled === false) {
                return;
            }
        } catch (e) {
            // Default to allowed if settings check fails
        }

        // 1. Native Capacitor Haptics Plugin (window.Capacitor.Plugins.Haptics)
        const nativeHaptics = window.Capacitor?.Plugins?.Haptics;
        if (nativeHaptics) {
            try {
                if (style === 'completion' || style === 'success') {
                    // Trigger 3 distinct gentle pulse bursts for sacred completion
                    if (typeof nativeHaptics.notification === 'function') {
                        nativeHaptics.notification({ type: 'SUCCESS' }).catch(() => {});
                    }
                    if (typeof nativeHaptics.vibrate === 'function') {
                        await nativeHaptics.vibrate({ duration: 250 });
                        await new Promise(r => setTimeout(r, 150));
                        await nativeHaptics.vibrate({ duration: 250 });
                        await new Promise(r => setTimeout(r, 150));
                        await nativeHaptics.vibrate({ duration: 250 });
                    }
                    return;
                } else if (style === 'bell') {
                    if (typeof nativeHaptics.impact === 'function') {
                        nativeHaptics.impact({ style: 'HEAVY' }).catch(() => {});
                    }
                    if (typeof nativeHaptics.vibrate === 'function') {
                        await nativeHaptics.vibrate({ duration: 300 });
                    }
                    return;
                } else if (style === 'light') {
                    if (typeof nativeHaptics.impact === 'function') {
                        await nativeHaptics.impact({ style: 'LIGHT' });
                    }
                    return;
                } else if (style === 'medium') {
                    if (typeof nativeHaptics.impact === 'function') {
                        await nativeHaptics.impact({ style: 'MEDIUM' });
                    }
                    return;
                } else if (style === 'heavy') {
                    if (typeof nativeHaptics.impact === 'function') {
                        await nativeHaptics.impact({ style: 'HEAVY' });
                    }
                    return;
                } else {
                    if (typeof nativeHaptics.vibrate === 'function') {
                        await nativeHaptics.vibrate({ duration: 400 });
                    }
                    return;
                }
            } catch (err) {
                console.warn('[HapticService] Capacitor Haptics call error, using navigator fallback:', err);
            }
        }

        // 2. Global Window Capacitor Fallback
        const globalHaptics = window.Capacitor?.Plugins?.Haptics;
        if (globalHaptics) {
            try {
                if (style === 'completion' || style === 'success') {
                    if (typeof globalHaptics.notification === 'function') {
                        await globalHaptics.notification({ type: 'SUCCESS' });
                    } else if (typeof globalHaptics.vibrate === 'function') {
                        await globalHaptics.vibrate({ duration: 500 });
                    }
                } else if (style === 'bell') {
                    await globalHaptics.impact({ style: 'HEAVY' });
                } else {
                    await globalHaptics.vibrate({ duration: 400 });
                }
                return;
            } catch (err) {
                console.warn('[HapticService] Global Haptics fallback error:', err);
            }
        }

        // 3. Web Navigator Fallback (Android WebViews / PWAs)
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            try {
                if (style === 'completion') {
                    navigator.vibrate([250, 150, 250, 150, 250]);
                } else if (style === 'bell') {
                    navigator.vibrate([300, 150, 300]);
                } else {
                    navigator.vibrate(200);
                }
            } catch (e) {
                // Ignore browser vibration restrictions
            }
        }
    }
};
