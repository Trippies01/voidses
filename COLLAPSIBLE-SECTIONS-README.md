# 📂 Açılır-Kapanır Kanal Bölümleri

## ✅ Yeni Özellikler

### 🎨 Modern Collapsible Tasarım

Sidebar'daki kanal bölümleri artık modern, açılır-kapanır bir tasarıma sahip!

## 🔧 Özellikler

### 1. **Açılır-Kapanır Animasyon**
- Smooth height transition (300ms)
- Opacity fade efekti
- Chevron rotasyon animasyonu

### 2. **Hover Efektleri**
- Arka plan rengi değişimi
- Border glow efekti
- Buton opacity animasyonu

### 3. **Kanal Sayısı Badge**
- Otomatik sayı gösterimi
- Hover'da renk değişimi
- Kompakt tasarım

### 4. **Action Butonları**
- Hover'da görünür
- Plus (Kanal Oluştur)
- Settings (Üyeleri Yönet)

## 🎨 Tasarım Detayları

### Header

```tsx
<div className={cn(
  "group flex items-center justify-between py-2 px-2 rounded-lg",
  "hover:bg-white/5 transition-all duration-200 cursor-pointer",
  "border border-transparent hover:border-white/10"
)}>
```

**Özellikler:**
- Padding: 8px
- Rounded: 8px
- Hover: bg-white/5
- Border: transparent → white/10

### Chevron İkonu

```tsx
<ChevronDown
  className={cn(
    "h-4 w-4 text-zinc-400 transition-transform duration-300",
    isOpen ? "rotate-0" : "-rotate-90"
  )}
/>
```

**Animasyon:**
- Açık: 0° (aşağı)
- Kapalı: -90° (sağa)
- Duration: 300ms

### Count Badge

```tsx
<span className={cn(
  "ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium",
  "bg-zinc-700/50 text-zinc-400",
  "group-hover:bg-zinc-600/50 group-hover:text-zinc-300"
)}>
  {count}
</span>
```

**Özellikler:**
- Rounded-full
- Font size: 10px
- Hover: Daha açık renk

### Content Animasyonu

```tsx
<div className={cn(
  "overflow-hidden transition-all duration-300 ease-in-out",
  isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
)}>
```

**Animasyon:**
- Max-height: 0 → 2000px
- Opacity: 0 → 1
- Duration: 300ms
- Easing: ease-in-out

## 📊 Kullanım

### Temel Kullanım

```tsx
<CollapsibleSection
  sectionType="channels"
  channelType={ChannelType.TEXT}
  role={role}
  label="Text Kanalları"
  server={server}
  defaultOpen={true}
  count={textChannels.length}
>
  {textChannels.map((channel) => (
    <ServerChannel key={channel.id} channel={channel} />
  ))}
</CollapsibleSection>
```

### Props

```typescript
interface CollapsibleSectionProps {
  label: string;                    // Bölüm başlığı
  role?: MemberRole;                // Kullanıcı rolü
  sectionType: "channels" | "members";
  channelType?: ChannelType;        // TEXT, AUDIO, VIDEO
  server?: ServerWithMembersWithProfiles;
  children: React.ReactNode;        // Kanal listesi
  defaultOpen?: boolean;            // Varsayılan açık/kapalı
  count?: number;                   // Kanal sayısı
}
```

## 🎯 Özellik Detayları

### 1. Açılır-Kapanır Mekanizma

**State Yönetimi:**
```tsx
const [isOpen, setIsOpen] = useState(defaultOpen);
```

**Toggle Function:**
```tsx
<button onClick={() => setIsOpen(!isOpen)}>
```

### 2. Action Butonları

**Kanal Oluştur:**
```tsx
{role !== MemberRole.GUEST && sectionType === "channels" && (
  <button onClick={() => onOpen("createChannel", { channelType })}>
    <Plus />
  </button>
)}
```

**Üyeleri Yönet:**
```tsx
{role === MemberRole.ADMIN && sectionType === "members" && (
  <button onClick={() => onOpen("members", { server })}>
    <Settings />
  </button>
)}
```

### 3. Hover Efektleri

**Group Hover:**
- Header: `group` class
- Badge: `group-hover:bg-zinc-600/50`
- Buttons: `opacity-0 group-hover:opacity-100`

## 🎨 Animasyon Detayları

### Chevron Rotasyon

```css
/* Açık */
transform: rotate(0deg);

/* Kapalı */
transform: rotate(-90deg);

/* Transition */
transition: transform 300ms;
```

### Content Slide

```css
/* Açık */
max-height: 2000px;
opacity: 1;

/* Kapalı */
max-height: 0;
opacity: 0;

/* Transition */
transition: all 300ms ease-in-out;
```

### Hover Efektleri

```css
/* Normal */
background: transparent;
border: 1px solid transparent;

/* Hover */
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.1);

/* Transition */
transition: all 200ms;
```

## 📱 Responsive Davranış

### Desktop
- Tam özellikler
- Hover efektleri aktif
- Smooth animasyonlar

### Mobile
- Touch-friendly
- Daha büyük tıklama alanı
- Optimize animasyonlar

## 🎯 Kullanıcı Deneyimi

### Açma/Kapama
1. Header'a tıkla
2. Chevron döner
3. Content slide yapar
4. Smooth animasyon

### Hover
1. Mouse header'a gelir
2. Arka plan değişir
3. Border belirir
4. Butonlar fade in yapar

### Kanal Oluşturma
1. Hover yap
2. Plus butonuna tıkla
3. Modal açılır
4. Kanal oluştur

## 🔮 Gelecek İyileştirmeler

### Planlanan Özellikler
- [ ] Drag & drop ile sıralama
- [ ] Sağ tık menüsü
- [ ] Keyboard shortcuts
- [ ] Bölüm renklendirme
- [ ] İkon özelleştirme

### Animasyon İyileştirmeleri
- [ ] Spring animasyonları
- [ ] Stagger efekti
- [ ] Parallax scroll
- [ ] Micro-interactions

## 🎉 Sonuç

Modern, açılır-kapanır kanal bölümleri başarıyla eklendi!

**Özellikler:**
✅ Smooth açılma/kapanma
✅ Chevron rotasyon animasyonu
✅ Kanal sayısı badge
✅ Hover efektleri
✅ Action butonları
✅ Glassmorphism tasarım
✅ Responsive
✅ Performanslı

**Test Edildi:**
✅ Açma/Kapama ✓
✅ Hover efektleri ✓
✅ Action butonları ✓
✅ Animasyonlar ✓
✅ Count badge ✓

---

**Güncelleme Tarihi**: 8 Kasım 2024
**Versiyon**: 3.0.0
**Durum**: ✅ Tamamlandı
