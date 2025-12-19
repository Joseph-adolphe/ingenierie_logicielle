import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Ban, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import PostCard from '@/components/marketplace/PostCard';


export default function AdminReported() {
    const [reports, setReports] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState<any>(null); // For detail view

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await api.get('/admin/reports');
            if (res.data.status) {
                setReports(res.data.reports);
            }
        } catch (error) {
            console.error("Error fetching reports", error);
        }
    };

    const handleResolve = async (report: any) => {
        try {
            await api.delete(`/admin/reports/${report.type}/${report.id}`);
            // Optimistic return
            setReports(prev => prev.filter(r => r.id !== report.id));
        } catch (error) {
            console.error("Error resolving report", error);
        }
    };

    const handleBlock = async (_report: any) => {
        // Typically block user associated with report
        // For Post: Block author? Delete Post?
        // Let's assume blocking the user for now
        alert("Action de blocage à implémenter selon la règle métier (suppression post ou ban user)");
    };

    const handleViewDetails = (report: any) => {
        setSelectedReport(report);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Signalements En Attente</h2>
            {reports.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900">Aucun signalement</p>
                    <p className="text-gray-500">Tout est calme pour le moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report: any) => (
                        <div key={`${report.type}-${report.id}`} className="bg-white border border-red-100 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{report.entity_name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Type: <span className="uppercase font-semibold">{report.type}</span> •
                                        Signalé par: {report.reporter_name}
                                    </p>
                                    <p className="text-xs text-red-500 mt-1 font-medium">Raison: {report.reason}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={() => handleViewDetails(report)} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                    <Eye className="w-4 h-4 mr-2" /> Détails
                                </Button>
                                <Button onClick={() => handleResolve(report)} variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Ignorer
                                </Button>
                                <Button onClick={() => handleBlock(report)} variant="destructive" className="bg-red-600 hover:bg-red-700">
                                    <Ban className="w-4 h-4 mr-2" /> Bloquer
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader>
                        <DialogTitle>Détails du Signalement</DialogTitle>
                    </DialogHeader>

                    {selectedReport?.type === 'post' && selectedReport.entity_details && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Contenu Signalé :</h4>
                            <PostCard
                                id={selectedReport.entity_details.id}
                                author={selectedReport.entity_details.prestataire?.user?.name || 'Inconnu'}
                                avatar="?"
                                role="Prestataire"
                                content={selectedReport.entity_details.contenu || selectedReport.entity_details.titre || ''}
                                images={selectedReport.entity_details.images?.map((img: any) =>
                                    (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '/storage') + '/' + img.image_path
                                ) || []}
                                initialLikes={0}
                                initialIsLiked={false}
                                commentsCount={0}
                                comments={[]}
                                timeAgo="-"
                            />
                        </div>
                    )}

                    {selectedReport?.type === 'prestataire' && selectedReport.entity_details && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Prestataire Signalé :</h4>
                            <div className="bg-white p-4 rounded border">
                                <h3 className="font-bold text-lg">{selectedReport.entity_details.user?.name} {selectedReport.entity_details.user?.surname}</h3>
                                <p>{selectedReport.entity_details.description}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                    Email: {selectedReport.entity_details.user?.email} <br />
                                    Inscrit le: {new Date(selectedReport.entity_details.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
