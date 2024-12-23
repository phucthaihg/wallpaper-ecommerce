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
       const { data } = await api.get('/users/profile');
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

 // Forgot password mutation
 const forgotPassword = useMutation({
  mutationFn: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },
  onSuccess: () => {
    toast.success('Đã gửi email hướng dẫn đặt lại mật khẩu');
  },
  onError: (error) => {
    const message = error.response?.data?.message || 'Không thể gửi email';
    toast.error(message);
  }
});

// Reset password mutation
const resetPassword = useMutation({
  mutationFn: async ({ token, password }) => {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },
  onSuccess: () => {
    toast.success('Đặt lại mật khẩu thành công');
    navigate('/login');
  },
  onError: (error) => {
    const message = error.response?.data?.message || 'Không thể đặt lại mật khẩu';
    toast.error(message);
  }
});

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

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (profileData) => {
      const { data } = await api.put('/auth/profile', profileData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      toast.success('Cập nhật thông tin thành công');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Không thể cập nhật thông tin';
      toast.error(message);
    }
  });
 
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    queryClient.setQueryData(['user'], null);
    queryClient.clear(); // Clear all queries
    toast.success('Đã đăng xuất');
    navigate('/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    logout
  };
 };