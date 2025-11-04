'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { t } from '@/lib/i18n';
import type { Lesson } from '@/lib/lesson-engine/types';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/lessons/core-pack.json')
      .then((res) => res.json())
      .then((data) => {
        setLessons(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getLevel = (id: string): number => {
    const match = id.match(/^L(\d+)-/);
    return match ? parseInt(match[1], 10) : 1;
  };

  const groupedLessons = lessons.reduce(
    (acc, lesson) => {
      const level = getLevel(lesson.id);
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(lesson);
      return acc;
    },
    {} as Record<number, Lesson[]>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">{t.lessons.title}</h1>

        <div className="space-y-8">
          {[1, 2, 3, 4].map((level) => {
            const levelLessons = groupedLessons[level] || [];
            if (levelLessons.length === 0) return null;

            return (
              <div key={level} className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {t.lessons.level} {level}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelLessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/play/${lesson.id}`}
                      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <h3 className="text-xl font-semibold mb-2">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t.lessons.description}: {lesson.pool.join(', ')}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Quay lại
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

