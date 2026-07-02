import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          {user?.email ?? 'Not signed in'}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Button title="Sign out" variant="secondary" onPress={signOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
  },
  actions: {
    marginTop: Spacing.four,
  },
});
