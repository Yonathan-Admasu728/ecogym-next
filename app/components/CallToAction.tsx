import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaStar } from 'react-icons/fa';

const CallToAction: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-turquoise-600 to-turquoise-400 py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Image 
          src="/images/pattern.svg" 
          alt="Background pattern" 
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
          Transform Your Mind and Body with EcoGym
        </h2>
        <p className="text-lg sm:text-xl text-white mb-10 max-w-2xl mx-auto">
          Start your journey to wellness today with our expert-led meditation, mindfulness, and home workout programs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/signup" className="w-full sm:w-auto bg-white text-turquoise-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-opacity-90 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Get Started Now
          </Link>
          <Link href="/programs" className="w-full sm:w-auto group bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white hover:text-turquoise-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
            Explore Programs
            <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
      <div className="mt-16 text-center relative z-10">
        <p className="text-white text-lg font-semibold">
          Join thousands of satisfied members on their wellness journey
        </p>
        <div className="flex justify-center items-center mt-4 space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar key={star} className="w-6 h-6 text-yellow-400 animate-pulse" />
          ))}
        </div>
        <p className="text-white mt-2 font-medium">
          4.9 out of 5 stars from over 1,000 reviews
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
