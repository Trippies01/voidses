"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VoiceSettingsPanel } from "@/components/voice/voice-settings-panel";

export default function VoiceSettingsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Modern Header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        <div className="relative px-8 py-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-all mb-4"
          >
            <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Geri Dön</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-8">
          <VoiceSettingsPanel />
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}
