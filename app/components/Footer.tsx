'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaChevronDown } from 'react-icons/fa';

const footerLinks = [
  {
    title: 'Programs',
    items: [
      { name: 'Workout plans', href: '/workouts' },
      { name: 'Meditation Series', href: '/meditations' },
      { name: 'Personal Training', href: '/programs' }
    ]
  },
  {
    title: 'Support',
    items: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Community', href: '/community' },
    ]
  },
  {
    title: 'Company',
    items: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
    ]
  },
  {
    title: 'Legal',
    items: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
    ]
  }
];

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="mb-12 lg:mb-0 lg:w-1/3">
            <Image
              src="/images/logo.png"
              alt="Eco Gym Logo"
              width={180}
              height={60}
              className="h-12 w-auto mb-6 filter brightness-110"
            />
            <p className="text-sm leading-7 mb-8 text-gray-400 max-w-md">
              Elevate your fitness journey with our cutting-edge workouts and mindful meditation experiences. Join a community committed to holistic well-being.
            </p>
            <div className="flex space-x-6">
              {[FaTwitter, FaFacebook, FaInstagram, FaYoutube].map((Icon, index) => (
                <a key={index} href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 transform hover:scale-110">
                  <span className="sr-only">{Icon.name.replace('Fa', '')}</span>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:w-2/3">
            {footerLinks.map((column) => (
              <div key={column.title} className="mb-8 md:mb-0">
                <button
                  className="text-sm font-semibold text-teal-400 tracking-wider uppercase mb-4 flex items-center justify-between w-full group"
                  onClick={() => isMobile && toggleSection(column.title)}
                  aria-expanded={expandedSections.has(column.title)}
                >
                  {column.title}
                  {isMobile && (
                    <FaChevronDown 
                      className={`ml-2 transition-transform duration-300 group-hover:text-teal-300 ${
                        expandedSections.has(column.title) ? 'transform rotate-180' : ''
                      }`} 
                    />
                  )}
                </button>
                <ul 
                  className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                    isMobile
                      ? expandedSections.has(column.title)
                        ? 'max-h-48 opacity-100'
                        : 'max-h-0 opacity-0'
                      : 'max-h-48 opacity-100'
                  }`}
                >
                  {column.items.map((item) => (
                    <li key={item.name} className="transform hover:translate-x-2 transition-transform duration-300">
                      <Link href={item.href} className="text-base text-gray-400 hover:text-teal-400 transition-colors duration-300">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Eco Gym. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;