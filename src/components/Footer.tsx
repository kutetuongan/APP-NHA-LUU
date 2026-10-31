import React from 'react';
import { Phone, ShieldCheck, Landmark } from 'lucide-react';
import { BrandData } from '../types';

interface FooterProps {
  brand: BrandData;
  onOpenConsultant: (msg?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ brand, onOpenConsultant }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-[#00529b] text-white flex items-center justify-center font-bold text-sm">
                VB
              </div>
              <span className="font-extrabold text-lg text-white">
                {brand.fullName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Hệ thống Kiosk tương tác khách hàng thông minh tại quầy giao dịch, hỗ trợ tra cứu tiện ích nhanh chóng, minh bạch và an toàn.
            </p>
            <div className="flex items-center gap-2 text-slate-500 pt-1">
              <Landmark className="w-3.5 h-3.5" />
              <span>Khẩu hiệu: {brand.slogan}</span>
            </div>
          </div>

          {/* Quick contact at counter */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
              Cán Bộ Hỗ Trợ Trực Tiếp Tại Quầy
            </span>
            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">
                  {brand.supportOfficer.name}
                </span>
                <span className="text-[11px] text-sky-400 font-medium">
                  {brand.supportOfficer.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Điện thoại liên hệ:</span>
                <a
                  href={`tel:${brand.supportOfficer.tel}`}
                  className="font-mono font-bold text-amber-400 hover:underline"
                >
                  {brand.supportOfficer.phone}
                </a>
              </div>
              <button
                onClick={() => onOpenConsultant('Hỗ trợ từ chân trang Kiosk')}
                className="w-full mt-2 py-1.5 px-3 bg-[#00529b] hover:bg-[#004077] text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3 h-3" />
                <span>Yêu Cầu Tư Vấn Ngay</span>
              </button>
            </div>
          </div>

          {/* Customer support hotline */}
          <div className="md:col-span-3 space-y-2.5">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
              Tổng Đài Hỗ Trợ 24/7
            </span>
            <div className="space-y-1">
              <a
                href={`tel:${brand.hotline.replace(/\s+/g, '')}`}
                className="font-mono text-xl font-black text-white hover:text-sky-300 block transition-colors"
              >
                {brand.hotline}
              </a>
              <span className="text-[11px] text-slate-500 block">
                Cước cuộc gọi theo quy định của nhà mạng
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bảo mật dữ liệu chuẩn ngân hàng</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} VietinBank. Kiosk Quầy Giao Dịch - Nâng giá trị cuộc sống.
          </div>
          <div className="flex items-center gap-4">
            <span>Phiên bản Kiosk 2.5</span>
            <span>·</span>
            <span>Hệ thống mạng lưới 155 Chi nhánh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
