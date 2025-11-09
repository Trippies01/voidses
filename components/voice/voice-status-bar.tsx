"use client";

import { useState, useEffect } from "react";
import { Signal, Wifi, WifiOff, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceStatusBarProps {
  channelName?: string;
  serverName?: string;
  connectionQuality?: "excellent" | "good" | "poor" | "disconnected";
  latency?: number;
  bitrate?: number;
  className?: string;
}

export const VoiceStatusBar = ({
  channelName = "Ses Kanalı",
  serverName = "Sunucu",
  connectionQuality = "good",
  latency = 0,
  bitrate = 0,
  className
}: VoiceStatusBarProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const getQualityColor = () => {
    switch (connectionQuality) {
      case "excellent":
        return "text-green-400";
      case "good":
        return "text-blue-400";
      case "poor":
        return "text-yellow-400";
      case "disconnected":
        return "text-red-400";
      default:
        return "text-zinc-400";
    }
  };

  const getQualityIcon = () => {
    switch (connectionQuality) {
      case "excellent":
      case "good":
        return <Wifi className="h-4 w-4" />;
      case "poor":
        return <Signal className="h-4 w-4" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getQualityText = () => {
    switch (connectionQuality) {
      case "excellent":
        return "Mükemmel";
      case "good":
        return "İyi";
      case "poor":
        return "Zayıf";
      case "disconnected":
        return "Bağlantı Kesildi";
      default:
        return "Bilinmiyor";
    }
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-40",
      "bg-gradient-to-b from-zinc-900/95 to-transparent",
      "backdrop-blur-md border-b border-white/5",
      className
    )}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          
          {/* Sol: Kanal Bilgisi */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-white/10">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-zinc-100">
                {serverName}
              </span>
              <span className="text-sm text-zinc-400">/</span>
              <span className="text-sm text-zinc-300">
                {channelName}
              </span>
            </div>
          </div>

          {/* Orta: Bağlantı Kalitesi */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
              "bg-zinc-800/50 border-white/10"
            )}>
              <div className={getQualityColor()}>
                {getQualityIcon()}
              </div>
              <span className={cn("text-sm font-medium", getQualityColor())}>
                {getQualityText()}
              </span>
            </div>

            {/* İstatistikler */}
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>{latency}ms</span>
              </div>
              <div className="h-3 w-px bg-zinc-700" />
              <div className="flex items-center gap-1">
                <Signal className="h-3 w-3" />
                <span>{bitrate}kbps</span>
              </div>
            </div>
          </div>

          {/* Sağ: Kapat Butonu */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <span className="text-xs">Gizle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
