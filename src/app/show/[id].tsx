import { useLocalSearchParams } from 'expo-router';

import { MediaDetail } from '@/components/media-detail';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { getMediaById, shows } from '@/data/mock';

export default function ShowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getMediaById(id) ?? shows[0];

  if (!item) {
    return (
      <Screen>
        <EmptyState icon="tv-outline" title="Not found" description="This show could not be found." />
      </Screen>
    );
  }

  return <MediaDetail item={item} />;
}
