"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Headphones, Volume2, VolumeX, Video, VideoOff, MonitorUp, Settings, Users, Activity, Sparkles, Phone, Maximize2, Minimize2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  LiveKitRoom, 
  RoomAudioRenderer,
  useRoomContext,
  useTracks,
  useParticipants,
  useLocalParticipant,
  VideoTrack,
  TrackToggle,
} from "@livekit/components-react";
import { Track, Participant as LiveKitParticipant } from "livekit-client";
import "@livekit/components-styles";
import axios from "axios";
import { useKeyboardShortcutsVoice } from "@/hooks/use-keyboard-shortcuts-voice";
import { VoiceToast, useVoiceToasts } from "@/components/voice/voice-toast";
import { useVoiceSounds } from "@/hooks/use-voice-sounds";
import { ParticipantContextMenu } from "@/components/voice/participant-context-menu";
import { PingIndicator } from "@/components/voice/ping-indicator";

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  volume: number;
}

// Video component for participant with zoom controls
const ParticipantVideo = ({ 
  participant,
  isExpanded,
  onToggleExpand,
}: { 
  participant: LiveKitParticipant;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  const videoPublication = participant.getTrackPublication(Track.Source.Camera);
  const screenPublication = participant.getTrackPublication(Track.Source.ScreenShare);
  
  // Prioritize screen share over camera
  const publicationToShow = screenPublication || videoPublication;
  
  if (!publicationToShow || !publicationToShow.track) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
        <Video className="h-16 w-16 text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <VideoTrack
        trackRef={{
          participant: participant,
          publication: publicationToShow,
          source: publicationToShow.source,
        }}
        className="w-full h-full object-cover"
      />
      
      {/* Zoom Control Button */}
      <button
        onClick={onToggleExpand}
        className={cn(
          "absolute top-3 right-3 z-20",
          "h-10 w-10 rounded-xl transition-all duration-300",
          "bg-zinc-900/80 backdrop-blur-md border border-white/10",
          "flex items-center justify-center",
          "opacity-0 group-hover:opacity-100",
          "hover:bg-zinc-800/90 hover:scale-110"
        )}
      >
        {isExpanded ? (
          <Minimize2 className="h-5 w-5 text-white" />
        ) : (
          <Maximize2 className="h-5 w-5 text-white" />
        )}
      </button>
    </div>
  );
};

interface ModernVoiceChannelProps {
  channelId: string;
  channelName: string;
  serverName: string;
  serverId: string;
  memberId?: string;
  memberRole?: string;
}

export const ModernVoiceChannel = ({
  channelId,
  channelName,
  serverName,
  serverId,
  memberId,
  memberRole = "GUEST",
}: ModernVoiceChannelProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [token, setToken] = useState("");

  // Handle page close/refresh - leave voice channel
  useEffect(() => {
    if (!memberId) return;

    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable cleanup on page close
      const data = JSON.stringify({
        currentChannelId: null,
        isMuted: false,
        isDeafened: false,
      });
      
      navigator.sendBeacon(
        `/api/members/${memberId}/voice-state`,
        new Blob([data], { type: 'application/json' })
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [memberId]);

  // Join voice channel on mount
  useEffect(() => {
    if (!memberId || !channelId) return;
    
    const joinVoiceChannel = async () => {
      try {
        await axios.patch(`/api/members/${memberId}/voice-state`, {
          currentChannelId: channelId,
          isMuted: false,
          isDeafened: false,
        });
        router.refresh();
      } catch (error) {
        console.error("Join error:", error);
      }
    };

    joinVoiceChannel();
    
    // Check if kicked - poll voice state
    const checkKicked = setInterval(async () => {
      try {
        const response = await axios.get(`/api/members/${memberId}/voice-state`);
        const voiceState = response.data;
        
        // If currentChannelId is null but we're still in the channel, we were kicked
        if (voiceState.currentChannelId === null) {
          clearInterval(checkKicked);
          handleDisconnect();
        }
      } catch (error) {
        // Ignore errors - user might have left normally
      }
    }, 2000); // Check every 2 seconds
    
    return () => {
      clearInterval(checkKicked);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, channelId]);

  // Get LiveKit token
  useEffect(() => {
    if (!user?.firstName || !user?.lastName || !channelId) return;

    const name = `${user.firstName} ${user.lastName}`;

    const fetchToken = async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${channelId}&username=${encodeURIComponent(name)}&memberId=${memberId || ""}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error("Failed to fetch LiveKit token:", e);
      }
    };

    fetchToken();
  }, [user?.firstName, user?.lastName, channelId, memberId]);

  const handleDisconnect = async () => {
    try {
      // Navigate first for instant feedback
      router.push(`/servers/${serverId}`);
      
      // Update voice state in background
      if (memberId) {
        await axios.patch(`/api/members/${memberId}/voice-state`, {
          currentChannelId: null,
          isMuted: false,
          isDeafened: false,
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  if (token === "") {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-zinc-400">Bağlantı kuruluyor...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={false}
      audio={{
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 1,
      }}
      options={{
        publishDefaults: {
          audioPreset: {
            maxBitrate: 64000,
          },
          dtx: true,
          red: true,
        },
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      }}
      onDisconnected={handleDisconnect}
    >
      <VoiceChannelContent
        channelName={channelName}
        serverName={serverName}
        serverId={serverId}
        memberRole={memberRole}
        onDisconnect={handleDisconnect}
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

// Separate component for room content
const VoiceChannelContent = ({
  channelName,
  serverName,
  serverId,
  memberRole,
  onDisconnect,
}: {
  channelName: string;
  serverName: string;
  serverId: string;
  memberRole: string;
  onDisconnect: () => void;
}) => {
  const router = useRouter();
  const room = useRoomContext();
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "poor">("good");
  const [latency, setLatency] = useState(45);
  
  // New features
  const { toasts, addToast, removeToast } = useVoiceToasts();
  const { playJoinSound, playLeaveSound, playMuteSound, playUnmuteSound } = useVoiceSounds();
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    position: { x: number; y: number };
    participant: any;
  } | null>(null);
  const [prevParticipantIds, setPrevParticipantIds] = useState<string[]>([]);
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);

  // Toggle functions
  const toggleMicrophone = async () => {
    if (localParticipant) {
      const willBeMuted = localParticipant.isMicrophoneEnabled;
      await localParticipant.setMicrophoneEnabled(!willBeMuted);
      
      // Play sound and show toast
      if (willBeMuted) {
        playMuteSound();
        addToast("mute", "Mikrofon kapatıldı");
      } else {
        playUnmuteSound();
        addToast("unmute", "Mikrofon açıldı");
      }
    }
  };

  const toggleCamera = async () => {
    if (localParticipant) {
      const willBeOff = localParticipant.isCameraEnabled;
      await localParticipant.setCameraEnabled(!willBeOff);
      
      // Show toast
      if (willBeOff) {
        addToast("video-off", "Kamera kapatıldı");
      } else {
        addToast("video-on", "Kamera açıldı");
      }
    }
  };

  const toggleScreenShare = async () => {
    if (localParticipant) {
      const willBeOff = localParticipant.isScreenShareEnabled;
      await localParticipant.setScreenShareEnabled(!willBeOff);
      
      // Show toast
      if (!willBeOff) {
        addToast("screen-share", "Ekran paylaşımı başladı");
      }
    }
  };

  const toggleDeafen = async () => {
    if (room) {
      const isCurrentlyDeafened = !room.localParticipant.isMicrophoneEnabled;
      await room.localParticipant.setMicrophoneEnabled(isCurrentlyDeafened);
      
      // Play sound
      if (!isCurrentlyDeafened) {
        playMuteSound();
      } else {
        playUnmuteSound();
      }
    }
  };

  const getQualityColor = () => {
    switch (connectionQuality) {
      case "excellent": return "text-green-400";
      case "good": return "text-blue-400";
      case "poor": return "text-yellow-400";
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcutsVoice({
    onMuteToggle: toggleMicrophone,
    onDeafenToggle: toggleDeafen,
    onVideoToggle: toggleCamera,
    onScreenShareToggle: toggleScreenShare,
    onDisconnect: onDisconnect,
    enabled: true,
  });

  // Track participant changes for join/leave notifications
  useEffect(() => {
    // Skip on initial mount
    if (prevParticipantIds.length === 0 && participants.length > 0) {
      setPrevParticipantIds(participants.map(p => p.identity));
      return;
    }

    const currentIds = participants.map(p => p.identity);
    
    // Check for new participants (joined)
    currentIds.forEach(id => {
      if (!prevParticipantIds.includes(id)) {
        const participant = participants.find(p => p.identity === id);
        if (participant && participant.identity !== localParticipant?.identity) {
          addToast("join", "Kanala katıldı", participant.name || "Kullanıcı");
          playJoinSound();
        }
      }
    });
    
    // Check for left participants
    prevParticipantIds.forEach(prevId => {
      if (!currentIds.includes(prevId) && prevId !== localParticipant?.identity) {
        addToast("leave", "Kanaldan ayrıldı", "Kullanıcı");
        playLeaveSound();
      }
    });
    
    setPrevParticipantIds(currentIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants.length]); // Only track when participant count changes

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden"
      onContextMenu={(e) => {
        // Always prevent default browser context menu
        e.preventDefault();
        return false;
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 border-b border-white/5 backdrop-blur-xl bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-zinc-900 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{channelName}</h2>
                <p className="text-xs text-zinc-400">{serverName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection Quality */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/10">
              <Activity className={cn("h-4 w-4", getQualityColor())} />
              <span className={cn("text-xs font-medium", getQualityColor())}>
                {latency}ms
              </span>
            </div>

            {/* Participants Count */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/10">
              <Users className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-300">
                {participants.length}
              </span>
            </div>

            {/* Ping Indicator */}
            <PingIndicator />

            {/* Fullscreen Toggle */}
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-white/10"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 text-zinc-400" />
              ) : (
                <Maximize2 className="h-4 w-4 text-zinc-400" />
              )}
            </Button>

            {/* Settings */}
            <Button
              onClick={() => router.push("/settings/voice")}
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-white/10"
            >
              <Settings className="h-4 w-4 text-zinc-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <div className="h-full flex items-center justify-center p-8">
          {/* Participants Grid */}
          <div className="w-full max-w-6xl">
            <div className={cn(
              "grid gap-6 transition-all duration-500",
              expandedParticipant 
                ? "grid-cols-1" 
                : participants.length === 1
                ? "grid-cols-1 justify-items-center"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}>
              {participants.map((participant) => {
                const isSpeaking = participant.isSpeaking;
                const isMuted = participant.isMicrophoneEnabled === false;
                const isLocal = participant.identity === localParticipant?.identity;
                const hasVideo = participant.isCameraEnabled || participant.isScreenShareEnabled;
                const isExpanded = expandedParticipant === participant.identity;
                
                // Hide non-expanded participants when one is expanded
                if (expandedParticipant && !isExpanded) {
                  return null;
                }
                
                return (
                <div
                  key={participant.identity}
                  data-participant-card="true"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setContextMenu({
                      show: true,
                      position: { x: e.clientX, y: e.clientY },
                      participant: participant,
                    });
                  }}
                  className={cn(
                    "group relative rounded-3xl overflow-hidden transition-all duration-500",
                    "bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 backdrop-blur-xl",
                    "border border-white/10 hover:border-white/20",
                    "hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20",
                    isSpeaking && "ring-4 ring-green-500/50 border-green-500/30 scale-105",
                    hasVideo ? "p-0" : "p-8"
                  )}
                >
                  {/* Speaking Animation */}
                  {isSpeaking && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 animate-pulse pointer-events-none z-10" />
                  )}

                  {/* Video Track */}
                  {hasVideo ? (
                    <div className={cn(
                      "relative w-full transition-all duration-500",
                      isExpanded ? "aspect-video" : "aspect-video"
                    )}>
                      <ParticipantVideo 
                        participant={participant}
                        isExpanded={isExpanded}
                        onToggleExpand={() => {
                          setExpandedParticipant(isExpanded ? null : participant.identity);
                        }}
                      />
                      
                      {/* Video Overlay Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className={cn(
                              "font-bold text-white",
                              isExpanded ? "text-2xl" : "text-lg"
                            )}>
                              {participant.name || "Kullanıcı"}
                              {isLocal && " (Sen)"}
                            </h3>
                            {isSpeaking && (
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "bg-green-500 rounded-full animate-pulse",
                                      isExpanded ? "w-1.5" : "w-1"
                                    )}
                                    style={{
                                      height: isExpanded 
                                        ? `${Math.random() * 20 + 10}px`
                                        : `${Math.random() * 12 + 6}px`,
                                      animationDelay: `${i * 0.1}s`,
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Status Badge */}
                          <div className={cn(
                            "rounded-full flex items-center justify-center",
                            "border-2 border-white/20 transition-all duration-300",
                            isMuted ? "bg-red-500" : "bg-green-500",
                            isExpanded ? "h-12 w-12" : "h-8 w-8"
                          )}>
                            {isMuted ? (
                              <MicOff className={cn("text-white", isExpanded ? "h-6 w-6" : "h-4 w-4")} />
                            ) : (
                              <Mic className={cn("text-white", isExpanded ? "h-6 w-6" : "h-4 w-4")} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Avatar View (No Video) */
                    <div className="relative flex flex-col items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className={cn(
                          "h-32 w-32 border-4 transition-all duration-300",
                          isSpeaking 
                            ? "border-green-500 shadow-2xl shadow-green-500/50" 
                            : "border-zinc-700"
                        )}>
                          <AvatarImage src={undefined} />
                          <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            {participant.name?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>

                        {/* Status Badge */}
                        <div className={cn(
                          "absolute -bottom-2 -right-2 h-10 w-10 rounded-full flex items-center justify-center",
                          "border-4 border-zinc-900 transition-all duration-300",
                          isMuted ? "bg-red-500" : "bg-green-500"
                        )}>
                          {isMuted ? (
                            <MicOff className="h-5 w-5 text-white" />
                          ) : (
                            <Mic className="h-5 w-5 text-white" />
                          )}
                        </div>

                        {/* Speaking Indicator Rings */}
                        {isSpeaking && (
                          <>
                            <div className="absolute inset-0 rounded-full border-4 border-green-500/50 animate-ping" />
                            <div className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-pulse" />
                          </>
                        )}
                      </div>

                      {/* Name */}
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {participant.name || "Kullanıcı"}
                          {isLocal && " (Sen)"}
                        </h3>
                        {isSpeaking && (
                          <div className="flex items-center justify-center gap-1">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-green-500 rounded-full animate-pulse"
                                  style={{
                                    height: `${Math.random() * 16 + 8}px`,
                                    animationDelay: `${i * 0.1}s`,
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-green-400 ml-2">
                              Konuşuyor
                            </span>
                          </div>
                        )}
                        {isMuted && !isSpeaking && (
                          <span className="text-sm text-red-400">
                            Mikrofon kapalı
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
              })}
            </div>

            {/* Empty State */}
            {participants.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 flex items-center justify-center mb-6">
                  <Users className="h-16 w-16 text-zinc-600" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-400 mb-2">
                  Henüz kimse yok
                </h3>
                <p className="text-zinc-500">
                  İlk katılan sen ol!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="relative z-10 px-6 py-4 border-t border-white/5 backdrop-blur-xl bg-zinc-900/50">
        <div className="flex items-center justify-center gap-3">
            {/* Microphone */}
            <button
              onClick={toggleMicrophone}
              className={cn(
                "group relative h-14 w-14 rounded-2xl transition-all duration-300",
                "flex items-center justify-center",
                !localParticipant?.isMicrophoneEnabled
                  ? "bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50"
                  : "bg-zinc-800/50 hover:bg-zinc-700/50 border-2 border-zinc-700/50 hover:border-indigo-500/50"
              )}
            >
              {!localParticipant?.isMicrophoneEnabled ? (
                <MicOff className="h-6 w-6 text-red-400" />
              ) : (
                <Mic className="h-6 w-6 text-zinc-100" />
              )}
              {localParticipant?.isMicrophoneEnabled && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Headphones/Deafen */}
            <button
              onClick={toggleDeafen}
              className={cn(
                "h-14 w-14 rounded-2xl transition-all duration-300",
                "flex items-center justify-center",
                !localParticipant?.isMicrophoneEnabled
                  ? "bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50"
                  : "bg-zinc-800/50 hover:bg-zinc-700/50 border-2 border-zinc-700/50 hover:border-indigo-500/50"
              )}
            >
              {!localParticipant?.isMicrophoneEnabled ? (
                <VolumeX className="h-6 w-6 text-red-400" />
              ) : (
                <Headphones className="h-6 w-6 text-zinc-100" />
              )}
            </button>

          {/* Video */}
            <button
              onClick={toggleCamera}
              className={cn(
                "h-14 w-14 rounded-2xl transition-all duration-300",
                "flex items-center justify-center",
                localParticipant?.isCameraEnabled
                  ? "bg-indigo-500/20 hover:bg-indigo-500/30 border-2 border-indigo-500/50"
                  : "bg-zinc-800/50 hover:bg-zinc-700/50 border-2 border-zinc-700/50 hover:border-indigo-500/50"
              )}
            >
              {localParticipant?.isCameraEnabled ? (
                <Video className="h-6 w-6 text-indigo-400" />
              ) : (
                <VideoOff className="h-6 w-6 text-zinc-100" />
              )}
            </button>

            {/* Screen Share */}
            <button
              onClick={toggleScreenShare}
              className={cn(
                "h-14 w-14 rounded-2xl transition-all duration-300",
                "flex items-center justify-center",
                localParticipant?.isScreenShareEnabled
                  ? "bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50"
                  : "bg-zinc-800/50 hover:bg-zinc-700/50 border-2 border-zinc-700/50 hover:border-green-500/50"
              )}
            >
              <MonitorUp className="h-6 w-6 text-zinc-100" />
            </button>

          {/* Disconnect */}
            <button
              onClick={onDisconnect}
              className="h-14 px-6 rounded-2xl transition-all duration-300 flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 group"
            >
              <Phone className="h-5 w-5 text-red-400 rotate-[135deg] group-hover:animate-bounce" />
              <span className="text-sm font-medium text-red-400">
                Ayrıl
              </span>
            </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <VoiceToast toasts={toasts} onRemove={removeToast} />

      {/* Context Menu */}
      {contextMenu?.show && (
        <ParticipantContextMenu
          participantName={contextMenu.participant.name || "Kullanıcı"}
          participantId={contextMenu.participant.identity}
          isLocal={contextMenu.participant.identity === localParticipant?.identity}
          isMuted={contextMenu.participant.isMicrophoneEnabled === false}
          volume={100}
          isAdmin={memberRole === "ADMIN" || memberRole === "MODERATOR"}
          onVolumeChange={(volume) => {
            // TODO: Implement actual volume change via LiveKit
            addToast("unmute", `Ses seviyesi ${volume}% olarak ayarlandı`, contextMenu.participant.name);
          }}
          onMute={() => {
            // TODO: Implement actual mute via LiveKit
            addToast("mute", "Kullanıcı susturuldu", contextMenu.participant.name);
          }}
          onMessage={() => {
            // Navigate to DM
            router.push(`/conversations/${contextMenu.participant.identity}`);
          }}
          onCall={() => {
            // TODO: Implement voice call
            addToast("join", "Arama başlatılıyor...", contextMenu.participant.name);
          }}
          onViewProfile={() => {
            // TODO: Open profile modal
            addToast("unmute", "Profil görüntüleniyor", contextMenu.participant.name);
          }}
          onKick={async () => {
            try {
              // Get member ID from participant metadata
              const targetMemberId = contextMenu.participant.metadata;
              
              if (!targetMemberId || targetMemberId === "") {
                console.warn("⚠️ Member ID not found in participant metadata");
                addToast("leave", "Kullanıcı bilgisi bulunamadı - Sadece sidebar'dan atabilirsiniz");
                return;
              }

              // Call kick API
              const response = await axios.post(`/api/members/${targetMemberId}/kick`, {
                channelId: room.name,
                serverId: serverId,
              });

              if (response.data.success) {
                addToast("leave", "Kanaldan atıldı", contextMenu.participant.name);
                playLeaveSound();
              }
            } catch (error: any) {
              console.error("❌ Kick error:", error);
              const errorMsg = error.response?.data || "Kullanıcı atılamadı - Yetkiniz olmayabilir";
              addToast("leave", errorMsg);
            }
          }}
          onBlock={() => {
            // TODO: Implement block
            addToast("leave", "Kullanıcı engellendi", contextMenu.participant.name);
          }}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
