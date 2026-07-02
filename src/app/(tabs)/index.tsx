import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <ThemedText type="title">Home</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          {user?.email ? `Signed in as ${user.email}` : 'Welcome to Memoria'}
        </ThemedText>
      </View>

      <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
        Your reading and watching activity will appear here. Use the tabs below to browse your
        Books, Movies and TV Shows.
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
  },
  body: {
    marginTop: Spacing.two,
  },
});
