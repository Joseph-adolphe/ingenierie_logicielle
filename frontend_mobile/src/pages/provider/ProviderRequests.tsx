import { Button } from '@/components/ui/button';
import { pendingRequests } from '@/lib/mockData';

export default function ProviderRequests() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl font-bold">Demandes de Service ({pendingRequests.length})</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRequests.map(req => (
                    <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                                {req.client.charAt(0)}
                            </div>
                            <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">Nouveau</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{req.client}</h3>
                        <p className="text-gray-500 text-sm mb-4">{req.service}</p>

                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="w-4">📅</span> {req.date} à {req.time}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4">📍</span> {req.location}
                            </div>
                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                <span className="w-4">💰</span> {req.budget}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">Refuser</Button>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">Accepter</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
