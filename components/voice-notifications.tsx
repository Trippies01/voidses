"use client";

import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { UserPlus, UserMinus, WifiOff, Wifi } from "lucide-react";

interface Notification {
  id: string;
  type: 'join' | 'leave' | 'connection-lost' | 'connection-restored';
  message: string;
  icon: React.ReactNode;
}

export const VoiceNotifications = () => {
  const room = useRoomContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!room) return;

    const addNotification = (type: Notification['type'], message: string) => {
      const icons = {
        join: <UserPlus className="w-4 h-4 text-green-400" />,
        leave: <UserMinus className="w-4 h-4 text-red-400" />,
        'connection-lost': <WifiOff className="w-4 h-4 text-red-400" />,
        'connection-restored': <Wifi className="w-4 h-4 text-green-400" />,
      };

      const notification: Notification = {
        id: Date.now().toString(),
        type,
        message,
        icon: icons[type],
      };

      setNotifications(prev => [...prev, notification]);

      // 3 saniye sonra kaldır
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    };

    // Kullanıcı katıldı
    const handleParticipantConnected = (participant: any) => {
      const name = participant.identity || 'Bilinmeyen';
      addNotification('join', `${name} katıldı`);
      
      // Ses efekti
      const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    };

    // Kullanıcı ayrıldı
    const handleParticipantDisconnected = (participant: any) => {
      const name = participant.identity || 'Bilinmeyen';
      addNotification('leave', `${name} ayrıldı`);
      
      // Ses efekti
      const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    };

    // Bağlantı kesildi
    const handleDisconnected = () => {
      addNotification('connection-lost', 'Bağlantı kesildi');
    };

    // Bağlantı yeniden kuruldu
    const handleReconnected = () => {
      addNotification('connection-restored', 'Bağlantı yeniden kuruldu');
    };

    room.on('participantConnected', handleParticipantConnected);
    room.on('participantDisconnected', handleParticipantDisconnected);
    room.on('disconnected', handleDisconnected);
    room.on('reconnected', handleReconnected);

    return () => {
      room.off('participantConnected', handleParticipantConnected);
      room.off('participantDisconnected', handleParticipantDisconnected);
      room.off('disconnected', handleDisconnected);
      room.off('reconnected', handleReconnected);
    };
  }, [room]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="bg-gradient-to-r from-zinc-900/95 to-zinc-800/95 backdrop-blur-md border border-zinc-700/50 rounded-xl p-4 shadow-2xl transform transition-all duration-300 hover:scale-105"
          style={{
            animation: `slideInRight 0.3s ease-out ${index * 0.1}s both, fadeOut 0.3s ease-in 2.7s both`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 p-2 bg-zinc-800/50 rounded-lg">
              {notification.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-white block truncate">
                {notification.message}
              </span>
              <span className="text-xs text-zinc-400">
                Az önce
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-2 h-1 bg-zinc-700/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{
                animation: 'shrink 3s linear',
              }}
            />
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};
