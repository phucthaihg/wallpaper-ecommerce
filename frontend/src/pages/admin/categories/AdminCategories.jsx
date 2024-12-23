import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { categoryService } from '../../../services/categories';
import toast from 'react-hot-toast';

function AdminCategories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getTree();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories. Please try again later.');
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setDeleting(true);
            await categoryService.delete(id);
            await fetchCategories();
            setShowDeleteModal(false);
            toast.success('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    const toggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const filterCategories = (categories, searchTerm) => {
        if (!searchTerm) return categories;
        
        return categories.filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                category.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (matchesSearch) return true;
            
            const children = categories.filter(c => c.parentId === category.id);
            return children.length > 0 && filterCategories(children, searchTerm).length > 0;
        });
    };

    const buildCategoryTree = (categories, parentId = null, level = 0) => {
        return categories
            .filter(category => category.parentId === parentId)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(category => {
                const hasChildren = categories.some(c => c.parentId === category.id);
                const isExpanded = expandedCategories[category.id];

                return (
                    <div key={category.id} className="border-b last:border-b-0">
                        <div
                            className={`flex items-center gap-2 py-3 ${
                                level > 0 ? `pl-${level * 8}` : ''
                            } hover:bg-gray-50`}
                        >
                            {hasChildren && (
                                <button
                                    onClick={() => toggleExpand(category.id)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                            <div className={`flex-shrink-0 w-10 h-10 ${!hasChildren ? 'ml-6' : ''}`}>
                                <img
                                    src={category.image || '/placeholder.png'}
                                    alt={category.name}
                                    className="w-full h-full object-cover rounded"
                                    onError={(e) => {
                                        e.target.src = '/placeholder.png';
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{category.name}</div>
                                {category.description && (
                                    <div className="text-sm text-gray-500 truncate">
                                        {category.description}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setShowDeleteModal(true);
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {isExpanded && buildCategoryTree(categories, category.id, level + 1)}
                    </div>
                );
            });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const filteredCategories = filterCategories(categories, searchTerm);

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-xl font-semibold">Quản lý danh mục</h2>
                <button
                    onClick={() => navigate('/admin/categories/new')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                >
                    <Plus className="w-4 h-4" />
                    Thêm danh mục
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Tìm kiếm danh mục..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Categories Tree */}
            <div className="border rounded-lg divide-y">
                {filteredCategories.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        {searchTerm ? 'No categories found matching your search' : 'No categories yet'}
                    </div>
                ) : (
                    buildCategoryTree(filteredCategories)
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Xóa danh mục</h3>
                        <p className="text-gray-600 mb-4">
                            Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"? 
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-50"
                                disabled={deleting}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => handleDelete(selectedCategory?.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                disabled={deleting}
                            >
                                {deleting ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategories;