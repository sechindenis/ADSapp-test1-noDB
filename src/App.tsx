import React, { useState } from 'react';
import { BottomTabBar } from './components/BottomTabBar';
import { GoalsView } from './views/GoalsView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { GoalView } from './views/GoalView';
import { AppProvider } from './context/AppContext'; 
import { TopBar } from './components/TopBar'; 
import { Goal } from './types'; 
import { useApp } from './context/AppContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('goals');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { state } = useApp();

  const handleGoalSelect = (goal: Goal) => {
    const currentGoals = state.goals.filter(g => !g.isHeldOver);
    const goalIndex = currentGoals.findIndex(g => g.id === goal.id);
    setSelectedGoal({ ...goal, index: goalIndex, total: currentGoals.length });
  };

  const handleNextGoal = () => {
    if (!selectedGoal) return;
    const currentGoals = state.goals.filter(g => !g.isHeldOver);
    const nextIndex = (selectedGoal.index + 1) % currentGoals.length;
    setSelectedGoal({ ...currentGoals[nextIndex], index: nextIndex, total: currentGoals.length });
  };

  const handlePreviousGoal = () => {
    if (!selectedGoal) return;
    const currentGoals = state.goals.filter(g => !g.isHeldOver);
    const previousIndex = (selectedGoal.index - 1 + currentGoals.length) % currentGoals.length;
    setSelectedGoal({ ...currentGoals[previousIndex], index: previousIndex, total: currentGoals.length });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (selectedGoal) {
      setSelectedGoal(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      {!selectedGoal && <TopBar activeTab={activeTab} />}
      {selectedGoal ? (
        <>
          <GoalView
            goal={selectedGoal}
            onNext={handleNextGoal}
            onPrevious={handlePreviousGoal}
            onClose={() => setSelectedGoal(null)}
          />
          <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      ) : (
        <>
          {activeTab === 'goals' && <GoalsView onGoalSelect={handleGoalSelect} />}
          {activeTab === 'history' && <HistoryView onTabChange={handleTabChange} />}
          {activeTab === 'settings' && <SettingsView />}
          <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;