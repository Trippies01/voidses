"use client";

import { useEffect, useState, useCallback } from "react";
import { Channel, ChannelType, MemberRole, Profile, Server, Member } from "@prisma/client";
import axios from "axios";
import qs from "query-string";
import { ServerChannel } from "./server-channel";
import { useSocket } from "@/components/providers/socket-provider";

interface VoiceChannelSectionProps {
  channels: Channel[];
  server: Server;
  role?: MemberRole;
  label: string;
  channelType: ChannelType;
}

export const VoiceChannelSection = ({
  channels,
  server,
  role,
  label,
  channelType,
}: VoiceChannelSectionProps) => {
  const [channelMembers, setChannelMembers] = useState<Record<string, any[]>>({});
  const { socket } = useSocket();

  // Fetch members in voice channels
  const fetchVoiceMembers = useCallback(async () => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/servers/${server.id}/voice-members`,
      });
      console.log("🔍 Fetching voice members:", url);
      const response = await axios.get(url);
      console.log("✅ Voice members data:", response.data);
      setChannelMembers(response.data);
    } catch (error) {
      console.error("❌ [VOICE_MEMBERS_FETCH]", error);
    }
  }, [server.id]);

  useEffect(() => {
    fetchVoiceMembers();

    // Poll every 5 seconds for updates
    const interval = setInterval(fetchVoiceMembers, 5000);

    return () => clearInterval(interval);
  }, [fetchVoiceMembers]);

  // Listen for voice state changes via socket
  useEffect(() => {
    if (!socket) return;

    const voiceStateHandler = () => {
      fetchVoiceMembers();
    };

    socket.on(`server:${server.id}:voice-state`, voiceStateHandler);

    return () => {
      socket.off(`server:${server.id}:voice-state`, voiceStateHandler);
    };
  }, [socket, server.id, fetchVoiceMembers]);

  return (
    <div className="space-y-[2px]">
      {channels.map((channel) => {
        const membersInChannel = channelMembers[channel.id] || [];
        console.log(`📋 Channel ${channel.name} has ${membersInChannel.length} members:`, membersInChannel);
        return (
          <ServerChannel
            key={channel.id}
            channel={channel}
            role={role}
            server={server}
            membersInChannel={membersInChannel}
          />
        );
      })}
    </div>
  );
};

