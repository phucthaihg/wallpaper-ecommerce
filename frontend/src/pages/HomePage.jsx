import { productService} from '../services/products';
import { categoryService } from '../services/categories';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/categories/CategoryCard';
import HeroSection from '../components/home/HeroSection';
import FeaturedSection from '../components/home/FeaturedSection';
import BenefitsSection from '../components/home/BenefitsSection';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, categories] = await Promise.all([
          productService.getAll(),
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
      
      <FeaturedSection 
        title="Danh mục nổi bật" 
        items={categories} 
        renderItem={(category) => (
          <CategoryCard key={category.id} category={category} />
        )}
      />
 
      <FeaturedSection 
        title="Sản phẩm nổi bật"
        items={products}
        renderItem={(product) => (
          <ProductCard key={product.id} product={product} />
        )}
      />

      <BenefitsSection />
    </div>
  );
}

export default HomePage;