import { useState, useEffect } from 'react';

import { productService} from '../../services/products';
import { categoryService } from '../../services/categories';
import ProductCard from '../../components/products/ProductCard';
import CategoryCard from '../../components/categories/CategoryCard';
import HeroSection from '../../components/home/HeroSection';
import FeaturedSection from '../../components/home/FeaturedSection';
import BenefitsSection from '../../components/home/BenefitsSection';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, categories] = await Promise.all([
          productService.getFeatured(),
          categoryService.getAll()
        ]);
        setFeaturedProducts(products);
        setFeaturedCategories(categories);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <HeroSection />
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Danh mục nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <BenefitsSection />
    </div>
  );
}

export default HomePage;