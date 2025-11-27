import { Inter, Playfair_Display, Poppins, Lato } from "next/font/google";

// 1. Configure Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });
const lato = Lato({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-lato" });

// 2. Map DB String to Font Class
export const fontMapper = {
  inter: inter.className,
  playfair: playfair.className,
  poppins: poppins.className,
  lato: lato.className,
};

// 3. Default Configs per Category
export const categoryPresets: Record<string, any> = {
  Fashion: {
    font: "playfair",
    primaryColor: "#000000", // Lux Black
    radius: "0rem", // Sharp edges
  },
  Food: {
    font: "poppins",
    primaryColor: "#F97316", // Orange
    radius: "1rem", // Soft/Round
  },
  Electronics: {
    font: "inter",
    primaryColor: "#2563EB", // Tech Blue
    radius: "0.3rem", // Slight curve
  },
  Beauty: {
    font: "lato",
    primaryColor: "#DB2777", // Pink
    radius: "0.5rem",
  },
  Other: {
    font: "inter",
    primaryColor: "#E6B800", // Default Gold
    radius: "0.5rem",
  }
};