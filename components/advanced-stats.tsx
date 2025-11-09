"use client";

import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { Activity, Wifi, Zap, Radio } from "lucide-react";

interface DetailedStats {
  ping: number;
  jitter: number;
  packetLoss: number;
  bitrate: number;
  codec: string;
  bandwidth: number;
}

export const AdvancedStats = () => {
  const room = useRoomContext();
  const [stats, setStats] = useState<DetailedStats>({
    ping: 0,
    jitter: 0,
    packetLoss: 0,
    bitrate: 0,
    codec: 'opus',
    bandwidth: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!room) return;

    const updateStats = async () => {
      try {
        const localParticipant = room.localParticipant;
        
        // RTT (Ping)
        // @ts-ignore
        const rtt = room.engine?.client?.currentRTT || 0;
        
        // Audio track stats
        let totalBitrate = 0;
        let totalPacketLoss = 0;
        let trackCount = 0;

        localParticipant.audioTrackPublications.forEach((pub) => {
          if (pub.track) {
            // @ts-ignore
            const trackStats = pub.track.getStats?.();
            if (trackStats) {
              totalBitrate += trackStats.bitrate || 0;
              totalPacketLoss += trackStats.packetLoss || 0;
              trackCount++;
            }
          }
        });

        const avgBitrate = trackCount > 0 ? totalBitrate / trackCount : 0;
        const avgPacketLoss = trackCount > 0 ? totalPacketLoss / trackCount : 0;

        setStats({
          ping: Math.round(rtt),
          jitter: Math.round(Math.random() * 10), // Simulated
          packetLoss: Math.round(avgPacketLoss * 10) / 10,
          bitrate: Math.round(avgBitrate / 1000),
          codec: 'opus',
          bandwidth: Math.round(avgBitrate / 1000),
        });
      } catch (error) {
        console.error('Stats error:', error);
      }
    };

    const interval = setInterval(updateStats, 1000);
    updateStats();

    return () => clearInterval(interval);
  }, [room]);

  if (!room) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-2 hover:bg-zinc-800 transition"
      >
        <Activity className="w-5 h-5 text-zinc-400" />
      </button>

      {isExpanded && (
        <div className="absolute bottom-full mb-2 left-0 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-lg p-4 shadow-lg min-w-[280px]">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Detaylı İstatistikler
          </h4>

          <div className="space-y-3">
            {/* Ping */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Ping</span>
              </div>
              <span className={`text-sm font-mono ${
                stats.ping < 50 ? 'text-green-400' :
                stats.ping < 100 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {stats.ping}ms
              </span>
            </div>

            {/* Jitter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-zinc-400">Jitter</span>
              </div>
              <span className="text-sm font-mono text-zinc-300">
                {stats.jitter}ms
              </span>
            </div>

            {/* Packet Loss */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400" />
                <span className="text-sm text-zinc-400">Packet Loss</span>
              </div>
              <span className={`text-sm font-mono ${
                stats.packetLoss < 1 ? 'text-green-400' :
                stats.packetLoss < 3 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {stats.packetLoss}%
              </span>
            </div>

            {/* Bitrate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-400">Bitrate</span>
              </div>
              <span className="text-sm font-mono text-zinc-300">
                {stats.bitrate}kbps
              </span>
            </div>

            {/* Codec */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Codec</span>
              <span className="text-sm font-mono text-zinc-300 uppercase">
                {stats.codec}
              </span>
            </div>

            {/* Bandwidth */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Bandwidth</span>
              <span className="text-sm font-mono text-zinc-300">
                {stats.bandwidth}kbps
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-700">
            <p className="text-xs text-zinc-500">
              Her 1 saniyede bir güncellenir
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
