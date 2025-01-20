import React, { useState, useCallback } from 'react';
import { Trash2, RefreshCw, History } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import { getRepeatsForm } from '../i18n/utils';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { StartAgainModal } from '../components/StartAgainModal';
import { Goal } from '../types';

interface HistoryViewProps {
  onTabChange: (tab: string) => void;
}

export function HistoryView({ onTabChange }: HistoryViewProps) {
  const { state, dispatch } = useApp();
  const isColorTheme = state.theme === 'color';
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [goalToStartAgain, setGoalToStartAgain] = useState<Goal | null>(null);

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
    setGoalToDelete(null);
  };

  const handleStartAgain = useCallback((repeats: number, description?: string) => {
    if (!goalToStartAgain) return;
    
    const previousAttempts = [...state.goals, ...state.completedGoals].filter(g => 
      g.name === goalToStartAgain.name
    ).length;
    
    dispatch({
      type: 'ADD_GOAL',
      payload: {
        ...goalToStartAgain,
        id: crypto.randomUUID(),
        currentRepeats: 0,
        totalRepeats: repeats,
        description,
        completedAt: undefined,
        createdAt: new Date().toISOString(),
        isNew: true,
        attemptCount: previousAttempts + 1,
      },
    });
    
    onTabChange('goals');
  }, [state.goals, state.completedGoals, dispatch, onTabChange, goalToStartAgain]);

  return (
    <div className="flex-1 px-4 pt-20 pb-20 overflow-y-auto scrollable">
      <h2 className="text-xl font-semibold mb-4">{t('completed')}</h2>
      {state.completedGoals.length > 0 ? (
        <div className="space-y-3">
          {state.completedGoals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-xl ${
                isColorTheme ? 'bg-white border-indigo-50' : 'bg-white border-gray-100'
              } border shadow-sm mb-3`}
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
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <p className="text-sm text-gray-500">
                      {new Date(goal.completedAt!).toLocaleDateString()}
                    </p>
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      isColorTheme 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    style={{ whiteSpace: 'nowrap' }}
                    >
                      {goal.totalRepeats} {t(getRepeatsForm(goal.totalRepeats, state.language))}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4 shrink-0">
                  <button
                    onClick={() => setGoalToStartAgain(goal)}
                    className={`p-2 rounded-full ${
                      isColorTheme
                        ? 'text-indigo-600 hover:bg-indigo-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <RefreshCw size={20} />
                  </button>
                  <button
                    onClick={() => setGoalToDelete(goal.id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center">
          <History
            size={48}
            className={`mb-6 ${isColorTheme ? 'text-indigo-400' : 'text-gray-400'}`}
          />
          <h3 className={`text-xl font-medium mb-2 text-center w-full ${
            isColorTheme ? 'text-indigo-900' : 'text-gray-900'
          }`}>
            {t('noCompletedGoals')}
          </h3>
          <p className={`text-center max-w-xs mx-auto ${
            isColorTheme ? 'text-indigo-600/60' : 'text-gray-500'
          }`}>
            {t('completedGoalsWillAppearHere')}
          </p>
        </div>
      )}
      <ConfirmationModal
        isOpen={goalToDelete !== null}
        onClose={() => setGoalToDelete(null)}
        onConfirm={() => goalToDelete && handleDelete(goalToDelete)}
        title={t('deleteGoalConfirmTitle')}
        message={t('deleteGoalConfirmMessage')}
        confirmText={t('delete')}
        isDangerous
      />
      <StartAgainModal
        isOpen={goalToStartAgain !== null}
        onClose={() => setGoalToStartAgain(null)}
        goal={goalToStartAgain}
        onConfirm={handleStartAgain}
      />
    </div>
  );
}