"use client";

import { useState } from "react";
import { useRoomContext, useLocalParticipant } from "@livekit/components-react";
import { Monitor, MonitorOff } from "lucide-react";
import { Track } from "livekit-client";

export const ScreenShareButton = () => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleScreenShare = async () => {
    if (!room || !localParticipant) return;

    setIsLoading(true);

    try {
      if (isSharing) {
        // Ekran paylaşımını durdur
        const screenTrack = localParticipant.getTrackPublication(Track.Source.ScreenShare);
        if (screenTrack) {
          await localParticipant.unpublishTrack(screenTrack.track!);
          setIsSharing(false);
          console.log('🖥️ Ekran paylaşımı durduruldu');
        }
      } else {
        // Ekran paylaşımını başlat
        await room.localParticipant.setScreenShareEnabled(true);
        setIsSharing(true);
        console.log('🖥️ Ekran paylaşımı başlatıldı');
      }
    } catch (error) {
      console.error('Ekran paylaşımı hatası:', error);
      alert('Ekran paylaşımı başlatılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleScreenShare}
      disabled={isLoading}
      className={`p-2 rounded-lg transition ${
        isSharing
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isSharing ? 'Ekran Paylaşımını Durdur' : 'Ekran Paylaş'}
    >
      {isSharing ? (
        <MonitorOff className="w-5 h-5" />
      ) : (
        <Monitor className="w-5 h-5" />
      )}
    </button>
  );
};
