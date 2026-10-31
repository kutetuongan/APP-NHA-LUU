import React from 'react';
import { Phone, UserCheck, X, Check, Clock, Shield } from 'lucide-react';
import { SupportOfficer } from '../types';

interface ConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  officer: SupportOfficer;
  contextMessage?: string;
}

export const ConsultantModal: React.FC<ConsultantModalProps> = ({
  isOpen,
  onClose,
  officer,
  contextMessage
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(officer.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-gradient-to-r from-[#00529b] to-[#0072ce] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Hỗ Trợ Trực Tiếp Tại Quầy</h3>
              <p className="text-xs text-sky-100">Cán bộ VietinBank luôn đồng hành cùng Quý khách</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {contextMessage && (
            <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-xl text-sm text-sky-900 leading-relaxed">
              {contextMessage}
            </div>
          )}

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">{officer.title}</span>
                <h4 className="text-lg font-bold text-slate-900">{officer.name}</h4>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 rounded-full flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Xác thực
              </span>
            </div>

            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00529b]" />
                <span className="text-base font-bold text-slate-800 tracking-wider font-mono">
                  {officer.phone}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs text-sky-700 hover:text-sky-900 font-medium px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 transition-colors flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã sao chép
                  </>
                ) : (
                  'Sao chép'
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Sẵn sàng hỗ trợ Quý khách trong giờ làm việc</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={`tel:${officer.tel}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-[#ed1c24] hover:bg-[#d6161d] active:scale-[0.98] transition-all shadow-sm"
            >
              <Phone className="w-4 h-4" /> Gọi điện ngay
            </a>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
