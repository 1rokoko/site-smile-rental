'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H3, Body, BodySmall, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_IN } from '@/data/exact-content-in';
import { CONTACT_INFO } from '@/lib/constants';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';
import { handleContactClick } from '@/utils/secure-window';

export const FooterIn: React.FC = () => {
  const { contact, investment, adventures } = EXACT_CONTENT_IN;

  return (
    <footer className="bg-gray-900 text-white">
      <Section padding="lg" background="default">
        <Container>
          <FadeInView animation="fadeInUp" className="text-center">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 mb-8">
              <H3 className="mb-4 text-white">{investment.title}</H3>
              <Body className="mb-6 text-gray-200">{investment.cta}</Body>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
                  style={{ color: 'white' }}
                  onClick={() => handleContactClick('whatsapp', CONTACT_INFO.whatsapp)}
                >
                  <Phone className="w-5 h-5" style={{ color: 'white' }} />
                  <span style={{ color: 'white' }}>{investment.actions[0]}</span>
                </button>
                <button
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
                  style={{ color: 'white' }}
                  onClick={() => handleContactClick('telegram', CONTACT_INFO.telegram)}
                >
                  <MessageCircle className="w-5 h-5" style={{ color: 'white' }} />
                  <span style={{ color: 'white' }}>{investment.actions[1]}</span>
                </button>
              </div>
            </div>
          </FadeInView>
        </Container>
      </Section>

      <Section padding="lg" background="default">
        <Container>
          <FadeInView animation="fadeInUp" className="text-center">
            <div className="w-full max-w-4xl mx-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.307022925415!2d98.34871311196726!3d7.862903792126352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502fc06398cbf1%3A0xb888b96b4a2d8c1f!2zU21pbGUgU2Nvb3RlciBSZW50YWwgSmIg4oCUINCQ0YDQtdC90LTQsCDRgdC60YPRgtC10YDQvtCy!5e0!3m2!1sru!2sth!4v1754930859552!5m2!1sru!2sth"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Smile Rental का स्थान"
              />
            </div>
          </FadeInView>
        </Container>
      </Section>

      <Section padding="lg" background="default">
        <Container>
          <motion.div
            variants={animations.staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px 0px' }}
          >
            <Grid cols={{ default: 1, md: 2, lg: 4 }} gap="lg">
              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">Smile Rental Phuket</H3>
                <Body className="text-gray-300 mb-4">
                  सुरक्षा और आराम के लिए नंबर 1 स्कूटर रेंटल। आत्मविश्वास और स्टाइल के साथ फुकेत का आनंद लें।
                </Body>
              </motion.div>

              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">संपर्क</H3>
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
                      href="https://wa.me/66626823973?text=Hi-Want-rent-scooter"
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

              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">{adventures.title}</H3>
                <div className="space-y-2">
                  {adventures.tours.map((tour) => (
                    <Body key={tour} className="text-gray-300">
                      {tour}
                    </Body>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">त्वरित लिंक</H3>
                <div className="space-y-2">
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    हमारा बेड़ा
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    किराया दरें
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    सुरक्षा सुविधाएँ
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    संपर्क करें
                  </Body>
                </div>
              </motion.div>
            </Grid>
          </motion.div>
        </Container>
      </Section>

      <div className="border-t border-gray-800">
        <Container>
          <div className="py-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <BodySmall className="text-gray-400">
                © 2019-2026 Smile Rental Phuket. सर्वाधिकार सुरक्षित।
              </BodySmall>
              <div className="flex space-x-4 text-xs">
                <a href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">गोपनीयता नीति</a>
                <a href="/cookie-policy" className="text-gray-500 hover:text-white transition-colors">कुकी नीति</a>
                <a href="/return-policy" className="text-gray-500 hover:text-white transition-colors">रिफंड नीति</a>
              </div>
            </div>
            <BodySmall className="text-gray-400 mt-2 md:mt-0">
              सुरक्षित यात्राओं के लिए प्रेम से तैयार
            </BodySmall>
          </div>

          <div className="py-3 border-t border-gray-800">
            <div className="text-xs text-gray-300 leading-relaxed max-w-4xl mx-auto">
              <p className="mb-1">
                <strong className="text-gray-200">Smile Rental Phuket</strong> सुरक्षा और आराम के लिए प्रमुख स्कूटर रेंटल है। आत्मविश्वास के साथ द्वीप की खोज करें।
              </p>
              <p className="mb-1">
                <strong className="text-gray-200">हमारा बेड़ा:</strong> Honda Click/PCX, Yamaha Filano/NMax, Vespa Primavera, BMW G310GS, Kawasaki Ninja, Royal Enfield Classic. सभी बाइक्स बीमित और रोज़ाना मेंटेन की जाती हैं।
              </p>
              <p className="mb-1">
                <strong className="text-gray-200">शामिल अनुभव:</strong> बेहतरीन कैफ़े के साथ फूड टूर • आदर्श लोकेशंस के लिए फोटो टूर • परिवार के लिए मनोरंजन
              </p>
              <p>
                <strong className="text-gray-200">स्थान:</strong> 7/39, Chalong, Mueang Phuket District, Phuket 83000 • आपके होटल तक मुफ्त डिलीवरी • साप्ताहिक किराए पर 20% तक बचत
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
