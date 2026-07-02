import { useLocalSearchParams } from 'expo-router';

import { MediaDetail } from '@/components/media-detail';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { getMediaById, movies } from '@/data/mock';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getMediaById(id) ?? movies[0];

  if (!item) {
    return (
      <Screen>
        <EmptyState icon="film-outline" title="Not found" description="This movie could not be found." />
      </Screen>
    );
  }

  return <MediaDetail item={item} />;
}
