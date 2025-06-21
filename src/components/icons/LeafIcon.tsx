import React from 'react';

interface IconProps {
    className?: string;
}

export const LeafIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path d="M12 4c-2.9 0-5.43 1.54-6.85 3.82C6.16 9.49 7.29 11.27 9 12.34V15c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-2.66c1.71-1.07 2.84-2.85 3.85-4.53C17.43 5.54 14.9 4 12 4zM12 10c-.83 0-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5S12.83 10 12 10z" />
    </svg>
); 