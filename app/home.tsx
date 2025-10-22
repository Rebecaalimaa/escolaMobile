import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

type Turma = {
  id: number;
  nome: string;
};

export default function Home() {
  const { professorId, professorNome } = useLocalSearchParams<{ professorId: string; professorNome: string }>();
  const router = useRouter();
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    try {
      const res = await fetch(`http://localhost:3000/turma?professorId=${professorId}`);
      const data = await res.json();
      setTurmas(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => router.replace("/");

  const handleExcluirTurma = (id: number) => {
    Alert.alert(
      "Confirmação",
      "Deseja realmente excluir essa turma?",
      [
        { text: "Cancelar" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const res = await fetch(`http://localhost:3000/turma/${id}`, { method: "DELETE" });
              if (res.status === 400) {
                Alert.alert("Erro", "Você não pode excluir uma turma com atividades cadastradas.");
                return;
              }
              fetchTurmas();
            } catch (error) {
              console.log(error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {professorNome}</Text>
      <Button title="Cadastrar Turma" onPress={() => router.push({ pathname: "/cadastroTurma", params: { professorId } })} />
      <FlatList
        data={turmas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.turma}>
            <Text>{item.id} - {item.nome}</Text>
            <View style={styles.botoes}>
              <Button title="Visualizar" onPress={() => router.push({ pathname: "/atividadeTurma", params: { turmaId: item.id, turmaNome: item.nome, professorNome } })} />
              <Button title="Excluir" color="red" onPress={() => handleExcluirTurma(item.id)} />
            </View>
          </View>
        )}
      />
      <Button title="Sair" onPress={handleLogout} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  turma: { padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5 },
  botoes: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
});
