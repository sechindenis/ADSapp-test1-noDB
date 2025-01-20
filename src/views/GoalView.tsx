import React, { useState } from 'react';
import { MoreVertical, PauseCircle, Trash2, RotateCcw, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Goal } from '../types';
import { t } from '../i18n';
import { useEffect, useRef } from 'react';
import { DescriptionModal } from '../components/DescriptionModal';
import { EditGoalModal } from '../components/EditGoalModal';
import { useCallback } from 'react';
import { Heart } from 'lucide-react';

interface GoalViewProps {
  goal: Goal;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function GoalView({ goal, onClose, onNext, onPrevious }: GoalViewProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [taps, setTaps] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showSecretButton, setShowSecretButton] = useState(false);
  const [isThrowingAway, setIsThrowingAway] = useState(false);
  const [throwDirection, setThrowDirection] = useState<number>(0);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: string; delay: number }>>([]);
  const lastClickTime = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const congratsTimeoutRef = useRef<number>();
  const menuRef = useRef<HTMLDivElement>(null);
  const secretButtonRef = useRef<HTMLButtonElement>(null);
  const { dispatch, state } = useApp();
  const currentGoal = state.goals.find(g => g.id === goal.id) || goal;
  const isColorTheme = state.theme === 'color';
  const currentGoals = state.goals.filter(g => !g.isHeldOver);
  const shouldShowNavigation = !currentGoal.isHeldOver && currentGoals.length > 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Ignore if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, input, a')) {
      return;
    }

    const now = Date.now();
    if (now - lastClickTime.current < 300) { // 300ms threshold for "fast" clicks
      setClickCount(prev => {
        if (prev === 1) { // Show on 2nd click
          setShowSecretButton(true);
          return 0;
        }
        return prev + 1;
      });
    } else {
      setClickCount(0);
    }
    lastClickTime.current = now;
  };

  const handleSecretButtonTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleSecretButtonTouchMove = (e: React.TouchEvent) => {
    if (!secretButtonRef.current) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) { // Threshold for swipe
      setIsThrowingAway(true);
      setThrowDirection(deltaX);
      
      // Hide button after animation
      setTimeout(() => {
        setShowSecretButton(false);
        setIsThrowingAway(false);
      }, 500);
    }
  };

  const handleSecretButtonClick = () => {
    const button = secretButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();

    // Calculate center of the button
    const centerX = rect.left + rect.width / 2;
    
    // Add random offset (-7px to +7px) from center
    const randomOffset = (Math.random() * (-14)) - 7; // Range from -7 to +7
    const randomX = centerX + randomOffset;
    const randomY = rect.top;

    const newHeart = {
      id: crypto.randomUUID(),
      delay: 0,
      x: randomX,
      y: randomY,
    };
    
    setFloatingHearts(prev => [...prev, newHeart]);
    
    // Clean up hearts after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 3000); // Increased duration to match slower animation
  };

  // Add touch-action none to prevent zoom
  useEffect(() => {
    if (secretButtonRef.current) {
      secretButtonRef.current.style.touchAction = 'none';
    }
  }, [showSecretButton]);

  const progress = currentGoal.totalRepeats > 0 
    ? (currentGoal.currentRepeats / currentGoal.totalRepeats) * 100 
    : 0;
  const strokeWidth = 10;
  const size = 200;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = isFinite(circumference) 
    ? circumference - (progress / 100) * circumference 
    : 0;

  const handleIncrement = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentGoal.currentRepeats >= currentGoal.totalRepeats) return;

    // Get tap coordinates relative to the SVG, accounting for rotation
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Get coordinates relative to center
    const relX = e.clientX - rect.left - centerX;
    const relY = e.clientY - rect.top - centerY;
    
    // Rotate coordinates 90 degrees counterclockwise to match SVG rotation
    const rotatedX = -relY;
    const rotatedY = relX;
    
    // Translate back to SVG coordinates
    const x = centerX + rotatedX;
    const y = centerY + rotatedY;

    // Add tap effect
    const newTap = { 
      id: crypto.randomUUID(), 
      x: x,
      y: y,
    };
    setTaps(prev => [...prev, newTap]);

    setIsAnimating(true);
    setTimeout(() => {
      setTaps(prev => prev.filter(t => t.id !== newTap.id));
      setIsAnimating(false);
    }, 400);

    const updatedGoal = {
      ...currentGoal,
      currentRepeats: currentGoal.currentRepeats + 1,
    };

    dispatch({ type: 'UPDATE_GOAL', payload: updatedGoal });

    if (updatedGoal.currentRepeats === updatedGoal.totalRepeats) {
      setShowCongrats(true);
      // Set a timeout to auto-dismiss after 5 seconds
      congratsTimeoutRef.current = window.setTimeout(() => {
        handleDismissCongrats();
      }, 5000);
    }
  };

  const handleDismissCongrats = useCallback(() => {
    if (congratsTimeoutRef.current) {
      clearTimeout(congratsTimeoutRef.current);
    }
    setIsExiting(true);
    dispatch({ type: 'COMPLETE_GOAL', payload: goal.id });
    onClose();
  }, [dispatch, goal.id, onClose]);

  useEffect(() => {
    return () => {
      if (congratsTimeoutRef.current) {
        clearTimeout(congratsTimeoutRef.current);
      }
    };
  }, []);

  const handleDelete = () => {
    dispatch({ type: 'DELETE_GOAL', payload: currentGoal.id });
    onClose();
  };

  const handleHoldOver = () => {
    dispatch({ type: 'HOLD_OVER_GOAL', payload: currentGoal.id });
    onClose();
  };

  const handleContinue = () => {
    dispatch({ type: 'CONTINUE_GOAL', payload: currentGoal.id });
    // Don't close the view, it will be re-rendered with the current state
  };

  const handleUndoTap = () => {
    if (currentGoal.currentRepeats > 0) {
      dispatch({
        type: 'UPDATE_GOAL',
        payload: { ...currentGoal, currentRepeats: currentGoal.currentRepeats - 1 },
      });
    }
  };

  return (
    <div className={`flex-1 bg-white flex flex-col no-scroll touch-none ${
      showMenu ? 'pointer-events-none' : ''
    }`}
    onClick={handleBackgroundClick}>
      <div className="flex justify-between items-center p-4 border-b">
        <button
          onClick={onClose}
          className={`text-gray-500 hover:text-gray-700 ${showMenu ? 'pointer-events-none' : ''}`}
        >
          {t('cancel')}
        </button>
        <div className="relative pointer-events-auto" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MoreVertical size={24} />
          </button>
          {showMenu && (
            <div className={`fixed right-4 mt-2 w-48 rounded-xl shadow-lg ${
              isColorTheme ? 'bg-white' : 'bg-gray-50'
            } border border-gray-100 z-[70]`}>
              <div className="py-1 space-y-1">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left flex items-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  {t('deleteGoal')}
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowEditModal(true);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                >
                  <Settings size={16} className="mr-2" />
                  {t('changeParameters')}
                </button>
                {!currentGoal.isHeldOver && (
                  <button
                    onClick={handleUndoTap}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    {t('undoLastTap')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-4">
        <div className="h-24 flex items-center justify-center">
          <h2 className="text-2xl font-semibold text-center">{currentGoal.name}</h2>
        </div>
        
        {/* Navigation buttons for mobile */}
        {shouldShowNavigation && (onNext || onPrevious) && (
          <div className="fixed inset-x-0 top-1/2 flex justify-between px-4 pointer-events-none md:hidden z-10">
            {onPrevious && (
              <button
                onClick={onPrevious}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all pointer-events-auto ${
                  isColorTheme
                    ? 'bg-indigo-50/90 text-indigo-600 active:bg-indigo-100'
                    : 'bg-gray-100/90 text-gray-700 active:bg-gray-200'
                }`}
              >
                <span className="text-xl">←</span>
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all pointer-events-auto ${
                  isColorTheme
                    ? 'bg-indigo-50/90 text-indigo-600 active:bg-indigo-100'
                    : 'bg-gray-100/90 text-gray-700 active:bg-gray-200'
                }`}
              >
                <span className="text-xl">→</span>
              </button>
            )}
          </div>
        )}

        {currentGoal.isHeldOver ? (
          <div className="flex flex-col items-center w-full max-w-md mt-12 mb-20">
            <button
              onClick={handleContinue}
              className={`px-6 py-3 rounded-xl transition-all duration-300 mb-8 ${
                isColorTheme
                  ? 'bg-indigo-500 hover:bg-indigo-600'
                  : 'bg-gray-800 hover:bg-gray-900'
              } text-white font-medium`}
            >
              {t('continue')}
            </button>
            
            {currentGoal.description && currentGoal.description.trim() && (
              <div className={`w-full max-h-[240px] overflow-y-auto scrollable ${
                isColorTheme ? 'bg-indigo-50' : 'bg-gray-100'
              } rounded-xl p-4`}>
                <p className="text-sm whitespace-pre-wrap">
                  {currentGoal.description}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-8 mb-20">
            <div 
              className={`relative transform transition-transform duration-300 ${
                isAnimating ? 'scale-100' : 'scale-100'
              } cursor-pointer select-none`} 
              onClick={handleIncrement}
            >
              <svg
                width={size}
                height={size}
                className="transform -rotate-90 pointer-events-none"
              >
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={isColorTheme ? '#e0e7ff' : '#f3f4f6'}
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={isColorTheme ? '#6366f1' : '#111827'}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }}
                  strokeLinecap="round"
                />
                {taps.map((tap) => (
                  <g key={tap.id}>
                    {/* Shooting stars */}
                   {Array.from({ length: 4 }).map((_, i) => {
                      const angle = (i * Math.PI * 2) / 4; // Divide circle into 4 equal parts
                      const distance = 100;
                      const tx = Math.cos(angle) * distance;
                      const ty = Math.sin(angle) * distance;
                      return (
                        <circle
                          key={`star-${i}`}
                          cx={tap.x}
                          cy={tap.y}
                          r={4}
                          fill={isColorTheme ? '#6366f1' : '#111827'}
                          style={{
                            '--tx': `${tx}px`,
                            '--ty': `${ty}px`,
                            animation: 'shoot 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                          } as React.CSSProperties}
                        />
                      );
                    })}
                  </g>
                ))}
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 pointer-events-none ${
                isAnimating ? 'scale-100' : 'scale-100'
              }`}>
                <span className="text-3xl font-bold">
                  {currentGoal.currentRepeats}/{currentGoal.totalRepeats}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 mt-8 h-[88px]">
              <button
                onClick={handleHoldOver}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-2"
                style={{ marginBottom: '1rem' }}
              >
                <PauseCircle size={20} className="mr-2" />
                {t('holdOver')}
              </button>
              
              {currentGoal.description && (
                <button
                  onClick={() => setShowDescription(true)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    isColorTheme
                      ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('viewDescription')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop navigation */}
        {shouldShowNavigation && (onNext || onPrevious) && (
          <div className="hidden md:flex justify-between items-center w-full max-w-sm mt-8">
            <button
              onClick={onPrevious}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isColorTheme
                  ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">←</span>
            </button>
            <button
              onClick={onNext}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isColorTheme
                  ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">→</span>
            </button>
          </div>
        )}
      </div>

      {showCongrats && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-500 flex items-center justify-center p-4 overflow-hidden ${
            isExiting ? 'opacity-0' : 'bg-opacity-50'
          }`} 
          style={{ zIndex: 100 }}
          onClick={handleDismissCongrats}
        >
          {/* Confetti */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                background: isColorTheme 
                  ? ['#818cf8', '#6366f1', '#4f46e5'][Math.floor(Math.random() * 3)]
                  : ['#374151', '#1f2937', '#111827'][Math.floor(Math.random() * 3)],
                animation: `confetti-fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
          
          <div className={`w-full max-w-[320px] p-8 rounded-2xl ${
            isColorTheme ? 'bg-white' : 'bg-gray-50'
          } text-center relative ${
            isExiting 
              ? 'animate-[fade-out_0.3s_ease-in-out_forwards]' 
              : 'animate-[scale-in_0.5s_ease-out] mx-4'
          }`}>
            {/* Sparkles around the modal */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4"
                style={{
                  left: `${50 + 45 * Math.cos(i * Math.PI / 4)}%`,
                  top: `${50 + 45 * Math.sin(i * Math.PI / 4)}%`,
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle, ${
                    isColorTheme ? '#818cf8' : '#374151'
                  } 0%, transparent 70%)`,
                  animation: 'sparkle 1s ease-out infinite',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
            
            <div className="relative">
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-3 break-keep">{t('congratulations')}</h3>
                <p className="text-base text-gray-600 break-keep">{t('goalCompleted')}</p>
                <p className="text-sm text-gray-400 mt-4 text-center">{t('tapAnywhere')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Secret Button */}
      {showSecretButton && (
        <button
          ref={secretButtonRef}
          onClick={handleSecretButtonClick}
          onTouchStart={handleSecretButtonTouchStart}
          onTouchMove={handleSecretButtonTouchMove}
          className={`fixed right-4 bottom-24 w-12 h-12 rounded-full shadow-lg flex items-center justify-center overflow-hidden ${
            isColorTheme
              ? 'bg-indigo-500 text-white hover:bg-indigo-600'
              : 'bg-gray-800 text-white hover:bg-gray-900'
          }`}
          style={{
            animation: isThrowingAway 
              ? 'throw-away 0.5s ease-out forwards'
              : 'pop-in 0.5s ease-out',
            '--throw-direction': `${throwDirection}px`,
            '--throw-rotation': `${throwDirection > 0 ? 720 : -720}deg`,
          } as React.CSSProperties}
        >
          <Heart size={20} />
          {floatingHearts.map(heart => (
            <div
              key={heart.id}
              className="fixed pointer-events-none"
              style={{
                left: `${heart.x}px`,
                top: `${heart.y}px`,
                animation: 'float-heart 2s linear forwards',
                animationDelay: `${heart.delay}ms`,
                zIndex: 999999, // Extremely high z-index to ensure hearts are always on top
              }}
            >
              <Heart
                size={28}
                fill="transparent"
                color={isColorTheme ? '#6366f1' : '#111827'}
                strokeWidth={1.5}
                className="drop-shadow-lg"
              />
            </div>
          ))}
        </button>
      )}

      {/* Floating hearts container - separate from button to ensure proper layering */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 999999 }}>
        {floatingHearts.map(heart => (
            <div
              key={heart.id}
              className="absolute"
              style={{
                left: `${heart.x}px`,
                top: `${heart.y}px`,
                animation: 'float-heart 2s linear forwards',
                animationDelay: `${heart.delay}ms`,
              }}
            >
              <Heart
                size={28}
                fill="transparent"
                color={isColorTheme ? '#6366f1' : '#111827'}
                strokeWidth={1.5}
                className="drop-shadow-lg"
              />
            </div>
        ))}
      </div>

      <DescriptionModal
        isOpen={showDescription}
        onClose={() => setShowDescription(false)}
        description={currentGoal.description || ''}
      />
      <EditGoalModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        goal={currentGoal}
      />
    </div>
  );
}