"use client";

import { Shield, ShieldCheck, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NoiseSuppressionIndicatorProps {
  isEnabled: boolean;
  isActive: boolean;
  type?: "krisp" | "standard";
  className?: string;
}

export const NoiseSuppressionIndicator = ({
  isEnabled,
  isActive,
  type = "standard",
  className
}: NoiseSuppressionIndicatorProps) => {
  if (!isEnabled) return null;

  const getIcon = () => {
    if (!isActive) return <ShieldOff className="h-4 w-4" />;
    return type === "krisp" ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />;
  };

  const getColor = () => {
    if (!isActive) return "text-zinc-500";
    return type === "krisp" ? "text-indigo-400" : "text-green-400";
  };

  const getLabel = () => {
    if (!isActive) return "Gürültü Engelleme Kapalı";
    return type === "krisp" ? "Krisp AI Aktif" : "Gürültü Engelleme Aktif";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
            "bg-zinc-800/50 border-white/10 transition-all duration-300",
            isActive && "ring-1",
            type === "krisp" && isActive && "ring-indigo-500/30",
            type === "standard" && isActive && "ring-green-500/30",
            className
          )}>
            <div className={cn("transition-colors", getColor())}>
              {getIcon()}
            </div>
            {isActive && (
              <div className="flex items-center gap-1">
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full animate-pulse",
                  type === "krisp" ? "bg-indigo-400" : "bg-green-400"
                )} />
                <span className={cn("text-xs font-medium", getColor())}>
                  {type === "krisp" ? "AI" : "Aktif"}
                </span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getLabel()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
