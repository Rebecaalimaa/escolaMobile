import React from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import Api from "./api";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const api = new Api();
      const response = await fetch(api.login , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (response.ok && data.id) {
        console.log("Vai navegar para /home");
        router.replace("/home");
        console.log("Depois do replace");
      } else {
        Alert.alert("Erro", data.message || "Credenciais inválidas.");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo 👋</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#003366" },
  card: { backgroundColor: "#fff", width: "85%", borderRadius: 16, padding: 40, elevation: 5 },
  title: { fontSize: 26, fontWeight: "700", color: "#003366", textAlign: "center", marginBottom: 20 },
  input: { height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 15, marginBottom: 20 },
  button: { backgroundColor: "#003366", paddingVertical: 14, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center" },
});
