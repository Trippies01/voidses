import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ShieldAlert, ShieldCheck, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ServerMember } from "./server-member";
import { ActionTooltip } from "@/components/action-tooltip";

interface ServerMemberSidebarProps {
  serverId: string;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}

export const ServerMemberSidebar = async ({
  serverId
}: ServerMemberSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
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

  if (!server) {
    return redirect("/");
  }

  const currentMember = server.members.find((member) => member.profileId === profile.id);
  const role = currentMember?.role;
  const members = server.members;
  const onlineMembers = members.filter(() => true); // Tüm üyeler (online status sonra eklenecek)
  
  if (!currentMember) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      {/* Header */}
      <div className="text-md font-semibold px-3 flex items-center justify-between h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
        <div className="flex items-center gap-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-sm font-semibold">
            Çevrimiçi — {onlineMembers.length}
          </p>
        </div>
        {role === MemberRole.ADMIN && (
          <ActionTooltip label="Üyeleri Yönet" side="bottom">
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              <Settings className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        </div>

        {/* Admin Section */}
        {members.filter(m => m.role === MemberRole.ADMIN).length > 0 && (
          <div className="mb-4">
            <div className="flex items-center py-2">
              <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 flex items-center">
                <ShieldAlert className="h-3 w-3 mr-1 text-rose-500" />
                Admin — {members.filter(m => m.role === MemberRole.ADMIN).length}
              </p>
            </div>
            <div className="space-y-[2px]">
              {members.filter(m => m.role === MemberRole.ADMIN).map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                  currentMember={currentMember}
                />
              ))}
            </div>
          </div>
        )}

        {/* Moderator Section */}
        {members.filter(m => m.role === MemberRole.MODERATOR).length > 0 && (
          <div className="mb-4">
            <div className="flex items-center py-2">
              <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1 text-indigo-500" />
                Moderator — {members.filter(m => m.role === MemberRole.MODERATOR).length}
              </p>
            </div>
            <div className="space-y-[2px]">
              {members.filter(m => m.role === MemberRole.MODERATOR).map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                  currentMember={currentMember}
                />
              ))}
            </div>
          </div>
        )}

        {/* Guest Section */}
        {members.filter(m => m.role === MemberRole.GUEST).length > 0 && (
          <div className="mb-4">
            <div className="flex items-center py-2">
              <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                Üyeler — {members.filter(m => m.role === MemberRole.GUEST).length}
              </p>
            </div>
            <div className="space-y-[2px]">
              {members.filter(m => m.role === MemberRole.GUEST).map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                  currentMember={currentMember}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

