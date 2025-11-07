"use client";

import { Member, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { Mic, MicOff, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnlineStatus } from "@/components/online-status";

interface VoiceChannelMembersProps {
  members: (Member & { profile: Profile })[];
  channelName?: string;
}

export const VoiceChannelMembers = ({ members, channelName }: VoiceChannelMembersProps) => {
  console.log("👥 VoiceChannelMembers rendering:", members.length, "members");
  
  if (members.length === 0) {
    console.log("⚠️ No members, returning null");
    return null;
  }

  return (
    <div className="px-2 pb-2 bg-zinc-700/20 dark:bg-zinc-700/20 rounded-md mt-1">
      <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2 px-2 pt-2">
        {channelName && `${channelName} —`} {members.length} {members.length === 1 ? "Kişi" : "Kişi"}
      </div>
      <div className="space-y-1">
        {members.map((member) => (
          <div
            key={member.id}
            className="group px-2 py-1.5 rounded-md flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
          >
            <div className="relative">
              <UserAvatar
                src={member.profile.imageUrl}
                className="h-7 w-7"
              />
              <div className="absolute bottom-0 right-0">
                <OnlineStatus isOnline={member.isOnline} size="sm" />
              </div>
            </div>
            
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 flex-1 truncate">
              {member.profile.name}
            </p>

            <div className="flex items-center gap-1">
              {member.isDeafened ? (
                <Headphones className="w-4 h-4 text-red-500" />
              ) : member.isMuted ? (
                <MicOff className="w-4 h-4 text-red-500" />
              ) : (
                <Mic className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

