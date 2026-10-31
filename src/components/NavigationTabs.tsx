import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin
} from 'lucide-react';
import { NavigationItem } from '../types';

interface NavigationTabsProps {
  items: NavigationItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  items,
  activeTab,
  onSelectTab
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle className="w-4 h-4" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-4 h-4" />;
      case 'PiggyBank':
        return <PiggyBank className="w-4 h-4" />;
      case 'Calculator':
        return <Calculator className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-slate-100/90 border-b border-slate-200/80 sticky top-18 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {items.map((item, index) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#00529b] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-[#00529b] border border-slate-200/70'
                }`}
                aria-selected={isActive}
              >
                <span className={isActive ? 'text-white' : 'text-[#00529b]'}>
                  {getIcon(item.icon)}
                </span>
                <span>
                  {index + 1}. {item.label}
                </span>
                {item.id === 'game' && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-sm uppercase tracking-wide">
                    Quà
                  </span>
                )}
                {item.id === 'products' && (
                  <span className="ml-1 px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-sm uppercase tracking-wide">
                    Hot
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
