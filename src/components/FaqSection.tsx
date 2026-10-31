import React, { useState } from 'react';
import {
  KeyRound,
  CreditCard,
  ShieldCheck,
  ScanFace,
  ArrowLeft,
  Youtube,
  ThumbsUp,
  ThumbsDown,
  Phone,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { FaqSectionData, FaqTopic, SupportOfficer } from '../types';
import { SafeImage } from '../utils/imageUtils';

interface FaqSectionProps {
  data: FaqSectionData;
  supportOfficer: SupportOfficer;
  onOpenConsultant: (msg?: string) => void;
  onBackToMainMenu?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  data,
  supportOfficer,
  onOpenConsultant,
  onBackToMainMenu
}) => {
  const [selectedTopic, setSelectedTopic] = useState<FaqTopic | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'good' | 'bad'>('idle');
  const [endedConversation, setEndedConversation] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'KeyRound':
        return <KeyRound className="w-6 h-6 text-[#00529b]" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-[#00529b]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#00529b]" />;
      case 'ScanFace':
        return <ScanFace className="w-6 h-6 text-[#00529b]" />;
      default:
        return <HelpCircle className="w-6 h-6 text-[#00529b]" />;
    }
  };

  const handleSelectTopic = (topic: FaqTopic) => {
    setSelectedTopic(topic);
    setFeedbackStatus('idle');
    setEndedConversation(false);
    setActiveStepIndex(0);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleResetToTopicMenu = () => {
    setSelectedTopic(null);
    setFeedbackStatus('idle');
    setEndedConversation(false);
    setActiveStepIndex(0);
  };

  const handleEndConversation = () => {
    setEndedConversation(true);
  };

  // If conversation ended, show heartfelt thank you screen
  if (endedConversation) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {data.endConversationResponse}
            </h3>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              VietinBank trân trọng cảm ơn Quý khách đã tin tưởng và đồng hành. Chúc Quý khách có trải nghiệm giao dịch thuận lợi và một ngày tràn đầy năng lượng!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleResetToTopicMenu}
              className="px-5 py-2.5 bg-[#00529b] text-white text-sm font-semibold rounded-xl hover:bg-[#004077] transition-all shadow-xs"
            >
              Hỏi đáp nội dung khác
            </button>
            {onBackToMainMenu && (
              <button
                onClick={onBackToMainMenu}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
              >
                Về trang chủ Kiosk
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Topic detail view (Step-by-step with pictures, video link, and feedback questions)
  if (selectedTopic) {
    return (
      <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-200">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <button
            onClick={handleResetToTopicMenu}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#00529b] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại danh mục câu hỏi</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Giải đáp thắc mắc</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{selectedTopic.shortTitle}</span>
          </div>
        </div>

        {/* Topic Header Banner */}
        <div className="bg-gradient-to-r from-[#00529b] to-[#0072ce] rounded-2xl p-6 text-white shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">
                Hướng dẫn từng bước chi tiết
              </span>
              <h2 className="text-2xl font-bold tracking-tight">{selectedTopic.title}</h2>
              <p className="text-sm text-sky-100 max-w-2xl">{selectedTopic.desc}</p>
            </div>
            {selectedTopic.videoUrl && (
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs tracking-wide shadow-xs shrink-0 active:scale-95 transition-all"
              >
                <Youtube className="w-4 h-4 fill-white" />
                <span>Xem Video YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            )}
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Các bước thực hiện ({selectedTopic.steps.length} bước)
            </h3>
            <span className="text-xs text-slate-500">
              Làm theo hình ảnh minh họa tương ứng từng bước
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedTopic.steps.map((step) => {
              const isCurrent = activeStepIndex === step.step - 1;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStepIndex(step.step - 1)}
                  className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between cursor-pointer ${
                    isCurrent
                      ? 'border-[#00529b] ring-2 ring-[#00529b]/10 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[#00529b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {step.step}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          Bước {step.step}: {step.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {step.step}/{selectedTopic.steps.length}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pl-9">
                      {step.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50">
                      <SafeImage
                        src={step.imageUrl}
                        alt={`Minh họa bước ${step.step} - ${step.title}`}
                        className="w-full h-56 object-contain bg-slate-900/5 hover:scale-105 transition-transform duration-300"
                        fallbackType="phone"
                        fallbackText={`Bước ${step.step}: ${step.title}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Video Guide Callout */}
        {selectedTopic.videoUrl && (
          <div className="bg-red-50/70 border border-red-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Youtube className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-950">
                  Xem video clip hướng dẫn thực tế trên YouTube
                </h4>
                <p className="text-xs text-red-800">
                  Thao tác trực quan trên màn hình điện thoại với giọng đọc hướng dẫn chi tiết
                </p>
              </div>
            </div>
            <a
              href={selectedTopic.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
            >
              <span>Mở Video</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Feedback Section (Strictly compliant with PDF 1 requirements) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="text-center space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              {data.feedbackQuestion}
            </h4>
            <p className="text-xs text-slate-500">
              Phản hồi của Quý khách giúp VietinBank phục vụ chu đáo và chính xác hơn
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setFeedbackStatus('good')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                feedbackStatus === 'good'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 hover:border-emerald-200'
              }`}
            >
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <span>{data.feedbackPositive} (Đã ổn)</span>
            </button>

            <button
              onClick={() => setFeedbackStatus('bad')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                feedbackStatus === 'bad'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200 hover:border-amber-200'
              }`}
            >
              <ThumbsDown className="w-4 h-4 text-amber-600" />
              <span>{data.feedbackNegative} (Chưa ổn)</span>
            </button>
          </div>

          {/* Response when "Đã ổn" */}
          {feedbackStatus === 'good' && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in">
              <p className="text-sm font-semibold text-emerald-900">
                Tuyệt vời! Cảm ơn Quý khách đã thao tác thành công.
              </p>
              <p className="text-xs text-emerald-800">
                Quý khách có thể quay lại danh mục để tra cứu thêm hoặc kết thúc phiên hướng dẫn.
              </p>
            </div>
          )}

          {/* Response when "Chưa ổn" (Required wording & hotline) */}
          {feedbackStatus === 'bad' && (() => {
            const officer = data.faqOfficer || supportOfficer;
            return (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-3.5 animate-in fade-in">
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                  {data.feedbackNegativeResponse}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={`tel:${officer.tel}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ed1c24] hover:bg-[#d6161d] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4 fill-white" />
                    <span>Gọi Chuyên viên tư vấn {officer.name} – {officer.phone}</span>
                  </a>
                  <button
                    onClick={() => onOpenConsultant(`Hỗ trợ trực tiếp từ Chuyên viên ${officer.name} (${selectedTopic.shortTitle})`)}
                    className="px-3.5 py-2.5 bg-white text-slate-700 hover:text-[#00529b] border border-slate-200 text-xs font-semibold rounded-xl transition-colors hover:bg-slate-50"
                  >
                    Xem chi tiết cán bộ hỗ trợ
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Action Footer Buttons (Back to Menu vs End Conversation) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleResetToTopicMenu}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-[#00529b] bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{data.backToMenuText}</span>
            </button>

            <button
              onClick={handleEndConversation}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-auto"
            >
              <span>{data.endConversationText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Topics Grid (The 4 cards)
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-200">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#00529b] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Chuyên mục 1 · Hỗ trợ khách hàng
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {data.question}
        </h2>
        <p className="text-sm text-slate-600">
          {data.promptText}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {data.topics.map((topic, index) => (
          <div
            key={topic.id}
            onClick={() => handleSelectTopic(topic)}
            className="group bg-white rounded-2xl border border-slate-200 hover:border-[#00529b]/80 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-100/50 via-transparent to-transparent rounded-bl-3xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-sky-50 group-hover:bg-[#00529b] group-hover:text-white transition-colors flex items-center justify-center shrink-0 border border-sky-100">
                  {getTopicIcon(topic.icon)}
                </div>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-[#00529b] transition-colors">
                  0{index + 1}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00529b] transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {topic.desc}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00529b]" />
                {topic.steps.length} bước hướng dẫn
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#00529b] group-hover:translate-x-1 transition-transform">
                <span>Xem chi tiết</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00529b]/10 text-[#00529b] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Cần hỗ trợ các thắc mắc khác ngoài 4 nội dung trên?
            </h4>
            <p className="text-xs text-slate-500">
              Cán bộ {supportOfficer.name} – {supportOfficer.phone} sẵn sàng hỗ trợ trực tiếp Quý khách tại quầy.
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenConsultant('Hỗ trợ thắc mắc khác')}
          className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl transition-colors shrink-0"
        >
          Liên hệ ngay
        </button>
      </div>
    </div>
  );
};
