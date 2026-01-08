import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Templates', href: '#templates' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'FAQ', href: '/faq', isRoute: true },
  { name: 'Contact Us', href: '/contact', isRoute: true },
  { name: 'Sign In', href: '/signin', isRoute: true },
];

const socialIcons = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Instagram', icon: Instagram },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Twitter', icon: Twitter },
  { name: 'YouTube', icon: Youtube },
];

const Footer = () => {
  // Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Social Icons */}
        <motion.div
          className="flex justify-center gap-6 mb-8"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {socialIcons.map(({ name, icon: Icon }) => (
            <motion.a
              key={name}
              href="#"
              className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
              variants={fadeUp}
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {navLinks.map((link, i) => (
            <motion.span key={link.name} className="flex items-center" variants={fadeUp}>
              {link.isRoute ? (
                <Link
                  to={link.href}
                  className="text-gray-600 hover:text-teal-500 transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-gray-600 hover:text-teal-500 transition-colors"
                >
                  {link.name}
                </a>
              )}
              {i < navLinks.length - 1 && <span className="text-gray-300 ml-6">·</span>}
            </motion.span>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.p
          className="text-gray-500 text-sm"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          Copyright © 2026 · InvoicePro Inc.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
