import { useState, useEffect } from 'react';
import { VoiceSettings } from './use-voice-settings';

export interface VoiceProfile {
  id: string;
  name: string;
  settings: VoiceSettings;
  icon: string;
}

const DEFAULT_PROFILES: VoiceProfile[] = [
  {
    id: 'gaming',
    name: 'Oyun',
    icon: '🎮',
    settings: {
      pushToTalk: false,
      pushToTalkKey: ' ',
      pushToTalkDelay: 200,
      inputVolume: 120,
      outputVolume: 100,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      voiceActivation: true,
      activationThreshold: 50,
      bitrate: 64000,
      sampleRate: 48000,
      highQuality: true,
      krispEnabled: true,
      autoVolumeNormalization: true,
    },
  },
  {
    id: 'streaming',
    name: 'Yayın',
    icon: '📹',
    settings: {
      pushToTalk: true,
      pushToTalkKey: ' ',
      pushToTalkDelay: 300,
      inputVolume: 150,
      outputVolume: 80,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      voiceActivation: false,
      activationThreshold: 50,
      bitrate: 96000,
      sampleRate: 48000,
      highQuality: true,
      krispEnabled: true,
      autoVolumeNormalization: false,
    },
  },
  {
    id: 'podcast',
    name: 'Podcast',
    icon: '🎙️',
    settings: {
      pushToTalk: false,
      pushToTalkKey: ' ',
      pushToTalkDelay: 200,
      inputVolume: 100,
      outputVolume: 100,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      voiceActivation: true,
      activationThreshold: 40,
      bitrate: 96000,
      sampleRate: 48000,
      highQuality: true,
      krispEnabled: true,
      autoVolumeNormalization: true,
    },
  },
  {
    id: 'quiet',
    name: 'Sessiz Ortam',
    icon: '🤫',
    settings: {
      pushToTalk: true,
      pushToTalkKey: ' ',
      pushToTalkDelay: 400,
      inputVolume: 80,
      outputVolume: 120,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      voiceActivation: false,
      activationThreshold: 60,
      bitrate: 64000,
      sampleRate: 48000,
      highQuality: false,
      krispEnabled: true,
      autoVolumeNormalization: true,
    },
  },
];

export const useVoiceProfiles = () => {
  const [profiles, setProfiles] = useState<VoiceProfile[]>(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  useEffect(() => {
    // Özel profilleri yükle
    const saved = localStorage.getItem('voiceProfiles');
    if (saved) {
      try {
        const customProfiles = JSON.parse(saved);
        setProfiles([...DEFAULT_PROFILES, ...customProfiles]);
      } catch (error) {
        console.error('Profil yükleme hatası:', error);
      }
    }

    // Aktif profili yükle
    const activeId = localStorage.getItem('activeVoiceProfile');
    if (activeId) {
      setActiveProfileId(activeId);
    }
  }, []);

  const activateProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return null;

    setActiveProfileId(profileId);
    localStorage.setItem('activeVoiceProfile', profileId);
    localStorage.setItem('voiceSettings', JSON.stringify(profile.settings));

    console.log('🎯 Profil aktif edildi:', profile.name);
    return profile.settings;
  };

  const saveCustomProfile = (name: string, settings: VoiceSettings, icon: string = '⭐') => {
    const newProfile: VoiceProfile = {
      id: `custom-${Date.now()}`,
      name,
      settings,
      icon,
    };

    const customProfiles = profiles.filter(p => p.id.startsWith('custom-'));
    customProfiles.push(newProfile);

    localStorage.setItem('voiceProfiles', JSON.stringify(customProfiles));
    setProfiles([...DEFAULT_PROFILES, ...customProfiles]);

    console.log('💾 Özel profil kaydedildi:', name);
    return newProfile;
  };

  const deleteCustomProfile = (profileId: string) => {
    if (!profileId.startsWith('custom-')) {
      console.warn('Varsayılan profiller silinemez');
      return;
    }

    const customProfiles = profiles.filter(
      p => p.id.startsWith('custom-') && p.id !== profileId
    );

    localStorage.setItem('voiceProfiles', JSON.stringify(customProfiles));
    setProfiles([...DEFAULT_PROFILES, ...customProfiles]);

    if (activeProfileId === profileId) {
      setActiveProfileId(null);
      localStorage.removeItem('activeVoiceProfile');
    }

    console.log('🗑️ Profil silindi');
  };

  return {
    profiles,
    activeProfileId,
    activateProfile,
    saveCustomProfile,
    deleteCustomProfile,
  };
};
