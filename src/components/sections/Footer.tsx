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
                <div className="flex space-x-4">
                  <a
                    href={CONTACT_INFO.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <a
                    href={CONTACT_INFO.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-success rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div variants={animations.staggerItem}>
                <H3 className="mb-4 text-white">Contact</H3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <Body className="text-gray-300">{contact.telegram}</Body>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-success" />
                    <Body className="text-gray-300">{contact.whatsapp}</Body>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-warning" />
                    <Body className="text-gray-300">Phuket, Thailand</Body>
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
            <BodySmall className="text-gray-400">
              © 2019-2026 Smile Rental Phuket. All rights reserved.
            </BodySmall>
            <BodySmall className="text-gray-400 mt-2 md:mt-0">
              Made with ❤️ for safe travels in Phuket
            </BodySmall>
          </div>
        </Container>
      </div>
    </footer>
  );
};
