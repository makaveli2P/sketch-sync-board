import { describe, expect, it } from 'vitest';

import { parseOrigins } from './origins';

describe('parseOrigins', () => {
  it('returns an empty list when the setting is empty', () => {
    expect(parseOrigins(undefined)).toEqual([]);
    expect(parseOrigins(' , ')).toEqual([]);
  });

  it('removes spaces and trailing slashes', () => {
    expect(parseOrigins(' https://a.example/ , https://b.example ')).toEqual([
      'https://a.example',
      'https://b.example',
    ]);
  });

  it('turns a "*" into a pattern for one part of a host name', () => {
    const [pattern] = parseOrigins('https://app-*-team.vercel.app');

    expect(pattern).toBeInstanceOf(RegExp);
    const regex = pattern as RegExp;
    expect(regex.test('https://app-abc123-team.vercel.app')).toBe(true);
    expect(regex.test('https://app-a.b-team.vercel.app')).toBe(false);
    expect(regex.test('https://evil.example/https://app-x-team.vercel.app')).toBe(false);
    expect(regex.test('https://app-x-team.vercel.app.evil.example')).toBe(false);
  });
});
