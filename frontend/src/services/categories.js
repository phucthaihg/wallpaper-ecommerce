import api from './api';

export const categoryService = {
  // Get all categories
  getAll: async () => {
    const { data } = await api.get('/categories');
    console.log("categoryService.getAll", data);
    return data;
  },

  // Get a single category
  getById: async (id) => {
    const { data } = await api.get(`/categories/${id}`);
    console.log("categoryService.getById", data);
    return data;
  },

  // Get category by slug
  getBySlug: async (slug) => {
    const { data } = await api.get(`/categories/slug/${slug}`);
    return data;
  },

  // Admin: Create category
  create: async (categoryData) => {
    const formData = new FormData();
    
    Object.keys(categoryData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, categoryData[key]);
      }
    });

    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const { data } = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  // Admin: Update category
  update: async (id, categoryData) => {
    const formData = new FormData();
    
    Object.keys(categoryData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, categoryData[key]);
      }
    });

    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const { data } = await api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  // Admin: Delete category
  delete: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },

  // Admin: Update display order
  updateOrder: async (id, displayOrder) => {
    const { data } = await api.put(`/categories/${id}/order`, { displayOrder });
    return data;
  },

  // Get category tree (hierarchical structure)
  getTree: async () => {
    const { data } = await api.get('/categories/tree');
    console.log("categoryService.getTree", data);
    return data;
  }
};