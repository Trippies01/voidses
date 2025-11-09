import { useEffect, useRef, useState } from 'react';
import { Room, Track, LocalAudioTrack } from 'livekit-client';
import { KrispNoiseFilter } from '@livekit/krisp-noise-filter';

export const useKrispNoiseFilter = (enabled: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const processorRef = useRef<ReturnType<typeof KrispNoiseFilter> | null>(null);
  const trackRef = useRef<LocalAudioTrack | null>(null);

  const enableForRoom = async (room: Room) => {
    if (!enabled) {
      console.log('⏸️ Krisp gürültü engelleme kapalı');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🎯 Krisp AI gürültü engelleme başlatılıyor...');

      const localParticipant = room.localParticipant;

      // Track'in publish olmasını bekle
      const waitForTrack = async () => {
        return new Promise<LocalAudioTrack>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Track timeout'));
          }, 10000);

          const checkTrack = () => {
            const audioPublication = localParticipant.getTrackPublication(Track.Source.Microphone);
            if (audioPublication?.track) {
              clearTimeout(timeout);
              resolve(audioPublication.track as LocalAudioTrack);
            } else {
              setTimeout(checkTrack, 100);
            }
          };

          checkTrack();
        });
      };

      const track = await waitForTrack();
      trackRef.current = track;
      console.log('🎤 Track hazır:', track.sid);
      console.log('📊 Track durumu - isMuted:', track.isMuted, 'isEnabled:', track.isEnabled);

      // Track publish olduktan sonra Krisp'i uygula
      console.log('🎤 Krisp uygulanıyor...');
      
      // Krisp processor oluştur
      const krispProcessor = KrispNoiseFilter();
      processorRef.current = krispProcessor;
      console.log('📦 Krisp processor oluşturuldu');

      // Track'e uygula
      await track.setProcessor(krispProcessor);
      console.log('✅ Krisp processor track\'e uygulandı');

      setIsActive(true);
      setIsLoading(false);
      console.log('✅ Krisp AI aktif!');
      console.log('🎉 Arka plan sesleri %70-80 azaltılıyor');
    } catch (error) {
      console.error('❌ Krisp hatası:', error);
      setIsLoading(false);
      setIsActive(false);
    }
  };

  const disableForRoom = async () => {
    if (trackRef.current && processorRef.current) {
      try {
        await trackRef.current.stopProcessor();
        processorRef.current = null;
        setIsActive(false);
        console.log('🔇 Krisp gürültü engelleme kapatıldı');
      } catch (error) {
        console.error('❌ Krisp kapatma hatası:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (trackRef.current && processorRef.current) {
        trackRef.current.stopProcessor().catch(console.error);
      }
    };
  }, []);

  return {
    isLoading,
    isActive,
    enableForRoom,
    disableForRoom,
  };
};
