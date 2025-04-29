// TermsOfService.jsx
import { ScrollText, ShieldCheck, Package, Truck } from "lucide-react";
import { Footer, Nav } from "..";

export default function TermsOfService() {
  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <ScrollText className="w-8 h-8 text-[#4338CA]" />
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-gray-600 mb-6">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4338CA]" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700">
              By using our distributor management system ("Service"), you agree
              to these Terms of Service. If you disagree, please refrain from
              using our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#4338CA]" />
              2. Service Description
            </h2>
            <p className="text-gray-700">
              Our Service provides comprehensive tools for inventory management,
              distribution network optimization, and supply chain analytics. We
              help streamline your logistics operations and improve delivery
              efficiency.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#4338CA]" />
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You must provide accurate inventory and distribution data</li>
              <li>You are responsible for maintaining warehouse information</li>
              <li>You agree not to use the Service for illegal shipments</li>
              <li>You must comply with all applicable trade regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              4. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              Our Service is provided "as is". We are not liable for any
              operational disruptions, delivery delays, or inventory
              discrepancies resulting from your use of the system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Changes to Terms</h2>
            <p className="text-gray-700">
              We may modify these terms at any time. Continued use after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
