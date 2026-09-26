import { describe, expect, it } from 'vitest';

import { getFitSize } from './optimizeImage';

describe('getFitSize', () => {
  it('keeps a small image at its size', () => {
    expect(getFitSize(300, 200)).toEqual({ width: 300, height: 200 });
  });

  it('makes a large image fit and keeps the aspect ratio', () => {
    expect(getFitSize(1400, 700)).toEqual({ width: 700, height: 350 });
    expect(getFitSize(500, 2000)).toEqual({ width: 175, height: 700 });
  });
});
