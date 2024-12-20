'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';

import { logger } from '../utils/logger';

const CallToAction = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    logger.info('CTA button clicked');
    router.push('/programs');
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-darkBlue-800 to-darkBlue-900">
        <Image
          src="/images/pattern.svg"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          className="opacity-5 mix-blend-overlay"
          priority
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-turquoise-400 to-turquoise-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Start Your Wellness Journey Today
          </motion.h2>

          <motion.p 
            className="text-xl text-lightBlue-100 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join our community of mindful movers and discover a better way to exercise. 
            Transform your mind and body with expert-led programs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={handleGetStarted}
              className={`
                group
                inline-flex items-center justify-center
                bg-gradient-to-r from-turquoise-500 to-turquoise-400
                text-darkBlue-900 font-bold
                px-8 py-4 rounded-xl
                transition-all duration-300
                transform hover:-translate-y-1
                shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">Get Started Now</span>
              <FaArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-10 text-lightBlue-200 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p>No credit card required • Free programs available</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-turquoise-400/20 to-transparent" />
      <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-turquoise-400/40 to-transparent" />
    </section>
  );
};

export default CallToAction;
