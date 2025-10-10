import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text"); // theme-aware text color

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Sign In",
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          <ThemeToggleButton />
        </View>
      ),
      headerStyle: {
        backgroundColor, // background adapts to theme
      },
      headerTintColor: textColor, // text and icon color adapts to theme
    });
  }, [navigation, backgroundColor, textColor]);

  const handleSignIn = () => {
    signIn(email, password);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={64}>
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText type="title" style={styles.title}>
          Welcome Back
        </ThemedText>
        <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>

        <View style={styles.formContainer}>
          <Input
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Sign In" onPress={handleSignIn} />
        </View>

        <View style={styles.footer}>
          <ThemedText>Don&apos;t have an account? </ThemedText>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <ThemedText type="link">Sign Up</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    gap: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
});
