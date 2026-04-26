import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <div className="min-h-screen bg-[#8B00FF]">
      {showLoader && (
        <LoadingScreen onFinished={() => setShowLoader(false)} />
      )}
      <Outlet />
    </div>
  );
}
