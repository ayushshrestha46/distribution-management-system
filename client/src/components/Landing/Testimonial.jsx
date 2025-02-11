export const Testimonial = () => {
    return (
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The system has revolutionized our distribution process, reducing delivery times by 40%."
              author="John Smith"
              position="Logistics Manager, ABC Corp"
            />
            <TestimonialCard
              quote="Real-time tracking and analytics have given us unprecedented visibility into our operations."
              author="Sarah Johnson"
              position="Operations Director, XYZ Ltd"
            />
            <TestimonialCard
              quote="Customer satisfaction has improved significantly since implementing this system."
              author="Michael Brown"
              position="CEO, Global Logistics"
            />
          </div>
        </div>
      </section>
    );
  };
  
  function TestimonialCard({ quote, author, position }) {
    return (
      <div className="p-6 bg-white bg-opacity-10 rounded-lg">
        <p className="text-lg mb-6 italic">"{quote}"</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-blue-200">{position}</p>
        </div>
      </div>
    );
  }
  