import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/auth-context';
import { ThemedText } from '@/components/themed-text';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        headerRight: () => {
          if (!user) {
            return (
              <Pressable onPress={() => router.push('/sign-in')} style={{ marginRight: 15 }}>
                <ThemedText type="link">Sign In</ThemedText>
              </Pressable>
            );
          }
          return null;
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
    </Tabs>
  );
}
