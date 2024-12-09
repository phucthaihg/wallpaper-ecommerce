import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../../services/products';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/format';

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getById(id);
        setProduct(data);
        // Initialize selected specifications
       const initialSpecs = {};
       data.specifications.forEach(spec => {
         initialSpecs[spec.template.key] = spec.value;
       });
       setSelectedSpecs(initialSpecs);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart.mutate({
      productId: product.id,
      quantity,
      specifications: selectedSpecs
    });
  };

  const renderSpecificationInput = (spec) => {
    const { template } = spec;

    switch (template.type) {
      case 'select':
        return (
          <select
            value={selectedSpecs[template.key] || spec.value}
            onChange={(e) => setSelectedSpecs(prev => ({
              ...prev,
              [template.key]: e.target.value
            }))}
            className="w-full px-3 py-2 border rounded-md"
          >
            {template.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            value={selectedSpecs[template.key] || spec.value}
            onChange={(e) => setSelectedSpecs(prev => ({
              ...prev,
              [template.key]: e.target.value
            }))}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          />
        );
      default:
        return (
          <input
            type="text"
            value={selectedSpecs[template.key] || spec.value}
            onChange={(e) => setSelectedSpecs(prev => ({
              ...prev,
              [template.key]: e.target.value
            }))}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 
                    ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-gray-500 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Specifications */}
          {Object.keys(product.specifications).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông số kỹ thuật</h3>
              {product.specifications.map((spec) => (
               <div key={spec.id}>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   {spec.template.name}
                   {spec.template.required && <span className="text-red-500">*</span>}
                 </label>
                 {renderSpecificationInput(spec)}
                 {spec.template.description && (
                   <p className="mt-1 text-sm text-gray-500">{spec.template.description}</p>
                 )}
               </div>
             ))}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="w-24 px-3 py-2 border rounded-md"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isLoading}
            className="w-full py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary/90 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addToCart.isLoading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
          </button>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-4">
            {product.brand && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Thương hiệu</h3>
                <p className="mt-1">{product.brand}</p>
              </div>
            )}
            {product.warranty && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Bảo hành</h3>
                <p className="mt-1">{product.warranty}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
