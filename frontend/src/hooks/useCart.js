import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';

export const useCart = () => {
  const queryClient = useQueryClient();

  // Get cart
  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/cart');
        return data;
      } catch (error) {
        const message = error.response?.data?.message || 'Error fetching cart';
        toast.error(message);
        return null;
      }
    }
  });

  // Add to cart
  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity, specifications }) => {
      const { data } = await api.post('/cart', {
        productId,
        quantity,
        specifications
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Đã thêm vào giỏ hàng');
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      toast.error(message);
    }
  });

  // Update cart item
  const updateCartItem = useMutation({
    mutationFn: async ({ id, quantity }) => {
      const { data } = await api.put(`/cart/items/${id}`, { quantity });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Không thể cập nhật số lượng';
      toast.error(message);
    }
  });

  // Remove from cart
  const removeFromCart = useMutation({
    mutationFn: async (itemId) => {
      const { data } = await api.delete(`/cart/items/${itemId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Đã xóa sản phẩm');
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error) => {
      toast.error('Không thể xóa sản phẩm');
    }
  });

  // Clear cart
  const clearCart = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete('/cart');
      return data;
    },
    onSuccess: () => {
      toast.success('Đã xóa giỏ hàng');
      queryClient.invalidateQueries(['cart']);
    },
    onError: () => {
      toast.error('Không thể xóa giỏ hàng');
    }
  });

  // Apply coupon
  const applyCoupon = useMutation({
    mutationFn: async (code) => {
      const { data } = await api.post('/cart/coupon', { code });
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Đã áp dụng mã giảm giá: ${data.discount}đ`);
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Mã giảm giá không hợp lệ';
      toast.error(message);
    }
  });

  // Remove coupon
  const removeCoupon = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete('/cart/coupon');
      return data;
    },
    onSuccess: () => {
      toast.success('Đã xóa mã giảm giá');
      queryClient.invalidateQueries(['cart']);
    },
    onError: () => {
      toast.error('Không thể xóa mã giảm giá');
    }
  });

  return {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    isEmpty: !cart?.items?.length,
    itemCount: cart?.items?.length || 0,
    total: cart?.total || 0
  };
};