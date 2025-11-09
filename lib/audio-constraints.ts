// Maksimum gürültü engelleme için audio constraints
export const getAudioConstraints = () => {
  return {
    echoCancellation: {
      ideal: true,
    },
    noiseSuppression: {
      ideal: true,
    },
    autoGainControl: {
      ideal: true,
    },
    // Chrome'un gelişmiş özelliklerini kullan
    googEchoCancellation: true,
    googAutoGainControl: true,
    googNoiseSuppression: true,
    googHighpassFilter: true,
    googTypingNoiseDetection: true,
    googAudioMirroring: false,
    // Ses kalitesi
    sampleRate: 48000,
    sampleSize: 16,
    channelCount: 1,
    latency: 0.01,
  };
};
