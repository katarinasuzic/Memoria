import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MediaDetail } from '@/components/media-detail';
import { EmptyState } from '@/components/ui/empty-state';
import { Radius, Spacing } from '@/constants/theme';
import { useLibraryItem } from '@/hooks/use-library';
import { useTheme } from '@/hooks/use-theme';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: item, isLoading } = useLibraryItem(id);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ paddingTop: insets.top + Spacing.two, paddingHorizontal: Spacing.four }}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </Pressable>
        </View>
        <EmptyState
          icon="alert-circle-outline"
          title="Not found"
          description="This item is no longer in your library."
        />
      </View>
    );
  }

  return <MediaDetail item={item} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
