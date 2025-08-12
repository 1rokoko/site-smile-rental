import type { Metadata } from "next";

// Ultra-minimal layout for clean pages - completely isolated from main layout
// No analytics, no dynamic scripts, no external dependencies
// Perfect for Google Ads compliance

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

export default function CleanLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #000; 
              background: #fff; 
            }
            .max-w-5xl { max-width: 80rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
            .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
            .mt-1 { margin-top: 0.25rem; }
            .mt-2 { margin-top: 0.5rem; }
            .space-y-8 > * + * { margin-top: 2rem; }
            .space-y-1 > * + * { margin-top: 0.25rem; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .gap-4 { gap: 1rem; }
            .mt-3 { margin-top: 0.75rem; }
            .border { border-width: 1px; border-color: #d1d5db; }
            .rounded { border-radius: 0.25rem; }
            .p-4 { padding: 1rem; }
            .list-disc { list-style-type: disc; }
            .list-decimal { list-style-type: decimal; }
            .pl-6 { padding-left: 1.5rem; }
            .text-blue-600 { color: #2563eb; }
            .underline { text-decoration: underline; }
            .border-t { border-top-width: 1px; border-top-color: #d1d5db; }
            @media (min-width: 768px) {
              .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
