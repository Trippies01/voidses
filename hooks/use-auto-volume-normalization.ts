import { useEffect, useRef } from 'react';
import { Room } from 'livekit-client';

interface VolumeStats {
  participantId: string;
  averageVolume: number;
  sampleCount: number;
}

export const useAutoVolumeNormalization = (enabled: boolean) => {
  const volumeStatsRef = useRef<Map<string, VolumeStats>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const enableForRoom = (room: Room) => {
    if (!enabled) {
      console.log('⏸️ Otomatik ses dengeleme kapalı');
      return;
    }

    console.log('🎚️ Otomatik ses dengeleme başlatılıyor...');

    // Her 2 saniyede bir ses seviyelerini analiz et
    intervalRef.current = setInterval(() => {
      const participants = Array.from(room.remoteParticipants.values());
      
      if (participants.length === 0) return;

      // Tüm katılımcıların ortalama ses seviyesini hesapla
      let totalVolume = 0;
      let count = 0;

      participants.forEach((participant) => {
        const audioTracks = Array.from(participant.audioTrackPublications.values());
        
        audioTracks.forEach((publication) => {
          if (publication.track) {
            // @ts-ignore - Web Audio API
            const audioElement = publication.track.attachedElements?.[0] as HTMLAudioElement;
            if (audioElement) {
              const currentVolume = audioElement.volume;
              totalVolume += currentVolume;
              count++;

              // İstatistikleri güncelle
              const stats = volumeStatsRef.current.get(participant.sid) || {
                participantId: participant.sid,
                averageVolume: currentVolume,
                sampleCount: 0,
              };

              stats.averageVolume = (stats.averageVolume * stats.sampleCount + currentVolume) / (stats.sampleCount + 1);
              stats.sampleCount++;

              volumeStatsRef.current.set(participant.sid, stats);
            }
          }
        });
      });

      if (count === 0) return;

      const averageVolume = totalVolume / count;
      const targetVolume = 1.0; // Hedef ses seviyesi

      // Her katılımcının ses seviyesini ayarla
      participants.forEach((participant) => {
        const audioTracks = Array.from(participant.audioTrackPublications.values());
        
        audioTracks.forEach((publication) => {
          if (publication.track) {
            // @ts-ignore
            const audioElement = publication.track.attachedElements?.[0] as HTMLAudioElement;
            if (audioElement) {
              const currentVolume = audioElement.volume;
              
              // Çok sessiz kullanıcıları yükselt
              if (currentVolume < averageVolume * 0.7) {
                const newVolume = Math.min(2.0, currentVolume * 1.2);
                audioElement.volume = newVolume;
                console.log(`🔊 ${participant.identity}: ${currentVolume.toFixed(2)} → ${newVolume.toFixed(2)}`);
              }
              // Çok yüksek seslileri azalt
              else if (currentVolume > averageVolume * 1.3) {
                const newVolume = Math.max(0.5, currentVolume * 0.9);
                audioElement.volume = newVolume;
                console.log(`🔉 ${participant.identity}: ${currentVolume.toFixed(2)} → ${newVolume.toFixed(2)}`);
              }
            }
          }
        });
      });
    }, 2000);

    console.log('✅ Otomatik ses dengeleme aktif');
  };

  const disable = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    volumeStatsRef.current.clear();
    console.log('🔇 Otomatik ses dengeleme kapatıldı');
  };

  useEffect(() => {
    return () => {
      disable();
    };
  }, []);

  return {
    enableForRoom,
    disable,
  };
};
