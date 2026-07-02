import { useLocalSearchParams } from 'expo-router';

import { MediaDetail } from '@/components/media-detail';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { books, getMediaById } from '@/data/mock';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getMediaById(id) ?? books[0];

  if (!item) {
    return (
      <Screen>
        <EmptyState icon="book-outline" title="Not found" description="This book could not be found." />
      </Screen>
    );
  }

  return <MediaDetail item={item} />;
}
