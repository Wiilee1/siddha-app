import { DB } from '../services/db.js';
import { Synth, MenuMusic, NatureMusic } from '../services/synth.js';
import { HapticService } from '../services/haptics.js';
import { tr, getLang, setLang } from '../services/i18n.js';

export function renderSettings(onBack) {
    const container = document.createElement('div');
    container.className = 'screen scrollable settings-screen';
    const activeLang = getLang();

    container.innerHTML = `
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <button class="icon-btn" id="settings-back-btn" aria-label="${tr('Go back', 'Wróć')}">
                <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <div style="text-align: center;">
                <h1 style="font-size: 20px; margin: 0; font-family: var(--font-heading);">${tr('Settings', 'Ustawienia')}</h1>
                <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">${tr('Language, Audio, Haptics & Privacy', 'Język, Dźwięk, Wibracje i Prywatność')}</p>
            </div>
            <div style="width: 40px;"></div><!-- Spacer for centering -->
        </div>

        <!-- 0. Language Selection Card -->
        <div class="card" style="margin-bottom: 20px; padding: 18px 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 24px;">translate</span>
                    <div>
                        <h3 style="font-size: 15px; margin: 0; font-family: var(--font-heading); color: var(--color-text-primary);">${tr('App Language', 'Język aplikacji')}</h3>
                        <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">${tr('Interface, courses & Wisdom Library', 'Interfejs, kursy i Biblioteka Mądrości')}</p>
                    </div>
                </div>
                <div style="display: inline-flex; gap: 4px; background: var(--color-bg-secondary); padding: 4px; border-radius: 999px; border: 1px solid rgba(134,155,143,0.2);">
                    <button type="button" class="settings-lang-btn" data-lang="pl" style="border:none; padding: 6px 12px; border-radius: 999px; font-size: 11.5px; font-weight: 700; cursor: pointer; background: ${activeLang === 'pl' ? 'var(--color-accent-dark)' : 'transparent'}; color: ${activeLang === 'pl' ? '#fff' : 'var(--color-text-secondary)'};">🇵🇱 PL</button>
                    <button type="button" class="settings-lang-btn" data-lang="en" style="border:none; padding: 6px 12px; border-radius: 999px; font-size: 11.5px; font-weight: 700; cursor: pointer; background: ${activeLang === 'en' ? 'var(--color-accent-dark)' : 'transparent'}; color: ${activeLang === 'en' ? '#fff' : 'var(--color-text-secondary)'};">🇬🇧 EN</button>
                </div>
            </div>
        </div>

        <!-- 1. Audio & Haptics Card -->
        <div class="card" style="margin-bottom: 20px; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 24px;">headphones</span>
                <div>
                    <h3 style="font-size: 15px; margin: 0; font-family: var(--font-heading); color: var(--color-text-primary);">${tr('Audio & Haptics', 'Dźwięk i Wibracje')}</h3>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">${tr('Soundscapes, volumes, UI sounds & vibration', 'Tło dźwiękowe, głośność, dźwięki menu i wibracje')}</p>
                </div>
            </div>

            <!-- Background Menu Music Controls -->
            <div style="margin-bottom: 16px; background: var(--color-bg-secondary); border-radius: 14px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">🎶 ${tr('Background Menu Music', 'Muzyka w tle menu')}</span>
                        <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">${tr('Looping ambient music in main menus', 'Relaksująca muzyka ambient w głównych ekranach')}</p>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox" id="toggle-bg-music" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div id="bg-music-options-wrap" style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px; padding-top: 10px; border-top: 1px rgba(0,0,0,0.06) solid;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary);">${tr('Select Track', 'Wybierz utwór')}</span>
                        <select id="select-bg-music-track" style="padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); font-size: 11.5px; font-weight: 600; background: var(--color-bg-card); color: var(--color-text-primary); outline: none; font-family: inherit; cursor: pointer;">
                            <option value="cycle">🔄 ${tr('Cycle All 3 Tracks', 'Odtwarzaj kolejno wszystkie 3')}</option>
                            <option value="himalayan">🏔️ ${tr('Himalayan Sanctuary', 'Himalajskie Sanktuarium')}</option>
                            <option value="temple_wind">🍃 ${tr('Temple Wind Echoes', 'Wiatr w Świątyni')}</option>
                            <option value="fairytale_harp">🎶 ${tr('Fairytale Harp', 'Baśniowa Harfa')}</option>
                        </select>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span class="material-symbols-rounded" style="font-size: 16px; color: var(--color-text-muted);">volume_up</span>
                            <span style="font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary);">${tr('Music Volume', 'Głośność muzyki')}</span>
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
                        <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">🌿 ${tr('Nature Sound Ambiance', 'Odgłosy natury')}</span>
                        <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">${tr('Birds & stream background soundscapes', 'Śpiew ptaków i szum strumienia w tle')}</p>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox" id="toggle-nature-sound">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div id="nature-sound-options-wrap" style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px; padding-top: 10px; border-top: 1px rgba(0,0,0,0.06) solid;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary);">${tr('Select Ambiance', 'Wybierz dźwięki natury')}</span>
                        <select id="select-nature-sound-track" style="padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); font-size: 11.5px; font-weight: 600; background: var(--color-bg-card); color: var(--color-text-primary); outline: none; font-family: inherit; cursor: pointer;">
                            <option value="water_stream">🏞️ ${tr('Water Stream & Creek', 'Górski Potok i Strumień')}</option>
                            <option value="birds_calm_river">🌳 ${tr('Birds & Calm River', 'Ptaki i Spokojna Rzeka')}</option>
                            <option value="cycle">🔄 ${tr('Cycle All Nature Sounds', 'Odtwarzaj kolejno odgłosy natury')}</option>
                        </select>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span class="material-symbols-rounded" style="font-size: 16px; color: var(--color-text-muted);">volume_up</span>
                            <span style="font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary);">${tr('Ambiance Volume', 'Głośność natury')}</span>
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
                    <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">📳 ${tr('Haptics & Vibration', 'Haptyka i Wibracje')}</span>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">${tr('Tactile pulses on iOS, Android & web', 'Delikatne wibracje zwrotne w aplikacji')}</p>
                </div>
                <label class="switch-toggle">
                    <input type="checkbox" id="toggle-vibration" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <!-- Meditation Sound Toggle -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid var(--color-bg-secondary);">
                <div>
                    <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">🧘 ${tr('Meditation Bells & Ambient', 'Dzwonki medytacyjne i tło')}</span>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">${tr('Sit interval bells & soundscapes', 'Dzwonki interwałowe oraz gong na start i koniec')}</p>
                </div>
                <label class="switch-toggle">
                    <input type="checkbox" id="toggle-meditation-sound" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <!-- Menu / UI Sound Toggle -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--color-bg-secondary);">
                <div>
                    <span style="font-weight: 600; font-size: 12.5px; color: var(--color-text-primary);">🎵 ${tr('Menu & Navigation Sounds', 'Dźwięki menu i nawigacji')}</span>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">${tr('UI clicks & feedback audio', 'Dźwięki przycisków i powiadomień')}</p>
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
                    ${tr('Android Battery Saver Note', 'Wskazówka dot. oszczędzania baterii (Android)')}
                </h4>
                <p style="font-size: 10.5px; color: #856404; margin: 0; line-height: 1.4;">
                    ${tr(
                        'If meditation bells don\'t ring while your phone is locked, please disable <strong>"Battery Optimization"</strong> for Siddha in your Android system settings.',
                        'Jeśli dzwonki medytacyjne nie dzwonią przy zablokowanym ekranie, wyłącz <strong>„Optymalizację baterii”</strong> dla aplikacji Siddha w ustawieniach systemu Android.'
                    )}
                </p>
            </div>
        </div>

        <!-- 2. Privacy & Account Card -->
        <div class="card" style="margin-bottom: 32px; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                <span class="material-symbols-rounded" style="color: var(--color-accent); font-size: 24px;">security</span>
                <div>
                    <h3 style="font-size: 15px; margin: 0; font-family: var(--font-heading); color: var(--color-text-primary);">${tr('Privacy & Account', 'Prywatność i Konto')}</h3>
                    <p class="text-sm" style="color: var(--color-text-muted); font-size: 11px; margin: 2px 0 0;">${tr('Manage your data & privacy options', 'Zarządzaj swoimi danymi i prywatnością')}</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="open-privacy-policy-btn" style="background: var(--color-bg-secondary); border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; padding: 10px; font-size: 12px; font-weight: 600; color: var(--color-text-primary); cursor: pointer; display: flex; align-items: center; gap: 8px; justify-content: center;">
                    <span class="material-symbols-rounded" style="font-size: 18px; color: var(--color-accent);">policy</span>
                    ${tr('View Privacy Policy', 'Polityka Prywatności')}
                </button>

                <button id="reset-account-btn" style="background: transparent; border: 1px dashed #ff6b6b; border-radius: 10px; padding: 10px; font-size: 12px; font-weight: 600; color: #ff6b6b; cursor: pointer; display: flex; align-items: center; gap: 8px; justify-content: center;">
                    <span class="material-symbols-rounded" style="font-size: 18px;">delete_forever</span>
                    ${tr('Reset Account & Delete All Data', 'Zresetuj konto i usuń wszystkie dane')}
                </button>
            </div>
        </div>
    `;

    setTimeout(() => {
        // Language Switcher
        container.querySelectorAll('.settings-lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Synth.playMenuClick();
                const chosen = btn.dataset.lang;
                if (chosen && chosen !== getLang()) {
                    try { sessionStorage.setItem('siddha_return_screen', 'settings'); } catch (e) {}
                    setLang(chosen, true);
                }
            });
        });

        // Back Button
        const backBtn = container.querySelector('#settings-back-btn');
        if (backBtn && onBack) {
            backBtn.addEventListener('click', () => {
                Synth.playMenuClick();
                onBack();
            });
        }

        // Init Settings Toggles & Values
        const notifSettings = DB.getNotificationSettings();

        // 1. Audio Controls
        const toggleBgMusic = container.querySelector('#toggle-bg-music');
        const bgMusicWrap = container.querySelector('#bg-music-options-wrap');
        const selectBgTrack = container.querySelector('#select-bg-music-track');
        const sliderBgVol = container.querySelector('#slider-bg-music-volume');
        const labelBgVol = container.querySelector('#label-bg-music-volume');

        const toggleNature = container.querySelector('#toggle-nature-sound');
        const natureWrap = container.querySelector('#nature-sound-options-wrap');
        const selectNatureTrack = container.querySelector('#select-nature-sound-track');
        const sliderNatureVol = container.querySelector('#slider-nature-volume');
        const labelNatureVol = container.querySelector('#label-nature-volume');

        const toggleVibration = container.querySelector('#toggle-vibration');
        const toggleMeditationSound = container.querySelector('#toggle-meditation-sound');
        const toggleMenuSound = container.querySelector('#toggle-menu-sound');

        if (toggleBgMusic) {
            toggleBgMusic.checked = MenuMusic.isEnabled();
            bgMusicWrap.style.display = toggleBgMusic.checked ? 'flex' : 'none';
            toggleBgMusic.addEventListener('change', (e) => {
                const val = e.target.checked;
                bgMusicWrap.style.display = val ? 'flex' : 'none';
                DB.setNotificationSettings({ bgMusicEnabled: val });
                MenuMusic.setEnabled(val);
            });
        }

        if (selectBgTrack) {
            selectBgTrack.value = notifSettings.bgMusicTrack || 'cycle';
            selectBgTrack.addEventListener('change', (e) => {
                const track = e.target.value;
                DB.setNotificationSettings({ bgMusicTrack: track });
                MenuMusic.setTrack(track);
            });
        }

        if (sliderBgVol && labelBgVol) {
            const initialVolPct = Math.round((notifSettings.bgMusicVolume != null ? notifSettings.bgMusicVolume : 0.25) * 100);
            sliderBgVol.value = initialVolPct;
            labelBgVol.textContent = `${initialVolPct}%`;

            sliderBgVol.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                labelBgVol.textContent = `${val}%`;
                const normVol = val / 100;
                DB.setNotificationSettings({ bgMusicVolume: normVol });
                MenuMusic.setVolume(normVol);
            });
        }

        if (toggleNature) {
            toggleNature.checked = NatureMusic.isEnabled();
            natureWrap.style.display = toggleNature.checked ? 'flex' : 'none';
            toggleNature.addEventListener('change', (e) => {
                const val = e.target.checked;
                natureWrap.style.display = val ? 'flex' : 'none';
                DB.setNotificationSettings({ natureSoundEnabled: val });
                NatureMusic.setEnabled(val);
            });
        }

        if (selectNatureTrack) {
            selectNatureTrack.value = notifSettings.natureSoundTrack || 'water_stream';
            selectNatureTrack.addEventListener('change', (e) => {
                const track = e.target.value;
                DB.setNotificationSettings({ natureSoundTrack: track });
                NatureMusic.setTrack(track);
            });
        }

        if (sliderNatureVol && labelNatureVol) {
            const initialNatPct = Math.round((notifSettings.natureSoundVolume != null ? notifSettings.natureSoundVolume : 0.35) * 100);
            sliderNatureVol.value = initialNatPct;
            labelNatureVol.textContent = `${initialNatPct}%`;

            sliderNatureVol.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                labelNatureVol.textContent = `${val}%`;
                const normVol = val / 100;
                DB.setNotificationSettings({ natureSoundVolume: normVol });
                NatureMusic.setVolume(normVol);
            });
        }

        if (toggleVibration) {
            toggleVibration.checked = notifSettings.vibrationEnabled !== false;
            toggleVibration.addEventListener('change', (e) => {
                const val = e.target.checked;
                DB.setNotificationSettings({ vibrationEnabled: val });
                if (val) HapticService.vibrate('light');
            });
        }

        if (toggleMeditationSound) {
            toggleMeditationSound.checked = localStorage.getItem('siddha_sound_meditation_muted') !== 'true';
            toggleMeditationSound.addEventListener('change', (e) => {
                const isMuted = !e.target.checked;
                localStorage.setItem('siddha_sound_meditation_muted', isMuted);
                DB.setNotificationSettings({ meditationSoundEnabled: !isMuted });
            });
        }

        if (toggleMenuSound) {
            toggleMenuSound.checked = localStorage.getItem('siddha_sound_menu_muted') !== 'true';
            toggleMenuSound.addEventListener('change', (e) => {
                const isMuted = !e.target.checked;
                localStorage.setItem('siddha_sound_menu_muted', isMuted);
                DB.setNotificationSettings({ menuSoundEnabled: !isMuted });
            });
        }

        // Privacy Policy
        const privacyBtn = container.querySelector('#open-privacy-policy-btn');
        if (privacyBtn) {
            privacyBtn.addEventListener('click', () => {
                Synth.playMenuClick();
                window.open('./src/privacy_policy.html', '_blank');
            });
        }

        // Reset Account
        const resetBtn = container.querySelector('#reset-account-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                Synth.playMenuClick();
                if (confirm(tr('Are you sure you want to reset your account? All XP, levels, streak and progress will be deleted!', 'Czy na pewno chcesz zresetować swoje konto? Całe doświadczenie (XP), poziomy, seria dni i postępy zostaną usunięte!'))) {
                    const savedLang = getLang();
                    localStorage.clear();
                    localStorage.setItem('siddha_lang', savedLang);
                    window.location.reload();
                }
            });
        }
    }, 50);

    return container;
}
