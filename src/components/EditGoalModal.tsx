import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import { Goal } from '../types';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal;
}

export function EditGoalModal({ isOpen, onClose, goal }: EditGoalModalProps) {
  const [name, setName] = useState(goal.name);
  const [repeats, setRepeats] = useState(goal.totalRepeats.toString());
  const [description, setDescription] = useState(goal.description || '');
  const [showErrors, setShowErrors] = useState(false);
  const [validationState, setValidationState] = useState<Record<string, string>>({});
  const { dispatch, state } = useApp();
  const isColorTheme = state.theme === 'color';
  const minRepeats = goal.currentRepeats + 1;

  useEffect(() => {
    setName(goal.name);
    setRepeats(goal.totalRepeats.toString());
    setDescription(goal.description || '');
    setValidationState({});
    setShowErrors(false);
  }, [goal]);

  if (!isOpen) return null;

  const validateName = (value: string) => {
    const newState = { ...validationState };
    if (!value.trim()) {
      newState.name = t('nameRequired');
    } else {
      delete newState.name;
    }
    setValidationState(newState);
  };

  const handleRepeatsChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    setRepeats(numericValue);
    
    const newState = { ...validationState };
    
    if (!numericValue) {
      newState.repeats = t('repeatsRequired');
    } else if (parseInt(numericValue) <= 0) {
      newState.repeats = t('repeatsPositive');
    } else if (parseInt(numericValue) < minRepeats) {
      newState.repeats = t('minRepeatsError').replace('{0}', minRepeats.toString());
    } else {
      delete newState.repeats;
    }
    setValidationState(newState);
    setShowErrors(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    const newState = { ...validationState };
    
    if (!name.trim()) {
      newState.name = t('nameRequired');
    }

    const repeatsCount = parseInt(repeats);
    if (repeatsCount < minRepeats) {
      newState.repeats = t('minRepeatsError').replace('{0}', minRepeats.toString());
    }

    setValidationState(newState);
    if (Object.keys(newState).length > 0) {
      return;
    }

    dispatch({
      type: 'UPDATE_GOAL',
      payload: {
        ...goal,
        name,
        totalRepeats: repeatsCount,
        description,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className={`w-full max-w-md rounded-2xl ${
        isColorTheme ? 'bg-white' : 'bg-gray-50'
      } p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('editGoal')}</h2>
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
                onChange={(e) => {
                  const value = e.target.value.slice(0, 35);
                  setName(value);
                  validateName(value);
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
                onChange={(e) => handleRepeatsChange(e.target.value)}
                min={minRepeats}
                inputMode="numeric"
                pattern="[0-9]*"
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
                isColorTheme
                  ? Object.keys(validationState).length > 0 && showErrors
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-500 hover:bg-indigo-600'
                  : Object.keys(validationState).length > 0 && showErrors
                    ? 'bg-gray-600 cursor-not-allowed'
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