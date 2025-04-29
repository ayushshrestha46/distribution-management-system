import { Lock, Package, Truck, Mail } from "lucide-react";
import { Footer, Nav } from "../";

export default function PrivacyPolicy1() {
  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto p-6 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-8 h-8 text-[#4338CA]" />
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-gray-600 mb-6">
            Effective Date: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 mt-0.5 text-[#4338CA] flex-shrink-0" />
                <p>
                  <strong>Inventory Data:</strong> Product details, stock
                  levels, and supply chain information you enter.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 mt-0.5 text-[#4338CA] flex-shrink-0" />
                <p>
                  <strong>Distribution Data:</strong> Shipping details, delivery
                  routes, and logistics information.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-[#4338CA] flex-shrink-0" />
                <p>
                  <strong>Account Information:</strong> Business email and
                  contact details when you register.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To manage and optimize your distribution network</li>
              <li>To provide inventory tracking and forecasting</li>
              <li>For route optimization and logistics planning</li>
              <li>To communicate with you about your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Data Security</h2>
            <p className="text-gray-700">
              We implement enterprise-grade security measures to protect your
              distribution data. All supply chain information is encrypted both
              in transit and at rest.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              4. Third-Party Services
            </h2>
            <p className="text-gray-700">
              We integrate with logistics providers and warehouse management
              systems that may process your data. These services have their own
              privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-gray-700">
              You can request access to or deletion of your business data at any
              time by contacting our support team.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
