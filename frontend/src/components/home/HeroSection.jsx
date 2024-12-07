import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="relative py-20 bg-gray-900 text-white">
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Hero background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trang trí không gian sống của bạn
          </h1>
          <p className="text-lg mb-8">
            Khám phá bộ sưu tập giấy dán tường độc đáo và sang trọng
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;