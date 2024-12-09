import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

function CartPage() {
  const { 
    cart, 
    isLoading, 
    updateCartItem, 
    removeFromCart,
    calculateTotals 
  } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart.mutate(itemId);
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

  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  const { subtotal, shipping, total } = calculateTotals();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow">
              {cart.items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center p-4 border-b last:border-b-0"
                >
                  <div className="w-20 h-20">
                    <img
                      src={item.product.image || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 ml-4">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-medium hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.variant && (
                        <span className="mr-4">
                          Phân loại: {item.variant}
                        </span>
                      )}
                      <span>
                        Đơn giá: {item.product.price.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50"
                        disabled={updateCartItem.isLoading}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50"
                        disabled={updateCartItem.isLoading}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Item Total */}
                    <div className="w-32 text-right">
                      <div className="font-medium">
                        {(item.product.price * item.quantity).toLocaleString()}đ
                      </div>
                    </div>
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      disabled={removeFromCart.isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>{shipping.toLocaleString()}đ</span>
                </div>
                {shipping === 0 && (
                  <div className="text-green-600 text-sm">
                    Bạn được miễn phí vận chuyển!
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{total.toLocaleString()}đ</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full text-center bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Tiến hành đặt hàng
                </Link>

                <Link
                  to="/products"
                  className="block w-full text-center text-primary py-3 rounded-lg border border-primary hover:bg-primary-50 transition-colors"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;