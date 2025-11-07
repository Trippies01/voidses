# Discord Clone - Full Stack Next.js 14 Uygulaması

Bu proje, Discord'un temel özelliklerini içeren bir full-stack web uygulamasıdır.

## 🚀 Özellikler

- ✅ Real-time mesajlaşma (Socket.io)
- ✅ Sesli ve görüntülü görüşme (LiveKit)
- ✅ Server/Kanal sistemi
- ✅ Üye yönetimi (Admin/Moderator/Guest rolleri)
- ✅ Dosya paylaşımı (UploadThing)
- ✅ 1:1 direkt mesajlaşma
- ✅ Infinite scroll mesajlar
- ✅ Dark/Light mode
- ✅ Authentication (Clerk)
- ✅ MySQL Database (PlanetScale)

## 🛠️ Teknolojiler

- **Next.js 14** - React Framework (App Router)
- **TypeScript** - Type Safety
- **Socket.io** - Real-time Communication
- **Prisma** - ORM
- **PostgreSQL** - Database (Neon)
- **Clerk** - Authentication
- **LiveKit** - Video/Audio Calls
- **UploadThing** - File Upload
- **TailwindCSS** - Styling
- **Radix UI** - UI Components

## 📋 Kurulum

### 1. Paketleri Yükleyin

```bash
npm install
```

### 2. Environment Variables

`env-template.txt` dosyasını `.env` olarak kopyalayıp aşağıdaki değerleri doldurun:

#### Clerk (Authentication)
1. https://clerk.com adresine gidin
2. Yeni uygulama oluşturun
3. API Keys kısmından değerleri kopyalayın:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

#### Neon (Database) - PostgreSQL
1. https://neon.tech adresine gidin
2. "Sign Up" → GitHub ile giriş yapın
3. "Create a project" butonuna tıklayın
4. Project name: **discord-clone** yazın
5. Region: Size en yakın olanı seçin
6. PostgreSQL version: **16** (default)
7. "Create project" tıklayın
8. **Connection string** otomatik gösterilecek
9. "Prisma" sekmesinden connection string'i kopyalayın:
```
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

#### UploadThing (File Upload)
1. https://uploadthing.com adresine gidin
2. Yeni app oluşturun
3. API keys kopyalayın:
```
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
```

#### LiveKit (Video/Audio)
1. https://livekit.io adresine gidin
2. Yeni project oluşturun
3. Keys kopyalayın:
```
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
NEXT_PUBLIC_LIVEKIT_URL=wss://...
```

### 3. Database Setup

```bash
# Prisma Client'ı oluştur
npx prisma generate

# Database'i push et (PlanetScale için)
npx prisma db push
```

### 4. Uygulamayı Çalıştırın

```bash
npm run dev
```

Tarayıcınızda http://localhost:3000 adresine gidin.

## 📁 Proje Yapısı

```
discord-clone/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main app routes
│   └── api/               # API routes
├── components/             # React components
│   ├── ui/                # UI components
│   ├── providers/         # Context providers
│   └── modals/            # Modal components
├── lib/                   # Utility functions
├── prisma/                # Database schema
└── pages/api/socket/      # Socket.io handlers
```

## 🎯 Sonraki Adımlar

1. `.env` dosyasını oluşturun ve tüm API keys'leri doldurun
2. `npx prisma generate` komutunu çalıştırın
3. `npx prisma db push` ile database'i oluşturun
4. `npm run dev` ile uygulamayı başlatın

## 📝 Notlar

- Neon ücretsiz plan: 512 MB storage, 3 GB data transfer/ay
- Neon'da otomatik SSL/TLS şifreleme var
- Clerk'te email/Google/GitHub authentication'ı aktifleştirin
- UploadThing'de dosya boyutu limitlerini ayarlayın
- LiveKit'te test project kullanabilirsiniz (ücretsiz)

## 🐛 Sorun Giderme

### Prisma Hatası
```bash
npx prisma generate
```

### Database Connection Hatası
- Neon'da database'in çalıştığından emin olun
- DATABASE_URL'in doğru olduğunu kontrol edin
- Connection string sonunda `?sslmode=require` olmalı

### Socket.io Hatası
- Dev mode'da hot reload sorunlar yaratabilir
- Sayfayı yenileyin veya sunucuyu yeniden başlatın

## 📚 Kaynaklar

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Socket.io Documentation](https://socket.io/docs)
- [LiveKit Documentation](https://docs.livekit.io)

---

**Yapımcı:** Full Stack Discord Clone Tutorial
**Versiyon:** 1.0.0

