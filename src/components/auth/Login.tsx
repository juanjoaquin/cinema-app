import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { getUserData } from '../../services/authService';
import { KeyRound, Mail } from 'lucide-react';

interface LoginResponse {
  access_token: string;
}

export const Login = () => {
  const loginSchema = z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required')
  });

  type LoginForm = z.infer<typeof loginSchema>;

  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const [error, setError] = useState<string>("");
  const [isOk, setIsOk] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsOk('');
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        import.meta.env.VITE_AUTH_LOGIN, formData
      );

      const token = response.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        const userData = await getUserData();
        setIsOk('Login successful');

        setTimeout(() => {
          if (userData) {
            navigate('/')
          }
        }, 1000);
      }
    }
    catch (error: any) {
      console.log("Error en el inicio de sesión:", error);
      setError("Credentials error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Login";

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const userData = await getUserData();
          console.log("User data:", userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="w-full max-w-md p-8 space-y-8  rounded-xl shadow-2xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-600/20 mb-5">
          <KeyRound className="h-10 w-10 text-indigo-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-400">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-indigo-400 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </label>
            <input 
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 px-3 text-white bg-transparent py-2 border border-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-indigo-400 flex items-center gap-2">
              <KeyRound className="h-4 w-4" /> Password
            </label>
            <input 
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 px-3 text-white bg-transparent py-2 border border-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <span className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors duration-200">
              Register now
            </Link>
          </span>
        </div>
      </form>

      {error && (
        <div className="p-3 border border-red-400 bg-red-100/10 text-red-500 font-medium rounded-md text-center text-sm">
          {error}
        </div>
      )}

      {isOk && (
        <div className="p-3 border border-green-400 bg-green-100/10 text-green-500 font-medium rounded-md text-center text-sm">
          {isOk}
        </div>
      )}
    </div>
  );
};