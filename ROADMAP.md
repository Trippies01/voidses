# 🎮 DISCORD CLONE - COMPLETE ROADMAP 2024-2025
## Discord %99 Similarity Implementation Plan

> **🎯 HEDEF:** Discord'un tüm temel ve gelişmiş özelliklerini eksiksiz implement etmek  
> **📊 KAPSAM:** 180+ Feature, UI/UX %99 similarity  
> **⏱️ TAHMİNİ SÜRE:** 10-15 saat (Full implementation)  
> **💡 STRATEJI:** Önce kritik eksikler, sonra Discord'un advanced features

---

## 📊 MEVCUT DURUM ANALİZİ

### ✅ TAMAMLANMIŞ (Phase 1)
**Completion:** ~45% of Discord features

#### 🏗️ Core Infrastructure (100%)
- [x] Next.js 14 App Router + TypeScript
- [x] Neon PostgreSQL + Prisma ORM  
- [x] Clerk Authentication
- [x] Socket.io Real-time engine
- [x] UploadThing File upload
- [x] LiveKit WebRTC (Audio/Video)
- [x] TailwindCSS + shadcn/ui
- [x] React Query (TanStack Query)

#### 🎨 Basic UI/UX (65%)
- [x] 3-panel Discord layout
- [x] Dark/Light theme toggle
- [x] Mobile responsive design
- [x] Navigation Sidebar
- [x] Server Sidebar
- [x] Chat panel
- [x] User Footer panel
- [ ] ❌ Channel categories (görsel organize)
- [ ] ❌ User settings modal
- [ ] ❌ Compact mode
- [ ] ❌ Zoom levels
- [ ] ❌ Keyboard shortcuts
- [ ] ❌ Accessibility mode

#### 💬 Chat System (55%)
- [x] Real-time messaging
- [x] Message CRUD
- [x] Basic emoji picker
- [x] File/Image upload
- [x] Infinite scroll
- [x] Timestamps
- [x] Edit indicators
- [x] @Mentions (basic)
- [x] Message reactions (basic)
- [x] Pinned messages (basic)
- [ ] ❌ **Rich Text Editor** (Markdown support)
- [ ] ❌ **Threads/Replies**
- [ ] ❌ **GIF Picker** (Tenor/Giphy)
- [ ] ❌ **Stickers**
- [ ] ❌ **Voice Messages**
- [ ] ❌ **Code Blocks** (syntax highlight)
- [ ] ❌ **Link Embeds** (preview)
- [ ] ❌ **Spoiler Tags**
- [ ] ❌ **Quote Reply**
- [ ] ❌ **Message Search**
- [ ] ❌ **Message Bookmarks**
- [ ] ❌ **Message Forwarding**
- [ ] ❌ **Typing Indicators** (improved)

#### 🖥️ Server Management (45%)
- [x] Server CRUD
- [x] Invite links
- [x] Join server
- [x] Basic member management
- [x] Simple roles (Admin/Mod/Guest)
- [ ] ❌ **Advanced Role System** (40+ permissions)
- [ ] ❌ **Role Colors & Hoisting**
- [ ] ❌ **Server Discovery**
- [ ] ❌ **Server Templates**
- [ ] ❌ **Welcome Screen**
- [ ] ❌ **Rules Channel**
- [ ] ❌ **Verification Levels**
- [ ] ❌ **Auto-moderation**
- [ ] ❌ **Server Insights**
- [ ] ❌ **Vanity URL**
- [ ] ❌ **Server Boost**
- [ ] ❌ **Audit Logs**

#### 📺 Channel System (40%)
- [x] TEXT channels
- [x] AUDIO channels
- [x] VIDEO channels
- [x] Basic channel CRUD
- [ ] ❌ **Channel Categories** (organize)
- [ ] ❌ **Channel Permissions** (role-based)
- [ ] ❌ **NSFW Channels**
- [ ] ❌ **Slowmode**
- [ ] ❌ **Channel Topics**
- [ ] ❌ **Announcement Channels**
- [ ] ❌ **Stage Channels**
- [ ] ❌ **Forum Channels**
- [ ] ❌ **Private Channels**
- [ ] ❌ **Channel Webhooks**

---

## 🚀 PHASE 2 - KRİTİK EKSİKLER (ÖNCE BUNLAR)
**Hedef:** Discord'un temel özelliklerini %85'e çıkar  
**Toplam Süre:** ~3 saat

---

### 🔥 GRUP 1: TEMEL SOSYAL ÖZELLİKLER (1 saat)

#### 1️⃣ **DIRECT MESSAGES IYILEŞTIRME**
**Süre:** 20 dakika | Öncelik: 🔥🔥🔥

**Neden Önemli:**
- Discord'un %40'ı DM kullanımı
- Şu anda sadece basic conversation var
- Gelişmiş DM features eksik

**Yapılacaklar:**

**A) DM List UI (Sol Sidebar)** (8 dk)
```typescript
// components/navigation/navigation-dm-list.tsx
- DM conversation listesi
- Son mesaj preview
- Unread count badge
- Online status indicators
- Search DM conversations
- Pin important DMs
```

**B) DM Notifications** (5 dk)
```typescript
// Unread DM tracking
- Red badge count
- Desktop notifications
- Sound alerts
- Mute specific conversations
```

**C) DM Settings** (4 dk)
```typescript
// Per-DM settings
- Mute conversation
- Pin conversation
- Close conversation
- Block user
- Message requests (from non-friends)
```

**D) Group DMs** (3 dk - optional)
```prisma
model GroupConversation {
  id String @id @default(uuid())
  name String?
  iconUrl String?
  ownerId String
  members Member[]
  messages DirectMessage[]
}
```

**Test:**
- [ ] DM listesi görünüyor mu?
- [ ] Unread count doğru mu?
- [ ] Bildirimler çalışıyor mu?

---

#### 2️⃣ **FRIEND SYSTEM** ⭐ NEW!
**Süre:** 25 dakika | Öncelik: 🔥🔥🔥

**Neden Önemli:**
- Discord'un core social feature'ı
- Şu anda YOK!
- DM için friend olmak şart değil ama önemli

**Yapılacaklar:**

**A) Prisma Schema** (3 dk)
```prisma
enum FriendshipStatus {
  PENDING
  ACCEPTED
  BLOCKED
}

model Friendship {
  id String @id @default(uuid())
  
  requesterId String
  requester Profile @relation("FriendRequester", ...)
  
  addresseeId String
  addressee Profile @relation("FriendAddressee", ...)
  
  status FriendshipStatus @default(PENDING)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([requesterId, addresseeId])
  @@index([requesterId, status])
  @@index([addresseeId, status])
}
```

**B) Friend Request API** (8 dk)
```typescript
// app/api/friends/route.ts
POST   - Send friend request
GET    - Get all friends
DELETE - Remove friend

// app/api/friends/[friendId]/route.ts
PATCH  - Accept/Decline request
DELETE - Remove friend
```

**C) Friends Tab UI** (10 dk)
```typescript
// app/(main)/friends/page.tsx

Tabs:
1. Online Friends
2. All Friends
3. Pending Requests
4. Blocked Users
5. Add Friend

// components/friends/friend-list.tsx
- Avatar + Username
- Online status
- Message button
- Call button (voice/video)
- Remove friend button
```

**D) Friend Request Notifications** (4 dk)
```typescript
// Red badge on Friends tab
// Toast notification
// Socket.io event: "friend:request"
```

**Test:**
- [ ] Friend request gönderilebiliyor mu?
- [ ] Bildirim geliyor mu?
- [ ] Accept/Decline çalışıyor mu?
- [ ] Friend listesi görünüyor mu?

---

#### 3️⃣ **USER PROFILES & STATUS** ⭐ IMPROVED
**Süre:** 15 dakika | Öncelik: 🔥🔥

**Yapılacaklar:**

**A) User Status System** (8 dk)
```prisma
enum UserStatus {
  ONLINE
  IDLE
  DO_NOT_DISTURB
  INVISIBLE
  OFFLINE
}

model Profile {
  // ... existing
  status UserStatus @default(ONLINE)
  customStatus String? // "🎮 Playing Valorant"
  statusEmoji String?
}
```

**B) Status UI** (4 dk)
```typescript
// components/user-status-picker.tsx
- Online (yeşil)
- Idle (sarı - 10dk idle)
- Do Not Disturb (kırmızı)
- Invisible (gri)

// Custom status modal
- Emoji picker
- Custom text
- Clear after: 30m, 1h, 4h, Today
```

**C) Rich Presence** (3 dk - optional)
```typescript
// "Playing Spotify"
// "Watching YouTube"
// "In Voice Channel: #genel"
```

**Test:**
- [ ] Status değişimi çalışıyor mu?
- [ ] Custom status görünüyor mu?
- [ ] Status tüm yerlerde sync mu?

---

### 🔥 GRUP 2: CHAT GELİŞTİRMELERİ (1 saat)

#### 4️⃣ **RICH TEXT EDITOR (Markdown)** ⭐ NEW!
**Süre:** 30 dakika | Öncelik: 🔥🔥🔥

**Neden Önemli:**
- Discord'un en çok kullanılan özelliği
- Şu anda sadece plain text var
- **Bold**, *italic*, `code`, ~~strikethrough~~ eksik

**Yapılacaklar:**

**A) Markdown Parser** (10 dk)
```bash
npm install react-markdown remark-gfm rehype-highlight
```

```typescript
// lib/markdown-parser.ts
export function parseMarkdown(content: string) {
  // **bold** -> <strong>bold</strong>
  // *italic* -> <em>italic</em>
  // ~~strike~~ -> <del>strike</del>
  // `code` -> <code>code</code>
  // ```js
  // code block
  // ``` -> <pre><code class="language-js">
  // > quote -> <blockquote>
  // [link](url) -> <a>
  // ||spoiler|| -> <span class="spoiler">
}
```

**B) Chat Input Toolbar** (12 dk)
```typescript
// components/chat/chat-input-toolbar.tsx

Buttons:
[B] Bold
[I] Italic
[S] Strike
[`] Code
[>] Quote
[:)] Emoji
[🎁] Sticker
[GIF] Gif picker
[📎] File upload
```

**C) Message Renderer** (8 dk)
```typescript
// components/chat/message-content.tsx
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  components={{
    code: CodeBlock,
    a: SafeLink,
    blockquote: Quote,
    // ...
  }}
>
  {content}
</ReactMarkdown>
```

**Test:**
- [ ] **Bold** render oluyor mu?
- [ ] `code blocks` çalışıyor mu?
- [ ] > Quote görünüyor mu?

---

#### 5️⃣ **GIF PICKER (Tenor Integration)** ⭐ NEW!
**Süre:** 15 dakika | Öncelik: 🔥🔥

**Yapılacaklar:**

**A) Tenor API Setup** (3 dk)
```bash
# .env
TENOR_API_KEY=your_key_here
```

```typescript
// lib/tenor.ts
export async function searchGifs(query: string) {
  const res = await fetch(
    `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&limit=20`
  );
  return res.json();
}
```

**B) GIF Picker Component** (10 dk)
```typescript
// components/chat/gif-picker.tsx

Features:
- Search bar
- Trending GIFs
- Grid layout
- Click to send
- Preview on hover
```

**C) Send GIF as Message** (2 dk)
```typescript
// Store GIF URL as message content
// Render as image in chat
```

**Test:**
- [ ] GIF search çalışıyor mu?
- [ ] GIF gönderimi çalışıyor mu?

---

#### 6️⃣ **LINK EMBEDS & PREVIEWS** ⭐ NEW!
**Süre:** 15 dakika | Öncelik: 🔥🔥

**Yapılacaklar:**

**A) Link Detection** (5 dk)
```typescript
// lib/link-detector.ts
export function detectLinks(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.match(urlRegex) || [];
}
```

**B) Open Graph Scraper** (8 dk)
```bash
npm install oembed-parser
```

```typescript
// app/api/embeds/route.ts
import { extract } from "oembed-parser";

export async function POST(req: Request) {
  const { url } = await req.json();
  
  const data = await extract(url);
  
  return NextResponse.json({
    title: data.title,
    description: data.description,
    image: data.thumbnail_url,
    siteName: data.provider_name,
  });
}
```

**C) Embed Card Component** (2 dk)
```typescript
// components/chat/link-embed.tsx

┌─────────────────────────────┐
│ [Site Icon] Site Name       │
│ **Title**                   │
│ Description...              │
│ [Preview Image]             │
└─────────────────────────────┘
```

**Test:**
- [ ] YouTube link → Video embed
- [ ] Twitter link → Tweet embed
- [ ] Image link → Image preview

---

### 🔥 GRUP 3: SERVER YÖNETİMİ (1 saat)

#### 7️⃣ **CHANNEL CATEGORIES** ⭐ NEW!
**Süre:** 20 dakika | Öncelik: 🔥🔥🔥

**Neden Önemli:**
- Discord'da kanallar organize edilir
- Şu anda tüm kanallar düz liste
- Görsel hiyerarşi eksik

**Yapılacaklar:**

**A) Prisma Schema** (3 dk)
```prisma
model Category {
  id String @id @default(uuid())
  name String
  position Int @default(0)
  
  serverId String
  server Server @relation(...)
  
  channels Channel[]
  
  createdAt DateTime @default(now())
  
  @@index([serverId, position])
}

model Channel {
  // ... existing fields
  categoryId String?
  category Category?
  position Int @default(0)
}
```

**B) Category CRUD API** (5 dk)
```typescript
// app/api/categories/route.ts
POST - Create category
GET  - List categories

// app/api/categories/[categoryId]/route.ts
PATCH  - Edit category
DELETE - Delete category (channels → null)
```

**C) Category UI** (10 dk)
```typescript
// components/server/server-category.tsx

▼ TEXT CHANNELS
  # genel
  # sohbet
▼ VOICE CHANNELS
  🔊 Sesli Sohbet
▼ INFO
  # kurallar
  # duyurular
```

**D) Drag & Drop Sort** (2 dk - optional)
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

**Test:**
- [ ] Category oluşturuluyor mu?
- [ ] Kanallar category altında mı?
- [ ] Collapse/expand çalışıyor mu?

---

#### 8️⃣ **ADVANCED ROLE SYSTEM** ⭐ MAJOR UPDATE
**Süre:** 25 dakika | Öncelik: 🔥🔥

**Şu anki durum:**
- Sadece 3 rol: Admin, Moderator, Guest
- Özelleştirme yok
- Discord'da 20+ farklı permission var

**Yapılacaklar:**

**A) Prisma Schema Update** (5 dk)
```prisma
model Role {
  id String @id @default(uuid())
  name String
  color String? // Hex color: #5865F2
  position Int @default(0)
  hoist Boolean @default(false) // Show separately
  mentionable Boolean @default(false)
  
  // Permissions (bitwise)
  permissions BigInt @default(0)
  
  serverId String
  server Server @relation(...)
  
  members Member[]
  
  createdAt DateTime @default(now())
  
  @@index([serverId, position])
}

model Member {
  // ... existing
  roleIds String[] // Multiple roles!
  roles Role[]
}
```

**B) Permission System** (12 dk)
```typescript
// lib/permissions.ts

export enum Permission {
  // General
  VIEW_CHANNELS = 1 << 0,        // 1
  MANAGE_CHANNELS = 1 << 1,      // 2
  MANAGE_ROLES = 1 << 2,         // 4
  MANAGE_SERVER = 1 << 3,        // 8
  
  // Text Channels
  SEND_MESSAGES = 1 << 4,        // 16
  EMBED_LINKS = 1 << 5,          // 32
  ATTACH_FILES = 1 << 6,         // 64
  ADD_REACTIONS = 1 << 7,        // 128
  MENTION_EVERYONE = 1 << 8,     // 256
  MANAGE_MESSAGES = 1 << 9,      // 512
  READ_MESSAGE_HISTORY = 1 << 10, // 1024
  
  // Voice Channels
  CONNECT = 1 << 11,             // 2048
  SPEAK = 1 << 12,               // 4096
  MUTE_MEMBERS = 1 << 13,        // 8192
  DEAFEN_MEMBERS = 1 << 14,      // 16384
  MOVE_MEMBERS = 1 << 15,        // 32768
  
  // Advanced
  ADMINISTRATOR = 1 << 16,       // 65536
  KICK_MEMBERS = 1 << 17,        
  BAN_MEMBERS = 1 << 18,
}

export function hasPermission(roles: Role[], permission: Permission): boolean {
  return roles.some(role => {
    if (role.permissions & Permission.ADMINISTRATOR) return true;
    return (role.permissions & permission) === permission;
  });
}
```

**C) Role Management UI** (8 dk)
```typescript
// components/modals/manage-roles-modal.tsx

Roles List:
- @everyone (default)
- @Admin (red)
- @Moderators (blue)
- @Members (gray)
+ Create Role

Edit Role:
- Role name
- Role color picker
- Permissions checklist
- Display separately (hoist)
- Allow mention
- Delete role button
```

**Test:**
- [ ] Custom role oluşturuluyor mu?
- [ ] Permissions çalışıyor mu?
- [ ] Role renkleri görünüyor mu?

---

#### 9️⃣ **CHANNEL PERMISSIONS (Per-Role)** ⭐ NEW!
**Süre:** 15 dakika | Öncelik: 🔥🔥

**Yapılacaklar:**

**A) Prisma Schema** (3 dk)
```prisma
model ChannelPermission {
  id String @id @default(uuid())
  
  channelId String
  channel Channel @relation(...)
  
  roleId String?
  role Role?
  
  memberId String?
  member Member?
  
  allow BigInt @default(0)
  deny BigInt @default(0)
  
  @@unique([channelId, roleId])
  @@unique([channelId, memberId])
}
```

**B) Permission Check Function** (5 dk)
```typescript
// lib/channel-permissions.ts

export async function canAccessChannel(
  member: Member,
  channel: Channel
): Promise<boolean> {
  // 1. Check channel permissions
  const perms = await getChannelPermissions(channel.id, member);
  
  // 2. Check deny first
  if (perms.deny & Permission.VIEW_CHANNELS) return false;
  
  // 3. Check allow
  if (perms.allow & Permission.VIEW_CHANNELS) return true;
  
  // 4. Check role permissions
  return hasPermission(member.roles, Permission.VIEW_CHANNELS);
}
```

**C) Channel Settings UI** (7 dk)
```typescript
// components/modals/channel-settings-modal.tsx

Tabs:
1. Overview (name, topic, slowmode)
2. Permissions
   - @everyone: View, Send Messages ✅
   - @Admin: All permissions ✅
   - @Guest: View ✅, Send ❌
   + Add Role/Member
3. Advanced
```

**Test:**
- [ ] Private channel oluşturuluyor mu?
- [ ] Sadece izinli roller görebiliyor mu?

---

## 🎨 PHASE 3 - UI/UX GELİŞTİRMELERİ (2 saat)
**Hedef:** Discord UI'ını pixel-perfect clone'la

---

### 1️⃣0️⃣ **USER SETTINGS PANEL** ⭐ NEW!
**Süre:** 35 dakika | Öncelik: 🔥🔥🔥

**Şu anda yok!** Discord'un dev settings menu'su eksik.

**Yapılacaklar:**

**A) Settings Modal Structure** (10 dk)
```typescript
// components/modals/user-settings-modal.tsx

Left Sidebar:
├── USER SETTINGS
│   ├── My Account
│   ├── Profiles
│   ├── Privacy & Safety
│   ├── Authorized Apps
│   └── Devices
├── APP SETTINGS
│   ├── Appearance
│   ├── Accessibility
│   ├── Voice & Video
│   ├── Text & Images
│   ├── Notifications
│   ├── Keybinds
│   ├── Language
│   └── Streamer Mode
└── ACTIVITY SETTINGS
    └── Activity Privacy
```

**B) My Account Tab** (8 dk)
```typescript
Features:
- Username change
- Email (read-only - Clerk)
- Avatar upload
- Banner upload (premium feature)
- Account deletion
```

**C) Appearance Tab** (10 dk)
```typescript
Features:
- Theme: Dark / Light
- Message Display: Cozy / Compact
- Zoom: 90% - 200%
- Font Size: 12-20px
- Color Blind Mode
- Chat Font: Discord, Roboto, Noto Sans
```

**D) Keybinds Tab** (7 dk)
```typescript
Keybinds:
Ctrl+K: Quick Switcher
Ctrl+/: Search
Esc: Mark as Read
Ctrl+Shift+M: Toggle Mute
Ctrl+Shift+D: Toggle Deafen
```

**Test:**
- [ ] Settings açılıyor mu?
- [ ] Appearance değişiklikleri persist ediyor mu?

---

### 1️⃣1️⃣ **SEARCH SYSTEM (Global & Channel)** ⭐ NEW!
**Süre:** 25 dakika | Öncelik: 🔥🔥

**Yapılacaklar:**

**A) Search API** (10 dk)
```typescript
// app/api/search/route.ts

Query Parameters:
- q: search query
- channelId: specific channel (optional)
- from: user filter
- has: attachment/link/embed
- before/after: date range

// Prisma full-text search
const messages = await db.message.findMany({
  where: {
    OR: [
      { content: { contains: query, mode: 'insensitive' } },
      { member: { profile: { name: { contains: from } } } }
    ],
    channelId: channelId || undefined,
    createdAt: {
      gte: after,
      lte: before
    }
  },
  include: {
    member: { include: { profile: true } },
    reactions: true,
  },
  orderBy: { createdAt: 'desc' },
  take: 25
});
```

**B) Search UI** (12 dk)
```typescript
// components/search/search-modal.tsx

┌─────────────────────────────────────┐
│ Search in: #genel           [Ctrl+F]│
│ ┌─────────────────────────────────┐ │
│ │ Find messages...                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Filters:                            │
│ [From: @username]  [Has: image]    │
│ [Date: Last 7 days]                 │
│                                     │
│ Results (125):                      │
│ ┌─────────────────────────────────┐ │
│ │ @User: search query merhaba...  │ │
│ │ 2 days ago                      │ │
│ ├─────────────────────────────────┤ │
│ │ @Another: başka mesaj...        │ │
│ │ 5 days ago                      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**C) Quick Switcher (Ctrl+K)** (3 dk)
```typescript
// Quick jump to channels/DMs
- Fuzzy search
- Recent channels
- Keyboard navigation
```

**Test:**
- [ ] Search çalışıyor mu?
- [ ] Filters doğru mu?
- [ ] Ctrl+K açılıyor mu?

---

### 1️⃣2️⃣ **NOTIFICATION SYSTEM** ⭐ MAJOR
**Süre:** 30 dakika | Öncelik: 🔥🔥🔥

**Yapılacaklar:**

**A) Notification Types** (8 dk)
```prisma
enum NotificationType {
  ALL_MESSAGES
  ONLY_MENTIONS
  NOTHING
  CUSTOM
}

model NotificationSettings {
  id String @id
  
  profileId String @unique
  profile Profile @relation(...)
  
  // Global settings
  desktopNotifications Boolean @default(true)
  soundEnabled Boolean @default(true)
  pushNotifications Boolean @default(true)
  
  // Per-server override
  serverSettings Json // { serverId: NotificationType }
  
  // Per-channel override
  channelSettings Json // { channelId: NotificationType }
  
  // Muted channels
  mutedChannels String[]
  mutedUntil Json // { channelId: timestamp }
}
```

**B) Unread Badge System** (10 dk)
```typescript
// components/unread-badge.tsx

Types:
1. White badge - New messages
2. Red badge - Mentions (@you, @everyone)
3. No badge - Muted channel

// Track per channel
model ChannelRead {
  // ... existing
  unreadCount Int @default(0)
  mentionCount Int @default(0)
}
```

**C) Desktop Notifications** (8 dk)
```typescript
// lib/notifications.ts

export async function sendNotification(message: Message) {
  // Check permissions
  if (Notification.permission !== 'granted') {
    await Notification.requestPermission();
  }
  
  // Check settings
  const settings = await getUserNotificationSettings();
  if (!settings.desktopNotifications) return;
  
  // Send notification
  new Notification(`${message.member.profile.name} in #${message.channel.name}`, {
    body: message.content,
    icon: message.member.profile.imageUrl,
    badge: '/discord-icon.png',
    tag: message.channelId,
  });
}
```

**D) Notification Settings UI** (4 dk)
```typescript
// Right-click channel → Notification Settings
- All Messages
- Only @mentions
- Nothing
- Mute for: 15m, 1h, 8h, 24h, Until I turn it back on
```

**Test:**
- [ ] Unread count doğru mu?
- [ ] Desktop notification geliyor mu?
- [ ] Mute çalışıyor mu?

---

### 1️⃣3️⃣ **MESSAGE THREADS/REPLIES** ⭐ NEW!
**Süre:** 30 dakika | Öncelik: 🔥🔥

**Discord'un çok kullanılan özelliği!**

**Yapılacaklar:**

**A) Prisma Schema** (5 dk)
```prisma
model Thread {
  id String @id @default(uuid())
  name String
  
  starterMessageId String @unique
  starterMessage Message @relation("ThreadStarter", ...)
  
  channelId String
  channel Channel @relation(...)
  
  archived Boolean @default(false)
  locked Boolean @default(false)
  
  messages Message[] @relation("ThreadMessages")
  
  createdAt DateTime @default(now())
  archivedAt DateTime?
  
  @@index([channelId, archived])
}

model Message {
  // ... existing
  threadId String?
  thread Thread? @relation("ThreadMessages", ...)
  
  starterThread Thread? @relation("ThreadStarter", ...)
}
```

**B) Thread API** (8 dk)
```typescript
// app/api/threads/route.ts
POST - Create thread from message

// app/api/threads/[threadId]/route.ts
PATCH - Archive/Lock thread
DELETE - Delete thread

// app/api/threads/[threadId]/messages/route.ts
GET - Get thread messages
POST - Send message to thread
```

**C) Thread UI** (15 dk)
```typescript
// components/chat/thread-preview.tsx

In main chat:
┌─────────────────────────────────────┐
│ @User: Ana mesaj buraya gelir       │
│ ┌─────────────────────────────────┐ │
│ │ 💬 Thread: Tartışma              │ │
│ │ 5 mesaj • Son: 10m önce         │ │
│ │ [View Thread →]                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

// Thread side panel
│ [← Back to #genel]                  │
│ Thread: Tartışma                    │
│ ─────────────────────────────────── │
│ Messages in thread...               │
```

**D) Thread Actions** (2 dk)
```typescript
// Message hover menu:
- Start Thread
- Quote Reply (simpler alternative)
```

**Test:**
- [ ] Thread oluşturuluyor mu?
- [ ] Thread messages ayrı mı?
- [ ] Thread listesi görünüyor mu?

---

## 🎯 PHASE 4 - ADVANCED FEATURES (3 saat)
**Hedef:** Discord'un %95+ özelliklerini tamamla

---

### 1️⃣4️⃣ **VOICE/VIDEO IMPROVEMENTS**
**Süre:** 40 dakika | Öncelik: 🔥

**A) Screen Share** (12 dk)
```typescript
// LiveKit screen share
- Share entire screen
- Share application window
- Share browser tab
- Audio included
```

**B) Voice Channel UI** (15 dk)
```typescript
// Voice channel members list
┌─────────────────────────────────────┐
│ 🔊 Voice Channel Name               │
│ ─────────────────────────────────── │
│ 👤 User 1     🎤 🔊 📹              │
│ 👤 User 2     🔇 ❌ ❌              │
│ 👤 User 3     ✅ ✅ ✅              │
│ ─────────────────────────────────── │
│ [🔇 Disconnect]                     │
└─────────────────────────────────────┘

Features per user:
- Mute user (for you only)
- Adjust volume (slider)
- View profile
```

**C) Voice Activity** (8 dk)
```typescript
// Voice activity indicator
- Green ring around avatar when speaking
- Volume level meter
- Push-to-talk (PTT) support
```

**D) Noise Suppression** (5 dk)
```typescript
// LiveKit Krisp integration
- Background noise reduction
- Echo cancellation
- Toggle in settings
```

**Test:**
- [ ] Screen share çalışıyor mu?
- [ ] Voice indicators görünüyor mu?

---

### 1️⃣5️⃣ **STAGE CHANNELS** ⭐ NEW!
**Süre:** 25 dakika | Öncelik: 🔥

**Discord's podcast/event feature**

**A) Prisma Schema** (3 dk)
```prisma
enum ChannelType {
  TEXT
  AUDIO
  VIDEO
  STAGE // NEW!
}

model StageInstance {
  id String @id
  channelId String @unique
  topic String
  
  speakers String[] // Member IDs
  requestingToSpeak String[]
  
  scheduledStartTime DateTime?
  scheduledEndTime DateTime?
  
  privacyLevel StagePrivacyLevel
}

enum StagePrivacyLevel {
  PUBLIC
  GUILD_ONLY
}
```

**B) Stage API** (8 dk)
```typescript
// app/api/stages/route.ts
POST - Start stage
GET  - Get active stages

// app/api/stages/[stageId]/route.ts
PATCH - Update topic
DELETE - End stage

// app/api/stages/[stageId]/speakers/route.ts
POST - Add speaker
DELETE - Remove speaker
POST /request - Request to speak
```

**C) Stage UI** (12 dk)
```typescript
// Stage channel view
┌─────────────────────────────────────┐
│ 🎙️ STAGE: Topic here                │
│ ─────────────────────────────────── │
│ SPEAKERS (3)                        │
│ 👤 Host 🎤      [Mute] [Remove]     │
│ 👤 Speaker 1 🎤                     │
│ 👤 Speaker 2 🎤                     │
│ ─────────────────────────────────── │
│ AUDIENCE (15)                       │
│ 👤 Listener 1   [✋ Request]        │
│ 👤 Listener 2                       │
│ ─────────────────────────────────── │
│ [🎤 Request to Speak]               │
└─────────────────────────────────────┘
```

**D) Stage Scheduling** (2 dk)
```typescript
// Schedule future events
- Date/Time picker
- Automatic start/end
- Reminders/notifications
```

**Test:**
- [ ] Stage oluşturuluyor mu?
- [ ] Speaker yönetimi çalışıyor mu?

---

### 1️⃣6️⃣ **FORUM CHANNELS** ⭐ NEW!
**Süre:** 35 dakika | Öncelik: 🔥

**Modern Discord community feature**

**A) Prisma Schema** (5 dk)
```prisma
enum ChannelType {
  TEXT
  AUDIO
  VIDEO
  STAGE
  FORUM // NEW!
}

model ForumPost {
  id String @id
  title String
  
  channelId String
  channel Channel @relation(...)
  
  authorId String
  author Member @relation(...)
  
  tags String[] // ["Soru", "Yardım"]
  
  pinned Boolean @default(false)
  locked Boolean @default(false)
  
  messages Message[]
  
  createdAt DateTime @default(now())
  
  @@index([channelId, createdAt])
}

model ForumTag {
  id String @id
  name String
  emoji String?
  
  channelId String
  channel Channel @relation(...)
}
```

**B) Forum API** (10 dk)
```typescript
// app/api/forums/[channelId]/posts/route.ts
POST - Create new post
GET  - List posts (with filters)

// app/api/forums/posts/[postId]/route.ts
PATCH - Edit post title/tags
DELETE - Delete post

// app/api/forums/posts/[postId]/messages/route.ts
GET - Get post messages (thread-like)
POST - Reply to post
```

**C) Forum UI** (18 dk)
```typescript
// Forum channel view
┌─────────────────────────────────────┐
│ 📋 Forum Name          [+ New Post] │
│ ─────────────────────────────────── │
│ Filters: [All] [Unanswered] [Solved]│
│ Tags: [Soru] [Yardım] [Bug]        │
│ ─────────────────────────────────── │
│ 📌 Soru: Discord botu nasıl yapılır?│
│    @User • 15 💬 • 3h ago          │
│    Tags: [Soru] [Yardım]           │
│ ─────────────────────────────────── │
│ 💬 Yardım: API hatası                │
│    @Another • 8 💬 • 1d ago        │
│    Tags: [Bug]                     │
└─────────────────────────────────────┘

// Post detail (thread view)
- Original post
- All replies
- React, pin, lock options
```

**D) Forum Tags** (2 dk)
```typescript
// Tag management (admin only)
- Create tags
- Set emoji
- Set color
- Required tags
```

**Test:**
- [ ] Forum post oluşturuluyor mu?
- [ ] Tags filtreleme çalışıyor mu?

---

### 1️⃣7️⃣ **AUTO-MODERATION** ⭐ NEW!
**Süre:** 30 dakika | Öncelik: 🔥

**A) Auto-Mod Rules** (15 dk)
```prisma
model AutoModRule {
  id String @id
  name String
  enabled Boolean @default(true)
  
  serverId String
  server Server @relation(...)
  
  eventType AutoModEventType
  triggerType AutoModTriggerType
  triggerMetadata Json // { keywords: [], limit: 5 }
  
  actions AutoModAction[] // { type: "BLOCK_MESSAGE", metadata: {} }
  
  exemptRoles String[]
  exemptChannels String[]
  
  createdAt DateTime @default(now())
}

enum AutoModEventType {
  MESSAGE_SEND
  MEMBER_UPDATE
}

enum AutoModTriggerType {
  KEYWORD           // Spam, küfür
  SPAM              // Link spam
  MENTION_SPAM      // @everyone spam
  CAPS_LOCK         // BÜYÜK HARF
  REPEATED_TEXT     // Tekrarlı mesaj
  NEW_ACCOUNT       // Yeni hesap
}
```

**B) Auto-Mod Actions** (10 dk)
```typescript
Actions:
1. Block Message
2. Send Alert (to channel)
3. Timeout Member (1h, 1d, 1w)
4. Kick Member
5. Ban Member
6. Add Role (Muted role)
```

**C) Auto-Mod UI** (5 dk)
```typescript
// Server Settings → Safety Setup
┌─────────────────────────────────────┐
│ AUTO-MODERATION                     │
│ ─────────────────────────────────── │
│ ✅ Block Spam Links                 │
│ ✅ Block Profanity                  │
│ ❌ Mention Spam Protection          │
│ ✅ New Account Restrictions         │
│ ─────────────────────────────────── │
│ [+ Create Custom Rule]              │
└─────────────────────────────────────┘
```

**Test:**
- [ ] Spam engelleniyor mu?
- [ ] Timeout çalışıyor mu?

---

### 1️⃣8️⃣ **AUDIT LOGS** ⭐ NEW!
**Süre:** 20 dakika | Öncelik: 🔥

**A) Prisma Schema** (4 dk)
```prisma
model AuditLog {
  id String @id
  
  serverId String
  server Server @relation(...)
  
  userId String // Who did it
  targetId String? // Who/what was affected
  
  action AuditLogAction
  changes Json // Before/after
  reason String?
  
  createdAt DateTime @default(now())
  
  @@index([serverId, createdAt])
}

enum AuditLogAction {
  CHANNEL_CREATE
  CHANNEL_UPDATE
  CHANNEL_DELETE
  MEMBER_KICK
  MEMBER_BAN
  MEMBER_ROLE_UPDATE
  MESSAGE_DELETE
  // ... 50+ actions
}
```

**B) Audit Log API** (6 dk)
```typescript
// app/api/servers/[serverId]/audit-logs/route.ts

Query filters:
- action: specific action
- userId: who did it
- targetId: affected user/channel
- before/after: date range

Response:
{
  entries: [
    {
      id: "123",
      user: { name: "Admin" },
      action: "MEMBER_BAN",
      target: { name: "BadUser" },
      reason: "Spam",
      timestamp: "2024-11-05T12:00:00Z"
    }
  ]
}
```

**C) Audit Log UI** (10 dk)
```typescript
// Server Settings → Audit Log
┌─────────────────────────────────────┐
│ AUDIT LOG                           │
│ Filters: [All Actions ▼] [All Users]│
│ ─────────────────────────────────── │
│ @Admin banned @BadUser              │
│ Reason: Spam                        │
│ 2 hours ago                         │
│ ─────────────────────────────────── │
│ @Mod deleted message in #genel      │
│ Message: "spam link"                │
│ 5 hours ago                         │
└─────────────────────────────────────┘
```

**Test:**
- [ ] Log kaydediliyor mu?
- [ ] Filtreleme çalışıyor mu?

---

### 1️⃣9️⃣ **WELCOME SCREEN & ONBOARDING** ⭐ NEW!
**Süre:** 25 dakika | Öncelik: 🔥

**A) Prisma Schema** (3 dk)
```prisma
model WelcomeScreen {
  id String @id
  
  serverId String @unique
  server Server @relation(...)
  
  enabled Boolean @default(false)
  description String
  
  channels WelcomeChannel[] // Featured channels
}

model WelcomeChannel {
  id String @id
  welcomeScreenId String
  channelId String
  description String
  emoji String?
  position Int
}
```

**B) Welcome Screen UI** (12 dk)
```typescript
// When joining server
┌─────────────────────────────────────┐
│ Hoş Geldiniz! 🎉                    │
│ ─────────────────────────────────── │
│ Discord Clone topluluğuna katıldın! │
│                                     │
│ Önerilen kanallar:                  │
│ 📢 #duyurular - Haberler            │
│ 💬 #sohbet - Genel sohbet           │
│ ❓ #yardım - Destek al              │
│                                     │
│ [Kuralları Kabul Et →]             │
└─────────────────────────────────────┘
```

**C) Member Screening** (10 dk)
```typescript
// Verification before chat
- Agree to rules
- Complete profile (optional)
- Verify email
- Verify phone (optional)
```

**Test:**
- [ ] Welcome screen görünüyor mu?
- [ ] Rules onaylanıyor mu?

---

### 2️⃣0️⃣ **SERVER TEMPLATES** ⭐ NEW!
**Süre:** 20 dakika | Öncelik: 🔥

**A) Template Creation** (10 dk)
```typescript
// app/api/servers/[serverId]/template/route.ts

POST - Create template from server

Template includes:
- Server icon & name
- Channels (with categories)
- Roles (without members)
- Permissions
- Default settings

Response:
{
  code: "xyz123abc",
  name: "Gaming Community",
  description: "Ready-made gaming server",
  usageCount: 0,
  createdAt: "..."
}
```

**B) Template Usage** (8 dk)
```typescript
// app/api/templates/[code]/route.ts

POST - Create server from template

Copies:
- All channels
- All roles
- Permission structure
- Welcome screen
```

**C) Template UI** (2 dk)
```typescript
// Server creation modal
Tabs:
1. Create My Own
2. Use Template
   - Gaming Community
   - Study Group
   - Friends & Family
   - ...
```

---

## 🎁 PHASE 5 - EXTRA FEATURES (2 saat)
**Hedef:** Discord'un %99 özelliklerini tamamla

---

### 2️⃣1️⃣ **STICKERS & EMOJIS** ⭐ NEW!
**Süre:** 30 dakika

**A) Custom Emojis** (15 dk)
```prisma
model Emoji {
  id String @id
  name String
  imageUrl String
  animated Boolean @default(false)
  
  serverId String
  server Server @relation(...)
  
  createdById String
  createdAt DateTime @default(now())
  
  @@unique([serverId, name])
}
```

- Upload custom emoji
- Emoji picker shows server emojis
- Animated emoji support (.gif)
- Emoji management UI

**B) Stickers** (15 dk)
```prisma
model Sticker {
  id String @id
  name String
  description String
  imageUrl String
  
  serverId String?
  server Server?
  
  formatType StickerFormat
}

enum StickerFormat {
  PNG
  APNG  // Animated
  LOTTIE // Vector
}
```

- Sticker picker
- Send sticker as message
- Custom sticker upload (Nitro feature)

---

### 2️⃣2️⃣ **WEBHOOKS** ⭐ NEW!
**Süre:** 25 dakika

**A) Webhook System** (15 dk)
```prisma
model Webhook {
  id String @id
  name String
  avatar String?
  token String @unique
  
  channelId String
  channel Channel @relation(...)
  
  createdById String
  createdAt DateTime @default(now())
}
```

**B) Webhook API** (8 dk)
```typescript
// app/api/webhooks/[webhookId]/[token]/route.ts

POST - Send message via webhook

Body:
{
  content: "Message from external app",
  username: "Bot Name",
  avatar_url: "...",
  embeds: [...]
}
```

**C) Webhook UI** (2 dk)
```typescript
// Channel Settings → Integrations → Webhooks
- Create webhook
- Copy webhook URL
- Delete webhook
```

---

### 2️⃣3️⃣ **ACTIVITIES & GAMES** ⭐ NEW!
**Süre:** 20 dakika

**A) Voice Channel Activities** (20 dk)
```typescript
// Built-in activities in voice channels
- YouTube Together
- Poker Night
- Chess
- Watch Together

// iframe embedding
```

---

### 2️⃣4️⃣ **MOBILE OPTIMIZATION** ⭐ IMPROVED
**Süre:** 25 dakika

**A) Touch Gestures** (10 dk)
- Swipe to open/close sidebars
- Long press for context menu
- Pull to refresh

**B) Mobile UI** (15 dk)
- Bottom navigation
- Floating action buttons
- Mobile-optimized modals
- Responsive font sizes

---

### 2️⃣5️⃣ **PERFORMANCE OPTIMIZATIONS** ⭐ NEW!
**Süre:** 20 dakika

**A) Message Virtualization** (8 dk)
```bash
npm install react-window
```

- Render only visible messages
- Smooth infinite scroll
- Reduce memory usage

**B) Image Optimization** (7 dk)
- Lazy loading
- WebP format
- Thumbnail generation
- CDN caching

**C) Code Splitting** (5 dk)
```typescript
// Dynamic imports
const SettingsModal = dynamic(() => import('@/components/modals/user-settings-modal'))
```

---

## 📋 IMPLEMENTATION ORDER (Öncelik Sırası)

### 🔥 KRİTİK (ÖNCE BUNLAR) - 3 saat
1. ✅ Channel Categories (20dk)
2. ✅ Advanced Roles (25dk)
3. ✅ Channel Permissions (15dk)
4. ✅ Friend System (25dk)
5. ✅ User Status (15dk)
6. ✅ Rich Text Editor (30dk)
7. ✅ Link Embeds (15dk)
8. ✅ Notification System (30dk)
9. ✅ User Settings (35dk)

### ⭐ ÖNEMLİ - 2.5 saat
10. ✅ GIF Picker (15dk)
11. ✅ Search System (25dk)
12. ✅ Message Threads (30dk)
13. ✅ Voice Improvements (40dk)
14. ✅ Stage Channels (25dk)
15. ✅ Forum Channels (35dk)

### 💡 EK ÖZELLİKLER - 2 saat
16. ✅ Auto-Moderation (30dk)
17. ✅ Audit Logs (20dk)
18. ✅ Welcome Screen (25dk)
19. ✅ Server Templates (20dk)
20. ✅ Stickers & Emojis (30dk)

### 🚀 GELİŞMİŞ - 1.5 saat
21. ✅ Webhooks (25dk)
22. ✅ Mobile Optimization (25dk)
23. ✅ Performance (20dk)
24. ✅ Activities (20dk)

---

## 🎯 BAŞLATMA REHBERİ

### Seçenek 1: **Tam Otomatik** (Hızlı)
"Tüm eksikleri tamamla" deyin → Ben tüm kodu yazarım

### Seçenek 2: **Adım Adım** (Öğrenmek için)
"Feature 1'den başla" deyin → Her feature'ı detaylıca anlatırım

### Seçenek 3: **Özel**
"[Feature adı] ekle" deyin → Spesifik feature implement ederim

---

**HAZIR MISINIZ?** 🚀

Hangi yolu seçiyorsunuz?
- "Tüm critical features'ları ekle (Grup 1-9)"
- "Feature 1: Channel Categories - detaylı anlat"
- "Hepsini otomatik yap"

**Tahmini Toplam Süre:** 10-12 saat  
**Discord Similarity:** %99 🎯
