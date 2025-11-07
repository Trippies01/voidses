export const Permission = {
  // General Server Permissions
  VIEW_CHANNELS: 1n << 0n,          // 1
  MANAGE_CHANNELS: 1n << 1n,        // 2
  MANAGE_ROLES: 1n << 2n,           // 4
  MANAGE_SERVER: 1n << 3n,          // 8
  CREATE_INVITE: 1n << 4n,          // 16
  CHANGE_NICKNAME: 1n << 5n,        // 32
  MANAGE_NICKNAMES: 1n << 6n,       // 64
  KICK_MEMBERS: 1n << 7n,           // 128
  BAN_MEMBERS: 1n << 8n,            // 256

  // Text Channel Permissions
  SEND_MESSAGES: 1n << 9n,          // 512
  SEND_MESSAGES_IN_THREADS: 1n << 10n, // 1024
  CREATE_PUBLIC_THREADS: 1n << 11n, // 2048
  CREATE_PRIVATE_THREADS: 1n << 12n, // 4096
  EMBED_LINKS: 1n << 13n,           // 8192
  ATTACH_FILES: 1n << 14n,          // 16384
  ADD_REACTIONS: 1n << 15n,         // 32768
  USE_EXTERNAL_EMOJIS: 1n << 16n,   // 65536
  USE_EXTERNAL_STICKERS: 1n << 17n, // 131072
  MENTION_EVERYONE: 1n << 18n,      // 262144
  MANAGE_MESSAGES: 1n << 19n,       // 524288
  READ_MESSAGE_HISTORY: 1n << 20n,  // 1048576
  SEND_TTS_MESSAGES: 1n << 21n,     // 2097152

  // Voice Channel Permissions
  CONNECT: 1n << 22n,               // 4194304
  SPEAK: 1n << 23n,                 // 8388608
  VIDEO: 1n << 24n,                 // 16777216
  MUTE_MEMBERS: 1n << 25n,          // 33554432
  DEAFEN_MEMBERS: 1n << 26n,        // 67108864
  MOVE_MEMBERS: 1n << 27n,          // 134217728
  USE_VOICE_ACTIVITY: 1n << 28n,    // 268435456
  PRIORITY_SPEAKER: 1n << 29n,      // 536870912

  // Advanced Permissions
  ADMINISTRATOR: 1n << 30n,         // 1073741824
  MANAGE_WEBHOOKS: 1n << 31n,       // 2147483648
  MANAGE_EMOJIS: 1n << 32n,         // 4294967296
  VIEW_AUDIT_LOG: 1n << 33n,        // 8589934592
  VIEW_SERVER_INSIGHTS: 1n << 34n,  // 17179869184
  MODERATE_MEMBERS: 1n << 35n,      // 34359738368 (timeout)
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export interface Role {
  id: string;
  name: string;
  color: string | null;
  position: number;
  permissions: bigint;
  hoist: boolean;
  mentionable: boolean;
}

/**
 * Check if a set of roles has a specific permission
 */
export function hasPermission(
  roles: { permissions: bigint }[],
  permission: bigint
): boolean {
  // Check if any role has ADMINISTRATOR permission
  if (roles.some(role => (role.permissions & Permission.ADMINISTRATOR) === Permission.ADMINISTRATOR)) {
    return true;
  }

  // Check if any role has the specific permission
  return roles.some(role => (role.permissions & permission) === permission);
}

/**
 * Check if permissions include a specific permission
 */
export function checkPermission(
  permissions: bigint,
  permission: bigint
): boolean {
  // Check ADMINISTRATOR first
  if ((permissions & Permission.ADMINISTRATOR) === Permission.ADMINISTRATOR) {
    return true;
  }

  return (permissions & permission) === permission;
}

/**
 * Add a permission to a permission set
 */
export function addPermission(
  permissions: bigint,
  permission: bigint
): bigint {
  return permissions | permission;
}

/**
 * Remove a permission from a permission set
 */
export function removePermission(
  permissions: bigint,
  permission: bigint
): bigint {
  return permissions & ~permission;
}

/**
 * Get all granted permissions from a bigint
 */
export function getPermissions(permissions: bigint): Permission[] {
  const granted: Permission[] = [];
  const vals = Object.values(Permission) as bigint[];
  for (const perm of vals) {
    if ((permissions & perm) === perm) {
      granted.push(perm as Permission);
    }
  }
  return granted;
}

/**
 * Default permissions for @everyone role
 */
export const DEFAULT_PERMISSIONS: bigint =
  Permission.VIEW_CHANNELS |
  Permission.CREATE_INVITE |
  Permission.CHANGE_NICKNAME |
  Permission.SEND_MESSAGES |
  Permission.EMBED_LINKS |
  Permission.ATTACH_FILES |
  Permission.ADD_REACTIONS |
  Permission.READ_MESSAGE_HISTORY |
  Permission.CONNECT |
  Permission.SPEAK |
  Permission.USE_VOICE_ACTIVITY;

/**
 * Admin permissions (all permissions)
 */
export const ADMIN_PERMISSIONS: bigint = Permission.ADMINISTRATOR;

/**
 * Moderator permissions (common moderator perms)
 */
export const MODERATOR_PERMISSIONS: bigint =
  DEFAULT_PERMISSIONS |
  Permission.MANAGE_MESSAGES |
  Permission.KICK_MEMBERS |
  Permission.MUTE_MEMBERS |
  Permission.DEAFEN_MEMBERS |
  Permission.MOVE_MEMBERS |
  Permission.MODERATE_MEMBERS;

/**
 * Permission names for UI
 * Use a Map because bigint keys can't be used directly as object-type keys in TypeScript.
 */
export const PERMISSION_NAMES = new Map<bigint, string>([
  [Permission.VIEW_CHANNELS, "Kanalları Görüntüle"],
  [Permission.MANAGE_CHANNELS, "Kanalları Yönet"],
  [Permission.MANAGE_ROLES, "Rolleri Yönet"],
  [Permission.MANAGE_SERVER, "Sunucuyu Yönet"],
  [Permission.CREATE_INVITE, "Davet Oluştur"],
  [Permission.CHANGE_NICKNAME, "Takma Adı Değiştir"],
  [Permission.MANAGE_NICKNAMES, "Takma Adları Yönet"],
  [Permission.KICK_MEMBERS, "Üyeleri At"],
  [Permission.BAN_MEMBERS, "Üyeleri Yasakla"],
  [Permission.SEND_MESSAGES, "Mesaj Gönder"],
  [Permission.SEND_MESSAGES_IN_THREADS, "Thread'de Mesaj Gönder"],
  [Permission.CREATE_PUBLIC_THREADS, "Genel Thread Oluştur"],
  [Permission.CREATE_PRIVATE_THREADS, "Özel Thread Oluştur"],
  [Permission.EMBED_LINKS, "Link Yerleştir"],
  [Permission.ATTACH_FILES, "Dosya Ekle"],
  [Permission.ADD_REACTIONS, "Tepki Ekle"],
  [Permission.USE_EXTERNAL_EMOJIS, "Harici Emoji Kullan"],
  [Permission.USE_EXTERNAL_STICKERS, "Harici Sticker Kullan"],
  [Permission.MENTION_EVERYONE, "@everyone Kullan"],
  [Permission.MANAGE_MESSAGES, "Mesajları Yönet"],
  [Permission.READ_MESSAGE_HISTORY, "Mesaj Geçmişini Oku"],
  [Permission.SEND_TTS_MESSAGES, "TTS Mesaj Gönder"],
  [Permission.CONNECT, "Bağlan"],
  [Permission.SPEAK, "Konuş"],
  [Permission.VIDEO, "Video"],
  [Permission.MUTE_MEMBERS, "Üyeleri Sustur"],
  [Permission.DEAFEN_MEMBERS, "Üyeleri Sağırlaştır"],
  [Permission.MOVE_MEMBERS, "Üyeleri Taşı"],
  [Permission.USE_VOICE_ACTIVITY, "Ses Aktivitesi Kullan"],
  [Permission.PRIORITY_SPEAKER, "Öncelikli Konuşmacı"],
  [Permission.ADMINISTRATOR, "Yönetici"],
  [Permission.MANAGE_WEBHOOKS, "Webhook'ları Yönet"],
  [Permission.MANAGE_EMOJIS, "Emojileri Yönet"],
  [Permission.VIEW_AUDIT_LOG, "Denetim Kaydını Görüntüle"],
  [Permission.VIEW_SERVER_INSIGHTS, "Sunucu İstatistiklerini Görüntüle"],
  [Permission.MODERATE_MEMBERS, "Üyeleri Moderle (Timeout)"],
]);