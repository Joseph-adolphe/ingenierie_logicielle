import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { getToken as getStorageToken, setToken as setStorageToken, removeToken as removeStorageToken } from '../services/api';
import { User, AuthResponse } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    name: string;
    surname: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'client' | 'prestataire';
    phone: string;
    country?: string;
    city?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const storedToken = await getStorageToken('token');
            if (storedToken) {
                setToken(storedToken);
                await fetchUserProfile();
            }
        } catch (error) {
            console.error('Erreur vérification auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/profile');
            if (response.data.status && response.data.user) {
                setUser(response.data.user);
            } else if (response.data.id) {
                // Si l'API retourne directement l'utilisateur
                setUser(response.data);
            }
        } catch (error) {
            console.error('Erreur récupération profil:', error);
            await logout();
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await api.post<AuthResponse>('/login', { email, password });

            if (response.data.status && response.data.token) {
                await setStorageToken('token', response.data.token);
                setToken(response.data.token);

                if (response.data.user) {
                    setUser(response.data.user);
                } else {
                    await fetchUserProfile();
                }

                return { success: true, message: 'Connexion réussie' };
            }

            return { success: false, message: response.data.message || 'Erreur de connexion' };
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || error.message || 'Erreur de connexion';
            return { success: false, message };
        }
    };

    const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await api.post<AuthResponse>('/register', data);

            if (response.data.status && response.data.token) {
                await setStorageToken('token', response.data.token);
                setToken(response.data.token);

                if (response.data.user) {
                    setUser(response.data.user);
                } else {
                    await fetchUserProfile();
                }

                return { success: true, message: 'Inscription réussie' };
            }

            return { success: false, message: response.data.message || 'Erreur d\'inscription' };
        } catch (error: any) {
            console.error('Register error:', error);
            const message = error.response?.data?.message || error.message || 'Erreur d\'inscription';
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            // Ignorer les erreurs de logout
        } finally {
            await removeStorageToken('token');
            setToken(null);
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await fetchUserProfile();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token && !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
