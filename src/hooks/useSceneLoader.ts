import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

export const useSceneLoader = () => {
  const { progress, loaded, total } = useProgress();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Calculate total loading progress including assets and 3D scene
    const sceneProgress = Math.min(100, (loaded / Math.max(1, total)) * 100);
    setLoadingProgress(sceneProgress);

    // Consider loading complete when progress is 100%
    if (sceneProgress === 100) {
      // Add a small delay for smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [progress, loaded, total]);

  return {
    isLoading,
    loadingProgress,
  };
};

export default useSceneLoader; 