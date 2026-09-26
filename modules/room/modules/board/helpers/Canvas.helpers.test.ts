import { describe, expect, it } from 'vitest';

import { insetRect, normalizeRect } from './Canvas.helpers';

describe('normalizeRect', () => {
  it('makes the width and the height positive and moves the start point', () => {
    expect(normalizeRect({ x: 100, y: 50, width: -40, height: -20 })).toEqual({
      x: 60,
      y: 30,
      width: 40,
      height: 20,
    });
  });

  it('keeps a rectangle that is already normal', () => {
    const rect = { x: 1, y: 2, width: 3, height: 4 };
    expect(normalizeRect(rect)).toEqual(rect);
  });
});

describe('insetRect', () => {
  it('makes the rectangle smaller on each side', () => {
    expect(insetRect({ x: 10, y: 10, width: 20, height: 30 }, 2)).toEqual({
      x: 12,
      y: 12,
      width: 16,
      height: 26,
    });
  });

  it('never returns a negative size', () => {
    expect(insetRect({ x: 0, y: 0, width: 3, height: 3 }, 2)).toMatchObject({
      width: 0,
      height: 0,
    });
  });
});
