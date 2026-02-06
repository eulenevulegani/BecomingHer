import { Redirect, Tabs } from 'expo-router';
import { Compass, Moon, Sparkles } from 'lucide-react-native';
import React from 'react';

import { View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useUser } from '@/context/UserContext';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const { state, isLoading } = useUser();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: Colors.cosmic.deepSpace }} />;
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
          backgroundColor: Colors.cosmic.deepSpace,
          paddingTop: 12,
          height: 84,
          paddingBottom: 28,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 9,
          textTransform: 'lowercase',
          letterSpacing: 2,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="today"
        options={{
          title: 'today',
          tabBarIcon: ({ color }) => <Sparkles size={20} color={color} />,
        }}
      />

      <Tabs.Screen
        name="journey"
        options={{
          title: 'stars',
          tabBarIcon: ({ color }) => <Compass size={20} color={color} />,
        }}
      />

      <Tabs.Screen
        name="becoming"
        options={{
          title: 'universe',
          tabBarIcon: ({ color }) => <Moon size={20} color={color} />,
        }}
      />

      {/* Hidden tabs - keep files but hide from nav */}
      <Tabs.Screen
        name="week"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
