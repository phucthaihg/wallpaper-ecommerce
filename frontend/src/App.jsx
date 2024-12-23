import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import HomePage from './pages/shop/HomePage';
import ProductsPage from './pages/shop/ProductsPage';
import CategoriesPage from './pages/shop/CategoriesPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CategoryDetailPage from './pages/shop/CategoryDetailPage';
import CartPage from './pages/shop/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ProfilePage from './pages/user/ProfilePage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboardPage';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminProducts from './pages/admin/products/AdminProducts';
import AdminCategories from './pages/admin/categories/AdminCategoriesold';

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
            <Route index element={<HomePage />} />

            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />

            <Route path="categories/:id" element={<CategoryDetailPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />


            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="cart" element={<CartPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute role="admin" >
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products/*" element={<AdminProducts />} />
            <Route path="categories/*" element={<AdminCategories />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;