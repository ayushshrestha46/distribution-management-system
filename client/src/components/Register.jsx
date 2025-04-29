import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// Adjust import based on your file structure
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "../app/slices/userApiSlice";
import { toast } from "react-toastify";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  PhoneCall,
  MapPin,
  Package,
} from "lucide-react"; // Added missing imports
import { useState } from "react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password"); // Watch the password field for validation
  const navigate = useNavigate();
  const [storeRegister, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data) => {
    try {
      const res = await storeRegister(data).unwrap(); // Use `.unwrap()` to handle success/error responses
      console.log(res);
      navigate("/activate", {
        state: { activationToken: res.activationToken },
      });
      toast.success("Please check your mail");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1935"
          alt="Warehouse"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#6366F1]/80 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white space-y-6 max-w-xl">
            <div className="flex items-center gap-3">
              <Package size={40} className="text-[#0EA5E9]" />
              <h1 className="text-3xl font-bold">DMS</h1>
            </div>
            <p className="text-xl text-blue-100">
              Transform your supply chain with our intelligent distribution
              management system.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create an account
            </h2>
            <p className="text-gray-800">
              Get started with your free account today <br />
              <span className="text-sm text-gray-400">
                Register your shop and find your nearest distributors
              </span>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 8,
                      message: "Name must be at least 8 characters",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </Label>
              <div className="relative">
                <PhoneCall
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <Input
                  type="number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^9\d{9}$/, // Ensures it starts with 98 and has 10 digits
                      message:
                        "Phone number must start with 9 and be 10 digits long",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="9815000001"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Location
              </Label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  {...register("address", {
                    required: "Shop location is required",
                    pattern: {
                      value: /^[A-Za-z\s,]+$/, // Allows only letters, spaces, and commas
                      message:
                        "Shop location must contain only letters, spaces, and commas",
                    },
                    minLength: {
                      value: 3,
                      message:
                        "Shop location must be at least 3 characters long",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Bagbazar, Kathmandu"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-2 px-4 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create account"}
            </Button>

            {/* Already Have an Account? */}
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
