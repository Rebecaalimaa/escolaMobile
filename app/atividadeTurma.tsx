import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

interface Activity {
  id: number;
  descricao: string;
}

const AtividadesTurma = () => {
  const router = useRouter();
  const { turmaId, turmaNome } = useLocalSearchParams();

  const [professorName] = useState("Professor Exemplo");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ⚡ Define seu backend local
  const API_BASE_URL = "http://192.168.0.105:3000"; // <-- coloque aqui o IP do seu PC e a porta da API

  useEffect(() => {
    if (turmaId) fetchActivities();
  }, [turmaId]);

const fetchActivities = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_BASE_URL}/atividade/turma/${turmaId}`);
    console.log("Atividades recebidas:", response.data); // Adicione isso para depurar a resposta da API
    setActivities(response.data);
  } catch (error) {
    console.error("Erro ao carregar atividades:", error);
    Alert.alert("Erro", "Não foi possível carregar as atividades da turma.");
  } finally {
    setLoading(false);
  }
};


  const handleLogout = () => {
    Alert.alert("Sair", "Você foi desconectado do sistema.", [
      { text: "OK", onPress: () => router.replace("/") },
    ]);
  };

  const handleCadastrarAtividade = () => {
    router.push({
      pathname: "/cadastroAtividade",
      params: { turmaId, turmaNome },
    });
  };

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityText}>📘 {item.descricao}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Atividades da Turma ${turmaNome}` }} />
      <Text style={styles.headerText}>Olá, {professorName}!</Text>
      <Text style={styles.turmaTitle}>Turma: {turmaNome}</Text>

      <TouchableOpacity style={styles.button} onPress={handleCadastrarAtividade}>
        <Text style={styles.buttonText}>Cadastrar Atividade</Text>
      </TouchableOpacity>

      <Text style={styles.listTitle}>Atividades:</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : activities.length > 0 ? (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivityItem}
          style={styles.activityList}
        />
      ) : (
        <Text style={styles.emptyText}>Nenhuma atividade cadastrada.</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair do Sistema</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AtividadesTurma;

// 🎨 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  headerText: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  turmaTitle: { fontSize: 18, fontWeight: "600", marginBottom: 20, textAlign: "center", color: "#555" },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  listTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  activityList: { flex: 1, width: "100%" },
  activityItem: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  activityText: { fontSize: 16, color: "#333" },
  emptyText: { textAlign: "center", color: "#777", fontStyle: "italic", marginTop: 20 },
  logoutButton: { backgroundColor: "#dc3545", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },
});
