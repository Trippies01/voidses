import React from "react";
import { Member, Profile } from "@prisma/client";

// Detect @mentions in text
export const detectMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map(m => m.substring(1)) : [];
};

// Find mentioned members by name
export const findMentionedMembers = (
  text: string,
  members: (Member & { profile: Profile })[]
): string[] => {
  const mentionedNames = detectMentions(text);
  const mentionedMemberIds: string[] = [];

  mentionedNames.forEach(name => {
    const member = members.find(
      m => m.profile.name.toLowerCase() === name.toLowerCase()
    );
    if (member) {
      mentionedMemberIds.push(member.id);
    }
  });

  return mentionedMemberIds;
};

// Check if message has @everyone
export const hasMentionEveryone = (text: string): boolean => {
  return text.includes("@everyone") || text.includes("@here");
};

// Highlight mentions in text (for rendering)
export const highlightMentions = (
  text: string,
  currentMemberName: string,
  mentionedMembers?: (Member & { profile: Profile })[]
): React.ReactNode[] => {
  const parts = text.split(/(@\w+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const username = part.substring(1);
      const unameLower = username.toLowerCase();
      const isMentioningMe =
        unameLower === currentMemberName.toLowerCase() ||
        unameLower === "everyone" ||
        unameLower === "here";

      const className = isMentioningMe ? "mention mention-me" : "mention";

      // Return an actual React node so the function matches React.ReactNode[]
      return React.createElement(
        "span",
        { key: index, className },
        part
      );
    }

    // plain text is a valid ReactNode (string)
    return part;
  });
};