'use client';

type CharState = 'typedCorrect' | 'typedWrong' | 'current' | 'upcoming';

interface TargetLineProps {
  target: string;
  typed: string[];
  currentIndex: number;
  errors: Set<number>;
}

export default function TargetLine({
  target,
  typed,
  currentIndex,
  errors,
}: TargetLineProps) {
  const getCharState = (index: number): CharState => {
    if (index < typed.length) {
      return errors.has(index) ? 'typedWrong' : 'typedCorrect';
    }
    if (index === currentIndex) {
      return 'current';
    }
    return 'upcoming';
  };

  return (
    <div className="text-2xl font-mono tracking-wide p-8 bg-white rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-1">
        {target.split('').map((char, index) => {
          const state = getCharState(index);
          const baseClasses = 'px-1 rounded';
          let stateClasses = '';

          switch (state) {
            case 'typedCorrect':
              stateClasses = 'text-blue-600 underline';
              break;
            case 'typedWrong':
              stateClasses = 'text-red-500 bg-red-100';
              break;
            case 'current':
              stateClasses = 'bg-yellow-200 border-b-2 border-yellow-500';
              break;
            case 'upcoming':
              stateClasses = 'text-gray-400';
              break;
          }

          return (
            <span key={index} className={`${baseClasses} ${stateClasses}`}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>
    </div>
  );
}

