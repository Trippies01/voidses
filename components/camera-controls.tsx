"use client";

import { useState } from "react";
import { useRoomContext, useLocalParticipant } from "@livekit/components-react";
import { Video, VideoOff, Settings } from "lucide-react";
import { Track } from "livekit-client";

export const CameraControls = () => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleVideo = async () => {
    if (!room || !localParticipant) return;

    setIsLoading(true);

    try {
      if (isVideoOn) {
        // Kamerayı kapat
        const videoTrack = localParticipant.getTrackPublication(Track.Source.Camera);
        if (videoTrack) {
          await localParticipant.unpublishTrack(videoTrack.track!);
          setIsVideoOn(false);
          console.log('📹 Kamera kapatıldı');
        }
      } else {
        // Kamerayı aç
        await room.localParticipant.setCameraEnabled(true);
        setIsVideoOn(true);
        console.log('📹 Kamera açıldı');
      }
    } catch (error) {
      console.error('Kamera hatası:', error);
      alert('Kamera açılamadı. Lütfen kamera izinlerini kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleVideo}
          disabled={isLoading}
          className={`p-2 rounded-lg transition ${
            isVideoOn
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isVideoOn ? 'Kamerayı Kapat' : 'Kamerayı Aç'}
        >
          {isVideoOn ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
        </button>

        {isVideoOn && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition"
            title="Kamera Ayarları"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {showSettings && isVideoOn && (
        <div className="absolute bottom-full mb-2 right-0 bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-lg min-w-[250px]">
          <h4 className="text-sm font-semibold text-white mb-3">Kamera Ayarları</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Çözünürlük</label>
              <select className="w-full px-2 py-1 bg-zinc-800 text-white text-sm rounded">
                <option>1080p (1920x1080)</option>
                <option>720p (1280x720)</option>
                <option>480p (640x480)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">FPS</label>
              <select className="w-full px-2 py-1 bg-zinc-800 text-white text-sm rounded">
                <option>30 FPS</option>
                <option>24 FPS</option>
                <option>15 FPS</option>
              </select>
            </div>

            <button
              className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition"
            >
              Arka Plan Bulanıklaştır
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
