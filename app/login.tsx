import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";

export default function LoginScreen() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const colors = useColors();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, router]);

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Wprowadź hasło");
      return;
    }
    setLoading(true);
    setError("");
    const success = await login(password);
    setLoading(false);
    if (!success) {
      setError("Nieprawidłowe hasło. Spróbuj ponownie.");
      setPassword("");
    }
    // On success, useEffect above will redirect to /(tabs)
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: "#1a3a6b" }]}>
            <Text style={styles.iconText}>💼</Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Kreator Wniosków</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Panel konsultanta — dostęp chroniony
          </Text>
        </View>

        {/* Login Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Zaloguj się</Text>
          <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
            Wprowadź hasło, aby uzyskać dostęp do aplikacji
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: colors.foreground }]}>Hasło</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: error ? colors.error : colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder="Wprowadź hasło..."
              placeholderTextColor={colors.muted}
              secureTextEntry
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError("");
              }}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {error ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            ) : null}
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: "#1a3a6b", opacity: loading ? 0.7 : pressed ? 0.85 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Zaloguj się</Text>
            )}
          </Pressable>
        </View>

        {/* Hint */}
        <View style={styles.hint}>
          <Text style={[styles.hintText, { color: colors.muted }]}>
            Domyślne hasło: <Text style={{ fontWeight: "700" }}>ngo2024</Text>
          </Text>
          <Text style={[styles.hintSmall, { color: colors.muted }]}>
            Zmień hasło po zalogowaniu w Ustawieniach
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconText: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  inputWrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 13,
    marginTop: 2,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  hint: {
    alignItems: "center",
    gap: 4,
  },
  hintText: {
    fontSize: 13,
  },
  hintSmall: {
    fontSize: 12,
  },
});
