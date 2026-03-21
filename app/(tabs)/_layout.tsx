import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { AuthGuard } from "@/components/auth-guard";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1E3A5F",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingTop: 8,
            paddingBottom: bottomPadding,
            height: tabBarHeight,
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "500",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Projekty",
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="new-project"
          options={{
            title: "Nowy",
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="doc.badge.plus" color={color} />,
          }}
        />
        <Tabs.Screen
          name="checklist"
          options={{
            title: "Checklista",
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="checkmark.rectangle.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="funding"
          options={{
            title: "Dotacje",
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="banknote.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="matrix"
          options={{
            title: "Matryca",
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="chart.bar.fill" color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
