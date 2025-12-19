import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Configuration de l'API
const ENV_URL = process.env.EXPO_PUBLIC_API_URL;

export const BASE_URL = ENV_URL
    ? ENV_URL.replace('/api', '')
    : (Platform.OS === 'web' ? 'http://localhost:8000' : 'http://192.168.1.100:8000');

const API_BASE_URL = ENV_URL || `${BASE_URL}/api`;

export const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    return `${BASE_URL}/storage/${cleanPath}`;
};

// Cross-platform storage helpers
export const getToken = async (key: string) => {
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
};

export const setToken = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

export const removeToken = async (key: string) => {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};

// Création de l'instance axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000,
});

// Intercepteur pour ajouter le token Bearer à chaque requête
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getToken('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('Token attaché:', token.substring(0, 10) + '...');
            } else {
                console.log('Aucun token trouvé');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du token', error);
        }
        console.log('Request Headers:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Token expiré ou invalide
            await removeToken('token');
            // Le contexte Auth gérera la redirection
        }
        return Promise.reject(error);
    }
);

export const setApiBaseUrl = (url: string) => {
    api.defaults.baseURL = url;
};

export default api;
