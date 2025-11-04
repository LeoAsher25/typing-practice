'use client';

import { useEffect, useState } from 'react';
import { getFingerForKey, getFingerColor, type FingerId } from '@/lib/typing/fingerMap';
import { normalizeKey } from '@/lib/typing/normalizeKey';

// Full keyboard layout with proper spacing
const KEYBOARD_LAYOUT = [
  // Row 1: Number row
  {
    keys: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    special: { end: 'backspace', width: 2 },
  },
  // Row 2: QWERTY row
  {
    keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    special: { start: 'tab', width: 1.5, end: '\\', endWidth: 1, final: 'enter', finalWidth: 1.75 },
  },
  // Row 3: ASDF row
  {
    keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    special: { start: 'capslock', width: 1.75, final: 'enter', finalWidth: 2.25 },
  },
  // Row 4: ZXCV row
  {
    keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    special: { start: 'shiftleft', width: 2.25, end: 'shiftright', endWidth: 2.75 },
  },
  // Row 5: Bottom row
  {
    keys: [],
    special: {
      start: 'controlleft',
      startWidth: 1.25,
      middle: 'altleft',
      middleWidth: 1.25,
      space: ' ',
      spaceWidth: 6.25,
      middleRight: 'altright',
      middleRightWidth: 1.25,
      end: 'controlright',
      endWidth: 1.25,
      final: 'menuright',
      finalWidth: 1.25,
    },
  },
];

interface KeyboardProps {
  currentKey?: string;
  onKeyPress?: (key: string) => void;
}

export default function Keyboard({ currentKey, onKeyPress }: KeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const normalized = normalizeKey(e.key);
      setPressedKeys((prev) => new Set(prev).add(normalized));
      onKeyPress?.(normalized);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const normalized = normalizeKey(e.key);
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(normalized);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyPress]);

  const renderKey = (
    key: string,
    width: number = 1,
    className: string = ''
  ) => {
    const normalized = normalizeKey(key);
    const finger = getFingerForKey(normalized);
    const color = getFingerColor(finger);
    const isPressed = pressedKeys.has(normalized);
    const isCurrent = currentKey && normalizeKey(currentKey) === normalized;

    const getKeyLabel = (k: string): string => {
      const labels: Record<string, string> = {
        ' ': 'Space',
        'shiftleft': '⇧',
        'shiftright': '⇧',
        'controlleft': 'Ctrl',
        'controlright': 'Ctrl',
        'altleft': 'Alt',
        'altright': 'Alt',
        'capslock': 'Caps Lock',
        'tab': 'Tab',
        'backspace': '⌫',
        'enter': '↵ Enter',
        'menuright': '☰',
        '\\': '\\',
        'winleft': '⊞',
        'winright': '⊞',
      };
      return labels[k.toLowerCase()] || k.toUpperCase();
    };

    return (
      <button
        key={key}
        className={`px-3 py-3 rounded-md text-sm font-semibold transition-all border ${
          isPressed || isCurrent
            ? 'scale-105 border-2 shadow-lg'
            : 'border-gray-400'
        } ${className}`}
        style={{
          backgroundColor: isPressed || isCurrent ? lightenColor(color) : color,
          borderColor:
            isPressed || isCurrent ? darkenColor(color) : '#9ca3af',
          opacity: isPressed || isCurrent ? 1 : 0.9,
          minWidth: `${width * 50}px`,
          flex: width,
          height: '50px',
          fontSize: width >= 2 ? '12px' : '14px',
        }}
        disabled
      >
        {getKeyLabel(key)}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 p-6 bg-gray-100 rounded-lg shadow-xl w-full max-w-6xl mx-auto">
      {KEYBOARD_LAYOUT.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-2 items-center w-full justify-center">
          {/* Row 1: Number row with Backspace */}
          {rowIdx === 0 && (
            <>
              {row.keys.map((key) => renderKey(key))}
              {row.special?.end &&
                renderKey(row.special.end, row.special.width || 2, 'bg-gray-300')}
            </>
          )}

          {/* Row 2: QWERTY row with Tab, Backslash, Enter */}
          {rowIdx === 1 && (
            <>
              {row.special?.start &&
                renderKey(
                  row.special.start,
                  row.special.width || 1.5,
                  'bg-gray-300'
                )}
              {row.keys.map((key) => renderKey(key))}
              {row.special?.end &&
                renderKey(row.special.end, row.special.endWidth || 1, 'bg-gray-300')}
              {row.special?.final &&
                renderKey(
                  row.special.final,
                  row.special.finalWidth || 1.75,
                  'bg-gray-300'
                )}
            </>
          )}

          {/* Row 3: ASDF row with Caps Lock, Enter */}
          {rowIdx === 2 && (
            <>
              {row.special?.start &&
                renderKey(
                  row.special.start,
                  row.special.width || 1.75,
                  'bg-gray-300'
                )}
              {row.keys.map((key) => renderKey(key))}
              {row.special?.final &&
                renderKey(
                  row.special.final,
                  row.special.finalWidth || 2.25,
                  'bg-gray-300'
                )}
            </>
          )}

          {/* Row 4: ZXCV row with Shift Left/Right */}
          {rowIdx === 3 && (
            <>
              {row.special?.start &&
                renderKey(
                  row.special.start,
                  row.special.width || 2.25,
                  'bg-gray-300'
                )}
              {row.keys.map((key) => renderKey(key))}
              {row.special?.end &&
                renderKey(
                  row.special.end,
                  row.special.endWidth || 2.75,
                  'bg-gray-300'
                )}
            </>
          )}

          {/* Row 5: Bottom row with Ctrl, Win, Alt, Space, Menu */}
          {rowIdx === 4 && (
            <>
              {row.special?.start &&
                renderKey(
                  row.special.start,
                  row.special.startWidth || 1.25,
                  'bg-gray-300'
                )}
              {renderKey('winleft', 1, 'bg-gray-300')}
              {row.special?.middle &&
                renderKey(
                  row.special.middle,
                  row.special.middleWidth || 1.25,
                  'bg-gray-300'
                )}
              {row.special?.space &&
                renderKey(
                  ' ',
                  row.special.spaceWidth || 6.25,
                  'bg-gray-300'
                )}
              {row.special?.middleRight &&
                renderKey(
                  row.special.middleRight,
                  row.special.middleRightWidth || 1.25,
                  'bg-gray-300'
                )}
              {renderKey('winright', 1, 'bg-gray-300')}
              {row.special?.end &&
                renderKey(
                  row.special.end,
                  row.special.endWidth || 1.25,
                  'bg-gray-300'
                )}
              {row.special?.final &&
                renderKey(
                  row.special.final,
                  row.special.finalWidth || 1.25,
                  'bg-gray-300'
                )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function lightenColor(color: string): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const lighten = (c: number) => Math.min(255, c + 40);
  return `rgb(${lighten(r)}, ${lighten(g)}, ${lighten(b)})`;
}

function darkenColor(color: string): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const darken = (c: number) => Math.max(0, c - 40);
  return `rgb(${darken(r)}, ${darken(g)}, ${darken(b)})`;
}

