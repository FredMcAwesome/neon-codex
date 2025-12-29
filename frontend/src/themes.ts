export type ThemeName =
  | "Neon"
  | "Corporate"
  | "High Contrast"
  | "Cyberpunk"
  | "Experimental"
  | "Mixed";

export interface ThemeSettings {
  hues: {
    primary: number;
    secondary: number;
    highlight?: number;
    info?: number;
    success?: number;
    warning?: number;
    error?: number;
  };
  fontFamilies: {
    body: string;
    header: string;
    code: string;
  };
  animation: {
    direction: "default" | "left-to-right";
  };
}

export const themes: Record<ThemeName, ThemeSettings> = {
  Neon: {
    hues: {
      primary: 180, // Cyan
      secondary: 180, // Cyan
    },
    fontFamilies: {
      body: '"Titillium Web", sans-serif',
      header: '"Titillium Web", sans-serif',
      code: '"Source Code Pro", monospace',
    },
    animation: {
      direction: "default",
    },
  },
  Corporate: {
    hues: {
      primary: 210, // Blue
      secondary: 230, // Dark Blue
    },
    fontFamilies: {
      body: '"Roboto", sans-serif',
      header: '"Roboto", sans-serif',
      code: '"Source Code Pro", monospace',
    },
    animation: {
      direction: "default",
    },
  },
  "High Contrast": {
    hues: {
      primary: 60, // Yellow
      secondary: 0, // Red/Black
    },
    fontFamilies: {
      body: '"Verdana", sans-serif',
      header: '"Verdana", sans-serif',
      code: '"Courier New", monospace',
    },
    animation: {
      direction: "default",
    },
  },
  Cyberpunk: {
    hues: {
      primary: 320, // Pink
      secondary: 60, // Yellow
      highlight: 190, // Cyan
      error: 0, // Red
    },
    fontFamilies: {
      body: '"Orbitron", sans-serif',
      header: '"Orbitron", sans-serif',
      code: '"Source Code Pro", monospace',
    },
    animation: {
      direction: "default",
    },
  },
  Experimental: {
    hues: {
      primary: 260, // Violet
      secondary: 160, // Green
      highlight: 50, // Gold
      info: 210, // Blue
      success: 120, // Green
      warning: 30, // Orange
      error: 0, // Red
    },
    fontFamilies: {
      body: '"Rajdhani", sans-serif',
      header: '"Rajdhani", sans-serif',
      code: '"Fira Code", monospace',
    },
    animation: {
      direction: "default",
    },
  },
  Mixed: {
    hues: {
      primary: 280, // Purple
      secondary: 30, // Orange
    },
    fontFamilies: {
      body: '"Titillium Web", sans-serif',
      header: '"Titillium Web", sans-serif',
      code: '"Source Code Pro", monospace',
    },
    animation: {
      direction: "left-to-right",
    },
  },
};
