import React from 'react';

interface IconProps {
    className?: string;
}

export const CornerAccentIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        fill="currentColor"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <polygon points="35,0 100,0 100,65 55,100 35,100" />
    </svg>
); 