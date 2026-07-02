import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';

export default function MoviesScreen() {
  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <EmptyState
        icon="film-outline"
        title="No movies yet"
        description="Movies you track will show up here."
      />
    </Screen>
  );
}
