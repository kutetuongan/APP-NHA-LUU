import React from 'react';
import { Apple, Play, Download, Smartphone, QrCode, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { AppDownloadData } from '../types';

interface AppDownloadSectionProps {
  data: AppDownloadData;
}

export const AppDownloadSection: React.FC<AppDownloadSectionProps> = ({ data }) => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#00529b] via-[#004077] to-[#002b54] rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Smartphone className="w-96 h-96 -mr-16 -mb-16" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Ngân Hàng Số VietinBank iPay Mobile
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {data.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* QR Code and Direct Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Store */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Apple className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    VietinBank iPay trên iPhone
                  </h3>
                  <span className="text-xs text-slate-500">Dành cho hệ điều hành iOS (App Store)</span>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold text-sky-700 bg-sky-50 rounded-md border border-sky-100">
                iOS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
                <img
                  src={data.ios.qrUrl}
                  alt="QR Code tải iPay trên App Store"
                  className="w-36 h-36 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-[#00529b]">
                  <QrCode className="w-4 h-4" />
                  <span>Quét mã tải nhanh</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dùng camera iPhone quét mã QR bên cạnh để mở trang tải iPay chính thức trên Apple App Store.
                </p>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400">
                    Hỗ trợ iOS 12.0 trở lên · Miễn phí 100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <a
              href={data.ios.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Mở App Store trực tiếp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Android Store */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Play className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    VietinBank iPay trên Android
                  </h3>
                  <span className="text-xs text-slate-500">Dành cho Samsung, Xiaomi, OPPO... (Google Play)</span>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-100">
                Android
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
                <img
                  src={data.android.qrUrl}
                  alt="QR Code tải iPay trên Google Play"
                  className="w-36 h-36 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-700">
                  <QrCode className="w-4 h-4" />
                  <span>Quét mã tải nhanh</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mở máy ảnh hoặc Zalo trên điện thoại Android, quét mã QR để tải trực tiếp từ Google Play Store.
                </p>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400">
                    Bản chuẩn chính hãng VietinBank · An toàn bảo mật
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <a
              href={data.android.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Mở Google Play trực tiếp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#00529b]" />
          <h3 className="font-bold text-slate-900 text-sm">
            Đặc quyền khi trải nghiệm Ngân hàng số VietinBank iPay
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-1.5"
            >
              <span className="text-xs font-bold text-[#00529b]">0{idx + 1}.</span>
              <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
