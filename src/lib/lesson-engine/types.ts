export type LessonBase = {
  id: string;
  title: string;
  type: 'sequence' | 'finger-mix' | 'region-random' | 'timed';
  pool: string[];
  goal: { wpm: number; accuracy: number; timeSec?: number };
  allowBackspace?: boolean;
};

export type SequenceLesson = LessonBase & {
  type: 'sequence';
  pattern: 'ascend' | 'descend' | 'mirror' | 'shuffle';
  chunk: number;
  repeat: number;
};

export type FingerMixLesson = LessonBase & {
  type: 'finger-mix';
  finger?: 'LL' | 'LR' | 'LM' | 'LI' | 'RI' | 'RM' | 'RR' | 'RL';
  chunk: number;
  repeat: number;
  maxRepeat?: number;
};

export type RegionRandomLesson = LessonBase & {
  type: 'region-random';
  minRun?: number;
  maxRepeat?: number;
  length: number;
};

export type TimedLesson = LessonBase & {
  type: 'timed';
  timeLimitSec: number;
};

export type Lesson =
  | SequenceLesson
  | FingerMixLesson
  | RegionRandomLesson
  | TimedLesson;

export type GeneratedTarget = {
  text: string;
  type: 'sequence' | 'finger-mix' | 'region-random' | 'timed';
};

