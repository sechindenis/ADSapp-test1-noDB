import React, { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoalCard } from '../components/GoalCard';
import { AddGoalModal } from '../components/AddGoalModal';
import { t } from '../i18n';
import { Goal } from '../types';

export function GoalsView({ onGoalSelect }: { onGoalSelect: (goal: Goal) => void }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { state, dispatch } = useApp();
  const isColorTheme = state.theme === 'color';

  const currentGoals = state.goals.filter((g) => !g.isHeldOver);
  const heldOverGoals = state.goals.filter((g) => g.isHeldOver);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(currentGoals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedGoals = items.map((goal, index) => ({
      ...goal,
      priority: Date.now() + index,
    }));

    dispatch({ type: 'UPDATE_PRIORITIES', payload: updatedGoals });
  };

  return (
    <div className="flex-1 px-4 pt-20 pb-20 overflow-y-auto scrollable">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 capitalize">{t('current')}</h2>
        {currentGoals.length > 0 ? currentGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onClick={() => onGoalSelect(goal)}
          />
        )) : (
          <div 
            onClick={() => setIsAddModalOpen(true)}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-200 ${
              isColorTheme 
                ? 'bg-white border-2 border-dashed border-indigo-200 hover:border-indigo-400' 
                : 'bg-white border-2 border-dashed border-gray-200 hover:border-gray-400'
            } flex flex-col items-center justify-center space-y-4`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isColorTheme ? 'bg-indigo-50' : 'bg-gray-50'
            }`}>
              <Target size={32} className={isColorTheme ? 'text-indigo-500' : 'text-gray-700'} />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">{t('noGoalsYet')}</h3>
              <p className="text-gray-500 text-sm">
                {t('addFirstGoal')}
              </p>
            </div>
          </div>
        )}
      </div>

      {heldOverGoals.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 capitalize">{t('heldOver')}</h2>
          {heldOverGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onClick={() => onGoalSelect(goal)}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setIsAddModalOpen(true)}
        className={`fixed right-4 bottom-20 w-14 h-14 rounded-full ${
          isColorTheme
            ? 'bg-indigo-500 hover:bg-indigo-600'
            : 'bg-gray-800 hover:bg-gray-900'
        } text-white flex items-center justify-center shadow-lg`}
      >
        <Plus size={24} />
      </button>

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}