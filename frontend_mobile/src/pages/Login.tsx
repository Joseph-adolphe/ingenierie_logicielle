import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import logosite from "@/assets/logosite.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validators";

export default function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);

    try {
      // appel de l'api
      const response = await api.post('/login', data);
      login(response.data.token, response.data.user);

      // redirection en fonction du role
      if (response.data.user.role === 'admin') navigate('/admin/dashboard');
      else if (response.data.user.role === 'prestataire') navigate('/provider/dashboard');
      else navigate('/user/dashboard');

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      {/* Background visual element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-orange-200/30 rounded-full blur-[100px] opacity-20" />
        <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 bg-indigo-300/30 rounded-full blur-[100px] opacity-20" />
      </div>

      <div className="relative w-full max-w-lg md:max-w-md">
        {/* Login Form Card */}
        <div className="w-full space-y-4 p-6 sm:p-8 bg-white rounded-2xl shadow-2xl shadow-gray-300/60 border border-gray-200/50 transform transition duration-500 hover:shadow-3xl">
          <div className="">
            {/* Logo/Icon Area */}
            <div className="flex items-start">
              <div className="mr-4">
                <img src={logosite} alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Connexion</h2>
            </div>
            <p className="mt-2 text-gray-500 text-sm">
              Ravi de vous revoir ! Accédez à votre espace.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm transition-all duration-300 animate-in fade-in flex items-center justify-center">
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse Email</label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="nom@exemple.com"
                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errors.email ? 'border-red-500 ring-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-600 text-xs mt-1 transition-all duration-300 animate-in fade-in">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition">
                  Mot de passe oublié ?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errors.password ? 'border-red-500 ring-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-600 text-xs mt-1 transition-all duration-300 animate-in fade-in">{errors.password.message}</p>}
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
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Separator */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-10 rounded-xl border-gray-300 bg-white hover:bg-gray-50 shadow-sm transition hover:shadow-md">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-10 rounded-xl border-gray-300 bg-white hover:bg-gray-50 shadow-sm transition hover:shadow-md">
              <svg className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition">
              S'inscrire
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