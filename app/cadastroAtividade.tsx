// app/cadastroAtividade.tsx
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Api from "./api";

export default function CadastroAtividade() {
  const { turmaId, turmaNome } = useLocalSearchParams<{
    turmaId: string;
    turmaNome: string;
  }>();

  const [descricao, setDescricao] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");

  async function handleSalvar() {
    if (!descricao.trim() || !dataEntrega.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      const api = new Api();
      const uri = api.atividade; // ex: http://10.87.202.159:3000/atividade

      // ✅ Monta corretamente o corpo no formato que o backend espera
      const body = {
        descricao: descricao.trim(),
        dataEntrega: new Date(dataEntrega).toISOString(), // formato ISO válido
        turmaId: Number(turmaId),
      };

      console.log("📦 Enviando dados:", body);

      const response = await axios.post(uri, body, {
        headers: { "Content-Type": "application/json" },
        timeout: 8000,
      });

      console.log("✅ Atividade criada com sucesso:", response.data);

      Alert.alert("Sucesso", "Atividade cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/atividadeTurma",
              params: { turmaId, turmaNome },
            }),
        },
      ]);
    } catch (error: any) {
      console.error("⚠️ Erro ao cadastrar atividade:", error);

      if (error.response) {
        Alert.alert(
          "Erro do servidor",
          `Status: ${error.response.status}\n${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        Alert.alert(
          "Erro de conexão",
          "Não foi possível conectar ao servidor. Verifique o IP no arquivo api.ts e se o backend está rodando."
        );
      } else {
        Alert.alert("Erro inesperado", error.message);
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Atividade</Text>
      <Text style={styles.subtitle}>Turma: {turmaNome}</Text>

      <Text style={styles.label}>Descrição da Atividade</Text>
      <TextInput
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Redação sobre meio ambiente"
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Text style={styles.label}>Data de Entrega</Text>
      <TextInput
        value={dataEntrega}
        onChangeText={setDataEntrega}
        placeholder="AAAA-MM-DD"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSalvar} style={styles.button}>
        <Text style={styles.buttonText}>Salvar Atividade</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() =>
          router.replace({
            pathname: "/atividadeTurma",
            params: { turmaId, turmaNome },
          })
        }
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
