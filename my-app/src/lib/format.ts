import { AvatarPalette } from '@/constants/diatinf-theme';

export function getInitials(nameOrUsername: string): string {
  const parts = nameOrUsername.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return nameOrUsername.slice(0, 2).toUpperCase();
}

export function getAvatarColors(username: string) {
  const hash = username.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AvatarPalette[hash % AvatarPalette.length];
}

export function relativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.max(0, Math.floor(diffMs / 60_000));
  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}
