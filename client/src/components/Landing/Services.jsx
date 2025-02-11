import { ChevronRight } from "lucide-react"; // Assuming you want to use this icon.

export const ServicesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Distribution Solutions
          </h2>
          <div className="w-20 h-1 bg-blue-900 mx-auto"></div>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            image="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            title="Warehouse Management"
            description="Optimize warehouse operations with advanced inventory tracking and management."
          />
          <ServiceCard
            image="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            title="Route Optimization"
            description="Smart routing algorithms for efficient delivery and distribution."
          />
          <ServiceCard
            image="https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            title="Supply Chain Analytics"
            description="Real-time analytics and insights for better decision making."
          />
        </div>
      </div>
    </section>
  );
};

function ServiceCard({ image, title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <a
          href="#"
          className="text-blue-900 font-semibold flex items-center hover:text-blue-700"
        >
          Learn More <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
}
