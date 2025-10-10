import React, { useState } from "react";
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
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match");
      return;
    }
    signUp({
      name,
      email,
      password, // Using password as passwordHash for mock auth
      role: "client",
      phone: "+94123456789", // Dummy phone number
      avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={64}
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText type="title" style={styles.title}>
          Create Account
        </ThemedText>
        <ThemedText style={styles.subtitle}>Sign up to get started</ThemedText>

        <View style={styles.formContainer}>
          <Input placeholder="Full Name" value={name} onChangeText={setName} />
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
          <Input
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button title="Sign Up" onPress={handleSignUp} />
        </View>

        <View style={styles.footer}>
          <ThemedText>Already have an account? </ThemedText>
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <ThemedText type="link">Sign In</ThemedText>
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
