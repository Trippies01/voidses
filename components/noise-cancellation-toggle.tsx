"use client";

import { Mic, MicOff } from "lucide-react";
import { useNoiseCancellation } from "@/hooks/use-noise-cancellation";
import { ActionTooltip } from "@/components/action-tooltip";

export const NoiseCancellationToggle = () => {
  const { isEnabled, setIsEnabled, isLoading, noiseLevel } = useNoiseCancellation();

  return (
    <ActionTooltip 
      label={isEnabled ? "Gürültü Engelleme: Açık" : "Gürültü Engelleme: Kapalı"}
    >
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        disabled={isLoading}
        className={`
          group px-3 py-2 rounded-md flex items-center gap-x-2 w-full
          hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition
          ${isEnabled ? 'bg-green-500/10' : 'bg-zinc-500/10'}
        `}
      >
        {isEnabled ? (
          <Mic className="h-5 w-5 text-green-500" />
        ) : (
          <MicOff className="h-5 w-5 text-zinc-500" />
        )}
        <div className="flex flex-col items-start flex-1">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {isLoading ? 'Yükleniyor...' : isEnabled ? 'Gürültü Engelleme' : 'Gürültü Engelleme'}
          </p>
          {isEnabled && (
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1 mt-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all"
                style={{ width: `${noiseLevel * 100}%` }}
              />
            </div>
          )}
        </div>
      </button>
    </ActionTooltip>
  );
};
