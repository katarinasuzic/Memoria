import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setError(null);
    setMessage(null);
    setLoading(true);
    const { error: signUpError } = await signUp(email.trim(), password);
    setLoading(false);
    if (signUpError) {
      setError(signUpError);
      return;
    }
    setMessage('Check your inbox to confirm your email, then sign in.');
  }

  return (
    <Screen scroll style={styles.screen}>
      <View style={styles.header}>
        <ThemedText type="title">Create account</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Start building your Memoria library.
        </ThemedText>
      </View>

      <View style={styles.form}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Choose a password"
        />

        {error ? (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        ) : null}
        {message ? (
          <ThemedText type="small" style={styles.success}>
            {message}
          </ThemedText>
        ) : null}

        <Button title="Sign up" onPress={handleSignUp} loading={loading} />
      </View>

      <View style={styles.footer}>
        <ThemedText type="small" themeColor="textSecondary">
          Already have an account?
        </ThemedText>
        <Link href="/(auth)/sign-in">
          <ThemedText type="linkPrimary">Sign in</ThemedText>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    gap: Spacing.five,
  },
  header: {
    gap: Spacing.two,
  },
  form: {
    gap: Spacing.three,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  error: {
    color: '#e5484d',
  },
  success: {
    color: '#30a46c',
  },
});
