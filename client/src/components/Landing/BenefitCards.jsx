import { Clock, TrendingUp, Shield, Smartphone } from "lucide-react"; // Assuming you are using lucide-react icons

export const BenefitCards = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our System
          </h2>
          <div className="w-20 h-1 bg-blue-900 mx-auto"></div>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
          <BenefitCard
            icon={<Clock className="w-6 h-6 text-blue-900" />}
            title="Time Efficiency"
            description="Reduce delivery times by up to 30% with our smart routing algorithms."
          />
          <BenefitCard
            icon={<TrendingUp className="w-6 h-6 text-blue-900" />}
            title="Cost Reduction"
            description="Lower operational costs by optimizing routes and resources."
          />
          <BenefitCard
            icon={<Shield className="w-6 h-6 text-blue-900" />}
            title="Enhanced Security"
            description="Advanced tracking and security features for your shipments."
          />
          <BenefitCard
            icon={<Smartphone className="w-6 h-6 text-blue-900" />}
            title="Mobile Access"
            description="Manage your distribution network from anywhere, anytime."
          />
        </div>
      </div>
    </section>
  );
};

function BenefitCard({ icon, title, description }) {
  return (
    <div className="flex items-start p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex-shrink-0 mr-4">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
