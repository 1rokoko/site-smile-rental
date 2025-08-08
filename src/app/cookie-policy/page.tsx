import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better browsing experience and allow certain features 
              of our website to function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic 
              functions like page navigation, access to secure areas, and form submissions.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics Cookies</h3>
            <p>
              We use analytics cookies to understand how visitors interact with our website. 
              This helps us improve our services and user experience. We use:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
              <li><strong>Yandex.Metrica:</strong> To track website performance and user interactions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization, such as remembering 
              your language preferences and providing live chat support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services that appear on our pages:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> For website analytics and performance tracking</li>
              <li><strong>Yandex.Metrica:</strong> For user behavior analysis and website optimization</li>
              <li><strong>Social Media Platforms:</strong> For social sharing functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Managing Cookies</h2>
            <p>
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Most browsers allow you to view, delete, and block cookies</li>
              <li>You can set your browser to notify you when cookies are being sent</li>
              <li>You can opt-out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on</li>
              <li>You can disable Yandex.Metrica tracking through your browser settings</li>
            </ul>
            <p>
              Please note that disabling certain cookies may affect the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie Retention</h2>
            <p>
              Different cookies have different retention periods:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
              <li><strong>Analytics Cookies:</strong> Typically retained for 24 months</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us:
            </p>
            <ul className="list-none space-y-2">
              <li><strong>WhatsApp:</strong> +66 62 682 3973</li>
              <li><strong>Telegram:</strong> @renty_phuket</li>
              <li><strong>Address:</strong> 7/39, Chalong, Mueang Phuket District, Phuket 83000</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our 
              practices or for other operational, legal, or regulatory reasons.
            </p>
            <p className="text-sm text-gray-600 mt-8">
              Last updated: January 2025
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
