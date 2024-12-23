import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../../services/categories';

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        parentId: '',
        isActive: true,
        displayOrder: 0,
        image: null,
        metadata: {
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            iconClass: '',
            featuredOrder: 0
        }
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getTree();
            setCategories(data);
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Convert keywords array to string for FormData
            const formData = {
                ...categoryForm,
                metadata: JSON.stringify({
                    ...categoryForm.metadata,
                    keywords: Array.isArray(categoryForm.metadata.keywords)
                        ? categoryForm.metadata.keywords
                        : categoryForm.metadata.keywords.split(',').map(k => k.trim())
                })
            };

            if (selectedCategory) {
                await categoryService.update(selectedCategory.id, formData);
            } else {
                await categoryService.create(formData);
            }

            fetchCategories();
            setShowCategoryModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await categoryService.delete(id);
            fetchCategories();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const resetForm = () => {
        setCategoryForm({
            name: '',
            description: '',
            parentId: '',
            isActive: true,
            displayOrder: 0,
            image: null,
            metadata: {
                metaTitle: '',
                metaDescription: '',
                keywords: [],
                iconClass: '',
                featuredOrder: 0
            }
        });
        setSelectedCategory(null);
    };

    const toggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const buildCategoryTree = (categories, parentId = null, level = 0) => {
        return categories
            .filter(category => category.parentId === parentId)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(category => (
                <div key={category.id} className="border-b last:border-b-0">
                    <div
                        className={`flex items-center gap-2 py-3 ${level > 0 ? `pl-${level * 8}` : ''
                            }`}
                    >
                        {categories.some(c => c.parentId === category.id) && (
                            <button
                                onClick={() => toggleExpand(category.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                {expandedCategories[category.id] ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>
                        )}
                        <img
                            src={category.image || '/placeholder.png'}
                            alt={category.name}
                            className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-gray-500">
                                {category.description?.slice(0, 50)}
                                {category.description?.length > 50 ? '...' : ''}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setCategoryForm({
                                        ...category,
                                        image: null
                                    });
                                    setShowCategoryModal(true);
                                }}
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
                    {expandedCategories[category.id] && buildCategoryTree(categories, category.id, level + 1)}
                </div>
            ));
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-xl font-semibold">Quản lý danh mục</h2>
                <button
                    onClick={() => {
                        //resetForm();
                        //setShowCategoryModal(true);
                        navigate('/admin/categories/new');
                    }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                >
                    <Plus className="w-4 h-4" />
                    Thêm danh mục
                </button>
            </div>

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
                {buildCategoryTree(categories)}
            </div>

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            {selectedCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Danh mục cha</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={categoryForm.parentId}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                                >
                                    <option value="">Không có danh mục cha</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Hình ảnh</label>
                                <input
                                    type="file"
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.files[0] })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Thứ tự hiển thị</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    value={categoryForm.displayOrder}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={categoryForm.isActive.toString()}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.value === 'true' })}
                                >
                                    <option value="true">Đang hoạt động</option>
                                    <option value="false">Không hoạt động</option>
                                </select>
                            </div>

                            {/* SEO Metadata */}
                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-medium mb-2">Thông tin SEO</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tiêu đề SEO</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={categoryForm.metadata.metaTitle}
                                            onChange={(e) => setCategoryForm({
                                                ...categoryForm,
                                                metadata: { ...categoryForm.metadata, metaTitle: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mô tả SEO</label>
                                        <textarea
                                            className="w-full p-2 border rounded"
                                            value={categoryForm.metadata.metaDescription}
                                            onChange={(e) => setCategoryForm({
                                                ...categoryForm,
                                                metadata: { ...categoryForm.metadata, metaDescription: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Từ khóa (phân tách bằng dấu phẩy)</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={categoryForm.metadata.keywords.join(', ')}
                                            onChange={(e) => setCategoryForm({
                                                ...categoryForm,
                                                metadata: {
                                                    ...categoryForm.metadata,
                                                    keywords: e.target.value.split(',').map(k => k.trim())
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {selectedCategory ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Xóa danh mục</h3>
                        <p className="text-gray-600 mb-4">
                            Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => handleDelete(selectedCategory?.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategories;