import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import ProductFilter from '../../components/products/ProductFilter';
import { productService } from '../../services/products';
import { categoryService } from '../../services/categories';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get filter values from URL
  const currentCategory = searchParams.get('category');
  const currentMinPrice = searchParams.get('minPrice');
  const currentMaxPrice = searchParams.get('maxPrice');
  const currentSort = searchParams.get('sort') || 'createdAt';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll({
            category: currentCategory,
            minPrice: currentMinPrice,
            maxPrice: currentMaxPrice,
            sort: currentSort,
            page: currentPage,
          }),
          categoryService.getAll()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentCategory, currentMinPrice, currentMaxPrice, currentSort, currentPage]);

  const handleFilterChange = (filters) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      ...filters,
      page: '1' // Reset to first page when filters change
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <ProductFilter
            categories={categories}
            selectedCategory={currentCategory}
            minPrice={currentMinPrice}
            maxPrice={currentMaxPrice}
            sort={currentSort}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.items?.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {products.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex gap-2">
                    {[...Array(products.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchParams({
                          ...Object.fromEntries(searchParams),
                          page: (i + 1).toString()
                        })}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === i + 1
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;