import type { MotionValue } from 'motion/react';

// Converts a screen position to a board position.
export const getPos = (pos: number, motionValue: MotionValue<number>) => pos - motionValue.get();
