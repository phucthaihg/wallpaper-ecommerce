import { TruckIcon, ShieldCheckIcon, PhoneIcon } from '@heroicons/react/24/outline';

function BenefitsSection() {
  const benefits = [
    {
      icon: TruckIcon,
      title: "Giao hàng miễn phí",
      description: "Cho đơn hàng từ 1 triệu đồng"
    },
    {
      icon: ShieldCheckIcon,
      title: "Bảo hành 12 tháng",
      description: "Đổi trả trong 30 ngày"
    },
    {
      icon: PhoneIcon,
      title: "Tư vấn 24/7",
      description: "Hỗ trợ khách hàng mọi lúc"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <benefit.icon className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;