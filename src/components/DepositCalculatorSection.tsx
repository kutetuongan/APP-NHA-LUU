import React, { useState } from 'react';
import {
  PiggyBank,
  AlertCircle,
  ExternalLink,
  Coins,
  TrendingUp,
  Info
} from 'lucide-react';
import { DepositCalculatorData } from '../types';
import { formatVND, formatNumber, parseNumberFromString, calculateDepositInterest } from '../utils/formatters';

interface DepositCalculatorSectionProps {
  data: DepositCalculatorData;
  onOpenConsultant: (msg?: string) => void;
}

export const DepositCalculatorSection: React.FC<DepositCalculatorSectionProps> = ({
  data,
  onOpenConsultant
}) => {
  // Initial default values: 50 million VND, 12 months, 5.0%
  const [amountStr, setAmountStr] = useState<string>('50,000,000');
  const [selectedTermMonths, setSelectedTermMonths] = useState<number>(12);
  const [rateStr, setRateStr] = useState<string>('5.0');
  const [touched, setTouched] = useState<{ amount: boolean; term: boolean; rate: boolean }>({
    amount: false,
    term: false,
    rate: false
  });

  const parsedAmount = parseNumberFromString(amountStr);
  const parsedRate = parseFloat(rateStr);

  // Validation rules per PDF 2
  const isAmountValid = parsedAmount > 0 && parsedAmount >= (data.minAmount || 1000000);
  const isTermValid = selectedTermMonths > 0;
  const isRateValid = !isNaN(parsedRate) && parsedRate >= 0 && parsedRate <= 25;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleanDigits = raw.replace(/[^\d]/g, '');
    if (!cleanDigits) {
      setAmountStr('');
      return;
    }
    const num = parseInt(cleanDigits, 10);
    setAmountStr(formatNumber(num));
    setTouched((prev) => ({ ...prev, amount: true }));
  };

  const handleTermChange = (months: number) => {
    setSelectedTermMonths(months);
    setTouched((prev) => ({ ...prev, term: true }));
    // Auto-fill suggested benchmark rate for the selected term
    const matched = data.termOptions.find((t) => t.months === months);
    if (matched) {
      setRateStr(matched.rate.toFixed(1));
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRateStr(e.target.value);
    setTouched((prev) => ({ ...prev, rate: true }));
  };

  // Quick preset amounts
  const presetAmounts = [20000000, 50000000, 100000000, 200000000, 500000000];

  // Calculation results
  const calculation = (isAmountValid && isTermValid && isRateValid)
    ? calculateDepositInterest(parsedAmount, selectedTermMonths, parsedRate)
    : { interest: 0, total: 0 };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#00529b] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Chuyên mục 4 · Tiền gửi tiết kiệm
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {data.title}
        </h2>
        <p className="text-sm text-slate-600">
          {data.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Left Column) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-[#00529b]" />
              <span>Nhập thông tin tiền gửi dự tính</span>
            </h3>
            <span className="text-xs text-slate-400">Đơn vị: VND</span>
          </div>

          {/* 1. Số tiền gửi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Tổng số tiền gửi <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500">
                Tối thiểu: {formatVND(data.minAmount || 1000000)}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={amountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi (VD: 50.000.000)"
                className={`w-full text-lg sm:text-xl font-bold py-3.5 px-4 pr-16 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                  touched.amount && !isAmountValid
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-[#00529b] focus:ring-2 focus:ring-[#00529b]/10'
                }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                VND
              </div>
            </div>

            {/* Quick amount chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-400">Chọn nhanh:</span>
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setAmountStr(formatNumber(amt));
                    setTouched((prev) => ({ ...prev, amount: true }));
                  }}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#00529b] text-slate-600 transition-colors"
                >
                  {formatNumber(amt / 1000000)} triệu
                </button>
              ))}
            </div>

            {touched.amount && !isAmountValid && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{data.errorAmount}</span>
              </div>
            )}
          </div>

          {/* 2. Kỳ hạn gửi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Kỳ hạn gửi (tháng) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-sky-700 font-semibold">
                Đang chọn: {selectedTermMonths} tháng
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {data.termOptions.map((term) => {
                const isSelected = selectedTermMonths === term.months;
                return (
                  <button
                    key={term.months}
                    type="button"
                    onClick={() => handleTermChange(term.months)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#00529b] text-white shadow-xs ring-2 ring-[#00529b]/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{term.label}</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                      {term.rate}%/năm
                    </span>
                  </button>
                );
              })}
            </div>

            {touched.term && !isTermValid && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{data.errorTerm}</span>
              </div>
            )}
          </div>

          {/* 3. Lãi suất */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Lãi suất (% / năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                Tự động áp dụng theo biểu lãi suất VietinBank
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="25"
                value={rateStr}
                onChange={handleRateChange}
                placeholder="Nhập lãi suất %/năm"
                className={`w-full text-lg font-bold py-3 px-4 pr-16 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                  touched.rate && !isRateValid
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-[#00529b] focus:ring-2 focus:ring-[#00529b]/10'
                }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                %/năm
              </div>
            </div>

            {touched.rate && !isRateValid && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{data.errorRate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Calculation Result Summary (Right Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#00529b] via-[#004077] to-[#002b54] rounded-2xl p-6 sm:p-7 text-white shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-base">Kết quả dự tính</h4>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-sky-200 font-medium">
                Lãi cuối kỳ
              </span>
            </div>

            <div className="space-y-4">
              {/* Tiền lãi dự tính */}
              <div className="p-4 bg-white/10 rounded-xl border border-white/15 space-y-1">
                <span className="text-xs text-sky-200 font-medium block">
                  Tiền lãi dự tính
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight tabular-nums">
                  {formatVND(calculation.interest)}
                </div>
                <span className="text-[11px] text-sky-100/70 block">
                  ({selectedTermMonths} tháng × {rateStr}%/năm)
                </span>
              </div>

              {/* Tổng tiền khi đáo hạn */}
              <div className="p-4 bg-white/10 rounded-xl border border-white/15 space-y-1">
                <span className="text-xs text-sky-200 font-medium block">
                  Tổng tiền nhận được khi đáo hạn (Gốc + Lãi)
                </span>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums">
                  {formatVND(calculation.total)}
                </div>
                <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Gốc ban đầu: {formatVND(parsedAmount)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-sky-200/80 leading-relaxed border-t border-white/10 pt-4 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-300" />
              <span>
                Công thức: Số tiền lãi = (Số tiền gửi × Lãi suất %/năm × Số ngày gửi thực tế) / 365 ngày. Kết quả mang tính tham khảo.
              </span>
            </div>

            <button
              onClick={() => onOpenConsultant('Tư vấn gửi tiết kiệm tại quầy')}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-98 transition-all shadow-sm"
            >
              Liên hệ mở sổ tiết kiệm tại quầy
            </button>
          </div>

          {/* TikTok Video Guide (from PDF 2) */}
          {data.videoGuideUrl && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <span>Video Clip Hướng Dẫn Gửi Tiết Kiệm</span>
                </div>
                <p className="text-xs text-slate-500">
                  Xem clip tư vấn kinh nghiệm gửi tiết kiệm sinh lời tối đa trên TikTok
                </p>
              </div>

              <a
                href={data.videoGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>Xem TikTok</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
