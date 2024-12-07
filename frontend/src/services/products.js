import api from './api';

export const productService = {
  // Get all products with filters
  getAll: async (params = {}) => {
    const { data } = await api.get('/products', { params });
    console.log("productService.getAll", data);
    return data;
  },

  // Get a single product by ID
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  // Get products by category
  getByCategory: async (categoryId, params = {}) => {
    const { data } = await api.get(`/categories/${categoryId}/products`, { params });
    return data;
  },

  // Get featured products
  getFeatured: async () => {
    const { data } = await api.get('/products/featured');
    return data;
  },

  // Search products
  search: async (query) => {
    const { data } = await api.get('/products/search', { params: { q: query } });
    return data;
  },

  // Admin: Create product
  create: async (productData) => {
    const formData = new FormData();
    
    // Handle regular fields
    Object.keys(productData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, productData[key]);
      }
    });

    // Handle images
    if (productData.images) {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const { data } = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  // Admin: Update product
  update: async (id, productData) => {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, productData[key]);
      }
    });

    if (productData.images) {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const { data } = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  // Admin: Delete product
  delete: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  }
};