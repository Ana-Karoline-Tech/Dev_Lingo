import { useEffect, useState } from 'react';
import loaderImage from '../assets/images/devlingo-loader.png';
import './LoadingScreen.css';

type AnimationPhase = 'fade-in' | 'fade-out';

const FADE_DURATION_MS = 800;
const VISIBLE_DURATION_MS = 2000;

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('fade-in');

  useEffect(() => {
    const fadeOutTimer = window.setTimeout(() => {
      setAnimationPhase('fade-out');
    }, FADE_DURATION_MS + VISIBLE_DURATION_MS);

    const unmountTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, FADE_DURATION_MS + VISIBLE_DURATION_MS + FADE_DURATION_MS);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-8 bg-purple-600 loading-screen ${animationPhase}`}
      aria-hidden={false}
    >
      <img
        src={loaderImage}
        alt="Devlingo owl loader"
        className="h-40 w-40 max-w-[40vw] object-contain owl-float"
      />
      <h1 className="text-5xl font-bold text-white">Devlingo</h1>
    </div>
  );
}
