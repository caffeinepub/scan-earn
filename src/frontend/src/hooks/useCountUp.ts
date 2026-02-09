import { useEffect, useState } from 'react';

export function useCountUp(target: number, duration: number = 1000) {
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    if (current === target) return;

    const startValue = current;
    const difference = target - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.floor(startValue + difference * easeProgress);
      
      setCurrent(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, current, duration]);

  return current;
}

