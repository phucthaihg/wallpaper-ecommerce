import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export const useAuth = () => {
 const queryClient = useQueryClient();
 const navigate = useNavigate();

 // Get current user
 const { data: user, isLoading } = useQuery({
   queryKey: ['user'],
   queryFn: async () => {
     try {
       const token = localStorage.getItem('token');
       if (!token) return null;
       const { data } = await api.get('/auth/profile');
       return data;
     } catch (error) {
       localStorage.removeItem('token'); // Clear invalid token
       return null;
     }
   }
 });

 // Login mutation
 const login = useMutation({
   mutationFn: async (credentials) => {
     const { data } = await api.post('/auth/login', credentials);
     return data;
   },
   onSuccess: (data) => {
     localStorage.setItem('token', data.token);
     queryClient.setQueryData(['user'], data.user);
     toast.success('Đăng nhập thành công!');
     navigate('/');
   },
   onError: (error) => {
     const message = error.response?.data?.message || 'Đăng nhập thất bại';
     toast.error(message);
   }
 });

 // Register mutation
 const register = useMutation({
   mutationFn: async (userData) => {
     const { data } = await api.post('/auth/register', userData);
     return data;
   },
   onSuccess: (data) => {
     localStorage.setItem('token', data.token);
     queryClient.setQueryData(['user'], data.user);
     toast.success('Đăng ký thành công!');
     navigate('/');
   },
   onError: (error) => {
     const message = error.response?.data?.message || 'Đăng ký thất bại';
     toast.error(message);
   }
 });

 // Logout
 const logout = () => {
   localStorage.removeItem('token');
   queryClient.setQueryData(['user'], null);
   queryClient.clear(); // Clear all queries
   toast.success('Đã đăng xuất');
   navigate('/login');
 };

 // Change password
 const changePassword = useMutation({
   mutationFn: async (passwords) => {
     const { data } = await api.post('/auth/change-password', passwords);
     return data;
   },
   onSuccess: () => {
     toast.success('Đổi mật khẩu thành công');
   },
   onError: (error) => {
     const message = error.response?.data?.message || 'Đổi mật khẩu thất bại';
     toast.error(message);
   }
 });

 return {
   user,
   isLoading,
   login,
   register,
   logout,
   changePassword,
   isAuthenticated: !!user
 };
};