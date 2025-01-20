import { ThemeMode } from '../types';

interface ThemeColors {
  primary: string;
  primaryHover: string;
  background: string;
  border: string;
  text: string;
  error: string;
}

export function getThemeColors(theme: ThemeMode): ThemeColors {
  return theme === 'color' 
    ? {
        primary: 'bg-indigo-500',
        primaryHover: 'hover:bg-indigo-600',
        background: 'bg-white',
        border: 'border-indigo-100',
        text: 'text-indigo-600',
        error: 'text-red-500',
      }
    : {
        primary: 'bg-gray-800',
        primaryHover: 'hover:bg-gray-900',
        background: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
        error: 'text-gray-600',
      };
}