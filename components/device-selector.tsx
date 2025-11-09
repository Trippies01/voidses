"use client";

import { useEffect, useState } from "react";
import { Mic, Volume2, Video } from "lucide-react";

interface Device {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

interface DeviceSelectorProps {
  type: 'audioinput' | 'audiooutput' | 'videoinput';
  value?: string;
  onChange: (deviceId: string) => void;
}

export const DeviceSelector = ({ type, value, onChange }: DeviceSelectorProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevices();

    // Cihaz değişikliklerini dinle
    navigator.mediaDevices.addEventListener('devicechange', loadDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', loadDevices);
    };
  }, [type]);

  const loadDevices = async () => {
    try {
      // İzin iste
      await navigator.mediaDevices.getUserMedia({ 
        audio: type === 'audioinput' || type === 'audiooutput',
        video: type === 'videoinput'
      });

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const filtered = allDevices
        .filter(device => device.kind === type)
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `${getDeviceTypeName(type)} ${device.deviceId.slice(0, 5)}`,
          kind: device.kind,
        }));

      setDevices(filtered);
      setLoading(false);

      // Varsayılan cihazı seç
      if (!value && filtered.length > 0) {
        onChange(filtered[0].deviceId);
      }
    } catch (error) {
      console.error('Cihaz listesi alınamadı:', error);
      setLoading(false);
    }
  };

  const getDeviceTypeName = (kind: string) => {
    switch (kind) {
      case 'audioinput': return 'Mikrofon';
      case 'audiooutput': return 'Hoparlör';
      case 'videoinput': return 'Kamera';
      default: return 'Cihaz';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'audioinput': return <Mic className="w-4 h-4" />;
      case 'audiooutput': return <Volume2 className="w-4 h-4" />;
      case 'videoinput': return <Video className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        {getIcon()}
        <span>Cihazlar yükleniyor...</span>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-400">
        {getIcon()}
        <span>Cihaz bulunamadı</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
        {getIcon()}
        {getDeviceTypeName(type)}
      </label>
      <select
        value={value || devices[0]?.deviceId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
    </div>
  );
};
