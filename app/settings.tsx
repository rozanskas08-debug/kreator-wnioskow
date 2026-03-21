import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const { logout, changePassword } = useAuth();
  const router = useRouter();
  const colors = useColors();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Wyloguj się",
      "Czy na pewno chcesz się wylogować?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Wyloguj",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const handleChangePassword = async () => {
    setPasswordMsg(null);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ text: "Wypełnij wszystkie pola", success: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Nowe hasła nie są identyczne", success: false });
      return;
    }
    if (newPassword.length < 4) {
      setPasswordMsg({ text: "Hasło musi mieć co najmniej 4 znaki", success: false });
      return;
    }
    setChangingPassword(true);
    const success = await changePassword(oldPassword, newPassword);
    setChangingPassword(false);
    if (success) {
      setPasswordMsg({ text: "Hasło zostało zmienione pomyślnie!", success: true });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMsg({ text: "Stare hasło jest nieprawidłowe", success: false });
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.backText, { color: "#1a3a6b" }]}>← Wróć</Text>
            </Pressable>
            <Text style={[styles.title, { color: colors.foreground }]}>Ustawienia</Text>
          </View>

          {/* Change Password Card */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>🔐 Zmień hasło</Text>
            <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
              Domyślne hasło to: <Text style={{ fontWeight: "700" }}>ngo2024</Text>
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Obecne hasło</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Obecne hasło"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Nowe hasło</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Nowe hasło (min. 4 znaki)"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Potwierdź nowe hasło</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Powtórz nowe hasło"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleChangePassword}
              />
            </View>

            {passwordMsg && (
              <Text style={[styles.msg, { color: passwordMsg.success ? colors.success : colors.error }]}>
                {passwordMsg.text}
              </Text>
            )}

            <Pressable
              onPress={handleChangePassword}
              disabled={changingPassword}
              style={({ pressed }) => [
                styles.btn,
                { backgroundColor: "#1a3a6b", opacity: changingPassword ? 0.7 : pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={styles.btnText}>Zmień hasło</Text>
            </Pressable>
          </View>

          {/* App Info Card */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>ℹ️ O aplikacji</Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Wersja</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Typ dostępu</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>Konsultant (1 użytkownik)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Dane</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>Zapisywane lokalnie</Text>
            </View>
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutBtn,
              { borderColor: colors.error, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.logoutText, { color: colors.error }]}>🚪 Wyloguj się</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  backText: {
    fontSize: 15,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  fieldGroup: {
    gap: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
  },
  msg: {
    fontSize: 13,
    fontWeight: "500",
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
