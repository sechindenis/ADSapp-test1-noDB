import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

interface DescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
}

export function DescriptionModal({ isOpen, onClose, description }: DescriptionModalProps) {
  const { state } = useApp();
  const isColorTheme = state.theme === 'color';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className={`w-full max-w-md rounded-2xl ${
        isColorTheme ? 'bg-white' : 'bg-gray-50'
      } p-6 m-auto max-h-[calc(100vh-2rem)] flex flex-col`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('goalDescription')}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto">
          <p className="text-gray-600 whitespace-pre-wrap">
          {description}
          </p>
        </div>
      </div>
    </div>
  );
}