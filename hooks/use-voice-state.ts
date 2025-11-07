import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useVoiceState = (
  memberId: string,
  channelId: string | null,
  isMuted: boolean,
  isDeafened: boolean
) => {
  const router = useRouter();

  // Update voice state when entering/leaving channel
  useEffect(() => {
    const updateVoiceState = async () => {
      if (!memberId) {
        console.log("⚠️ No memberId, skipping voice state update");
        return;
      }

      console.log("🎤 Updating voice state:", {
        memberId,
        channelId,
        isMuted,
        isDeafened,
      });

      try {
        const response = await axios.patch(`/api/members/${memberId}/voice-state`, {
          currentChannelId: channelId,
          isMuted,
          isDeafened,
        });
        console.log("✅ Voice state updated:", response.data);
        
        // Refresh to show member in voice channel
        router.refresh();
      } catch (error) {
        console.error("❌ [VOICE_STATE_UPDATE]", error);
      }
    };

    updateVoiceState();

    // Cleanup on unmount (leave channel)
    return () => {
      if (channelId && memberId) {
        console.log("👋 Leaving voice channel:", channelId);
        axios.patch(`/api/members/${memberId}/voice-state`, {
          currentChannelId: null,
          isMuted: false,
          isDeafened: false,
        }).then((response) => {
          console.log("✅ Left voice channel:", response.data);
          router.refresh();
        }).catch((error) => {
          console.error("❌ Error leaving channel:", error);
        });
      }
    };
  }, [memberId, channelId, router]);

  // Update mute/deafen state separately
  useEffect(() => {
    const updateAudioState = async () => {
      if (!memberId || !channelId) return;

      try {
        await axios.patch(`/api/members/${memberId}/voice-state`, {
          currentChannelId: channelId,
          isMuted,
          isDeafened,
        });
        router.refresh();
      } catch (error) {
        console.error("[AUDIO_STATE_UPDATE]", error);
      }
    };

    updateAudioState();
  }, [isMuted, isDeafened, memberId, channelId, router]);
};

