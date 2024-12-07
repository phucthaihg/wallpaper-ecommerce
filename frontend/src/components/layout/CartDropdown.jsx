import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';

function CartDropdown() {
 const { cart, removeFromCart } = useCart();

 return (
   <Menu as="div" className="relative">
     {/* Cart Button */}
     <Menu.Button className="flex items-center hover:text-primary">
       <div className="relative">
         <ShoppingBagIcon className="h-6 w-6" />
         {cart?.items?.length > 0 && (
           <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
             {cart.items.length}
           </span>
         )}
       </div>
     </Menu.Button>

     {/* Dropdown Panel */}
     <Transition
       as={Fragment}
       enter="transition ease-out duration-200"
       enterFrom="opacity-0 scale-95"
       enterTo="opacity-100 scale-100"
       leave="transition ease-in duration-150"
       leaveFrom="opacity-100 scale-100"
       leaveTo="opacity-0 scale-95"
     >
       <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
         <div className="p-4">
           <h3 className="text-lg font-semibold mb-4">Giỏ hàng</h3>

           {!cart?.items?.length ? (
             <p className="text-gray-500 text-center py-4">
               Giỏ hàng trống
             </p>
           ) : (
             <>
               {/* Cart Items */}
               <div className="space-y-4 max-h-80 overflow-auto">
                 {cart.items.map((item) => (
                   <div key={item.id} className="flex gap-4">
                     <img
                       src={item.product.image}
                       alt={item.product.name}
                       className="w-16 h-16 object-cover rounded"
                     />
                     <div className="flex-1">
                       <h4 className="font-medium">{item.product.name}</h4>
                       <p className="text-sm text-gray-500">
                         {item.quantity} x {item.product.price}đ
                       </p>
                       <button
                         onClick={() => removeFromCart.mutate(item.id)}
                         className="text-red-500 text-sm hover:text-red-600"
                       >
                         Xóa
                       </button>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Cart Summary */}
               <div className="mt-4 pt-4 border-t">
                 <div className="flex justify-between font-medium">
                   <span>Tổng cộng</span>
                   <span>{cart.total}đ</span>
                 </div>
                 <Link
                   to="/cart"
                   className="mt-4 block w-full py-2 text-center bg-primary text-white rounded-md hover:bg-primary/90"
                 >
                   Xem giỏ hàng
                 </Link>
               </div>
             </>
           )}
         </div>
       </Menu.Items>
     </Transition>
   </Menu>
 );
}

export default CartDropdown;