import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

interface SpoofHeuristicsConfig {
  /**
   * Time window in milliseconds to detect spoofing (default: 2000ms)
   */
  detectionWindow?: number;
  /**
   * Minimum variance threshold to consider video as "live" (default: 5)
   */
  varianceThreshold?: number;
  /**
   * Number of frames to analyze (default: 30)
   */
  frameSampleSize?: number;
}

interface SpoofHeuristicsReturn {
  isSpoofDetected: boolean;
  isAnalyzing: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Lightweight client-side anti-spoof heuristics for face verification.
 * Detects frozen frames or extremely low motion/variance over time.
 * 
 * WARNING: This is NOT a production-grade anti-spoofing solution.
 * Real liveness detection requires ML models and server-side validation.
 */
export function useSpoofHeuristics(
  videoRef: RefObject<HTMLVideoElement>,
  onSpoofDetected: () => void,
  config: SpoofHeuristicsConfig = {}
): SpoofHeuristicsReturn {
  const {
    detectionWindow = 2000,
    varianceThreshold = 5,
    frameSampleSize = 30,
  } = config;

  const [isSpoofDetected, setIsSpoofDetected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const detectionRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameVariances = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);

  /**
   * Calculate variance of pixel brightness in a frame
   */
  const calculateFrameVariance = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): number => {
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const pixels: number[] = [];

      // Sample every 4th pixel for performance
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        pixels.push(brightness);
      }

      // Calculate variance
      const mean = pixels.reduce((sum, val) => sum + val, 0) / pixels.length;
      const variance = pixels.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / pixels.length;

      return variance;
    } catch (error) {
      return 0;
    }
  }, []);

  /**
   * Analyze video frames for spoofing indicators
   */
  const analyzeFrame = useCallback(() => {
    // Get current video element from ref
    const videoElement = videoRef.current;
    
    if (!videoElement || !canvasRef.current || videoElement.readyState < 2) {
      // Video not ready yet, skip this frame
      detectionRef.current = requestAnimationFrame(analyzeFrame);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      detectionRef.current = requestAnimationFrame(analyzeFrame);
      return;
    }

    // Set canvas size to match video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw current frame
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Calculate frame variance
    const variance = calculateFrameVariance(ctx, canvas.width, canvas.height);
    frameVariances.current.push(variance);

    // Keep only recent frames
    if (frameVariances.current.length > frameSampleSize) {
      frameVariances.current.shift();
    }

    // Check if detection window has elapsed
    const elapsed = Date.now() - startTimeRef.current;
    if (elapsed >= detectionWindow && frameVariances.current.length >= frameSampleSize) {
      // Calculate average variance across all frames
      const avgVariance = frameVariances.current.reduce((sum, v) => sum + v, 0) / frameVariances.current.length;

      // If variance is too low, likely a static image or frozen video
      if (avgVariance < varianceThreshold) {
        setIsSpoofDetected(true);
        onSpoofDetected();
        stop();
        return;
      }
    }

    // Continue analysis if still analyzing
    if (isAnalyzing) {
      detectionRef.current = requestAnimationFrame(analyzeFrame);
    }
  }, [videoRef, calculateFrameVariance, detectionWindow, frameSampleSize, varianceThreshold, isAnalyzing, onSpoofDetected]);

  const start = useCallback(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) {
      console.warn('Video element not available for spoof detection');
      return;
    }

    // Check if video is ready
    if (videoElement.readyState < 2 || videoElement.videoWidth === 0) {
      console.warn('Video stream not ready for spoof detection');
      return;
    }

    // Create hidden canvas for processing
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    setIsAnalyzing(true);
    setIsSpoofDetected(false);
    frameVariances.current = [];
    startTimeRef.current = Date.now();

    // Start analysis loop
    detectionRef.current = requestAnimationFrame(analyzeFrame);
  }, [videoRef, analyzeFrame]);

  const stop = useCallback(() => {
    if (detectionRef.current) {
      cancelAnimationFrame(detectionRef.current);
      detectionRef.current = null;
    }
    setIsAnalyzing(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setIsSpoofDetected(false);
    frameVariances.current = [];
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
      }
    };
  }, []);

  return {
    isSpoofDetected,
    isAnalyzing,
    start,
    stop,
    reset,
  };
}
