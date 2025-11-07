"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, Users } from "lucide-react";

interface MentionAutocompleteProps {
  searchTerm: string;
  members: (Member & { profile: Profile })[];
  onSelect: (member: Member & { profile: Profile } | { id: string; profile: { name: string } }) => void;
  position: { top: number; left: number };
  isOpen: boolean;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-3 w-3 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-3 w-3 text-rose-500" />,
};

export const MentionAutocomplete = ({
  searchTerm,
  members,
  onSelect,
  position,
  isOpen,
}: MentionAutocompleteProps) => {
  if (!isOpen) return null;

  const filtered = members.filter((m) =>
    m.profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  if (filtered.length === 0 && searchTerm !== "") return null;

  return (
    <div
      className="absolute bg-[#2b2d31] rounded-md shadow-xl border border-zinc-700 p-2 w-64 z-50 max-h-64 overflow-y-auto"
      style={{ bottom: position.top, left: position.left }}
    >
      {/* @everyone option */}
      {searchTerm === "" && (
        <div
          className="px-3 py-2 hover:bg-[#404249] cursor-pointer rounded transition flex items-center gap-2"
          onClick={() => onSelect({ id: "everyone", profile: { name: "everyone" } })}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-blue-400 font-semibold text-sm">@everyone</p>
            <p className="text-xs text-zinc-500">Herkesi bilgilendir</p>
          </div>
        </div>
      )}

      {/* Member list */}
      {filtered.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#404249] cursor-pointer rounded transition"
          onClick={() => onSelect(member)}
        >
          <UserAvatar
            src={member.profile.imageUrl}
            className="w-8 h-8"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-white text-sm font-medium truncate">
                {member.profile.name}
              </span>
              {roleIconMap[member.role]}
            </div>
            {member.role !== MemberRole.GUEST && (
              <span className="text-xs text-zinc-400">
                {member.role === MemberRole.ADMIN ? "Admin" : "Moderator"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

