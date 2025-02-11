import { Settings, Globe, Package, BarChart3 } from 'lucide-react'; // Assuming you're using lucide-react icons

export const Seamless = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Seamless Integration</h2>
            <div className="w-20 h-1 bg-blue-900 mb-8"></div>
            <p className="text-gray-600 mb-8">
              Our system integrates seamlessly with your existing infrastructure and popular business tools.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <IntegrationFeature icon={<Settings />} text="ERP Systems" />
              <IntegrationFeature icon={<Globe />} text="E-commerce Platforms" />
              <IntegrationFeature icon={<Package />} text="Warehouse Systems" />
              <IntegrationFeature icon={<BarChart3 />} text="Analytics Tools" />
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Integration Dashboard"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

function IntegrationFeature({ icon, text }) {
  return (
    <div className="flex items-center space-x-2 text-gray-700">
      <div className="text-blue-900">{icon}</div>
      <span>{text}</span>
    </div>
  );
}
