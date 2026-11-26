import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { DiatinfColors } from '@/constants/diatinf-theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: DiatinfColors.steel,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconPill, focused && styles.iconPillActive]}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={20}
                color={focused ? '#FFFFFF' : DiatinfColors.steel}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Global Feed',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconPill, focused && styles.iconPillActive]}>
              <Ionicons
                name={focused ? 'globe' : 'globe-outline'}
                size={20}
                color={focused ? '#FFFFFF' : DiatinfColors.steel}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="my-posts"
        options={{
          title: 'Meus Posts',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconPill, focused && styles.iconPillActive]}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={20}
                color={focused ? '#FFFFFF' : DiatinfColors.steel}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Social Stats',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconPill, focused && styles.iconPillActive]}>
              <Ionicons
                name={focused ? 'people' : 'people-outline'}
                size={20}
                color={focused ? '#FFFFFF' : DiatinfColors.steel}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: DiatinfColors.navy,
    borderTopWidth: 2,
    borderTopColor: DiatinfColors.orange,
    height: 64,
    paddingBottom: 6,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabItem: {
    borderRadius: 10,
  },
  iconPill: {
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 10,
  },
  iconPillActive: {
    backgroundColor: DiatinfColors.orange,
  },
});
