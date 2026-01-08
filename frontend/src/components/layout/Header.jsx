import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Templates', href: '#templates' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Testimonials', href: '#testimonials' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* LOGO – PRIME GRADIENT ICON */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">
              InvoicePro
            </span>
          </a>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                className="text-slate-700 hover:text-indigo-600 font-medium transition-colors"
              >
                {name}
              </a>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/signin"
              className="text-slate-700 font-medium hover:text-indigo-600 transition-colors"
            >
              Sign in
            </Link>

            <Link
              to="/create/invoice"
              className="px-5 py-2 bg-linear-to-r from-indigo-600 to-emerald-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
            >
              Create invoice
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-slate-200 flex flex-col gap-4">
            {navLinks.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                className="text-slate-700 hover:text-indigo-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {name}
              </a>
            ))}

            <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
              <Link to="/signin" className="text-slate-700 font-medium">
                Sign in
              </Link>

              <Link
                to="/create/invoice"
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-full text-center"
              >
                Create Invoice
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
