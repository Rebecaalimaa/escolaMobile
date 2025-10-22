import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CadastroAtividade() {
  const { turmaId, turmaNome } = useLocalSearchParams<{ turmaId: string; turmaNome: string }>();
  const [descricao, setDescricao] = useState("");
  const router = useRouter();

  const handleCadastrar = async () => {
    if (!descricao) {
      Alert.alert("Erro", "Informe a descrição da atividade");
      return;
    }

    try {
      await fetch("http://localhost:3000/atividade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descricao, turmaId: Number(turmaId) }),
      });
      Alert.alert("Sucesso", "Atividade cadastrada!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível cadastrar a atividade");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Atividade - {turmaNome}</Text>
      <TextInput placeholder="Descrição da Atividade" value={descricao} onChangeText={setDescricao} style={styles.input} />
      <Button title="Cadastrar" onPress={handleCadastrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
