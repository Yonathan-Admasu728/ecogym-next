import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps): JSX.Element => {
  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/ecogym', icon: '📸' },
    { name: 'Bluesky', url: 'https://Bluesky.com/ecogym', icon: '🦋' },
    { name: 'Facebook', url: 'https://facebook.com/ecogym', icon: '👥' }
  ];

  return (
    <footer className={`relative bg-[#0B1120] text-gray-300 py-10 border-t border-white/5 ${className}`}>
      <div className="absolute inset-0 opacity-5">
        {/* Optional background pattern, can remove if you want a cleaner look */}
        <Image 
          src="/images/pattern.svg" 
          alt="Background pattern" 
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-12 md:space-y-0 md:space-x-8">
          {/* Brand / Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:w-1/4">
            <Link href="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/ecogym-logo.png"
                alt="EcoGym Logo"
                width={100}
                height={100}
                className="h-auto w-auto brightness-200"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-snug text-center md:text-left max-w-xs">
              Fitness Meets Wellness
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="flex flex-col sm:flex-row sm:space-x-12 md:space-x-16 w-full md:w-auto justify-center md:justify-start">
            
            {/* Quick Links */}
            <div className="flex flex-col items-center sm:items-start space-y-4 mb-8 sm:mb-0">
              <h3 className="text-md font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    href="/programs" 
                    className="hover:text-turquoise-400 transition-colors"
                  >
                    Programs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="hover:text-turquoise-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="hover:text-turquoise-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div className="flex flex-col items-center sm:items-start space-y-4 mb-8 sm:mb-0">
              <h3 className="text-md font-semibold text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    href="/privacy-policy" 
                    className="hover:text-turquoise-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms-of-service" 
                    className="hover:text-turquoise-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Connect */}
            <div className="flex flex-col items-center sm:items-start space-y-4">
              <h3 className="text-md font-semibold text-white">Connect</h3>
              <ul className="space-y-2 text-sm">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-turquoise-400 transition-colors"
                    >
                      <span className="text-lg mr-2">{link.icon}</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-700/50 text-center">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} EcoGym. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
