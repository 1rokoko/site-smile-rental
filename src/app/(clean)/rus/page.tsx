// Ultra-minimal Russian landing page for Google Ads compliance
// Completely isolated from main layout - zero JavaScript, zero external dependencies

import React from 'react';

export default function CleanRusHome() {
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
              <p className="text-sm mt-1">150cc • от 250฿/день</p>
              <p className="text-sm">Комфорт: мягкая подвеска, высокий уровень безопасности</p>
              <p className="text-sm">Идеален для: города и средних расстояний</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium">Honda Click 125</h3>
              <p className="text-sm mt-1">125cc • от 220฿/день</p>
              <p className="text-sm">Экономичный, лёгкий в управлении, надёжный</p>
              <p className="text-sm">Идеален для: новичков и повседневных поездок</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium">Honda PCX</h3>
              <p className="text-sm mt-1">150cc • от 280฿/день</p>
              <p className="text-sm">Удобная посадка, увеличенный багажный отсек</p>
              <p className="text-sm">Идеален для: комфортных поездок и пары</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium">Yamaha Filano</h3>
              <p className="text-sm mt-1">125cc • от 230฿/день</p>
              <p className="text-sm">Стильный, манёвренный, низкий расход топлива</p>
              <p className="text-sm">Идеален для: города, шопинга, пляжей</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium">GPX 150cc</h3>
              <p className="text-sm mt-1">150cc • от 240฿/день</p>
              <p className="text-sm">Баланс мощности и экономичности</p>
              <p className="text-sm">Идеален для: уверенной динамичной езды</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium">Yamaha XMAX 300</h3>
              <p className="text-sm mt-1">300cc • от 680฿/день</p>
              <p className="text-sm">Мощный, устойчивый, увеличенная безопасность</p>
              <p className="text-sm">Идеален для: дальних поездок и трассы</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Как арендовать</h2>
          <ol className="list-decimal pl-6 mt-2 space-y-1 text-sm">
            <li>Выберите модель, срок и дату.</li>
            <li>Подготовьте паспорт и права категории A/А1 (или международные). </li>
            <li>Согласуйте время и место подачи скутера.</li>
            <li>Получите скутер, осмотрите и подпишите простую форму.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Контакты</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Telegram: @renty_phuket</li>
            <li>WhatsApp: +66 62 682 3973</li>
            <li>Адрес: 7/39, Chalong, Phuket</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Полезные ссылки</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li><a href="/privacy-policy" className="text-blue-600 underline">Политика конфиденциальности</a></li>
            <li><a href="/cookie-policy" className="text-blue-600 underline">Политика cookies</a></li>
            <li><a href="/return-policy" className="text-blue-600 underline">Политика возврата</a></li>
            <li><a href="/" className="text-blue-600 underline">Главная (EN)</a></li>
          </ul>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 border-t text-sm">
        <p>© 2019–2026 Smile Rental Phuket</p>
      </footer>
    </div>
  );
}
