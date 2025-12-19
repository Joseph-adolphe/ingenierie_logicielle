import { useState } from 'react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BookingModalProps {
    providerName: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export default function BookingModal({ providerName, isOpen, onClose, onSubmit }: BookingModalProps) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        address: '',
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Réserver un service</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                        Demande de service auprès de <span className="font-bold text-gray-900">{providerName}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Calendar className="w-4 h-4 mr-1" /> Date
                            </label>
                            <Input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Clock className="w-4 h-4 mr-1" /> Heure
                            </label>
                            <Input
                                type="time"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" /> Adresse d'intervention
                        </label>
                        <Input
                            placeholder="Votre adresse complète"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description du besoin</label>
                        <Textarea
                            placeholder="Décrivez le problème ou le service souhaité..."
                            required
                            className="h-24 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Annuler
                        </Button>
                        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Confirmer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
