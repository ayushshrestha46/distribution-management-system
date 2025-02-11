import { BoxesIcon, Network, Truck, CheckCircle2 } from "lucide-react"; // Assuming you're using lucide-react for icons

export const Work = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="w-20 h-1 bg-blue-900 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our distribution management system streamlines your entire supply
            chain process from warehouse to delivery.
          </p>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProcessCard
            number="01"
            icon={<BoxesIcon className="w-8 h-8" />}
            title="Inventory Input"
            description="Seamless inventory tracking and management across all warehouses."
          />
          <ProcessCard
            number="02"
            icon={<Network className="w-8 h-8" />}
            title="Route Planning"
            description="AI-powered route optimization for efficient delivery."
          />
          <ProcessCard
            number="03"
            icon={<Truck className="w-8 h-8" />}
            title="Distribution"
            description="Real-time tracking and delivery management."
          />
          <ProcessCard
            number="04"
            icon={<CheckCircle2 className="w-8 h-8" />}
            title="Confirmation"
            description="Automated delivery confirmation and reporting."
          />
        </div>
      </div>
    </section>
  );
};

function ProcessCard({ number, icon, title, description }) {
  return (
    <div className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div className="text-blue-900 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
