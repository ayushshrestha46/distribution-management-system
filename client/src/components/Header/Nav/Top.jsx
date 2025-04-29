import { Mail, Phone } from "lucide-react";

const Top = () => {
  return (
    <>
      <div className="bg-blue-900 text-white py-2 md:px-10">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>+977-1-4784678</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>info@distro.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-blue-200">
              Contact
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Top;
