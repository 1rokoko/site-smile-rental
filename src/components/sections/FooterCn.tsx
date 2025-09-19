'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H3, Body, BodySmall, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_CN } from '@/data/exact-content-cn';
import { CONTACT_INFO } from '@/lib/constants';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';
import { handleContactClick } from '@/utils/secure-window';

export const FooterCn: React.FC = () => {
  const { contact, investment, adventures } = EXACT_CONTENT_CN;

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
                title="Smile Rental 位置"
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
                  安全与舒适首选的摩托车租赁服务，让您自信畅游普吉岛。
                </Body>
              </motion.div>

              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">联系我们</H3>
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
                <H3 className="mb-4 text-white">快速链接</H3>
                <div className="space-y-2">
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    我们的车队
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    租赁价格
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    安全配置
                  </Body>
                  <Body className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    联系我们
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
                © 2019-2026 Smile Rental Phuket. 版权所有。
              </BodySmall>
              <div className="flex space-x-4 text-xs">
                <a href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">隐私政策</a>
                <a href="/cookie-policy" className="text-gray-500 hover:text-white transition-colors">Cookie 政策</a>
                <a href="/return-policy" className="text-gray-500 hover:text-white transition-colors">退款政策</a>
              </div>
            </div>
            <BodySmall className="text-gray-400 mt-2 md:mt-0">
              用心守护您的安全旅程
            </BodySmall>
          </div>

          <div className="py-3 border-t border-gray-800">
            <div className="text-xs text-gray-300 leading-relaxed max-w-4xl mx-auto">
              <p className="mb-1">
                <strong className="text-gray-200">Smile Rental Phuket</strong> 是安全与舒适的第一选择。安心畅玩普吉岛。
              </p>
              <p className="mb-1">
                <strong className="text-gray-200">车队阵容：</strong> Honda Click/PCX、Yamaha Filano/NMax、Vespa Primavera、BMW G310GS、Kawasaki Ninja、Royal Enfield Classic。全部车辆均已投保并每日保养。
              </p>
              <p className="mb-1">
                <strong className="text-gray-200">包含体验：</strong> 顶级餐厅美食之旅 • 理想拍摄地摄影之旅 • 全家共享的精彩行程
              </p>
              <p>
                <strong className="text-gray-200">地址：</strong> 7/39, Chalong, Mueang Phuket District, Phuket 83000 • 免费送车到酒店 • 周租可节省高达 20%
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
