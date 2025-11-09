"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Headphones, Settings, Volume2, VolumeX, Video, VideoOff, MonitorUp, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useVoiceSettings } from "@/hooks/use-voice-settings";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VoiceControlPanelProps {
  onDisconnect?: () => void;
  isConnected?: boolean;
  className?: string;
}

export const VoiceControlPanel = ({ 
  onDisconnect, 
  isConnected = false,
  className 
}: VoiceControlPanelProps) => {
  const { settings, updateSettings } = useVoiceSettings();
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // Deafened olduğunda otomatik mute
  useEffect(() => {
    if (isDeafened && !isMuted) {
      setIsMuted(true);
    }
  }, [isDeafened, isMuted]);

  const handleMuteToggle = () => {
    if (isDeafened) return; // Deafened iken mute açılamaz
    setIsMuted(!isMuted);
  };

  const handleDeafenToggle = () => {
    setIsDeafened(!isDeafened);
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleScreenShareToggle = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleVolumeChange = (value: number[]) => {
    updateSettings({ outputVolume: value[0] });
  };

  if (!isConnected) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-gradient-to-r from-zinc-900/95 via-zinc-800/95 to-zinc-900/95",
      "backdrop-blur-xl border-t border-white/10",
      "shadow-2xl shadow-black/50",
      className
    )}>
      {/* Üst Glow Efekti */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Sol: Ses Kontrolleri */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {/* Mikrofon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleMuteToggle}
                    disabled={isDeafened}
                    size="lg"
                    className={cn(
                      "relative group h-12 w-12 rounded-xl transition-all duration-300",
                      isMuted 
                        ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/50" 
                        : "bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-100 border-2 border-zinc-600/50",
                      isDeafened && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isMuted ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                    {!isMuted && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isMuted ? "Mikrofonu Aç" : "Mikrofonu Kapat"}</p>
                </TooltipContent>
              </Tooltip>

              {/* Kulaklık/Deafen */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDeafenToggle}
                    size="lg"
                    className={cn(
                      "relative h-12 w-12 rounded-xl transition-all duration-300",
                      isDeafened 
                        ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/50" 
                        : "bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-100 border-2 border-zinc-600/50"
                    )}
                  >
                    {isDeafened ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Headphones className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDeafened ? "Sesi Aç" : "Sesi Kapat"}</p>
                </TooltipContent>
              </Tooltip>

              {/* Ses Seviyesi */}
              <div className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setShowVolumeControl(!showVolumeControl)}
                      size="lg"
                      className="h-12 w-12 rounded-xl bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-100 border-2 border-zinc-600/50 transition-all duration-300"
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ses Seviyesi</p>
                  </TooltipContent>
                </Tooltip>

                {showVolumeControl && (
                  <div className="absolute bottom-full left-0 mb-2 p-4 bg-zinc-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <Volume2 className="h-4 w-4 text-zinc-400" />
                      <Slider
                        value={[settings.outputVolume || 100]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-zinc-400 min-w-[3ch]">
                        {settings.outputVolume || 100}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </TooltipProvider>
          </div>

          {/* Orta: Video Kontrolleri */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {/* Video */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleVideoToggle}
                    size="lg"
                    className={cn(
                      "h-12 w-12 rounded-xl transition-all duration-300",
                      isVideoOn 
                        ? "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border-2 border-indigo-500/50" 
                        : "bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-100 border-2 border-zinc-600/50"
                    )}
                  >
                    {isVideoOn ? (
                      <Video className="h-5 w-5" />
                    ) : (
                      <VideoOff className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isVideoOn ? "Kamerayı Kapat" : "Kamerayı Aç"}</p>
                </TooltipContent>
              </Tooltip>

              {/* Ekran Paylaşımı */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleScreenShareToggle}
                    size="lg"
                    className={cn(
                      "h-12 w-12 rounded-xl transition-all duration-300",
                      isScreenSharing 
                        ? "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50" 
                        : "bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-100 border-2 border-zinc-600/50"
                    )}
                  >
                    <MonitorUp className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isScreenSharing ? "Paylaşımı Durdur" : "Ekran Paylaş"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Sağ: Ayarlar ve Bağlantı Kes */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {/* Ayarlar */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="lg"
                    className="h-12 w-12 rounded-xl bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-100 border-2 border-zinc-600/50 transition-all duration-300"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ses Ayarları</p>
                </TooltipContent>
              </Tooltip>

              {/* Bağlantıyı Kes */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onDisconnect}
                    size="lg"
                    className="h-12 w-12 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/50 transition-all duration-300"
                  >
                    <Phone className="h-5 w-5 rotate-[135deg]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bağlantıyı Kes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
