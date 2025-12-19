import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function UserLayout() {
    const { user } = useAuth();
    const isProvider = user?.role === 'prestataire';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#F97316',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
                    height: Platform.OS === 'ios' ? 88 : 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: Platform.OS === 'ios' ? 0 : 4,
                },
                headerStyle: {
                    backgroundColor: '#F97316',
                },
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Accueil',
                    headerTitle: 'ProServices',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explorer"
                options={{
                    title: 'Explorer',
                    headerTitle: 'Rechercher',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    headerTitle: 'Messages',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    headerTitle: 'Mon Profil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="become-provider"
                options={{
                    title: 'Devenir',
                    headerTitle: 'Devenir Prestataire',
                    href: isProvider ? null : '/become-provider',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="briefcase" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
