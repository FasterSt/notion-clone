import { NotionFileDb } from "@/database/models/notes";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import DraggableFlatlist, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { ThemedText } from "./ThemedText";

function renderItem({ item, drag, isActive }: RenderItemParams<NotionFileDb>) {
  return (
    <ScaleDecorator>
      <TouchableOpacity
        onPress={drag}
        disabled={isActive}
        style={[
          {
            height: 100,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isActive ? "#f0f0f0" : "#fff",
            borderColor: isActive ? "#000" : "#ccc",
            borderWidth: 1,
            borderRadius: 8,
          },
        ]}
      >
        <ThemedText
          type="title"
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: isActive ? "#000" : "#333",
          }}
        >
          {item.title}
        </ThemedText>
        <ThemedText
          type="subtitle"
          style={{ color: isActive ? "#000" : "#333" }}
        >
          {item.content}
        </ThemedText>
      </TouchableOpacity>
    </ScaleDecorator>
  );
}

export default function DraggableNotionList() {
  const [notionsFiles, setNotionsFiles] = useState<NotionFileDb[]>([]);
  useEffect(() => {
    const fetchNotionFiles = async () => {
      const { getNotionFiles } = await import("@/database/models/notes");
      const notions = await getNotionFiles();
      setNotionsFiles(notions);
    };
    fetchNotionFiles();
  }, []);

  return (
    <DraggableFlatlist
      data={notionsFiles}
      containerStyle={{ flex: 1 }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      onDragEnd={({ data }) => {}}
    />
  );
}
