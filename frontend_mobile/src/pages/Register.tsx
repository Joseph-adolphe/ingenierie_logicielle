import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, ArrowLeft, Loader2 } from "lucide-react";
import logosite from "@/assets/logosite.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validators";

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "client",
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setError("");
        setIsLoading(true);

        try {
            await api.post('/register', data);
            navigate('/login');
        } catch (err: any) {
            console.error("Register error:", err);
            setError(err.response?.data?.message || "Échec de l'inscription. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
            {/* Background visual element */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-orange-200/30 rounded-full blur-[100px] opacity-20" />
                <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 bg-purple-300/30 rounded-full blur-[100px] opacity-20" />
            </div>

            <div className="relative w-full max-w-lg md:max-w-md">
                {/* Register Form Card */}
                <div className="w-full space-y-4 p-6 sm:p-8 bg-white rounded-2xl shadow-2xl shadow-gray-300/60 border border-gray-200/50 transform transition duration-500 hover:shadow-3xl">
                    <div className="">
                        {/* Logo/Icon Area */}
                        <div className="flex items-start">
                            <div className="mr-4">
                                <img src={logosite} alt="Logo" className="w-10 h-10 object-contain" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Créer un compte</h2>
                        </div>
                        <p className="mt-2 text-gray-500 text-sm">
                            Remplissez les informations pour commencer.
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm transition-all duration-300 animate-in fade-in flex items-center justify-center">
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        {/* Prénom */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Prénom <span className="text-red-500">*</span></label>
                            <Input
                                {...register("surname")}
                                placeholder="Jean"
                                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errors.surname ? 'border-red-500 ring-red-500' : ''}`}
                            />
                            {errors.surname && <p className="text-red-600 text-xs mt-1">{errors.surname.message}</p>}
                        </div>

                        {/* Nom */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nom <span className="text-red-500">*</span></label>
                            <Input
                                {...register("name")}
                                placeholder="Dupont"
                                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errors.name ? 'border-red-500 ring-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                            <Input
                                type="email"
                                {...register("email")}
                                placeholder="nom@exemple.com"
                                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errors.email ? 'border-red-500 ring-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Téléphone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Téléphone <span className="text-red-500">*</span></label>
                            <Input
                                type="tel"
                                {...register("phone")}
                                placeholder="+237 6XX XX XX XX"
                                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errors.phone ? 'border-red-500 ring-red-500' : ''}`}
                            />
                            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Mot de passe */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mot de passe <span className="text-red-500">*</span></label>
                            <Input
                                type="password"
                                {...register("password")}
                                placeholder="••••••••"
                                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errors.password ? 'border-red-500 ring-red-500' : ''}`}
                            />
                            <p className="text-xs text-gray-500">Minimum 6 caractères</p>
                            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Confirmer le mot de passe */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe <span className="text-red-500">*</span></label>
                            <Input
                                type="password"
                                {...register("confirmPassword")}
                                placeholder="••••••••"
                                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errors.confirmPassword ? 'border-red-500 ring-red-500' : ''}`}
                            />
                            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-10 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg rounded-xl shadow-lg shadow-orange-600/30 transition duration-300 ease-in-out hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                'Créer mon compte'
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Déjà inscrit ?{" "}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition">
                            Se connecter
                        </Link>
                    </p>

                    <p className="flex justify-center items-center text-sm text-blue-600 hover:text-blue-700">
                        <Link to="/" className="flex justify-center items-center">
                            <ArrowLeft className="w-4 h-4 text-blue-600 hover:text-blue-700" />
                            <span className="text-sm font-medium">Retour</span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
