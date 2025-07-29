import { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";

interface PerformanceMetrics {
  frameTime: number;
  averageFrameTime: number;
  frameCount: number;
}

export const PerformanceMonitor: React.FC = () => {
  const frame = useCurrentFrame();
  const frameStartTime = useRef<number>(performance.now());
  const metrics = useRef<PerformanceMetrics>({
    frameTime: 0,
    averageFrameTime: 0,
    frameCount: 0,
  });

  useEffect(() => {
    const frameEndTime = performance.now();
    const frameTime = frameEndTime - frameStartTime.current;
    
    metrics.current.frameCount++;
    metrics.current.frameTime = frameTime;
    metrics.current.averageFrameTime = 
      (metrics.current.averageFrameTime * (metrics.current.frameCount - 1) + frameTime) / metrics.current.frameCount;

    // Log performance every 30 frames
    if (frame % 30 === 0) {
      console.log(`Frame ${frame} Performance:`, {
        frameTime: `${frameTime.toFixed(2)}ms`,
        averageFrameTime: `${metrics.current.averageFrameTime.toFixed(2)}ms`,
        fps: `${(1000 / metrics.current.averageFrameTime).toFixed(1)}`,
      });
    }

    frameStartTime.current = performance.now();
  }, [frame]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 1000,
      }}
    >
      <div>Frame: {frame}</div>
      <div>Frame Time: {metrics.current.frameTime.toFixed(1)}ms</div>
      <div>Avg: {metrics.current.averageFrameTime.toFixed(1)}ms</div>
      <div>FPS: {(1000 / metrics.current.averageFrameTime).toFixed(1)}</div>
    </div>
  );
};