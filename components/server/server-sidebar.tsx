import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Hash, Mic, Video, ShieldAlert, ShieldCheck } from "lucide-react";
import { ServerHeader } from "./server-header";
import { ServerFooter } from "./server-footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
import { VoiceChannelSection } from "./voice-channel-section";
import { ServerCategory } from "./server-category";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}

export const ServerSidebar = async ({
  serverId
}: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      categories: {
        orderBy: {
          position: "asc",
        },
      },
      channels: {
        orderBy: {
          position: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });

  // Channels without category (uncategorized)
  const uncategorizedChannels = server?.channels.filter((channel) => !channel.categoryId)
  const textChannels = uncategorizedChannels?.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = uncategorizedChannels?.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = uncategorizedChannels?.filter((channel) => channel.type === ChannelType.VIDEO)
  const members = server?.members.filter((member) => member.profileId !== profile.id)

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full bg-discord-bg-secondary">
      <ServerHeader
        server={server}
        role={role}
      />
      <ScrollArea className="flex-1 px-3 pb-0">
        <div className="mt-2">
          <Separator className="bg-white/5 rounded-md my-2" />
        </div>
        
        {/* Render categories with their channels */}
        {server?.categories.map((category) => {
          const categoryTextChannels = server.channels.filter(
            (channel) => channel.categoryId === category.id && channel.type === ChannelType.TEXT
          );
          const categoryAudioChannels = server.channels.filter(
            (channel) => channel.categoryId === category.id && channel.type === ChannelType.AUDIO
          );
          const categoryVideoChannels = server.channels.filter(
            (channel) => channel.categoryId === category.id && channel.type === ChannelType.VIDEO
          );

          return (
            <div key={category.id} className="mb-2">
              <ServerCategory category={category} server={server} role={role} />
              <div className="space-y-[2px] mt-1">
                {categoryTextChannels.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    role={role}
                    server={server}
                  />
                ))}
                {categoryAudioChannels.map((channel) => (
                  <VoiceChannelSection
                    key={channel.id}
                    channels={[channel]}
                    server={server}
                    role={role}
                    label=""
                    channelType={ChannelType.AUDIO}
                  />
                ))}
                {categoryVideoChannels.map((channel) => (
                  <VoiceChannelSection
                    key={channel.id}
                    channels={[channel]}
                    server={server}
                    role={role}
                    label=""
                    channelType={ChannelType.VIDEO}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Uncategorized channels */}
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Kanalları"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Sesli Kanallar"
            />
            <VoiceChannelSection
              channels={audioChannels}
              server={server}
              role={role}
              label="Sesli Kanallar"
              channelType={ChannelType.AUDIO}
            />
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Kanallar"
            />
            <VoiceChannelSection
              channels={videoChannels}
              server={server}
              role={role}
              label="Video Kanallar"
              channelType={ChannelType.VIDEO}
            />
          </div>
        )}
      </ScrollArea>
      <ServerFooter />
    </div>
  )
}

