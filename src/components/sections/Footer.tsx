'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H3, Body, BodySmall, Button, FadeInView } from '@/components/ui';
import { EXACT_CONTENT } from '@/data/exact-content';
import { CONTACT_INFO } from '@/lib/constants';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';
import { safeWindowOpen } from '@/utils/cn';

export const Footer: React.FC = () => {
  const { contact, investment, adventures } = EXACT_CONTENT;

  return (
    <footer className="bg-gray-900 text-white">
      {/* Investment Section */}
      <Section padding="lg" background="default">
        <Container>
          <FadeInView animation="fadeInUp" className="text-center">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 mb-8">
              <H3 className="mb-4 text-white">
                {investment.title}
              </H3>
              <Body className="mb-6 text-gray-200">
                {investment.cta}
              </Body>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
                  style={{ color: 'white' }}
                  onClick={() => safeWindowOpen(CONTACT_INFO.whatsapp, '_blank')}
                >
                  <Phone className="w-5 h-5" style={{ color: 'white' }} />
                  <span style={{ color: 'white' }}>{investment.actions[0]}</span>
                </button>
                <button
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
                  style={{ color: 'white' }}
                  onClick={() => safeWindowOpen(CONTACT_INFO.telegram, '_blank')}
                >
                  <MessageCircle className="w-5 h-5" style={{ color: 'white' }} />
                  <span style={{ color: 'white' }}>{investment.actions[1]}</span>
                </button>
              </div>
            </div>
          </FadeInView>
        </Container>
      </Section>

      {/* Google Maps Section */}
      <Section padding="lg" background="default">
        <Container>
          <FadeInView animation="fadeInUp" className="text-center">
            <div className="w-full max-w-4xl mx-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1976.1526444613041!2d98.35119000229113!3d7.863085811670397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502fc06398cbf1%3A0xb888b96b4a2d8c1f!2zU21pbGUgU2Nvb3RlciBSZW50YWwgSmIg4oCUINCQ0YDQtdC90LTQsCDRgdC60YPRgtC10YDQvtCy!5e0!3m2!1sru!2sth!4v1754372347430!5m2!1sru!2sth"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Smile Scooter Rental Location"
              />
            </div>
          </FadeInView>
        </Container>
      </Section>

      {/* Main Footer */}
      <Section padding="lg" background="default">
        <Container>
          <motion.div
            variants={animations.staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px 0px" }}
          >
            <Grid cols={{ default: 1, md: 2, lg: 4 }} gap="lg">
              {/* Company Info */}
              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">Smile Rental Phuket</H3>
                <Body className="text-gray-300 mb-4">
                  №1 Scooter Rental for Safety and Comfort in Phuket.
                  Experience the island with confidence and style.
                </Body>
              </motion.div>

              {/* Contact Info */}
              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">Contact</H3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <a
                      href="https://t.me/renty_phuket"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {contact.telegram}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-success" />
                    <a
                      href="https://api.whatsapp.com/send/?phone=66626823973&text&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {contact.whatsapp}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-warning" />
                    <a
                      href="https://maps.app.goo.gl/cr9GmJJJmqAwA7Az6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      7 39, Chalong, Mueang Phuket District, Phuket 83000
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Adventures */}
              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">{adventures.title}</H3>
                <div className="space-y-2">
                  {adventures.tours.map((tour, index) => (
                    <Body key={index} className="text-gray-300">
                      {tour}
                    </Body>
                  ))}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">Quick Links</H3>
                <div className="space-y-2">
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Our Fleet
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Pricing
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Safety Features
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Contact Us
                  </Body>
                </div>
              </motion.div>
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <Container>
          <div className="py-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <BodySmall className="text-gray-400">
                © 2019-2026 Smile Rental Phuket. All rights reserved.
              </BodySmall>
              <div className="flex space-x-4 text-xs">
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Cookie Policy</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Return Policy</a>
              </div>
            </div>
            <BodySmall className="text-gray-400 mt-2 md:mt-0">
              Made with ❤️ for safe travels in Phuket
            </BodySmall>
          </div>

          {/* SEO Text */}
          <div className="py-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="mb-2">
                <strong>Discover Phuket on Two Wheels</strong>
              </p>
              <p className="mb-2">
                Discover Phuket on two wheels with our diverse fleet! Choose urban scooters like Honda Click (125cc/150cc), Yamaha Filano (125cc), or Suzuki Address 125 for city traffic. Prestige riders love Vespa Primavera/Sprint (150cc), while long-distance explorers opt for Honda PCX (160cc) or Yamaha Aerox/NMax (155cc). Beginners enjoy easy rides on Honda Scoopy (110cc) and Honda Air Blade (125cc), and budget travelers pick reliable underbones Honda Wave/Dream (110cc).
              </p>
              <p className="mb-2">
                For adventure seekers: touring bikes Honda CB500X, Kawasaki Versys-X 300, and BMW G310GS conquer mountain roads, while off-road beasts Honda CRF250L/150L and Kawasaki KLX 140 tackle jungle trails. Speed lovers thrill on Kawasaki Ninja 300/400 or Yamaha YZF-R3. Craving retro vibes? Cruise on Royal Enfield Classic 350 or premium Harley-Davidson Street 750.
              </p>
              <p>
                Book online — free delivery to your hotel! All bikes are insured, maintained daily, and include a helmet, lock, and island map. Save up to 20% on weekly rentals. Whether you're chasing waterfalls at Bang Pae or sunset views at Karon, your Phuket adventure starts now!
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
