import type { Metadata } from "next";
import "../globals.css";

// Ultra-minimal layout for /rus page to satisfy strict ad scanners
// No analytics, no dynamic script/style injection, no inline scripts

export const metadata: Metadata = {
  title: "Smile Rental Phuket — Аренда скутеров | Русская версия",
  description:
    "Аренда скутеров на Пхукете без депозита и скрытых платежей. Прозрачные цены, безопасность, помощь на русском языке.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RusLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>{/* CSP only via headers in middleware.ts */}</head>
      <body className="antialiased font-system">{children}</body>
    </html>
  );
}

