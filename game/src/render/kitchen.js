// The kitchen itself: tiled room, stations, crates and the chef.
import { CRATE_X, CRATE_Y, INGREDIENTS, PALETTE, STATIONS, VIEW } from '../config.js';
import { drawIngredient, drawPlate, drawPreparedDish } from './food.js';

function roundedRect(ctx, x, y, w, h, r, fill, stroke, lineWidth = 2) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function drawWall(ctx) {
  ctx.fillStyle = '#3d2c26';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  ctx.fillStyle = '#5b4034';
  ctx.fillRect(0, 0, VIEW.width, 330);
  for (let x = 0; x < VIEW.width; x += 64) {
    ctx.fillStyle = (x / 64) % 2 ? '#614536' : '#583d31';
    ctx.fillRect(x, 96, 62, 184);
  }
  ctx.fillStyle = '#2d1d18';
  ctx.fillRect(0, 286, VIEW.width, 44);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(0, 322, VIEW.width, 16);

  ctx.fillStyle = '#1d2a30';
  roundedRect(ctx, 470, 112, 250, 132, 8, '#21353d', '#a8713e', 8);
  ctx.fillStyle = '#40606c';
  ctx.fillRect(482, 124, 226, 108);
  ctx.fillStyle = '#5e8793';
  ctx.beginPath();
  ctx.moveTo(482, 232);
  ctx.lineTo(560, 124);
  ctx.lineTo(604, 124);
  ctx.lineTo(508, 232);
  ctx.fill();
  ctx.fillStyle = '#f7d99a';
  ctx.beginPath();
  ctx.arc(670, 154, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3b251b';
  ctx.fillRect(94, 152, 300, 12);
  ctx.fillRect(788, 152, 220, 12);
  for (let i = 0; i < 5; i += 1) {
    roundedRect(ctx, 110 + i * 56, 120, 34, 32, 5, ['#d4b06a', '#a9b7a0', '#cb7b4c', '#9fb4bf', '#e0cf9c'][i], '#2b1a14');
  }
  for (let i = 0; i < 4; i += 1) {
    roundedRect(ctx, 802 + i * 50, 124, 30, 28, 5, ['#b8c7a0', '#d9b07a', '#a9bec8', '#d5a15a'][i], '#2b1a14');
  }
  // Warm pendant lamps give the room a height and a service-hour glow.
  [190, 450, 710].forEach((x) => {
    ctx.strokeStyle = '#2b1a14';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 74);
    ctx.stroke();
    ctx.fillStyle = '#d99b4e';
    ctx.beginPath();
    ctx.moveTo(x - 26, 104);
    ctx.lineTo(x + 26, 104);
    ctx.lineTo(x + 14, 74);
    ctx.lineTo(x - 14, 74);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff0bd';
    ctx.beginPath();
    ctx.arc(x, 104, 7, 0, Math.PI * 2);
    ctx.fill();
    const glow = ctx.createRadialGradient(x, 110, 4, x, 110, 92);
    glow.addColorStop(0, 'rgba(255,206,126,0.24)');
    glow.addColorStop(1, 'rgba(255,206,126,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, 110, 92, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFloor(ctx) {
  ctx.fillStyle = '#7d5b44';
  ctx.fillRect(0, 330, VIEW.width, VIEW.height - 330);
  for (let y = 330; y < VIEW.height; y += 56) {
    for (let x = ((y / 56) % 2) * 44; x < VIEW.width; x += 88) {
      ctx.fillStyle = ((x + y) / 56) % 2 ? '#8a664b' : '#936f52';
      ctx.fillRect(x, y, 86, 54);
    }
  }
  ctx.fillStyle = '#00000026';
  ctx.fillRect(0, 330, VIEW.width, 8);
}

function drawStationBase(ctx, box) {
  ctx.save();
  ctx.shadowColor = '#0007';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 12;
  roundedRect(ctx, box.x, box.y, box.w, box.h, 10, '#5d3a27');
  ctx.restore();
  roundedRect(ctx, box.x + 5, box.y + 5, box.w - 10, box.h - 16, 8, '#a06a3d', '#4a2c1d', 3);
  roundedRect(ctx, box.x + 5, box.y + 5, box.w - 10, 14, 6, '#c58a50');
  ctx.fillStyle = '#f2d5a3';
  ctx.font = 'bold 12px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(box.label, box.x + box.w / 2, box.y - 10);
}

function drawPrepStation(ctx, state) {
  const box = STATIONS.prep;
  drawStationBase(ctx, box);
  roundedRect(ctx, box.x + 18, box.y + 34, box.w - 36, box.h - 56, 6, '#d3a06a', '#85522f', 3);
  ctx.strokeStyle = '#a87142';
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(box.x + 18, box.y + 34 + i * 17);
    ctx.lineTo(box.x + box.w - 18, box.y + 34 + i * 17);
    ctx.stroke();
  }
  if (state.prep.item) drawIngredient(ctx, state.prep.item.id, box.x + box.w / 2, box.y + 72, 22);
  if (state.chef.chopFlash > 0) {
    ctx.strokeStyle = '#fff1b5';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(box.x + box.w / 2 - 34, box.y + 18);
    ctx.lineTo(box.x + box.w / 2 + 34, box.y + 62);
    ctx.stroke();
  }
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i < state.prep.chops ? PALETTE.gold : '#6b4a34';
    ctx.beginPath();
    ctx.arc(box.x + box.w / 2 + (i - 1) * 16, box.y + box.h - 14, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStove(ctx, state) {
  const box = STATIONS.stove;
  drawStationBase(ctx, box);
  roundedRect(ctx, box.x + 18, box.y + 28, box.w - 36, box.h - 50, 8, '#3b3f44', '#20252a', 3);
  ctx.fillStyle = state.stove.heat > 0 ? '#e0602f' : '#49332a';
  ctx.beginPath();
  ctx.arc(box.x + box.w / 2, box.y + 68, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = state.stove.heat > 0 ? '#ffc464' : '#6b4a34';
  ctx.beginPath();
  ctx.arc(box.x + box.w / 2, box.y + 68, 17, 0, Math.PI * 2);
  ctx.fill();
  if (state.stove.item) drawIngredient(ctx, state.stove.item.id, box.x + box.w / 2, box.y + 62, 20, state.stove.heat >= 1);
  ctx.strokeStyle = '#f3c35b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(box.x + box.w / 2, box.y + 68, 32, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * state.stove.heat);
  ctx.stroke();
  ctx.fillStyle = '#f7e0b2';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.stove.heat >= 1 ? 'READY' : `${Math.round(state.stove.heat * 100)}%`, box.x + box.w / 2, box.y + box.h - 12);
}

function drawBench(ctx, state) {
  const box = STATIONS.assembly;
  drawStationBase(ctx, box);
  roundedRect(ctx, box.x + 16, box.y + 30, box.w - 32, box.h - 52, 7, '#d9c5a3', '#8e6a45', 3);
  drawPlate(ctx, box.x + box.w / 2, box.y + 74, 1.05);
  state.bench.parts.forEach((part, index) => {
    const a = index * 2.1 + 0.4;
    drawIngredient(ctx, part, box.x + box.w / 2 + Math.cos(a) * 24, box.y + 68 + Math.sin(a) * 8, 11);
  });
  if (state.bench.flash > 0) {
    ctx.strokeStyle = `rgba(255,220,130,${state.bench.flash})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(box.x + box.w / 2, box.y + 72, 56, 26, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#5a3a26';
  ctx.font = '12px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.bench.parts.length ? `${state.bench.parts.length} / 3 on plate` : 'empty plate', box.x + box.w / 2, box.y + box.h - 10);
}

function drawPass(ctx, state) {
  const box = STATIONS.pass;
  drawStationBase(ctx, box);
  roundedRect(ctx, box.x + 12, box.y + 30, box.w - 24, box.h - 52, 7, '#c9b493', '#7c5636', 3);
  if (state.pass.dish) {
    drawPreparedDish(ctx, state.pass.dish.parts, box.x + box.w / 2, box.y + 72, state.pass.dish.valid ? '#d9682f' : '#8a7c6a', 0.86);
    if (state.pass.dish.valid) {
      ctx.fillStyle = PALETTE.gold;
      ctx.beginPath();
      ctx.arc(box.x + box.w - 26, box.y + 24, 8 + state.pass.bell * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = '#7a5c42';
    ctx.font = 'italic 14px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('ready for a plate', box.x + box.w / 2, box.y + 74);
  }
  ctx.fillStyle = '#f7e0b2';
  ctx.font = 'bold 12px Georgia, serif';
  ctx.fillText('CLICK TO SERVE', box.x + box.w / 2, box.y + box.h - 10);
}

function drawCrates(ctx) {
  INGREDIENTS.forEach((item, index) => {
    const x = CRATE_X[index];
    const y = CRATE_Y;
    ctx.save();
    ctx.shadowColor = '#0006';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;
    roundedRect(ctx, x - 36, y - 26, 72, 62, 6, '#7d4c2d', '#3e2417', 3);
    ctx.restore();
    roundedRect(ctx, x - 30, y - 20, 60, 42, 4, '#a46a3c');
    drawIngredient(ctx, item.id, x, y - 2, 18);
    ctx.fillStyle = '#f7e6c4';
    ctx.font = 'bold 11px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${index + 1}`, x - 26, y + 32);
    ctx.fillText(item.name.toUpperCase(), x, y + 50);
  });
}

function drawChef(ctx, chef) {
  const x = chef.x;
  const y = chef.y;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(chef.facing, 1);
  ctx.fillStyle = '#0005';
  ctx.beginPath();
  ctx.ellipse(0, 26, 26, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f5efe2';
  roundedRect(ctx, -19, -18, 38, 48, 12, '#f5efe2', '#c9bca8', 2);
  ctx.fillStyle = PALETTE.copper;
  ctx.fillRect(-19, 12, 38, 6);
  ctx.fillStyle = '#e8c39b';
  ctx.beginPath();
  ctx.arc(2, -34, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f7f2e6';
  ctx.beginPath();
  ctx.roundRect(-16, -52, 36, 16, 6);
  ctx.fill();
  ctx.fillRect(-6, -58, 18, 10);
  ctx.fillStyle = '#2b1a14';
  ctx.beginPath();
  ctx.arc(8, -34, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e8c39b';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(14, -2);
  ctx.lineTo(28, 10);
  ctx.stroke();
  if (chef.carrying) drawIngredient(ctx, chef.carrying.id, 30, 6, 14, chef.carrying.prepared);
  ctx.restore();
}

// Three regulars wait just beyond the pass, so a served plate has someone to reach.
function drawDiners(ctx) {
  const seats = [
    { x: 844, coat: '#7d9c8e', skin: '#d9a87c' },
    { x: 900, coat: '#b2746d', skin: '#edc39b' },
    { x: 952, coat: '#6f7fa0', skin: '#b98562' },
  ];
  seats.forEach((seat, index) => {
    ctx.save();
    ctx.fillStyle = '#00000033';
    ctx.beginPath();
    ctx.ellipse(seat.x, 398, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = seat.coat;
    ctx.beginPath();
    ctx.moveTo(seat.x - 24, 396);
    ctx.quadraticCurveTo(seat.x - 20, 348, seat.x, 344);
    ctx.quadraticCurveTo(seat.x + 20, 348, seat.x + 24, 396);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = seat.skin;
    ctx.beginPath();
    ctx.arc(seat.x, 334, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ['#3a2a26', '#4b3427', '#2f2622'][index];
    ctx.beginPath();
    ctx.arc(seat.x, 326, 16, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#2b1a14';
    ctx.beginPath();
    ctx.arc(seat.x - 6, 336, 1.6, 0, Math.PI * 2);
    ctx.arc(seat.x + 6, 336, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

export function drawKitchen(ctx, state) {
  drawWall(ctx);
  drawFloor(ctx);
  drawDiners(ctx);
  drawPrepStation(ctx, state);
  drawStove(ctx, state);
  drawBench(ctx, state);
  drawPass(ctx, state);
  drawCrates(ctx);
  drawChef(ctx, state.chef);
}
