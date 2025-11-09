"use client";

import { useParams } from "next/navigation";
import { VoiceRoom } from "@/components/voice/voice-room";
import { useEffect, useState } from "react";

export default function VoiceChannelPage() {
  const params = useParams();
  const [channelData, setChannelData] = useState<any>(null);

  useEffect(() => {
    // Kanal bilgilerini fetch et
    const fetchChannelData = async () => {
      try {
        const response = await fetch(`/api/channels/${params?.channelId}`);
        if (response.ok) {
          const data = await response.json();
          setChannelData(data);
        }
      } catch (error) {
        console.error("Failed to fetch channel data:", error);
      }
    };

    if (params?.channelId) {
      fetchChannelData();
    }
  }, [params?.channelId]);

  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p className="text-zinc-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <VoiceRoom
      channelId={params?.channelId as string}
      channelName={channelData.name || "Ses Kanalı"}
      serverName={channelData.server?.name || "Sunucu"}
    />
  );
}
