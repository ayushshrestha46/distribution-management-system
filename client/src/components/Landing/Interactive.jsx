import { useState } from "react";
import {
  Zap,
  Layers,
  Network,
  BarChart,
  PieChart,
  TrendingUp,
  Globe,
  Boxes,
  Settings,
} from "lucide-react";

export const Interactive = () => {
  const [activeTab, setActiveTab] = useState("features");

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <div className="w-20 h-1 bg-blue-900 mx-auto mb-8"></div>
          <div className="flex justify-center space-x-4 mb-12">
            <TabButton
              active={activeTab === "features"}
              onClick={() => setActiveTab("features")}
              text="Core Features"
            />
            <TabButton
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
              text="Analytics"
            />
            <TabButton
              active={activeTab === "integration"}
              onClick={() => setActiveTab("integration")}
              text="Integration"
            />
          </div>
        </div>

        {activeTab === "features" && (
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-blue-900" />}
              title="Tracking"
              description="Monitor your shipments in time with precise location tracking and status updates."
            />
            <FeatureCard
              icon={<Layers className="w-12 h-12 text-blue-900" />}
              title="Inventory Control"
              description="Manage stock levels, automate reordering, and optimize warehouse space."
            />
            <FeatureCard
              icon={<Network className="w-12 h-12 text-blue-900" />}
              title="Route Planning"
              description="AI-powered route optimization for efficient delivery and reduced costs."
            />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart className="w-12 h-12 text-blue-900" />}
              title="Performance Metrics"
              description="Track KPIs and performance metrics with customizable dashboards."
            />
            <FeatureCard
              icon={<PieChart className="w-12 h-12 text-blue-900" />}
              title="Demand Forecasting"
              description="Predict future demand patterns using advanced analytics."
            />
            <FeatureCard
              icon={<TrendingUp className="w-12 h-12 text-blue-900" />}
              title="Cost Analysis"
              description="Detailed cost breakdowns and optimization recommendations."
            />
          </div>
        )}

        {activeTab === "integration" && (
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="w-12 h-12 text-blue-900" />}
              title="API Integration"
              description="Seamless integration with your existing systems and third-party services."
            />
            <FeatureCard
              icon={<Boxes className="w-12 h-12 text-blue-900" />}
              title="Multi-platform Support"
              description="Works across desktop, mobile, and web platforms."
            />
            <FeatureCard
              icon={<Settings className="w-12 h-12 text-blue-900" />}
              title="Custom Workflows"
              description="Create custom workflows tailored to your business needs."
            />
          </div>
        )}
      </div>
    </section>
  );
};

function TabButton({ active, onClick, text }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full transition-colors ${
        active
          ? "bg-blue-900 text-white"
          : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
    >
      {text}
    </button>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
