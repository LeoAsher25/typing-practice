import type { SequenceLesson } from './types';
import { rng } from './rng';

export function generateSequence(
  lesson: SequenceLesson,
  seed: number = Date.now()
): string {
  const random = rng(seed);
  let sequence: string[] = [];

  switch (lesson.pattern) {
    case 'ascend':
      sequence = [...lesson.pool];
      break;
    case 'descend':
      sequence = [...lesson.pool].reverse();
      break;
    case 'mirror':
      sequence = [
        ...lesson.pool.slice(0, Math.ceil(lesson.pool.length / 2)),
        ...lesson.pool.slice(0, Math.floor(lesson.pool.length / 2)).reverse(),
      ];
      break;
    case 'shuffle':
      const shuffled = [...lesson.pool];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      sequence = shuffled;
      break;
  }

  const chunks: string[] = [];
  for (let r = 0; r < lesson.repeat; r++) {
    let chunk = '';
    for (let c = 0; c < lesson.chunk; c++) {
      const idx = (r * lesson.chunk + c) % sequence.length;
      chunk += sequence[idx];
    }
    chunks.push(chunk);
  }

  return chunks.join('');
}

