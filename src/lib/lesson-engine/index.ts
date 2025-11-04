import type { Lesson, GeneratedTarget } from './types';
import { generateSequence } from './sequence';
import { generateFingerMix } from './fingerMix';
import { generateRegionRandom } from './regionRandom';
import { generateTimed } from './timed';

export function generateLesson(
  lesson: Lesson,
  seed?: number
): GeneratedTarget {
  switch (lesson.type) {
    case 'sequence':
      return {
        text: generateSequence(lesson, seed),
        type: 'sequence',
      };
    case 'finger-mix':
      return {
        text: generateFingerMix(lesson, seed),
        type: 'finger-mix',
      };
    case 'region-random':
      return {
        text: generateRegionRandom(lesson, seed),
        type: 'region-random',
      };
    case 'timed':
      return {
        text: generateTimed(lesson, seed),
        type: 'timed',
      };
    default:
      throw new Error(`Unknown lesson type: ${(lesson as Lesson).type}`);
  }
}

