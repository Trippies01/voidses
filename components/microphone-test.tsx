"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export const MicrophoneTest = () => {
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Gain node oluştur (ses seviyesi kontrolü için)
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0; // Başlangıçta sessiz
      gainNodeRef.current = gainNode;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      source.connect(gainNode);
      gainNode.connect(audioContext.destination); // Hoparlöre bağla

      setIsActive(true);
      analyzeVolume();
      console.log('🎤 Mikrofon testi başlatıldı');
    } catch (error) {
      console.error('Mikrofon erişim hatası:', error);
      alert('Mikrofon erişimi reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini verin.');
    }
  };

  const stopTest = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsActive(false);
    setIsListening(false);
    setVolume(0);
    console.log('🔇 Mikrofon testi durduruldu');
  };

  const toggleListening = () => {
    if (!gainNodeRef.current) return;

    const newListeningState = !isListening;
    setIsListening(newListeningState);

    if (newListeningState) {
      // Kendini duy - ses seviyesini 1.0'a çıkar
      gainNodeRef.current.gain.setValueAtTime(1.0, audioContextRef.current!.currentTime);
      console.log('👂 Kendini dinleme aktif');
    } else {
      // Sessiz - ses seviyesini 0'a düşür
      gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
      console.log('🔇 Kendini dinleme kapalı');
    }
  };

  const analyzeVolume = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    const normalizedVolume = Math.min(100, (average / 255) * 200);

    setVolume(normalizedVolume);
    animationFrameRef.current = requestAnimationFrame(analyzeVolume);
  };

  useEffect(() => {
    return () => {
      stopTest();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-green-500" />
            Mikrofon Testi
          </h4>
          <p className="text-sm text-zinc-400 mt-1">Ses kalitesini kontrol edin</p>
        </div>
        <button
          onClick={isActive ? stopTest : startTest}
          className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ${
            isActive
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
          }`}
        >
          {isActive ? (
            <>
              <MicOff className="w-5 h-5" />
              Durdur
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Test Et
            </>
          )}
        </button>
      </div>

      {isActive && (
        <div className="space-y-4">
          {/* Let Me Hear Butonu */}
          <div className="flex items-center justify-center">
            <button
              onClick={toggleListening}
              className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                isListening
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
              }`}
            >
              {isListening ? (
                <>
                  <Volume2 className="w-5 h-5" />
                  Kendini Duyuyorsun
                </>
              ) : (
                <>
                  <VolumeX className="w-5 h-5" />
                  Kendini Duy
                </>
              )}
            </button>
          </div>

          {isListening && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-sm text-blue-400 text-center">
                👂 Şimdi kendi sesini duyuyorsun. Konuş ve ses kalitesini test et.
              </p>
            </div>
          )}

          {/* Ses Seviyesi Göstergesi */}
          <div className="relative h-4 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                volume > 80
                  ? 'bg-red-500'
                  : volume > 50
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${volume}%` }}
            />
          </div>

          {/* Ses Seviyesi Çubukları */}
          <div className="flex gap-1 h-16">
            {Array.from({ length: 20 }).map((_, i) => {
              const barHeight = Math.max(0, volume - i * 5);
              return (
                <div
                  key={i}
                  className="flex-1 bg-zinc-700 rounded-t"
                  style={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className={`absolute bottom-0 w-full transition-all duration-100 ${
                      i < 12
                        ? 'bg-green-500'
                        : i < 16
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>
              );
            })}
          </div>

          <p className="text-xs text-zinc-400 text-center">
            {volume < 10
              ? '🔇 Çok sessiz - Mikrofona yaklaşın'
              : volume < 30
              ? '🔉 Sessiz - Biraz daha yüksek konuşun'
              : volume < 70
              ? '✅ İyi - Ses seviyesi ideal'
              : volume < 90
              ? '🔊 Yüksek - Biraz daha sessiz konuşun'
              : '📢 Çok yüksek - Mikrofonu uzaklaştırın'}
          </p>
        </div>
      )}
    </div>
  );
};
