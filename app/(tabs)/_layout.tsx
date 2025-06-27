import { Tabs } from "expo-router";
import React from "react";
import {
  Button,
  DrawerLayoutAndroid,
  Platform,
  Text,
  View,
} from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const drawerRef = React.useRef<DrawerLayoutAndroid>(null);

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Hello!!</Text>
          <Button
            title="Open Drawer"
            onPress={() => {
              // Open the drawer when the button is pressed
              drawerRef.current?.closeDrawer();
            }}
          />
        </View>
      )}
      drawerBackgroundColor={Colors[colorScheme ?? "light"].background}
      statusBarBackgroundColor={Colors[colorScheme ?? "light"].background}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Test",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
            headerShown: true,
            headerBackgroundContainerStyle: {
              borderWidth: 1,
              borderColor: "red",
            },
            header: () => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: Colors[colorScheme ?? "light"].background,
                  height: 50,
                  padding: 10,
                }}
              >
                <Button
                  title="Open Drawer"
                  onPress={() => {
                    // Open the drawer when the button is pressed
                    drawerRef.current?.openDrawer();
                  }}
                />
                <Text style={{ color: "white" }}>Header</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="note"
          options={{
            title: "Notes",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="note.text" color={color} />
            ),
          }}
        />
      </Tabs>
    </DrawerLayoutAndroid>
  );
}
// Delete tabs in function that are not needed
