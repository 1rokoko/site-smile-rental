'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H3, Body, BodySmall, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_KR } from '@/data/exact-content-kr';
import { CONTACT_INFO } from '@/lib/constants';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';
import { handleContactClick } from '@/utils/secure-window';

export const FooterKr: React.FC = () => {
  const { contact, investment, adventures } = EXACT_CONTENT_KR;

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
                title="Smile Rental 위치"
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
                  안전과 편안함을 위한 No.1 스쿠터 렌탈. 자신감 있게 푸켓을 즐겨 보세요.
                </Body>
              </motion.div>

              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">문의</H3>
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
                <H3 className="mb-4 text-white">빠른 링크</H3>
                <div className="space-y-2">
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    차량 소개
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    요금 안내
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    안전 기능
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    문의하기
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
                © 2019-2026 Smile Rental Phuket. 모든 권리 보유.
              </BodySmall>
              <div className="flex space-x-4 text-xs">
                <a href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">개인정보 처리방침</a>
                <a href="/cookie-policy" className="text-gray-500 hover:text-white transition-colors">쿠키 정책</a>
                <a href="/return-policy" className="text-gray-500 hover:text-white transition-colors">환불 정책</a>
              </div>
            </div>
            <BodySmall className="text-gray-400 mt-2 md:mt-0">
              안전한 여행을 위해 정성껏 준비했습니다
            </BodySmall>
          </div>

          <div className="py-3 border-t border-gray-800">
            <div className="text-xs text-gray-300 leading-relaxed max-w-4xl mx-auto">
              <p className="mb-1">
                <strong className="text-gray-200">Smile Rental Phuket</strong>은(는) 안전과 편안함을 위한 최고의 스쿠터 렌탈 서비스입니다. 믿고 푸켓을 즐겨 보세요.
              </p>
              <p className="mb-1">
                <strong className="text-gray-200">보유 차량:</strong> Honda Click/PCX, Yamaha Filano/NMax, Vespa Primavera, BMW G310GS, Kawasaki Ninja, Royal Enfield Classic. 모든 차량은 보험 가입 및 매일 점검됩니다.
              </p>
              <p className="mb-1">
                <strong className="text-gray-200">포함 서비스:</strong> 최고 맛집을 소개하는 푸드 투어 • 완벽한 촬영지를 찾는 포토 투어 • 가족 모두가 즐기는 액티비티
              </p>
              <p>
                <strong className="text-gray-200">위치:</strong> 7/39, Chalong, Mueang Phuket District, Phuket 83000 • 호텔까지 무료 배송 • 주간 렌탈 시 최대 20% 절약
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
