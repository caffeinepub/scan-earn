import { useState, useEffect, useRef } from 'react';

interface DataPoint {
  time: number;
  value: number;
}

interface UseSimulatedTradingSeriesOptions {
  initialValue?: number;
  maxPoints?: number;
  updateInterval?: number;
  volatility?: number;
  minValue?: number;
  maxValue?: number;
}

export function useSimulatedTradingSeries(options: UseSimulatedTradingSeriesOptions = {}) {
  const {
    initialValue = 100,
    maxPoints = 20,
    updateInterval = 1000,
    volatility = 5,
    minValue = 80,
    maxValue = 140,
  } = options;

  const [data, setData] = useState<DataPoint[]>(() => {
    // Initialize with some starting data
    const initial: DataPoint[] = [];
    let value = initialValue;
    
    for (let i = 0; i < Math.min(10, maxPoints); i++) {
      const change = (Math.random() - 0.5) * volatility;
      value = Math.max(minValue, Math.min(maxValue, value + change));
      initial.push({
        time: i,
        value: Math.round(value * 100) / 100,
      });
    }
    
    return initial;
  });

  const timeCounterRef = useRef(data.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastValue = prevData[prevData.length - 1]?.value ?? initialValue;
        
        // Random walk with bounds
        const change = (Math.random() - 0.5) * volatility;
        const newValue = Math.max(
          minValue,
          Math.min(maxValue, lastValue + change)
        );

        const newPoint: DataPoint = {
          time: timeCounterRef.current,
          value: Math.round(newValue * 100) / 100,
        };

        timeCounterRef.current += 1;

        // Sliding window: keep only the last maxPoints
        const updatedData = [...prevData, newPoint];
        if (updatedData.length > maxPoints) {
          return updatedData.slice(updatedData.length - maxPoints);
        }
        return updatedData;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [initialValue, maxPoints, updateInterval, volatility, minValue, maxValue]);

  return data;
}
