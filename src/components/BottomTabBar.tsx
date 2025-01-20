import React from 'react';
import { History, Target, Settings } from 'lucide-react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomTabBar({ activeTab, onTabChange }: TabBarProps) {
  const { state } = useApp();
  const isColorTheme = state.theme === 'color';

  return (
    <div className={`fixed bottom-0 left-0 right-0 h-16 ${
      isColorTheme ? 'bg-indigo-50' : 'bg-gray-100'
    } border-t z-50 ${
      isColorTheme ? 'border-indigo-100' : 'border-gray-200'
    } flex items-center justify-around px-4`}>
      <button
        onClick={() => onTabChange('history')}
        className={`flex flex-col items-center space-y-1 ${
          activeTab === 'history'
            ? isColorTheme
              ? 'text-indigo-600'
              : 'text-black'
            : 'text-gray-400'
        }`}
      >
        <History size={24} />
        <span className="text-xs capitalize">{t('history')}</span>
      </button>
      <button
        onClick={() => onTabChange('goals')}
        className={`flex flex-col items-center space-y-1 ${
          activeTab === 'goals'
            ? isColorTheme
              ? 'text-indigo-600'
              : 'text-black'
            : 'text-gray-400'
        }`}
      >
        <Target size={24} />
        <span className="text-xs capitalize">{t('goals')}</span>
      </button>
      <button
        onClick={() => onTabChange('settings')}
        className={`flex flex-col items-center space-y-1 ${
          activeTab === 'settings'
            ? isColorTheme
              ? 'text-indigo-600'
              : 'text-black'
            : 'text-gray-400'
        }`}
      >
        <Settings size={24} />
        <span className="text-xs capitalize">{t('settings')}</span>
      </button>
    </div>
  );
}