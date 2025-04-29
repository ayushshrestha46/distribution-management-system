import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const user = useSelector((state) => state.auth?.user?.role) ;
  const navigator = useNavigate();

  return (
    <>
      <div
        className="relative bg-cover bg-center h-[600px] md:px-10"
        id="home"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Smart Distribution Management Solutions
            </h1>
            <p className="text-xl mb-8">
              Streamline your supply chain with our advanced distribution
              management system. Real-time tracking, inventory management, and
              logistics optimization.
            </p>
            <div className="flex space-x-4">
              {user === "shop" ? (
                <button
                  className="bg-blue-900 text-white px-8 py-3 rounded flex items-center hover:bg-blue-800 transition-colors"
                  onClick={() => navigator("/dashboard")}
                >
                  Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              ) : (
                <button
                  className="bg-blue-900 text-white px-8 py-3 rounded flex items-center hover:bg-blue-800 transition-colors"
                  onClick={() => navigator("/login")}
                >
                  Our Solutions <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
