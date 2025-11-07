"use client";

interface TypingIndicatorProps {
  typingUsers: string[];
}

export const TypingIndicator = ({ typingUsers }: TypingIndicatorProps) => {
  if (typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} yazıyor...`
      : typingUsers.length === 2
      ? `${typingUsers[0]} ve ${typingUsers[1]} yazıyor...`
      : `${typingUsers.length} kişi yazıyor...`;

  return (
    <div className="px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
      <div className="flex gap-1">
        <span className="animate-bounce animation-delay-0">•</span>
        <span className="animate-bounce animation-delay-100">•</span>
        <span className="animate-bounce animation-delay-200">•</span>
      </div>
      <span>{text}</span>
    </div>
  );
};

