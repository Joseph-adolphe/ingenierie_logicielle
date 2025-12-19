import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        name: '', // Nom de famille
        surname: '', // Prénom
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'client' as 'client' | 'prestataire',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        if (!formData.name || !formData.surname || !formData.email || !formData.phone || !formData.password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (Prénom, Nom, Email, Téléphone, Mot de passe)');
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setIsLoading(true);
        const result = await register(formData);
        setIsLoading(false);

        if (result.success) {
            router.replace('/');
        } else {
            Alert.alert('Erreur d\'inscription', result.message);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#1F2937" />
                        </TouchableOpacity>
                    </Link>
                    <Text style={styles.title}>Créer un compte</Text>
                    <Text style={styles.subtitle}>Rejoignez notre communauté de prestataires</Text>
                </View>

                {/* Formulaire */}
                <View style={styles.form}>
                    <View style={styles.roleSelection}>
                        <TouchableOpacity
                            style={[styles.roleButton, formData.role === 'client' && styles.roleButtonActive]}
                            onPress={() => updateField('role', 'client')}
                        >
                            <Ionicons name="person" size={20} color={formData.role === 'client' ? '#FFF' : '#6B7280'} />
                            <Text style={[styles.roleButtonText, formData.role === 'client' && styles.roleButtonTextActive]}>Client</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleButton, formData.role === 'prestataire' && styles.roleButtonActive]}
                            onPress={() => updateField('role', 'prestataire')}
                        >
                            <Ionicons name="briefcase" size={20} color={formData.role === 'prestataire' ? '#FFF' : '#6B7280'} />
                            <Text style={[styles.roleButtonText, formData.role === 'prestataire' && styles.roleButtonTextActive]}>Prestataire</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputContainer, styles.halfInput]}>
                            <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Prénom"
                                placeholderTextColor="#9CA3AF"
                                value={formData.surname}
                                onChangeText={(v) => updateField('surname', v)}
                            />
                        </View>
                        <View style={[styles.inputContainer, styles.halfInput]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom"
                                placeholderTextColor="#9CA3AF"
                                value={formData.name}
                                onChangeText={(v) => updateField('name', v)}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(v) => updateField('email', v)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Téléphone *"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(v) => updateField('phone', v)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            value={formData.password}
                            onChangeText={(v) => updateField('password', v)}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmer le mot de passe"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            value={formData.password_confirmation}
                            onChangeText={(v) => updateField('password_confirmation', v)}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.registerButton, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.registerButtonText}>S'inscrire</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginLink}>
                        <Text style={styles.loginLinkText}>Déjà un compte ? </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.loginLinkAction}>Se connecter</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7ED',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        marginBottom: 32,
        marginTop: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    form: {
        gap: 16,
    },
    roleSelection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    roleButtonActive: {
        backgroundColor: '#F97316',
        borderColor: '#F97316',
    },
    roleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    roleButtonTextActive: {
        color: '#FFF',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        height: 56,
    },
    halfInput: {
        flex: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    eyeIcon: {
        padding: 4,
    },
    registerButton: {
        backgroundColor: '#F97316',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginLinkText: {
        color: '#6B7280',
        fontSize: 14,
    },
    loginLinkAction: {
        color: '#F97316',
        fontSize: 14,
        fontWeight: '600',
    },
});
