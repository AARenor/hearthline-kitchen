// Four fixed service moments. Each is the game's own renderer with one state,
// used only to take the screenshots the entry hands in.
import { STATIONS } from './config.js';
import { addParticle, setToast } from './state.js';

function placeChef(state, stationId) {
  const box = STATIONS[stationId];
  state.chef.x = box.x + box.w / 2 - 30;
  state.chef.y = box.y + box.h + 12;
  state.chef.targetX = state.chef.x;
  state.chef.targetY = state.chef.y;
}

export function applyShot(state, name) {
  state.over = false;
  state.tickets[0].remaining = state.tickets[0].total * 0.18;
  state.tickets[1].remaining = state.tickets[1].total * 0.55;
  if (name !== 'prep' && name !== 'fire' && name !== 'pass') state.tickets[1].priority = true;
  state.tickets[2].remaining = state.tickets[2].total * 0.9;

  if (name === 'prep') {
    state.score = 420;
    state.combo = 2;
    state.served = 3;
    state.prep.item = { id: 'tomato', prepared: false };
    state.prep.chops = 2;
    state.chef.carrying = null;
    state.chef.chopFlash = 0.3;
    placeChef(state, 'prep');
    setToast(state, 'CHOP CHOP', 3);
    for (let i = 0; i < 8; i += 1) addParticle(state, 198, 470, '#ffd979');
  } else if (name === 'fire') {
    state.score = 960;
    state.combo = 3;
    state.served = 6;
    state.stove.item = { id: 'fish', prepared: true };
    state.stove.heat = 0.72;
    state.chef.carrying = { id: 'herb', prepared: true };
    state.bench.parts = [{ id: 'noodle', cooked: true }, { id: 'pepper', cooked: false }];
    setToast(state, 'ON THE FIRE', 3);
    for (let i = 0; i < 14; i += 1) addParticle(state, 435 + i % 4 * 8, 486 - i * 4, '#fff3d8', 'steam');
  } else if (name === 'pass') {
    state.score = 2140;
    state.combo = 5;
    state.served = 12;
    state.pass.dish = { parts: state.tickets[0].parts.slice(), valid: true, ticketId: state.tickets[0].id };
    state.pass.bell = 0.6;
    state.bench.parts = [{ id: 'mushroom', cooked: true }, { id: 'rice', cooked: true }];
    placeChef(state, 'pass');
    setToast(state, 'ORDER UP!', 3);
    for (let i = 0; i < 10; i += 1) addParticle(state, 890 + i % 5 * 6, 470 - i * 5, '#ffd979');
  } else {
    // The cover: every required element in one glance.
    state.score = 1480;
    state.combo = 4;
    state.served = 9;
    state.prep.item = { id: 'tomato', prepared: true };
    state.stove.item = { id: 'mushroom', prepared: true };
    state.elapsed = 120;
    state.shiftLeft = Math.max(0, state.shiftLeft - 120);
    state.bench.parts = [{ id: 'noodle', cooked: true }, { id: 'herb', cooked: false }];
    state.pass.dish = { parts: state.tickets[0].parts.slice(), valid: true, ticketId: state.tickets[0].id };
    state.pass.bell = 0.4;
    state.chef.carrying = { id: 'pepper', prepared: true };
    placeChef(state, 'assembly');
    state.chef.targetX = 900;
    state.chef.targetY = 580;
    setToast(state, 'RUSH THREE  ·  ORDERS UP', 3);
    for (let i = 0; i < 8; i += 1) addParticle(state, 435 + i % 3 * 10, 485 - i * 7, '#fff3d8', 'steam');
  }
  state.toast.life = 3;
}
