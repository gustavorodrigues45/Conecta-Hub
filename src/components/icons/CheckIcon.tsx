import React from 'react';

interface IconProps {
    className?: string;
}

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={3}
        stroke="currentColor"
        className={className}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
); 