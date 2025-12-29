import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type FC,
} from "react";
import { themes, type ThemeName, type ThemeSettings } from "../themes.js";

interface ThemeContextType {
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

// Helper to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4)),
  ];
}

function rgbToString(rgb: [number, number, number]): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function rgbToCsv(rgb: [number, number, number]): string {
  return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

export const ThemeContextProvider: FC<ThemeContextProviderProps> = ({
  children,
}) => {
  // Initialize theme from localStorage or default to "Neon"
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem("arwes-theme");
    // Validate that the saved theme exists in our themes object
    if (savedTheme !== null && Object.keys(themes).includes(savedTheme)) {
      return savedTheme as ThemeName;
    }
    return "Neon";
  });

  useEffect(() => {
    localStorage.setItem("arwes-theme", themeName);
    applyTheme(themes[themeName]);
  }, [themeName]);

  const applyTheme = (settings: ThemeSettings) => {
    const root = document.documentElement;
    const { hues, fontFamilies } = settings;

    // Helper to set color variables
    const setPalette = (
      name:
        | "primary"
        | "secondary"
        | "highlight"
        | "info"
        | "success"
        | "warning"
        | "error",
      hue: number
    ) => {
      // These lightness/saturation values are approximations based on the default Arwes theme
      const main = hslToRgb(hue, 100, 50); // Main color
      const dark1 = hslToRgb(hue, 100, 37); // Dark 1
      const dark2 = hslToRgb(hue, 100, 24); // Dark 2
      const dark3 = hslToRgb(hue, 100, 12); // Dark 3
      const light1 = hslToRgb(hue, 100, 75); // Light 1

      root.style.setProperty(`--arwes-palette-${name}-main`, rgbToString(main));
      root.style.setProperty(
        `--arwes-palette-${name}-main-rgb`,
        rgbToCsv(main)
      );
      root.style.setProperty(
        `--arwes-palette-${name}-dark-1`,
        rgbToString(dark1)
      );
      root.style.setProperty(
        `--arwes-palette-${name}-dark-2`,
        rgbToString(dark2)
      );
      root.style.setProperty(
        `--arwes-palette-${name}-dark-3`,
        rgbToString(dark3)
      );
      root.style.setProperty(
        `--arwes-palette-${name}-light-1`,
        rgbToString(light1)
      );
    };

    setPalette("primary", hues.primary);
    setPalette("secondary", hues.secondary);
    if (hues.highlight !== undefined) setPalette("highlight", hues.highlight);
    if (hues.info !== undefined) setPalette("info", hues.info);
    if (hues.success !== undefined) setPalette("success", hues.success);
    if (hues.warning !== undefined) setPalette("warning", hues.warning);
    if (hues.error !== undefined) setPalette("error", hues.error);

    // Set Font Families
    root.style.setProperty("--arwes-font-family-body", fontFamilies.body);
    root.style.setProperty("--arwes-font-family-header", fontFamilies.header);
    root.style.setProperty("--arwes-font-family-code", fontFamilies.code);

    // Update body font
    document.body.style.fontFamily = fontFamilies.body;
  };

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        setTheme: setThemeName,
        availableThemes: Object.keys(themes) as ThemeName[],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
