import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CadastroTurma() {
  const { professorId } = useLocalSearchParams<{ professorId: string }>();
  const [nome, setNome] = useState("");
  const router = useRouter();

  const handleCadastrar = async () => {
    if (!nome) {
      Alert.alert("Erro", "Informe o nome da turma");
      return;
    }

    try {
      await fetch("http://localhost:3000/turma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, professorId: Number(professorId) }),
      });
      Alert.alert("Sucesso", "Turma cadastrada com sucesso!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível cadastrar a turma");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Turma</Text>
      <TextInput placeholder="Nome da Turma" value={nome} onChangeText={setNome} style={styles.input} />
      <Button title="Cadastrar" onPress={handleCadastrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
