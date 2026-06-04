import { Bike, Map, ScrollText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useRideSession } from '../context/RideSessionContext';

const tabs = [
  { to: '/map', label: '地图', icon: Map },
  { to: '/ride', label: '骑行', icon: Bike },
  { to: '/record', label: '记录', icon: ScrollText },
];

export default function BottomNav() {
  const { rideState } = useRideSession();
  const isHidden = rideState !== 'idle';

  return (
    <nav
      className={`fixed bottom-0 left-1/2 z-20 w-full max-w-[390px] -translate-x-1/2 px-6 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-2 transition-all duration-300 ${
        isHidden
          ? 'pointer-events-none translate-y-14 opacity-0'
          : 'pointer-events-auto translate-y-0 opacity-100'
      }`}
      aria-hidden={isHidden}
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `glass-ripple relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl py-3 transition-all duration-300 ${
                    isActive
                      ? 'scale-[0.98] bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                      : 'scale-100 text-gray-500 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_70%)] transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <Icon
                      size={isActive ? 24 : 20}
                      strokeWidth={1.5}
                      className="relative mb-1 transition-transform duration-300"
                    />
                    <span
                      className={`relative text-[10px] transition-colors ${
                        isActive ? 'font-medium text-white' : 'text-gray-500'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
