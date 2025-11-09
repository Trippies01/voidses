"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, User, Crown, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface VoiceParticipantCardProps {
  name: string;
  avatar?: string;
  isMuted?: boolean;
  isDeafened?: boolean;
  isSpeaking?: boolean;
  volume?: number;
  role?: "admin" | "moderator" | "member";
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

export const VoiceParticipantCard = ({
  name,
  avatar,
  isMuted = false,
  isDeafened = false,
  isSpeaking = false,
  volume = 100,
  role = "member",
  onVolumeChange,
  className
}: VoiceParticipantCardProps) => {
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [localVolume, setLocalVolume] = useState(volume);

  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  const handleVolumeChange = (value: number[]) => {
    setLocalVolume(value[0]);
    onVolumeChange?.(value[0]);
  };

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3 text-yellow-400" />;
      case "moderator":
        return <Shield className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case "admin":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "moderator":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-700/50 text-zinc-400 border-zinc-600/30";
    }
  };

  return (
    <div
      className={cn(
        "group relative p-3 rounded-xl transition-all duration-300",
        "bg-zinc-800/30 hover:bg-zinc-800/50",
        "border border-white/5 hover:border-white/10",
        isSpeaking && "ring-2 ring-green-500/50 border-green-500/30 bg-green-500/5",
        className
      )}
      onMouseEnter={() => setShowVolumeControl(true)}
      onMouseLeave={() => setShowVolumeControl(false)}
    >
      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent animate-pulse" />
      )}

      <div className="relative flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <Avatar className={cn(
            "h-10 w-10 border-2 transition-all duration-300",
            isSpeaking ? "border-green-500 shadow-lg shadow-green-500/50" : "border-zinc-700"
          )}>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Status Badge */}
          <div className={cn(
            "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center",
            "border-2 border-zinc-900 transition-all duration-300",
            isMuted ? "bg-red-500" : isDeafened ? "bg-zinc-600" : "bg-green-500"
          )}>
            {isMuted ? (
              <MicOff className="h-3 w-3 text-white" />
            ) : isDeafened ? (
              <VolumeX className="h-3 w-3 text-white" />
            ) : (
              <Mic className="h-3 w-3 text-white" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-zinc-100 truncate">
              {name}
            </p>
            {getRoleIcon() && (
              <div className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs",
                getRoleBadgeColor()
              )}>
                {getRoleIcon()}
              </div>
            )}
          </div>
          
          {/* Speaking Indicator Text */}
          {isSpeaking && (
            <p className="text-xs text-green-400 animate-pulse">
              Konuşuyor...
            </p>
          )}
          {isMuted && !isSpeaking && (
            <p className="text-xs text-red-400">
              Mikrofon kapalı
            </p>
          )}
          {isDeafened && !isSpeaking && (
            <p className="text-xs text-zinc-500">
              Ses kapalı
            </p>
          )}
        </div>

        {/* Volume Control */}
        {showVolumeControl && !isDeafened && (
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl">
            <Volume2 className="h-4 w-4 text-zinc-400" />
            <Slider
              value={[localVolume]}
              onValueChange={handleVolumeChange}
              max={200}
              step={1}
              className="w-24"
            />
            <span className="text-xs text-zinc-400 min-w-[3ch]">
              {localVolume}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
