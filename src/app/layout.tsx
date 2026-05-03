import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avicena. O conhecimento que cura.",
  description:
    "Consultório do estudante de saúde. Sobe teu códice (PDF) e consulta o Hipócrates com citação de página exata.",
  icons: {
    icon: "/avicena-logo.png",
    apple: "/avicena-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F9F8] text-[#0F1A14] font-sans">
        <header className="sticky top-0 z-50 border-b border-[#DDE5E1] bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/avicena-logo.png"
                alt="Avicena"
                width={44}
                height={44}
                priority
                className="h-11 w-11 object-contain [image-rendering:pixelated]"
              />
              <span
                className="text-2xl font-bold tracking-tight text-[#0F1A14]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Avicena
              </span>
            </Link>
            <nav className="hidden text-sm font-medium text-[#5A6B62] md:flex md:gap-8">
              <Link href="/consultorio" className="hover:text-[#0F1A14]">
                Consultório
              </Link>
              <Link href="/planos" className="hover:text-[#0F1A14]">
                Planos
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>

        <footer className="border-t border-[#EBF0ED] bg-white">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <p className="text-xs italic text-[#8A9B92]">
              Material de estudo. Não substitui avaliação clínica presencial.
              Os pareceres são exclusivamente educativos, baseados nos PDFs que
              você forneceu.
            </p>
            <p className="mt-2 text-xs text-[#8A9B92]">
              Avicena · O conhecimento que cura.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
