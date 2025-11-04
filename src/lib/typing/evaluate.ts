export type TypingState = {
  typed: string[];
  currentIndex: number;
  errors: Set<number>;
  startTime: number | null;
  endTime: number | null;
  pauses: Array<{ start: number; end: number }>;
  lastKeyTime: number | null;
};

export function calculateWPM(
  correctChars: number,
  startTime: number,
  endTime: number,
  pauses: Array<{ start: number; end: number }>
): number {
  const totalTimeMs = endTime - startTime;
  const pauseTimeMs = pauses.reduce(
    (acc, p) => acc + (p.end - p.start),
    0
  );
  const activeTimeMs = totalTimeMs - pauseTimeMs;
  const minutes = activeTimeMs / 60000;
  if (minutes <= 0) return 0;
  return (correctChars / 5) / minutes;
}

export function calculateAccuracy(
  correctChars: number,
  totalChars: number
): number {
  if (totalChars === 0) return 0;
  return Math.round((correctChars / totalChars) * 100);
}

