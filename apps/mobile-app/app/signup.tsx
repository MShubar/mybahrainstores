import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";

type Role = "customer" | "store";

export default function SignupScreen() {
  const { signIn } = useAuthActions();

  const createProfile = useMutation(
    api.users.mutations.createCurrentUserProfile
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSignup() {
    try {
      await signIn("password", {
        email,
        password,
        flow: "signUp",
      });

      await createProfile({
        name,
        email,
        phone: phone || undefined,
        role,
      });

      router.replace(role === "store" ? "/store" : "/customer");
    } catch (error) {
      Alert.alert(
        "Signup failed",
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Create account</Text>

      <TextInput
        placeholder="Full name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={() => setRole("customer")}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: role === "customer" ? "black" : "#eee",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: role === "customer" ? "white" : "black",
            }}
          >
            Customer
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setRole("store")}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: role === "store" ? "black" : "#eee",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: role === "store" ? "white" : "black",
            }}
          >
            Store
          </Text>
        </Pressable>
      </View>

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
        onPress={onSignup}
        style={{ backgroundColor: "black", padding: 14, borderRadius: 8 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/login")}>
        <Text style={{ textAlign: "center" }}>Already have an account?</Text>
      </Pressable>
    </View>
  );
}