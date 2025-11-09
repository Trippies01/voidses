"use client";

import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { Wifi, WifiOff } from "lucide-react";

interface QualityStats {
  ping: number;
  packetLoss: number;
  bitrate: number;
  quality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export const ConnectionQuality = () => {
  const room = useRoomContext();
  const [stats, setStats] = useState<QualityStats>({
    ping: 0,
    packetLoss: 0,
    bitrate: 0,
    quality: 'disconnected',
  });

  useEffect(() => {
    if (!room) return;

    const updateStats = async () => {
      try {
        const localParticipant = room.localParticipant;
        
        // RTT (Round Trip Time) - Ping
        // @ts-ignore - LiveKit internal API
        const rtt = room.engine?.client?.currentRTT || 0;
        
        // Packet loss ve bitrate hesapla
        let totalPacketLoss = 0;
        let totalBitrate = 0;
        let trackCount = 0;

        localParticipant.audioTrackPublications.forEach((pub) => {
          if (pub.track) {
            // @ts-ignore - LiveKit internal API
            const stats = pub.track.getStats?.();
            if (stats) {
              totalPacketLoss += stats.packetLoss || 0;
              totalBitrate += stats.bitrate || 0;
              trackCount++;
            }
          }
        });

        const avgPacketLoss = trackCount > 0 ? totalPacketLoss / trackCount : 0;
        const avgBitrate = trackCount > 0 ? totalBitrate / trackCount : 0;

        // Kalite hesapla
        let quality: QualityStats['quality'] = 'excellent';
        if (rtt > 200 || avgPacketLoss > 5) {
          quality = 'poor';
        } else if (rtt > 100 || avgPacketLoss > 2) {
          quality = 'good';
        }

        setStats({
          ping: Math.round(rtt),
          packetLoss: Math.round(avgPacketLoss * 10) / 10,
          bitrate: Math.round(avgBitrate / 1000), // kbps
          quality,
        });
      } catch (error) {
        console.error('Stats error:', error);
      }
    };

    // Her 2 saniyede bir güncelle
    const interval = setInterval(updateStats, 2000);
    updateStats();

    return () => clearInterval(interval);
  }, [room]);

  const getQualityColor = () => {
    switch (stats.quality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  const getQualityText = () => {
    switch (stats.quality) {
      case 'excellent': return 'Mükemmel';
      case 'good': return 'İyi';
      case 'poor': return 'Zayıf';
      default: return 'Bağlantı Yok';
    }
  };

  if (!room) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-md border border-zinc-700/50 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-4">
          {/* Kalite İkonu - Animasyonlu */}
          <div className={`relative ${getQualityColor()}`}>
            {stats.quality === 'disconnected' ? (
              <WifiOff className="w-6 h-6" />
            ) : (
              <>
                <Wifi className="w-6 h-6" />
                {stats.quality === 'excellent' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </>
            )}
          </div>

          {/* İstatistikler */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${getQualityColor()}`}>
                {getQualityText()}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 h-3 rounded-full transition-all ${
                      stats.quality === 'excellent' ? 'bg-green-500' :
                      stats.quality === 'good' && bar <= 2 ? 'bg-yellow-500' :
                      stats.quality === 'poor' && bar === 1 ? 'bg-red-500' :
                      'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs text-zinc-300 font-medium">{stats.ping}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs text-zinc-300 font-medium">{stats.packetLoss}%</span>
              </div>
              {stats.bitrate > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-zinc-300 font-medium">{stats.bitrate}kbps</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
