// src/lib/fonts.ts
/**
 * Font and Category Presets.
 *
 * This file defines font imports from Google Fonts and sets up
 * category-specific presets for fonts, colors, and border radii.
 */
import { Inter, Lato, Playfair_Display, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const fontMapper = {
  inter: inter.className,
  playfair: playfair.className,
  poppins: poppins.className,
  lato: lato.className,
};

export const categoryPresets: Record<string, any> = {
  Fashion: {
    font: "playfair",
    primaryColor: "#000000",
    radius: "0rem",
  },
  Food: {
    font: "poppins",
    primaryColor: "#F97316",
    radius: "1rem",
  },
  Electronics: {
    font: "inter",
    primaryColor: "#2563EB",
    radius: "0.3rem",
  },
  Beauty: {
    font: "lato",
    primaryColor: "#DB2777",
    radius: "0.5rem",
  },
  Other: {
    font: "inter",
    primaryColor: "#E6B800",
    radius: "0.5rem",
  },
};
