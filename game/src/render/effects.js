// Steam, sparks and tiny bits of motion that make actions answer at once.
export function drawEffects(ctx, state) {
  state.particles.forEach((particle) => {
    const fade = Math.max(0, particle.life / particle.maxLife);
    ctx.save();
    ctx.globalAlpha = fade * 0.8;
    if (particle.kind === 'steam') {
      ctx.fillStyle = '#fff6e2';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * (1.6 - fade), 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

export function drawComboBurst(ctx, state) {
  if (state.combo < 3) return;
  ctx.save();
  ctx.translate(880, 248);
  ctx.rotate(Math.PI / 16);
  ctx.beginPath();
  for (let i = 0; i < 16; i += 1) {
    const angle = (i * Math.PI * 2) / 16;
    const radius = i % 2 ? 26 : 42;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = '#d99135';
  ctx.fill();
  ctx.strokeStyle = '#f8d98e';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.rotate(-Math.PI / 16);
  ctx.fillStyle = '#2d1a12';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`x${state.combo}`, 0, 1);
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

export function emitCookingEffects(state) {
  if (state.stove.item && state.stove.heat < 1 && Math.random() < 0.4) {
    state.particles.push({
      x: 440 + (Math.random() - 0.5) * 30,
      y: 480,
      vx: (Math.random() - 0.5) * 8,
      vy: -22 - Math.random() * 20,
      gravity: -4,
      life: 1.4,
      maxLife: 1.4,
      color: '#fff3d8',
      size: 8 + Math.random() * 8,
      kind: 'steam',
    });
  }
}
