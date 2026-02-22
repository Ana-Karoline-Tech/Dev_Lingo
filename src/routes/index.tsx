import { createFileRoute } from '@tanstack/react-router';
import LoadingScreen from '@/components/ui/LoadingScreen';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="min-h-screen bg-[#8b21cf]">
      <LoadingScreen />
    </div>
  );
}

