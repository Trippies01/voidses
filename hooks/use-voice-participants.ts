"use client";

import { useState, useEffect, useCallback } from "react";

export interface VoiceParticipant {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  volume: number;
  role: "admin" | "moderator" | "member";
}

export const useVoiceParticipants = (channelId?: string) => {
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [speakingParticipants, setSpeakingParticipants] = useState<Set<string>>(new Set());

  // Katılımcı ekle
  const addParticipant = useCallback((participant: VoiceParticipant) => {
    setParticipants(prev => {
      if (prev.find(p => p.id === participant.id)) {
        return prev;
      }
      return [...prev, participant];
    });
  }, []);

  // Katılımcı çıkar
  const removeParticipant = useCallback((participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    setSpeakingParticipants(prev => {
      const newSet = new Set(prev);
      newSet.delete(participantId);
      return newSet;
    });
  }, []);

  // Katılımcı güncelle
  const updateParticipant = useCallback((participantId: string, updates: Partial<VoiceParticipant>) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, ...updates } : p
    ));
  }, []);

  // Ses seviyesi güncelle
  const updateVolume = useCallback((participantId: string, volume: number) => {
    updateParticipant(participantId, { volume });
  }, [updateParticipant]);

  // Konuşma durumunu güncelle
  const updateSpeaking = useCallback((participantId: string, isSpeaking: boolean) => {
    setSpeakingParticipants(prev => {
      const newSet = new Set(prev);
      if (isSpeaking) {
        newSet.add(participantId);
      } else {
        newSet.delete(participantId);
      }
      return newSet;
    });

    updateParticipant(participantId, { isSpeaking });
  }, [updateParticipant]);

  // Mute durumunu değiştir
  const toggleMute = useCallback((participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, isMuted: !p.isMuted } : p
    ));
  }, []);

  // Deafen durumunu değiştir
  const toggleDeafen = useCallback((participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { 
        ...p, 
        isDeafened: !p.isDeafened,
        isMuted: !p.isDeafened ? true : p.isMuted // Deafen olunca otomatik mute
      } : p
    ));
  }, []);

  // Tüm katılımcıları temizle
  const clearParticipants = useCallback(() => {
    setParticipants([]);
    setSpeakingParticipants(new Set());
  }, []);

  return {
    participants,
    speakingParticipants,
    addParticipant,
    removeParticipant,
    updateParticipant,
    updateVolume,
    updateSpeaking,
    toggleMute,
    toggleDeafen,
    clearParticipants,
  };
};
