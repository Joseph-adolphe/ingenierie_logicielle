
export const mockUser = {
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+237 6 XX XX XX XX',
    address: 'Yaoundé, Cameroun',
    avatar: 'JD',
    memberSince: 'Janvier 2024',
    completedServices: 12,
};

export const providers = [
    { id: 1, name: 'Paul Mbarga', profession: 'Plombier', rating: 4.9, reviews: 89, location: 'Yaoundé, Bastos', jobs: 156, avatar: 'PM', bio: 'Plombier expérimenté avec plus de 10 ans d\'expérience. Spécialiste des fuites et installations sanitaires.' },
    { id: 2, name: 'Sarah Kenfack', profession: 'Coiffeuse', rating: 4.8, reviews: 45, location: 'Douala, Akwa', jobs: 82, avatar: 'SK', bio: 'Coiffeuse professionnelle à domicile. Tresses, chignons, soins capillaires.' },
    { id: 3, name: 'Jean Michel', profession: 'Électricien', rating: 4.7, reviews: 32, location: 'Yaoundé, Biyem-Assi', jobs: 64, avatar: 'JM', bio: 'Électricien qualifié pour vos installations et dépannages.' },
    { id: 4, name: 'Aline T.', profession: 'Ménage', rating: 4.6, reviews: 20, location: 'Yaoundé, Centre', jobs: 40, avatar: 'AT', bio: 'Service de ménage impeccable pour appartements et bureaux.' },
];

export const posts = [
    {
        id: 1,
        author: 'Paul Mbarga',
        avatar: 'PM',
        role: 'Prestataire',
        content: 'Installation terminée avec succès chez un client satisfait ! 🔧🚿 N\'hésitez pas à me contacter pour tous vos problèmes de plomberie.',
        image: 'https://images.unsplash.com/photo-1581578731117-104f2a417578?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        initialLikes: 24,
        comments: [{ id: 1, author: 'Alice', content: 'Beau travail !' }],
        timeAgo: '2h'
    },
    {
        id: 2,
        author: 'Sarah Kenfack',
        avatar: 'SK',
        role: 'Prestataire',
        content: 'Disponibilité pour ce week-end : Coiffure à domicile. 💇‍♀️ Réservez vite votre créneau !',
        initialLikes: 15,
        comments: [],
        timeAgo: '5h'
    },
];

export const upcomingServices = [
    { id: 1, service: 'Jardinage', provider: 'Claude Fotso', date: '25 Déc 2024', time: '14:00' },
];

export const messages = [
    { id: 1, sender: 'Paul Mbarga', content: 'Bonjour, je suis disponible demain.', time: '10:30', unread: true },
    { id: 2, sender: 'Sarah Kenfack', content: 'Merci pour votre confiance !', time: 'Hier', unread: false },
];

export const mockProvider = {
    name: 'Paul Mbarga',
    email: 'paul.mbarga@email.com',
    phone: '+237 6 XX XX XX XX',
    address: 'Yaoundé, Bastos',
    avatar: 'PM',
    profession: 'Plombier Professionnel',
    memberSince: 'Mars 2023',
    completedJobs: 156,
    rating: 4.9,
    totalReviews: 89,
    responseRate: 98,
    monthlyRevenue: 450000
};

export const pendingRequests = [
    { id: 1, client: 'Marie Nkotto', service: 'Réparation fuite d\'eau', date: '24 Déc 2024', time: '10:00', location: 'Omnisport, Yaoundé', budget: '25,000 FCFA' },
    { id: 2, client: 'Jean Kamdem', service: 'Installation sanitaire', date: '26 Déc 2024', time: '14:00', location: 'Bastos, Yaoundé', budget: '75,000 FCFA' },
];

export const recentReviews = [
    { id: 1, client: 'Claude Biya', rating: 5, comment: 'Excellent travail, très professionnel et ponctuel !', date: '20 Déc 2024', replies: [] },
    { id: 2, client: 'Linda Muna', rating: 5, comment: 'Je recommande vivement, travail soigné.', date: '18 Déc 2024', replies: [] },
];

export const adminStats = {
    totalUsers: 1250,
    newUsersToday: 15,
    totalProviders: 320,
    newProvidersToday: 5,
    reportedUsers: 3,
    totalPosts: 850
};

export const adminUserData = [
    { name: 'Lun', clients: 400, prestataires: 240 },
    { name: 'Mar', clients: 300, prestataires: 139 },
    { name: 'Mer', clients: 200, prestataires: 980 },
    { name: 'Jeu', clients: 278, prestataires: 390 },
    { name: 'Ven', clients: 189, prestataires: 480 },
    { name: 'Sam', clients: 239, prestataires: 380 },
    { name: 'Dim', clients: 349, prestataires: 430 },
];

export const adminPostData = [
    { name: 'Sem 1', postes: 45 },
    { name: 'Sem 2', postes: 52 },
    { name: 'Sem 3', postes: 38 },
    { name: 'Sem 4', postes: 65 },
];

export const adminUsersList = [
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', type: 'Client', status: 'Actif', joinDate: '12 Jan 2024', services: 5, bio: 'Client régulier à la recherche de services de jardinage.' },
    { id: 2, name: 'Paul Mbarga', email: 'paul@example.com', type: 'Prestataire', status: 'Actif', joinDate: '15 Fév 2024', services: 156, rating: 4.9, bio: 'Plombier expert.', posts: [{ id: 1, image: 'https://images.unsplash.com/photo-1581578731117-104f2a417578?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', title: 'Réparation' }] },
    { id: 3, name: 'Marie Kenfack', email: 'marie@example.com', type: 'Prestataire', status: 'Signalé', joinDate: '20 Mar 2024', services: 12, rating: 3.2, bio: 'Coiffeuse à domicile.' },
    { id: 4, name: 'Lucas T.', email: 'lucas@example.com', type: 'Client', status: 'Bloqué', joinDate: '01 Avr 2024', services: 0, bio: 'Compte suspect.' },
];

export const adminDomains = [
    { id: 1, name: 'Plomberie', description: 'Réparations et installations sanitaires', services: 145 },
    { id: 2, name: 'Électricité', description: 'Installations électriques et dépannage', services: 120 },
    { id: 3, name: 'Ménage', description: 'Nettoyage domicile et bureaux', services: 230 },
    { id: 4, name: 'Jardinage', description: 'Entretien espaces verts', services: 85 },
];

export const adminProfileData = {
    name: "Admin Principal",
    email: "admin@helpix.cm",
    role: "Super Admin"
};
