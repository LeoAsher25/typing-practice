import type { RegionRandomLesson } from './types';
import { rng } from './rng';

export function generateRegionRandom(
  lesson: RegionRandomLesson,
  seed: number = Date.now()
): string {
  const random = rng(seed);
  const minRun = lesson.minRun ?? 1;
  const maxRepeat = lesson.maxRepeat ?? lesson.pool.length;
  let result = '';
  let lastChar = '';
  let repeatCount = 0;
  const recentChars: string[] = [];

  while (result.length < lesson.length) {
    let char: string;
    let attempts = 0;
    const distinctRecent = new Set(recentChars).size;

    do {
      const idx = Math.floor(random() * lesson.pool.length);
      char = lesson.pool[idx];
      attempts++;
      if (attempts > 200) break; // Safety break
    } while (
      (char === lastChar && repeatCount >= maxRepeat) ||
      (distinctRecent < minRun && recentChars.length >= minRun && recentChars.includes(char))
    );

    if (char === lastChar) {
      repeatCount++;
    } else {
      repeatCount = 0;
    }

    result += char;
    lastChar = char;
    recentChars.push(char);
    if (recentChars.length > minRun * 2) {
      recentChars.shift();
    }
  }

  return result;
}

