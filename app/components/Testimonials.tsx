'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const Testimonials = (): JSX.Element => {
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleImageError = (name: string) => {
    setImageError(prev => ({ ...prev, [name]: true }));
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-turquoise-400 to-turquoise-300">
            What Our Members Say
          </h2>
          <p className="mt-4 text-lg text-lightBlue-100">
            Real stories from our community members
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-gradient-to-b from-darkBlue-800/50 to-darkBlue-900/50 backdrop-blur-sm p-8 rounded-2xl border border-turquoise-400/20 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              whileHover={{ scale: 1.02 }}
            >
              <FaQuoteLeft className="text-3xl text-turquoise-400 mb-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              
              <p className="text-lightBlue-100 mb-6 leading-relaxed">
                {testimonial.text}
              </p>
              
              <div className="flex items-center">
                <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-turquoise-400/30">
                  <Image
                    src={imageError[testimonial.name] ? '/images/placeholder-avatar.svg' : testimonial.avatar}
                    alt=""
                    fill
                    sizes="56px"
                    style={{ objectFit: "cover" }}
                    onError={() => handleImageError(testimonial.name)}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-turquoise-400 transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-lightBlue-200">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const testimonials = [
  {
    text: "EcoGym has transformed my approach to fitness. The mindful workouts and meditation sessions have helped me achieve a perfect balance between physical and mental well-being.",
    name: "Sarah Johnson",
    title: "Member since 2023",
    avatar: "/images/trainer-sarah.png"
  },
  {
    text: "The combination of meditation and exercise has helped me achieve better balance in my life. The instructors are amazing and the community support is incredible.",
    name: "Michael Chen",
    title: "Member since 2023",
    avatar: "/images/trainer-michael.png"
  },
  {
    text: "I love how EcoGym makes wellness accessible and environmentally conscious. The programs are well-structured and the results have been amazing.",
    name: "Emily Rodriguez",
    title: "Member since 2023",
    avatar: "/images/trainer-emily.png"
  }
];

export default Testimonials;
