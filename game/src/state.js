// The single mutable game state and the rules that change it.
import { SHIFT_SECONDS, CRATE_X, CRATE_Y, STATIONS, INGREDIENTS, needsFire } from './config.js';
import { makeOrder, orderMatchesDish } from './orders.js';

export function createGameState(seed = 7) {
  return {
    seed,
    rng: seed >>> 0,
    elapsed: 0,
    shiftLeft: SHIFT_SECONDS,
    score: 0,
    combo: 0,
    served: 0,
    missed: 0,
    chef: { x: 520, y: 600, targetX: 520, targetY: 600, facing: 1, carrying: null, chopFlash: 0 },
    queued: null,
    crates: CRATE_X.map((x, index) => ({ x, y: CRATE_Y, id: index })),
    prep: { item: null, chops: 0 },
    stove: { item: null, heat: 0 },
    bench: { parts: [], flash: 0 },
    pass: { dish: null, bell: 0 },
    tickets: [makeOrder(seed, 0), makeOrder(seed + 1, 0), makeOrder(seed + 2, 0)],
    nextOrder: seed + 3,
    particles: [],
    toast: { text: 'SERVICE BEGINS', life: 2.2 },
    over: false,
    paused: false,
  };
}

function nextRandom(state) {
  state.rng = (state.rng * 1664525 + 1013904223) >>> 0;
  return state.rng / 4294967296;
}

export function setToast(state, text, seconds = 1.6) {
  state.toast = { text, life: seconds };
}

export function pickIngredient(state, index) {
  const crate = state.crates[index];
  if (!crate) return;
  const item = INGREDIENTS[index];
  state.chef.carrying = { id: item.id, prepared: false };
  state.chef.targetX = crate.x;
  state.chef.targetY = crate.y - 46;
  setToast(state, `${item.name} in hand`, 1);
}

export function usePrepBoard(state) {
  const carried = state.chef.carrying;
  if (!carried) {
    if (state.prep.item?.prepared) {
      state.chef.carrying = state.prep.item;
      state.prep.item = null;
      state.prep.chops = 0;
      setToast(state, 'Picked up chopped item', 1);
    } else if (state.prep.item) {
      state.prep.chops += 1;
      state.chef.chopFlash = 0.3;
      if (state.prep.chops >= 3) {
        state.prep.item.prepared = true;
        state.chef.carrying = state.prep.item;
        state.prep.item = null;
        state.prep.chops = 0;
        setToast(state, 'Chopped!', 1);
      }
    }
    return;
  }
  if (carried.prepared) return;
  if (state.prep.item && state.prep.item.id !== carried.id) {
    setToast(state, 'Board is busy', 1);
    return;
  }
  state.prep.item = { id: carried.id, prepared: false };
  state.prep.chops += 1;
  state.chef.chopFlash = 0.3;
  if (state.prep.chops >= 3) {
    state.prep.item.prepared = true;
    state.chef.carrying = state.prep.item;
    state.prep.item = null;
    state.prep.chops = 0;
    setToast(state, 'Chopped!', 1);
  } else {
    state.chef.carrying = null;
  }
}

export function useStove(state) {
  const carried = state.chef.carrying;
  if (!carried) {
    if (state.stove.item && state.stove.heat >= 1) {
      state.chef.carrying = state.stove.item;
      state.stove.item = null;
      state.stove.heat = 0;
      setToast(state, 'Hot from the pan', 1);
    }
    return;
  }
  if (!carried.prepared) {
    setToast(state, 'Chop it first', 1.2);
    return;
  }
  if (state.stove.item && state.stove.heat < 1) return;
  state.stove.item = { ...carried, cooked: false };
  state.stove.heat = 0;
  state.chef.carrying = null;
  setToast(state, 'On the fire', 1);
}

export function useBench(state) {
  const carried = state.chef.carrying;
  if (!carried) return;
  if (!carried.prepared) {
    setToast(state, 'Prepare it first', 1.2);
    return;
  }
  if (state.bench.parts.length >= 3) {
    setToast(state, 'Plate is full', 1.2);
    return;
  }
  if (needsFire(carried.id) && !carried.cooked) {
    setToast(state, 'Needs the fire', 1.2);
    return;
  }
  state.bench.parts.push({ id: carried.id, cooked: Boolean(carried.cooked) });
  state.bench.flash = 0.4;
  state.chef.carrying = null;
  setToast(state, 'Added to plate', 1);
}

export function usePass(state) {
  if (state.bench.parts.length && !state.pass.dish) {
    const plateIds = state.bench.parts.map((part) => part.id);
    const match = state.tickets.find((ticket) => orderMatchesDish(ticket, { parts: plateIds }));
    state.pass.dish = { parts: plateIds, valid: Boolean(match), ticketId: match?.id ?? null };
    state.bench.parts = [];
    state.pass.bell = 0.6;
    setToast(state, match ? 'Order up!' : 'No matching ticket', 1.4);
    return;
  }
  if (!state.pass.dish) return;
  const dish = state.pass.dish;
  const ticket = state.tickets.find((item) => item.id === dish.ticketId);
  if (dish.valid && ticket) {
    const quick = ticket.remaining / ticket.total;
    const gain = 100 + Math.round(90 * quick) + state.combo * 25;
    state.score += gain;
    state.combo += 1;
    state.served += 1;
    state.tickets = state.tickets.filter((item) => item.id !== ticket.id);
    setToast(state, `SERVED  +${gain}`, 1.8);
  } else {
    state.score = Math.max(0, state.score - 40);
    state.combo = 0;
    setToast(state, 'Wrong plate, -40', 1.6);
  }
  state.pass.dish = null;
}

export function useStation(state, stationId) {
  if (stationId === 'prep') usePrepBoard(state);
  else if (stationId === 'stove') useStove(state);
  else if (stationId === 'assembly') useBench(state);
  else if (stationId === 'pass') usePass(state);
}

export function moveChefToward(state, x, y) {
  state.chef.targetX = x;
  state.chef.targetY = y;
}
export function queueAction(state, action, x, y, onDone) {
  state.queued = { ...action, onDone };
  moveChefToward(state, x, y);
}

export function stationAt(x, y) {
  for (const [id, box] of Object.entries(STATIONS)) {
    if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) return id;
  }
  return null;
}

function spawnTicket(state) {
  const ticket = makeOrder(state.nextOrder, state.elapsed);
  state.nextOrder += 1;
  state.tickets.push(ticket);
  if (state.tickets.length > 3) {
    state.tickets.shift();
    state.missed += 1;
    state.combo = 0;
    setToast(state, 'Ticket expired!', 1.6);
  }
}

export function updateState(state, dt) {
  if (state.over) return;
  state.elapsed += dt;
  state.shiftLeft = Math.max(0, SHIFT_SECONDS - state.elapsed);
  state.chef.chopFlash = Math.max(0, state.chef.chopFlash - dt);
  state.bench.flash = Math.max(0, state.bench.flash - dt);
  state.pass.bell = Math.max(0, state.pass.bell - dt);
  state.toast.life = Math.max(0, state.toast.life - dt);

  const dx = state.chef.targetX - state.chef.x;
  const dy = state.chef.targetY - state.chef.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 2) {
    const step = Math.min(dist, dt * 420);
    state.chef.x += (dx / dist) * step;
    state.chef.y += (dy / dist) * step;
    state.chef.facing = dx >= 0 ? 1 : -1;
  }
  if (state.queued) {
    const pending = state.queued;
    const wait = Math.hypot(state.chef.targetX - state.chef.x, state.chef.targetY - state.chef.y);
    if (wait <= 12) {
      state.queued = null;
      if (pending.type === 'station') useStation(state, pending.stationId);
      else if (pending.type === 'crate') pickIngredient(state, pending.index);
      pending.onDone?.();
    }
  }

  if (state.stove.item && state.stove.heat < 1) {
    state.stove.heat = Math.min(1, state.stove.heat + dt / 4.5);
    if (state.stove.item && state.stove.heat >= 1) state.stove.item.cooked = true;
  }

  for (const ticket of state.tickets) ticket.remaining -= dt;
  const expired = state.tickets.filter((ticket) => ticket.remaining <= 0);
  if (expired.length) {
    state.tickets = state.tickets.filter((ticket) => ticket.remaining > 0);
    state.missed += expired.length;
    state.combo = 0;
    setToast(state, 'Ticket lost!', 1.6);
  }
  if (state.tickets.length < 3) spawnTicket(state);

  state.particles = state.particles.filter((particle) => {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += particle.gravity * dt;
    return particle.life > 0;
  });

  if (state.shiftLeft <= 0) {
    state.over = true;
    setToast(state, 'SHIFT COMPLETE', 4);
  }
}

export function addParticle(state, x, y, color, kind = 'spark') {
  const angle = Math.random() * Math.PI * 2;
  const speed = kind === 'steam' ? 10 + Math.random() * 18 : 40 + Math.random() * 120;
  state.particles.push({
    x, y,
    vx: Math.cos(angle) * speed,
    vy: kind === 'steam' ? -speed : Math.sin(angle) * speed,
    gravity: kind === 'steam' ? -6 : 180,
    life: kind === 'steam' ? 1.8 : 0.7,
    maxLife: kind === 'steam' ? 1.8 : 0.7,
    color,
    size: kind === 'steam' ? 10 + Math.random() * 12 : 2 + Math.random() * 3,
    kind,
  });
}
