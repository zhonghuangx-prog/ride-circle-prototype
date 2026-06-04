import { Outlet, useLocation } from 'react-router-dom';
import { useRideSession } from '../context/RideSessionContext';
import BottomNav from './BottomNav';

export default function AppLayout() {
  const location = useLocation();
  const isMapRoute = location.pathname === '/map';
  const isRideRoute = location.pathname === '/ride';
  const isFullBleedRoute = isMapRoute || isRideRoute;
  const { rideState } = useRideSession();
  const isRideFocused = rideState !== 'idle';

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-gray-800">
      <AmbientBackdrop />

      <main
        className={`relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden ${
          isFullBleedRoute
            ? 'px-0 pb-0 pt-0'
            : `px-6 pt-6 ${isRideFocused ? 'pb-10' : 'pb-32'}`
        }`}
      >
        <div className="relative flex-1">
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function AmbientBackdrop() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_22%),linear-gradient(180deg,#040404_0%,#000000_58%,#050505_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] [background-size:48px_48px]" />
    </>
  );
}
