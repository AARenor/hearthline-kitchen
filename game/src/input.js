// Keyboard and mouse controls. Every action waits for the chef to walk there.
import { CRATE_X, CRATE_Y, STATIONS } from './config.js';
import { moveChefToward, queueAction, stationAt } from './state.js';
import { playSound } from './audio.js';

export function installInput(canvas, state, onAction) {
  const held = new Set();

  function queueStation(stationId, x, y) {
    const snapshot = () => JSON.stringify({
      score: state.score,
      prep: state.prep,
      stove: state.stove,
      bench: state.bench,
      pass: state.pass,
      carrying: state.chef.carrying,
    });
    const before = snapshot();
    queueAction(state, { type: 'station', stationId }, x, y, () => {
      const changed = snapshot() !== before;
      playSound(changed
        ? stationId === 'prep' ? 'chop' : stationId === 'stove' ? 'sizzle' : stationId === 'pass' ? 'serve' : 'plate'
        : 'fail');
      onAction?.(stationId, changed);
    });
  }

  function queueCrate(index) {
    queueAction(state, { type: 'crate', index }, CRATE_X[index], CRATE_Y - 46, () => {
      playSound('pick');
      onAction?.('crate', false);
    });
  }

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    held.add(key);
    if (key === 'e') {
      const nearest = nearestStation(state);
      if (nearest) {
        const box = STATIONS[nearest];
        queueStation(nearest, box.x + box.w / 2, box.y + box.h + 12);
      }
    }
    if (key >= '1' && key <= '8') queueCrate(Number(key) - 1);
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
      queueCrate(crateIndex);
      return;
    }
    const stationId = stationAt(x, y);
    if (stationId) queueStation(stationId, x, y - 20);
    else moveChefToward(state, x, y - 22);
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
        state.queued = null;
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
