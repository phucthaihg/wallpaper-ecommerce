import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services/categories';

function CategoriesPage() {
  // Get category tree with React Query
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getTree(),
  });

  const renderCategory = (category) => (
    <div key={category.id} className="group">
      <Link 
        to={`/categories/${category.id}`}
        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            src={category.image || '/placeholder-category.jpg'}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
          {category.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{category.description}</p>
          )}
          {category.children && category.children.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Danh mục con:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {category.children.map(child => (
                  <Link
                    key={child.id}
                    to={`/categories/${child.id}`}
                    className="text-sm text-gray-600 hover:text-primary px-2 py-1 bg-gray-50 rounded"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );

  const renderCategorySection = (categories, level = 0) => {
    const rootCategories = categories.filter(cat => cat.level === level);
    
    if (rootCategories.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rootCategories.map(renderCategory)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Danh mục sản phẩm</h1>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Trang chủ
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500">Danh mục</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Main Categories */}
        <div className="space-y-12">
          {categories.some(cat => cat.level === 0) && (
            <section>
              <h2 className="text-xl font-semibold mb-6">Danh mục chính</h2>
              {renderCategorySection(categories, 0)}
            </section>
          )}

          {/* Featured Categories */}
          {categories.some(cat => cat.metadata?.featuredOrder) && (
            <section>
              <h2 className="text-xl font-semibold mb-6">Danh mục nổi bật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories
                  .filter(cat => cat.metadata?.featuredOrder)
                  .sort((a, b) => a.metadata.featuredOrder - b.metadata.featuredOrder)
                  .map(renderCategory)}
              </div>
            </section>
          )}
        </div>

        {/* SEO Content */}
        <div className="mt-16 prose max-w-none">
          <h2>Khám phá bộ sưu tập giấy dán tường và rèm cửa</h2>
          <p>
            Chào mừng bạn đến với bộ sưu tập giấy dán tường và rèm cửa đa dạng của chúng tôi. 
            Với nhiều mẫu mã phong phú từ cổ điển đến hiện đại, chúng tôi tự tin mang đến những 
            giải pháp trang trí hoàn hảo cho không gian của bạn.
          </p>
          <p>
            Khám phá các danh mục sản phẩm được phân loại chi tiết, giúp bạn dễ dàng tìm kiếm 
            và lựa chọn sản phẩm phù hợp với phong cách và không gian sống của mình.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;