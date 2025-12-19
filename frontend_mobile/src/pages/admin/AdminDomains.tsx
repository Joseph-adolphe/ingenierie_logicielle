import { Trash2, Plus, Layers, Search, X, Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { domainSchema, type DomainFormData } from '@/lib/validators';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";

export default function AdminDomains() {
    // Local State for Domains
    const [domains, setDomains] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showAddDomain, setShowAddDomain] = useState(false);
    const [editingDomain, setEditingDomain] = useState<any | null>(null);
    const [domainToDelete, setDomainToDelete] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<DomainFormData>({
        resolver: zodResolver(domainSchema),
    });

    const fetchDomains = async () => {
        setIsFetching(true);
        try {
            const response = await api.get(`/admin/domain?page=${page}`);
            setDomains(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (err) {
            console.error("Error fetching domains:", err);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, [page]);

    const handleEditDomain = (domain: any) => {
        setEditingDomain(domain);
        setValue('nom_domaine', domain.nom_domaine);
        setValue('description', domain.description);
        setShowAddDomain(true);
    };

    const handleCloseModal = () => {
        setShowAddDomain(false);
        setEditingDomain(null);
        reset();
        setError("");
    };

    const onSubmit = async (data: DomainFormData) => {
        setError("");
        setIsLoading(true);

        try {
            if (editingDomain) {
                await api.put(`/admin/domain/${editingDomain.id}`, data);
            } else {
                await api.post('/admin/domain', data);
            }
            fetchDomains();
            handleCloseModal();
        } catch (err: any) {
            console.error("Error saving domain:", err);
            setError(err.response?.data?.message || "Échec de l'enregistrement du domaine. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDeleteDomain = async () => {
        if (!domainToDelete) return;

        // Optimistic UI update or simple wait
        try {
            await api.delete(`/admin/domain/${domainToDelete.id}`);
            setDomains(domains.filter(d => d.id !== domainToDelete.id));
            setDomainToDelete(null);
        } catch (err) {
            console.error("Error deleting domain:", err);
            // Revert or show error - here just alert as per existing pattern or better toast
            alert("Impossible de supprimer le domaine.");
        }
    };


    const filteredDomains = domains.filter((d: any) =>
        (d.nom_domaine?.toLowerCase() || d.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (d.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 relative">
            {/* Header Section - Simplified */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Domaines d'Activité</h1>
                    <p className="text-gray-500">Gérez les catégories de services de la plateforme.</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingDomain(null);
                        reset();
                        setShowAddDomain(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" /> Nouveau Domaine
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Rechercher un domaine..."
                        className="pl-10 border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    {filteredDomains.length} domaines trouvés
                </div>
            </div>

            {/* Domains Grid */}
            {isFetching ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDomains.map((domain: any) => (
                        <div key={domain.id} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-orange-50 transition-colors">
                                    <Layers className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditDomain(domain)}
                                        className="text-gray-300 hover:text-orange-500 hover:bg-orange-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Modifier ce domaine"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setDomainToDelete(domain)}
                                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Supprimer ce domaine"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{domain.nom_domaine}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{domain.description}</p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-medium text-gray-600">Actif</span>
                                </div>
                                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                                    <span className="font-bold text-orange-600 text-sm">{domain.prestataires_count || 0}</span>
                                    <span className="text-xs text-orange-400">prestataires</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4">
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isFetching}
                >
                    Précédent
                </Button>
                <span className="text-sm text-gray-500">Page {page} sur {totalPages}</span>
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isFetching}
                >
                    Suivant
                </Button>
            </div>

            {/* ADD/EDIT DOMAIN MODAL */}
            {
                showAddDomain && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingDomain ? 'Modifier le Domaine' : 'Ajouter un Domaine'}
                                </h3>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nom du domaine</label>
                                    <Input
                                        placeholder="Ex: Informatique"
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        {...register("nom_domaine")}
                                        disabled={isLoading}
                                    />
                                    {errors.nom_domaine && (
                                        <p className="text-sm text-red-500">{errors.nom_domaine.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <Textarea
                                        placeholder="Description courte du domaine..."
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors min-h-[100px]"
                                        {...register("description")}
                                        disabled={isLoading}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={handleCloseModal} className="border-gray-200" disabled={isLoading}>Annuler</Button>
                                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                {editingDomain ? 'Modification...' : 'Ajout...'}
                                            </>
                                        ) : (
                                            editingDomain ? 'Modifier' : 'Ajouter'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={!!domainToDelete} onOpenChange={(open) => !open && setDomainToDelete(null)}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le domaine "{domainToDelete?.nom_domaine}" ?
                            Cette action est irréversible et supprimera l'association avec les prestataires concernés.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDomainToDelete(null)}>
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteDomain} className="bg-red-600 hover:bg-red-700 text-white">
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
