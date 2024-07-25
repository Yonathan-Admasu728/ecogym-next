// app/faq/FAQContent.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is Ecogym?",
    answer: "Ecogym is a holistic fitness and meditation platform that offers personalized workout programs and mindfulness sessions to help you achieve your wellness goals."
  },
  {
    question: "How do I get started with Ecogym?",
    answer: "To get started, simply sign up for an account on our website or mobile app. You'll then be prompted to complete a short questionnaire about your fitness level and goals, which we'll use to personalize your experience."
  },
  {
    question: "Are the workouts suitable for beginners?",
    answer: "Yes, we offer workouts for all fitness levels, including beginners. Our personalized approach ensures that you'll receive exercises tailored to your current fitness level and goals."
  },
  {
    question: "Can I access Ecogym on multiple devices?",
    answer: "Absolutely! You can access your Ecogym account on any device with a web browser or by using our mobile app available for iOS and Android."
  },
  {
    question: "Do you offer meditation sessions?",
    answer: "Yes, we provide a variety of guided meditation sessions to help you reduce stress, improve focus, and enhance overall well-being."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a unique trial system at Ecogym. For all our programs, whether they're meditation sessions or workout routines, the first complete session is entirely free. This allows you to experience the quality and benefits of our various offerings before deciding to purchase. After your free session, you can choose to continue with a subscription to access the full range of our programs and features."
  }
];

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700">
      <button
        className="flex justify-between items-center w-full py-5 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium">{question}</span>
        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQContent: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQContent;