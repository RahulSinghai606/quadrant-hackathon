'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: ReactNode;
}

export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  icon
}: AnimatedButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 justify-center';

  const variantClasses = {
    primary: 'bg-medical-gradient text-white shadow-lg hover:shadow-2xl',
    secondary: 'bg-medical-gradient-2 text-white shadow-lg hover:shadow-2xl',
    outline: 'border-2 border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
        />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
