"use client";

import { useState } from "react";
import { Activity, Wifi, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VoiceStatsOverlayProps {
  latency: number;
  bitrate: number;
  packetsLost: number;
  jitter: number;
  fps?: number;
  resolution?: string;
  className?: string;
}

export const VoiceStatsOverlay = ({
  latency,
  bitrate,
  packetsLost,
  jitter,
  fps = 0,
  resolution = "",
  className
}: VoiceStatsOverlayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLatencyColor = () => {
    if (latency < 50) return "text-green-400";
    if (latency < 100) return "text-yellow-400";
    return "text-red-400";
  };

  const getLatencyTrend = () => {
    if (latency < 50) return <TrendingDown className="h-3 w-3" />;
    if (latency < 100) return <Minus className="h-3 w-3" />;
    return <TrendingUp className="h-3 w-3" />;
  };

  const getPacketLossColor = () => {
    if (packetsLost < 1) return "text-green-400";
    if (packetsLost < 3) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className={cn("fixed top-20 right-4 z-40", className)}>
      <Card className={cn(
        "bg-zinc-900/95 backdrop-blur-xl border-white/10",
        "transition-all duration-300",
        isExpanded ? "w-64" : "w-12"
      )}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Activity className="h-4 w-4 text-zinc-400" />
        </button>

        {/* Stats Content */}
        {isExpanded && (
          <div className="p-4 pt-0 space-y-3 border-t border-white/5">
            {/* Latency */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">Gecikme</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-medium", getLatencyColor())}>
                  {latency}ms
                </span>
                <div className={getLatencyColor()}>
                  {getLatencyTrend()}
                </div>
              </div>
            </div>

            {/* Bitrate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">Bitrate</span>
              </div>
              <span className="text-sm font-medium text-blue-400">
                {bitrate} kbps
              </span>
            </div>

            {/* Packet Loss */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">Paket Kaybı</span>
              </div>
              <span className={cn("text-sm font-medium", getPacketLossColor())}>
                {packetsLost.toFixed(1)}%
              </span>
            </div>

            {/* Jitter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">Jitter</span>
              </div>
              <span className="text-sm font-medium text-zinc-300">
                {jitter}ms
              </span>
            </div>

            {/* Video Stats (if available) */}
            {fps > 0 && (
              <>
                <div className="h-px bg-white/5 my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">FPS</span>
                  <span className="text-sm font-medium text-zinc-300">
                    {fps}
                  </span>
                </div>
                {resolution && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Çözünürlük</span>
                    <span className="text-sm font-medium text-zinc-300">
                      {resolution}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
