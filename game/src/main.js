// Boot, fixed timestep loop and frame composition for Hearthline Kitchen.
import { VIEW } from './config.js';
import { createGameState, updateState } from './state.js';
import { installInput } from './input.js';
import { drawKitchen } from './render/kitchen.js';
import { drawEffects, emitCookingEffects } from './render/effects.js';
import { drawHud } from './render/hud.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
canvas.width = VIEW.width;
canvas.height = VIEW.height;
ctx.imageSmoothingEnabled = true;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seed = Number(params.get('seed') ?? 7) || 7;
const state = createGameState(seed);

if (shot) {
  applyShot(state, shot);
  state.paused = true;
  document.getElementById('hint').textContent = `HEARTHLINE KITCHEN  ·  ${shot.toUpperCase()} MOMENT  ·  KITCHEN, ORDERS, COUNTER, TIMER, PLATE READY`;
}

const input = installInput(canvas, state, () => {
  if (shot) return;
});

function draw() {
  ctx.clearRect(0, 0, VIEW.width, VIEW.height);
  drawKitchen(ctx, state);
  drawEffects(ctx, state);
  drawHud(ctx, state);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!state.paused) {
    input.update(dt);
    updateState(state, dt);
    emitCookingEffects(state);
  }
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.__hearthline = { state, draw, applyShot };
