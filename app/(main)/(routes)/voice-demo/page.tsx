"use client";

import { useState, useEffect } from "react";
import { VoiceRoom } from "@/components/voice/voice-room";
import { PushToTalkIndicator } from "@/components/voice/push-to-talk-indicator";
import { NoiseSuppressionIndicator } from "@/components/voice/noise-suppression-indicator";
import { VoiceStatsOverlay } from "@/components/voice/voice-stats-overlay";
import { useVoiceSettings } from "@/hooks/use-voice-settings";
import { useVoiceConnection } from "@/hooks/use-voice-connection";
import { useVoiceParticipants } from "@/hooks/use-voice-participants";

export default function VoiceDemoPage() {
  const { settings } = useVoiceSettings();
  const { latency, bitrate, packetsLost, jitter } = useVoiceConnection("demo-channel");
  const { addParticipant } = useVoiceParticipants("demo-channel");
  const [isPTTActive, setIsPTTActive] = useState(false);

  // Demo katılımcılar ekle
  useEffect(() => {
    const demoParticipants = [
      {
        id: "1",
        name: "Tyrone Celep",
        avatar: undefined,
        isMuted: false,
        isDeafened: false,
        isSpeaking: false,
        volume: 100,
        role: "admin" as const,
      },
      {
        id: "2",
        name: "elma TR",
        avatar: undefined,
        isMuted: false,
        isDeafened: false,
        isSpeaking: true,
        volume: 100,
        role: "moderator" as const,
      },
      {
        id: "3",
        name: "Trippies",
        avatar: undefined,
        isMuted: true,
        isDeafened: false,
        isSpeaking: false,
        volume: 100,
        role: "member" as const,
      },
    ];

    demoParticipants.forEach(participant => {
      addParticipant(participant);
    });
  }, [addParticipant]);

  // Push-to-Talk simülasyonu
  useEffect(() => {
    if (!settings.pushToTalk) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === settings.pushToTalkKey) {
        setIsPTTActive(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === settings.pushToTalkKey) {
        setIsPTTActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [settings.pushToTalk, settings.pushToTalkKey]);

  return (
    <div className="relative h-screen">
      <VoiceRoom
        channelId="demo-channel"
        channelName="Genel Ses"
        serverName="Demo Sunucu"
      />

      {/* Push-to-Talk Indicator */}
      {settings.pushToTalk && (
        <PushToTalkIndicator
          isActive={isPTTActive}
          keybind={settings.pushToTalkKey === ' ' ? 'Space' : settings.pushToTalkKey}
        />
      )}

      {/* Noise Suppression Indicator */}
      <div className="fixed top-20 left-4 z-40">
        <NoiseSuppressionIndicator
          isEnabled={settings.krispEnabled || settings.noiseSuppression}
          isActive={settings.krispEnabled || settings.noiseSuppression}
          type={settings.krispEnabled ? "krisp" : "standard"}
        />
      </div>

      {/* Stats Overlay */}
      <VoiceStatsOverlay
        latency={latency}
        bitrate={bitrate}
        packetsLost={packetsLost}
        jitter={jitter}
      />
    </div>
  );
}
