import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";
import { ThemedText } from "../themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type CustomInputProps = TextInputProps & {
  label?: string;
  icon?: React.ReactNode;
};

export function Input({ label, icon, ...props }: CustomInputProps) {
  const inputBackground = useThemeColor(
    { light: "#f0f0f0", dark: "#343c3fff" }, // custom dark color
    "background"
  );

  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View
        style={[styles.inputContainer, { backgroundColor: inputBackground }]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput style={styles.input} {...props} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
});
