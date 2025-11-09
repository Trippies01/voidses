import { useEffect, useState, useRef } from 'react';
import { Room, Track, LocalAudioTrack } from 'livekit-client';

interface PushToTalkOptions {
  enabled: boolean;
  key: string;
  delay: number; // ms
}

export const usePushToTalk = (options: PushToTalkOptions) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const trackRef = useRef<LocalAudioTrack | null>(null);
  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    console.log('⚙️ PTT useEffect çalıştı, enabled:', options.enabled, 'key:', options.key);
    
    if (!options.enabled) {
      console.log('⏸️ PTT kapalı, event listener eklenmedi');
      setIsTalking(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('⌨️ Key down:', e.key, 'Expected:', options.key, 'Repeat:', e.repeat);
      if (e.key === options.key && !e.repeat) {
        console.log('✅ PTT tuşu basıldı!');
        setIsPressed(true);
        setIsTalking(true);
        if (trackRef.current) {
          trackRef.current.unmute();
          console.log('🎤 PTT: Mikrofon açıldı, isMuted:', trackRef.current.isMuted);
        } else {
          console.warn('⚠️ trackRef.current null!');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log('⌨️ Key up:', e.key);
      if (e.key === options.key) {
        console.log('✅ PTT tuşu bırakıldı!');
        setIsPressed(false);
        
        // Delay ile mikrofonu kapat (cümle sonunu kesmemek için)
        setTimeout(() => {
          setIsTalking(false);
          if (trackRef.current) {
            trackRef.current.mute();
            console.log(`🔇 PTT: Mikrofon kapandı (${options.delay}ms delay), isMuted:`, trackRef.current.isMuted);
          } else {
            console.warn('⚠️ trackRef.current null!');
          }
        }, options.delay);
      }
    };

    console.log('👂 Event listener eklendi');
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      console.log('🧹 Event listener kaldırıldı');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [options.enabled, options.key, options.delay]);

  const enableForRoom = async (room: Room) => {
    console.log('🔍 PTT enableForRoom çağrıldı, enabled:', options.enabled);
    roomRef.current = room;
    
    // Sadece PTT aktifse track'i kontrol et
    if (!options.enabled) {
      console.log('🎤 PTT kapalı - Sürekli konuşma modu');
      return;
    }
    
    const localParticipant = room.localParticipant;
    console.log('👤 Local participant:', localParticipant.identity);
    
    const audioTrack = localParticipant.getTrackPublication(Track.Source.Microphone);
    console.log('🎵 Audio track:', audioTrack ? 'Bulundu' : 'Bulunamadı');

    if (audioTrack?.track) {
      const track = audioTrack.track as LocalAudioTrack;
      trackRef.current = track;
      console.log('📌 Track ref set edildi');

      // PTT aktifse başlangıçta mikrofonu kapat
      track.mute();
      console.log('🔇 PTT modu aktif - Konuşmak için tuşa basın:', options.key);
      console.log('🔇 Track muted:', track.isMuted);
    } else {
      console.warn('⚠️ Audio track bulunamadı!');
    }
  };

  const disable = () => {
    if (trackRef.current) {
      trackRef.current.unmute();
    }
    trackRef.current = null;
    roomRef.current = null;
  };

  return {
    isPressed,
    isTalking,
    enableForRoom,
    disable,
  };
};
