'use client';

import { ReactNode } from 'react';

interface ClinicalCardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'accent';
    hover?: boolean;
}

export default function ClinicalCard({
    children,
    className = '',
    variant = 'default',
    hover = true
}: ClinicalCardProps) {
    const baseClasses = 'rounded-2xl p-6 transition-all duration-300';

    const variantClasses = {
        default: `bg-clinical-surface border border-clinical-border shadow-clinical ${hover ? 'hover:border-clinical-borderLight hover:shadow-clinical-lg' : ''}`,
        elevated: `bg-clinical-elevated border border-clinical-borderLight shadow-clinical-lg`,
        accent: `bg-clinical-surface border border-clinical-accent/30 shadow-clinical ${hover ? 'hover:border-clinical-accent hover:shadow-accent-glow' : ''}`,
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </div>
    );
}

// Keep GlassCard as an alias for backward compatibility
export { ClinicalCard as GlassCard };
