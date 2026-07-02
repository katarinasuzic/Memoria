import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';

export default function ShowsScreen() {
  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <EmptyState
        icon="tv-outline"
        title="No TV shows yet"
        description="TV shows you track will show up here."
      />
    </Screen>
  );
}
