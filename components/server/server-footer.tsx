"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Headphones, Settings } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import { OnlineStatus } from "@/components/online-status";
import { useKeyboardShortcuts, DEFAULT_SHORTCUTS } from "@/hooks/use-keyboard-shortcuts";

export const ServerFooter = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Klavye kısayolları
  useKeyboardShortcuts([
    {
      ...DEFAULT_SHORTCUTS.MUTE,
      action: () => toggleMute(),
    },
    {
      ...DEFAULT_SHORTCUTS.DEAFEN,
      action: () => toggleDeafen(),
    },
    {
      ...DEFAULT_SHORTCUTS.SETTINGS,
      action: () => router.push('/settings/voice'),
    },
  ]);

  if (!user) return null;

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (isDeafened) setIsDeafened(false);
    
    // Play sound effect
    const audio = new Audio(newMutedState 
      ? 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' // Mute sound
      : 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' // Unmute sound
    );
    audio.volume = 0.2;
    audio.play().catch(e => console.log("Sound play failed:", e));
  };

  const toggleDeafen = () => {
    const newDeafenedState = !isDeafened;
    setIsDeafened(newDeafenedState);
    if (!isDeafened) setIsMuted(true);
    
    // Play sound effect
    const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
    audio.volume = 0.2;
    audio.play().catch(e => console.log("Sound play failed:", e));
  };

  return (
    <div className="flex items-center p-2 bg-[#232428] dark:bg-[#232428]">
      {/* User Info */}
      <div className="flex items-center flex-1 min-w-0 hover:bg-[#2e3035] dark:hover:bg-[#2e3035] rounded px-2 py-1 transition cursor-pointer">
        <div className="relative mr-2">
          <UserAvatar 
            src={user?.imageUrl}
            className="h-8 w-8"
          />
          <div className="absolute bottom-0 right-0">
            <OnlineStatus isOnline={true} size="sm" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {user?.firstName || user?.username}
          </p>
          <div className="flex items-center gap-1">
            <p className="text-xs text-zinc-400">Çevrimiçi</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 ml-2">
        <ActionTooltip label={isMuted ? "Sesi Aç" : "Sustur"} side="top">
          <button
            onClick={toggleMute}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded hover:bg-[#3c3f45] transition",
              isMuted ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </ActionTooltip>

        <ActionTooltip label={isDeafened ? "Sağırlaştırmayı Kapat" : "Sağırlaştır"} side="top">
          <button
            onClick={toggleDeafen}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded hover:bg-[#3c3f45] transition",
              isDeafened ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Headphones className="w-5 h-5" />
          </button>
        </ActionTooltip>

        <ActionTooltip label="Ses Ayarları" side="top">
          <button
            onClick={() => router.push('/settings/voice')}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#3c3f45] transition text-zinc-400 hover:text-zinc-200"
          >
            <Settings className="w-5 h-5" />
          </button>
        </ActionTooltip>
      </div>
    </div>
  );
};

