import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function ProviderLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#F97316',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarStyle: { backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 12, height: Platform.OS === 'ios' ? 88 : 68 },
            tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
            headerStyle: { backgroundColor: '#F97316' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: '600' },
        }}>
            <Tabs.Screen name="index" options={{ title: 'Dashboard', headerTitle: 'Tableau de bord', tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }} />
            <Tabs.Screen name="posts" options={{ title: 'Publications', headerTitle: 'Mes Publications', tabBarIcon: ({ color, size }) => <Ionicons name="images" size={size} color={color} /> }} />
            <Tabs.Screen name="messages" options={{ title: 'Messages', headerTitle: 'Messages', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} /> }} />
            <Tabs.Screen name="profile" options={{ title: 'Profil', headerTitle: 'Mon Profil', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
        </Tabs>
    );
}
