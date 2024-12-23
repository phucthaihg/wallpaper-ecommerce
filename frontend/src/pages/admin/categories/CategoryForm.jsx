import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categoryService } from '../../../services/categories';

function CategoryForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    
    const [form, setForm] = useState({
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
        if (id) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getTree();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
            setLoading(false);
        }
    };

    const fetchCategory = async () => {
        try {
            const category = await categoryService.getById(id);
            setForm({
                ...category,
                image: null, // Reset image since we can't populate file input
                metadata: {
                    ...category.metadata,
                    keywords: Array.isArray(category.metadata?.keywords) 
                        ? category.metadata.keywords 
                        : []
                }
            });
        } catch (error) {
            console.error('Error fetching category:', error);
            setError('Failed to load category');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const formData = {
                ...form,
                metadata: JSON.stringify({
                    ...form.metadata,
                    keywords: Array.isArray(form.metadata.keywords)
                        ? form.metadata.keywords
                        : form.metadata.keywords.split(',').map(k => k.trim())
                })
            };

            if (id) {
                await categoryService.update(id, formData);
            } else {
                await categoryService.create(formData);
            }

            navigate('/admin/categories');
        } catch (error) {
            console.error('Error saving category:', error);
            setError('Failed to save category');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/categories')}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-semibold">
                    {id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h1>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Mô tả</label>
                            <textarea
                                rows="4"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Danh mục cha</label>
                            <select
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={form.parentId}
                                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                            >
                                <option value="">Không có danh mục cha</option>
                                {categories.map(category => (
                                    <option 
                                        key={category.id} 
                                        value={category.id}
                                        disabled={category.id === Number(id)}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Hình ảnh</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Thứ tự hiển thị</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    value={form.displayOrder}
                                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                <select
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    value={form.isActive.toString()}
                                    onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}
                                >
                                    <option value="true">Đang hoạt động</option>
                                    <option value="false">Không hoạt động</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">Thông tin SEO</h3>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Tiêu đề SEO</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={form.metadata.metaTitle}
                                onChange={(e) => setForm({
                                    ...form,
                                    metadata: { ...form.metadata, metaTitle: e.target.value }
                                })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Mô tả SEO</label>
                            <textarea
                                rows="4"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={form.metadata.metaDescription}
                                onChange={(e) => setForm({
                                    ...form,
                                    metadata: { ...form.metadata, metaDescription: e.target.value }
                                })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Từ khóa (phân tách bằng dấu phẩy)</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={form.metadata.keywords.join(', ')}
                                onChange={(e) => setForm({
                                    ...form,
                                    metadata: {
                                        ...form.metadata,
                                        keywords: e.target.value.split(',').map(k => k.trim())
                                    }
                                })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Icon Class</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={form.metadata.iconClass}
                                onChange={(e) => setForm({
                                    ...form,
                                    metadata: { ...form.metadata, iconClass: e.target.value }
                                })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Thứ tự nổi bật</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={form.metadata.featuredOrder}
                                onChange={(e) => setForm({
                                    ...form,
                                    metadata: { ...form.metadata, featuredOrder: Number(e.target.value) }
                                })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/categories')}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        disabled={saving}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? 'Đang lưu...' : (id ? 'Cập nhật' : 'Thêm mới')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CategoryForm;