import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ title: "Tela de Login" }} />
    <Stack.Screen name="home" options={{ title: "Home" }} />
    <Stack.Screen name="cadastroTurma" options={{ title: "Cadastro de Turma" }} />
    <Stack.Screen name="atividadesTurma" options={{ title: "Atividades da Turma" }} />
    <Stack.Screen name="cadastroAtividade" options={{ title: "Cadastro de Atividade" }} />
  </Stack>;
}
