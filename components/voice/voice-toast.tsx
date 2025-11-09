"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserMinus, Mic, MicOff, Video, VideoOff, MonitorUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "join" | "leave" | "mute" | "unmute" | "video-on" | "video-off" | "screen-share";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  userName?: string;
}

interface VoiceToastProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case "join":
      return <UserPlus className="h-5 w-5 text-green-400" />;
    case "leave":
      return <UserMinus className="h-5 w-5 text-red-400" />;
    case "mute":
      return <MicOff className="h-5 w-5 text-red-400" />;
    case "unmute":
      return <Mic className="h-5 w-5 text-green-400" />;
    case "video-on":
      return <Video className="h-5 w-5 text-indigo-400" />;
    case "video-off":
      return <VideoOff className="h-5 w-5 text-zinc-400" />;
    case "screen-share":
      return <MonitorUp className="h-5 w-5 text-green-400" />;
  }
};

const getToastColor = (type: ToastType) => {
  switch (type) {
    case "join":
    case "unmute":
    case "screen-share":
      return "border-green-500/30 bg-green-500/10";
    case "leave":
    case "mute":
      return "border-red-500/30 bg-red-500/10";
    case "video-on":
      return "border-indigo-500/30 bg-indigo-500/10";
    case "video-off":
      return "border-zinc-500/30 bg-zinc-500/10";
  }
};

export const VoiceToast = ({ toasts, onRemove }: VoiceToastProps) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "backdrop-blur-xl border-2 shadow-2xl",
            "animate-in slide-in-from-right duration-300",
            getToastColor(toast.type)
          )}
        >
          {getToastIcon(toast.type)}
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {toast.message}
            </p>
            {toast.userName && (
              <p className="text-xs text-zinc-400">
                {toast.userName}
              </p>
            )}
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useVoiceToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string, userName?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, type, message, userName };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};
