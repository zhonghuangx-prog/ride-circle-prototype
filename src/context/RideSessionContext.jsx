import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { initialRideRecords } from '../data/rideRecords';

const RideSessionContext = createContext(null);
const rideDescriptions = [
  '风很轻，刚好赶上了落日。',
  '没有追速度，听轮胎压过路面的声音。',
  '城市安静下来以后，呼吸和节奏都变得更轻。',
];

export function RideSessionProvider({ children }) {
  const [rideState, setRideState] = useState('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [rideRecords, setRideRecords] = useState(initialRideRecords);
  const elapsedSecondsRef = useRef(0);

  useEffect(() => {
    elapsedSecondsRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    if (rideState !== 'riding') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [rideState]);

  const value = useMemo(
    () => ({
      rideState,
      elapsedSeconds,
      rideRecords,
      startRide() {
        setElapsedSeconds(0);
        setRideState('riding');
      },
      pauseRide() {
        setRideState('paused');
      },
      resumeRide() {
        setRideState('riding');
      },
      resetRide() {
        setRideState('idle');
        setElapsedSeconds(0);
      },
      finishRide() {
        const completedSeconds = elapsedSecondsRef.current;

        setRideRecords((current) => [
          createRideRecord(completedSeconds),
          ...current,
        ]);
        setRideState('idle');
        setElapsedSeconds(0);
      },
    }),
    [elapsedSeconds, rideRecords, rideState],
  );

  return (
    <RideSessionContext.Provider value={value}>
      {children}
    </RideSessionContext.Provider>
  );
}

function createRideRecord(elapsedSeconds) {
  const now = new Date();
  const hours = now.getHours();

  return {
    id: `ride-${Date.now()}`,
    date: formatRideDate(now),
    title: getRideTitle(hours),
    distance: `${simulateDistance(elapsedSeconds)} km`,
    duration: formatRideDuration(elapsedSeconds),
    description:
      rideDescriptions[Math.floor(Math.random() * rideDescriptions.length)],
  };
}

function formatRideDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}.${day}`;
}

function getRideTitle(hour) {
  if (hour >= 18) {
    return '夜间慢骑';
  }

  if (hour >= 5 && hour <= 11) {
    return '清晨慢骑';
  }

  return '午后环线';
}

function simulateDistance(elapsedSeconds) {
  const simulated = 5 + elapsedSeconds * 0.005;

  return Math.min(25, simulated).toFixed(1);
}

function formatRideDuration(elapsedSeconds) {
  const safeSeconds = Math.max(elapsedSeconds, 45);

  if (safeSeconds >= 3600) {
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);

    return minutes > 0 ? `${hours} 小时 ${minutes} 分钟` : `${hours} 小时`;
  }

  if (safeSeconds >= 60) {
    const minutes = Math.floor(safeSeconds / 60);

    return `${minutes} 分钟`;
  }

  return `${safeSeconds} 秒`;
}

export function useRideSession() {
  const context = useContext(RideSessionContext);

  if (!context) {
    throw new Error('useRideSession must be used within RideSessionProvider');
  }

  return context;
}
