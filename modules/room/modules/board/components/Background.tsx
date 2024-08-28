import { RefObject, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useBackground } from '@/common/recoil/background';
import { useBoardPosition } from '../hooks/useBoardPosition';

const Background = ({ bgRef }: { bgRef: RefObject<HTMLCanvasElement> }) => {
  const bg = useBackground();
  const { x, y } = useBoardPosition();

  useEffect(() => {
    const ctx = bgRef.current?.getContext('2d');

    if (ctx) {
      // Add purple hue to background
      ctx.fillStyle = bg.mode === 'dark' ? '#2b1f36' : '#f8f0ff';
      ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

      document.body.style.backgroundColor =
        bg.mode === 'dark' ? '#2b1f36' : '#f8f0ff';

      if (bg.lines) {
        ctx.fillStyle = bg.mode === 'dark' ? '#443a4e' : '#e6d9f2';
        const dotSize = 2;
        const spacing = 25;

        for (let x = 0; x < CANVAS_SIZE.width; x += spacing) {
          for (let y = 0; y < CANVAS_SIZE.height; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
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