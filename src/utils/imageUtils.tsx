import React, { useState } from 'react';
import { ImageOff, Landmark, CreditCard, ShieldCheck, Smartphone, Store, Building2 } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'bank' | 'card' | 'security' | 'phone' | 'store' | 'building' | 'generic';
  fallbackText?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Image',
  fallbackType = 'generic',
  fallbackText,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getFallbackIcon = () => {
    switch (fallbackType) {
      case 'bank':
        return <Landmark className="w-10 h-10 text-sky-600" />;
      case 'card':
        return <CreditCard className="w-10 h-10 text-sky-600" />;
      case 'security':
        return <ShieldCheck className="w-10 h-10 text-emerald-600" />;
      case 'phone':
        return <Smartphone className="w-10 h-10 text-sky-600" />;
      case 'store':
        return <Store className="w-10 h-10 text-amber-600" />;
      case 'building':
        return <Building2 className="w-10 h-10 text-sky-700" />;
      default:
        return <ImageOff className="w-8 h-8 text-slate-400" />;
    }
  };

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-100 rounded-xl text-center ${containerClassName}`}
        style={{ minHeight: '140px' }}
      >
        <div className="p-3 bg-white rounded-full shadow-sm mb-2">{getFallbackIcon()}</div>
        <span className="text-xs font-medium text-slate-600 max-w-[200px] line-clamp-2">
          {fallbackText || alt}
        </span>
        <span className="text-[10px] text-sky-700 mt-0.5 font-semibold">VietinBank Counter</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
          <Landmark className="w-6 h-6 text-slate-300 animate-bounce" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
};
