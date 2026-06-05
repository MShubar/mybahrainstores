import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";

export default function LoginScreen() {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onLogin() {
    try {
      await signIn("password", {
        email,
        password,
        flow: "signIn",
      });

      router.replace("/customer");
    } catch (error) {
      Alert.alert(
        "Login failed",
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <Pressable
        onPress={onLogin}
        style={{ backgroundColor: "black", padding: 14, borderRadius: 8 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/signup")}>
        <Text style={{ textAlign: "center" }}>Create account</Text>
      </Pressable>
    </View>
  );
}