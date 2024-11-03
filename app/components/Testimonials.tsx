import React from 'react';
import Image from 'next/image';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Busy Professional',
    image: '/images/trainer-sarah.png',
    quote: 'EcoGym\'s guided meditation sessions have been a game-changer for my stress levels. I can now find calm anytime, anywhere!',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Fitness Enthusiast',
    image: '/images/trainer-michael.png',
    quote: 'The home workout programs at EcoGym are incredibly effective. I\'ve seen amazing results without ever stepping foot in a gym!',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Yoga Practitioner',
    image: '/images/trainer-emily.png',
    quote: 'EcoGym\'s mindfulness programs have deepened my yoga practice and improved my overall well-being. It\'s truly a holistic approach to fitness.',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <Image 
          src="/images/pattern.svg" 
          alt="Background pattern" 
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-white font-heading">
          What Our Members Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-darkBlue-800 rounded-xl shadow-lg p-8 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:shadow-turquoise-400/20 transform hover:-translate-y-1"
            >
              <div className="relative mb-6">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-turquoise-400"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div className="absolute -bottom-2 -right-2 bg-turquoise-400 rounded-full p-2 animate-pulse">
                  <FaQuoteLeft className="text-darkBlue-900 w-4 h-4" />
                </div>
              </div>
              <p className="text-lightBlue-100 italic mb-6 text-center">{testimonial.quote}</p>
              <h3 className="font-semibold text-lg text-white">{testimonial.name}</h3>
              <p className="text-turquoise-400">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
