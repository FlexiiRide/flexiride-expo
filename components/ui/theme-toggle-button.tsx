import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from '@/contexts/theme-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

export const ThemeToggleButton = () => {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#1D3D47' }, 'background');

  const isLight = colorScheme === 'light';
  const iconName = isLight ? 'moon' : 'sunny'; // Ionicons names

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      style={[styles.button, { backgroundColor }]}
    >
      <Ionicons name={iconName} size={24} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});
