import React from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login(data.username, data.password);
      if (success) {
        navigate("/clients");
      }
    } catch (err) {
      // Error is already handled by the auth context
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="w-full flex items-center justify-center relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="fixed inset-0">
        <div className="absolute w-[1200px] h-[1200px] bg-[#1A1F4D]/30 rounded-full -top-1/3 -left-1/4 blur-3xl animate-float animate-move-x-slow"></div>
        <div className="absolute w-[900px] h-[900px] bg-[#242957]/30 rounded-full -bottom-1/3 -right-1/4 blur-2xl animate-float animate-move-y-fast"></div>
        <div className="absolute w-[800px] h-[800px] bg-[#2E346C]/30 rounded-full top-1/4 left-1/4 blur-xl animate-float animate-move-x-fast"></div>
        <div className="absolute w-[700px] h-[700px] bg-[#383E81]/30 rounded-full bottom-1/3 right-1/3 blur-xl animate-float animate-move-y-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-[#424896]/30 rounded-full top-1/3 right-1/4 blur-lg animate-float animate-move-x"></div>
        <div className="absolute w-[500px] h-[500px] bg-[#4C52AB]/30 rounded-full bottom-1/4 left-1/3 blur-lg animate-float animate-move-y"></div>
      </div>

      <div className="max-w-sm w-full mx-4 relative">
        <div className="bg-[#2A2E43]/60 backdrop-blur-md rounded-[10px] p-6 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-48 mx-auto mb-6 relative transition-all duration-500 hover:scale-105">
              <img
                src="https://raw.githubusercontent.com/Nefta11/MiPortafolioNefta/refs/heads/main/assets/esporaNew.png"
                alt="Logo"
                className="w-full rounded-lg"
              />
            </div>
            <h2 className="text-2xl font-light text-white mb-2">Bienvenido de nuevo</h2>
            <p className="text-gray-400">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="text-rose-300 text-sm text-center animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400" htmlFor="username">
                Usuario
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <input
                  id="username"
                  {...register("username")}
                  className="w-full bg-[#2A2E43]/40 border border-gray-600/30 text-white rounded-lg px-10 py-2.5 
                    focus:outline-none focus:border-gray-500/50
                    transition-all duration-300 ease-in-out placeholder-gray-500
                    hover:border-gray-500/50"
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                />
                {errors.username && (
                  <span className="text-xs text-rose-300 mt-1 block">{errors.username.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400" htmlFor="password">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register("password")}
                  className="w-full bg-[#2A2E43]/40 border border-gray-600/30 text-white rounded-lg px-10 py-2.5
                    focus:outline-none focus:border-gray-500/50
                    transition-all duration-300 ease-in-out placeholder-gray-500
                    hover:border-gray-500/50"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <span className="text-xs text-rose-300 mt-1 block">{errors.password.message}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600/30 bg-[#2A2E43]/40 text-gray-600
                    focus:ring-0 focus:ring-offset-0 
                    transition-colors group-hover:border-gray-500/50"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Recordarme</span>
              </label>
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2A2E43]/80 hover:bg-[#2A2E43] text-white rounded-lg py-2.5 font-medium
                transition-all duration-300 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-600/30 border-t-white rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </button>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-xs text-center space-y-3">
                <p className="font-medium text-gray-400">Demo Credentials</p>
                <p className="font-medium text-gray-400">Password: <span className="text-white">password123</span></p>
                <p className="text-gray-400">Usernames:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["admin", "sales", "ssc", "strategy", "studies", "accompaniment", "management", "production", "diffusion"].map((username) => (
                    <span
                      key={username}
                      className="px-1.5 py-0.5 bg-[#2A2E43]/40 rounded text-xs font-medium text-white border border-gray-600/30"
                    >
                      {username}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};