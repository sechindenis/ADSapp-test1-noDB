import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddGoalModal({ isOpen, onClose }: AddGoalModalProps) {
  const [name, setName] = useState('');
  const [repeats, setRepeats] = useState('');
  const [description, setDescription] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [validationState, setValidationState] = useState<Record<string, string>>({});
  const { dispatch, state } = useApp();
  const isColorTheme = state.theme === 'color';
  const allGoals = [...state.goals, ...state.completedGoals].filter(g => g.name === name);

  if (!isOpen) return null;

  const validateField = (field: string, value: string) => {
    const newState = { ...validationState };

    if (field === 'name') {
      if (!value.trim()) {
        newState.name = t('nameRequired');
      } else {
        delete newState.name;
      }
    }

    if (field === 'repeats') {
      if (!value) {
        newState.repeats = t('repeatsRequired');
      } else if (parseInt(value) <= 0) {
        newState.repeats = t('repeatsPositive');
      } else {
        delete newState.repeats;
      }
    }

    setValidationState(newState);
    return Object.keys(newState).length === 0;
  };

  const validateForm = () => {
    setShowErrors(true);
    if (!name.trim()) {
      setValidationState(prev => ({ ...prev, name: t('nameRequired') }));
      return false;
    }

    if (!repeats) {
      setValidationState(prev => ({ ...prev, repeats: t('repeatsRequired') }));
      return false;
    } else if (parseInt(repeats) <= 0) {
      setValidationState(prev => ({ ...prev, repeats: t('repeatsPositive') }));
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const repeatsCount = parseInt(repeats);
    const previousAttempts = allGoals.length;

    dispatch({
      type: 'ADD_GOAL',
      payload: {
        id: crypto.randomUUID(),
        name,
        totalRepeats: repeatsCount,
        currentRepeats: 0,
        description,
        priority: Date.now(),
        isHeldOver: false,
        isNew: true,
        attemptCount: previousAttempts + 1,
        createdAt: new Date().toISOString(),
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl ${
        isColorTheme ? 'bg-white' : 'bg-gray-50'
      } p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('addGoal')}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('goalName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => {
                  const value = e.target.value.slice(0, 35);
                  setName(value);
                  validateField('name', value);
                }}
                maxLength={35}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isColorTheme
                    ? validationState.name && showErrors
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-indigo-100 focus:border-indigo-300'
                    : validationState.name && showErrors
                      ? 'border-gray-400 focus:border-gray-600'
                      : 'border-gray-200 focus:border-gray-400'
                } focus:outline-none`}
              />
              {validationState.name && showErrors && (
                <p className={`mt-1 text-sm ${isColorTheme ? 'text-red-500' : 'text-gray-600'}`}>
                  {validationState.name}
                </p>
              )}
              {name.length === 35 && !validationState.name && (
                <p className="mt-1 text-sm text-gray-500">
                  {t('maxLengthReached')}
                </p>
              )}
            </div>
            <div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('repeats')}
              </label>
              <input
                type="number"
                value={repeats}
                onChange={e => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setRepeats(value);
                  validateField('repeats', value);
                }}
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
                    ? validationState.repeats && showErrors
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-indigo-100 focus:border-indigo-300'
                    : validationState.repeats && showErrors
                      ? 'border-gray-400 focus:border-gray-600'
                      : 'border-gray-200 focus:border-gray-400'
                } focus:outline-none`}
              />
              {validationState.repeats && showErrors && (
                <p className={`mt-1 text-sm ${isColorTheme ? 'text-red-500' : 'text-gray-600'}`}>
                  {validationState.repeats}
                </p>
              )}
            </div>
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
                Object.keys(validationState).length > 0 && showErrors
                  ? isColorTheme
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-gray-600 cursor-not-allowed'
                  : 
                isColorTheme
                  ? 'bg-indigo-500 hover:bg-indigo-600'
                  : 'bg-gray-800 hover:bg-gray-900'
              }`}
              disabled={Object.keys(validationState).length > 0 && showErrors}
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}