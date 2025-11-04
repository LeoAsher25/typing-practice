'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TargetLine from '@/components/TargetLine';
import Keyboard from '@/components/Keyboard';
import { generateLesson } from '@/lib/lesson-engine';
import { normalizeKey } from '@/lib/typing/normalizeKey';
import type { Lesson } from '@/lib/lesson-engine/types';
import type { TypingState } from '@/lib/typing/evaluate';
import { t } from '@/lib/i18n';

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [target, setTarget] = useState<string>('');
  const [typingState, setTypingState] = useState<TypingState>({
    typed: [],
    currentIndex: 0,
    errors: new Set(),
    startTime: null,
    endTime: null,
    pauses: [],
    lastKeyTime: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const typingStateRef = useRef(typingState);
  const lessonRef = useRef(lesson);
  const targetRef = useRef(target);

  // Keep refs in sync
  useEffect(() => {
    typingStateRef.current = typingState;
  }, [typingState]);

  useEffect(() => {
    lessonRef.current = lesson;
  }, [lesson]);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    fetch('/lessons/core-pack.json')
      .then((res) => res.json())
      .then((data: Lesson[]) => {
        const found = data.find((l) => l.id === lessonId);
        if (found) {
          setLesson(found);
          const generated = generateLesson(found);
          setTarget(generated.text);
        }
      });
  }, [lessonId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentLesson = lessonRef.current;
      const currentTarget = targetRef.current;
      const currentState = typingStateRef.current;

      if (!currentLesson || !currentTarget) return;

      const normalized = normalizeKey(e.key);

      if (normalized === 'backspace') {
        if (currentLesson.allowBackspace && currentState.currentIndex > 0) {
          setTypingState((prev) => {
            const newTyped = [...prev.typed];
            newTyped.pop();
            const newErrors = new Set(prev.errors);
            newErrors.delete(prev.currentIndex - 1);
            return {
              ...prev,
              typed: newTyped,
              currentIndex: prev.currentIndex - 1,
              errors: newErrors,
            };
          });
        }
        return;
      }

      if (normalized.length !== 1 && normalized !== 'space') return;

      const currentChar = currentTarget[currentState.currentIndex];
      if (!currentChar) return;

      const expectedKey = normalizeKey(currentChar);
      const isCorrect = normalized === expectedKey;

      setTypingState((prev) => {
        const now = Date.now();
        const newTyped = [...prev.typed];
        const newErrors = new Set(prev.errors);
        const newStartTime = prev.startTime || now;
        let newLastKeyTime = prev.lastKeyTime || now;
        let newPauses = [...prev.pauses];

        // Track pauses
        if (prev.startTime && now - newLastKeyTime > 2000) {
          newPauses.push({
            start: newLastKeyTime,
            end: now,
          });
        }
        newLastKeyTime = now;

        if (isCorrect) {
          newTyped.push(normalized);
          const newIndex = prev.currentIndex + 1;
          const isComplete = newIndex >= currentTarget.length;

          // Save session data before navigation
          if (isComplete) {
            const sessionKey = `typing_session_${lessonId}`;
            localStorage.setItem(
              sessionKey,
              JSON.stringify({
                state: {
                  ...prev,
                  typed: newTyped,
                  currentIndex: newIndex,
                  startTime: newStartTime,
                  endTime: now,
                  lastKeyTime: newLastKeyTime,
                  pauses: newPauses,
                  errors: Array.from(newErrors),
                },
                targetLength: currentTarget.length,
              })
            );
            router.push(`/result/${lessonId}`);
            return prev;
          }

          return {
            ...prev,
            typed: newTyped,
            currentIndex: newIndex,
            startTime: newStartTime,
            lastKeyTime: newLastKeyTime,
            pauses: newPauses,
          };
        } else {
          // Wrong key pressed
          if (!currentLesson.allowBackspace) {
            // Mark error but don't advance
            newErrors.add(prev.currentIndex);
            return {
              ...prev,
              errors: newErrors,
              startTime: newStartTime,
              lastKeyTime: newLastKeyTime,
            };
          } else {
            // Allow backspace, advance with error
            newTyped.push(normalized);
            newErrors.add(prev.currentIndex);
            const newIndex = prev.currentIndex + 1;
            const isComplete = newIndex >= currentTarget.length;

            if (isComplete) {
              const sessionKey = `typing_session_${lessonId}`;
              localStorage.setItem(
                sessionKey,
                JSON.stringify({
                  state: {
                    ...prev,
                    typed: newTyped,
                    currentIndex: newIndex,
                    startTime: newStartTime,
                    endTime: now,
                    lastKeyTime: newLastKeyTime,
                    pauses: newPauses,
                    errors: Array.from(newErrors),
                  },
                  targetLength: currentTarget.length,
                })
              );
              router.push(`/result/${lessonId}`);
              return prev;
            }

            return {
              ...prev,
              typed: newTyped,
              currentIndex: newIndex,
              errors: newErrors,
              startTime: newStartTime,
              lastKeyTime: newLastKeyTime,
              pauses: newPauses,
            };
          }
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lessonId, router]);

  // Save end time when typing completes
  useEffect(() => {
    if (
      typingState.currentIndex >= target.length &&
      typingState.currentIndex > 0 &&
      typingState.startTime &&
      !typingState.endTime
    ) {
      setTypingState((prev) => ({
        ...prev,
        endTime: Date.now(),
      }));
    }
  }, [typingState.currentIndex, target.length, typingState.startTime, typingState.endTime]);

  if (!lesson || !target) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Đang tải...</p>
      </div>
    );
  }

  const currentKey = target[typingState.currentIndex];

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="min-h-screen p-8 focus:outline-none"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <button
            onClick={() => router.push('/lessons')}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {t.play.back}
          </button>
        </div>

        <TargetLine
          target={target}
          typed={typingState.typed}
          currentIndex={typingState.currentIndex}
          errors={typingState.errors}
        />

        <Keyboard currentKey={currentKey} />
      </div>
    </div>
  );
}

