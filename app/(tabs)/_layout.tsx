import { Redirect, Tabs } from 'expo-router';
import { Leaf, Repeat, Sparkles, Stars } from 'lucide-react-native';
import React from 'react';

import { View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useUser } from '@/context/UserContext';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const { state, isLoading } = useUser();

  if (isLoading) {
    return <View style={{ flex: 1 }} />;
  }

  if (!state.hasCompletedOnboarding) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          borderTopColor: Colors[colorScheme].border,
          backgroundColor: Colors[colorScheme].background,
          paddingTop: 8,
          height: 84,
          paddingBottom: 32,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 9,
          textTransform: 'lowercase',
          letterSpacing: 1,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="today"
        options={{
          title: 'ritual',
          tabBarIcon: ({ color }) => <Sparkles size={20} color={color} />,
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: 'garden',
          tabBarIcon: ({ color }) => <Leaf size={20} color={color} />,
        }}
      />

      <Tabs.Screen
        name="week"
        options={{
          title: 'rhythm',
          tabBarIcon: ({ color }) => <Repeat size={20} color={color} />,
        }}
      />

      <Tabs.Screen
        name="becoming"
        options={{
          title: 'becoming',
          tabBarIcon: ({ color }) => <Stars size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
