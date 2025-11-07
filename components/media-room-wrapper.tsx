"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MediaRoom } from "@/components/media-room";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChannelType } from "@prisma/client";
import axios from "axios";

interface MediaRoomWrapperProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  memberId: string;
  channelId: string;
  serverId: string;
  channelName: string;
  channelType: ChannelType;
}

export const MediaRoomWrapper = ({
  chatId,
  video,
  audio,
  memberId,
  channelId,
  serverId,
  channelName,
  channelType,
}: MediaRoomWrapperProps) => {
  const router = useRouter();
  const [isInVoice, setIsInVoice] = useState(true);

  const handleLeaveVoice = useCallback(async () => {
    console.log("📞 Leaving voice channel from header...");
    
    // Play disconnect sound
    const audioSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVa3m7q1aFgxDmuDxwGwgBSuAzvLZhzgHGWS57OihUBELTKXi8bllHAU7k9jyynYnBSh+zPDajzsIGGS56+mjURELTKTi8bllHAU7k9jyynYnBSh+zPDajzsIGGS56+mjURELTKTi8bllHAU7k9jyynYnBSh+zPDajzsIGGS56+mjURELTKTi8bllHAU7k9jyynYnBSh+zPDajzsIGGS56+mjURELTKTi8bllHAU7k9jyynYn');
    audioSound.volume = 0.3;
    audioSound.play().catch(() => {});
    
    try {
      // Update database - leave voice
      await axios.patch(`/api/members/${memberId}/voice-state`, {
        currentChannelId: null,
        isMuted: false,
        isDeafened: false,
      });
      
      console.log("✅ Left voice channel");
      setIsInVoice(false);
      
      // Navigate back to server
      setTimeout(() => {
        router.push(`/servers/${serverId}`);
        router.refresh();
      }, 200);
    } catch (error) {
      console.error("❌ Leave error:", error);
    }
  }, [memberId, serverId, router]);

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channelName}
        serverId={serverId}
        type="channel"
        channelType={channelType}
        channelId={channelId}
        isInVoiceChannel={isInVoice}
        onLeaveVoice={handleLeaveVoice}
      />
      <MediaRoom
        chatId={chatId}
        video={video}
        audio={audio}
        memberId={memberId}
        channelId={channelId}
      />
    </div>
  );
};

