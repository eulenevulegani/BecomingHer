import { Redirect, Tabs } from 'expo-router';
import { Calendar, List, Sparkles } from 'lucide-react-native';
import React from 'react';

import { View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useUser } from '@/context/UserContext';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const { state, isLoading } = useUser();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: Colors.brand.background }} />;
  }

  if (!state.hasCompletedOnboarding) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].primary,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          borderTopColor: 'rgba(255,255,255,0.05)',
          backgroundColor: Colors.brand.background,
          paddingTop: 12,
          height: 84,
          paddingBottom: 28,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 10,
          textTransform: 'lowercase',
          letterSpacing: 1,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="today"
        options={{
          title: 'today',
          tabBarIcon: ({ color }) => <Calendar size={20} color={color} />,
        }}
      />

      <Tabs.Screen
        name="planner"
        options={{
          title: 'plan',
          tabBarIcon: ({ color }) => <List size={20} color={color} />,
        }}
      />

      <Tabs.Screen
        name="me"
        options={{
          title: 'me',
          tabBarIcon: ({ color }) => <Sparkles size={20} color={color} />,
        }}
      />

      {/* Hidden tabs - kept for navigation but not shown in tab bar */}
      <Tabs.Screen
        name="community"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="week"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
