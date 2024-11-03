import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLeaf, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-darkBlue-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <Image src="/images/pattern.svg" alt="Background pattern" layout="fill" objectFit="cover" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image src="/images/ecogym-logo.png" alt="EcoGym Logo" width={40} height={40} className="mr-2" />
              <span className="text-2xl font-bold text-turquoise-400">EcoGym</span>
            </Link>
            <p className="text-lightBlue-100 mb-4">Transforming minds and bodies, anytime, anywhere.</p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-turquoise-400 hover:text-white transition-colors duration-300 transform hover:scale-110"><FaFacebook size={24} /></a>
              <a href="#" className="text-turquoise-400 hover:text-white transition-colors duration-300 transform hover:scale-110"><FaTwitter size={24} /></a>
              <a href="#" className="text-turquoise-400 hover:text-white transition-colors duration-300 transform hover:scale-110"><FaInstagram size={24} /></a>
              <a href="#" className="text-turquoise-400 hover:text-white transition-colors duration-300 transform hover:scale-110"><FaYoutube size={24} /></a>
            </div>
            <form className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-darkBlue-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-turquoise-400 mb-2 sm:mb-0"
              />
              <button 
                type="submit" 
                className="bg-turquoise-400 text-darkBlue-900 px-4 py-2 rounded-r-lg hover:bg-turquoise-500 transition-colors duration-300"
              >
                <FaEnvelope className="inline mr-2" />
                Subscribe
              </button>
            </form>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-turquoise-400">Our Programs</h4>
            <ul className="space-y-2">
              <li><Link href="/programs/meditation" className="text-lightBlue-100 hover:text-white transition-colors duration-300">Meditation</Link></li>
              <li><Link href="/programs/mindfulness" className="text-lightBlue-100 hover:text-white transition-colors duration-300">Mindfulness</Link></li>
              <li><Link href="/programs/workouts" className="text-lightBlue-100 hover:text-white transition-colors duration-300">Home Workouts</Link></li>
              <li><Link href="/programs" className="text-lightBlue-100 hover:text-white transition-colors duration-300">All Programs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-turquoise-400">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-lightBlue-100 hover:text-white transition-colors duration-300">About Us</Link></li>
              <li><Link href="/contact" className="text-lightBlue-100 hover:text-white transition-colors duration-300">Contact</Link></li>
              <li><Link href="/blog" className="text-lightBlue-100 hover:text-white transition-colors duration-300">Blog</Link></li>
              <li><Link href="/faq" className="text-lightBlue-100 hover:text-white transition-colors duration-300">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-turquoise-400">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms-of-service" className="text-lightBlue-100 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-lightBlue-100 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-darkBlue-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-lightBlue-100 mb-4 md:mb-0">&copy; {new Date().getFullYear()} EcoGym. All rights reserved.</p>
          <div className="flex items-center">
            <FaLeaf className="text-turquoise-400 mr-2" />
            <span className="text-lightBlue-100">Nurturing your mind and body, naturally</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;