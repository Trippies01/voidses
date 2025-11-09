"use client";

import { useState, useRef } from "react";
import { Circle, Square, Download } from "lucide-react";

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Timer başlat
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      console.log('🎙️ Kayıt başladı');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt başlatılamadı. Mikrofon izni gerekli.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      console.log('⏹️ Kayıt durduruldu');
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kayit-${new Date().toISOString()}.webm`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('💾 Kayıt indirildi');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#2b2d31] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Ses Kaydı
          </h3>
          <p className="text-sm text-zinc-400">
            Konuşmalarınızı kaydedin
          </p>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 text-red-500">
            <Circle className="w-3 h-3 fill-current animate-pulse" />
            <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            <Circle className="w-4 h-4" />
            Kayıt Başlat
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition"
          >
            <Square className="w-4 h-4" />
            Durdur
          </button>
        )}

        {recordedChunks.length > 0 && !isRecording && (
          <button
            onClick={downloadRecording}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            İndir
          </button>
        )}
      </div>

      {recordedChunks.length > 0 && !isRecording && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-400">
            ✅ Kayıt tamamlandı! İndir butonuna tıklayarak kaydedin.
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
        <p className="text-xs text-orange-400">
          ⚠️ <strong>Uyarı:</strong> Kayıt yapmadan önce diğer kullanıcılardan izin alın. 
          Kayıtlar sadece lokal olarak saklanır.
        </p>
      </div>
    </div>
  );
};
