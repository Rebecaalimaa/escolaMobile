import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import Api from "./api";

export default function CadastroTurma() {
  const [nome, setNome] = useState("");

  async function handleSalvar() {
    if (!nome.trim()) {
      Alert.alert("Atenção", "Informe o nome da turma.");
      return;
    }

    const api = new Api();
    const uri = api.turma;

    try {
      // ⚙️ Aqui enviamos o professorId fixo (exemplo: 1)
      const res = await fetch(uri, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          professorId: 1, // 🔹 Ajuste conforme o ID real do professor logado
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Resposta inválida do servidor:", res.status, txt);
        Alert.alert("Erro", "Não foi possível cadastrar a turma. Tente novamente.");
        return;
      }

      const created = await res.json();
      console.log("✅ Turma criada:", created);

      Alert.alert("Sucesso", `Turma '${created.nome}' cadastrada com sucesso!`, [
        { text: "OK", onPress: () => router.replace("/home") },
      ]);
    } catch (error) {
      console.error("Erro ao cadastrar turma:", error);
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Turma</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Turma A - 2025"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSalvar} style={styles.button}>
        <Text style={styles.buttonText}>Salvar Turma</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
