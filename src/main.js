import { renderHome } from './screens/home.js';
import { renderJourney } from './screens/journey.js';
import { renderBreathe } from './screens/breathe.js';
import { renderReflect } from './screens/reflect.js';
import { renderLogin } from './screens/login.js';
import { renderProfile } from './screens/profile.js';
import { renderSettings } from './screens/settings.js';
import { renderNewReflection } from './screens/new_reflection.js';
import { renderWisdom } from './screens/wisdom.js';
import { DB } from './services/db.js';
import { MenuMusic, NatureMusic } from './services/synth.js';
import './components/levelup_celebration.js';
import './components/achievement_celebration.js';

document.addEventListener('DOMContentLoaded', () => {
    const screenContainer = document.getElementById('screen-container');
    const navItems = document.querySelectorAll('.nav-item');
    const bottomNav = document.querySelector('.bottom-nav');

    // Lock screen orientation to portrait
    try {
        if (window.screen?.orientation?.lock) {
            window.screen.orientation.lock('portrait').catch(() => {});
        }
    } catch(e) {}

    // Initialize Developer Mode state
    if (localStorage.getItem('siddha_dev_mode') === 'true') {
        document.body.classList.add('dev-mode-active');
    } else {
        document.body.classList.remove('dev-mode-active');
    }

    // Initialize Menu & Nature Music
    MenuMusic.init();
    NatureMusic.init();

    // Initialize screens
    const screens = {
        login: renderLogin(() => handleAuthChange()),
        home: renderHome(),
        journey: renderJourney(),
        breathe: renderBreathe((sessionData) => {
            // Post-meditation: go to reflection with session data
            const reflScreen = screens.new_reflection;
            reflScreen.sessionData = sessionData;
            navigateTo('new_reflection');
        }),
        reflect: renderReflect(() => {
            // Standalone reflection (no meditation)
            const reflScreen = screens.new_reflection;
            reflScreen.sessionData = null;
            navigateTo('new_reflection');
        }),
        profile: renderProfile(() => navigateTo('settings')),
        settings: renderSettings(() => navigateTo('profile')),
        new_reflection: renderNewReflection(() => {
            // After saving reflection → go to reflect tab
            navigateTo('reflect');
        }),
        wisdom: renderWisdom()
    };

    // Append all screens
    Object.values(screens).forEach(screen => {
        screenContainer.appendChild(screen);
    });

    // Navigation
    function navigateTo(targetId) {
        const noNav = ['login', 'breathe', 'new_reflection', 'wisdom', 'settings'];
        bottomNav.style.display = noNav.includes(targetId) ? 'none' : 'flex';

        currentActiveScreen = targetId;

        // Background Music & Nature Ambiance Control
        if (targetId === 'breathe') {
            MenuMusic.fadeOut(800);
            NatureMusic.fadeOut(800);
            // Ensure notification permissions are requested when entering meditation
            if (window.Capacitor?.Plugins?.LocalNotifications) {
                window.Capacitor.Plugins.LocalNotifications.requestPermissions().catch(() => {});
            }
        } else if (targetId === 'new_reflection') {
            MenuMusic.pause();
            NatureMusic.pause();
        } else if (['home', 'journey', 'reflect', 'profile', 'wisdom', 'settings'].includes(targetId)) {
            MenuMusic.start();
            NatureMusic.start();
            // Flush any pending level up or achievement celebrations when arriving at main views
            setTimeout(() => {
                DB.flushCelebrations();
            }, 300);
        }

        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.target === targetId);
        });

        Object.keys(screens).forEach(id => {
            const screen = screens[id];
            if (id === targetId) {
                screen.classList.add('active');
                if (typeof screen.updateData === 'function') {
                    try { screen.updateData(); }
                    catch(e) { console.error('[Siddha] Error in', id, 'updateData:', e); }
                }
            } else {
                screen.classList.remove('active');
            }
        });
    }

    window.addEventListener('siddha-navigate', (e) => {
        if (e.detail && e.detail.target) {
            navigateTo(e.detail.target);
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.target));
    });

    function handleAuthChange() {
        const user = DB.getUser();
        if (user) {
            DB.checkAndTriggerAchievements(true); // Silent retroactive unlock on startup
            if (!DB.isTutorialCompleted()) {
                navigateTo('home');
                import('./components/onboarding_tutorial.js').then(module => {
                    module.startOnboardingTutorial(() => {
                        navigateTo('home');
                    });
                });
            } else {
                navigateTo('home');
            }
        } else {
            navigateTo('login');
        }
    }

    // Global App Lifecycle Audio Management (Pause all audio when app is backgrounded/minimized)
    let currentActiveScreen = 'home';

    function pauseAllAppAudio() {
        MenuMusic.pause();
        NatureMusic.pause();
    }

    function resumeAppAudioIfAppropriate() {
        if (currentActiveScreen !== 'breathe' && currentActiveScreen !== 'new_reflection') {
            MenuMusic.start();
            NatureMusic.start();
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseAllAppAudio();
        } else {
            resumeAppAudioIfAppropriate();
        }
    });

    window.addEventListener('blur', () => {
        pauseAllAppAudio();
    });

    window.addEventListener('focus', () => {
        resumeAppAudioIfAppropriate();
    });

    if (window.Capacitor?.Plugins?.App) {
        window.Capacitor.Plugins.App.addListener('appStateChange', (state) => {
            if (!state.isActive) {
                pauseAllAppAudio();
            } else {
                resumeAppAudioIfAppropriate();
            }
        });

        // Handle System Back Gesture (Swipe / Hardware Back Button)
        let lastBackPressTime = 0;
        const handleBack = () => {
            // 1. Check for open modals/overlays first
            const avatarModal = document.getElementById('avatar-modal');
            const wisdomReader = document.getElementById('wd-reader-modal');
            const journeyModal = document.getElementById('mission-modal');
            const intentionModal = document.getElementById('intention-modal-overlay');

            if (avatarModal && avatarModal.style.display === 'flex') {
                avatarModal.style.display = 'none';
                return;
            }
            if (wisdomReader && wisdomReader.classList.contains('active')) {
                wisdomReader.querySelector('#wd-reader-close')?.click();
                return;
            }
            if (journeyModal && journeyModal.classList.contains('active')) {
                journeyModal.querySelector('#modal-close')?.click();
                return;
            }
            if (intentionModal && intentionModal.style.display === 'flex') {
                intentionModal.querySelector('#close-intention-modal-btn')?.click();
                return;
            }

            // 2. Handle sub-screen navigation (e.g., Settings -> Profile, New Reflection -> Reflect)
            if (currentActiveScreen === 'settings') {
                navigateTo('profile');
                return;
            }
            if (currentActiveScreen === 'new_reflection') {
                navigateTo('reflect');
                return;
            }

            // 3. Handle main sub-screens or tabs -> Navigate to Home
            if (currentActiveScreen !== 'home' && currentActiveScreen !== 'login') {
                if (currentActiveScreen === 'breathe') {
                    document.getElementById('breathe-close-btn')?.click() || navigateTo('home');
                } else {
                    navigateTo('home');
                }
            } else {
                // 4. If already on Home or Login, require double press within 2 seconds to exit
                const now = Date.now();
                if (now - lastBackPressTime < 2000) {
                    if (window.Capacitor?.Plugins?.App) {
                        window.Capacitor.Plugins.App.exitApp();
                    }
                } else {
                    lastBackPressTime = now;
                    const toast = document.createElement('div');
                    toast.textContent = "Press back again to exit";
                    toast.style.position = 'fixed';
                    toast.style.bottom = '80px';
                    toast.style.left = '50%';
                    toast.style.transform = 'translateX(-50%)';
                    toast.style.backgroundColor = 'rgba(0,0,0,0.85)';
                    toast.style.border = '1px solid rgba(255,255,255,0.15)';
                    toast.style.color = 'white';
                    toast.style.padding = '10px 20px';
                    toast.style.borderRadius = '20px';
                    toast.style.fontSize = '13px';
                    toast.style.fontWeight = '500';
                    toast.style.zIndex = '9999';
                    toast.style.transition = 'opacity 0.3s ease';
                    toast.style.pointerEvents = 'none';
                    document.body.appendChild(toast);
                    
                    setTimeout(() => {
                        toast.style.opacity = '0';
                        setTimeout(() => toast.remove(), 300);
                    }, 1700);
                }
            }
        };

        try {
            if (window.Capacitor?.Plugins?.App) {
                window.Capacitor.Plugins.App.addListener('backButton', handleBack);
            }
        } catch(e) {
            console.warn('[Main] App backButton listener error:', e);
        }
    }

    // Request notification permissions & clean up stale sit notifications on startup
    const requestNotifPermissions = async () => {
        try {
            const LocalNotifications = window.Capacitor?.Plugins?.LocalNotifications;
            if (!LocalNotifications) return;

            const check = await LocalNotifications.checkPermissions();
            if (check.display !== 'granted') {
                await LocalNotifications.requestPermissions();
            }

            const pending = await LocalNotifications.getPending();
            if (pending && pending.notifications && pending.notifications.length > 0) {
                const sitNotifs = pending.notifications.filter(n => n.id === 99 || n.id >= 201);
                if (sitNotifs.length > 0) {
                    await LocalNotifications.cancel({ notifications: sitNotifs });
                }
            }
        } catch (err) {
            console.warn('[Main] Notification setup fallback:', err);
        }
    };
    requestNotifPermissions();

    // Start
    handleAuthChange();
});
