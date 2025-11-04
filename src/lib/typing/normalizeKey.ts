export function normalizeKey(key: string): string {
  const lower = key.toLowerCase();

  // Handle space
  if (lower === ' ' || key === 'Space') {
    return 'space';
  }

  // Handle special keys
  const specialMap: Record<string, string> = {
    'semicolon': ';',
    'quote': "'",
    'comma': ',',
    'period': '.',
    'slash': '/',
    'backslash': '\\',
    'bracketleft': '[',
    'bracketright': ']',
    'minus': '-',
    'equal': '=',
    'backquote': '`',
    'enter': 'enter',
    'backspace': 'backspace',
    'tab': 'tab',
    'capslock': 'capslock',
    'shift': 'shiftleft',
    'shiftleft': 'shiftleft',
    'shiftright': 'shiftright',
    'control': 'controlleft',
    'ctrl': 'controlleft',
    'controlleft': 'controlleft',
    'controlright': 'controlright',
    'alt': 'altleft',
    'altleft': 'altleft',
    'altright': 'altright',
    'meta': 'winleft',
    'win': 'winleft',
    'winleft': 'winleft',
    'winright': 'winright',
    'contextmenu': 'menuright',
    'menuright': 'menuright',
    'delete': 'delete',
  };

  if (specialMap[lower]) {
    return specialMap[lower];
  }

  // Handle single character keys
  if (lower.length === 1) {
    return lower;
  }

  // Return lowercase for other keys
  return lower;
}

