// Order board, timer, score and toast. Kept readable when the sheet is shrunk.
import { RECIPES, ticketUrgency } from '../orders.js';
import { needsFire, PALETTE, SHIFT_SECONDS, VIEW } from '../config.js';
import { drawTicketIcon } from './food.js';

function rounded(ctx, x, y, w, h, r, fill, stroke, lw = 2) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}

function formatTime(seconds) {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
}

export function drawTopBar(ctx, state) {
  ctx.fillStyle = '#2b1b16ee';
  ctx.fillRect(0, 0, VIEW.width, 88);
  ctx.fillStyle = '#b3743e';
  ctx.fillRect(0, 85, VIEW.width, 3);

  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('HEARTHLINE', 28, 44);
  ctx.fillStyle = '#d9bd93';
  ctx.font = 'italic 14px Georgia, serif';
  ctx.fillText('KITCHEN  ·  dinner service', 29, 66);

  const urgency = 1 - state.shiftLeft / SHIFT_SECONDS;
  rounded(ctx, 356, 14, 216, 60, 8, '#1c1210', '#8b5c36');
  ctx.fillStyle = urgency > 0.75 ? '#ef7252' : PALETTE.cream;
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(formatTime(state.shiftLeft), 464, 53);
  ctx.fillStyle = '#b99a72';
  ctx.font = '10px Georgia, serif';
  ctx.fillText('SHIFT TIMER', 464, 68);

  rounded(ctx, 610, 14, 168, 60, 8, '#1c1210', '#8b5c36');
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(String(state.score).padStart(5, '0'), 694, 48);
  ctx.fillStyle = '#b99a72';
  ctx.font = '10px Georgia, serif';
  ctx.fillText('TIPS EARNED', 694, 68);

  rounded(ctx, 812, 14, 150, 60, 8, '#1c1210', '#8b5c36');
  ctx.fillStyle = state.combo > 2 ? '#ffca6b' : PALETTE.cream;
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(`x${state.combo}`, 887, 48);
  ctx.fillStyle = '#b99a72';
  ctx.font = '10px Georgia, serif';
  ctx.fillText('STREAK', 887, 68);

  rounded(ctx, 1110, 14, 140, 60, 8, '#1c1210', '#8b5c36');
  ctx.fillStyle = PALETTE.cream;
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText(`${state.served} / ${state.missed}`, 1180, 47);
  ctx.fillStyle = '#b99a72';
  ctx.font = '10px Georgia, serif';
  ctx.fillText('SERVED / LOST', 1180, 68);
}

function drawRushMeter(ctx, state) {
  const stage = state.rush;
  rounded(ctx, 972, 14, 126, 60, 8, '#1c1210', '#8b5c36');
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f3c35b';
  ctx.font = 'bold 12px Georgia, serif';
  ctx.fillText(`RUSH ${stage}`, 1035, 32);
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i < stage ? (stage >= 3 ? '#ef7252' : '#f3c35b') : '#4b3125';
    rounded(ctx, 988 + i * 24, 40, 18, 18, 4, ctx.fillStyle, null);
  }
  ctx.fillStyle = '#b99a72';
  ctx.font = '9px Georgia, serif';
  ctx.fillText('PRESSURE', 1035, 69);
}

export function drawOrderBoard(ctx, state) {
  rounded(ctx, 968, 104, 290, 486, 12, '#2d1e18f2', '#a56d3d', 3);
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 22px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('ORDER BOARD', 1113, 136);
  ctx.fillStyle = '#c8a67a';
  ctx.font = 'italic 12px Georgia, serif';
  ctx.fillText('three tickets on the rail', 1113, 156);

  state.tickets.slice(0, 3).forEach((ticket, index) => {
    const x = 984;
    const y = 172 + index * 132;
    const heat = ticketUrgency(ticket);
    rounded(ctx, x, y, 258, 120, 8, heat > 0.72 ? '#4a211c' : '#f2dfb9', heat > 0.72 ? '#e07151' : '#8f6239', 3);
    if (ticket.priority) {
      rounded(ctx, x + 3, y + 3, 252, 114, 7, null, '#f3c35b', 3);
      ctx.fillStyle = '#f3c35b';
      ctx.font = 'bold 10px Georgia, serif';
      ctx.textAlign = 'right';
      ctx.fillText('PRIORITY', x + 244, y + 20);
    }
    ctx.fillStyle = heat > 0.72 ? '#ffd3c4' : '#4a2b1c';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(ticket.name, x + 14, y + 27);

    drawTicketIcon(ctx, ticket.parts, x + 48, y + 67, 0.5);

    ticket.parts.forEach((part, partIndex) => {
      const px = x + 100 + partIndex * 50;
      rounded(ctx, px, y + 50, 42, 34, 6, '#fff6e2aa', '#b49161', 1);
      ctx.fillStyle = part === 'tomato' || part === 'pepper' ? '#c44838' : part === 'herb' ? '#4c8038' : '#6b4a2b';
      ctx.font = 'bold 9px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(part.slice(0, 4).toUpperCase(), px + 21, y + 71);
    });

    ctx.fillStyle = '#00000033';
    ctx.fillRect(x + 14, y + 96, 230, 9);
    ctx.fillStyle = heat > 0.72 ? '#ef6a4a' : heat > 0.45 ? '#e8a13f' : '#6ba255';
    ctx.fillRect(x + 14, y + 96, 230 * (1 - heat), 9);
    ctx.fillStyle = heat > 0.72 ? '#ffd3c4' : '#4a2b1c';
    ctx.font = 'bold 12px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.max(0, Math.ceil(ticket.remaining))}s`, x + 244, y + 94);
  });

  if (!state.tickets.length) {
    ctx.fillStyle = '#d8bb91';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('All caught up', 1113, 260);
  }
}

export function drawSidePanel(ctx, state) {
  rounded(ctx, 968, 602, 290, 178, 12, '#2d1e18f2', '#a56d3d', 3);
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('HOUSE RECIPES', 1113, 632);
  RECIPES.forEach((recipe, index) => {
    const y = 652 + index * 22;
    ctx.textAlign = 'left';
    ctx.fillStyle = recipe.color;
    ctx.beginPath();
    ctx.arc(988, y - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f6e0b8';
    ctx.font = 'bold 11px Georgia, serif';
    ctx.fillText(recipe.name.toUpperCase(), 1000, y);
    ctx.fillStyle = '#cbb18c';
    ctx.font = '10px Georgia, serif';
    ctx.fillText(recipe.parts.map((part) => needsFire(part) ? `${part}(fire)` : part).join('+'), 1124, y);
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9c7855';
  ctx.fillStyle = state.rush >= 3 ? '#f3c35b' : '#9c7855';
  ctx.font = 'italic 11px Georgia, serif';
  ctx.fillText(state.rush >= 3 ? 'SWIFT SHOES EARNED' : 'chop  ·  fire  ·  plate  ·  serve', 1113, 770);
}

export function drawToast(ctx, state) {
  if (state.toast.life <= 0) return;
  const alpha = Math.min(1, state.toast.life * 2);
  ctx.save();
  ctx.globalAlpha = alpha;
  rounded(ctx, 340, 96, 600, 50, 10, '#22140fee', '#d7a55f', 2);
  ctx.fillStyle = '#ffe1a6';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.toast.text, 640, 130);
  ctx.restore();
}

export function drawEndCard(ctx, state) {
  if (!state.over) return;
  ctx.fillStyle = '#150d0baa';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  rounded(ctx, 380, 250, 520, 290, 16, '#2d1e18', '#d7a55f', 4);
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 38px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('SHIFT COMPLETE', 640, 320);
  ctx.fillStyle = PALETTE.cream;
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText(`${state.served} plates served`, 640, 380);
  ctx.font = '22px Georgia, serif';
  ctx.fillText(`${state.score} tips  ·  x${state.combo} final streak`, 640, 420);
  ctx.fillStyle = '#d9bd93';
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillText('press R for another service', 640, 480);
}

export function drawHud(ctx, state) {
  drawTopBar(ctx, state);
  drawOrderBoard(ctx, state);
  drawRushMeter(ctx, state);
  drawSidePanel(ctx, state);
  drawToast(ctx, state);
  drawEndCard(ctx, state);
}
