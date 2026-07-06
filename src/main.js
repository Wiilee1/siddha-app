import { renderHome } from './screens/home.js';
import { renderJourney } from './screens/journey.js';
import { renderBreathe } from './screens/breathe.js';
import { renderReflect } from './screens/reflect.js';
import { renderLogin } from './screens/login.js';
import { renderProfile } from './screens/profile.js';
import { renderNewReflection } from './screens/new_reflection.js';
import { DB } from './services/db.js';
import './components/levelup_celebration.js';

document.addEventListener('DOMContentLoaded', () => {
    const screenContainer = document.getElementById('screen-container');
    const navItems = document.querySelectorAll('.nav-item');
    const bottomNav = document.querySelector('.bottom-nav');

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
        profile: renderProfile(),
        new_reflection: renderNewReflection(() => {
            // After saving reflection → go to reflect tab
            navigateTo('reflect');
        })
    };

    // Append all screens
    Object.values(screens).forEach(screen => {
        screenContainer.appendChild(screen);
    });

    // Navigation
    function navigateTo(targetId) {
        const noNav = ['login', 'breathe', 'new_reflection'];
        bottomNav.style.display = noNav.includes(targetId) ? 'none' : 'flex';

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

    navItems.forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.target));
    });

    function handleAuthChange() {
        const user = DB.getUser();
        navigateTo(user ? 'home' : 'login');
    }

    // Start
    handleAuthChange();
});
