import React from 'react';

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Scooter Return Policy</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Return Requirements</h2>
            <p>
              All scooters must be returned in the same condition as received. The following 
              conditions must be met for a successful return:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Return the scooter at the agreed time and location</li>
              <li>Fuel tank must be at the same level as when received (or full if specified)</li>
              <li>All provided equipment must be returned (helmet, lock, charger, documents)</li>
              <li>Scooter must be in clean condition</li>
              <li>No new damage beyond normal wear and tear</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Damage Policy</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Minor Scratches (Up to 3cm)</h3>
            <p>
              <strong>NO CHARGE</strong> - We understand that minor scratches can occur during normal use. 
              Scratches up to 3cm in length are covered at no additional cost.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Major Damage</h3>
            <p>
              Charges will apply for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Scratches longer than 3cm</li>
              <li>Dents or broken plastic parts</li>
              <li>Mechanical damage or engine problems</li>
              <li>Electrical system damage</li>
              <li>Missing or damaged equipment (helmet, lock, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Late Return Policy</h2>
            <p>
              <strong>Grace Period:</strong> 30 minutes grace period for returns
            </p>
            <p>
              <strong>Late Fees:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>30 minutes - 2 hours late: 200 THB</li>
              <li>2 - 6 hours late: 500 THB</li>
              <li>6 - 24 hours late: Full day rate</li>
              <li>More than 24 hours: Additional daily rates apply</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Theft or Total Loss</h2>
            <p>
              In case of theft or total loss:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Immediately contact us and file a police report</li>
              <li>Provide all documentation and police report number</li>
              <li>Insurance coverage available (additional fee applies)</li>
              <li>Without insurance: Full replacement cost applies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Inspection Process</h2>
            <p>
              Upon return, we will conduct a thorough inspection:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visual inspection for damage</li>
              <li>Mechanical check of brakes, lights, and engine</li>
              <li>Verification of fuel level</li>
              <li>Check all provided equipment</li>
              <li>Documentation of any issues with photos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Deposit Refund</h2>
            <p>
              <strong>No Passport Deposit Required!</strong> We don't hold your passport as security.
            </p>
            <p>
              Security deposit refund process:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Immediate refund if no issues found</li>
              <li>Deductions only for documented damage</li>
              <li>Clear explanation of any charges</li>
              <li>Photo evidence provided for all deductions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Emergency Situations</h2>
            <p>
              If you cannot return the scooter due to emergency:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact us immediately: +66 62 682 3973</li>
              <li>Explain the situation</li>
              <li>We will arrange pickup if necessary</li>
              <li>Additional fees may apply for emergency pickup</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
            <p>
              For any questions about returns or to report issues:
            </p>
            <ul className="list-none space-y-2">
              <li><strong>WhatsApp:</strong> +66 62 682 3973</li>
              <li><strong>Telegram:</strong> @renty_phuket</li>
              <li><strong>Address:</strong> 7/39, Chalong, Mueang Phuket District, Phuket 83000</li>
            </ul>
          </section>

          <p className="text-sm text-gray-600 mt-8">
            Last updated: January 2025
          </p>

        </div>
      </div>
    </div>
  );
}
