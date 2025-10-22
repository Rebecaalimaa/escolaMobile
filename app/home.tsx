// app/home.tsx  (ou o seu Home.tsx)
import { Stack, router } from "expo-router";
import React, { useCallback, useState } from "react";
import Api from "./api";
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

interface Turma {
  id: string;
  nome: string;
}

export default function Home() {
  const [professorName] = useState("Professor Exemplo");
  const [turmas, setTurmas] = useState<Turma[]>([]);

  // Carrega turmas sempre que a tela ganha foco (inclui quando volta de cadastro)
  useFocusEffect(
    useCallback(() => {
      carregarTurmas();
    }, [])
  );

  async function carregarTurmas() {
    const api = new Api();
    const uri = api.turma;

    try {
      const res = await fetch(uri, { method: "GET", headers: { "Content-Type": "application/json" }});
      if (!res.ok) {
        console.error("GET turmas erro:", res.status);
        Alert.alert("Erro", "Falha ao carregar turmas do servidor.");
        return;
      }
      const data = await res.json();
      setTurmas(data);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  }

  function handleCadastroTurma() {
    router.push("/cadastroTurma");
  }

  function handleVisualizarTurma(turmaId: string, turmaNome: string) {
    router.push({ pathname: "/atividadeTurma", params: { turmaId, turmaNome } });
  }

  async function handleExcluirTurma(turmaId: string, turmaNome: string) {
    Alert.alert(
      "Confirmar Exclusão",
      `Excluir a turma '${turmaNome}'?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const api = new Api();
              const uri = `${api.turma}/${turmaId}`;
              const res = await fetch(uri, { method: "DELETE" });
              if (res.ok) {
                setTurmas((prev) => prev.filter((t) => t.id !== turmaId));
                Alert.alert("Sucesso", "Turma excluída.");
              } else {
                Alert.alert("Erro", "Não foi possível excluir a turma.");
              }
            } catch (err) {
              console.error("Erro excluir:", err);
              Alert.alert("Erro", "Falha ao excluir turma.");
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Tela Principal do Professor" }} />
      <Text style={styles.welcomeText}>Olá, {professorName}!</Text>

      <TouchableOpacity style={styles.button} onPress={handleCadastroTurma}>
        <Text style={styles.buttonText}>Cadastrar Turma</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Suas turmas:</Text>

      {turmas.length > 0 ? (
        <FlatList
          data={turmas}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.turmaNome}>📘 {item.nome}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={[styles.actionButton, styles.viewButton]} onPress={() => handleVisualizarTurma(item.id, item.nome)}>
                  <Text style={styles.actionButtonText}>Visualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleExcluirTurma(item.id, item.nome)}>
                  <Text style={styles.actionButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
        />
      ) : (
        <Text style={styles.loading}>Nenhuma turma cadastrada.</Text>
      )}
    </View>
  );
}

// (estilos omitidos para brevidade — reutilize os seus)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", alignItems: "center", padding: 20 },
  welcomeText: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  button: { backgroundColor: "#007bff", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  subtitle: { fontSize: 18, fontWeight: "600", color: "#555", marginBottom: 15 },
  flatList: { width: "100%" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 15, marginVertical: 8, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  turmaNome: { color: "#333", fontSize: 16, fontWeight: "500", flex: 1 },
  actionsContainer: { flexDirection: "row" },
  actionButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, marginLeft: 10 },
  viewButton: { backgroundColor: "#28a745" },
  deleteButton: { backgroundColor: "#dc3545" },
  actionButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  loading: { color: "#888", fontStyle: "italic", marginTop: 20 },
});
