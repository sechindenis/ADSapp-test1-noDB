import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

interface TopBarProps {
  activeTab: string;
}

export function TopBar({ activeTab }: TopBarProps) {
  const { state } = useApp();
  const isColorTheme = state.theme === 'color';

  return (
    <div className={`fixed top-0 left-0 right-0 h-14 ${
      isColorTheme ? 'bg-indigo-50' : 'bg-gray-100'
    } border-b z-50 ${
      isColorTheme ? 'border-indigo-100' : 'border-gray-200'
    } flex items-center justify-center px-4`}>
      <h1 className="text-lg font-semibold capitalize">
        {t(activeTab)}
      </h1>
    </div>
  );
}