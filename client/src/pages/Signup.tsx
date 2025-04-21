import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../lib/auth-types';
import { AuthService } from '../lib/auth-service';
import { useLocation, Link } from 'wouter';

const SignupPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = AuthService.register(data);
      
      if (!user) {
        setError('Email sudah terdaftar. Silakan gunakan email lain.');
        setIsLoading(false);
        return;
      }
      
      // Auto login after successful registration
      AuthService.login({ email: data.email, password: data.password });
      
      // Redirect to dashboard
      setLocation('/dashboard');
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-4">
        <div className="neu-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold title">Daftar Akun</h1>
            <p className="subtitle mt-2">Buat akun baru untuk menggunakan Hitungyuk</p>
          </div>

          {error && (
            <div className="bg-red-100 border-4 border-black p-4 mb-6 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label htmlFor="username" className="block font-bold mb-2">Username</label>
              <input
                id="username"
                type="text"
                className="neu-input w-full p-3"
                placeholder="Masukkan username"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-red-600 mt-1">{errors.username.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block font-bold mb-2">Email</label>
              <input
                id="email"
                type="email"
                className="neu-input w-full p-3"
                placeholder="Masukkan email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block font-bold mb-2">Password</label>
              <input
                id="password"
                type="password"
                className="neu-input w-full p-3"
                placeholder="Masukkan password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="mb-8">
              <label htmlFor="confirmPassword" className="block font-bold mb-2">Konfirmasi Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="neu-input w-full p-3"
                placeholder="Konfirmasi password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="neu-button w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p>
              Sudah punya akun?{' '}
              <Link href="/login">
                <a className="text-primary font-bold hover:underline">Masuk di sini</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
