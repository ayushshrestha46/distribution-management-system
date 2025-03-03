import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Eye, EyeOff, X } from "lucide-react"; // Icons for password visibility and close
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "@/app/slices/userApiSlice";
import { toast } from "react-toastify";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [showPreviousPassword, setShowPreviousPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [changeData, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    try {
      const res = await changeData(data);
      reset();
      setOpen(false);
      toast.success(res.data?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) return;
        setOpen(isOpen);
      }}
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
      onEscapeKeyDown={(e) => {
        e.preventDefault();
      }}
    >
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            Change Password
          </DialogTitle>
          <button
            className="text-gray-500 hover:text-indigo-600 hover:bg-gray-200 hover:p-0.1"
            onClick={() => navigate("/")} // Navigate to the root ("/") when clicked
          >
            <X className="w-6" />
          </button>
        </DialogHeader>
        <style>
          {`
    .top-4   {
      display: none;
    }
  `}
        </style>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Previous Password
            </label>
            <div className="relative">
              <input
                type={showPreviousPassword ? "text" : "password"}
                {...register("currentPassword", {
                  required: "This field is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter previous password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                onClick={() => setShowPreviousPassword(!showPreviousPassword)}
              >
                {showPreviousPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "This field is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "This field is required",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
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
            {isLoading ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
