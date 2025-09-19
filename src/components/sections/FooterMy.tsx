'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H3, Body, BodySmall, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_MY } from '@/data/exact-content-my';
import { CONTACT_INFO } from '@/lib/constants';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';
import { handleContactClick } from '@/utils/secure-window';

export const FooterMy: React.FC = () => {
  const { contact, investment, adventures } = EXACT_CONTENT_MY;

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
                title="Lokasi Smile Scooter Rental"
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
                  Sewa Skuter No.1 untuk keselamatan dan keselesaan di Phuket. Nikmati pulau dengan yakin dan bergaya.
                </Body>
              </motion.div>

              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">Hubungi kami</H3>
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
                <H3 className="mb-4 text-white">Pautan Pantas</H3>
                <div className="space-y-2">
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Armada Kami
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Harga
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Ciri Keselamatan
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Hubungi
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
                © 2019-2026 Smile Rental Phuket. Semua hak terpelihara.
              </BodySmall>
              <div className="flex space-x-4 text-xs">
                <a href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">Dasar Privasi</a>
                <a href="/cookie-policy" className="text-gray-500 hover:text-white transition-colors">Dasar Kuki</a>
                <a href="/return-policy" className="text-gray-500 hover:text-white transition-colors">Dasar Pemulangan</a>
              </div>
            </div>
            <BodySmall className="text-gray-400 mt-2 md:mt-0">
              Dibina dengan kasih untuk perjalanan selamat di Phuket
            </BodySmall>
          </div>

          <div className="py-3 border-t border-gray-800">
            <div className="text-xs text-gray-300 leading-relaxed max-w-4xl mx-auto">
              <p className="mb-1">
                <strong className="text-gray-200">Smile Rental Phuket</strong> ialah sewa skuter No.1 untuk keselamatan dan keselesaan di Phuket. Alami pulau dengan yakin dan gaya.
              </p>
              <p className="mb-1">
                <strong className="text-gray-200">Armada Kami:</strong> Honda Click/PCX, Yamaha Filano/NMax, Vespa Primavera, BMW G310GS, Kawasaki Ninja, Royal Enfield Classic. Semua motosikal diinsuranskan dan diselenggara setiap hari.
              </p>
              <p className="mb-1">
                <strong className="text-gray-200">Pengembaraan Termasuk:</strong> Lawatan makanan ke kafe terbaik • Lawatan foto ke lokasi ideal • Hiburan keluarga untuk semua
              </p>
              <p>
                <strong className="text-gray-200">Lokasi:</strong> 7/39, Chalong, Mueang Phuket District, Phuket 83000 • Penghantaran percuma ke hotel anda • Jimat sehingga 20% untuk sewaan mingguan
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
