"use client";

import { useEffect } from "react";

interface KeyboardShortcutsProps {
  onMuteToggle: () => void;
  onDeafenToggle: () => void;
  onVideoToggle: () => void;
  onScreenShareToggle: () => void;
  onDisconnect: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcutsVoice = ({
  onMuteToggle,
  onDeafenToggle,
  onVideoToggle,
  onScreenShareToggle,
  onDisconnect,
  enabled = true,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // M - Mute toggle
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        onMuteToggle();
      }

      // D - Deafen toggle
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        onDeafenToggle();
      }

      // V - Video toggle
      if (e.key === "v" || e.key === "V") {
        e.preventDefault();
        onVideoToggle();
      }

      // S - Screen share toggle
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        onScreenShareToggle();
      }

      // ESC - Disconnect
      if (e.key === "Escape") {
        e.preventDefault();
        onDisconnect();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onMuteToggle, onDeafenToggle, onVideoToggle, onScreenShareToggle, onDisconnect]);
};
