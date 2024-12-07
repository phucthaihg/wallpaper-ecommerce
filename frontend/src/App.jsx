import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
//import ProductsPage from './pages/ProductsPage';
//import ProductDetailPage from './pages/ProductDetailPage';
//import CartPage from './pages/CartPage';
//import LoginPage from './pages/LoginPage';
//import RegisterPage from './pages/RegisterPage';
//import ProfilePage from './pages/ProfilePage';
//import AdminDashboard from './pages/admin/Dashboard';
//import PrivateRoute from './components/auth/PrivateRoute';

const queryClient = new QueryClient({
 defaultOptions: {
   queries: {
     staleTime: 1000 * 60 * 5, // 5 minutes
     cacheTime: 1000 * 60 * 30, // 30 minutes
   },
 },
});

function App() {
 return (
   <QueryClientProvider client={queryClient}>
     <Router>
       <Routes>
         <Route path="/" element={<Layout />}>
           {/* Public Routes */}
           <Route index element={<HomePage />} />{/** 
           <Route path="products" element={<ProductsPage />} />
           <Route path="products/:id" element={<ProductDetailPage />} />
           <Route path="login" element={<LoginPage />} />
           <Route path="register" element={<RegisterPage />} />*/}
           
           {/* Protected Routes */} {/** 
           <Route element={<PrivateRoute />}>
             <Route path="cart" element={<CartPage />} />
             <Route path="profile" element={<ProfilePage />} />
           </Route>*/}

           {/* Admin Routes */} {/** 
           <Route element={<PrivateRoute role="admin" />}>
             <Route path="admin/*" element={<AdminDashboard />} />
           </Route>*/}
         </Route>
       </Routes>
     </Router>
   </QueryClientProvider>
 );
}

export default App;