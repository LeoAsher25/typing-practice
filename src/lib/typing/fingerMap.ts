export type FingerId =
  | 'LL'
  | 'LR'
  | 'LM'
  | 'LI'
  | 'TH'
  | 'RI'
  | 'RM'
  | 'RR'
  | 'RL';

const fingerMap: Record<string, FingerId> = {
  // Left Little (LL)
  '`': 'LL',
  '1': 'LL',
  'q': 'LL',
  'a': 'LL',
  'z': 'LL',
  'tab': 'LL',
  'capslock': 'LL',
  'shiftleft': 'LL',
  'controlleft': 'LL',
  'winleft': 'LL',
  'altleft': 'LL',
  // Left Ring (LR)
  '2': 'LR',
  'w': 'LR',
  's': 'LR',
  'x': 'LR',
  // Left Middle (LM)
  '3': 'LM',
  'e': 'LM',
  'd': 'LM',
  'c': 'LM',
  // Left Index (LI)
  '4': 'LI',
  '5': 'LI',
  'r': 'LI',
  't': 'LI',
  'f': 'LI',
  'g': 'LI',
  'v': 'LI',
  'b': 'LI',
  // Thumbs (TH)
  ' ': 'TH',
  'space': 'TH',
  // Right Index (RI)
  '6': 'RI',
  '7': 'RI',
  'y': 'RI',
  'u': 'RI',
  'h': 'RI',
  'j': 'RI',
  'n': 'RI',
  'm': 'RI',
  // Right Middle (RM)
  '8': 'RM',
  'i': 'RM',
  'k': 'RM',
  ',': 'RM',
  // Right Ring (RR)
  '9': 'RR',
  'o': 'RR',
  'l': 'RR',
  '.': 'RR',
  // Right Little (RL)
  '0': 'RL',
  '-': 'RL',
  '=': 'RL',
  'p': 'RL',
  '[': 'RL',
  ']': 'RL',
  ';': 'RL',
  "'": 'RL',
  '/': 'RL',
  '\\': 'RL',
  'backspace': 'RL',
  'enter': 'RL',
  'shiftright': 'RL',
  'controlright': 'RL',
  'winright': 'RL',
  'altright': 'RL',
  'menuright': 'RL',
  'delete': 'RL',
};

export function getFingerForKey(key: string): FingerId {
  const normalized = key.toLowerCase();
  return fingerMap[normalized] ?? 'TH';
}

export function getFingerColor(finger: FingerId): string {
  const colors: Record<FingerId, string> = {
    LL: '#FCA5A5',
    LR: '#FBCFE8',
    LM: '#FDE68A',
    LI: '#86EFAC',
    TH: '#E5E7EB',
    RI: '#93C5FD',
    RM: '#C7D2FE',
    RR: '#DDD6FE',
    RL: '#FBCFE8',
  };
  return colors[finger];
}

