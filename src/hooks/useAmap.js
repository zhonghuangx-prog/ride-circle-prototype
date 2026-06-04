import { useEffect, useState } from 'react';

const AMAP_SRC = 'https://webapi.amap.com/maps?v=2.0';
let amapPromise;

function loadAmapScript(apiKey) {
  const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_KEY;

  if (!securityJsCode) {
    return Promise.reject(new Error('缺少 VITE_AMAP_SECURITY_KEY，地图脚本无法安全加载。'));
  }

  window._AMapSecurityConfig = {
    securityJsCode,
  };

  if (amapPromise) {
    return amapPromise;
  }

  amapPromise = new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
      return;
    }

    const existingScript = document.querySelector('script[data-amap-loader="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.AMap), {
        once: true,
      });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('高德地图脚本加载失败')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = `${AMAP_SRC}&key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.amapLoader = 'true';
    script.onload = () => resolve(window.AMap);
    script.onerror = () => reject(new Error('高德地图脚本加载失败'));
    document.head.appendChild(script);
  }).catch((error) => {
    amapPromise = undefined;
    throw error;
  });

  return amapPromise;
}

export default function useAmap(containerId) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const apiKey = import.meta.env.VITE_AMAP_API_KEY;

    if (!apiKey) {
      setStatus('error');
      setError('缺少 VITE_AMAP_API_KEY，地图暂未初始化。');
      return undefined;
    }

    let destroyed = false;
    let mapInstance;

    async function initMap() {
      try {
        setStatus('loading');
        setError('');

        const AMap = await loadAmapScript(apiKey);
        if (destroyed) {
          return;
        }

        mapInstance = new AMap.Map(containerId, {
          viewMode: '2D',
          zoom: 13,
          center: [121.4737, 31.2304],
          mapStyle: 'amap://styles/dark',
          showLabel: false,
          showIndoorMap: false,
          pitchEnable: false,
          rotateEnable: false,
          expandZoomRange: false,
          buildingAnimation: false,
          skyColor: '#000000',
        });

        setStatus('ready');
      } catch (err) {
        if (!destroyed) {
          setStatus('error');
          setError(err instanceof Error ? err.message : '地图初始化失败');
        }
      }
    }

    initMap();

    return () => {
      destroyed = true;
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [containerId]);

  return { status, error };
}
