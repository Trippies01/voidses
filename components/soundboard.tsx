"use client";

import { useState } from "react";
import { Volume2, Plus } from "lucide-react";

interface Sound {
  id: string;
  name: string;
  emoji: string;
  url: string;
}

const DEFAULT_SOUNDS: Sound[] = [
  { id: '1', name: 'Alkış', emoji: '👏', url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' },
  { id: '2', name: 'Trompet', emoji: '🎺', url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' },
  { id: '3', name: 'Davul', emoji: '🥁', url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' },
  { id: '4', name: 'Gülme', emoji: '😂', url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' },
  { id: '5', name: 'Hava Kornası', emoji: '📯', url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' },
  { id: '6', name: 'Zil', emoji: '🔔', url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' },
];

export const Soundboard = () => {
  const [sounds] = useState<Sound[]>(DEFAULT_SOUNDS);
  const [isExpanded, setIsExpanded] = useState(false);

  const playSound = (sound: Sound) => {
    const audio = new Audio(sound.url);
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.error('Ses çalma hatası:', error);
    });
    console.log('🔊 Ses çalındı:', sound.name);
  };

  return (
    <div className="bg-[#2b2d31] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Soundboard
          </h3>
          <p className="text-sm text-zinc-400">
            Hızlı ses efektleri
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {isExpanded ? 'Küçült' : 'Genişlet'}
        </button>
      </div>

      <div className={`grid gap-2 ${isExpanded ? 'grid-cols-3' : 'grid-cols-6'}`}>
        {sounds.map((sound) => (
          <button
            key={sound.id}
            onClick={() => playSound(sound)}
            className="flex flex-col items-center justify-center p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition group"
            title={sound.name}
          >
            <span className="text-2xl mb-1">{sound.emoji}</span>
            {isExpanded && (
              <span className="text-xs text-zinc-400 group-hover:text-zinc-300">
                {sound.name}
              </span>
            )}
          </button>
        ))}

        <button
          className="flex flex-col items-center justify-center p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition border-2 border-dashed border-zinc-600"
          title="Ses Ekle"
        >
          <Plus className="w-5 h-5 text-zinc-500" />
          {isExpanded && (
            <span className="text-xs text-zinc-500 mt-1">Ekle</span>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-400">
          💡 <strong>İpucu:</strong> Kendi ses dosyalarınızı ekleyebilirsiniz (yakında).
        </p>
      </div>
    </div>
  );
};
