// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useActivateMutation } from "../app/slices/userApiSlice";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";

// import { toast } from "react-toastify";

// const Activate = () => {
//   const { control, handleSubmit } = useForm();

//   const location = useLocation();
//   const activationToken = location.state?.activationToken;
//   const [activateAccount, { isLoading }] = useActivateMutation();
//   const navigate = useNavigate();
//   const onSubmit = async (data) => {
//     if (!activationToken) {
//       alert("Activation token is missing.");
//       return;
//     }

//     // Combine the activation code from user input and token from location state
//     const payload = {
//       activation_code: data.otp,
//       activation_token: activationToken,
//     };
//     console.log(payload);
//     try {
//       const response = await activateAccount(payload).unwrap();
//       if (response.success) {
//         navigate("/login");
//         // Perform further actions like redirecting to login
//         toast.success("Registration was successfull");
//       }
//     } catch (err) {
//       const errorMessage =
//         err?.data?.message.charAt(0).toUpperCase() +
//         err?.data?.message.slice(1);
//       toast.error(errorMessage || "Activation failed. Please try again.");
//     }
//   };

//   return (
//     <>
// <div
//   className="absolute inset-0 overflow-hidden mix-blend-multiply"
//   style={{
//     backgroundImage:
//       "linear-gradient(to right, #4c4fcd, #4338CA), url('https://images.pexels.com/photos/4483608/pexels-photo-4483608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",

//     backgroundBlendMode: "multiply",
//   }}
// ></div>

//       <div className="flex items-center h-screen justify-center  ">
//       <Card className="lg:w-1/4 text-center  z-10">

//           <CardHeader>
//             <CardTitle>Verify Your Email</CardTitle>
//             <p>Please Enter The Verification Code</p>
//           </CardHeader>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             <CardContent className="flex justify-center">
//               <Controller
//                 name="otp"
//                 control={control}
//                 rules={{
//                   required: "OTP is required",
//                   validate: (value = "") =>
//                     value.length === 6 || "OTP must be exactly 6 digits",
//                 }}
//                 render={({
//                   field: { onChange, value },
//                   fieldState: { error },
//                 }) => (
//                   <div>
//                     <InputOTP
//                       maxLength={6}
//                       onChange={onChange}
//                       value={value || ""}
//                     >
//                       <InputOTPGroup>
//                         <InputOTPSlot index={0} />
//                         <InputOTPSlot index={1} />
//                         <InputOTPSlot index={2} />
//                         <InputOTPSlot index={3} />
//                         <InputOTPSlot index={4} />
//                         <InputOTPSlot index={5} />
//                       </InputOTPGroup>
//                     </InputOTP>
//                     {error && (
//                       <p className="error-message text-red-500">
//                         {error.message}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               />
//             </CardContent>
//             <CardFooter>
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Submitting" : "Submit"}
//               </Button>
//             </CardFooter>
//           </form>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default Activate;

import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useActivateMutation } from "../app/slices/userApiSlice";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "react-toastify";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const Activate = () => {
  const { control, handleSubmit } = useForm();
  const location = useLocation();
  const activationToken = location.state?.activationToken;
  const [activateAccount, { isLoading }] = useActivateMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!activationToken) {
      toast.error("Activation token is missing.");
      return;
    }

    const payload = {
      activation_code: data.otp,
      activation_token: activationToken,
    };

    try {
      const response = await activateAccount(payload).unwrap();
      if (response.success) {
        navigate("/login");
        toast.success("Registration was successful");
      }
    } catch (err) {
      const errorMessage =
        err?.data?.message.charAt(0).toUpperCase() +
        err?.data?.message.slice(1);
      toast.error(errorMessage || "Activation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?q=80&w=2070"
          alt="Email Verification"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#6366F1]/80 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white space-y-6 max-w-xl">
            <div className="flex items-center gap-3">
              <Mail size={40} className="text-[#FF8E1F]" />
              <h1 className="text-3xl font-bold">Email Verification</h1>
            </div>
            <p className="text-xl text-blue-100">
              We've sent a verification code to your email address. Please check
              your inbox and enter the code below.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back
          </button>

          <div className="text-center space-y-6">
            {/* Verification Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-[#FF8E1F]/10 animate-pulse"></div>
                <ShieldCheck size={64} className="text-[#1E3A8A]  hover:bg-[#1E3A8A]/90" />
                <CheckCircle2
                  size={24}
                  className="absolute -right-2 -bottom-2 text-green-500 bg-white rounded-full"
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Verify Your Email
              </h2>
              <p className="text-gray-600 mt-2">
                Please enter the 6-digit verification code sent to your email
                address
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <Controller
                name="otp"
                control={control}
                rules={{
                  required: "OTP is required",
                  validate: (value = "") =>
                    value.length === 6 || "OTP must be exactly 6 digits",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className="space-y-2 flex flex-col items-center">
                    <InputOTP
                      maxLength={6}
                      onChange={onChange}
                      value={value || ""}
                      className="gap-2 flex justify-center"
                    >
                      <InputOTPGroup className="flex justify-center gap-2">
                        <InputOTPSlot
                          index={0}
                          className="rounded-lg border-gray-300"
                        />
                        <InputOTPSlot
                          index={1}
                          className="rounded-lg border-gray-300"
                        />
                        <InputOTPSlot
                          index={2}
                          className="rounded-lg border-gray-300"
                        />
                        <InputOTPSlot
                          index={3}
                          className="rounded-lg border-gray-300"
                        />
                        <InputOTPSlot
                          index={4}
                          className="rounded-lg border-gray-300"
                        />
                        <InputOTPSlot
                          index={5}
                          className="rounded-lg border-gray-300"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                    {error && (
                      <p className="text-sm text-red-600 text-center">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-[#1E3A8A]  hover:bg-[#1E3A8A]/90 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    Verify Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Activate;
