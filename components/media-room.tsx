"use client";

import { useEffect, useState } from "react";
import { 
  LiveKitRoom, 
  VideoConference,
  RoomAudioRenderer,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useVoiceSettings } from "@/hooks/use-voice-settings";
import { usePushToTalk } from "@/hooks/use-push-to-talk";
import { useKrispNoiseFilter } from "@/hooks/use-krisp-noise-filter";
import { ConnectionQuality } from "@/components/connection-quality";
import { ScreenShareButton } from "@/components/screen-share-button";
import { VoiceNotifications } from "@/components/voice-notifications";
import { useAutoVolumeNormalization } from "@/hooks/use-auto-volume-normalization";
import { CameraControls } from "@/components/camera-controls";
import { AdvancedStats } from "@/components/advanced-stats";
import { Sparkles } from "lucide-react";


interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  memberId?: string;
  channelId?: string;
};

export const MediaRoom = ({
  chatId,
  video,
  audio,
  memberId,
  channelId,
}: MediaRoomProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [token, setToken] = useState("");

  const serverId = typeof window !== "undefined" 
    ? window.location.pathname.split("/")[2] 
    : "";

  // Join voice channel on mount
  useEffect(() => {
    const joinVoiceChannel = async () => {
      if (!memberId || !channelId) return;
      
      console.log("🎤 Joining voice channel:", channelId);
      
      try {
        await axios.patch(`/api/members/${memberId}/voice-state`, {
          currentChannelId: channelId,
          isMuted: false,
          isDeafened: false,
        });
        console.log("✅ Joined successfully");
        router.refresh();
      } catch (error) {
        console.error("❌ Join error:", error);
      }
    };

    joinVoiceChannel();

    // NOT: Cleanup kaldırıldı - Discord gibi text kanallarında gezinebilmek için
    // Sadece Leave butonuna basıldığında disconnect olacak
  }, [memberId, channelId, router]);

  // Handle disconnect when user leaves
  const handleDisconnect = async () => {
    console.log("📞 Disconnecting from voice channel...");
    
    // Play disconnect sound
    const sound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVa3m7q1aFgxDmuDxwGwgBSuAzvLZhzgHGWS57OihUBELTKXi8bllHAU7k9jyynYnBSh+zPDajzsIGGS56+mjURELTKTi8bllHAU7k9jyynYnBSh+zPDajzsIGGS56+mjURELTKTi8bllHAU7k9jyynYnBSh+zPDajzsIGGS56+mjURELTKTi8bllHAU7k9jyynYnBSh+zPDajzsIGGS56+mjURELTKTi8bllHAU7k9jyynYn');
    sound.volume = 0.3;
    sound.play().catch(() => {});
    
    // INSTANT navigation - no delay
    router.push(`/servers/${serverId}`);
    
    // Update database in background (non-blocking)
    if (memberId) {
      axios.patch(`/api/members/${memberId}/voice-state`, {
        currentChannelId: null,
        isMuted: false,
        isDeafened: false,
      }).then(() => {
        console.log("✅ Voice state cleared");
        router.refresh();
      }).catch((error) => {
        console.error("❌ Disconnect error:", error);
      });
    }
  };

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center bg-[#313338]">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Bağlantı kuruluyor...
        </p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={{
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 1,
      }}
      options={{
        publishDefaults: {
          audioPreset: {
            maxBitrate: 64000,
          },
          dtx: true,
          red: true,
        },
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      }}
      onDisconnected={handleDisconnect}
    >
      <ConnectionQuality />
      <VoiceNotifications />
      <PushToTalkController />
      <VideoConference />
      <RoomAudioRenderer />
      
      {/* Kontrol Butonları */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-md border border-zinc-700/50 rounded-2xl p-3 shadow-2xl">
          <div className="flex gap-3">
            <CameraControls />
            <ScreenShareButton />
          </div>
        </div>
      </div>

      {/* Gelişmiş İstatistikler */}
      <AdvancedStats />
    </LiveKitRoom>
  );
};

// Push-to-Talk & Krisp Controller
const PushToTalkController = () => {
  const room = useRoomContext();
  const { settings } = useVoiceSettings();
  const { isTalking, enableForRoom: enablePTT } = usePushToTalk({
    enabled: settings.pushToTalk,
    key: settings.pushToTalkKey,
    delay: settings.pushToTalkDelay,
  });
  const { isActive: krispActive, enableForRoom: enableKrisp } = useKrispNoiseFilter(settings.krispEnabled);
  const { enableForRoom: enableAutoVolume } = useAutoVolumeNormalization(settings.autoVolumeNormalization);

  useEffect(() => {
    if (!room) {
      console.log('⚠️ Room yok, controller başlatılmadı');
      return;
    }

    console.log('🎬 PTT/Krisp Controller başlatılıyor...');
    console.log('⚙️ Settings:', { 
      pushToTalk: settings.pushToTalk, 
      krispEnabled: settings.krispEnabled,
      key: settings.pushToTalkKey 
    });

    // PTT'yi hemen başlat
    const pttTimer = setTimeout(() => {
      console.log('⏰ PTT timer tetiklendi (500ms)');
      enablePTT(room);
    }, 500);

    // Krisp'i daha sonra başlat (track publish olsun diye)
    const krispTimer = setTimeout(() => {
      console.log('⏰ Krisp timer tetiklendi (3000ms)');
      if (settings.krispEnabled) {
        enableKrisp(room);
      } else {
        console.log('⏸️ Krisp kapalı, başlatılmadı');
      }
    }, 3000);

    // Otomatik ses dengelemeyi başlat
    const autoVolumeTimer = setTimeout(() => {
      if (settings.autoVolumeNormalization) {
        enableAutoVolume(room);
      }
    }, 5000);

    return () => {
      console.log('🧹 PTT/Krisp/AutoVolume Controller cleanup');
      clearTimeout(pttTimer);
      clearTimeout(krispTimer);
      clearTimeout(autoVolumeTimer);
    };
  }, [room, enablePTT, enableKrisp, enableAutoVolume, settings.krispEnabled, settings.pushToTalk, settings.pushToTalkKey, settings.autoVolumeNormalization]);

  return (
    <>
      {/* PTT göstergesi */}
      {settings.pushToTalk && isTalking && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="relative">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
              <div className="absolute inset-0 w-4 h-4 bg-white rounded-full animate-ping" />
            </div>
            <div>
              <span className="font-bold text-lg">Konuşuyorsunuz</span>
              <p className="text-xs text-green-100">Space tuşunu bırakınca mikrofon kapanacak</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Krisp göstergesi */}
      {krispActive && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/30 rounded-xl px-4 py-2 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-4 h-4 text-green-400" />
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="w-4 h-4 text-green-400 opacity-75" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-green-400">Krisp AI</p>
                <p className="text-[10px] text-green-300/70">Gürültü Engelleme Aktif</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
