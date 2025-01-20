import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Goal, ThemeMode } from '../types';
import { loadTranslations } from '../i18n';

const STORAGE_KEY = 'app_state';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'COMPLETE_GOAL'; payload: string }
  | { type: 'HOLD_OVER_GOAL'; payload: string }
  | { type: 'CONTINUE_GOAL'; payload: string }
  | { type: 'UPDATE_PRIORITIES'; payload: Goal[] }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_THEME'; payload: ThemeMode };

const initialState: AppState = {
  goals: [],
  completedGoals: [],
  language: 'ru',
  theme: 'color',
};

function loadState(): AppState {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      loadTranslations(parsedState.language);
      return parsedState;
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return initialState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  let newState: AppState;

  switch (action.type) {
    case 'ADD_GOAL':
      newState = {
        ...state,
        goals: [...state.goals, action.payload],
      };
      break;
    case 'UPDATE_GOAL':
      newState = {
        ...state,
        goals: state.goals.map((goal) => {
          if (goal.id === action.payload.id) {
            // Remove isNew flag when updating the goal
            const { isNew, ...updatedGoal } = action.payload;
            return updatedGoal;
          }
          return goal;
        }),
      };
      break;
    case 'DELETE_GOAL':
      newState = {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload),
        completedGoals: state.completedGoals.filter(
          (goal) => goal.id !== action.payload
        ),
      };
      break;
    case 'COMPLETE_GOAL':
      const completedGoal = state.goals.find((g) => g.id === action.payload);
      if (!completedGoal) return state;
      newState = {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
        completedGoals: [...state.completedGoals, {
          ...completedGoal,
          completedAt: new Date().toISOString(),
        }],
      };
      break;
    case 'HOLD_OVER_GOAL':
      newState = {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload ? { ...goal, isHeldOver: true } : goal
        ),
      };
      break;
    case 'CONTINUE_GOAL':
      newState = {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload ? { ...goal, isHeldOver: false } : goal
        ),
      };
      break;
    case 'UPDATE_PRIORITIES':
      newState = {
        ...state,
        goals: action.payload,
      };
      break;
    case 'SET_LANGUAGE':
      loadTranslations(action.payload);
      newState = {
        ...state,
        language: action.payload,
      };
      break;
    case 'SET_THEME':
      newState = {
        ...state,
        theme: action.payload,
      };
      break;
    default:
      return state;
  }

  saveState(newState);
  return newState;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, loadState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}