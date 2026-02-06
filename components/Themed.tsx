/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { BlurView } from 'expo-blur';
import { Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'] & {
  variant?: 'serif' | 'sans';
  weight?: 'regular' | 'medium' | 'bold';
};
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, variant = 'sans', weight = 'regular', ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const fontFamily = variant === 'serif'
    ? (weight === 'bold' ? Typography.families.serifBold : Typography.families.serif)
    : (weight === 'bold' ? Typography.families.sansBold : (weight === 'medium' ? Typography.families.sansMedium : Typography.families.sans));

  return <DefaultText style={[{ color, fontFamily }, style]} {...otherProps} />;
}

export function SerifText(props: TextProps) {
  return <Text {...props} variant="serif" />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function GlassView(props: ViewProps & { intensity?: number }) {
  const { style, lightColor, darkColor, intensity = 40, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'glass');
  const borderColor = "rgba(255, 255, 255, 0.08)"; // Universal subtle border

  return (
    <BlurView
      intensity={intensity}
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: 24,
          overflow: 'hidden'
        },
        style
      ]}
      {...otherProps}
    />
  );
}

export function Card(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const glow = useThemeColor({ light: lightColor, dark: darkColor }, 'glow');

  return (
    <GlassView
      style={[
        {
          shadowColor: glow,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
          elevation: 6,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        },
        style
      ]}
      {...otherProps}
    />
  );
}

