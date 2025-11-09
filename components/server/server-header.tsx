"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
  Sparkles
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
};

export const ServerHeader = ({
  server,
  role
}: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none w-full" asChild>
        <button className="group w-full">
          {/* Modern Gradient Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Server Icon */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">
                      {server.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="absolute -bottom-1 -right-1 p-1 bg-yellow-500 rounded-full">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Server Name */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white truncate">
                    {server.name}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {server.members.length} üye
                  </p>
                </div>
              </div>

              {/* Chevron */}
              <ChevronDown className="w-5 h-5 text-zinc-400 group-hover:text-white transition-all group-hover:rotate-180 duration-300" />
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 bg-[#1e1f22]/98 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="px-4 py-3 rounded-xl cursor-pointer hover:bg-blue-500/10 text-blue-400 font-medium transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <UserPlus className="h-4 w-4" />
              </div>
              <span>Davet Et</span>
            </div>
          </DropdownMenuItem>
        )}
        
        {isAdmin && (
          <>
            <DropdownMenuItem
              onClick={() => onOpen("editServer", { server })}
              className="px-4 py-3 rounded-xl cursor-pointer hover:bg-white/5 text-zinc-300 font-medium transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Settings className="h-4 w-4" />
                </div>
                <span>Server Ayarları</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onOpen("members", { server })}
              className="px-4 py-3 rounded-xl cursor-pointer hover:bg-white/5 text-zinc-300 font-medium transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Users className="h-4 w-4" />
                </div>
                <span>Üyeleri Yönet</span>
              </div>
            </DropdownMenuItem>
          </>
        )}

        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="px-4 py-3 rounded-xl cursor-pointer hover:bg-green-500/10 text-green-400 font-medium transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <PlusCircle className="h-4 w-4" />
              </div>
              <span>Kanal Oluştur</span>
            </div>
          </DropdownMenuItem>
        )}

        {isModerator && <DropdownMenuSeparator className="bg-white/10 my-2" />}

        {isAdmin ? (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="px-4 py-3 rounded-xl cursor-pointer hover:bg-red-500/10 text-red-400 font-medium transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Trash className="h-4 w-4" />
              </div>
              <span>Server Sil</span>
            </div>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="px-4 py-3 rounded-xl cursor-pointer hover:bg-red-500/10 text-red-400 font-medium transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <LogOut className="h-4 w-4" />
              </div>
              <span>Serverdan Ayrıl</span>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
