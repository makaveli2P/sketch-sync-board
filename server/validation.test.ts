import { describe, expect, it } from 'vitest';

import { DEFAULT_MOVE } from '@/common/constants/defaultMove';

import {
  MAX_IMAGE_LENGTH,
  MAX_PATH_POINTS,
  parseMessage,
  parseMove,
  parseRoomId,
  parseUsername,
} from './validation';

const validMove = {
  ...DEFAULT_MOVE,
  path: [
    [10, 10],
    [20, 20],
  ],
  options: { ...DEFAULT_MOVE.options, lineColor: { r: 0, g: 0, b: 0, a: 1 } },
};

describe('parseMove', () => {
  it('accepts a valid line move and removes unknown fields', () => {
    const parsed = parseMove({ ...validMove, id: 'client-id', extra: 'x' });

    expect(parsed).not.toBeNull();
    expect(parsed).not.toHaveProperty('id');
    expect(parsed).not.toHaveProperty('extra');
    expect(parsed?.path).toEqual(validMove.path);
  });

  it.each([
    ['null', null],
    ['a string', 'draw'],
    ['a move without options', { ...validMove, options: undefined }],
    ['an empty path', { ...validMove, path: [] }],
    ['a path with a bad point', { ...validMove, path: [[1, 'x']] }],
    ['a path with NaN', { ...validMove, path: [[1, Number.NaN]] }],
    ['the select mode', { ...validMove, options: { ...validMove.options, mode: 'select' } }],
    ['an unknown shape', { ...validMove, options: { ...validMove.options, shape: 'star' } }],
    ['a line width of 0', { ...validMove, options: { ...validMove.options, lineWidth: 0 } }],
    [
      'a color out of range',
      { ...validMove, options: { ...validMove.options, lineColor: { r: 300, g: 0, b: 0, a: 1 } } },
    ],
    ['a circle without numbers', { ...validMove, circle: { cX: 'a' } }],
    [
      'a negative circle radius',
      { ...validMove, circle: { cX: 0, cY: 0, radiusX: -1, radiusY: 5 } },
    ],
  ])('rejects %s', (_name, move) => {
    expect(parseMove(move)).toBeNull();
  });

  it('rejects a path with too many points', () => {
    const path = Array.from({ length: MAX_PATH_POINTS + 1 }, () => [1, 1]);
    expect(parseMove({ ...validMove, path })).toBeNull();
  });

  it('accepts an image move with a data URI', () => {
    const move = {
      ...validMove,
      img: { base64: 'data:image/webp;base64,AAAA' },
      options: { ...validMove.options, shape: 'image' },
    };
    expect(parseMove(move)?.img.base64).toBe('data:image/webp;base64,AAAA');
  });

  it('rejects an image move with a URL or a too large image', () => {
    const imageOptions = { ...validMove.options, shape: 'image' };
    expect(
      parseMove({
        ...validMove,
        img: { base64: 'https://example.com/a.png' },
        options: imageOptions,
      }),
    ).toBeNull();
    expect(
      parseMove({
        ...validMove,
        img: { base64: `data:image/png;base64,${'A'.repeat(MAX_IMAGE_LENGTH)}` },
        options: imageOptions,
      }),
    ).toBeNull();
  });

  it('removes the image data from a move that is not an image', () => {
    const parsed = parseMove({ ...validMove, img: { base64: 'data:image/png;base64,AAAA' } });
    expect(parsed?.img.base64).toBe('');
  });
});

describe('parseRoomId', () => {
  it('returns the id in lower case without spaces', () => {
    expect(parseRoomId(' AB12 ')).toBe('ab12');
  });

  it.each([undefined, 5, '', 'abc', 'abcde', 'ab-1'])('rejects %s', (value) => {
    expect(parseRoomId(value)).toBeNull();
  });
});

describe('parseUsername', () => {
  it('shortens long names and uses "Anonymous" for empty names', () => {
    expect(parseUsername('a'.repeat(40))).toHaveLength(15);
    expect(parseUsername('   ')).toBe('Anonymous');
    expect(parseUsername(undefined)).toBe('Anonymous');
  });
});

describe('parseMessage', () => {
  it('returns null for an empty message and shortens a long message', () => {
    expect(parseMessage('  ')).toBeNull();
    expect(parseMessage(42)).toBeNull();
    expect(parseMessage('x'.repeat(1000))).toHaveLength(500);
  });
});
