import { useEffect, type RefObject } from 'react';

import { motion } from 'motion/react';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useBackground } from '@/common/state/background';

import { useBoardPosition } from '../hooks/useBoardPosition';

export const BG_COLORS = {
  dark: { fill: '#2b1f36', dots: '#443a4e' },
  light: { fill: '#f8f0ff', dots: '#e6d9f2' },
} as const;

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  mode: 'dark' | 'light',
  lines: boolean,
  spacing: number,
) => {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = BG_COLORS[mode].fill;
  ctx.fillRect(0, 0, width, height);

  if (!lines) return;

  ctx.fillStyle = BG_COLORS[mode].dots;
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const Background = ({ bgRef }: { bgRef: RefObject<HTMLCanvasElement | null> }) => {
  const bg = useBackground();
  const { x, y } = useBoardPosition();

  useEffect(() => {
    const ctx = bgRef.current?.getContext('2d');
    if (ctx) drawBackground(ctx, bg.mode, bg.lines, 25);

    document.body.style.backgroundColor = BG_COLORS[bg.mode].fill;
  }, [bgRef, bg]);

  return (
    <motion.canvas
      ref={bgRef}
      width={CANVAS_SIZE.width}
      height={CANVAS_SIZE.height}
      className="absolute top-0 bg-zinc-100"
      style={{ x, y }}
    />
  );
};

export default Background;
