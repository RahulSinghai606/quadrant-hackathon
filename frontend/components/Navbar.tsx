'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaStethoscope, FaSearch, FaUserMd, FaPrescriptionBottle, FaInfoCircle } from 'react-icons/fa';

const navItems = [
  { name: 'Diagnosis', path: '/diagnosis', icon: FaStethoscope },
  { name: 'Knowledge', path: '/knowledge', icon: FaSearch },
  { name: 'Patients', path: '/patients', icon: FaUserMd },
  { name: 'Treatment', path: '/treatment', icon: FaPrescriptionBottle },
  { name: 'About', path: '/about', icon: FaInfoCircle },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass border-b border-white/20 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-medical-gradient rounded-xl flex items-center justify-center glow">
                <FaStethoscope className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">MediVision AI</h1>
                <p className="text-xs text-slate-600">Healthcare Intelligence</p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative px-4 py-2 rounded-lg flex items-center gap-2
                      transition-all duration-300 cursor-pointer
                      ${isActive
                        ? 'bg-medical-gradient text-white shadow-lg'
                        : 'text-slate-700 hover:bg-white/50'
                      }
                    `}
                  >
                    <Icon className="text-sm" />
                    <span className="font-medium text-sm">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-medical-gradient rounded-lg -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg glass"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
