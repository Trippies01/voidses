"use client";

import { useEffect, useState } from "react";
import { VoiceControlPanel } from "./voice-control-panel";
import { VoiceStatusBar } from "./voice-status-bar";
import { VoiceParticipantCard } from "./voice-participant-card";
import { useVoiceConnection } from "@/hooks/use-voice-connection";
import { useVoiceParticipants } from "@/hooks/use-voice-participants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRoomProps {
  channelId: string;
  channelName: string;
  serverName: string;
  className?: string;
}

export const VoiceRoom = ({
  channelId,
  channelName,
  serverName,
  className
}: VoiceRoomProps) => {
  const {
    isConnected,
    connectionQuality,
    latency,
    bitrate,
    connect,
    disconnect,
  } = useVoiceConnection(channelId);

  const {
    participants,
    updateVolume,
  } = useVoiceParticipants(channelId);

  // Otomatik bağlan
  useEffect(() => {
    if (channelId && !isConnected) {
      connect();
    }

    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [channelId]);

  return (
    <div className={cn("relative h-full flex flex-col", className)}>
      {/* Status Bar */}
      <VoiceStatusBar
        channelName={channelName}
        serverName={serverName}
        connectionQuality={connectionQuality}
        latency={latency}
        bitrate={bitrate}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden pt-16 pb-24">
        <div className="h-full flex flex-col">
          {/* Participants Header */}
          <div className="px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-zinc-400" />
              <h3 className="text-lg font-semibold text-zinc-100">
                Katılımcılar
              </h3>
              <span className="text-sm text-zinc-400">
                ({participants.length})
              </span>
            </div>
          </div>

          {/* Participants List */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-3">
              {participants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-zinc-600 mb-4" />
                  <p className="text-zinc-400">
                    Henüz kimse ses kanalında değil
                  </p>
                </div>
              ) : (
                participants.map((participant) => (
                  <VoiceParticipantCard
                    key={participant.id}
                    name={participant.name}
                    avatar={participant.avatar}
                    isMuted={participant.isMuted}
                    isDeafened={participant.isDeafened}
                    isSpeaking={participant.isSpeaking}
                    volume={participant.volume}
                    role={participant.role}
                    onVolumeChange={(volume) => updateVolume(participant.id, volume)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Control Panel */}
      <VoiceControlPanel
        isConnected={isConnected}
        onDisconnect={disconnect}
      />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
};
