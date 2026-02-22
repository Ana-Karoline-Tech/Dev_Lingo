import { createRootRoute, Outlet } from '@tanstack/react-router';
import LoadingScreen from '@/components/ui/LoadingScreen';

export const Route = createRootRoute({
  component: () => {
    return (
      <div className="min-h-screen">
        <LoadingScreen />
        <Outlet />
      </div>
    );
  },
});
