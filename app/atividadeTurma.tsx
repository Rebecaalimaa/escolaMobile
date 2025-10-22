import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

type Atividade = {
  id: number;
  descricao: string;
};

export default function AtividadesTurma() {
  const { turmaId, turmaNome, professorNome } = useLocalSearchParams<{ turmaId: string; turmaNome: string; professorNome: string }>();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchAtividades();
  }, []);

  const fetchAtividades = async () => {
    try {
      const res = await fetch(`http://localhost:3000/atividade/turma/${turmaId}`);
      const data = await res.json();
      setAtividades(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{turmaNome} - Professor: {professorNome}</Text>
      <Button title="Cadastrar Atividade" onPress={() => router.push({ pathname: "/cadastroAtividade", params: { turmaId, turmaNome } })} />
      <FlatList
        data={atividades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.atividade}>
            <Text>#{item.id} - {item.descricao}</Text>
          </View>
        )}
      />
      <Button title="Sair" color="gray" onPress={() => router.replace("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  atividade: { padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5 },
});
