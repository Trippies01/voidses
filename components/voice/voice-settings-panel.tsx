"use client";

import { useState } from "react";
import { Mic, Headphones, Sliders, Sparkles, Zap, Shield, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useVoiceSettings } from "@/hooks/use-voice-settings";
import { cn } from "@/lib/utils";

export const VoiceSettingsPanel = () => {
  const { settings, updateSettings } = useVoiceSettings();
  const [activeTab, setActiveTab] = useState("audio");

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-100">Ses Ayarları</h2>
        <p className="text-sm text-zinc-400">
          Ses ve video ayarlarınızı özelleştirin
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-zinc-800/50 p-1">
          <TabsTrigger value="audio" className="data-[state=active]:bg-zinc-700">
            <Mic className="h-4 w-4 mr-2" />
            Ses
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-zinc-700">
            <Sliders className="h-4 w-4 mr-2" />
            Gelişmiş
          </TabsTrigger>
          <TabsTrigger value="quality" className="data-[state=active]:bg-zinc-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Kalite
          </TabsTrigger>
          <TabsTrigger value="filters" className="data-[state=active]:bg-zinc-700">
            <Shield className="h-4 w-4 mr-2" />
            Filtreler
          </TabsTrigger>
        </TabsList>

        {/* Ses Sekmesi */}
        <TabsContent value="audio" className="space-y-4 mt-6">
          <Card className="p-6 bg-zinc-800/30 border-white/10">
            <div className="space-y-6">
              {/* Mikrofon Seçimi */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Mikrofon
                </Label>
                <Select
                  value={settings.inputDevice || "default"}
                  onValueChange={(value) => updateSettings({ inputDevice: value })}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-white/10">
                    <SelectValue placeholder="Mikrofon seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Varsayılan Mikrofon</SelectItem>
                    <SelectItem value="device1">Mikrofon 1</SelectItem>
                    <SelectItem value="device2">Mikrofon 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mikrofon Seviyesi */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-zinc-100">
                    Mikrofon Seviyesi
                  </Label>
                  <span className="text-sm text-zinc-400">
                    {settings.inputVolume || 100}%
                  </span>
                </div>
                <Slider
                  value={[settings.inputVolume || 100]}
                  onValueChange={(value) => updateSettings({ inputVolume: value[0] })}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Kulaklık Seçimi */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Kulaklık/Hoparlör
                </Label>
                <Select
                  value={settings.outputDevice || "default"}
                  onValueChange={(value) => updateSettings({ outputDevice: value })}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-white/10">
                    <SelectValue placeholder="Çıkış cihazı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Varsayılan Hoparlör</SelectItem>
                    <SelectItem value="device1">Hoparlör 1</SelectItem>
                    <SelectItem value="device2">Hoparlör 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Çıkış Seviyesi */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-zinc-100">
                    Ses Seviyesi
                  </Label>
                  <span className="text-sm text-zinc-400">
                    {settings.outputVolume || 100}%
                  </span>
                </div>
                <Slider
                  value={[settings.outputVolume || 100]}
                  onValueChange={(value) => updateSettings({ outputVolume: value[0] })}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Gelişmiş Sekmesi */}
        <TabsContent value="advanced" className="space-y-4 mt-6">
          <Card className="p-6 bg-zinc-800/30 border-white/10">
            <div className="space-y-6">
              {/* Echo Cancellation */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-zinc-100">
                    Yankı Önleme
                  </Label>
                  <p className="text-xs text-zinc-400">
                    Yankıyı otomatik olarak azaltır
                  </p>
                </div>
                <Switch
                  checked={settings.echoCancellation ?? true}
                  onCheckedChange={(checked) => updateSettings({ echoCancellation: checked })}
                />
              </div>

              {/* Noise Suppression */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-zinc-100">
                    Gürültü Engelleme
                  </Label>
                  <p className="text-xs text-zinc-400">
                    Arka plan gürültüsünü azaltır
                  </p>
                </div>
                <Switch
                  checked={settings.noiseSuppression ?? true}
                  onCheckedChange={(checked) => updateSettings({ noiseSuppression: checked })}
                />
              </div>

              {/* Auto Gain Control */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-zinc-100">
                    Otomatik Ses Kontrolü
                  </Label>
                  <p className="text-xs text-zinc-400">
                    Ses seviyesini otomatik ayarlar
                  </p>
                </div>
                <Switch
                  checked={settings.autoGainControl ?? true}
                  onCheckedChange={(checked) => updateSettings({ autoGainControl: checked })}
                />
              </div>

              {/* Voice Activity Detection */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-zinc-100">
                    Ses Aktivite Algılama
                  </Label>
                  <p className="text-xs text-zinc-400">
                    Konuşmayı otomatik algılar
                  </p>
                </div>
                <Switch
                  checked={settings.voiceActivation ?? false}
                  onCheckedChange={(checked) => updateSettings({ voiceActivation: checked })}
                />
              </div>

              {/* Activation Threshold */}
              {settings.voiceActivation && (
                <div className="space-y-3 pl-4 border-l-2 border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-zinc-100">
                      Aktivasyon Eşiği
                    </Label>
                    <span className="text-sm text-zinc-400">
                      {settings.activationThreshold || 50}%
                    </span>
                  </div>
                  <Slider
                    value={[settings.activationThreshold || 50]}
                    onValueChange={(value) => updateSettings({ activationThreshold: value[0] })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Kalite Sekmesi */}
        <TabsContent value="quality" className="space-y-4 mt-6">
          <Card className="p-6 bg-zinc-800/30 border-white/10">
            <div className="space-y-6">
              {/* Bitrate */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Ses Kalitesi (Bitrate)
                </Label>
                <Select
                  value={settings.bitrate?.toString() || "64"}
                  onValueChange={(value) => updateSettings({ bitrate: parseInt(value) })}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="32">Düşük (32 kbps)</SelectItem>
                    <SelectItem value="64">Normal (64 kbps)</SelectItem>
                    <SelectItem value="96">Yüksek (96 kbps)</SelectItem>
                    <SelectItem value="128">Çok Yüksek (128 kbps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sample Rate */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-100">
                  Örnekleme Hızı
                </Label>
                <Select
                  value={settings.sampleRate?.toString() || "48000"}
                  onValueChange={(value) => updateSettings({ sampleRate: parseInt(value) })}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16000">16 kHz</SelectItem>
                    <SelectItem value="24000">24 kHz</SelectItem>
                    <SelectItem value="48000">48 kHz (Önerilen)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* High Quality Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    Yüksek Kalite Modu
                  </Label>
                  <p className="text-xs text-zinc-400">
                    Maksimum ses kalitesi (daha fazla bant genişliği)
                  </p>
                </div>
                <Switch
                  checked={settings.highQuality ?? false}
                  onCheckedChange={(checked) => updateSettings({ highQuality: checked })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Filtreler Sekmesi */}
        <TabsContent value="filters" className="space-y-4 mt-6">
          <Card className="p-6 bg-zinc-800/30 border-white/10">
            <div className="space-y-6">
              {/* Krisp AI */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-400" />
                    Krisp AI Gürültü Engelleme
                  </Label>
                  <p className="text-xs text-zinc-400">
                    Yapay zeka destekli gelişmiş gürültü engelleme
                  </p>
                </div>
                <Switch
                  checked={settings.krispEnabled ?? false}
                  onCheckedChange={(checked) => updateSettings({ krispEnabled: checked })}
                />
              </div>

              {/* Auto Volume Normalization */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-green-400" />
                    Otomatik Ses Normalizasyonu
                  </Label>
                  <p className="text-xs text-zinc-400">
                    Tüm kullanıcıların ses seviyesini dengeler
                  </p>
                </div>
                <Switch
                  checked={settings.autoVolumeNormalization ?? false}
                  onCheckedChange={(checked) => updateSettings({ autoVolumeNormalization: checked })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Buttons */}
      <Card className="p-4 bg-zinc-800/30 border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            Ayarlarınızı test edin
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Mikrofon Testi
            </Button>
            <Button variant="outline" size="sm">
              Ses Testi
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
