// app/community/CommunityContent.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { FaQuoteLeft, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

const testimonials = [
  { name: "Sarah L.", quote: "Ecogym has transformed not just my body, but my entire approach to wellness. The community here is incredibly supportive!", avatar: "/images/trainer-laura.png" },
  { name: "Mike T.", quote: "I've tried many gyms, but Ecogym's holistic approach to fitness is unparalleled. The mindfulness sessions have been a game-changer for me.", avatar: "/images/trainer-robert.png" },
  { name: "Elena R.", quote: "The sense of community at Ecogym is what keeps me coming back. It's more than a gym; it's a family.", avatar: "/images/trainer-sarah.png" },
];

const events = [
  { name: "Monthly Fitness Challenge", date: "Sept 1-30, 2023", description: "Push your limits with our community-wide fitness challenge!" },
  { name: "Mindfulness Workshop", date: "Aug 15, 2023", description: "Learn advanced meditation techniques from our expert instructors." },
  { name: "Nutrition Seminar", date: "Aug 22, 2023", description: "Discover the power of proper nutrition for optimal fitness results." },
];

const CommunityContent = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1 
          className="text-5xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Join Our Thriving Community
        </motion.h1>
        
        <motion.p 
          className="text-xl text-center mb-12 text-gray-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          At Ecogym, we&apos;re more than just a fitness center. We&apos;re a community of like-minded individuals committed to holistic wellness and personal growth.
        </motion.p>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">What Our Members Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <FaQuoteLeft className="text-4xl text-teal-400 mb-4" />
                <p className="mb-4">{testimonial.quote}</p>
                <div className="flex items-center">
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    width={48} 
                    height={48} 
                    className="rounded-full mr-4"
                  />
                  <span className="font-semibold">{testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Upcoming Community Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                <p className="text-teal-400 mb-2">{event.date}</p>
                <p>{event.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center">Connect With Us</h2>
          <div className="flex justify-center space-x-8">
            {[FaInstagram, FaFacebook, FaTwitter].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-4xl text-gray-400 hover:text-teal-400 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommunityContent;