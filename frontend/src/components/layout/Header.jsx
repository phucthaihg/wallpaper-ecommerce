import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import CartDropdown from './CartDropdown';
import UserMenu from './UserMenu';
import { Popover } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Header() {
  const { user } = useAuth();

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Danh mục', href: '/categories' },
    { name: 'Giới thiệu', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <CartDropdown />
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile menu button */}
            <Popover className="md:hidden">
              {({ open }) => (
                <>
                  <Popover.Button className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Popover.Button>

                  <Popover.Panel className="absolute top-16 right-0 left-0 bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </Popover.Panel>
                </>
              )}
            </Popover>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;