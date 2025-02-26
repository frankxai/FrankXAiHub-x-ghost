import { Link } from "wouter";
import { COMPANY_INFO, FOOTER_LINKS } from "@/lib/constants";
import { FaLinkedin, FaTwitter, FaYoutube, FaMedium } from "react-icons/fa";

const getSocialIcon = (icon: string) => {
  switch (icon) {
    case 'linkedin':
      return <FaLinkedin className="text-xl" />;
    case 'twitter':
      return <FaTwitter className="text-xl" />;
    case 'youtube':
      return <FaYoutube className="text-xl" />;
    case 'medium':
      return <FaMedium className="text-xl" />;
    default:
      return null;
  }
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-clash font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00C2FF] to-[#FF3366]">
                {COMPANY_INFO.name}
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              {COMPANY_INFO.description}
            </p>
            <div className="flex space-x-4">
              {COMPANY_INFO.social.map((item) => (
                <a 
                  key={item.name}
                  href={item.url} 
                  className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  aria-label={item.name}
                >
                  {getSocialIcon(item.icon)}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-clash font-bold text-lg mb-6">Solutions</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.solutions.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.url}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-clash font-bold text-lg mb-6">Resources</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.resources.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.url}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-clash font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.url}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">© 2025 FrankX.AI. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
