// Ultra-clean static version of main page for Google Ads compliance
// Zero JavaScript, inline CSS only, exact same design as main page

import React from 'react';

export default function CleanHomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Smile Rental Phuket</h1>
            <p className="text-sm">№1 Scooter Rental for Safety and Comfort</p>
          </div>
          <div className="text-sm">
            <p>📞 +66 62 682 3973</p>
            <p>📍 7/39, Chalong, Phuket</p>
          </div>
        </div>
      </header>

      {/* Language Bar */}
      <div className="bg-gray-100 py-2">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm">
          <a href="/rus" className="text-blue-600 underline">🇷🇺 Русская версия</a>
          <span className="mx-4">|</span>
          <span>🇬🇧 English version</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Premium Scooter Rental in Phuket</h2>
          <p className="text-xl mb-6">With video recorder protection, insurance coverage, and no hidden fees</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="border rounded p-4">
              <h3 className="font-semibold">🛡️ Video Recorder</h3>
              <p className="text-sm">Protection for your safety</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-semibold">💰 No Hidden Fees</h3>
              <p className="text-sm">Transparent pricing</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-semibold">🏆 6000฿ Bonus</h3>
              <p className="text-sm">Special offer included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scooter Grid */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">Our Scooter Fleet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded p-4">
            <h3 className="font-semibold">Yamaha NMAX 155</h3>
            <p className="text-sm mt-1">155cc • From 250฿/day</p>
            <p className="text-sm">Comfort: soft suspension, high safety level</p>
            <p className="text-sm">Perfect for: city and medium distances</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-semibold">Honda Click 125</h3>
            <p className="text-sm mt-1">125cc • From 220฿/day</p>
            <p className="text-sm">Economical, easy to handle, reliable</p>
            <p className="text-sm">Perfect for: beginners and daily trips</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-semibold">Honda PCX 150</h3>
            <p className="text-sm mt-1">150cc • From 280฿/day</p>
            <p className="text-sm">Comfortable seating, large storage compartment</p>
            <p className="text-sm">Perfect for: comfortable rides and couples</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-semibold">Yamaha Filano 125</h3>
            <p className="text-sm mt-1">125cc • From 230฿/day</p>
            <p className="text-sm">Stylish, maneuverable, low fuel consumption</p>
            <p className="text-sm">Perfect for: city, shopping, beaches</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-semibold">GPX 150cc</h3>
            <p className="text-sm mt-1">150cc • From 240฿/day</p>
            <p className="text-sm">Balance of power and economy</p>
            <p className="text-sm">Perfect for: confident dynamic riding</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-semibold">Yamaha XMAX 300</h3>
            <p className="text-sm mt-1">300cc • From 680฿/day</p>
            <p className="text-sm">Powerful, stable, enhanced safety</p>
            <p className="text-sm">Perfect for: long trips and highways</p>
          </div>
        </div>
      </section>

      {/* Scam Warning */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Beware of Scams</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
              <p><strong>Fake rental companies</strong> - Always verify the company's physical address and license</p>
            </div>
            <div className="flex items-start">
              <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
              <p><strong>Overcharging tourists</strong> - Know the standard rates before renting</p>
            </div>
            <div className="flex items-start">
              <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
              <p><strong>Hidden damage charges</strong> - Document all existing damage before riding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Testimonial */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded p-6">
          <h2 className="text-xl font-bold mb-4">👨‍💼 From the Owner</h2>
          <p className="text-sm italic mb-4">
            "We've been serving tourists in Phuket since 2019. Our mission is to provide safe, reliable transportation 
            with complete transparency. Every scooter comes with video recorder protection and full insurance coverage."
          </p>
          <p className="text-sm font-semibold">— Smile Rental Team</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-center mb-6">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">📱 Instant Booking</h3>
            <ul className="space-y-1 text-sm">
              <li>Telegram: @renty_phuket</li>
              <li>WhatsApp: +66 62 682 3973</li>
              <li>Line: Available 24/7</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📍 Location</h3>
            <ul className="space-y-1 text-sm">
              <li>Address: 7/39, Chalong, Phuket</li>
              <li>Open: 8:00 AM - 8:00 PM</li>
              <li>Delivery: Available island-wide</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Smile Rental Phuket</h3>
            <p>Premium scooter rental service in Phuket with safety guarantee and transparent pricing.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a></li>
              <li><a href="/cookie-policy" className="text-blue-600 underline">Cookie Policy</a></li>
              <li><a href="/return-policy" className="text-blue-600 underline">Return Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Languages</h3>
            <ul className="space-y-1">
              <li><a href="/rus" className="text-blue-600 underline">🇷🇺 Русская версия</a></li>
              <li><span>🇬🇧 English (current)</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t text-center text-sm">
          <p>© 2019–2026 Smile Rental Phuket. All rights reserved.</p>
        </div>
      </footer>

      {/* Static Contact Buttons */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <a href="https://t.me/renty_phuket" className="block bg-blue-500 text-white px-4 py-2 rounded text-sm">
          📱 Telegram
        </a>
        <a href="https://wa.me/66626823973" className="block bg-green-500 text-white px-4 py-2 rounded text-sm">
          💬 WhatsApp
        </a>
      </div>
    </div>
  );
}
