import { useState, useEffect } from 'react';

export interface VoiceSettings {
  // Cihazlar
  inputDevice?: string;
  outputDevice?: string;
  
  // Ses Seviyeleri
  inputVolume: number;
  outputVolume: number;
  
  // Push-to-Talk
  pushToTalk: boolean;
  pushToTalkKey: string;
  pushToTalkDelay: number;
  
  // Gelişmiş
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  voiceActivation: boolean;
  activationThreshold: number;
  
  // Kalite
  bitrate: number;
  sampleRate: number;
  highQuality: boolean;
  
  // Filtreler
  krispEnabled: boolean;
  autoVolumeNormalization: boolean;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  // Cihazlar
  inputDevice: undefined,
  outputDevice: undefined,
  
  // Ses Seviyeleri
  inputVolume: 100,
  outputVolume: 100,
  
  // Push-to-Talk
  pushToTalk: false,
  pushToTalkKey: ' ',
  pushToTalkDelay: 200,
  
  // Gelişmiş
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  voiceActivation: false,
  activationThreshold: 50,
  
  // Kalite
  bitrate: 64,
  sampleRate: 48000,
  highQuality: false,
  
  // Filtreler
  krispEnabled: false,
  autoVolumeNormalization: false,
};

export const useVoiceSettings = () => {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('voiceSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const updateSetting = <K extends keyof VoiceSettings>(
    key: K,
    value: VoiceSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('voiceSettings', JSON.stringify(newSettings));
  };

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('voiceSettings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('voiceSettings', JSON.stringify(DEFAULT_SETTINGS));
  };

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
};
