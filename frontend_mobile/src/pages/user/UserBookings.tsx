import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { upcomingServices } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function UserBookings() {
    const navigate = useNavigate();
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl font-bold">Mes Réservations</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingServices.map((service) => (
                    <div key={service.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                {service.provider.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{service.service}</h3>
                                <p className="text-sm text-gray-500">{service.provider}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{service.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-4 h-4 flex items-center justify-center">⏰</div>
                                <span>{service.time}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Confirmé</span>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">Détails</Button>
                        </div>
                    </div>
                ))}
                {upcomingServices.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500">Aucune réservation à venir.</p>
                        <Button variant="link" className="text-blue-600" onClick={() => navigate('/user/explorer')}>Trouver un service</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
