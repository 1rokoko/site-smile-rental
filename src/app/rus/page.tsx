// Ultra-minimal Russian landing page for Google Ads compliance
// No analytics scripts, no dynamic injection, no complex widgets

import React from 'react';
import Link from 'next/link';

export default function RusHome() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">Smile Rental Phuket — аренда скутеров</h1>
        <p className="mt-1 text-sm">Без депозита • Без скрытых платежей • Поддержка на русском</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">Почему мы</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Надежные и обслуженные скутеры</li>
            <li>Прозрачные цены и честные условия</li>
            <li>Видео-регистратор для вашей безопасности</li>
            <li>Безопасная аренда без залога</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Популярные модели</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="border rounded p-4">
              <h3 className="font-medium">Yamaha NMAX</h3>
              <p className="text-sm mt-1">от 250฿/день • 150cc • комфорт и безопасность</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium">Honda Click</h3>
              <p className="text-sm mt-1">от 220฿/день • 125cc • экономичный и удобный</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Контакты</h2>
          <ul className="mt-2 space-y-1">
            <li>Telegram: <a href="https://t.me/renty_phuket" className="text-blue-600 underline" rel="noopener noreferrer" target="_blank">@renty_phuket</a></li>
            <li>WhatsApp: <a href="https://api.whatsapp.com/send/?phone=66626823973&text&type=phone_number&app_absent=0" className="text-blue-600 underline" rel="noopener noreferrer" target="_blank">написать</a></li>
            <li>Адрес: <a href="https://maps.app.goo.gl/cr9GmJJJmqAwA7Az6" className="text-blue-600 underline" rel="noopener noreferrer" target="_blank">7/39, Chalong, Phuket</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Полезные ссылки</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><Link href="/privacy-policy" className="text-blue-600 underline">Политика конфиденциальности</Link></li>
            <li><Link href="/cookie-policy" className="text-blue-600 underline">Политика cookies</Link></li>
            <li><Link href="/return-policy" className="text-blue-600 underline">Политика возврата</Link></li>
            <li><Link href="/" className="text-blue-600 underline">Главная (EN)</Link></li>
          </ul>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 border-t text-sm">
        <p>© 2019–2026 Smile Rental Phuket</p>
      </footer>
    </div>
  );
}

