import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Wallpaper Store</h3>
            <p className="text-gray-600">
              Chuyên cung cấp các loại giấy dán tường cao cấp, đẹp, chất lượng.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-primary">
                  Danh mục
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Địa chỉ: 123 Street Name, City</li>
              <li>Email: contact@example.com</li>
              <li>Điện thoại: (123) 456-7890</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Đăng ký nhận tin</h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>© {new Date().getFullYear()} Wallpaper Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;