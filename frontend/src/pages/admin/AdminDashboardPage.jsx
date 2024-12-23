import { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { 
 HomeIcon, 
 ShoppingBagIcon, 
 FolderIcon,
 UsersIcon,
 ClipboardDocumentListIcon 
} from '@heroicons/react/24/outline';
import AdminProducts from './products/AdminProducts';
import AdminCategories from './categories/AdminCategoriesold';
import AdminUsers from './users/AdminUsers';

function AdminDashboardPage() {
 const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 const location = useLocation();

 const navigation = [
   { name: 'Tổng quan', icon: HomeIcon, href: '/admin' },
   { name: 'Sản phẩm', icon: ShoppingBagIcon, href: '/admin/products' },
   { name: 'Danh mục', icon: FolderIcon, href: '/admin/categories' },
   { name: 'Đơn hàng', icon: ClipboardDocumentListIcon, href: '/admin/orders' },
   { name: 'Người dùng', icon: UsersIcon, href: '/admin/users' }
 ];

 const isActive = (path) => {
   return location.pathname === path || location.pathname.startsWith(`${path}/`);
 };

 return (
   <div className="min-h-screen bg-gray-100">
     {/* Sidebar */}
     <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform ${
       isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
     } transition-transform duration-300 ease-in-out`}>
       <div className="h-16 flex items-center justify-between px-4 border-b">
         <h1 className="text-lg font-bold">Admin Dashboard</h1>
         <button onClick={() => setIsSidebarOpen(false)}>
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>
       </div>

       <nav className="mt-4">
         {navigation.map((item) => (
           <Link
             key={item.name}
             to={item.href}
             className={`flex items-center px-4 py-3 text-sm font-medium ${
               isActive(item.href)
                 ? 'text-primary bg-primary/5'
                 : 'text-gray-700 hover:text-primary hover:bg-gray-50'
             }`}
           >
             <item.icon className="h-5 w-5 mr-3" />
             {item.name}
           </Link>
         ))}
       </nav>
     </div>

     {/* Main Content */}
     <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
       {/* Top Bar */}
       <div className="h-16 bg-white border-b px-4 flex items-center">
         {!isSidebarOpen && (
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="mr-4"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
         )}
         <h2 className="text-lg font-semibold">
           {navigation.find(item => isActive(item.href))?.name || 'Tổng quan'}
         </h2>
       </div>

       {/* Content */}
       <div className="p-6">
         <Routes>
           <Route index element={<AdminOverview />} />
           <Route path="products/*" element={<AdminProducts />} />
           <Route path="categories/*" element={<AdminCategories />} />
           <Route path="orders/*" element={<AdminOrders />} />
           <Route path="users/*" element={<AdminUsers />} />
         </Routes>
       </div>
     </div>
   </div>
 );
}

// Overview Component
function AdminOverview() {
 const stats = [
   { name: 'Tổng đơn hàng', value: '156', change: '+12%', changeType: 'increase' },
   { name: 'Doanh thu', value: '32.5M', change: '+8%', changeType: 'increase' },
   { name: 'Khách hàng mới', value: '24', change: '-3%', changeType: 'decrease' },
   { name: 'Sản phẩm hết hàng', value: '5', change: '+2', changeType: 'increase' }
 ];

 return (
   <div>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       {stats.map((stat) => (
         <div 
           key={stat.name} 
           className="bg-white rounded-lg p-6 shadow-sm"
         >
           <p className="text-sm font-medium text-gray-600">{stat.name}</p>
           <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
           <p className={`mt-2 text-sm ${
             stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
           }`}>
             {stat.change}
           </p>
         </div>
       ))}
     </div>

     {/* You can add more sections like recent orders, low stock alerts, etc. */}
   </div>
 );
}

// Placeholder components for other sections

function AdminOrders() {
 return <div>Orders Management</div>;
}


export default AdminDashboardPage;