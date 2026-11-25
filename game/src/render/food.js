// Hand-drawn food art. Every ingredient is built from shapes, never an image file.
import { ingredientById, PALETTE } from '../config.js';

function ellipse(ctx, x, y, rx, ry, fill, stroke) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function leaf(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.5);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.6, -size, size * 1.5, -size * 0.5);
  ctx.quadraticCurveTo(size * 0.7, size * 0.2, 0, 0);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function drawIngredient(ctx, id, x, y, size = 26, prepared = false) {
  const item = ingredientById(id);
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = '#0006';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  if (id === 'tomato') {
    ellipse(ctx, 0, 2, size, size * 0.86, item.color);
    ellipse(ctx, -size * 0.28, -size * 0.2, size * 0.32, size * 0.2, '#ff8a72');
    leaf(ctx, 0, -size * 0.72, size * 0.3, item.leaf);
  } else if (id === 'mushroom') {
    ctx.fillStyle = '#e8d5b4';
    ctx.fillRect(-size * 0.28, 0, size * 0.56, size * 0.8);
    ctx.beginPath();
    ctx.arc(0, 0, size, Math.PI, 0);
    ctx.fillStyle = item.color;
    ctx.fill();
    ellipse(ctx, -size * 0.3, -size * 0.35, size * 0.15, size * 0.08, '#d9b9a0');
    ellipse(ctx, size * 0.3, -size * 0.3, size * 0.12, size * 0.07, '#d9b9a0');
  } else if (id === 'noodle') {
    ctx.strokeStyle = item.leaf;
    ctx.lineWidth = Math.max(2, size * 0.12);
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-size, i * size * 0.28);
      ctx.bezierCurveTo(-size * 0.3, i * size * 0.28 - size * 0.5, size * 0.3, i * size * 0.28 + size * 0.5, size, i * size * 0.28);
      ctx.stroke();
    }
  } else if (id === 'herb') {
    for (let i = -1; i <= 1; i += 1) {
      leaf(ctx, i * size * 0.4, i * size * 0.18, size * 0.5, i === 0 ? item.leaf : item.color);
    }
    ctx.strokeStyle = '#3d6f30';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, size * 0.7);
    ctx.lineTo(size * 0.8, -size * 0.6);
    ctx.stroke();
  } else if (id === 'fish') {
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.quadraticCurveTo(0, -size * 0.9, size * 0.8, 0);
    ctx.quadraticCurveTo(0, size * 0.9, -size, 0);
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.7, 0);
    ctx.lineTo(size * 1.3, -size * 0.5);
    ctx.lineTo(size * 1.3, size * 0.5);
    ctx.closePath();
    ctx.fillStyle = '#6f9eae';
    ctx.fill();
    ellipse(ctx, -size * 0.6, -size * 0.12, 2.5, 2.5, '#22333a');
  } else if (id === 'pepper') {
    ctx.beginPath();
    ctx.moveTo(-size * 0.1, -size * 0.85);
    ctx.bezierCurveTo(size * 1.05, -size * 0.6, size * 0.75, size * 0.85, -size * 0.1, size * 0.8);
    ctx.bezierCurveTo(-size * 0.8, size * 0.7, -size * 0.8, -size * 0.5, -size * 0.1, -size * 0.85);
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.strokeStyle = item.leaf;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-size * 0.1, -size * 0.8);
    ctx.lineTo(size * 0.15, -size * 1.2);
    ctx.stroke();
  } else if (id === 'rice') {
    for (let i = 0; i < 14; i += 1) {
      const a = i * 2.399;
      const r = size * 0.72 * Math.sqrt(i / 14);
      ellipse(ctx, Math.cos(a) * r, Math.sin(a) * r * 0.7, size * 0.13, size * 0.08, i % 3 ? '#fbf3e2' : item.color);
    }
  } else if (id === 'lemon') {
    ellipse(ctx, 0, 0, size, size * 0.72, item.color);
    ctx.strokeStyle = '#fff3b0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.72, size * 0.48, 0, 0, Math.PI * 2);
    ctx.stroke();
    leaf(ctx, size * 0.6, -size * 0.5, size * 0.25, item.leaf);
  }
  ctx.restore();

  if (prepared) {
    ctx.fillStyle = '#f8e8a0';
    ctx.font = `bold ${Math.max(10, size * 0.45)}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillText('READY', x, y + size + 14);
  }
}

export function drawPlate(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.shadowColor = '#0007';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 8;
  ellipse(ctx, 0, 0, 66, 24, '#d9d3c6');
  ctx.shadowColor = 'transparent';
  ellipse(ctx, 0, -3, 58, 19, '#fbf7ee');
  ellipse(ctx, 0, -4, 46, 13, '#e9e2d4');
  ctx.strokeStyle = '#cbbfa9';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, -3, 52, 16, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawPreparedDish(ctx, parts, x, y, color = '#d9682f', scale = 1) {
  drawPlate(ctx, x, y, scale);
  ctx.save();
  ctx.translate(x, y - 9 * scale);
  ctx.scale(scale, scale);
  ctx.shadowColor = '#0004';
  ctx.shadowBlur = 6;
  ellipse(ctx, 0, 0, 40, 13, color);
  ctx.shadowColor = 'transparent';
  ellipse(ctx, -8, -3, 18, 5, '#ffffff30');
  parts.forEach((part, index) => {
    const a = index * 2.1 + 0.4;
    drawIngredient(ctx, part, Math.cos(a) * 24, Math.sin(a) * 10, 13, false);
  });
  leaf(ctx, 30, -10, 10, PALETTE.herb);
  ctx.fillStyle = '#f8e5a8';
  [-14, 2, 16].forEach((px, index) => {
    ctx.beginPath();
    ctx.arc(px, index === 1 ? 6 : -5, 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

export function drawTicketIcon(ctx, parts, x, y, scale = 0.42) {
  drawPreparedDish(ctx, parts.slice(0, 3), x, y, '#e2a35f', scale);
}
