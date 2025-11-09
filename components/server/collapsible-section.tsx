"use client";

import { useState } from "react";
import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ChevronDown, Plus, Settings } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}

export const CollapsibleSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
  children,
  defaultOpen = true,
  count = 0,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { onOpen } = useModal();

  return (
    <div className="mb-2">
      {/* Header */}
      <div className={cn(
        "group flex items-center justify-between py-2 px-2 rounded-lg",
        "hover:bg-white/5 transition-all duration-200 cursor-pointer",
        "border border-transparent hover:border-white/10"
      )}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 flex-1"
        >
          {/* Chevron Icon */}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-zinc-400 transition-transform duration-300",
              isOpen ? "rotate-0" : "-rotate-90"
            )}
          />
          
          {/* Label */}
          <p className="text-xs uppercase font-semibold text-zinc-400 group-hover:text-zinc-300 transition-colors">
            {label}
          </p>
          
          {/* Count Badge */}
          {count > 0 && (
            <span className={cn(
              "ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium",
              "bg-zinc-700/50 text-zinc-400 group-hover:bg-zinc-600/50 group-hover:text-zinc-300",
              "transition-all duration-200"
            )}>
              {count}
            </span>
          )}
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {role !== MemberRole.GUEST && sectionType === "channels" && (
            <ActionTooltip label="Kanal Oluştur" side="top">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen("createChannel", { channelType });
                }}
                className={cn(
                  "p-1.5 rounded-md transition-all duration-200",
                  "text-zinc-400 hover:text-zinc-300",
                  "hover:bg-white/10"
                )}
              >
                <Plus className="h-4 w-4" />
              </button>
            </ActionTooltip>
          )}
          {role === MemberRole.ADMIN && sectionType === "members" && (
            <ActionTooltip label="Üyeleri Yönet" side="top">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen("members", { server });
                }}
                className={cn(
                  "p-1.5 rounded-md transition-all duration-200",
                  "text-zinc-400 hover:text-zinc-300",
                  "hover:bg-white/10"
                )}
              >
                <Settings className="h-4 w-4" />
              </button>
            </ActionTooltip>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-[2px] mt-1 pl-2">
          {children}
        </div>
      </div>
    </div>
  );
};
