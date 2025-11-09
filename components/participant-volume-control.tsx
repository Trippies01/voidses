"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface ParticipantVolumeControlProps {
  participantId: string;
  participantName: string;
}

export const ParticipantVolumeControl = ({ 
  participantId, 
  participantName 
}: ParticipantVolumeControlProps) => {
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // LocalStorage'dan kayıtlı ses seviyesini yükle
    const saved = localStorage.getItem(`participant-volume-${participantId}`);
    if (saved) {
      const savedVolume = parseInt(saved);
      setVolume(savedVolume);
      setIsMuted(savedVolume === 0);
    }
  }, [participantId]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // LocalStorage'a kaydet
    localStorage.setItem(`participant-volume-${participantId}`, newVolume.toString());

    // Audio element'i bul ve ses seviyesini ayarla
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach((audio) => {
      // @ts-ignore
      if (audio.srcObject?.id === participantId) {
        audio.volume = newVolume / 100;
      }
    });
  };

  const toggleMute = () => {
    if (isMuted) {
      handleVolumeChange(100);
    } else {
      handleVolumeChange(0);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-lg">
      <button
        onClick={toggleMute}
        className="p-1 hover:bg-zinc-700 rounded transition"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-red-400" />
        ) : (
          <Volume2 className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-zinc-400">{participantName}</span>
          <span className="text-xs text-zinc-500">{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
};
