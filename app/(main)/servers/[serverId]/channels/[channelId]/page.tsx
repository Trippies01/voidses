import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { MediaRoomWrapper } from "@/components/media-room-wrapper";
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

  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
        channelType={channel.type}
        channelId={channel.id}
        voiceChannelName={voiceChannelName}
      />
      {channel.type === ChannelType.TEXT && (
        <>
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
        <MediaRoomWrapper
          chatId={channel.id}
          video={false}
          audio={true}
          memberId={member.id}
          channelId={channel.id}
          serverId={serverId}
          channelName={channel.name}
          channelType={channel.type}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoomWrapper
          chatId={channel.id}
          video={true}
          audio={true}
          memberId={member.id}
          channelId={channel.id}
          serverId={serverId}
          channelName={channel.name}
          channelType={channel.type}
        />
      )}
    </div>
   );
}
 
export default ChannelIdPage;

