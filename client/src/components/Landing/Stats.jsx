import { motion } from "framer-motion";

export const StatsSection = () => {
  return (
    <section className="bg-blue-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCard number="1M+" text="Orders Processed" />
          <StatCard number="99.9%" text="Delivery Accuracy" />
          <StatCard number="50+" text="Distribution Centers" />
          <StatCard number="24/7" text="System Uptime" />
        </div>
      </div>
    </section>
  );
};

function StatCard({ number, text }) {
  return (
    <motion.div
      className="p-6 rounded-lg bg-blue-800 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-4xl font-bold mb-2"
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {number}
      </motion.div>
      <div className="text-blue-100">{text}</div>
    </motion.div>
  );
}
