'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H3, Body, BodySmall, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_RU } from '@/data/exact-content-ru';
import { CONTACT_INFO } from '@/lib/constants';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';
import { safeWindowOpen } from '@/utils/cn';

export const FooterRu: React.FC = () => {
  const { contact, investment, adventures } = EXACT_CONTENT_RU;

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
                title="Расположение Smile Scooter Rental"
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
                <H3 className="mb-4 text-white">Smile Rental Пхукет</H3>
                <Body className="text-gray-300 mb-4">
                  №1 Аренда скутеров для безопасности и комфорта на Пхукете.
                  Исследуйте остров с уверенностью и стилем.
                </Body>
              </motion.div>

              {/* Contact Info */}
              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">Контакты</H3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <a
                      href={CONTACT_INFO.telegram}
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
                      href={CONTACT_INFO.whatsapp}
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
                      7 39, Чалонг, Муанг Пхукет, Пхукет 83000
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
                <H3 className="mb-4 text-white">Быстрые ссылки</H3>
                <div className="space-y-2">
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Наш автопарк
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Цены
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Функции безопасности
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Связаться с нами
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
                © 2019-2026 Smile Rental Пхукет. Все права защищены.
              </BodySmall>
              <div className="flex space-x-4 text-xs">
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Политика конфиденциальности</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Политика cookies</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Политика возврата</a>
              </div>
            </div>
            <BodySmall className="text-gray-400 mt-2 md:mt-0">
              Сделано с ❤️ для безопасных путешествий на Пхукете
            </BodySmall>
          </div>

          {/* SEO Text - Russian */}
          <div className="py-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="mb-2">
                <strong>Откройте Пхукет на двух колесах</strong>
              </p>
              <p className="mb-2">
                Откройте Пхукет на двух колесах с нашим разнообразным автопарком! Выбирайте городские скутеры Honda Click (125cc/150cc), Yamaha Filano (125cc) или Suzuki Address 125 для городского трафика. Престижные райдеры любят Vespa Primavera/Sprint (150cc), а путешественники на дальние расстояния выбирают Honda PCX (160cc) или Yamaha Aerox/NMax (155cc). Новички наслаждаются легкой ездой на Honda Scoopy (110cc) и Honda Air Blade (125cc), а бюджетные путешественники выбирают надежные Honda Wave/Dream (110cc).
              </p>
              <p className="mb-2">
                Для искателей приключений: туристические мотоциклы Honda CB500X, Kawasaki Versys-X 300 и BMW G310GS покоряют горные дороги, а внедорожные звери Honda CRF250L/150L и Kawasaki KLX 140 справляются с джунглевыми тропами. Любители скорости получают удовольствие от Kawasaki Ninja 300/400 или Yamaha YZF-R3. Хотите ретро-атмосферу? Прокатитесь на Royal Enfield Classic 350 или премиальном Harley-Davidson Street 750.
              </p>
              <p>
                Бронируйте онлайн — бесплатная доставка в ваш отель! Все мотоциклы застрахованы, обслуживаются ежедневно и включают шлем, замок и карту острова. Экономьте до 20% при недельной аренде. Независимо от того, гонитесь ли вы за водопадами в Банг Пае или закатами в Кароне, ваше приключение на Пхукете начинается прямо сейчас!
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
