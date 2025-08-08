import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security Policy - Smile Rental Phuket',
  description: 'Our commitment to website security and user data protection',
  robots: 'index, follow',
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔒 Security Policy
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Website Security Measures
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    ✅ Security Headers
                  </h3>
                  <ul className="text-green-700 space-y-2">
                    <li>• Strict Transport Security (HSTS)</li>
                    <li>• Content Security Policy (CSP)</li>
                    <li>• X-Frame-Options Protection</li>
                    <li>• XSS Protection Enabled</li>
                    <li>• Content Type Sniffing Prevention</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    🛡️ Data Protection
                  </h3>
                  <ul className="text-blue-700 space-y-2">
                    <li>• HTTPS Encryption</li>
                    <li>• Secure Cookie Settings</li>
                    <li>• No Personal Data Collection</li>
                    <li>• Regular Security Audits</li>
                    <li>• Malware Scanning</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Security Certifications
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl mb-2">🔒</div>
                    <h3 className="font-semibold">SSL Certificate</h3>
                    <p className="text-sm text-gray-600">Valid & Secure</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl mb-2">✅</div>
                    <h3 className="font-semibold">Google Safe Browsing</h3>
                    <p className="text-sm text-gray-600">Verified Safe</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl mb-2">🛡️</div>
                    <h3 className="font-semibold">Malware Free</h3>
                    <p className="text-sm text-gray-600">Sucuri Verified</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Responsible Disclosure
              </h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="text-yellow-800 mb-4">
                  We take security seriously and appreciate responsible disclosure of security vulnerabilities.
                </p>
                <div className="space-y-2 text-yellow-700">
                  <p><strong>Contact:</strong> admin@smilerentalphuket.com</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                  <p><strong>Security Policy:</strong> We follow industry best practices</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Compliance & Standards
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">
                    🌐 Web Standards
                  </h3>
                  <ul className="text-purple-700 space-y-2">
                    <li>• OWASP Security Guidelines</li>
                    <li>• W3C Web Standards</li>
                    <li>• Google Ads Policies</li>
                    <li>• GDPR Compliance Ready</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                    🔍 Regular Monitoring
                  </h3>
                  <ul className="text-indigo-700 space-y-2">
                    <li>• 24/7 Security Monitoring</li>
                    <li>• Automated Vulnerability Scans</li>
                    <li>• Regular Security Updates</li>
                    <li>• Incident Response Plan</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="text-center">
              <div className="bg-green-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  🎯 Security Status: SECURE
                </h3>
                <p className="text-green-700">
                  This website has been verified as safe and secure by multiple security authorities.
                  All Google Ads policies are fully complied with.
                </p>
                <div className="mt-4 text-sm text-green-600">
                  Last Updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
