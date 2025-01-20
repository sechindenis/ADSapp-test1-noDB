import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import { Goal } from '../types';

interface StartAgainModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onConfirm: (repeats: number) => void;
}

export function StartAgainModal({ isOpen, onClose, goal, onConfirm }: StartAgainModalProps) {
  const [repeats, setRepeats] = useState('');
  const [keepDescription, setKeepDescription] = useState(true);
  const [description, setDescription] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const { state } = useApp();
  const isColorTheme = state.theme === 'color';

  // Update repeats when goal changes
  React.useEffect(() => {
    if (goal) {
      setRepeats(goal.totalRepeats.toString());
      setDescription(goal.description || '');
      setShowValidation(false);
      setValidationMessage(null);
    }
  }, [goal]);

  const handleRepeatsChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    setRepeats(numericValue);
    
    if (!numericValue) {
      setValidationMessage(t('repeatsRequired'));
    } else if (parseInt(numericValue) <= 0) {
      setValidationMessage(t('repeatsPositive'));
    } else {
      setValidationMessage(null);
    }
    setShowValidation(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    if (!repeats) {
      setValidationMessage(t('repeatsRequired'));
      return;
    }
    const repeatsCount = parseInt(repeats);
    if (repeatsCount <= 0) {
      setValidationMessage(t('repeatsPositive'));
      return;
    }
    if (validationMessage) return;

    onConfirm(repeatsCount, keepDescription ? goal.description : description);
    onClose();
  };

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className={`w-full max-w-md rounded-2xl ${
        isColorTheme ? 'bg-white' : 'bg-gray-50'
      } p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('startAgain')}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={keepDescription}
                onChange={(e) => setKeepDescription(e.target.checked)}
                className={`w-4 h-4 rounded ${
                  isColorTheme
                    ? 'text-indigo-500 focus:ring-indigo-300'
                    : 'text-gray-800 focus:ring-gray-400 checked:bg-gray-800'
                }`}
              />
              <span className="text-sm font-medium text-gray-700">
                {t('keepDescription')}
              </span>
            </label>
          </div>
          {!keepDescription && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('goalDescription')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isColorTheme
                    ? 'border-indigo-100 focus:border-indigo-300'
                    : 'border-gray-200 focus:border-gray-400'
                } focus:outline-none resize-none placeholder:text-gray-400 placeholder:text-sm`}
                placeholder={t('descriptionPlaceholder')}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('repeats')}
            </label>
            <input
              type="number"
              value={repeats}
              onChange={(e) => handleRepeatsChange(e.target.value)}
              min="1"
              inputMode="numeric"
              pattern="[0-9]*"
              onKeyDown={(e) => {
                // Allow only numbers, backspace, delete, arrow keys
                if (!/[0-9]/.test(e.key) && 
                    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`w-full px-4 py-2 rounded-lg border ${
                isColorTheme
                  ? validationMessage && showValidation
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-indigo-100 focus:border-indigo-300'
                  : validationMessage && showValidation
                    ? 'border-gray-400 focus:border-gray-600'
                    : 'border-gray-200 focus:border-gray-400'
              } focus:outline-none`}
            />
            {validationMessage && showValidation && (
              <p className={`mt-1 text-sm ${isColorTheme ? 'text-red-500' : 'text-gray-600'}`}>
                {validationMessage}
              </p>
            )}
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 rounded-lg text-white ${
                validationMessage && showValidation
                  ? isColorTheme
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-gray-600 cursor-not-allowed'
                  : 
                isColorTheme
                  ? 'bg-indigo-500 hover:bg-indigo-600'
                  : 'bg-gray-800 hover:bg-gray-900'
              }`}
              disabled={!!validationMessage && showValidation}
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}