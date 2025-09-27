import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  const contactInfo = [
    { icon: Phone, text: '1800-11-1400', label: 'Helpline' },
    { icon: Mail, text: 'help@dbt.gov.in', label: 'Email Support' },
    { icon: MapPin, text: 'New Delhi, India', label: 'Head Office' }
  ];

  const quickLinks = [
    { name: 'DBT Guidelines', href: '#' },
    { name: 'Bank List', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Contact Us', href: '#' }
  ];

  const governmentLinks = [
    { name: 'Digital India', href: 'https://digitalindia.gov.in', external: true },
    { name: 'MyGov', href: 'https://mygov.in', external: true },
    { name: 'India.gov.in', href: 'https://india.gov.in', external: true },
    { name: 'GOI Web Directory', href: 'https://goidirectory.nic.in', external: true }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Direct Benefit Transfer Portal</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              The DBT Portal enables citizens to check their bank account seeding status 
              and get assistance with linking their Aadhaar to their bank accounts for 
              seamless benefit transfers.
            </p>
            <div className="flex flex-col space-y-2">
              {contactInfo.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.text} className="flex items-center space-x-3">
                    <IconComponent className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-300">
                      {item.label}: {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Government Links</h3>
            <ul className="space-y-2">
              {governmentLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center space-x-1"
                  >
                    <span>{link.name}</span>
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Government of India. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;