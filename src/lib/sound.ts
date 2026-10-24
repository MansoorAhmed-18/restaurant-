// ====================================================================
// RESTAURANT KITCHEN BELL & AUDIO NOTIFICATION SYNTHESIZER
// High-clarity, zero-latency Web Audio brass service bell (Ding-Ding! 🛎️)
// Designed for busy kitchens & mobile POS devices
// ====================================================================

let audioCtx: AudioContext | null = null;
let isMuted = false;

if (typeof window !== "undefined") {
  try {
    isMuted = localStorage.getItem("kitchen_sound_muted") === "true";
  } catch {
    isMuted = false;
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Unlock audio context on user gesture (required by Chrome / Safari / Android / iOS)
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener("click", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
}

export function isKitchenSoundMuted(): boolean {
  return isMuted;
}

export function setKitchenSoundMuted(muted: boolean) {
  isMuted = muted;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("kitchen_sound_muted", muted ? "true" : "false");
    } catch {}
  }
}

/**
 * Play authentic physical restaurant kitchen counter service bell (Ding-Ding! 🛎️)
 * Two sequential harmonic strikes with rich metallic brass decay.
 */
export function playKitchenBellSound(volume = 0.85) {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const playStrike = (timeOffset: number, baseFreq: number, strikeVol: number) => {
      const now = ctx.currentTime + timeOffset;

      // 1. Primary fundamental frequency (brass bell body)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(baseFreq, now);

      // 2. High metallic chime overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(baseFreq * 2.756, now); // Typical physical bell ratio

      // 3. Shimmer overtone (bright ring)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = "triangle";
      osc3.frequency.setValueAtTime(baseFreq * 5.404, now);

      // Fast attack & smooth exponential decay
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(strikeVol * 0.7, now + 0.004);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.linearRampToValueAtTime(strikeVol * 0.35, now + 0.003);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      gain3.gain.setValueAtTime(0.0001, now);
      gain3.gain.linearRampToValueAtTime(strikeVol * 0.2, now + 0.002);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc3.connect(gain3);
      gain3.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 1.3);
      osc2.stop(now + 0.9);
      osc3.stop(now + 0.6);
    };

    // Authentic double-strike bell pattern (First strike 1760 Hz [A6], Second strike 2093 Hz [C7])
    playStrike(0, 1760, volume);
    playStrike(0.13, 2093, volume * 0.9);
  } catch (err) {
    console.warn("Could not play kitchen order bell sound:", err);
  }
}
