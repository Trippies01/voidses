"use client";

import { useState } from "react";
import { User, MessageSquare, Phone, Volume2, VolumeX, Shield, Ban, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextMenuProps {
  participantName: string;
  participantId: string;
  isLocal: boolean;
  isMuted: boolean;
  volume: number;
  isAdmin?: boolean;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onMessage: () => void;
  onCall: () => void;
  onViewProfile: () => void;
  onKick?: () => void;
  onBlock: () => void;
  position: { x: number; y: number };
  onClose: () => void;
}

export const ParticipantContextMenu = ({
  participantName,
  participantId,
  isLocal,
  isMuted,
  volume,
  isAdmin = false,
  onVolumeChange,
  onMute,
  onMessage,
  onCall,
  onViewProfile,
  onKick,
  onBlock,
  position,
  onClose,
}: ContextMenuProps) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className="fixed z-50 min-w-[220px] rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl py-2"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-white/10">
          <p className="text-sm font-semibold text-white truncate">
            {participantName}
          </p>
          <p className="text-xs text-zinc-500 truncate">
            {participantId}
          </p>
        </div>

        {/* Actions */}
        <div className="py-1">
          {!isLocal && (
            <>
              <button
                onClick={() => {
                  onViewProfile();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors"
              >
                <User className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Profil</span>
              </button>

              <button
                onClick={() => {
                  onMessage();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Mesaj Gönder</span>
              </button>

              <button
                onClick={() => {
                  onCall();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors"
              >
                <Phone className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Ara</span>
              </button>

              <div className="h-px bg-white/10 my-1" />

              {/* Volume Control */}
              <div className="px-3 py-2">
                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className="w-full flex items-center justify-between hover:bg-white/10 rounded px-2 py-1 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm text-zinc-300">Ses Seviyesi</span>
                  </div>
                  <span className="text-xs text-zinc-500">{volume}%</span>
                </button>

                {showVolumeSlider && (
                  <div className="mt-2 px-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={volume}
                      onChange={(e) => onVolumeChange(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-zinc-500">0%</span>
                      <span className="text-xs text-zinc-500">200%</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  onMute();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors"
              >
                <VolumeX className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">
                  {isMuted ? "Sesi Aç" : "Sustur"}
                </span>
              </button>

              <div className="h-px bg-white/10 my-1" />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(participantId);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors"
              >
                <Copy className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">ID Kopyala</span>
              </button>

              {/* Admin Actions */}
              {isAdmin && onKick && (
                <>
                  <div className="h-px bg-white/10 my-1" />
                  
                  <button
                    onClick={() => {
                      onKick();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-orange-500/20 transition-colors text-orange-400"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Kanaldan At</span>
                  </button>
                </>
              )}

              <div className="h-px bg-white/10 my-1" />

              <button
                onClick={() => {
                  onBlock();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/20 transition-colors text-red-400"
              >
                <Ban className="h-4 w-4" />
                <span className="text-sm">Engelle</span>
              </button>
            </>
          )}

          {isLocal && (
            <div className="px-3 py-2 text-center text-xs text-zinc-500">
              Bu sensin!
            </div>
          )}
        </div>
      </div>
    </>
  );
};
