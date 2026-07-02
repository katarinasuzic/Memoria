import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';

export default function BooksScreen() {
  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <EmptyState
        icon="book-outline"
        title="No books yet"
        description="Books you track will show up here."
      />
    </Screen>
  );
}
