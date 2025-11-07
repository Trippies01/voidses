"use client";

import { useEffect, useState } from "react";
import { 
  LiveKitRoom, 
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { KrispController } from "@/components/krisp-controller";

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
      audio={audio}
      onDisconnected={handleDisconnect}
    >
      <KrispController />
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};
