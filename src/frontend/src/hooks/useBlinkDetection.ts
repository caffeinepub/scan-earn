import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

interface BlinkDetectionConfig {
  targetBlinks: number;
  earThreshold?: number;
}

interface BlinkDetectionState {
  blinkCount: number;
  isEyeClosed: boolean;
  isModelLoading: boolean;
  detectionError: string | null;
  isDetecting: boolean;
}

export function useBlinkDetection(
  videoRef: RefObject<HTMLVideoElement>,
  config: BlinkDetectionConfig = { targetBlinks: 2, earThreshold: 0.25 }
) {
  const [state, setState] = useState<BlinkDetectionState>({
    blinkCount: 0,
    isEyeClosed: false,
    isModelLoading: false,
    detectionError: null,
    isDetecting: false,
  });

  const detectionRef = useRef<number | null>(null);
  const wasClosedRef = useRef(false);
  const frameCountRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simple eye aspect ratio calculation using pixel intensity
  const calculateEyeOpenness = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): number => {
    try {
      const imageData = ctx.getImageData(x, y, width, height);
      const data = imageData.data;
      let totalBrightness = 0;
      
      // Calculate average brightness in eye region
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        totalBrightness += (r + g + b) / 3;
      }
      
      const avgBrightness = totalBrightness / (width * height);
      return avgBrightness / 255; // Normalize to 0-1
    } catch (error) {
      return 0.5; // Default to open if error
    }
  }, []);

  const detectBlink = useCallback(() => {
    // Get current video element from ref
    const videoElement = videoRef.current;
    
    if (!videoElement || !canvasRef.current || videoElement.readyState < 2) {
      // Video not ready yet, skip this frame
      detectionRef.current = requestAnimationFrame(detectBlink);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      detectionRef.current = requestAnimationFrame(detectBlink);
      return;
    }

    // Set canvas size to match video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw current video frame
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Approximate eye regions (rough estimation based on typical face proportions)
    const faceWidth = canvas.width * 0.6;
    const faceHeight = canvas.height * 0.7;
    const faceX = canvas.width * 0.2;
    const faceY = canvas.height * 0.15;

    // Left eye region (approximate)
    const leftEyeX = faceX + faceWidth * 0.25;
    const leftEyeY = faceY + faceHeight * 0.35;
    const eyeWidth = faceWidth * 0.15;
    const eyeHeight = faceHeight * 0.08;

    // Right eye region (approximate)
    const rightEyeX = faceX + faceWidth * 0.6;
    const rightEyeY = leftEyeY;

    // Calculate eye openness for both eyes
    const leftEyeOpenness = calculateEyeOpenness(ctx, leftEyeX, leftEyeY, eyeWidth, eyeHeight);
    const rightEyeOpenness = calculateEyeOpenness(ctx, rightEyeX, rightEyeY, eyeWidth, eyeHeight);
    
    // Average both eyes
    const avgOpenness = (leftEyeOpenness + rightEyeOpenness) / 2;
    
    // Determine if eyes are closed (lower brightness = closed)
    const isClosed = avgOpenness < (config.earThreshold || 0.25);

    setState(prev => {
      const newState = { ...prev, isEyeClosed: isClosed };

      // Detect blink transition (closed -> open)
      if (wasClosedRef.current && !isClosed) {
        // Blink detected!
        const newBlinkCount = prev.blinkCount + 1;
        newState.blinkCount = newBlinkCount;
        frameCountRef.current = 0;
      }

      wasClosedRef.current = isClosed;
      frameCountRef.current++;

      return newState;
    });

    // Continue detection loop if still detecting
    if (state.isDetecting) {
      detectionRef.current = requestAnimationFrame(detectBlink);
    }
  }, [videoRef, config.earThreshold, calculateEyeOpenness, state.isDetecting]);

  const start = useCallback(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) {
      setState(prev => ({
        ...prev,
        detectionError: 'Video element not available',
      }));
      return;
    }

    // Check if video is ready
    if (videoElement.readyState < 2 || videoElement.videoWidth === 0) {
      setState(prev => ({
        ...prev,
        detectionError: 'Video stream not ready. Please wait for camera to initialize.',
      }));
      return;
    }

    // Create hidden canvas for processing
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    setState(prev => ({
      ...prev,
      isDetecting: true,
      detectionError: null,
      blinkCount: 0,
      isEyeClosed: false,
    }));

    wasClosedRef.current = false;
    frameCountRef.current = 0;

    // Start detection loop
    detectionRef.current = requestAnimationFrame(detectBlink);
  }, [videoRef, detectBlink]);

  const stop = useCallback(() => {
    if (detectionRef.current) {
      cancelAnimationFrame(detectionRef.current);
      detectionRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isDetecting: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      blinkCount: 0,
      isEyeClosed: false,
      detectionError: null,
    }));
    wasClosedRef.current = false;
    frameCountRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
      }
    };
  }, []);

  return {
    blinkCount: state.blinkCount,
    isEyeClosed: state.isEyeClosed,
    isModelLoading: state.isModelLoading,
    detectionError: state.detectionError,
    isDetecting: state.isDetecting,
    start,
    stop,
    reset,
  };
}
