import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Square } from 'lucide-react';
import { useRideSession } from '../context/RideSessionContext';
import useAmap from '../hooks/useAmap';

const metrics = [
  { value: '42', unit: 'm', label: '平均节奏' },
  { value: '3', unit: '人', label: '陪伴中' },
  { value: '晴 24°', unit: '', label: '骑行天气' },
];

const HOLD_TO_END_MS = 1500;

export default function RideDashboard() {
  const { rideState, elapsedSeconds, startRide, pauseRide, resumeRide, finishRide } =
    useRideSession();
  const { status, error } = useAmap('ride-map-container');
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimeoutRef = useRef();
  const holdIntervalRef = useRef();

  useEffect(() => {
    return () => {
      clearHoldTimers();
    };
  }, []);

  useEffect(() => {
    clearHoldTimers();
  }, [rideState]);

  const timerText = useMemo(
    () => formatElapsedTime(elapsedSeconds),
    [elapsedSeconds],
  );
  const isIdle = rideState === 'idle';
  const isPaused = rideState === 'paused';
  const actionLabel = isPaused ? '继续骑行' : '暂停';
  const actionIcon = isPaused ? Play : Pause;
  const endLabel = isPaused ? '长按结束' : '结束';
  const showMapOverlay = status === 'loading' || status === 'error' || status === 'idle';

  function clearHoldTimers() {
    if (holdTimeoutRef.current) {
      window.clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = undefined;
    }

    if (holdIntervalRef.current) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = undefined;
    }

    setHoldProgress(0);
  }

  function beginEndHold() {
    const startedAt = Date.now();

    clearHoldTimers();
    setHoldProgress(0);

    holdTimeoutRef.current = window.setTimeout(() => {
      clearHoldTimers();
      finishRide();
    }, HOLD_TO_END_MS);

    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setHoldProgress(Math.min(elapsed / HOLD_TO_END_MS, 1));
    }, 16);
  }

  function cancelEndHold() {
    clearHoldTimers();
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <div id="ride-map-container" className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.22)_28%,rgba(0,0,0,0.34)_58%,rgba(0,0,0,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_22%)]" />

      {showMapOverlay && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/28">
          <div className="rounded-[28px] border border-white/10 bg-black/30 px-6 py-5 text-center backdrop-blur-md">
            <p className="text-sm tracking-[0.18em] text-white/78">
              {status === 'loading' ? '地图加载中' : '[高德地图 API 接入区]'}
            </p>
            <p className="mt-3 max-w-[240px] text-sm leading-6 text-white/42">
              {error || '正在为骑行页加载实时地图底图。'}
            </p>
          </div>
        </div>
      )}

      <div
        className={`relative z-10 flex min-h-screen flex-col px-6 pt-6 ${
          isIdle ? 'pb-32' : 'pb-10'
        }`}
      >
        <header className="pb-4 pt-0">
          <p className="mb-6 text-xs uppercase tracking-[0.2em] text-gray-500">
            Friday / Leisure Ride
          </p>

          <div className="relative min-h-[92px]">
            <div
              className={`absolute inset-0 transition-all duration-300 ${
                isIdle
                  ? 'translate-y-0 opacity-100'
                  : '-translate-y-2 opacity-0 pointer-events-none'
              }`}
            >
              <p className="mb-1 text-sm text-gray-400">今日累计</p>
              <div className="flex items-baseline gap-1">
                <h1 className="text-6xl font-bold tracking-tighter text-white">26.4</h1>
                <span className="text-lg font-medium text-gray-500">KM</span>
              </div>
            </div>

            <div
              className={`absolute inset-0 transition-all duration-300 ${
                isIdle
                  ? 'translate-y-2 opacity-0 pointer-events-none'
                  : 'translate-y-0 opacity-100'
              }`}
            >
              <p className="mb-2 text-sm tracking-[0.24em] text-gray-400">
                {isPaused ? '已暂停' : '骑行中'}
              </p>
              <div
                className={`text-5xl font-semibold tracking-[-0.08em] text-white transition-all duration-300 ${
                  isPaused ? 'timer-blink' : ''
                }`}
              >
                {timerText}
              </div>
            </div>
          </div>
        </header>

        <div className="relative flex flex-1 flex-col items-center justify-center">
          <div
            className={`pointer-events-none absolute transition-all duration-300 ${
              isIdle
                ? 'h-72 w-72 scale-100 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.52),rgba(0,0,0,0.3))] opacity-100 shadow-[0_0_40px_rgba(255,255,255,0.08)] backdrop-blur-sm'
                : 'h-56 w-56 scale-95 rounded-full border border-white/10 opacity-30'
            }`}
          />
          <div
            className={`pointer-events-none absolute rounded-full border border-white/12 transition-all duration-300 ${
              isIdle ? 'h-56 w-56 opacity-100' : 'h-44 w-44 opacity-20'
            }`}
          />

          <div className="relative flex min-h-[196px] w-full items-center justify-center">
            <button
              type="button"
              onClick={startRide}
              className={`glass-ripple absolute z-10 flex h-40 w-40 flex-col items-center justify-center rounded-full border border-gray-600 bg-gradient-to-br from-gray-800 to-black shadow-2xl transition-all duration-300 ${
                isIdle
                  ? 'animate-breathe scale-100 opacity-100'
                  : 'pointer-events-none scale-75 opacity-0'
              }`}
            >
              <span className="mb-2 text-xs tracking-[0.3em] text-gray-400">TAP</span>
              <span className="text-2xl font-bold tracking-widest text-gray-100">
                开始骑行
              </span>
            </button>

            <div
              className={`absolute flex w-full items-center justify-center gap-4 transition-all duration-300 ${
                isIdle
                  ? 'pointer-events-none translate-y-6 scale-90 opacity-0'
                  : 'translate-y-0 scale-100 opacity-100'
              }`}
            >
              <ActionButton
                label={actionLabel}
                sublabel={isPaused ? 'Resume' : 'Pause'}
                icon={actionIcon}
                onClick={isPaused ? resumeRide : pauseRide}
              />
              <LongPressEndButton
                label={endLabel}
                holdProgress={holdProgress}
                onHoldStart={beginEndHold}
                onHoldEnd={cancelEndHold}
              />
            </div>
          </div>
        </div>

        <footer
          className={`grid grid-cols-3 gap-3 pb-8 transition-all duration-300 ${
            isIdle
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-6 opacity-0'
          }`}
        >
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              value={metric.value}
              unit={metric.unit}
              label={metric.label}
            />
          ))}
        </footer>
      </div>
    </section>
  );
}

function ActionButton({ icon: Icon, label, sublabel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-ripple relative flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 active:scale-95"
    >
      <Icon size={20} strokeWidth={1.7} className="mb-3 text-white/75" />
      <span className="text-lg font-medium tracking-[0.08em]">{label}</span>
      <span className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/38">
        {sublabel}
      </span>
    </button>
  );
}

function LongPressEndButton({ label, holdProgress, onHoldStart, onHoldEnd }) {
  return (
    <button
      type="button"
      onPointerDown={onHoldStart}
      onPointerUp={onHoldEnd}
      onPointerLeave={onHoldEnd}
      onPointerCancel={onHoldEnd}
      className="glass-ripple relative flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 active:scale-95"
    >
      <div
        className="pointer-events-none absolute -inset-1 rounded-full"
        style={{
          background: `conic-gradient(rgba(255,255,255,0.92) ${holdProgress * 360}deg, rgba(255,255,255,0.08) 0deg)`,
          WebkitMask:
            'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
          opacity: holdProgress > 0 ? 1 : 0,
          transition: 'opacity 150ms ease',
        }}
      />
      <Square size={18} strokeWidth={1.7} className="mb-3 text-white/75" />
      <span className="text-lg font-medium tracking-[0.08em]">{label}</span>
      <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/38">
        长按 1.5s
      </span>
    </button>
  );
}

function MetricCard({ value, unit, label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="mb-1 flex items-baseline gap-1">
        <span className="text-lg font-bold text-white">{value}</span>
        {unit ? <span className="text-xs text-gray-400">{unit}</span> : null}
      </div>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  );
}

function formatElapsedTime(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}
