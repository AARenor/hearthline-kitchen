// The floor route a cook walks: crates, chop, fire, plate and pass.
// Drawn under the stations so the order of work reads in one glance.
const ROUTE = [
  { x: 199, label: '1' },
  { x: 435, label: '2' },
  { x: 671, label: '3' },
  { x: 890, label: '4' },
];

function arrow(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 6);
  ctx.lineTo(x, y);
  ctx.lineTo(x - 8, y + 6);
  ctx.stroke();
}

export function drawRouteArrows(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(247, 209, 145, 0.72)';
  ctx.lineWidth = 3;
  ctx.setLineDash([9, 8]);
  ctx.beginPath();
  ctx.moveTo(60, 586);
  ctx.lineTo(948, 586);
  ctx.stroke();
  ctx.setLineDash([]);

  ROUTE.forEach((stop, index) => {
    ctx.fillStyle = '#2d1c14';
    ctx.beginPath();
    ctx.arc(stop.x, 586, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d7a45f';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#ffe0a6';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stop.label, stop.x, 587);
    if (index < ROUTE.length - 1) arrow(ctx, (stop.x + ROUTE[index + 1].x) / 2 + 12, 586);
  });

  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

export function drawChefRoute(ctx, chef) {
  const walk = Math.hypot(chef.targetX - chef.x, chef.targetY - chef.y);
  if (walk < 14) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 220, 150, 0.55)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 6]);
  ctx.beginPath();
  ctx.moveTo(chef.x, chef.y + 14);
  ctx.lineTo(chef.targetX, chef.targetY + 14);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#f3c35b';
  ctx.beginPath();
  ctx.arc(chef.targetX, chef.targetY + 14, 9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
