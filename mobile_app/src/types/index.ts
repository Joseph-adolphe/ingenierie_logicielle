export interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    address?: string;
    country?: string;
    city?: string;
    role: 'client' | 'prestataire' | 'admin';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Prestataire {
    id: number;
    user_id: number;
    bio?: string;
    user?: User;
    domaines?: Domaine[];
    reviews?: Review[];
    posts?: Post[];
    created_at: string;
    updated_at: string;
}

export interface Domaine {
    id: number;
    nom_domaine: string;
    description?: string;
}

export interface Post {
    id: number;
    prestataire_id: number;
    titre?: string;
    contenu: string;
    prestataire?: Prestataire;
    images?: PostImage[];
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    created_at: string;
    updated_at: string;
}

export interface PostImage {
    id: number;
    post_id: number;
    image_path: string;
}

export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    contenu: string;
    user?: User;
    replies?: Comment[];
    created_at: string;
}

export interface Review {
    id: number;
    prestataire_id: number;
    user_id: number;
    note: number;
    commentaire?: string;
    user?: User;
    created_at: string;
}

export interface Conversation {
    id: number;
    user1_id: number;
    user2_id: number;
    user1?: User;
    user2?: User;
    last_message?: Message;
    unread_count?: number;
    created_at: string;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    contenu: string;
    is_read: boolean;
    sender?: User;
    created_at: string;
}

export interface AuthResponse {
    status: boolean;
    message: string;
    token?: string;
    user?: User;
}

export interface ApiResponse<T> {
    status: boolean;
    message?: string;
    data?: T;
}
