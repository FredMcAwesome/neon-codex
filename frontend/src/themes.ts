export type ThemeName =
  | "Neon"
  | "Corporate"
  | "High Contrast"
  | "Cyberpunk"
  | "Mixed";

export interface ThemeSettings {
  hues: {
    primary: number;
    secondary: number;
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
