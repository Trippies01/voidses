# 🚫 Kanaldan Atma Özelliği

## ✨ Özellik Özeti

Ses kanallarında **Admin** ve **Moderator** yetkisine sahip kullanıcılar, diğer kullanıcılara sağ tıklayarak onları kanaldan atabilir.

## 🎯 Özellikler

### 1. **Sağ Tık Menüsü**
- **Sidebar'daki kullanıcı listesinden** sağ tıklayınca context menu açılır
- **Ses kanalı içindeki kullanıcı kartlarından** sağ tıklayınca context menu açılır
- "Kanaldan At" seçeneği sadece admin/moderator için görünür
- Kendi kendini atamaz (isLocal kontrolü)
- Admin kullanıcıları atamazsınız

### 2. **Yetki Kontrolü**
- **ADMIN**: Tüm kullanıcıları atabilir (diğer adminler hariç)
- **MODERATOR**: Normal kullanıcıları atabilir
- **GUEST**: Kimseyi atamaz

### 3. **Otomatik Disconnect**
- Atılan kullanıcı otomatik olarak kanaldan çıkar
- 2 saniyede bir voice-state kontrolü yapılır
- Kick edildiğinde anında disconnect olur
- Toast bildirimi gösterilir

### 4. **Ses Efektleri**
- Kullanıcı atıldığında "leave" sesi çalar
- Toast bildirimi gösterilir

## 🔧 Teknik Detaylar

### Backend API

#### 1. **Kick Endpoint**
```typescript
POST /api/members/[memberId]/kick
Body: {
  channelId: string,
  serverId: string
}
```

**Kontroller:**
- Requester admin veya moderator mi?
- Target member admin mi? (Admin atamazsınız)
- Member voice channel'da mı?

**İşlem:**
- Member'ın `currentChannelId` null yapılır
- `isMuted` ve `isDeafened` false yapılır
- Success response döner

#### 2. **Voice State GET Endpoint**
```typescript
GET /api/members/[memberId]/voice-state
Response: {
  currentChannelId: string | null,
  isMuted: boolean,
  isDeafened: boolean
}
```

### Frontend

#### 1. **Member Role Prop**
```typescript
<ModernVoiceChannel
  memberRole={member.role} // "ADMIN" | "MODERATOR" | "GUEST"
/>
```

#### 2. **Context Menu**
```typescript
isAdmin={memberRole === "ADMIN" || memberRole === "MODERATOR"}
```

#### 3. **Kick Handler**
```typescript
onKick={async () => {
  const targetMemberId = contextMenu.participant.metadata;
  await axios.post(`/api/members/${targetMemberId}/kick`, {
    channelId: room.name,
    serverId: serverId,
  });
}}
```

#### 4. **Auto Disconnect Check**
```typescript
// Her 2 saniyede bir kontrol
const checkKicked = setInterval(async () => {
  const response = await axios.get(`/api/members/${memberId}/voice-state`);
  if (response.data.currentChannelId === null) {
    handleDisconnect();
  }
}, 2000);
```

### LiveKit Metadata

Member ID, LiveKit token'ına metadata olarak eklenir:

```typescript
const at = new AccessToken(apiKey, apiSecret, { 
  identity: username,
  metadata: memberId, // Member ID burada saklanır
});
```

Context menu'de participant.metadata ile erişilir.

## 🎨 Kullanıcı Deneyimi

### Kick Eden Kullanıcı (Sidebar):
1. **Sidebar'daki ses kanalı altındaki kullanıcıya** sağ tıklar
2. "Kanaldan At" seçeneğini görür (admin/moderator ise)
3. Tıklar
4. Kullanıcı listesi otomatik güncellenir
5. Kullanıcı listeden kaybolur

### Kick Eden Kullanıcı (Kanal İçi):
1. **Ses kanalı içindeki kullanıcı kartına** sağ tıklar
2. "Kanaldan At" seçeneğini görür (admin/moderator ise)
3. Tıklar
4. Toast: "Kullanıcı kanaldan atıldı"
5. Leave sesi çalar

### Kick Edilen Kullanıcı:
1. 2 saniye içinde otomatik disconnect olur
2. Ana sunucu sayfasına yönlendirilir
3. Voice state temizlenir
4. Sidebar'daki listeden kaybolur

## 🔒 Güvenlik

- ✅ Backend'de yetki kontrolü
- ✅ Admin kullanıcıları korumalı
- ✅ Kendi kendini atamaz
- ✅ Profile ID kontrolü
- ✅ Server ID doğrulaması

## 📝 Notlar

- Kick işlemi sadece voice channel'dan atar, sunucudan atmaz
- Kullanıcı tekrar kanala girebilir
- Ban özelliği ayrı bir özelliktir
- Kick geçmişi tutulmaz (isterseniz eklenebilir)

## 🚀 Gelecek İyileştirmeler

- [ ] Kick geçmişi (log)
- [ ] Kick nedeni ekleme
- [ ] Geçici ban (timeout)
- [ ] Kick bildirimi (DM)
- [ ] Kick istatistikleri
- [ ] Undo kick özelliği

## ✅ Test Senaryoları

### Sidebar Context Menu:
1. **Admin kick normal user from sidebar** ✅
2. **Moderator kick normal user from sidebar** ✅
3. **Guest cannot see kick option in sidebar** ✅
4. **Cannot kick admin from sidebar** ✅
5. **Cannot kick self from sidebar** ✅
6. **User list updates after kick** ✅

### In-Channel Context Menu:
1. **Admin kick normal user from channel** ✅
2. **Moderator kick normal user from channel** ✅
3. **Guest cannot see kick option in channel** ✅
4. **Cannot kick admin from channel** ✅
5. **Cannot kick self from channel** ✅
6. **Auto disconnect works** ✅
7. **Toast notification shows** ✅
8. **Sound plays** ✅
