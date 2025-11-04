import type { FingerMixLesson } from './types';
import { rng } from './rng';

export function generateFingerMix(
  lesson: FingerMixLesson,
  seed: number = Date.now()
): string {
  const random = rng(seed);
  const maxRepeat = lesson.maxRepeat ?? lesson.pool.length;
  let result = '';
  let lastChar = '';
  let repeatCount = 0;

  for (let r = 0; r < lesson.repeat; r++) {
    let chunk = '';
    for (let c = 0; c < lesson.chunk; c++) {
      let char: string;
      let attempts = 0;
      do {
        const idx = Math.floor(random() * lesson.pool.length);
        char = lesson.pool[idx];
        attempts++;
        if (attempts > 100) break; // Safety break
      } while (char === lastChar && repeatCount >= maxRepeat);

      if (char === lastChar) {
        repeatCount++;
      } else {
        repeatCount = 0;
      }
      lastChar = char;
      chunk += char;
    }
    result += chunk;
  }

  return result;
}

