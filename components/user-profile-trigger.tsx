"use client";

import { useState } from "react";
import { Member, Profile, Server } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserProfileCard } from "@/components/user-profile-card";

interface UserProfileTriggerProps {
  member: Member & { profile: Profile };
  server: Server;
  currentMember: Member;
  children: React.ReactNode;
}

export const UserProfileTrigger = ({
  member,
  server,
  currentMember,
  children,
}: UserProfileTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="right"
        className="p-0 border-0 bg-transparent shadow-none"
        sideOffset={15}
        align="start"
      >
        <UserProfileCard
          member={member}
          server={server}
          currentMember={currentMember}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};

