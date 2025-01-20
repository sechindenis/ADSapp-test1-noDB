import React, { useEffect } from 'react';
import { MoreVertical, Play } from 'lucide-react';
import { Goal } from '../types';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import { MouseEvent } from 'react';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const { state, dispatch } = useApp();
  const isColorTheme = state.theme === 'color';

  useEffect(() => {
    if (goal.isNew) {
      const timer = setTimeout(() => {
        dispatch({
          type: 'UPDATE_GOAL',
          payload: { ...goal, isNew: false },
        });
      }, 1000); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [goal.isNew, dispatch, goal]);

  const handleContinue = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent opening the goal view
    dispatch({ type: 'CONTINUE_GOAL', payload: goal.id });
    onClick(); // Open the goal view
  };

  return (
    <div
      className={`p-4 rounded-xl shadow-sm mb-3 ${
        goal.isNew ? 'animate-highlight ' : ''
      }${
        isColorTheme
          ? 'bg-white border border-indigo-50'
          : 'bg-white border border-gray-100'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-lg">{goal.name}</h3>
            {goal.attemptCount && (
              <span className={`text-sm px-2 py-0.5 rounded ${
                isColorTheme 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {t('set')} {goal.attemptCount}
              </span>
            )}
          </div>
          <div className="flex items-center mt-2 gap-2">
            <div className={`h-2 rounded-full ${
              isColorTheme ? 'bg-indigo-100' : 'bg-gray-200'
            } w-full`}>
              <div
                className={`h-2 rounded-full ${
                  isColorTheme ? 'bg-indigo-500' : 'bg-gray-700'
                }`}
                style={{
                  width: `${(goal.currentRepeats / goal.totalRepeats) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-500 shrink-0">
              {goal.currentRepeats}/{goal.totalRepeats}
            </span>
          </div>
        </div>
        {goal.isHeldOver && (
          <button
            className={`ml-4 p-2 rounded-full shrink-0 ${
              isColorTheme
                ? 'bg-indigo-50 text-indigo-600'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={handleContinue}
          >
            <Play size={20} />
          </button>
        )}
      </div>
    </div>
  );
}