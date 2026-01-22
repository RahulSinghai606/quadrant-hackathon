'use client';

import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  icon,
  type = 'button'
}: AnimatedButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 justify-center';

  const variantClasses = {
    primary: 'bg-clinical-accent text-clinical-bg hover:bg-cyan-400 active:bg-cyan-500 shadow-accent-glow hover:shadow-accent-glow-lg',
    secondary: 'bg-clinical-elevated text-clinical-text border border-clinical-border hover:border-clinical-accent hover:text-clinical-accent',
    outline: 'border-2 border-clinical-accent text-clinical-accent hover:bg-clinical-accent hover:text-clinical-bg',
    ghost: 'text-clinical-muted hover:text-clinical-text hover:bg-clinical-elevated',
  };

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="text-base">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
