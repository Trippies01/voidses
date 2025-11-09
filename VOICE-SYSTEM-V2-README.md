# 🎙️ Modern Ses Sistemi v2.0

Tamamen yeniden tasarlanmış, profesyonel Discord benzeri ses sistemi.

## ✨ Özellikler

### 🎨 Modern UI/UX
- **Glassmorphism Tasarım** - Cam efektli modern arayüz
- **Smooth Animasyonlar** - Akıcı geçişler ve efektler
- **Gradient Arka Planlar** - Dinamik renk geçişleri
- **Responsive Tasarım** - Her ekran boyutuna uyumlu

### 🎯 Ses Kontrolleri
- **Mikrofon Kontrolü** - Mute/Unmute ile görsel geri bildirim
- **Kulaklık Kontrolü** - Deafen özelliği
- **Ses Seviyesi** - Dinamik ses kontrolü (0-200%)
- **Video Kontrolü** - Kamera açma/kapama
- **Ekran Paylaşımı** - Ekran paylaşım desteği

### 🔧 Gelişmiş Ayarlar
- **Krisp AI** - Yapay zeka destekli gürültü engelleme
- **Push-to-Talk** - Tuşa basarak konuşma
- **Echo Cancellation** - Yankı önleme
- **Noise Suppression** - Gürültü engelleme
- **Auto Gain Control** - Otomatik ses kontrolü
- **Voice Activity Detection** - Ses aktivite algılama
- **Auto Volume Normalization** - Otomatik ses dengeleme

### 📊 İstatistikler
- **Gerçek Zamanlı İstatistikler** - Gecikme, bitrate, paket kaybı
- **Bağlantı Kalitesi** - Excellent, Good, Poor göstergeleri
- **Ses Görselleştirme** - Bars, Wave, Circle modları
- **FPS & Çözünürlük** - Video istatistikleri

### 👥 Katılımcı Yönetimi
- **Katılımcı Kartları** - Modern kullanıcı kartları
- **Bireysel Ses Kontrolü** - Her kullanıcı için ayrı ses seviyesi
- **Konuşma Göstergesi** - Gerçek zamanlı konuşma animasyonu
- **Rol Rozetleri** - Admin, Moderator rozetleri

## 📁 Dosya Yapısı

```
components/voice/
├── voice-room.tsx                    # Ana ses odası
├── voice-control-panel.tsx           # Alt kontrol paneli
├── voice-status-bar.tsx              # Üst durum çubuğu
├── voice-participant-card.tsx        # Katılımcı kartı
├── voice-settings-panel.tsx          # Ayarlar paneli
├── push-to-talk-indicator.tsx        # PTT göstergesi
├── voice-activity-indicator.tsx      # Ses aktivite göstergesi
├── noise-suppression-indicator.tsx   # Gürültü engelleme göstergesi
├── voice-visualizer.tsx              # Ses görselleştirici
├── voice-stats-overlay.tsx           # İstatistik overlay
└── index.ts                          # Export dosyası

hooks/
├── use-voice-connection.ts           # Bağlantı yönetimi
├── use-voice-participants.ts         # Katılımcı yönetimi
├── use-voice-settings.ts             # Ayarlar yönetimi
└── use-push-to-talk.ts              # PTT yönetimi

app/(main)/
├── (routes)/settings/voice/page.tsx  # Ayarlar sayfası
└── servers/[serverId]/channels/[channelId]/voice/page.tsx  # Ses kanalı sayfası
```

## 🚀 Kullanım

### Ses Odasına Katılma

```tsx
import { VoiceRoom } from "@/components/voice";

<VoiceRoom
  channelId="channel-id"
  channelName="Genel Ses"
  serverName="Sunucu Adı"
/>
```

### Ses Ayarları

```tsx
import { VoiceSettingsPanel } from "@/components/voice";

<VoiceSettingsPanel />
```

### Ses Kontrol Paneli

```tsx
import { VoiceControlPanel } from "@/components/voice";

<VoiceControlPanel
  isConnected={true}
  onDisconnect={() => console.log("Disconnected")}
/>
```

## 🎨 Tasarım Özellikleri

### Renkler
- **Primary**: Indigo (500-600)
- **Secondary**: Purple (500-600)
- **Success**: Green (400-500)
- **Error**: Red (400-500)
- **Background**: Zinc (900-950)

### Animasyonlar
- **Pulse**: Konuşma göstergeleri
- **Fade**: Geçişler
- **Scale**: Hover efektleri
- **Slide**: Panel açılmaları

### Efektler
- **Backdrop Blur**: Cam efekti
- **Gradient**: Renk geçişleri
- **Shadow**: Derinlik efekti
- **Border Glow**: Işıltı efekti

## 🔧 Yapılandırma

### Ses Ayarları

```typescript
interface VoiceSettings {
  // Cihazlar
  inputDevice?: string;
  outputDevice?: string;
  
  // Ses Seviyeleri
  inputVolume: number;      // 0-200
  outputVolume: number;     // 0-200
  
  // Gelişmiş
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  voiceActivation: boolean;
  activationThreshold: number;
  
  // Kalite
  bitrate: number;          // 32, 64, 96, 128
  sampleRate: number;       // 16000, 24000, 48000
  highQuality: boolean;
  
  // Filtreler
  krispEnabled: boolean;
  autoVolumeNormalization: boolean;
  
  // Push-to-Talk
  pushToTalk: boolean;
  pushToTalkKey: string;
  pushToTalkDelay: number;
}
```

## 📊 Bağlantı Kalitesi

```typescript
type ConnectionQuality = "excellent" | "good" | "poor" | "disconnected";

// Excellent: < 50ms latency, < 1% packet loss
// Good: < 100ms latency, < 3% packet loss
// Poor: < 200ms latency, < 5% packet loss
// Disconnected: Bağlantı yok
```

## 🎯 Özellik Detayları

### Krisp AI Gürültü Engelleme
- Yapay zeka destekli gelişmiş gürültü engelleme
- Arka plan seslerini otomatik filtreler
- Klavye, fare, fan gibi sesleri temizler

### Push-to-Talk
- Özelleştirilebilir tuş ataması
- Ayarlanabilir gecikme (0-1000ms)
- Görsel geri bildirim

### Otomatik Ses Dengeleme
- Tüm kullanıcıların ses seviyesini dengeler
- Sessiz kullanıcıları yükseltir
- Yüksek seslileri azaltır

### Ses Görselleştirme
- **Bars**: Çubuk grafik
- **Wave**: Dalga formu
- **Circle**: Dairesel görselleştirme

## 🔐 Güvenlik

- Tüm ses verileri şifrelenmiş
- End-to-end encryption desteği
- Güvenli WebRTC bağlantıları

## 🌐 Tarayıcı Desteği

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 Notlar

- Ses sistemi LiveKit altyapısı üzerine kurulmuştur
- Tüm ayarlar localStorage'da saklanır
- Gerçek zamanlı senkronizasyon Socket.IO ile sağlanır

## 🎉 Yenilikler v2.0

- ✨ Tamamen yeniden tasarlanmış UI
- 🎨 Modern glassmorphism tasarım
- 🚀 Geliştirilmiş performans
- 📊 Detaylı istatistikler
- 🎯 Daha iyi kullanıcı deneyimi
- 🔧 Modüler mimari
- 💪 TypeScript desteği
- 🎨 Özelleştirilebilir temalar

## 🤝 Katkıda Bulunma

Bu sistem tamamen modüler olarak tasarlanmıştır. Yeni özellikler eklemek için:

1. `components/voice/` altına yeni bileşen ekleyin
2. `hooks/` altına gerekli hook'ları ekleyin
3. `index.ts` dosyasından export edin
4. Dokümantasyonu güncelleyin

## 📄 Lisans

MIT License - Özgürce kullanabilirsiniz!

---

**Geliştirici**: Modern Discord Clone Team
**Versiyon**: 2.0.0
**Tarih**: 2024
