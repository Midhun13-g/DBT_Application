import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', text = '', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

// Page Loader Component
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader size="lg" />
        <p className="mt-4 text-lg text-gray-600">{text}</p>
      </div>
    </div>
  );
};

// Inline Loader Component
export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader size="sm" text={text} />
    </div>
  );
};

// Button Loader Component
export const ButtonLoader = () => {
  return <Loader2 className="h-4 w-4 animate-spin" />;
};

export default Loader;