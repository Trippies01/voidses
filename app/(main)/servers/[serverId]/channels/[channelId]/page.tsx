import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { MediaRoomWrapper } from "@/components/media-room-wrapper";
import { ModernVoiceChannel } from "@/components/voice/modern-voice-channel";
import { ChannelType } from "@prisma/client";

interface ChannelIdPageProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>
}

const ChannelIdPage = async ({
  params
}: ChannelIdPageProps) => {
  const { serverId, channelId } = await params;
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    }
  });

  if (!channel || !member) {
    redirect("/");
  }

  // Fetch all server members for mention autocomplete
  const members = await db.member.findMany({
    where: {
      serverId: serverId,
    },
    include: {
      profile: true,
    },
    orderBy: {
      role: "asc",
    },
  });

  // Check if user is in a voice channel
  const currentMemberVoiceState = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
      currentChannelId: {
        not: null,
      },
    },
  });

  let voiceChannelName = undefined;
  if (currentMemberVoiceState?.currentChannelId) {
    const voiceChannel = await db.channel.findUnique({
      where: {
        id: currentMemberVoiceState.currentChannelId,
      },
    });
    voiceChannelName = voiceChannel?.name;
  }

  // Fetch server for name
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
  });

  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatHeader
            name={channel.name}
            serverId={channel.serverId}
            type="channel"
            channelType={channel.type}
            channelId={channel.id}
            voiceChannelName={voiceChannelName}
          />
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            members={members}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <ModernVoiceChannel
          channelId={channel.id}
          channelName={channel.name}
          serverName={server?.name || "Sunucu"}
          serverId={serverId}
          memberId={member.id}
          memberRole={member.role}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <ModernVoiceChannel
          channelId={channel.id}
          channelName={channel.name}
          serverName={server?.name || "Sunucu"}
          serverId={serverId}
          memberId={member.id}
          memberRole={member.role}
        />
      )}
    </div>
   );
}
 
export default ChannelIdPage;

