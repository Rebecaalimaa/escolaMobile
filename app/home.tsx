import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import Api from "./api";
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from "react-native";

interface Turma {
  nome: string;
  id?: number;
}

export default function Home() {
  const [turmas, setTurmas] = useState<Turma[]>([]);

  function voltarParaLogin() {
    router.replace("/");
  }

  useEffect(() => {
    carregarTurmas();
  }, []);

  function carregarTurmas() {
    const api = new Api();
    const uri = api.turma;

    fetch(uri, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Turmas carregadas:", data);
        setTurmas(data);
      })
      .catch((error) => {
        console.error("Erro ao carregar turmas:", error);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Bem-vindo!</Text>
      <Text style={styles.subtitle}>Suas turmas:</Text>

      {turmas.length > 0 ? (
        <FlatList
          data={turmas}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.turmaNome}>📘 {item.nome || "Turma sem nome"}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.loading}>Carregando turmas...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={voltarParaLogin}>
        <Text style={styles.buttonText}>Sair / Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#dce4f7",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff22",
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
    width: 300,
  },
  turmaNome: {
    color: "#fff",
    fontSize: 16,
  },
  loading: {
    color: "#dce4f7",
    fontStyle: "italic",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "#003366",
    fontWeight: "bold",
    fontSize: 16,
  },
});
