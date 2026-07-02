import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextType =
  | 'default'
  | 'title'
  | 'heading'
  | 'subtitle'
  | 'sectionTitle'
  | 'small'
  | 'smallBold'
  | 'label'
  | 'link'
  | 'linkPrimary';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  const color = themeColor
    ? theme[themeColor]
    : type === 'linkPrimary'
      ? theme.primary
      : theme.text;

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    fontFamily: Fonts.headingBold,
    fontSize: 30,
    lineHeight: 38,
  },
  heading: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    lineHeight: 28,
  },
  sectionTitle: {
    fontFamily: Fonts.heading,
    fontSize: 17,
    lineHeight: 24,
  },
  small: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  smallBold: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  linkPrimary: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
});
