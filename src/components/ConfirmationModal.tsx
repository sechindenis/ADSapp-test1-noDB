import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = t('confirm'),
  cancelText = t('cancel'),
  isDangerous = false,
}: ConfirmationModalProps) {
  const { state } = useApp();
  const isColorTheme = state.theme === 'color';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-md rounded-2xl ${
        isColorTheme ? 'bg-white' : 'bg-gray-50'
      } p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 rounded-lg text-white ${
              isDangerous
                ? 'bg-red-500 hover:bg-red-600'
                : isColorTheme
                ? 'bg-indigo-500 hover:bg-indigo-600'
                : 'bg-gray-800 hover:bg-gray-900'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}