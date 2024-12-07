import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/format';

function ProductCard({ product }) {
  const { addToCart, isAddingToCart } = useCart();

  const handleAddToCart = () => {
    addToCart.mutate({ 
      productId: product.id, 
      quantity: 1 
    });
  };

  return (
    <div className="group">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="mt-4 w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
      >
        {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
      </button>
    </div>
  );
}

export default ProductCard;