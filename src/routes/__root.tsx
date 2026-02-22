import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => {
    return (
      <div className="min-h-screen">
        <Outlet />
      </div>
    );
  },
});
