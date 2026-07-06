let audioCtx = null;
let synthNodes = [];
let chimeInterval = null;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

export const Synth = {
    start: (type) => {
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

    playSingleBell: () => {
        try {
            initAudioContext();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(293.66, audioCtx.currentTime); // D4
            
            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.0);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 4.5);
        } catch(e) {
            console.warn("Could not play bell tone:", e);
        }
    }
};
