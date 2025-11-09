import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Hash, Mic, Video } from "lucide-react";
import { ServerHeader } from "./server-header";
import { ServerFooter } from "./server-footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CollapsibleSection } from "./collapsible-section";
import { ServerChannel } from "./server-channel";
import { VoiceChannelSection } from "./voice-channel-section";
import { ServerCategory } from "./server-category";

interface ServerSidebarProps {
  serverId: string;
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

  if (!server) {
    return redirect("/");
  }

  const currentMember = server.members.find((member) => member.profileId === profile.id);
  const role = currentMember?.role;

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
                    currentMemberId={currentMember?.id}
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
                    currentMemberId={currentMember?.id}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Uncategorized channels */}
        {!!textChannels?.length && (
          <CollapsibleSection
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={role}
            label="Text Kanalları"
            server={server}
            defaultOpen={true}
            count={textChannels.length}
          >
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </CollapsibleSection>
        )}
        {!!audioChannels?.length && (
          <CollapsibleSection
            sectionType="channels"
            channelType={ChannelType.AUDIO}
            role={role}
            label="Sesli Kanallar"
            server={server}
            defaultOpen={true}
            count={audioChannels.length}
          >
            <VoiceChannelSection
              channels={audioChannels}
              server={server}
              role={role}
              label="Sesli Kanallar"
              channelType={ChannelType.AUDIO}
              currentMemberId={currentMember?.id}
            />
          </CollapsibleSection>
        )}
        {!!videoChannels?.length && (
          <CollapsibleSection
            sectionType="channels"
            channelType={ChannelType.VIDEO}
            role={role}
            label="Video Kanallar"
            server={server}
            defaultOpen={true}
            count={videoChannels.length}
          >
            <VoiceChannelSection
              channels={videoChannels}
              server={server}
              role={role}
              label="Video Kanallar"
              channelType={ChannelType.VIDEO}
              currentMemberId={currentMember?.id}
            />
          </CollapsibleSection>
        )}
      </ScrollArea>
      <ServerFooter />
    </div>
  )
}

