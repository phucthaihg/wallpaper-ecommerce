import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword.mutateAsync(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Kiểm tra email của bạn</h2>
          <p className="text-gray-600">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
            Vui lòng kiểm tra hộp thư đến.
          </p>
          <Link
            to="/login"
            className="inline-block text-primary hover:text-primary/80"
          >
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Quên mật khẩu?
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={forgotPassword.isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              {forgotPassword.isLoading ? 'Đang gửi...' : 'Gửi hướng dẫn'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-primary hover:text-primary/80"
            >
              Quay lại trang đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;