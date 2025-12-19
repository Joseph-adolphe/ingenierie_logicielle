import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated && user) {
                // Rediriger selon le rôle
                if (user.role === 'prestataire') {
                    router.replace('/(provider)');
                } else {
                    router.replace('/(user)');
                }
            } else {
                router.replace('/(auth)/login');
            }
        }
    }, [isLoading, isAuthenticated, user]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#F97316" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
    },
});
