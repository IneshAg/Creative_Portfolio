/**
 * Procedural Web Audio Engine for Inesh Agarwal Portfolio
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  
  // Audio Node Network
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private chaosMusicGain: GainNode | null = null;
  private dataMatrixGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;
  private corruptionGain: GainNode | null = null;
  private abyssGain: GainNode | null = null;

  private filterNode: BiquadFilterNode | null = null;
  private corruptionFilter: BiquadFilterNode | null = null;
  private distortionNode: WaveShaperNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private analyser: AnalyserNode | null = null;

  // HTML Audio Elements (Streaming for instant playback)
  private peacefulAudio: HTMLAudioElement | null = null;
  private chaosAudio: HTMLAudioElement | null = null;
  private dataAudio: HTMLAudioElement | null = null;
  private isAudioElementsInitialized: boolean = false;

  // Cached Audio Buffers for procedural effects
  private whiteNoiseBuffer: AudioBuffer | null = null;
  private pinkNoiseBuffer: AudioBuffer | null = null;
  private clickBuffer: AudioBuffer | null = null;

  // Active sources & timers
  private vinylSource: AudioBufferSourceNode | null = null;
  private corruptionNoiseSource: AudioBufferSourceNode | null = null;
  private activeProgress: number = 0;

  // Abyss Drone
  private abyssOsc1: OscillatorNode | null = null;
  private abyssOsc2: OscillatorNode | null = null;

  private tracks = [
    { name: 'TO BUILD A HOME', code: 'SIGNAL_01 // PIANO & RAIN' },
    { name: 'BIPOLAR', code: 'SIGNAL_02 // DIEDLONELY' },
    { name: 'APATHY', code: 'SIGNAL_03 // ONEHEART' }
  ];
  private currentTrackIndex = 0;

  public init() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtxClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.82;

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(1800, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.8, this.ctx.currentTime);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    
    this.chaosMusicGain = this.ctx.createGain();
    this.chaosMusicGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    
    this.dataMatrixGain = this.ctx.createGain();
    this.dataMatrixGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

    this.corruptionGain = this.ctx.createGain();
    this.corruptionGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.abyssGain = this.ctx.createGain();
    this.abyssGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.corruptionFilter = this.ctx.createBiquadFilter();
    this.corruptionFilter.type = 'bandpass';
    this.corruptionFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
    this.corruptionFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.distortionNode = this.ctx.createWaveShaper();
    this.distortionNode.curve = this.generateDistortionCurve(50) as any;
    this.distortionNode.oversample = '4x';

    if (this.ctx.createStereoPanner) {
      this.pannerNode = this.ctx.createStereoPanner();
      this.pannerNode.pan.setValueAtTime(0, this.ctx.currentTime);
    }

    // Wiring
    this.musicGain.connect(this.filterNode);
    this.vinylGain.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);
    
    this.chaosMusicGain.connect(this.masterGain);
    this.dataMatrixGain.connect(this.masterGain);

    this.corruptionGain.connect(this.distortionNode);
    this.distortionNode.connect(this.corruptionFilter);
    
    if (this.pannerNode) {
      this.corruptionFilter.connect(this.pannerNode);
      this.abyssGain.connect(this.pannerNode);
      this.pannerNode.connect(this.masterGain);
    } else {
      this.corruptionFilter.connect(this.masterGain);
      this.abyssGain.connect(this.masterGain);
    }

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.buildNoiseBuffers();
    this.initAudioElements();
  }

  private initAudioElements() {
    if (this.isAudioElementsInitialized || !this.ctx) return;
    this.isAudioElementsInitialized = true;

    // Use HTMLAudioElement to stream large files instantly without waiting for full download!
    this.peacefulAudio = new Audio('/assets/to_build_a_home.mp3');
    this.peacefulAudio.loop = true;
    this.peacefulAudio.crossOrigin = 'anonymous';

    this.chaosAudio = new Audio('/assets/bipolar.mp3');
    this.chaosAudio.loop = true;
    this.chaosAudio.crossOrigin = 'anonymous';

    this.dataAudio = new Audio('/assets/data_matrix.mp3');
    this.dataAudio.loop = true;
    this.dataAudio.crossOrigin = 'anonymous';

    const pSource = this.ctx.createMediaElementSource(this.peacefulAudio);
    pSource.connect(this.musicGain!);

    const cSource = this.ctx.createMediaElementSource(this.chaosAudio);
    cSource.connect(this.chaosMusicGain!);

    const dSource = this.ctx.createMediaElementSource(this.dataAudio);
    dSource.connect(this.dataMatrixGain!);
  }

  private startMusicPlayback() {
    if (this.peacefulAudio) {
      this.peacefulAudio.play().catch(e => console.error('Failed to play peaceful:', e));
    }
    if (this.chaosAudio) {
      this.chaosAudio.play().catch(e => console.error('Failed to play chaos:', e));
    }
    if (this.dataAudio) {
      // Safely set currentTime
      const playData = () => {
        if (this.dataAudio!.readyState >= 1) {
          this.dataAudio!.currentTime = 45;
          this.dataAudio!.play().catch(e => console.error('Failed to play data:', e));
        } else {
          this.dataAudio!.addEventListener('loadedmetadata', () => {
            this.dataAudio!.currentTime = 45;
            this.dataAudio!.play().catch(e => console.error('Failed to play data:', e));
          }, { once: true });
          // Also try triggering load
          this.dataAudio!.load();
        }
      };
      playData();
    }
  }

  private pauseMusicPlayback() {
    if (this.peacefulAudio) this.peacefulAudio.pause();
    if (this.chaosAudio) this.chaosAudio.pause();
    if (this.dataAudio) this.dataAudio.pause();
  }

  private buildNoiseBuffers() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; 
    
    this.whiteNoiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const whiteOutput = this.whiteNoiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      whiteOutput[i] = Math.random() * 2 - 1;
    }

    this.pinkNoiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const pinkOutput = this.pinkNoiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      pinkOutput[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      pinkOutput[i] *= 0.11;
      b6 = white * 0.115926;
    }

    this.clickBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
    const clickOutput = this.clickBuffer.getChannelData(0);
    for (let i = 0; i < this.clickBuffer.length; i++) {
      clickOutput[i] = i < 100 ? (Math.random() * 2 - 1) * 0.8 : 0;
    }
  }

  private generateDistortionCurve(amount: number) {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = i * 2 / n_samples - 1;
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  private startVinylCrackle() {
    if (!this.ctx || !this.vinylGain || !this.pinkNoiseBuffer || !this.clickBuffer) return;
    
    if (this.vinylSource) {
      try { this.vinylSource.stop(); this.vinylSource.disconnect(); } catch(e) {}
    }

    this.vinylSource = this.ctx.createBufferSource();
    this.vinylSource.buffer = this.pinkNoiseBuffer;
    this.vinylSource.loop = true;
    
    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = 'lowpass';
    vinylFilter.frequency.value = 1100;

    this.vinylSource.connect(vinylFilter);
    vinylFilter.connect(this.vinylGain);
    this.vinylSource.start();

    // Random pops
    const popInterval = setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.vinylGain || !this.clickBuffer) {
        clearInterval(popInterval);
        return;
      }
      if (Math.random() > 0.4 && this.activeProgress < 0.6) {
        const popSource = this.ctx.createBufferSource();
        popSource.buffer = this.clickBuffer;
        
        const popGain = this.ctx.createGain();
        popGain.gain.value = 0.02 + Math.random() * 0.05;
        
        const popFilter = this.ctx.createBiquadFilter();
        popFilter.type = 'highpass';
        popFilter.frequency.value = 3000 + Math.random() * 2000;
        
        popSource.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(this.vinylGain);
        
        popSource.start();
      }
    }, 450);
  }

  private startAbyssDrone() {
    if (!this.ctx || !this.abyssGain) return;
    const now = this.ctx.currentTime;
    
    if (this.abyssOsc1) {
      try { this.abyssOsc1.stop(); this.abyssOsc1.disconnect(); this.abyssOsc2?.stop(); this.abyssOsc2?.disconnect(); } catch(e) {}
    }

    this.abyssOsc1 = this.ctx.createOscillator();
    this.abyssOsc1.type = 'sine';
    this.abyssOsc1.frequency.setValueAtTime(45, now);

    this.abyssOsc2 = this.ctx.createOscillator();
    this.abyssOsc2.type = 'triangle';
    this.abyssOsc2.frequency.setValueAtTime(45.5, now);

    this.abyssOsc1.connect(this.abyssGain);
    this.abyssOsc2.connect(this.abyssGain);

    this.abyssOsc1.start();
    this.abyssOsc2.start();
  }

  private startCorruptionNoise() {
    if (!this.ctx || !this.corruptionGain || !this.whiteNoiseBuffer) return;
    
    if (this.corruptionNoiseSource) {
      try { this.corruptionNoiseSource.stop(); this.corruptionNoiseSource.disconnect(); } catch(e) {}
    }

    this.corruptionNoiseSource = this.ctx.createBufferSource();
    this.corruptionNoiseSource.buffer = this.whiteNoiseBuffer;
    this.corruptionNoiseSource.loop = true;

    this.corruptionNoiseSource.connect(this.corruptionGain);
    this.corruptionNoiseSource.start();
  }

  public triggerMicroClick() {
    if (!this.ctx || !this.isPlaying || !this.clickBuffer || !this.corruptionGain) return;
    const now = this.ctx.currentTime;

    const source = this.ctx.createBufferSource();
    source.buffer = this.clickBuffer;
    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0.25, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    source.connect(clickGain);
    clickGain.connect(this.corruptionGain);
    source.start(now);
    source.stop(now + 0.05);
  }

  public applyCorruptionState(progress: number) {
    this.activeProgress = progress;
    if (!this.ctx || !this.filterNode || !this.masterGain || !this.corruptionGain || !this.corruptionFilter || !this.musicGain || !this.abyssGain || !this.dataMatrixGain) return;
    const now = this.ctx.currentTime;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (progress < 0.20) {
      // PHASE 1: STABLE
      this.filterNode.frequency.setTargetAtTime(1800, now, 0.08);
      this.filterNode.Q.setTargetAtTime(1.8, now, 0.08);
      this.musicGain.gain.setTargetAtTime(0.65, now, 0.08);
      this.chaosMusicGain?.gain.setTargetAtTime(0.0, now, 0.08);
      this.dataMatrixGain.gain.setTargetAtTime(0.0, now, 0.08);
      this.corruptionGain.gain.setTargetAtTime(0.0, now, 0.05);
      this.abyssGain.gain.setTargetAtTime(0.0, now, 0.05);
      
      if (!this.isMuted) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setTargetAtTime(0.75, now, 0.08);
      }

    } else if (progress < 0.40) {
      // PHASE 2: EARLY CORRUPTION
      const t = (progress - 0.20) / 0.20; 
      this.filterNode.frequency.setTargetAtTime(1800 - t * 800, now, 0.05); 
      this.filterNode.Q.setTargetAtTime(1.8 + t * 2.5, now, 0.05);
      
      this.musicGain.gain.setTargetAtTime(0.65 - t * 0.25, now, 0.05); // Fade out to 0.4
      this.dataMatrixGain.gain.setTargetAtTime(t * 0.40, now, 0.08); // STRONGER FADE IN FOR DATA.MATRIX
      this.chaosMusicGain?.gain.setTargetAtTime(0.0, now, 0.08);
      
      // Reduce the white noise buzz drastically so data.matrix shines through
      const corruptLevel = isReduced ? t * 0.05 : t * 0.08; 
      this.corruptionGain.gain.setTargetAtTime(corruptLevel, now, 0.05);
      this.corruptionFilter.frequency.setTargetAtTime(2800 + t * 1000, now, 0.08);
      this.corruptionFilter.Q.setTargetAtTime(3.5, now, 0.08);
      this.abyssGain.gain.setTargetAtTime(0.0, now, 0.05);
      
      if (Math.random() < 0.12) this.triggerMicroClick();

    } else if (progress < 0.75) {
      // PHASE 3: UNSTABLE (Corrupted)
      const t = (progress - 0.40) / 0.35; 
      this.filterNode.frequency.setTargetAtTime(Math.max(220, 1000 - t * 780), now, 0.04); 
      this.filterNode.Q.setTargetAtTime(4.0 + t * 7.0, now, 0.04);
      
      this.musicGain.gain.setTargetAtTime(0.40 * (1 - t), now, 0.05); // Fade out to 0
      this.dataMatrixGain.gain.setTargetAtTime(0.40 + t * 0.60, now, 0.08); // Grow up to 1.0 peak
      this.chaosMusicGain?.gain.setTargetAtTime(0.0, now, 0.05); // Bipolar waits for abyss
      
      this.abyssGain.gain.setTargetAtTime(0.0, now, 0.05);

      const corruptLevel = isReduced ? 0.05 + t * 0.05 : 0.08 + t * 0.12; // KEEP BUZZ LOW
      this.corruptionGain.gain.setTargetAtTime(corruptLevel, now, 0.04);
      const flutter = Math.sin(Date.now() * 0.02) * 700;
      this.corruptionFilter.frequency.setTargetAtTime(Math.max(350, 3800 - t * 2000 + flutter), now, 0.03);
      this.corruptionFilter.Q.setTargetAtTime(4.5 + t * 4.5, now, 0.03);

      if (this.pannerNode) {
        this.pannerNode.pan.setTargetAtTime(Math.sin(Date.now() * 0.01) * 0.55, now, 0.04);
      }
      if (Math.random() < 0.28) this.triggerMicroClick();

    } else if (progress < 0.90) {
      // PHASE 4: RUPTURE (The Tear)
      if (progress >= 0.82 && progress <= 0.88) {
        this.dataMatrixGain.gain.setTargetAtTime(1.0, now, 0.05); // BLAST Data Matrix!
      } else {
        this.dataMatrixGain.gain.setTargetAtTime(0.0, now, 0.05); // Snap to silence right before/after peak
      }
      
      this.filterNode.frequency.setTargetAtTime(140, now, 0.02);
      this.musicGain.gain.setTargetAtTime(0.0, now, 0.02);
      this.chaosMusicGain?.gain.setTargetAtTime(0.0, now, 0.02);
      this.corruptionGain.gain.setTargetAtTime(0.10, now, 0.02);
      this.abyssGain.gain.setTargetAtTime(0.0, now, 0.05);

    } else {
      // PHASE 5: DIGITAL ABYSS
      if (!this.isMuted) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setTargetAtTime(0.75, now, 0.1);
      }
      this.corruptionGain.gain.setTargetAtTime(0, now, 0.1);
      this.musicGain.gain.setTargetAtTime(0, now, 0.1);
      this.dataMatrixGain.gain.setTargetAtTime(0, now, 0.1);
      
      // Bipolar takes over!
      this.chaosMusicGain?.gain.setTargetAtTime(0.85, now, 0.1);
      
      const abyssFade = (progress - 0.9) * 10.0;
      this.abyssGain.gain.setTargetAtTime(Math.min(1.0, abyssFade) * 0.35, now, 0.1);
      this.filterNode.frequency.setTargetAtTime(1800, now, 0.1);
      if (this.pannerNode) this.pannerNode.pan.setTargetAtTime(0, now, 0.1);
    }
    
    // Dispatch custom event to notify React components (like the player) that scroll progress changed the current track context
    window.dispatchEvent(new CustomEvent('audiomanager:progress', { detail: { progress } }));
  }

  public async start(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    if (this.isPlaying) return true;

    this.isPlaying = true;
    this.startVinylCrackle();
    this.startCorruptionNoise();
    this.startAbyssDrone();
    this.startMusicPlayback();
    
    return true;
  }

  public pause() {
    this.isPlaying = false;
    this.pauseMusicPlayback();
    
    if (this.vinylSource) {
      try { this.vinylSource.stop(); this.vinylSource.disconnect(); } catch (_) {}
      this.vinylSource = null;
    }
    if (this.corruptionNoiseSource) {
      try { this.corruptionNoiseSource.stop(); this.corruptionNoiseSource.disconnect(); } catch (_) {}
      this.corruptionNoiseSource = null;
    }
    if (this.abyssOsc1) {
      try { this.abyssOsc1.stop(); this.abyssOsc1.disconnect(); this.abyssOsc2?.stop(); this.abyssOsc2?.disconnect(); } catch (_) {}
      this.abyssOsc1 = null;
      this.abyssOsc2 = null;
    }
  }

  public nextTrack(): string {
    // Legacy support for manual click switching if wanted
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    return this.tracks[this.currentTrackIndex].name;
  }

  public getCurrentTrack() {
    // Dynamically return track based on active scroll progress!
    if (this.activeProgress >= 0.9) {
      return this.tracks[1]; // BIPOLAR
    } else if (this.activeProgress >= 0.4 && this.activeProgress < 0.9) {
      return { name: 'DATA.MATRIX', code: 'SIGNAL_ERR // RYOJI_IKEDA' };
    } else {
      return this.tracks[0]; // TO BUILD A HOME
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.75, now);
    }
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public getAudioFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(64);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public getAudioTimeData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(64);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  public getCorruptionProgress(): number {
    return this.activeProgress;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();
