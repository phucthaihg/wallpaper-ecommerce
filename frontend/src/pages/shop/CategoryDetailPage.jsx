import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categoryService } from '../../services/categories';
import { productService } from '../../services/products';
import ProductCard from '../../components/products/ProductCard';

function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryData, productsData] = await Promise.all([
          categoryService.getById(id),
          productService.getByCategory(id)
        ]);
        
        setCategory(categoryData);
        setProducts(productsData.products);
      } catch (err) {
        setError('Failed to load category');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!category) return <div>Category not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <div className="relative h-64 rounded-lg overflow-hidden mb-4">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            {category.description && (
              <p className="mt-2 text-white/90">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default CategoryDetailPage;