import type { TimedLesson } from './types';
import { rng } from './rng';

export function generateTimed(
  lesson: TimedLesson,
  seed: number = Date.now()
): string {
  const random = rng(seed);
  const charsPerSecond = 5; // Estimate, can be adjusted
  const estimatedLength = Math.ceil(
    lesson.timeLimitSec * charsPerSecond * (lesson.goal.wpm / 60) * 5
  );
  let result = '';

  for (let i = 0; i < estimatedLength; i++) {
    const idx = Math.floor(random() * lesson.pool.length);
    result += lesson.pool[idx];
  }

  return result;
}

