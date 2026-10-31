import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  FileSpreadsheet,
  X,
  Printer,
  ChevronRight,
  TrendingDown,
  Percent,
  CircleDollarSign
} from 'lucide-react';
import { LoanCalculatorData } from '../types';
import {
  formatVND,
  formatNumber,
  parseNumberFromString,
  calculateLoanSchedule,
  LoanScheduleResult
} from '../utils/formatters';

interface LoanCalculatorSectionProps {
  data: LoanCalculatorData;
  onOpenConsultant: (msg?: string) => void;
}

export const LoanCalculatorSection: React.FC<LoanCalculatorSectionProps> = ({
  data,
  onOpenConsultant
}) => {
  // Input states (Strictly input, no slider as required by PDF 3)
  const [loanAmountStr, setLoanAmountStr] = useState<string>('500,000,000');
  const [termMonths, setTermMonths] = useState<number>(36);
  const [annualRateStr, setAnnualRateStr] = useState<string>('8.5');
  const [disbursementDate, setDisbursementDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedCycleId, setSelectedCycleId] = useState<string>('monthly');
  const [paymentDay, setPaymentDay] = useState<number>(25);
  const [roundToThousand, setRoundToThousand] = useState<boolean>(true);

  // Modal detail view state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const parsedLoanAmount = parseNumberFromString(loanAmountStr);
  const parsedAnnualRate = parseFloat(annualRateStr) || 0;

  const currentCycle = useMemo(() => {
    return data.cycles.find((c) => c.id === selectedCycleId) || data.cycles[0];
  }, [data.cycles, selectedCycleId]);

  // Compute schedule
  const scheduleResult: LoanScheduleResult = useMemo(() => {
    if (parsedLoanAmount <= 0 || termMonths <= 0) {
      return {
        rows: [],
        totalPrincipal: 0,
        totalInterest: 0,
        totalPayment: 0,
        firstPeriodPayment: 0,
        lastPeriodPayment: 0,
        totalPeriods: 0
      };
    }

    return calculateLoanSchedule({
      loanAmount: parsedLoanAmount,
      termMonths,
      annualRatePercent: parsedAnnualRate,
      disbursementDate,
      paymentDayOfMonth: paymentDay,
      cycleDivider: currentCycle.divider,
      cycleStepMonths: currentCycle.stepMonths,
      roundToThousand
    });
  }, [
    parsedLoanAmount,
    termMonths,
    parsedAnnualRate,
    disbursementDate,
    paymentDay,
    currentCycle,
    roundToThousand
  ]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^\d]/g, '');
    if (!clean) {
      setLoanAmountStr('');
      return;
    }
    const num = parseInt(clean, 10);
    setLoanAmountStr(formatNumber(num));
  };

  const presetLoanAmounts = [100000000, 200000000, 500000000, 1000000000, 2000000000];
  const presetTerms = [12, 24, 36, 60, 84, 120, 240];

  const handleExportCSV = () => {
    if (!scheduleResult.rows.length) return;
    const headers = 'Ky,Ngay tra no,Du no dau ky,Tien goc,Tien lai,Tong goc va lai,Du no con lai\n';
    const csvContent = scheduleResult.rows
      .map(
        (r) =>
          `${r.period},${r.dateStr},${r.beginningBalance},${r.principal},${r.interest},${r.totalPayment},${r.endingBalance}`
      )
      .join('\n');
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Lich_tra_no_VietinBank_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#00529b] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Chuyên mục 5 · Lịch trả nợ khoản vay
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
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#00529b]" />
              <span>Bước 1: Nhập thông tin khoản vay</span>
            </h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-100">
              Dư nợ giảm dần
            </span>
          </div>

          {/* 1. Số tiền vay (dạng nhập số, không kéo thả) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Số tiền vay <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400">Thiết kế dạng nhập văn bản</span>
            </div>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={loanAmountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền vay (VND)"
                className="w-full text-lg sm:text-xl font-bold py-3 px-4 pr-16 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00529b] focus:ring-2 focus:ring-[#00529b]/10 focus:outline-hidden transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                VND
              </div>
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-slate-400">Gợi ý:</span>
              {presetLoanAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmountStr(formatNumber(amt))}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#00529b] text-slate-600 transition-colors"
                >
                  {formatNumber(amt >= 1000000000 ? amt / 1000000000 : amt / 1000000)}{' '}
                  {amt >= 1000000000 ? 'tỷ' : 'triệu'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Thời gian vay (tháng) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Thời gian vay (tháng) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-sky-700 font-semibold">
                {termMonths} tháng ({Math.floor(termMonths / 12)} năm {termMonths % 12 ? `${termMonths % 12} th` : ''})
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {presetTerms.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTermMonths(t)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                    termMonths === t
                      ? 'bg-[#00529b] text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {t} tháng
                </button>
              ))}
            </div>
          </div>

          {/* 3. Lãi suất năm & Chu kỳ trả nợ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Lãi suất theo năm (%/năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRateStr}
                  onChange={(e) => setAnnualRateStr(e.target.value)}
                  className="w-full text-base font-bold py-2.5 px-3 pr-14 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00529b] focus:outline-hidden"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                  %/năm
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Chu kỳ trả nợ <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCycleId}
                onChange={(e) => setSelectedCycleId(e.target.value)}
                className="w-full text-sm font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00529b] focus:outline-hidden"
              >
                {data.cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Ngày giải ngân & Ngày trả nợ định kỳ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Ngày giải ngân <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full text-sm font-medium py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00529b] focus:outline-hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Ngày trả nợ định kỳ hằng tháng
              </label>
              <select
                value={paymentDay}
                onChange={(e) => setPaymentDay(parseInt(e.target.value, 10))}
                className="w-full text-sm font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00529b] focus:outline-hidden"
              >
                {[5, 10, 15, 20, 25, 28, 30].map((d) => (
                  <option key={d} value={d}>
                    Ngày {d} hằng tháng
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quy tắc làm tròn */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-600">Quy tắc làm tròn số:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRoundToThousand(true)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  roundToThousand
                    ? 'bg-[#00529b] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Làm tròn 1.000 đ
              </button>
              <button
                type="button"
                onClick={() => setRoundToThousand(false)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  !roundToThousand
                    ? 'bg-[#00529b] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Làm tròn 1 đ
              </button>
            </div>
          </div>
        </div>

        {/* Results Card (Right Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md space-y-6 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-base">Tổng quan kỳ trả nợ</h4>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {scheduleResult.totalPeriods} kỳ thanh toán
              </span>
            </div>

            <div className="space-y-4">
              {/* Kỳ đầu tiên */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-xs text-slate-400 font-medium block">
                  Số tiền trả tháng đầu (Cao nhất)
                </span>
                <div className="text-2xl font-black text-amber-400 tracking-tight tabular-nums">
                  {formatVND(scheduleResult.firstPeriodPayment)}
                </div>
                <span className="text-[11px] text-slate-400">
                  Gốc: {formatVND(scheduleResult.rows[0]?.principal || 0)} · Lãi: {formatVND(scheduleResult.rows[0]?.interest || 0)}
                </span>
              </div>

              {/* Kỳ cuối cùng */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-xs text-slate-400 font-medium block">
                  Số tiền trả tháng cuối (Thấp nhất)
                </span>
                <div className="text-xl font-bold text-emerald-400 tracking-tight tabular-nums">
                  {formatVND(scheduleResult.lastPeriodPayment)}
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                  Dư nợ giảm dần đều theo từng tháng
                </span>
              </div>

              {/* Grid 2 stats */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <span className="text-[11px] text-slate-400 block">Tổng tiền lãi:</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {formatVND(scheduleResult.totalInterest)}
                  </span>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <span className="text-[11px] text-slate-400 block">Tổng gốc + lãi:</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {formatVND(scheduleResult.totalPayment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bước 2: Nút Xem chi tiết bảng tính lịch trả nợ */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#00529b] hover:bg-[#004077] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Xem Chi Tiết Bảng Tính Lịch Trả Nợ</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                Lãi suất kỳ: {(parsedAnnualRate / currentCycle.divider).toFixed(2)}%/kỳ
              </span>
              <button
                onClick={() => onOpenConsultant('Tư vấn gói vay vốn VietinBank')}
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
              >
                Gặp cán bộ tín dụng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Bảng tính lịch trả nợ với dư nợ giảm dần (Strictly per Step 2 of PDF 3) */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="bg-[#00529b] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base sm:text-lg">
                  Bảng Tính Lịch Trả Nợ Với Dư Nợ Giảm Dần
                </h3>
                <p className="text-xs text-sky-200">
                  Số tiền vay: {formatVND(parsedLoanAmount)} · Thời hạn: {termMonths} tháng · Lãi suất: {annualRateStr}%/năm
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Xuất File CSV
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">STT</th>
                      <th className="py-3 px-4">Kỳ Trả Nợ</th>
                      <th className="py-3 px-4 text-right">Dư Nợ Còn Lại</th>
                      <th className="py-3 px-4 text-right">Gốc</th>
                      <th className="py-3 px-4 text-right">Lãi</th>
                      <th className="py-3 px-4 text-right bg-slate-200/50">Tổng Gốc + Lãi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Period 0 (Disbursement) */}
                    <tr className="bg-slate-50/70 font-semibold text-slate-600">
                      <td className="py-2.5 px-3 text-center">0</td>
                      <td className="py-2.5 px-4 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {disbursementDate.split('-').reverse().join('/')} (Giải ngân)
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                        {formatNumber(parsedLoanAmount)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-400">-</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-400">-</td>
                      <td className="py-2.5 px-4 text-right font-mono bg-slate-100/60">-</td>
                    </tr>

                    {/* Periods 1..N */}
                    {scheduleResult.rows.map((row) => (
                      <tr key={row.period} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                          {row.period}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">
                          {row.dateStr}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700 tabular-nums">
                          {formatNumber(row.beginningBalance)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-medium text-slate-800 tabular-nums">
                          {formatNumber(row.principal)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-red-600 tabular-nums">
                          {formatNumber(row.interest)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-[#00529b] tabular-nums bg-sky-50/30">
                          {formatNumber(row.totalPayment)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-bold sticky bottom-0">
                    <tr>
                      <td colSpan={3} className="py-3 px-4 uppercase tracking-wide">
                        TỔNG CỘNG ({scheduleResult.totalPeriods} KỲ)
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400">
                        {formatNumber(scheduleResult.totalPrincipal)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-300">
                        {formatNumber(scheduleResult.totalInterest)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-white bg-slate-800">
                        {formatNumber(scheduleResult.totalPayment)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500">
                * Dư nợ giảm dần giúp tiết kiệm tối đa lãi vay so với phương thức niên kim cố định.
              </span>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
