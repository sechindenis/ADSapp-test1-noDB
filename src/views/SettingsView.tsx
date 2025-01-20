import React, { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getAvailableLanguages, t } from '../i18n';
import { ThemeMode } from '../types';

export function SettingsView() {
  const { state, dispatch } = useApp();
  const isColorTheme = state.theme === 'color';
  const languages = getAvailableLanguages();

  const handleLanguageChange = useCallback((language: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  }, [dispatch]);

  const handleThemeChange = (theme: ThemeMode) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  return (
    <div className="flex-1 px-4 pt-20 pb-20 overflow-y-auto scrollable">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 capitalize">{t('language')}</h2>
          <div className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full p-4 rounded-xl text-left ${
                  state.language === lang.code
                    ? isColorTheme
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-100'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 capitalize">{t('theme')}</h2>
          <div className="space-y-2">
            <button
              onClick={() => handleThemeChange('color')}
              className={`w-full p-4 rounded-xl text-left ${
                state.theme === 'color'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-white border border-gray-100'
              }`}
            >
              {t('colorTheme')}
            </button>
            <button
              onClick={() => handleThemeChange('bw')}
              className={`w-full p-4 rounded-xl text-left ${
                state.theme === 'bw'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-100'
              }`}
            >
              {t('bwTheme')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}