import { useEffect, useRef } from 'react';

interface Props {
  x: number;
  y: number;
  isMoving: boolean;
}

export default function WalkingFigure({ x, y, isMoving }: Props) {
  const frameRef  = useRef(0);
  const tickRef   = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isMoving) {
      tickRef.current += 1;
      if (tickRef.current % 6 === 0) {
        frameRef.current = (frameRef.current + 1) % 8;
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 48, H = 72;
    canvas.width  = W;
    canvas.height = H + 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frame  = frameRef.current;
    const swing  = isMoving ? Math.sin((frame / 8) * Math.PI * 2) : 0;
    const bounce = isMoving ? Math.abs(Math.sin((frame / 8) * Math.PI * 2)) * 2 : 0;

    const cx     = W / 2;
    const headR  = 7;
    const bodyY1 = headR * 2 + 2 - bounce;
    const bodyY2 = bodyY1 + 20;
    const hipY   = bodyY2;

    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = 'round';

    // ellipse shadow projected on the background
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(cx, H + 8, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // head
    ctx.beginPath();
    ctx.arc(cx, headR + 1 - bounce, headR, 0, Math.PI * 2);
    ctx.stroke();

    // body
    ctx.beginPath();
    ctx.moveTo(cx, bodyY1);
    ctx.lineTo(cx, bodyY2);
    ctx.stroke();

    // arms
    const armAngle = swing * 0.5;
    ctx.save();
    ctx.translate(cx, bodyY1 + 6);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-14 * Math.cos(armAngle), 14 * Math.sin(armAngle) + 6);
    ctx.moveTo(0, 0);
    ctx.lineTo( 14 * Math.cos(armAngle), -14 * Math.sin(armAngle) + 6);
    ctx.stroke();
    ctx.restore();

    // legs
    const legAngle = swing * 0.6;
    ctx.save();
    ctx.translate(cx, hipY);
    const kneeLen = 14;
    const shoeLen = 12;

    const lKneeX = -kneeLen * Math.sin(legAngle);
    const lKneeY =  kneeLen * Math.cos(legAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(lKneeX, lKneeY);
    ctx.lineTo(lKneeX + shoeLen * Math.sin(legAngle * 0.5), lKneeY + shoeLen * Math.cos(legAngle * 0.5));
    ctx.stroke();

    const rKneeX =  kneeLen * Math.sin(legAngle);
    const rKneeY =  kneeLen * Math.cos(legAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rKneeX, rKneeY);
    ctx.lineTo(rKneeX - shoeLen * Math.sin(legAngle * 0.5), rKneeY + shoeLen * Math.cos(legAngle * 0.5));
    ctx.stroke();
    ctx.restore();
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        left: x - 24,
        top:  y - 82,
        pointerEvents: 'none',
        zIndex: 9999,
        imageRendering: 'pixelated',
      }}
    />
  );
}
