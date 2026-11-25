// Keyboard and mouse controls for the single chef.
import { CRATE_X, CRATE_Y, STATIONS } from './config.js';
import { moveChefToward, stationAt, useStation, pickIngredient } from './state.js';
import { playSound } from './audio.js';

export function installInput(canvas, state, onAction) {
  const held = new Set();

  function act(stationId) {
    const before = state.score + state.bench.parts.length * 1000 + state.prep.chops;
    useStation(state, stationId);
    const after = state.score + state.bench.parts.length * 1000 + state.prep.chops;
    playSound(stationId === 'prep' ? 'chop' : stationId === 'stove' ? 'sizzle' : stationId === 'pass' ? 'serve' : 'plate');
    onAction?.(stationId, after > before);
  }

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    held.add(key);
    if (key === 'e') {
      const nearest = nearestStation(state);
      if (nearest) act(nearest);
    }
    if (key >= '1' && key <= '8') {
      pickIngredient(state, Number(key) - 1);
      playSound('pick');
      onAction?.('crate', false);
    }
    if (key === 'r' && state.over) window.location.reload();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
  });
  window.addEventListener('keyup', (event) => held.delete(event.key.toLowerCase()));

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    const crateIndex = CRATE_X.findIndex((cx, index) => Math.abs(x - cx) < 38 && Math.abs(y - CRATE_Y) < 44);
    if (crateIndex >= 0) {
      pickIngredient(state, crateIndex);
      playSound('pick');
      onAction?.('crate', false);
      return;
    }
    const stationId = stationAt(x, y);
    if (stationId) {
      moveChefToward(state, x, y - 20);
      act(stationId);
    } else {
      moveChefToward(state, x, y - 22);
    }
  });

  return {
    update(dt) {
      let dx = 0;
      let dy = 0;
      if (held.has('a') || held.has('arrowleft')) dx -= 1;
      if (held.has('d') || held.has('arrowright')) dx += 1;
      if (held.has('w') || held.has('arrowup')) dy -= 1;
      if (held.has('s') || held.has('arrowdown')) dy += 1;
      if (dx || dy) {
        const len = Math.hypot(dx, dy);
        state.chef.targetX = Math.max(40, Math.min(940, state.chef.targetX + (dx / len) * dt * 460));
        state.chef.targetY = Math.max(390, Math.min(740, state.chef.targetY + (dy / len) * dt * 460));
      }
    },
  };
}

function nearestStation(state) {
  let best = null;
  let bestDistance = 130;
  for (const [id, box] of Object.entries(STATIONS)) {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const distance = Math.hypot(state.chef.x - cx, state.chef.y - cy);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = id;
    }
  }
  return best;
}
