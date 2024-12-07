import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../hooks/useAuth';

function UserMenu({ user }) {
 const { logout } = useAuth();

 return (
   <Menu as="div" className="relative">
     {/* User Button */}
     <Menu.Button className="flex items-center gap-2 hover:text-primary">
       {user.avatar ? (
         <img 
           src={user.avatar} 
           alt={user.firstName}
           className="h-8 w-8 rounded-full object-cover" 
         />
       ) : (
         <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
           <span className="text-sm font-medium">
             {user.firstName[0]}
           </span>
         </div>
       )}
       <span className="hidden md:block">{user.firstName}</span>
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
       <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
         <div className="py-1">
           <Menu.Item>
             {({ active }) => (
               <Link
                 to="/profile"
                 className={`${
                   active ? 'bg-gray-100' : ''
                 } block px-4 py-2 text-sm text-gray-700`}
               >
                 Tài khoản
               </Link>
             )}
           </Menu.Item>
           <Menu.Item>
             {({ active }) => (
               <Link
                 to="/orders"
                 className={`${
                   active ? 'bg-gray-100' : ''
                 } block px-4 py-2 text-sm text-gray-700`}
               >
                 Đơn hàng
               </Link>
             )}
           </Menu.Item>
           {user.role === 'admin' && (
             <Menu.Item>
               {({ active }) => (
                 <Link
                   to="/admin"
                   className={`${
                     active ? 'bg-gray-100' : ''
                   } block px-4 py-2 text-sm text-gray-700`}
                 >
                   Quản trị
                 </Link>
               )}
             </Menu.Item>
           )}
           <Menu.Item>
             {({ active }) => (
               <button
                 onClick={logout}
                 className={`${
                   active ? 'bg-gray-100' : ''
                 } block w-full text-left px-4 py-2 text-sm text-red-600`}
               >
                 Đăng xuất
               </button>
             )}
           </Menu.Item>
         </div>
       </Menu.Items>
     </Transition>
   </Menu>
 );
}

export default UserMenu;