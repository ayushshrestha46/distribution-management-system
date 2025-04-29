import { LifeBuoy, Mail, MessageSquare, Zap } from "lucide-react";
import { Footer, Nav } from "..";

export default function Support() {
  return (
    <>
      <Nav />

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <LifeBuoy className="w-8 h-8 text-[#4338CA]" />
          <h1 className="text-3xl font-bold text-gray-900">
            Distributor Support
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-[#4338CA]" />
              <h2 className="text-xl font-semibold">Email Support</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Need help with your distribution network? Our logistics experts
              respond within 24 hours.
            </p>
            <a
              href="mailto:support@distribpro.com"
              className="inline-flex items-center px-4 py-2 bg-[#4338CA] text-white rounded-md hover:bg-[#4338CA]/90 transition-colors"
            >
              Contact Us
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-semibold">Live Chat</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Get instant help from our distribution specialists during business
              hours.
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
              Coming Soon
            </button>
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-[#4338CA]" />
              <h2 className="text-xl font-semibold">FAQs</h2>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">
                  How do I add a new warehouse to my network?
                </h3>
                <p className="text-gray-700 mt-1">
                  Go to Locations → Warehouses → Add New. You'll need to provide
                  capacity, address, and operational details.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">
                  Is my distribution data secure?
                </h3>
                <p className="text-gray-700 mt-1">
                  Absolutely. We use military-grade encryption for all your
                  supply chain data and conduct regular security audits.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">
                  Can I integrate with existing ERP systems?
                </h3>
                <p className="text-gray-700 mt-1">
                  Yes, we support integration with most major ERP and warehouse
                  management systems through our API.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
