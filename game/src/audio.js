// Tiny WebAudio tones. No files, no network, no autoplay before the first input.
let context = null;

function ensureContext() {
  if (!context) {
    const Constructor = window.AudioContext || window.webkitAudioContext;
    if (Constructor) context = new Constructor();
  }
  if (context?.state === 'suspended') context.resume();
  return context;
}

function tone(freq, duration, type = 'sine', gain = 0.08, slide = 0) {
  const audio = ensureContext();
  if (!audio) return;
  const oscillator = audio.createOscillator();
  const volume = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audio.currentTime);
  if (slide) oscillator.frequency.linearRampToValueAtTime(freq + slide, audio.currentTime + duration);
  volume.gain.setValueAtTime(gain, audio.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  oscillator.connect(volume).connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + duration);
}

export function playSound(name) {
  if (name === 'pick') tone(340, 0.09, 'triangle', 0.05, 120);
  else if (name === 'chop') tone(180, 0.07, 'square', 0.05, -60);
  else if (name === 'sizzle') tone(220, 0.28, 'sawtooth', 0.025, 80);
  else if (name === 'plate') tone(620, 0.12, 'sine', 0.06, 180);
  else if (name === 'serve') {
    tone(660, 0.14, 'sine', 0.07);
    setTimeout(() => tone(880, 0.24, 'sine', 0.07), 110);
  } else if (name === 'fail') tone(150, 0.3, 'sawtooth', 0.05, -60);
}
