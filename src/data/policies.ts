export const POLICIES = {
  en: {
    privacy: {
      title: "Privacy Policy",
      content: `
        <h2>Privacy Policy</h2>
        <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you rent a scooter, contact us, or use our website.</p>
        
        <h3>How We Use Your Information</h3>
        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        
        <h3>Information Sharing</h3>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h3>Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h3>Contact Us</h3>
        <p>If you have questions about this Privacy Policy, please contact us via WhatsApp or Telegram.</p>
      `
    },
    cookies: {
      title: "Cookie Policy", 
      content: `
        <h2>Cookie Policy</h2>
        <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>What Are Cookies</h3>
        <p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience.</p>
        
        <h3>How We Use Cookies</h3>
        <p>We use cookies for analytics (Yandex.Metrika, Google Analytics), website functionality, and to remember your preferences.</p>
        
        <h3>Managing Cookies</h3>
        <p>You can control cookies through your browser settings. However, disabling cookies may affect website functionality.</p>
        
        <h3>Third-Party Cookies</h3>
        <p>We use Google Analytics and Yandex.Metrika for website analytics. These services may set their own cookies.</p>
      `
    },
    returns: {
      title: "Scooter Return Policy",
      content: `
        <h2>Scooter Return Policy</h2>
        <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>Return Requirements</h3>
        <p>Scooters must be returned on time, with the same fuel level, and in the same condition as received.</p>
        
        <h3>Late Returns</h3>
        <p>Late returns incur additional charges. Contact us immediately if you cannot return on time.</p>
        
        <h3>Damage Policy</h3>
        <p>Minor scratches up to 3cm are covered. Larger damage or mechanical issues may incur charges.</p>
        
        <h3>Fuel Policy</h3>
        <p>Return the scooter with the same fuel level as received, or pay refueling charges.</p>
        
        <h3>Emergency Contact</h3>
        <p>For emergencies or issues during rental, contact us immediately via WhatsApp or Telegram.</p>
      `
    }
  },
  ru: {
    privacy: {
      title: "Политика конфиденциальности",
      content: `
        <h2>Политика конфиденциальности</h2>
        <p><strong>Последнее обновление:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>Информация, которую мы собираем</h3>
        <p>Мы собираем информацию, которую вы предоставляете нам напрямую, например, при аренде скутера, обращении к нам или использовании нашего сайта.</p>
        
        <h3>Как мы используем вашу информацию</h3>
        <p>Мы используем собранную информацию для предоставления, поддержания и улучшения наших услуг, обработки транзакций и общения с вами.</p>
        
        <h3>Передача информации</h3>
        <p>Мы не продаем, не обмениваем и не передаем вашу личную информацию третьим лицам без вашего согласия, за исключением случаев, описанных в данной политике.</p>
        
        <h3>Безопасность данных</h3>
        <p>Мы применяем соответствующие меры безопасности для защиты вашей личной информации от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
        
        <h3>Свяжитесь с нами</h3>
        <p>Если у вас есть вопросы по данной Политике конфиденциальности, свяжитесь с нами через WhatsApp или Telegram.</p>
      `
    },
    cookies: {
      title: "Политика использования файлов cookie",
      content: `
        <h2>Политика использования файлов cookie</h2>
        <p><strong>Последнее обновление:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>Что такое файлы cookie</h3>
        <p>Файлы cookie - это небольшие текстовые файлы, сохраняемые на вашем устройстве при посещении нашего сайта. Они помогают нам обеспечить вам лучший опыт.</p>
        
        <h3>Как мы используем файлы cookie</h3>
        <p>Мы используем файлы cookie для аналитики (Яндекс.Метрика, Google Analytics), функциональности сайта и запоминания ваших предпочтений.</p>
        
        <h3>Управление файлами cookie</h3>
        <p>Вы можете управлять файлами cookie через настройки браузера. Однако отключение файлов cookie может повлиять на функциональность сайта.</p>
        
        <h3>Сторонние файлы cookie</h3>
        <p>Мы используем Google Analytics и Яндекс.Метрику для аналитики сайта. Эти сервисы могут устанавливать свои собственные файлы cookie.</p>
      `
    },
    returns: {
      title: "Политика возврата скутеров",
      content: `
        <h2>Политика возврата скутеров</h2>
        <p><strong>Последнее обновление:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>Требования к возврату</h3>
        <p>Скутеры должны быть возвращены вовремя, с тем же уровнем топлива и в том же состоянии, в котором были получены.</p>
        
        <h3>Поздний возврат</h3>
        <p>За поздний возврат взимается дополнительная плата. Немедленно свяжитесь с нами, если не можете вернуть вовремя.</p>
        
        <h3>Политика повреждений</h3>
        <p>Мелкие царапины до 3 см покрываются. За более крупные повреждения или механические проблемы может взиматься плата.</p>
        
        <h3>Политика топлива</h3>
        <p>Верните скутер с тем же уровнем топлива, что и при получении, или оплатите расходы на заправку.</p>
        
        <h3>Экстренный контакт</h3>
        <p>В случае чрезвычайных ситуаций или проблем во время аренды немедленно свяжитесь с нами через WhatsApp или Telegram.</p>
      `
    }
  }
};
