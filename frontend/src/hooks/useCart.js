// hooks/useCart.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';

export const useCart = () => {
 const queryClient = useQueryClient();

 const { data: cart, isLoading } = useQuery({
   queryKey: ['cart'],
   queryFn: async () => {
     try {
       const { data } = await api.get('/cart');
       return data;
     } catch (error) {
       //toast.error('Không thể tải giỏ hàng');
       return null;
     }
   }
 });

 const { data: cartSummary } = useQuery({
   queryKey: ['cart-summary'],
   queryFn: async () => {
     try {
       const { data } = await api.get('/cart/summary');
       return data;
     } catch (error) {
       toast.error('Không thể tải thông tin giỏ hàng');
       return null;
     }
   }
 });

 const addToCart = useMutation({
   mutationFn: async ({ productId, quantity, specifications }) => {
     try {
       const { data } = await api.post('/cart', { 
         productId, 
         quantity, 
         specifications 
       });
       return data;
     } catch (error) {
       const message = error.response?.data?.message || 'Không thể thêm vào giỏ hàng';
       if (error.response?.status === 409) {
         toast.error(`Chỉ còn ${error.response.data.available} sản phẩm trong kho`);
       } else {
         toast.error(message);
       }
       throw error;
     }
   },
   onSuccess: () => {
     queryClient.invalidateQueries(['cart', 'cart-summary']);
     toast.success('Đã thêm vào giỏ hàng');
   }
 });

 const updateCartItem = useMutation({
   mutationFn: async ({ id, quantity, specifications }) => {
     try {
       const { data } = await api.put(`/cart/items/${id}`, {
         quantity,
         specifications
       });
       return data;
     } catch (error) {
       if (error.response?.status === 409) {
         toast.error(`Chỉ còn ${error.response.data.available} sản phẩm trong kho`);
       } else {
         toast.error('Không thể cập nhật số lượng');
       }
       throw error;
     }
   },
   onSuccess: () => {
     queryClient.invalidateQueries(['cart', 'cart-summary']);
   }
 });

 const removeFromCart = useMutation({
   mutationFn: async (id) => {
     try {
       const { data } = await api.delete(`/cart/items/${id}`);
       return data;
     } catch (error) {
       toast.error('Không thể xóa sản phẩm');
       throw error;
     }
   },
   onSuccess: () => {
     queryClient.invalidateQueries(['cart', 'cart-summary']);
     toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
   }
 });

 const clearCart = useMutation({
   mutationFn: async () => {
     try {
       const { data } = await api.delete('/cart');
       return data;
     } catch (error) {
       toast.error('Không thể xóa giỏ hàng');
       throw error;
     }
   },
   onSuccess: () => {
     queryClient.invalidateQueries(['cart', 'cart-summary']);
     toast.success('Đã xóa giỏ hàng');
   }
 });

 const applyCoupon = useMutation({
   mutationFn: async (code) => {
     try {
       const { data } = await api.post('/cart/coupon', { code });
       return data;
     } catch (error) {
       const message = error.response?.data?.message || 'Không thể áp dụng mã giảm giá';
       if (error.response?.status === 400 && error.response.data.required) {
         toast.error(`Cần mua thêm ${(error.response.data.required - error.response.data.current).toLocaleString()}đ để sử dụng mã giảm giá này`);
       } else {
         toast.error(message);
       }
       throw error;
     }
   },
   onSuccess: (data) => {
     queryClient.invalidateQueries(['cart', 'cart-summary']);
     toast.success(`Đã áp dụng mã giảm giá: ${data.code}`);
   }
 });

 const removeCoupon = useMutation({
   mutationFn: async () => {
     try {
       const { data } = await api.delete('/cart/coupon');
       return data;
     } catch (error) {
       toast.error('Không thể xóa mã giảm giá');
       throw error;
     }
   },
   onSuccess: () => {
     queryClient.invalidateQueries(['cart', 'cart-summary']);
     toast.success('Đã xóa mã giảm giá');
   }
 });

 const saveForLater = useMutation({
   mutationFn: async (id) => {
     try {
       const { data } = await api.post(`/cart/items/${id}/save`);
       return data; 
     } catch (error) {
       toast.error('Không thể lưu sản phẩm');
       throw error;
     }
   },
   onSuccess: () => {
     queryClient.invalidateQueries(['cart', 'cart-summary']);
     toast.success('Đã lưu sản phẩm để mua sau');
   }
 });

 const moveToCart = useMutation({
   mutationFn: async (id) => {
     try {
       const { data } = await api.post(`/cart/items/${id}/move`);
       return data;
     } catch (error) {
       toast.error('Không thể chuyển sản phẩm vào giỏ hàng');
       throw error;
     }
   },
   onSuccess: () => {
     queryClient.invalidateQueries(['cart', 'cart-summary']);
     toast.success('Đã chuyển sản phẩm vào giỏ hàng');
   }
 });

 return {
   cart,
   cartSummary,
   isLoading,
   addToCart,
   updateCartItem,
   removeFromCart,
   clearCart,
   applyCoupon,
   removeCoupon,
   saveForLater,
   moveToCart
 };
};