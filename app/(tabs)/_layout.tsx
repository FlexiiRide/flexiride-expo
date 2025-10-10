import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/auth-context";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { View, Image } from "react-native";
import { ThemeToggleButton } from "../../components/ui/theme-toggle-button";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function TabLayout() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor,
        },
        headerTintColor: useThemeColor({}, "text"),
        tabBarActiveTintColor: useThemeColor({}, "tint"),
        tabBarInactiveTintColor: useThemeColor({}, "icon"),
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor, // this sets the header background dynamically
        },
        headerRight: () => {
          if (!user) {
            return (
              <Pressable
                onPress={() => router.push("/sign-in")}
                style={{ marginRight: 15 }}
              >
                <ThemedText type="link">Sign In</ThemedText>
              </Pressable>
            );
          }
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              {/* Theme Toggle Button */}
              <View style={{ marginRight: 12 }}>
                <ThemeToggleButton />
              </View>
              
              <TouchableOpacity
                onPress={() => {
                  signOut();
                  router.replace("/sign-in");
                }}
                style={{
                  marginRight: 15,
                  backgroundColor: "#08431dff",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                }}
              >
                <ThemedText
                  type="default"
                  style={{ color: "#fff", fontWeight: "600" }}
                >
                  Log Out
                </ThemedText>
              </TouchableOpacity>
            </View>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 28,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: focused ? 1.5 : 1,
                    borderColor: color,
                  }}
                />
              ) : (
                <Ionicons size={24} name="person" color={color} />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
