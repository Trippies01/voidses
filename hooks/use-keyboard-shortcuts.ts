import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.action();
          console.log('⌨️ Kısayol:', shortcut.description);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Varsayılan kısayollar
export const DEFAULT_SHORTCUTS = {
  MUTE: { key: 'm', ctrl: true, description: 'Mute/Unmute' },
  DEAFEN: { key: 'd', ctrl: true, description: 'Deafen/Undeafen' },
  SETTINGS: { key: ',', ctrl: true, description: 'Ses Ayarları' },
  PTT_TOGGLE: { key: 't', ctrl: true, description: 'PTT Aç/Kapat' },
};
