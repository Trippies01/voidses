# 🎤 Ses Sistemi - Kullanım Kılavuzu

## ✅ Yeni Eklenen Özellikler

### 1. ⌨️ Klavye Kısayolları
Hızlı erişim için klavye kısayolları eklendi:

- **Ctrl + M**: Mute/Unmute (Mikrofonu aç/kapat)
- **Ctrl + D**: Deafen/Undeafen (Sağırlaştır)
- **Ctrl + ,**: Ses Ayarları sayfasını aç

### 2. 🎙️ Mikrofon Testi
`/settings/voice` sayfasında mikrofon testi:
- Gerçek zamanlı ses seviyesi göstergesi
- Görsel ses çubukları
- Ses kalitesi önerileri
- "Test Et" butonu ile başlat

### 3. 🔊 Cihaz Seçimi
Mikrofon ve hoparlör seçimi:
- Mevcut cihazları listele
- Cihaz değişikliğini otomatik algıla
- Kolay seçim arayüzü

### 4. 📊 Bağlantı Kalitesi Göstergesi
Sol üst köşede gerçek zamanlı istatistikler:
- Ping (ms)
- Packet Loss (%)
- Bitrate (kbps)
- Kalite durumu (Mükemmel/İyi/Zayıf)

### 5. 🎚️ Kullanıcı Başına Ses Kontrolü
Her kullanıcının sesini ayrı ayrı ayarla:
- 0-200% ses seviyesi
- Kullanıcıyı local mute
- Ayarlar kaydedilir

---

## 🎯 Kullanım

### Sesli Kanala Katılma
1. Sesli kanala tıkla
2. Mikrofon izni ver
3. Bağlantı kalitesi sol üstte görünür

### Ses Ayarları
1. Sol alttaki ⚙️ Settings butonuna tıkla
2. Veya **Ctrl + ,** kısayolunu kullan
3. Ayarları özelleştir

### Push-to-Talk Kullanımı
1. `/settings/voice` → PTT'yi aç
2. Space tuşuna basılı tut
3. Konuş
4. Bırak

### Mikrofon Testi
1. `/settings/voice` → Mikrofon Testi
2. "Test Et" butonuna tıkla
3. Konuş ve ses seviyesini gör
4. "Durdur" ile bitir

---

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler
- **LiveKit**: WebRTC altyapısı
- **Krisp AI**: Gürültü engelleme
- **Web Audio API**: Ses analizi
- **MediaDevices API**: Cihaz yönetimi

### Dosya Yapısı
```
hooks/
  ├── use-keyboard-shortcuts.ts    # Klavye kısayolları
  ├── use-voice-settings.ts        # Ses ayarları
  ├── use-push-to-talk.ts          # PTT kontrolü
  └── use-krisp-noise-filter.ts    # Krisp AI

components/
  ├── microphone-test.tsx          # Mikrofon testi
  ├── device-selector.tsx          # Cihaz seçimi
  ├── connection-quality.tsx       # Bağlantı kalitesi
  └── participant-volume-control.tsx # Kullanıcı ses kontrolü
```

---

## 🚀 Gelecek Özellikler

### Yakında Eklenecekler
- [ ] Ekran paylaşımı
- [ ] Otomatik ses dengeleme
- [ ] Ses profilleri
- [ ] PTT delay ayarı
- [ ] Kamera kontrolü

### Uzun Vadeli
- [ ] Ses kaydı
- [ ] Soundboard
- [ ] Konuşma tanıma
- [ ] Gelişmiş AI özellikleri

---

## 📝 Notlar

### Tarayıcı Desteği
- ✅ Chrome/Edge (Önerilen)
- ✅ Firefox
- ⚠️ Safari (Kısıtlı)

### İzinler
- Mikrofon izni gerekli
- HTTPS zorunlu
- Cihaz erişimi için izin

### Performans
- Krisp AI: ~5-10ms gecikme
- Bağlantı kalitesi: 2 saniyede bir güncellenir
- Mikrofon testi: Gerçek zamanlı

---

## 🐛 Sorun Giderme

### Mikrofon Çalışmıyor
1. Tarayıcı izinlerini kontrol et
2. Cihaz seçimini kontrol et
3. Mikrofon testini çalıştır

### Ses Gelmiyor
1. Hoparlör seçimini kontrol et
2. Ses seviyesini kontrol et
3. Bağlantı kalitesini kontrol et

### Krisp Çalışmıyor
1. Console'da hata var mı kontrol et
2. Krisp'i kapat/aç
3. Sayfayı yenile

### PTT Çalışmıyor
1. PTT'nin açık olduğunu kontrol et
2. Doğru tuşu kullandığını kontrol et
3. Console'da debug loglarını kontrol et

---

## 💡 İpuçları

1. **En İyi Ses Kalitesi İçin:**
   - Krisp AI'ı aç
   - PTT kullan
   - İyi bir mikrofon kullan

2. **Düşük Bandwidth İçin:**
   - Video'yu kapat
   - Krisp'i kapat
   - Ses kalitesini düşür

3. **Arka Plan Sesleri İçin:**
   - PTT kullan (en etkili)
   - Krisp AI aç
   - Mikrofonu uzaklaştır

---

**Son Güncelleme:** 2025-01-08
**Versiyon:** 2.0.0
