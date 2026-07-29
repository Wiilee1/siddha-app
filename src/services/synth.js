

let audioCtx = null;
let synthNodes = [];
let chimeInterval = null;

let silentAudioEl = null;

const BELL_SOURCES = {
    start: './src/assets/audio/start_bell.mp3',
    interval: './src/assets/audio/interval_bell.mp3',
    end: './src/assets/audio/end_bell.mp3'
};

const BELL_AUDIO = {
    start: null,
    interval: null,
    end: null
};

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function ensureSilentKeepAlive() {
    try {
        if (!silentAudioEl) {
            // High-reliability 30-second silent WAV loop with proper header alignment
            silentAudioEl = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
            silentAudioEl.loop = true;
            silentAudioEl.volume = 0.0001;
        }
        silentAudioEl.play().catch(() => {});
        if ('mediaSession' in navigator) {
            try {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: 'Meditation Sit 🧘',
                    artist: 'Siddha Mindfulness',
                    album: 'Mindful Practice'
                });
                navigator.mediaSession.playbackState = 'playing';
            } catch(e) {}
        }
    } catch(e) {}
}

function stopSilentKeepAlive() {
    if (silentAudioEl) {
        try {
            silentAudioEl.pause();
            silentAudioEl.currentTime = 0;
        } catch(e) {}
    }
    if ('mediaSession' in navigator) {
        try {
            navigator.mediaSession.playbackState = 'paused';
        } catch(e) {}
    }
}

function playBellAudioWithFade(audioKey, fadeAfterMs = 4500, fadeDurationMs = 2000) {
    if (localStorage.getItem('siddha_sound_meditation_muted') === 'true' || localStorage.getItem('siddha_sound_muted') === 'true') return;
    try {
        if (!BELL_AUDIO[audioKey]) {
            BELL_AUDIO[audioKey] = new Audio(BELL_SOURCES[audioKey]);
            BELL_AUDIO[audioKey].preload = 'auto';
        }
        const audio = BELL_AUDIO[audioKey];

        // Reset state
        if (audio.fadeInterval) clearInterval(audio.fadeInterval);
        if (audio.fadeTimeout) clearTimeout(audio.fadeTimeout);

        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
        audio.volume = getScaledGain(0.75);

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.warn(`[Synth] ${audioKey} bell play blocked:`, e);
            });
        }

        // Clear any existing fade timeouts/intervals if we play again
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
    } catch(e) {
        console.warn('[Synth] Error playing bell:', e);
    }
}

export const Synth = {
    ensureKeepAlive: () => {
        initAudioContext();
        ensureSilentKeepAlive();
    },
    stopKeepAlive: () => {
        stopSilentKeepAlive();
    },
    start: (type) => {
        if (window.Capacitor?.getPlatform() === 'ios') {
            console.log('[Synth iOS] Soundscapes are disabled on iOS:', type);
            return;
        }

        initAudioContext();
        Synth.stop();

        if (!type || type === 'none') return;

        try {
            if (type === 'cosmic-drone' || type === 'drone') {
                // Binaural delta beat (110Hz and 110.5Hz)
                const osc1 = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const gain1 = audioCtx.createGain();
                const gain2 = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();

                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(110, audioCtx.currentTime);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(110.5, audioCtx.currentTime);

                gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(180, audioCtx.currentTime);

                osc1.connect(gain1);
                osc2.connect(gain2);
                gain1.connect(filter);
                gain2.connect(filter);
                filter.connect(audioCtx.destination);

                osc1.start();
                osc2.start();

                synthNodes.push(osc1, osc2, gain1, gain2, filter);
            } 
            else if (type === 'rain') {
                // Rain using white noise and bandpass filter
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
                filter.type = 'bandpass';
                filter.frequency.value = 1000;
                filter.Q.value = 0.5;

                const gainNode = audioCtx.createGain();
                gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);

                noiseNode.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                noiseNode.start();
                synthNodes.push(noiseNode, filter, gainNode);
            }
            else if (type === 'ocean-waves' || type === 'waves') {
                // Ocean waves using filtered white noise modulated by a very slow LFO
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
                filter.type = 'lowpass';
                filter.frequency.value = 350;

                const gainNode = audioCtx.createGain();
                gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);

                // LFO volume swell modulator (8 seconds per wave: 0.12 Hz)
                const lfo = audioCtx.createOscillator();
                lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime);
                
                const lfoGain = audioCtx.createGain();
                lfoGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

                lfo.connect(lfoGain);
                lfoGain.connect(gainNode.gain); // modulate noise gain

                noiseNode.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                noiseNode.start();
                lfo.start();
                
                synthNodes.push(noiseNode, filter, gainNode, lfo, lfoGain);
            }
            else if (type === 'singing-bowls' || type === 'bowls') {
                // Tibetan Singing Bowls: low base drone + randomized crystal chime bells
                const baseDrone = audioCtx.createOscillator();
                const baseGain = audioCtx.createGain();
                baseDrone.type = 'sine';
                baseDrone.frequency.setValueAtTime(220, audioCtx.currentTime);
                baseGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
                
                baseDrone.connect(baseGain);
                baseGain.connect(audioCtx.destination);
                baseDrone.start();
                synthNodes.push(baseDrone, baseGain);

                const frequencies = [440, 554, 659, 880];
                
                function playChime() {
                    if (!audioCtx || audioCtx.state === 'closed') return;
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                    
                    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 6.0);

                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.start();
                    osc.stop(audioCtx.currentTime + 6.5);
                }

                playChime();
                chimeInterval = setInterval(playChime, 15000);
            }
        } catch (e) {
            console.warn("Web Audio API failed or blocked: ", e);
        }
    },

    stop: () => {
        if (window.Capacitor?.getPlatform() === 'ios') return;

        if (chimeInterval) {
            clearInterval(chimeInterval);
            chimeInterval = null;
        }
        
        synthNodes.forEach(node => {
            try {
                node.stop();
            } catch (err) {}
            try {
                node.disconnect();
            } catch (err) {}
        });
        synthNodes = [];
    },

    playStartBell: () => {
        if (localStorage.getItem('siddha_sound_meditation_muted') === 'true' || localStorage.getItem('siddha_sound_muted') === 'true') return;
        if (!BELL_AUDIO.start) {
            BELL_AUDIO.start = new Audio(BELL_SOURCES.start);
            BELL_AUDIO.start.preload = 'auto';
        }
        playBellAudioWithFade('start', 0, 0); // Plays full 7s start bell naturally
    },

    playIntervalBell: () => {
        playBellAudioWithFade('interval', 0, 0); // Plays full 5s awareness bell naturally
    },

    playEndBell: () => {
        // End bell: Plays all 3 full built-in chimes naturally across 30 seconds
        playBellAudioWithFade('end', 0, 0);
    },

    primeBells: () => {
        // Call this when user starts a session to authorize background playback
        Object.keys(BELL_SOURCES).forEach(key => {
            if (!BELL_AUDIO[key]) {
                const audio = new Audio(BELL_SOURCES[key]);
                audio.preload = 'auto';
                BELL_AUDIO[key] = audio;
            }
            const audio = BELL_AUDIO[key];
            if (audio.paused) {
                audio.muted = true;
                const p = audio.play();
                if (p !== undefined) {
                    p.then(() => {
                        audio.pause();
                        audio.muted = false;
                    }).catch(() => {});
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
        if (localStorage.getItem('siddha_sound_menu_muted') === 'true') return;
        try {
            initAudioContext();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        } catch(e) {}
    },

    playLevelUpChime: () => {
        if (localStorage.getItem('siddha_sound_menu_muted') === 'true') return;
        try {
            initAudioContext();
            const now = audioCtx.currentTime;
            const freqs = [523.25, 783.99, 1046.50]; // C5 -> G5 -> C6
            
            freqs.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const startTime = now + (idx * 0.14);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.001, startTime);
                gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.6);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(startTime);
                osc.stop(startTime + 1.6);
            });
        } catch(e) {}
    },

    playQuestClaimSound: () => {
        if (localStorage.getItem('siddha_sound_menu_muted') === 'true') return;
        try {
            initAudioContext();
            const now = audioCtx.currentTime;
            const freqs = [659.25, 987.77]; // E5 -> B5
            
            freqs.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const startTime = now + (idx * 0.08);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.001, startTime);
                gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.45);
            });
        } catch(e) {}
    },

    playStreakGongSound: () => {
        if (localStorage.getItem('siddha_sound_menu_muted') === 'true') return;
        try {
            initAudioContext();
            const now = audioCtx.currentTime;
            
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            const gain2 = audioCtx.createGain();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(108, now);

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(216, now);

            gain1.gain.setValueAtTime(0.001, now);
            gain1.gain.exponentialRampToValueAtTime(0.25, now + 0.06);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

            gain2.gain.setValueAtTime(0.001, now);
            gain2.gain.exponentialRampToValueAtTime(0.10, now + 0.06);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

            osc1.connect(gain1);
            osc2.connect(gain2);
            gain1.connect(audioCtx.destination);
            gain2.connect(audioCtx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 4.5);
            osc2.stop(now + 3.2);
        } catch(e) {}
    },

    playSliderTick: () => {
        if (localStorage.getItem('siddha_sound_menu_muted') === 'true') return;
        try {
            initAudioContext();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.03, now + 0.004);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.02);
        } catch(e) {}
    },

    playSankalpaHum: () => {
        if (localStorage.getItem('siddha_sound_meditation_muted') === 'true' || localStorage.getItem('siddha_sound_muted') === 'true') return;
        try {
            initAudioContext();
            const now = audioCtx.currentTime;
            
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(174, now);
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(261, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.12, now + 0.6);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 3.2);
            osc2.stop(now + 3.2);
        } catch(e) {}
    }
};

// Logarithmic exponential gain scaling (maps 0.0-1.0 slider to ultra-gentle 0.0-0.08 max gain)
function getScaledGain(rawVol) {
    const v = Math.max(0, Math.min(1, parseFloat(rawVol)));
    if (v === 0) return 0;
    // Logarithmic curve: 1% gives ~0.00002 (whisper quiet), 100% gives 0.08 (gentle ambient)
    return Math.pow(v, 2.4) * 0.08;
}

const MENU_TRACKS = [
    { id: 'himalayan', name: 'Himalayan Sanctuary', src: './src/assets/audio/himalayan_sanctuary.mp3' },
    { id: 'temple_wind', name: 'Temple Wind Echoes', src: './src/assets/audio/temple_wind_echoes.mp3' },
    { id: 'fairytale_harp', name: 'Fairytale Harp', src: './src/assets/audio/fairytale_harp.mp3' }
];

let bgAudioEl = null;
let currentTrackIdx = 0;

export const MenuMusic = {
    tracks: MENU_TRACKS,

    init: () => {
        if (bgAudioEl) return;
        bgAudioEl = new Audio();
        bgAudioEl.preload = 'auto';

        bgAudioEl.addEventListener('ended', () => {
            const trackPref = localStorage.getItem('siddha_bg_music_track') || 'cycle';
            if (trackPref === 'cycle') {
                currentTrackIdx = (currentTrackIdx + 1) % MENU_TRACKS.length;
                MenuMusic.playTrack(currentTrackIdx);
            } else {
                bgAudioEl.currentTime = 0;
                bgAudioEl.play().catch(() => {});
            }
        });

        const enableAutoplay = () => {
            if (localStorage.getItem('siddha_bg_music_enabled') !== 'false') {
                MenuMusic.start();
            }
            window.removeEventListener('click', enableAutoplay);
            window.removeEventListener('touchstart', enableAutoplay);
        };
        window.addEventListener('click', enableAutoplay, { once: true });
        window.addEventListener('touchstart', enableAutoplay, { once: true });
    },

    getVolume: () => {
        const stored = localStorage.getItem('siddha_bg_music_volume');
        return stored !== null ? parseFloat(stored) : 0.25;
    },

    setVolume: (vol) => {
        const clamped = Math.max(0, Math.min(1, parseFloat(vol)));
        localStorage.setItem('siddha_bg_music_volume', clamped);
        if (bgAudioEl) {
            bgAudioEl.volume = getScaledGain(clamped);
        }
    },

    isEnabled: () => {
        return localStorage.getItem('siddha_bg_music_enabled') !== 'false';
    },

    setEnabled: (enabled) => {
        localStorage.setItem('siddha_bg_music_enabled', enabled ? 'true' : 'false');
        if (enabled) {
            MenuMusic.start();
        } else {
            MenuMusic.pause();
        }
    },

    getSelectedTrackId: () => {
        return localStorage.getItem('siddha_bg_music_track') || 'cycle';
    },

    setSelectedTrackId: (trackId) => {
        localStorage.setItem('siddha_bg_music_track', trackId);
        if (trackId === 'cycle') {
            currentTrackIdx = 0;
        } else {
            const idx = MENU_TRACKS.findIndex(t => t.id === trackId);
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
        bgAudioEl.loop = trackPref !== 'cycle';

        if (MenuMusic.isEnabled()) {
            bgAudioEl.play().catch(() => {});
        }
    },

    start: () => {
        if (!MenuMusic.isEnabled()) return;
        if (!bgAudioEl) MenuMusic.init();

        const trackPref = MenuMusic.getSelectedTrackId();
        if (trackPref !== 'cycle') {
            const idx = MENU_TRACKS.findIndex(t => t.id === trackPref);
            if (idx !== -1) currentTrackIdx = idx;
        }

        if (!bgAudioEl.src || bgAudioEl.ended || bgAudioEl.paused) {
            MenuMusic.playTrack(currentTrackIdx);
        } else {
            bgAudioEl.volume = getScaledGain(MenuMusic.getVolume());
            bgAudioEl.play().catch(() => {});
        }
    },

    pause: () => {
        if (bgAudioEl) {
            bgAudioEl.pause();
        }
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

const NATURE_TRACKS = [
    { id: 'water_stream', name: 'Water Stream & Creek', src: './src/assets/audio/water_stream.mp3' },
    { id: 'birds_calm_river', name: 'Birds & Calm River', src: './src/assets/audio/birds_calm_river.mp3' }
];

let natureAudioEl = null;
let currentNatureIdx = 0;

export const NatureMusic = {
    tracks: NATURE_TRACKS,

    init: () => {
        if (natureAudioEl) return;
        natureAudioEl = new Audio();
        natureAudioEl.preload = 'auto';

        natureAudioEl.addEventListener('ended', () => {
            const trackPref = localStorage.getItem('siddha_nature_music_track') || 'water_stream';
            if (trackPref === 'cycle') {
                currentNatureIdx = (currentNatureIdx + 1) % NATURE_TRACKS.length;
                NatureMusic.playTrack(currentNatureIdx);
            } else {
                natureAudioEl.currentTime = 0;
                natureAudioEl.play().catch(() => {});
            }
        });

        const enableAutoplay = () => {
            if (localStorage.getItem('siddha_nature_music_enabled') === 'true') {
                NatureMusic.start();
            }
            window.removeEventListener('click', enableAutoplay);
            window.removeEventListener('touchstart', enableAutoplay);
        };
        window.addEventListener('click', enableAutoplay, { once: true });
        window.addEventListener('touchstart', enableAutoplay, { once: true });
    },

    getVolume: () => {
        const stored = localStorage.getItem('siddha_nature_music_volume');
        return stored !== null ? parseFloat(stored) : 0.35;
    },

    setVolume: (vol) => {
        const clamped = Math.max(0, Math.min(1, parseFloat(vol)));
        localStorage.setItem('siddha_nature_music_volume', clamped);
        if (natureAudioEl) {
            natureAudioEl.volume = getScaledGain(clamped);
        }
    },

    isEnabled: () => {
        return localStorage.getItem('siddha_nature_music_enabled') === 'true';
    },

    setEnabled: (enabled) => {
        localStorage.setItem('siddha_nature_music_enabled', enabled ? 'true' : 'false');
        if (enabled) {
            NatureMusic.start();
        } else {
            NatureMusic.pause();
        }
    },

    getSelectedTrackId: () => {
        return localStorage.getItem('siddha_nature_music_track') || 'water_stream';
    },

    setSelectedTrackId: (trackId) => {
        localStorage.setItem('siddha_nature_music_track', trackId);
        if (trackId === 'cycle') {
            currentNatureIdx = 0;
        } else {
            const idx = NATURE_TRACKS.findIndex(t => t.id === trackId);
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
        natureAudioEl.loop = trackPref !== 'cycle';

        if (NatureMusic.isEnabled()) {
            natureAudioEl.play().catch(() => {});
        }
    },

    start: () => {
        if (!NatureMusic.isEnabled()) return;
        if (!natureAudioEl) NatureMusic.init();

        const trackPref = NatureMusic.getSelectedTrackId();
        if (trackPref !== 'cycle') {
            const idx = NATURE_TRACKS.findIndex(t => t.id === trackPref);
            if (idx !== -1) currentNatureIdx = idx;
        }

        if (!natureAudioEl.src || natureAudioEl.ended || natureAudioEl.paused) {
            NatureMusic.playTrack(currentNatureIdx);
        } else {
            natureAudioEl.volume = getScaledGain(NatureMusic.getVolume());
            natureAudioEl.play().catch(() => {});
        }
    },

    pause: () => {
        if (natureAudioEl) {
            natureAudioEl.pause();
        }
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

export const SitAudioKeepAlive = {
    start: () => {
        ensureSilentKeepAlive();
    },
    stop: () => {
        stopSilentKeepAlive();
    }
};

Synth.SitAudioKeepAlive = SitAudioKeepAlive;


