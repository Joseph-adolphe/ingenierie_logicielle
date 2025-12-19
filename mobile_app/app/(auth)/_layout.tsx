import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FFF7ED' },
                animation: 'slide_from_right',
            }}
        />
    );
}
