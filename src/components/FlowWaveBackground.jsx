import { useEffect, useRef } from 'react';
import { createFlowWaveScene } from '../three/flowWave.js';

const getScrollFraction = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
};

/**
 * Mounts the Flow Wave Three.js scene as a fixed, full-viewport canvas
 * behind the page content. `active` gates it off for light theme (the
 * scene's dark backdrop doesn't suit the paper palette) and for
 * prefers-reduced-motion — Ambient's static CSS backdrop covers those cases.
 */
export default function FlowWaveBackground({ active, onError }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    let scene;
    try {
      scene = createFlowWaveScene(canvasRef.current, { getScrollFraction });
    } catch (error) {
      onError?.(error);
      return undefined;
    }

    const onResize = () => scene.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      scene.dispose();
    };
  }, [active, onError]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="flow-wave" aria-hidden="true" />;
}
