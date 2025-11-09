"use client";

import { useState, useEffect, useCallback } from "react";
import { useVoiceSettings } from "./use-voice-settings";

export type ConnectionQuality = "excellent" | "good" | "poor" | "disconnected";

interface VoiceConnectionState {
  isConnected: boolean;
  connectionQuality: ConnectionQuality;
  latency: number;
  bitrate: number;
  packetsLost: number;
  jitter: number;
}

export const useVoiceConnection = (channelId?: string) => {
  const { settings } = useVoiceSettings();
  const [state, setState] = useState<VoiceConnectionState>({
    isConnected: false,
    connectionQuality: "disconnected",
    latency: 0,
    bitrate: 0,
    packetsLost: 0,
    jitter: 0,
  });

  // Bağlantı kalitesini hesapla
  const calculateQuality = useCallback((latency: number, packetsLost: number): ConnectionQuality => {
    if (!state.isConnected) return "disconnected";
    
    if (latency < 50 && packetsLost < 1) return "excellent";
    if (latency < 100 && packetsLost < 3) return "good";
    if (latency < 200 && packetsLost < 5) return "poor";
    
    return "poor";
  }, [state.isConnected]);

  // Bağlan
  const connect = useCallback(async () => {
    if (!channelId) return;

    try {
      // Simüle edilmiş bağlantı
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionQuality: "good",
        latency: Math.floor(Math.random() * 50) + 20,
        bitrate: settings.bitrate || 64,
      }));
    } catch (error) {
      console.error("Voice connection error:", error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionQuality: "disconnected",
      }));
    }
  }, [channelId, settings.bitrate]);

  // Bağlantıyı kes
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      connectionQuality: "disconnected",
      latency: 0,
      bitrate: 0,
      packetsLost: 0,
      jitter: 0,
    });
  }, []);

  // İstatistikleri güncelle
  useEffect(() => {
    if (!state.isConnected) return;

    const interval = setInterval(() => {
      setState(prev => {
        const newLatency = Math.max(10, prev.latency + (Math.random() - 0.5) * 10);
        const newPacketsLost = Math.max(0, prev.packetsLost + (Math.random() - 0.7));
        const newJitter = Math.max(0, Math.random() * 5);

        return {
          ...prev,
          latency: Math.floor(newLatency),
          packetsLost: Math.floor(newPacketsLost),
          jitter: Math.floor(newJitter),
          connectionQuality: calculateQuality(newLatency, newPacketsLost),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [state.isConnected, calculateQuality]);

  return {
    ...state,
    connect,
    disconnect,
  };
};
