"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
};

export const NavigationItem = ({
  id,
  imageUrl,
  name
}: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  }

  const isActive = params?.serverId === id;

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={name}
    >
      <button
        onClick={onClick}
        className="group relative flex items-center w-full"
      >
        {/* Active indicator line */}
        <div className={cn(
          "absolute left-0 bg-discord-brand rounded-r-full transition-all w-1",
          !isActive && "group-hover:h-5",
          isActive ? "h-9" : "h-2"
        )} />
        
        {/* Server icon */}
        <div className={cn(
          "relative group flex mx-3 h-12 w-12 transition-all overflow-hidden",
          "rounded-3xl group-hover:rounded-2xl",
          isActive && "rounded-2xl bg-discord-brand/10"
        )}>
          <Image
            fill
            src={imageUrl}
            alt={name}
            sizes="48px"
            className="object-cover"
          />
          
          {/* Unread indicator (placeholder for future) */}
          {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-discord-red rounded-full border-2 border-discord-bg-tertiary" /> */}
        </div>
      </button>
    </ActionTooltip>
  );
};

