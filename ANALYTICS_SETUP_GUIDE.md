# Настройка разных счетчиков для Vercel и Production

## 🎯 Цель
Настроить разные счетчики Google Analytics и Яндекс.Метрики для:
- **Vercel** (scooter-mauve.vercel.app) - тестовая среда
- **Production** (smilerentalphuket.com) - основной сайт

## 📊 Текущие настройки счетчиков

### ✅ Vercel (Тестовая среда)
- **Google Analytics:** `G-HTCN7LT0WP`
- **Яндекс.Метрика:** `103865335`
- **Домен:** `*.vercel.app`

### ✅ Production (Основной сайт)
- **Google Analytics:** `G-XQYEJ26C2J` (основной)
- **Яндекс.Метрика:** `98765432` (нужно заменить на реальный ID)
- **Домен:** `smilerentalphuket.com`

## 🔧 Как это работает

### 1. Автоматическое определение домена
Система автоматически определяет на каком домене запущен сайт:

```typescript
const hostname = window.location.hostname;

// Vercel
if (hostname.includes('vercel.app')) {
  // Загружаются счетчики для Vercel
}

// Production
if (hostname === 'smilerentalphuket.com') {
  // Загружаются счетчики для Production
}
```

### 2. Разделение данных
- **Vercel** - получает данные только от тестового трафика
- **Production** - получает данные только от реального трафика
- **Development** - счетчики не загружаются

## 📋 Что изменено в коде

### Создан новый компонент: `DomainBasedAnalytics.tsx`
```typescript
// Автоматически выбирает правильные счетчики
export const DomainBasedAnalytics = () => {
  // Определяет домен и загружает соответствующие счетчики
}
```

### Обновлен основной компонент: `Analytics.tsx`
```typescript
// Теперь использует DomainBasedAnalytics
export const Analytics = () => {
  return <DomainBasedAnalytics />;
};
```

## 🚀 Преимущества новой системы

### ✅ Разделение данных
- Тестовый трафик не попадает в основную аналитику
- Основной трафик не попадает в тестовую аналитику

### ✅ Автоматическое переключение
- Не нужно менять код при деплое
- Система сама определяет где запущена

### ✅ Debug информация
- В консоли браузера видно какие счетчики загружены
- Легко отследить проблемы

### ✅ Безопасность
- В development счетчики не загружаются
- Нет утечки данных между средами

## 📝 Инструкция по обновлению Production ID

Если нужно изменить ID для production, отредактируйте файл:
`smile-rental-modern/src/components/analytics/DomainBasedAnalytics.tsx`

```typescript
// Production domain - основной сайт
if (hostname === 'smilerentalphuket.com') {
  return {
    googleAnalyticsId: 'G-XQYEJ26C2J', // ← Здесь ваш основной GA4
    yandexMetricaId: 'ВАШ_РЕАЛЬНЫЙ_ID', // ← Здесь ваш основной Яндекс ID
    domain: 'smilerentalphuket.com',
    environment: 'production'
  };
}
```

## 🔍 Как проверить что работает

### 1. На Vercel (scooter-mauve.vercel.app)
1. Откройте сайт
2. Откройте DevTools (F12)
3. В консоли должно быть:
```
=== ANALYTICS DEBUG ===
Domain: scooter-mauve.vercel.app
Environment: vercel
Google Analytics ID: G-HTCN7LT0WP
Yandex Metrica ID: 103865335
========================
```

### 2. На Production (smilerentalphuket.com)
1. Откройте сайт
2. Откройте DevTools (F12)
3. В консоли должно быть:
```
=== ANALYTICS DEBUG ===
Domain: smilerentalphuket.com
Environment: production
Google Analytics ID: G-XQYEJ26C2J
Yandex Metrica ID: 98765432
========================
```

## 📊 Мониторинг данных

### Google Analytics
- **Vercel:** https://analytics.google.com/analytics/web/#/p[PROJECT_ID_VERCEL]
- **Production:** https://analytics.google.com/analytics/web/#/p[PROJECT_ID_PRODUCTION]

### Яндекс.Метрика
- **Vercel:** https://metrica.yandex.ru/dashboard?id=103865335
- **Production:** https://metrica.yandex.ru/dashboard?id=[ВАШ_PRODUCTION_ID]

## 🎯 Результат

После деплоя:
- ✅ Vercel будет отправлять данные только в свои счетчики
- ✅ Production будет отправлять данные только в свои счетчики
- ✅ Данные не будут пересекаться
- ✅ Можно отдельно анализировать тестовый и реальный трафик

## 🔄 Следующие шаги

1. ✅ Код обновлен
2. 🔄 Нужно закоммитить и запушить в GitHub
3. 🔄 Vercel автоматически обновится
4. 🔄 Production обновится через GitHub Actions
5. ✅ Проверить работу счетчиков на обеих средах
