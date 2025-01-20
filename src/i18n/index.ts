import { Language } from '../types';

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    translations: {
      // Navigation and Tabs
      goals: 'Goals',
      history: 'History',
      settings: 'Settings',

      // Goal Management
      addGoal: 'Add Goal',
      goalName: 'Goal Name',
      goalDescription: 'Goal Description',
      descriptionPlaceholder: 'Desirable but not required',
      keepDescription: 'Keep original description',
      viewDescription: 'View Description',
      nameRequired: 'Please enter a goal name',
      maxLengthReached: 'Maximum length reached (35 characters)',
      repeatsRequired: 'Please enter the number of repeats',
      repeatsPositive: 'Number of repeats must be positive',
      minRepeatsError: 'Please enter a number not lower than {0}',
      changeParameters: 'Change Parameters',
      editGoal: 'Edit Goal',
      repeats: 'Repeats',
      noGoalsYet: 'No goals yet',
      addFirstGoal: 'Click here to add your first goal and start tracking your progress',
      undoLastTap: 'Undo last tap',
      deleteGoal: 'Delete goal',
      tapAnywhere: 'Tap anywhere to continue',

      // Goal States
      current: 'Current',
      heldOver: 'Held Over',
      completed: 'Completed',
      continue: 'Continue',
      holdOver: 'Hold Over',

      // Actions
      delete: 'Delete',
      cancel: 'Cancel',
      save: 'Save',
      confirm: 'Confirm',
      startAgain: 'Start Again',
      deleteGoalConfirmTitle: 'Delete Goal',
      deleteGoalConfirmMessage: 'Are you sure you want to delete this goal? This action cannot be undone.',

      // Progress
      set: 'set',
      repeat_one: 'repeat',
      repeat_few: 'repeats',
      repeat_many: 'repeats',
      repeat_other: 'repeats',

      // Settings
      language: 'Language',
      theme: 'Theme',
      noCompletedGoals: 'No completed goals yet',
      completedGoalsWillAppearHere: 'Your completed goals will appear here',
      colorTheme: 'Color Theme',
      bwTheme: 'Black & White Theme',

      // Congratulations
      congratulations: 'Congratulations!',
      goalCompleted: 'You have completed your goal!',
    },
  },
  {
    code: 'ru',
    name: 'Русский',
    translations: {
      // Navigation and Tabs
      goals: 'Цели',
      history: 'История',
      settings: 'Настройки',

      // Goal Management
      addGoal: 'Добавить цель',
      goalName: 'Название цели',
      goalDescription: 'Описание цели',
      descriptionPlaceholder: 'Желательно, но не обязательно',
      keepDescription: 'Сохранить исходное описание',
      viewDescription: 'Посмотреть описание',
      nameRequired: 'Пожалуйста, введите название цели',
      maxLengthReached: 'Достигнута максимальная длина (35 символов)',
      repeatsRequired: 'Пожалуйста, введите количество повторений',
      repeatsPositive: 'Количество повторений должно быть положительным',
      minRepeatsError: 'Пожалуйста, введите число не меньше {0}',
      changeParameters: 'Изменить параметры',
      editGoal: 'Редактировать цель',
      repeats: 'Повторения',
      noGoalsYet: 'Пока нет целей',
      addFirstGoal: 'Нажмите здесь, чтобы добавить свою первую цель и начать отслеживать прогресс',
      undoLastTap: 'Отменить последнее нажатие',
      deleteGoal: 'Удалить цель',
      tapAnywhere: 'Нажмите в любом месте, чтобы продолжить',

      // Goal States
      current: 'Текущие',
      heldOver: 'Отложенные',
      completed: 'Завершённые',
      continue: 'Продолжить',
      holdOver: 'Отложить',

      // Actions
      delete: 'Удалить',
      cancel: 'Отмена',
      save: 'Сохранить',
      confirm: 'Подтвердить',
      startAgain: 'Начать заново',
      deleteGoalConfirmTitle: 'Удалить цель',
      deleteGoalConfirmMessage: 'Вы уверены, что хотите удалить эту цель? Это действие нельзя отменить.',

      // Progress
      set: 'подход',
      repeat_one: 'повторение',
      repeat_few: 'повторения',
      repeat_many: 'повторений',
      repeat_other: 'повторений',

      // Settings
      language: 'Язык',
      theme: 'Тема',
      noCompletedGoals: 'Пока нет завершённых целей',
      completedGoalsWillAppearHere: 'Здесь будут отображаться ваши завершённые цели',
      colorTheme: 'Цветная',
      bwTheme: 'Чёрно-белая',

      // Congratulations
      congratulations: 'Поздравляем!',
      goalCompleted: 'Вы достигли своей цели!',
    },
  },
];

let currentTranslations = languages[0].translations;

export function loadTranslations(languageCode: string) {
  const language = languages.find((lang) => lang.code === languageCode);
  if (language) {
    currentTranslations = language.translations;
  }
}

export function t(key: string): string {
  return currentTranslations[key] || key;
}

export function getAvailableLanguages(): Language[] {
  return languages;
}