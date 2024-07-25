// app/about/AboutContent.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { FaDumbbell, FaYinYang, FaHeartbeat, FaBrain } from 'react-icons/fa';
import SEO from '../components/SEO';

const AboutContent = () => {
  return (
    <>
      <SEO 
        title="About Ecogym | Holistic Fitness and Meditation Platform"
        description="Discover Ecogym, your all-in-one platform for expert-led workouts and guided meditations. Elevate your physical and mental wellbeing with our personalized approach to holistic fitness."
        url="https://ecogym.space/about"
        image="/images/about-hero.jpg" // Local image
      />
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <header className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">About Ecogym</h1>
            <p className="text-xl text-gray-300">Elevate Your Mind and Body</p>
          </header>

          <section className="mb-20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <Image
                  src="/images/about-hero.jpg" // Local image
                  alt="Ecogym: Holistic Fitness and Meditation Platform"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <h2 className="text-3xl font-semibold mb-6 text-teal-400">Our Mission</h2>
                <p className="text-lg mb-6">
                  At Ecogym, we believe in the power of holistic wellness. Our mission is to provide a 
                  comprehensive platform that nurtures both your physical strength and mental clarity. 
                  We combine cutting-edge workout routines with mindful meditation practices to help you 
                  achieve balance and peak performance in all aspects of your life.
                </p>
                <p className="text-lg">
                  Whether you&apos;re a fitness enthusiast or a meditation novice, Ecogym is your partner in 
                  the journey towards a healthier, more centered you.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-semibold mb-12 text-center text-teal-400">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: FaDumbbell, title: "Expert-Led Workouts", description: "Diverse range of exercises crafted by certified trainers" },
                { icon: FaYinYang, title: "Guided Meditations", description: "Mindfulness sessions to reduce stress and improve focus" },
                { icon: FaHeartbeat, title: "Holistic Approach", description: "Integrating physical fitness with mental wellbeing" },
                { icon: FaBrain, title: "Personalized Growth", description: "Adaptive programs that evolve with your progress" }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                  <feature.icon className="text-5xl mb-4 text-teal-400 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-8 text-center text-teal-400">Join Our Community</h2>
            <p className="text-lg text-center mb-8">
              Become part of a supportive community dedicated to personal growth and wellness. 
              Share your journey, celebrate victories, and motivate each other to reach new heights.
            </p>
            <div className="text-center">
              <a 
                href="#" 
                className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-teal-600 transition duration-300"
              >
                Start Your Journey Today
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutContent;
