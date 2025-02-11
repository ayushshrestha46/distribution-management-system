import {
  Package,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package /> DMS
            </h3>
            <p className="text-gray-400">
              Your complete solution for distribution management.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Mail size={18} /> support@dms.com
              </p>
              <p className="flex items-center gap-2">
                <Phone size={18} /> + 1231231212
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">
                <Facebook />
              </a>
              <a href="#" className="hover:text-blue-400">
                <Twitter />
              </a>
              <a href="#" className="hover:text-blue-400">
                <Instagram />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; 2024 Distribution Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
