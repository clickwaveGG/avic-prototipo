import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-body-google",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display-google",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-google",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B7A65",
};

export const metadata: Metadata = {
  title: "Avicena. O conhecimento que cura.",
  description:
    "Sobe teu códice (PDF), pode ser Guyton, Netter ou apostila. O Hipócrates responde com a página exata. Assistente de estudos em saúde, em PT-BR.",
  icons: {
    icon: "/assets/codex-logo-pixel.png",
    apple: "/assets/codex-logo-pixel.png",
  },
  openGraph: {
    title: "Avicena. O conhecimento que cura",
    description:
      "Assistente de estudos em PDF para Medicina, Enfermagem, Biomedicina, Fisioterapia, Farmácia e Odontologia. Resposta com página citada, sempre.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
