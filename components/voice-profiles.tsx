"use client";

import { useVoiceProfiles } from "@/hooks/use-voice-profiles";
import { useVoiceSettings } from "@/hooks/use-voice-settings";
import { Check } from "lucide-react";

export const VoiceProfiles = () => {
  const { profiles, activeProfileId, activateProfile } = useVoiceProfiles();
  const { updateSetting } = useVoiceSettings();

  const handleProfileClick = (profileId: string) => {
    const settings = activateProfile(profileId);
    if (settings) {
      // Tüm ayarları güncelle
      Object.entries(settings).forEach(([key, value]) => {
        updateSetting(key as any, value);
      });
      
      // Sayfayı yenile
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Ses Profilleri</h3>
        <p className="text-sm text-zinc-400">
          Farklı senaryolar için hazır ayarlar
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleProfileClick(profile.id)}
            className={`relative p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
              activeProfileId === profile.id
                ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-lg shadow-blue-500/20'
                : 'border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 hover:border-zinc-600 hover:shadow-lg'
            }`}
          >
            {activeProfileId === profile.id && (
              <div className="absolute top-3 right-3 p-1 bg-blue-500 rounded-full">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}

            <div className="text-4xl mb-3">{profile.icon}</div>
            <div className="text-base font-bold text-white mb-3">{profile.name}</div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">PTT</span>
                <span className={`font-semibold ${profile.settings.pushToTalk ? 'text-green-400' : 'text-zinc-500'}`}>
                  {profile.settings.pushToTalk ? 'Açık' : 'Kapalı'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Mikrofon</span>
                <span className="font-semibold text-blue-400">%{profile.settings.inputVolume}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Krisp AI</span>
                <span className={`font-semibold ${profile.settings.krispEnabled ? 'text-green-400' : 'text-zinc-500'}`}>
                  {profile.settings.krispEnabled ? 'Açık' : 'Kapalı'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-zinc-800 rounded-lg p-4">
        <p className="text-xs text-zinc-400">
          💡 <strong>İpucu:</strong> Bir profil seçtiğinizde tüm ses ayarları otomatik değişir.
        </p>
      </div>
    </div>
  );
};
