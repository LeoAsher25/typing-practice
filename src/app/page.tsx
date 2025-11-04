'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import Toggle from '@/components/Toggle';
import { t } from '@/lib/i18n';

export default function HomePage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [inputMethod, setInputMethod] = useState<'telex' | 'vni' | 'none'>(
    'telex'
  );

  useEffect(() => {
    const stored = localStorage.getItem('soundEnabled');
    if (stored !== null) {
      setSoundEnabled(stored === 'true');
    }
    const storedMethod = localStorage.getItem('inputMethod');
    if (storedMethod) {
      setInputMethod(storedMethod as 'telex' | 'vni' | 'none');
    }
  }, []);

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    localStorage.setItem('soundEnabled', String(checked));
  };

  const handleInputMethodChange = (method: 'telex' | 'vni' | 'none') => {
    setInputMethod(method);
    localStorage.setItem('inputMethod', method);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">
          {t.home.title}
        </h1>

        <div className="space-y-6">
          <Link href="/lessons">
            <Button variant="primary" className="text-xl px-8 py-4">
              {t.home.startButton}
            </Button>
          </Link>

          <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
            <Toggle
              label={t.home.soundToggle}
              checked={soundEnabled}
              onChange={handleSoundToggle}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium block">
                {t.home.inputMethod}
              </label>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleInputMethodChange('telex')}
                  className={`px-4 py-2 rounded ${
                    inputMethod === 'telex'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {t.home.inputMethodTelex}
                </button>
                <button
                  onClick={() => handleInputMethodChange('vni')}
                  className={`px-4 py-2 rounded ${
                    inputMethod === 'vni'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {t.home.inputMethodVNI}
                </button>
                <button
                  onClick={() => handleInputMethodChange('none')}
                  className={`px-4 py-2 rounded ${
                    inputMethod === 'none'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {t.home.inputMethodNone}
                </button>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-600 italic">{t.home.tip}</p>
        </div>
      </div>
    </div>
  );
}

