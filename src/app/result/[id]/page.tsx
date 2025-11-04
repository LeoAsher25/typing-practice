'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { calculateWPM, calculateAccuracy, type TypingState } from '@/lib/typing/evaluate';
import type { Lesson } from '@/lib/lesson-engine/types';
import { t } from '@/lib/i18n';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [sticker, setSticker] = useState<string>('');

  useEffect(() => {
    // Load lesson
    fetch('/lessons/core-pack.json')
      .then((res) => res.json())
      .then((data: Lesson[]) => {
        const found = data.find((l) => l.id === lessonId);
        if (found) {
          setLesson(found);
        }
      });

    // Load session data from localStorage
    const sessionKey = `typing_session_${lessonId}`;
    const sessionData = localStorage.getItem(sessionKey);
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        const state = parsed.state;
        
        // Convert errors array back to Set if needed
        const errorsSet = Array.isArray(state.errors) 
          ? new Set(state.errors) 
          : state.errors;

        if (state.startTime && state.endTime) {
          const totalChars = state.typed.length;
          const errorCount = errorsSet.size;
          const correctChars = totalChars - errorCount;
          
          // Ensure pauses is an array
          const pausesArray = Array.isArray(state.pauses) ? state.pauses : [];
          
          const wpmValue = calculateWPM(
            correctChars,
            state.startTime,
            state.endTime,
            pausesArray
          );
          const accuracyValue = calculateAccuracy(correctChars, totalChars);

          setWpm(isNaN(wpmValue) ? 0 : Math.round(wpmValue));
          setAccuracy(isNaN(accuracyValue) ? 0 : accuracyValue);

          // Determine sticker - will be updated when lesson loads
          if (accuracyValue >= 95) {
            setSticker(t.result.stickers.excellent);
          } else if (accuracyValue >= 90) {
            setSticker(t.result.stickers.great);
          } else if (accuracyValue >= 85) {
            setSticker(t.result.stickers.good);
          } else {
            setSticker(t.result.stickers.okay);
          }

          // Save to history
          const historyKey = 'typing_history';
          const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
          history.push({
            lessonId,
            wpm: wpmValue,
            accuracy: accuracyValue,
            timestamp: Date.now(),
          });
          // Keep only last 50 sessions
          const recentHistory = history.slice(-50);
          localStorage.setItem(historyKey, JSON.stringify(recentHistory));
        }
      } catch (e) {
        console.error('Failed to parse session data', e);
      }
    }
  }, [lessonId]);

  const handleRetry = () => {
    router.push(`/play/${lessonId}`);
  };

  const handleChooseOther = () => {
    router.push('/lessons');
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center space-y-8">
        <div className="text-8xl">{sticker}</div>

        <h1 className="text-4xl font-bold">{t.result.title}</h1>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="text-5xl font-bold text-blue-600">{wpm}</div>
            <div className="text-xl text-gray-600 mt-2">{t.result.wpm}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="text-5xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-xl text-gray-600 mt-2">{t.result.accuracy}</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={handleRetry}>
            {t.result.retry}
          </Button>
          <Button variant="secondary" onClick={handleChooseOther}>
            {t.result.chooseOther}
          </Button>
        </div>
      </div>
    </div>
  );
}

