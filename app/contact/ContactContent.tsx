// app/contact/ContactContent.tsx
'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

import { logger } from '../utils/logger';

const ContactContent = (): JSX.Element => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    logger.info('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
    alert('Thank you for your message. We\'ll get back to you soon!');
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1 
          className="text-5xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get in Touch
        </motion.h1>
        
        <motion.p 
          className="text-xl text-center mb-12 text-gray-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          We&apos;re here to answer any questions you may have about Ecogym.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            className="bg-gray-800 p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <p className="flex items-center">
                <FaEnvelope className="mr-4 text-teal-400" />
                support@ecogym.space
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-4 text-teal-400" />
                +1 (555) 123-4567
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-4 text-teal-400" />
                123 Fitness Street, Wellness City, EC 12345
              </p>
            </div>
          </motion.div>

          <motion.form 
            className="bg-gray-800 p-8 rounded-lg shadow-lg"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-teal-500 focus:bg-gray-600 focus:ring-0 text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-teal-500 focus:bg-gray-600 focus:ring-0 text-white"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-teal-500 focus:bg-gray-600 focus:ring-0 text-white"
                 />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Send Message
              </button>
            </div>
          </motion.form>
        </div>

        <motion.div 
          className="rounded-lg overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215644210001!2d-73.98506898434255!3d40.75803684285305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1579794014959!5m2!1sen!2sus" 
            width="100%" 
            height="450" 
            frameBorder="0" 
            style={{border:0}} 
            allowFullScreen={true}
            aria-hidden="false" 
            tabIndex={0}
           />
        </motion.div>
      </div>
    </div>
  );
};

export default ContactContent;
