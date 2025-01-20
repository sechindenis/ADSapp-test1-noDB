interface Coordinates {
  x: number;
  y: number;
}

interface ConfettiConfig {
  colors: string[];
  count: number;
  duration: number;
}

export function generateConfetti(isColorTheme: boolean): ConfettiConfig {
  return {
    colors: isColorTheme 
      ? ['#818cf8', '#6366f1', '#4f46e5']
      : ['#374151', '#1f2937', '#111827'],
    count: 30,
    duration: 3,
  };
}

export function calculateTapEffectCoordinates(
  event: React.MouseEvent,
  element: HTMLElement
): Coordinates {
  const rect = element.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const relX = event.clientX - rect.left - centerX;
  const relY = event.clientY - rect.top - centerY;
  
  // Rotate coordinates 90 degrees counterclockwise
  const rotatedX = -relY;
  const rotatedY = relX;
  
  return {
    x: centerX + rotatedX,
    y: centerY + rotatedY,
  };
}

export function debounceAnimationFrame(callback: Function): () => void {
  let handle: number;
  return () => {
    cancelAnimationFrame(handle);
    handle = requestAnimationFrame(() => callback());
  };
}