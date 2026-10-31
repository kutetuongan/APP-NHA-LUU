import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Heart,
  ChevronLeft,
  ChevronRight,
  Phone,
  LayoutGrid,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';
import { FeaturedProductsData, ProductItem, SupportOfficer } from '../types';
import { SafeImage } from '../utils/imageUtils';

interface FeaturedProductsSectionProps {
  data: FeaturedProductsData;
  supportOfficer: SupportOfficer;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  data,
  supportOfficer
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [interestedProduct, setInterestedProduct] = useState<ProductItem | null>(null);

  const filteredItems = data.items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentSlideIndex(0);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-200">
      {/* Standout Header Card with subtle red border & soft blue gradient per PDF 5 */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50/60 to-white rounded-3xl p-6 sm:p-8 border-2 border-red-500/20 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-red-700 text-xs font-bold border border-red-200">
              <Gift className="w-3.5 h-3.5 text-red-600" />
              <span>Nổi bật tại chi nhánh</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {data.title}
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-center">
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'carousel'
                  ? 'bg-[#00529b] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dạng Carousel</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#00529b] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Dạng Lưới</span>
            </button>
          </div>
        </div>

        {/* Filter Chips (Categories from PDF 5) */}
        <div className="pt-6 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {data.categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#00529b] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Carousel View Mode */}
      {viewMode === 'carousel' && filteredItems.length > 0 && (
        <div className="relative">
          {/* Main Slide Card */}
          {(() => {
            const currentItem = filteredItems[currentSlideIndex] || filteredItems[0];
            return (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 max-w-4xl mx-auto transition-all">
                {/* Poster Image (Left / Top) */}
                <div className="md:col-span-6 bg-slate-950/5 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100">
                  <div className="max-h-[380px] w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-white">
                    <SafeImage
                      src={currentItem.posterUrl}
                      alt={currentItem.title}
                      className="w-full h-[360px] object-contain hover:scale-102 transition-transform duration-300"
                      fallbackType="card"
                      fallbackText={currentItem.title}
                    />
                  </div>
                </div>

                {/* Details (Right / Bottom) */}
                <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00529b] uppercase tracking-wider">
                        {currentItem.categoryLabel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {currentItem.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                      {currentItem.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {currentItem.desc}
                    </p>

                    {/* Benefit checklist */}
                    <div className="space-y-2 pt-2">
                      {currentItem.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button "Tôi quan tâm" */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <button
                      onClick={() => setInterestedProduct(currentItem)}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#ed1c24] hover:bg-[#d6161d] active:scale-98 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Tôi Quan Tâm Sản Phẩm Này</span>
                    </button>
                    <p className="text-[11px] text-center text-slate-400">
                      Cán bộ tư vấn tại quầy sẽ hỗ trợ thủ tục chỉ trong 5 phút
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Carousel Navigation Controls */}
          {filteredItems.length > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                onClick={handlePrevSlide}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-xs transition-colors"
                title="Sản phẩm trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {filteredItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlideIndex === i ? 'w-6 bg-[#00529b]' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-xs transition-colors"
                title="Sản phẩm tiếp theo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                <div className="h-60 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 overflow-hidden">
                  <SafeImage
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    fallbackType="card"
                    fallbackText={item.title}
                  />
                </div>
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#00529b] uppercase">
                      {item.categoryLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#00529b] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setInterestedProduct(item)}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup / Modal when user clicks "Tôi quan tâm" (Strict wording per PDF 5) */}
      {interestedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-gradient-to-r from-[#00529b] to-[#0072ce] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-300 fill-red-300" />
                <h3 className="font-bold text-base">Ghi Nhận Mối Quan Tâm</h3>
              </div>
              <button
                onClick={() => setInterestedProduct(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="border border-sky-100 bg-sky-50/70 rounded-xl p-4 space-y-2">
                <span className="text-xs font-semibold text-[#00529b] block">
                  Sản phẩm Quý khách quan tâm:
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {interestedProduct.title}
                </h4>
              </div>

              {/* Exact notification text specified in PDF 5 */}
              <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <p>{data.interestPopup.message}</p>
                <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {data.interestPopup.contactPerson}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${supportOfficer.tel}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#ed1c24] hover:bg-[#d6161d] transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Tư Vấn</span>
                </a>
                <button
                  onClick={() => setInterestedProduct(null)}
                  className="py-3 px-4 rounded-xl font-medium text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Đóng thông báo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
