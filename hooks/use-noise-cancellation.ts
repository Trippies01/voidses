import { useState, useEffect } from 'react';
import { KrispNoiseFilter } from '@livekit/krisp-noise-filter';
import { Room, Track } from 'livekit-client';

let krispProcessor: KrispNoiseFilter | null = null;

export const useNoiseCancellation = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('noiseCancellation');
    if (saved) {
      setIsEnabled(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('noiseCancellation', JSON.stringify(isEnabled));
  }, [isEnabled]);

  const initKrisp = async () => {
    if (krispProcessor) return krispProcessor;

    try {
      setIsLoading(true);
      krispProcessor = new KrispNoiseFilter();
      await krispProcessor.init();
      console.log('✅ Krisp AI gürültü engelleme aktif');
      setIsLoading(false);
      return krispProcessor;
    } catch (error) {
      console.error('❌ Krisp başlatılamadı:', error);
      setIsLoading(false);
      return null;
    }
  };

  const enableForRoom = async (room: Room) => {
    if (!isEnabled) return;

    try {
      const processor = await initKrisp();
      if (!processor) return;

      const localParticipant = room.localParticipant;
      const audioTrack = localParticipant.getTrackPublication(Track.Source.Microphone);

      if (audioTrack?.track) {
        await audioTrack.track.setProcessor(processor);
        console.log('✅ Krisp mikrofona uygulandı');
      }
    } catch (error) {
      console.error('❌ Krisp uygulanamadı:', error);
    }
  };

  const disableForRoom = async (room: Room) => {
    try {
      const localParticipant = room.localParticipant;
      const audioTrack = localParticipant.getTrackPublication(Track.Source.Microphone);

      if (audioTrack?.track) {
        await audioTrack.track.stopProcessor();
        console.log('🔇 Krisp devre dışı');
      }
    } catch (error) {
      console.error('❌ Krisp kapatılamadı:', error);
    }
  };

  return {
    isEnabled,
    setIsEnabled,
    isLoading,
    noiseLevel,
    enableForRoom,
    disableForRoom,
    initKrisp,
  };
};
