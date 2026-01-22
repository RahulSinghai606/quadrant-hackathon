'use client';

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
    <nav className="bg-clinical-surface/80 backdrop-blur-sm border-b border-clinical-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-clinical-accent rounded-xl flex items-center justify-center shadow-accent-glow group-hover:shadow-accent-glow-lg transition-all duration-300">
              <FaStethoscope className="text-clinical-bg text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-clinical-text group-hover:text-clinical-accent transition-colors">
                MediVision AI
              </h1>
              <p className="text-xs text-clinical-muted">Healthcare Intelligence</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`
                      relative px-4 py-2 rounded-lg flex items-center gap-2
                      transition-all duration-200 cursor-pointer
                      ${isActive
                        ? 'bg-clinical-accent text-clinical-bg font-semibold shadow-accent-glow'
                        : 'text-clinical-muted hover:text-clinical-text hover:bg-clinical-elevated'
                      }
                    `}
                  >
                    <Icon className="text-sm" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg bg-clinical-elevated border border-clinical-border text-clinical-muted hover:text-clinical-text transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
