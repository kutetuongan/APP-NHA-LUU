import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Building2,
  Navigation,
  Search,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { BranchLocatorData, Office } from '../types';
import { SafeImage } from '../utils/imageUtils';

interface BranchLocatorSectionProps {
  data: BranchLocatorData;
}

export const BranchLocatorSection: React.FC<BranchLocatorSectionProps> = ({ data }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('kcn_trang_bang');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOfficeModal, setSelectedOfficeModal] = useState<Office | null>(null);

  const selectedBranch =
    data.branches.find((b) => b.id === selectedBranchId) || data.branches[0];

  const filteredOffices = selectedBranch.offices.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.name.toLowerCase().includes(term) ||
      o.address.toLowerCase().includes(term) ||
      o.phone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#00529b] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Chuyên mục 7 · Tra cứu mạng lưới
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {data.title}
        </h2>
        <p className="text-sm text-slate-600">
          {data.subtitle}
        </p>
      </div>

      {/* Branch Selector & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Branch Select */}
          <div className="md:col-span-7 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#00529b]" />
              <span>Chọn chi nhánh trong hệ thống 155 chi nhánh VietinBank</span>
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                setSearchTerm('');
              }}
              className="w-full text-sm font-semibold py-2.5 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00529b] focus:outline-hidden"
            >
              {data.branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.province})
                </option>
              ))}
            </select>
          </div>

          {/* Search in branch */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Tìm kiếm nhanh phòng giao dịch</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên PGD, đường phố..."
                className="w-full text-xs font-medium py-2.5 px-3 pl-8 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00529b] focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Operating Hours Box (Per PDF 4) */}
        <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#00529b] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block">
                Thời gian giao dịch (Thứ 2 đến Thứ 6):
              </span>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                {data.workingHours.weekdays}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-sky-200/60 pt-3 md:pt-0 md:pl-4">
            <CalendarDays className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block">
                Ngày nghỉ cuối tuần & Ngày lễ:
              </span>
              <p className="text-slate-600">
                {data.workingHours.weekend}
              </p>
              <span className="text-[11px] text-sky-800 font-medium block">
                Hệ thống ATM, CDM và iPay Mobile hoạt động 24/7
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Offices Table / Grid (Strictly with exact 4 offices from PDF 4) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#00529b]" />
            <h3 className="font-bold text-slate-900 text-sm">
              Danh sách điểm giao dịch thuộc {selectedBranch.name} ({filteredOffices.length} điểm)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Bấm số điện thoại để gọi trực tiếp · Bấm bản đồ để chỉ đường
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOffices.map((office) => (
            <div
              key={office.stt}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#00529b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {office.stt}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {office.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {office.type}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100 shrink-0">
                    Đang mở cửa
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Photo Thumbnail */}
                  <div
                    onClick={() => setSelectedOfficeModal(office)}
                    className="sm:col-span-4 h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer group relative"
                  >
                    <SafeImage
                      src={office.imageUrl}
                      alt={office.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fallbackType="building"
                      fallbackText={office.name}
                    />
                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold">
                      Xem ảnh
                    </div>
                  </div>

                  {/* Address & Phone */}
                  <div className="sm:col-span-8 space-y-2.5 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#00529b] shrink-0 mt-0.5" />
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {office.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#00529b] shrink-0" />
                      <span className="text-slate-500">Số điện thoại:</span>
                      <a
                        href={`tel:${office.tel}`}
                        className="font-bold font-mono text-[#00529b] hover:underline"
                        title="Bấm để gọi"
                      >
                        {office.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Direct Call & Google Maps */}
              <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${office.tel}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold hover:text-[#00529b] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#00529b]" />
                  <span>Gọi Hotline</span>
                </a>

                <a
                  href={office.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00529b] hover:bg-[#004077] text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Office Photo Zoom Modal */}
      {selectedOfficeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedOfficeModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedOfficeModal.name}
              </h4>
              <button
                onClick={() => setSelectedOfficeModal(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Đóng
              </button>
            </div>
            <div className="rounded-xl overflow-hidden max-h-[350px] bg-slate-100">
              <SafeImage
                src={selectedOfficeModal.imageUrl}
                alt={selectedOfficeModal.name}
                className="w-full h-full object-cover"
                fallbackType="building"
                fallbackText={selectedOfficeModal.name}
              />
            </div>
            <p className="text-xs text-slate-600">{selectedOfficeModal.address}</p>
          </div>
        </div>
      )}
    </div>
  );
};
