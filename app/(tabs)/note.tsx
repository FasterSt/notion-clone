import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  createNotionFile,
  deleteNotionFile,
  getNotionFiles,
  NotionFile,
} from "@/database/models/notes";
import { Button } from "react-native";

const createNewNote = async () => {
  const notionFile: NotionFile = {
    author: {
      id: 1, // Assuming a default author ID
      name: "Default Author", // Placeholder for author name
      email: "s",
      password: "s", // Placeholder for author password
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    panrentFile: null,
    subFiles: [],
    coverPhoto: "",
    icon: "",
    title: "New Note",
    description: "This is a new note.",
    content:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "note",
    authorId: 1, // Assuming a default author ID
    parentFileId: null,
    file_order: 0,
  };
  await createNotionFile(notionFile);
  // Placeholder function to simulate note creation
  console.log("New note created!");
  // Here you would typically call a function to save the note to your database or state
};

const showNotes = async () => {
  // Placeholder function to simulate showing notes
  console.log("Showing notes...");
  const notes = await getNotionFiles();
  console.log("Notes:", notes);
  // Here you would typically fetch and display the notes from your database or state
};

const deleteNotes = async () => {
  // Placeholder function to simulate deleting notes
  console.log("Deleting notes...");
  await deleteNotionFile(1);
  // Here you would typically call a function to delete the notes from your database or state
};

export default function NoteTab() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <ThemedText type="title">Note Tab</ThemedText>
      <ThemedText type="default">
        This is the Note tab. You can add your notes here.
      </ThemedText>
      <ThemedView
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          padding: 20,
          gap: 10,
          borderRadius: 10,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Button title="Add Note" onPress={createNewNote} />
        <Button title="Show Notes" onPress={showNotes} />
        <Button title="Delete Notes" onPress={deleteNotes} />
      </ThemedView>
    </ThemedView>
  );
}
