import useAmap from '../hooks/useAmap';

export default function MapPage() {
  const { status, error } = useAmap('container');
  const showOverlay = status === 'loading' || status === 'error' || status === 'idle';

  return (
    <section className="absolute inset-0 overflow-hidden bg-black">
      <div id="container" className="h-screen w-full" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-6 pt-6">
        <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/68">
            Map Surface
          </p>
        </div>
      </div>

      {showOverlay && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[linear-gradient(180deg,rgba(6,6,6,0.78),rgba(0,0,0,0.42))]">
          <div className="rounded-[28px] border border-white/10 bg-black/35 px-6 py-5 text-center backdrop-blur-md">
            <p className="text-sm tracking-[0.18em] text-white/75">
              {status === 'loading' ? '地图加载中' : '[高德地图 API 接入区]'}
            </p>
            <p className="mt-3 max-w-[240px] text-sm leading-6 text-white/42">
              {error || '地图实例会通过 useEffect 在这里初始化并挂载。'}
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-t from-black/88 via-black/36 to-transparent" />
    </section>
  );
}
