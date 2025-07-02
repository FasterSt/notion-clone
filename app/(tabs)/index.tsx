import DraggableNotionList from "@/components/DraggableNotionList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  createNotionFile,
  getNotionFiles,
  NotionFile,
} from "@/database/models/notes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const handleTouch = async () => {
    const notionFile: NotionFile = {
      author: {
        id: 1,
        name: "John Doe",
        email: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      authorId: 1,
      coverPhoto: "",
      content: "This is a example content for the Notion file.",
      description:
        "That is a sample description for the Notion file, with a lorem ipsum text.",
      file_order: 0,
      icon: "📲",
      panrentFile: null,
      parentFileId: null,
      subFiles: [],
      title: "Sample Notion File 2📄",
      type: "document",
    };
    await createNotionFile(notionFile);
    const notions = await getNotionFiles();
    console.log("Notion files:", notions);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ThemedText type="title">Hello World!!</ThemedText>
          <DraggableNotionList />
        </SafeAreaView>
      </ThemedView>
    </GestureHandlerRootView>
  );
}
