import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
} from "@/components/ui/select"
import ProviderCard from '@/components/marketplace/ProviderCard';
import api from '@/lib/api';
import { cities } from '@/lib/cities';

// Interfaces based on API
interface Domaine {
    id: number;
    nom_domaine: string;
}

interface ProviderUser {
    id: number;
    name: string;
    surname: string;
    city: string;
    country: string;
    avatar?: string;
}

interface Provider {
    id: number;
    user_id: number;
    description: string;
    tarif_horaire: number;
    user: ProviderUser;
    domaines: Domaine[];
    rating?: number;
    reviews_count?: number;
    jobs_count?: number;
}

export default function UserExplorer() {
    const navigate = useNavigate();
    // const [searchParams] = useSearchParams(); - REMOVED

    // List & Filter States
    const [providers, setProviders] = useState<Provider[]>([]);
    const [domaines, setDomaines] = useState<Domaine[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomainId, setSelectedDomainId] = useState<string>("all");
    const [selectedCity, setSelectedCity] = useState<string>("all");

    const cameroonCities = cities.filter(c => c.countryCode === "CM");

    // Detail View States - REMOVED
    // const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
    // const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    // const [providerPosts, setProviderPosts] = useState<any[]>([]);
    // const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch Domains
                const domainRes = await api.get('/domain');
                if (domainRes.data) {
                    // L'API retourne un objet paginé, les domaines sont dans data.data
                    const domainesData = Array.isArray(domainRes.data)
                        ? domainRes.data
                        : domainRes.data.data || [];
                    setDomaines(domainesData);
                }

                // Fetch All Providers
                searchProviders();
            } catch (error) {
                console.error("Error initializing explorer", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Auto-search when filters change (with debounce)
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            searchProviders();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, selectedDomainId, selectedCity]);

    const searchProviders = async () => {
        setIsLoading(true);
        try {
            const params: any = {};
            if (searchQuery.trim()) params.name = searchQuery;
            if (selectedDomainId && selectedDomainId !== "all") params.domaine_id = selectedDomainId;
            if (selectedCity && selectedCity !== "all") params.city = selectedCity;

            const res = await api.get('/prestataires/search', { params });
            if (res.data.status) {
                setProviders(res.data.prestataires);
            } else if (Array.isArray(res.data)) {
                setProviders(res.data);
            } else if (res.data.prestataires) {
                setProviders(res.data.prestataires);
            }
        } catch (error) {
            console.error("Error searching providers", error);
            setProviders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectProvider = (provider: Provider) => {
        navigate(`/user/provider/${provider.user_id}`);
    };


    // Helper helpers
    const getInitials = (user: ProviderUser) => {
        return `${user.name?.charAt(0) || ''}${user.surname?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 min-h-screen">
            {/* PROVIDER LIST VIEW */}
            <>
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explorer les talents</h1>
                        <p className="text-gray-600">Trouvez le prestataire idéal pour vos besoins parmi nos experts certifiés.</p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Rechercher par nom..."
                            className="pl-10 border-gray-200 bg-gray-50 focus:bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && searchProviders()}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select value={selectedDomainId} onChange={(e) => setSelectedDomainId(e.target.value)}>
                            <option value="all">Domaines</option>
                            {domaines.map(d => (
                                <option key={d.id} value={d.id.toString()}>{d.nom_domaine}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="w-full md:w-48">
                        <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                            <option value="all">Villes</option>
                            {cameroonCities.map(city => (
                                <option key={city.name} value={city.name}>{city.name}</option>
                            ))}
                        </Select>
                    </div>
                    <Button onClick={searchProviders} className="bg-primary hover:bg-orange-700 text-white shrink-0">
                        <Search className="w-4 h-4 mr-2" />
                        Rechercher
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {providers.length > 0 ? (
                            providers.map(provider => (
                                <div key={provider.id} onClick={() => handleSelectProvider(provider)} className="cursor-pointer transition-transform hover:scale-[1.01]">
                                    <ProviderCard
                                        id={provider.id}
                                        name={`${provider.user.surname} ${provider.user.name}`}
                                        avatar={getInitials(provider.user)}
                                        profession={provider.domaines?.[0]?.nom_domaine || 'Prestataire'}
                                        rating={provider.rating || 0}
                                        reviews={provider.reviews_count || 0}
                                        location={provider.user.city || provider.user.country || 'Non renseigné'}
                                        jobsCompleted={provider.jobs_count || 0}
                                        onBook={() => {
                                            // Prevent propagation if needed, or let parent handle
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                                <div className="flex justify-center mb-4">
                                    <Search className="w-12 h-12 text-gray-200" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Aucun prestataire trouvé</h3>
                                <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
                            </div>
                        )}
                    </div>
                )}
            </>

        </div>
    );
}
