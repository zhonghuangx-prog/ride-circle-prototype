import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { RideSessionProvider } from './context/RideSessionContext';
import MapPage from './pages/MapPage';
import Record from './pages/Record';
import RideDashboard from './pages/RideDashboard';

export default function App() {
  return (
    <RideSessionProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/ride" replace />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/ride" element={<RideDashboard />} />
          <Route path="/record" element={<Record />} />
        </Route>
      </Routes>
    </RideSessionProvider>
  );
}
