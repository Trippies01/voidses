"use client";

import { Category, Server, MemberRole } from "@prisma/client";
import { ChevronDown, ChevronRight, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

interface ServerCategoryProps {
  category: Category;
  server: Server;
  role?: MemberRole;
}

export const ServerCategory = ({
  category,
  server,
  role,
}: ServerCategoryProps) => {
  const { onOpen } = useModal();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = role === MemberRole.MODERATOR;
  const canManage = isAdmin || isModerator;

  return (
    <div className="w-full">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3 text-zinc-500" />
        ) : (
          <ChevronDown className="h-3 w-3 text-zinc-500" />
        )}
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
          {category.name}
        </p>
        {canManage && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Kanal Ekle" side="top">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen("createChannel", { server, category });
                }}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </ActionTooltip>
            <ActionTooltip label="Kategori Ayarları" side="top">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen("editCategory", { server, category });
                }}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              >
                <Settings className="h-4 w-4" />
              </button>
            </ActionTooltip>
          </div>
        )}
      </button>
      <div className={cn("space-y-[2px]", isCollapsed && "hidden")}>
        {/* Channels will be rendered here by parent */}
      </div>
    </div>
  );
};




