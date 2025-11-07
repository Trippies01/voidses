// ========================================
// PROFESSIONAL DESIGN SYSTEM
// Discord Clone - Modern UI/UX
// ========================================

export const DesignSystem = {
  // Color Palette - Professional Discord-inspired
  colors: {
    // Backgrounds
    bg: {
      primary: '#313338',      // Main background
      secondary: '#2b2d31',    // Secondary surfaces
      tertiary: '#1e1f22',     // Elevated surfaces
      hover: '#404249',        // Hover states
      active: '#35373c',       // Active states
    },
    
    // Text
    text: {
      primary: '#f2f3f5',      // Main text
      secondary: '#b5bac1',    // Secondary text
      muted: '#80848e',        // Muted text
      link: '#00a8fc',         // Links
    },
    
    // Accent Colors
    accent: {
      brand: '#5865f2',        // Brand color (Indigo)
      green: '#23a55a',        // Success/Online
      yellow: '#f0b232',       // Warning
      red: '#f23f43',          // Danger/Error
      purple: '#9b59b6',       // Special
    },
    
    // Channel Colors
    channel: {
      text: '#80848e',         // Text channel icon
      voice: '#23a55a',        // Voice channel
      selected: '#5865f2',     // Selected channel
    },
    
    // Role Colors
    role: {
      admin: '#f23f43',        // Admin red
      moderator: '#5865f2',    // Moderator indigo
      guest: '#b5bac1',        // Guest gray
    }
  },

  // Typography
  typography: {
    fontFamily: {
      primary: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },
    
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },

  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
  },

  // Border Radius
  radius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    full: '9999px',   // Fully rounded
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Transitions
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 10,
    modal: 50,
    popover: 60,
    tooltip: 70,
    notification: 80,
  }
} as const;

// Helper function to get design token
export const getDesignToken = (path: string) => {
  const keys = path.split('.');
  let value: any = DesignSystem;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value;
};

