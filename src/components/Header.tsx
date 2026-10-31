import React, { useState, useEffect } from 'react';
import { Phone, UserCheck, ShieldCheck } from 'lucide-react';
import { BrandData } from '../types';

interface HeaderProps {
  brand: BrandData;
  onOpenConsultant: (message?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ brand, onOpenConsultant }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Zone 1: Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-auto flex items-center justify-center">
                <img
                  src={brand.logoUrl}
                  alt="VietinBank Logo"
                  className="h-9 w-auto object-contain max-w-[170px]"
                  onError={(e) => {
                    // Fallback to stylized SVG lockup if raw github asset is delayed
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="hidden items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-[#00529b] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                    VB
                  </div>
                  <span className="font-extrabold text-xl tracking-tight text-[#00529b]">
                    VietinBank
                  </span>
                </div>
              </div>
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Kiosk Quầy Giao Dịch
                </span>
                <span className="text-[11px] text-slate-400 block -mt-0.5">
                  {brand.slogan}
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Counter Live Status & Officer Info */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">Điểm Quầy Trực Tuyến</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono font-medium text-slate-800">{currentTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00529b]" />
              <span className="font-medium">Chuyên viên hỗ trợ:</span>
              <span className="font-semibold text-slate-800">{brand.supportOfficer.name}</span>
            </div>
          </div>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`tel:${brand.hotline.replace(/\s+/g, '')}`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#00529b] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#00529b]" />
              <span>Hotline {brand.hotline}</span>
            </a>

            <button
              onClick={() => onOpenConsultant('Quý khách cần hỗ trợ dịch vụ ngân hàng tại quầy?')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#ed1c24] hover:bg-[#d6161d] active:scale-95 rounded-lg transition-all shadow-xs whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4" />
              <span>Gặp Chuyên Viên Tư Vấn</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
