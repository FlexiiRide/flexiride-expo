import { View, ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...rest
}: ViewProps & { lightColor?: string; darkColor?: string }) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[lightColor || darkColor ? { backgroundColor } : null, style]} {...rest} />;
}
