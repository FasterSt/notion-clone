import { initializeDatabase } from "@/database/myDbModule";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Inicializando base de datos...");
    const setup = async () => {
      try {
        await initializeDatabase();
        console.log("Base de datos inicializada correctamente");
        setIsLoadingDb(false);
      } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        setDbError(
          error instanceof Error ? error.message : "Error desconocido"
        );
        setIsLoadingDb(false);
      }
    };

    setup();
  }, []);

  // Mostrar pantalla de carga mientras se inicializa la DB y se cargan las fuentes
  if (!loaded || isLoadingDb) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Cargando aplicación...</Text>
      </View>
    );
  }

  // Mostrar error si ocurrió alguno durante la inicialización
  if (dbError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: "red", fontSize: 16, marginBottom: 10 }}>
          Error al inicializar la base de datos:
        </Text>
        <Text>{dbError}</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
