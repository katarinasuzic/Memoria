import { Image, type ImageStyle } from 'expo-image';
import { Pressable, View, type StyleProp } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type PosterProps = {
  uri: string;
  width?: number;
  aspectRatio?: number;
  radius?: number;
  onPress?: () => void;
  style?: StyleProp<ImageStyle>;
};

export function Poster({
  uri,
  width = 110,
  aspectRatio = 2 / 3,
  radius = Radius.md,
  onPress,
  style,
}: PosterProps) {
  const theme = useTheme();

  const image = (
    <Image
      source={{ uri }}
      style={[
        { width, aspectRatio, borderRadius: radius, backgroundColor: theme.backgroundElement },
        style,
      ]}
      contentFit="cover"
      transition={200}
    />
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
        {image}
      </Pressable>
    );
  }

  return <View>{image}</View>;
}
