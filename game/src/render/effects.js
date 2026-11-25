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
