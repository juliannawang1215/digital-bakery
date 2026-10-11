/**
 * Procedural Web Audio Synthesizer
 * Generates tactile, organic UI sound effects without external audio files.
 */

export interface SoundLayer {
  delay?: number;
  gain?: number;
  envelope?: {
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    curve?: 'ramp' | 'linear';
  };
  source:
    | {
        type: 'noise';
        color?: 'pink' | 'brown' | 'white';
      }
    | {
        type: OscillatorType;
        frequency: number | { start: number; end: number; time?: number };
        detune?: number;
        fm?: { ratio: number; depth: number };
      };
  filter?:
    | {
        type: BiquadFilterType;
        frequency: number;
        Q?: number;
        resonance?: number;
        envelope?: { attack?: number; decay: number; peak: number };
      }
    | Array<{
        type: BiquadFilterType;
        frequency: number;
        Q?: number;
        resonance?: number;
        envelope?: { attack?: number; decay: number; peak: number };
      }>;
  effects?: Array<
    | {
        type: 'reverb';
        decay?: number;
        mix?: number;
        damping?: number;
        roomSize?: number;
        preDelay?: number;
      }
    | {
        type: 'delay';
        delay: number;
        lowpass?: number;
        feedback: number;
        wet: number;
      }
  >;
}

export type SoundPatch =
  | { layers: SoundLayer[] }
  | SoundLayer;

let globalAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    globalAudioCtx = new AudioCtx();
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

let isMutedState = false;
try {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('julianna_bakery_sound_muted') : null;
  if (saved !== null) {
    isMutedState = saved === 'true';
  }
} catch {
  // ignore
}

export function isSoundMuted(): boolean {
  return isMutedState;
}

export function setSoundMuted(muted: boolean): boolean {
  isMutedState = muted;
  try {
    localStorage.setItem('julianna_bakery_sound_muted', String(muted));
  } catch {
    // ignore
  }
  return isMutedState;
}

export function toggleSoundMuted(): boolean {
  return setSoundMuted(!isMutedState);
}

export function playSound(patch: SoundPatch, context?: AudioContext) {
  if (isMutedState) return;
  try {
    const ctx = context || getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const S = 0.0001;
    const t0 = ctx.currentTime;

    function noiseBuffer(seconds: number, color?: 'pink' | 'brown' | 'white') {
      const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      if (color === 'pink') {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + w * 0.0555179;
          b1 = 0.99332 * b1 + w * 0.0750759;
          b2 = 0.969 * b2 + w * 0.153852;
          b3 = 0.8665 * b3 + w * 0.3104856;
          b4 = 0.55 * b4 + w * 0.5329522;
          b5 = -0.7616 * b5 - w * 0.016898;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
          b6 = w * 0.115926;
        }
      } else if (color === 'brown') {
        let last = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          last = (last + 0.02 * w) / 1.02;
          d[i] = last * 3.5;
        }
      } else {
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      return buf;
    }

    function reverb(o: { decay?: number; mix?: number; damping?: number; roomSize?: number; preDelay?: number }) {
      const decay = o.decay == null ? 0.5 : o.decay;
      const mix = o.mix == null ? 0.3 : o.mix;
      const damping = o.damping == null ? 0 : o.damping;
      const input = ctx.createGain(), output = ctx.createGain();
      const dry = ctx.createGain(); dry.gain.value = 1 - mix;
      input.connect(dry); dry.connect(output);
      const wet = ctx.createGain(); wet.gain.value = mix; input.connect(wet);
      const wetOut = ctx.createGain(); wetOut.connect(output);
      const len = Math.ceil(ctx.sampleRate * decay * (o.roomSize == null ? 1 : o.roomSize));
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.28));
        if (damping > 0) {
          const c = Math.min(damping, 0.99);
          let prev = 0;
          for (let i = 0; i < len; i++) { prev = d[i] * (1 - c) + prev * c; d[i] = prev; }
        }
      }
      const conv = ctx.createConvolver(); conv.buffer = buf;
      const pre = o.preDelay == null ? 0 : o.preDelay;
      if (pre > 0) {
        const pd = ctx.createDelay(Math.max(pre + 0.01, 1));
        pd.delayTime.value = pre;
        wet.connect(pd); pd.connect(conv);
      } else {
        wet.connect(conv);
      }
      conv.connect(wetOut);
      return { input, output };
    }

    function shimmer(o: { delay: number; lowpass?: number; feedback: number; wet: number }) {
      const input = ctx.createGain(), output = ctx.createGain();
      input.connect(output);
      const delay = ctx.createDelay(1); delay.delayTime.value = o.delay;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.lowpass == null ? 4000 : o.lowpass;
      const fb = ctx.createGain(); fb.gain.value = o.feedback;
      const wet = ctx.createGain(); wet.gain.value = o.wet;
      input.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay);
      lp.connect(wet); wet.connect(output);
      return { input, output };
    }

    const layers: SoundLayer[] = 'layers' in patch && Array.isArray(patch.layers) ? patch.layers : [patch as SoundLayer];

    for (const layer of layers) {
      const t = t0 + (layer.delay || 0);
      const gain = layer.gain == null ? 0.5 : layer.gain;
      const env = layer.envelope;
      const a = env ? env.attack || 0 : 0;
      const d = env ? env.decay || 0 : 0;
      const sus = env ? env.sustain || 0 : 0;
      const rel = env ? env.release || 0 : 0;
      const dur = env ? a + d + rel : 0.5;

      const g = ctx.createGain();
      if (!env) {
        g.gain.setValueAtTime(gain, t);
        g.gain.setTargetAtTime(S, t, 0.15);
      } else if (env.curve === 'ramp') {
        const peak = Math.max(gain, S);
        g.gain.setValueAtTime(S, t);
        if (a > 0) g.gain.exponentialRampToValueAtTime(peak, t + a);
        else g.gain.setValueAtTime(peak, t);
        g.gain.exponentialRampToValueAtTime(S, t + a + d);
      } else {
        g.gain.setValueAtTime(S, t);
        if (a > 0) g.gain.linearRampToValueAtTime(gain, t + a);
        else g.gain.setValueAtTime(gain, t);
        if (sus > 0) {
          g.gain.setTargetAtTime(Math.max(sus * gain, S), t + a, d / 3);
          if (rel > 0) g.gain.setTargetAtTime(S, t + a + d, rel / 3);
        } else {
          g.gain.setTargetAtTime(S, t + a, d / 3);
        }
      }

      let src: AudioNode;
      const s = layer.source;
      if (s.type === 'noise') {
        const bSrc = ctx.createBufferSource();
        bSrc.buffer = noiseBuffer(dur + 0.1, s.color);
        src = bSrc;
      } else {
        const osc = ctx.createOscillator();
        osc.type = s.type;
        const f = s.frequency;
        if (typeof f === 'number') {
          osc.frequency.setValueAtTime(f, t);
        } else {
          osc.frequency.setValueAtTime(f.start, t);
          osc.frequency.exponentialRampToValueAtTime(Math.max(f.end, 1), t + Math.min(f.time == null ? dur : f.time, dur));
        }
        if (s.detune) osc.detune.value = s.detune;
        if (s.fm) {
          const carrier = typeof f === 'number' ? f : f.start;
          const mod = ctx.createOscillator();
          mod.type = 'sine';
          mod.frequency.value = carrier * s.fm.ratio;
          const mg = ctx.createGain();
          mg.gain.value = s.fm.depth;
          mod.connect(mg); mg.connect(osc.frequency);
          mod.start(t); mod.stop(t + dur + 0.1);
        }
        src = osc;
      }

      if ('start' in src && typeof (src as AudioScheduledSourceNode).start === 'function') {
        (src as AudioScheduledSourceNode).start(t);
        (src as AudioScheduledSourceNode).stop(t + dur + 0.1);
      }

      let node: AudioNode = src;
      const filters = !layer.filter ? [] : (Array.isArray(layer.filter) ? layer.filter : [layer.filter]);
      for (const f of filters) {
        const bq = ctx.createBiquadFilter();
        bq.type = f.type;
        bq.frequency.setValueAtTime(f.frequency, t);
        bq.Q.value = f.Q == null ? (f.resonance == null ? 1 : f.resonance) : f.Q;
        if (f.envelope) {
          const peakAt = t + (f.envelope.attack || 0);
          bq.frequency.linearRampToValueAtTime(f.envelope.peak, peakAt);
          bq.frequency.exponentialRampToValueAtTime(Math.max(f.frequency, 1), peakAt + f.envelope.decay);
        }
        node.connect(bq);
        node = bq;
      }
      node.connect(g);

      let out: AudioNode = g;
      for (const fx of (layer.effects || [])) {
        const built = fx.type === 'reverb' ? reverb(fx) : fx.type === 'delay' ? shimmer(fx) : null;
        if (!built) continue;
        out.connect(built.input);
        out = built.output;
      }
      out.connect(ctx.destination);
    }
  } catch (err) {
    console.warn('playSound audio error:', err);
  }
}

/**
 * Curated Artisanal Sound Presets for Digital Bakery
 */
export const BAKERY_SOUNDS = {
  // Opening the entrance door: warm antique brass bell chime
  doorBell: {
    layers: [
      {
        gain: 0.14,
        envelope: { attack: 0.005, decay: 0.6, curve: 'ramp' as const },
        source: { type: 'sine' as OscillatorType, frequency: 1174.66 }, // D6
        effects: [{ type: 'reverb' as const, decay: 1.2, mix: 0.35, roomSize: 1.2 }],
      },
      {
        delay: 0.08,
        gain: 0.16,
        envelope: { attack: 0.005, decay: 0.7, curve: 'ramp' as const },
        source: { type: 'sine' as OscillatorType, frequency: 1760.0 }, // A6
        effects: [{ type: 'reverb' as const, decay: 1.4, mix: 0.4, roomSize: 1.3 }],
      },
    ],
  },

  // Inspecting a confection: organic deckle paper rustle / unfold
  paperUnfold: {
    layers: [
      {
        gain: 0.16,
        envelope: { attack: 0.02, decay: 0.28, curve: 'ramp' as const },
        source: { type: 'noise' as const, color: 'brown' as const },
        filter: {
          type: 'bandpass' as BiquadFilterType,
          frequency: 600,
          Q: 2.2,
          envelope: { attack: 0.03, decay: 0.22, peak: 1800 },
        },
      },
      {
        delay: 0.05,
        gain: 0.08,
        envelope: { attack: 0.01, decay: 0.15, curve: 'ramp' as const },
        source: { type: 'noise' as const, color: 'pink' as const },
        filter: { type: 'highpass' as BiquadFilterType, frequency: 2400 },
      },
    ],
  },

  // Closing paper note
  paperClose: {
    gain: 0.12,
    envelope: { attack: 0.01, decay: 0.18, curve: 'ramp' as const },
    source: { type: 'noise' as const, color: 'brown' as const },
    filter: {
      type: 'lowpass' as BiquadFilterType,
      frequency: 900,
      Q: 1.5,
    },
  },

  // Adding cake to receipt: antique brass cash register bell
  cashRegister: {
    layers: [
      {
        gain: 0.2,
        envelope: { attack: 0.002, decay: 0.45, curve: 'ramp' as const },
        source: {
          type: 'triangle' as OscillatorType,
          frequency: 2093.0, // C7
          fm: { ratio: 2.76, depth: 320 },
        },
        effects: [{ type: 'reverb' as const, decay: 0.8, mix: 0.3 }],
      },
      {
        delay: 0.04,
        gain: 0.1,
        envelope: { attack: 0.002, decay: 0.35, curve: 'ramp' as const },
        source: { type: 'sine' as OscillatorType, frequency: 3135.96 }, // G7
      },
    ],
  },

  // Removing from receipt
  receiptRemove: {
    gain: 0.1,
    envelope: { attack: 0.005, decay: 0.12, curve: 'ramp' as const },
    source: {
      type: 'sine' as OscillatorType,
      frequency: { start: 880, end: 440, time: 0.1 },
    },
  },

  // Subtle button click / pill tab switch
  softClick: {
    gain: 0.12,
    envelope: { attack: 0.001, decay: 0.04, curve: 'ramp' as const },
    source: {
      type: 'sine' as OscillatorType,
      frequency: { start: 1200, end: 300, time: 0.03 },
    },
    filter: { type: 'lowpass' as BiquadFilterType, frequency: 2200 },
  },

  // Thermal receipt print / paper tear
  receiptTear: {
    layers: [
      {
        gain: 0.14,
        envelope: { attack: 0.01, decay: 0.14, curve: 'ramp' as const },
        source: { type: 'noise' as const, color: 'pink' as const },
        filter: {
          type: 'bandpass' as BiquadFilterType,
          frequency: 3200,
          Q: 3,
        },
      },
      {
        delay: 0.06,
        gain: 0.1,
        envelope: { attack: 0.01, decay: 0.1, curve: 'ramp' as const },
        source: { type: 'noise' as const, color: 'white' as const },
        filter: {
          type: 'highpass' as BiquadFilterType,
          frequency: 4500,
        },
      },
    ],
  },
};
