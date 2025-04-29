import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Users,
  Edit2,
  X,
  Check,
  Camera,
} from "lucide-react";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/app/slices/userApiSlice";
import { toast } from "react-toastify";
import { Button } from "./ui/button";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { data, refetch, isLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateUserProfileMutation();
  const user = data?.user;

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "Add your phone number",
    address: "Add your address",
    joinDate: new Date().toLocaleString(),
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Tell us about yourself...",
    role: "user",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "John Doe",
        email: user.email || "john.doe@example.com",
        phone: user.phone || "Add your phone number",
        address: user.address || "Add your address",
        joinDate:
          user.createdAt?.toLocaleString() || new Date().toLocaleString(),
        avatar:
          user.avatar?.url ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        bio: user.bio || "Tell us about yourself...",
        role: user.role || "user",
      });
    }
  }, [user]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: profile,
  });

  useEffect(() => {
    reset(profile);
  }, [profile, reset]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await updateProfile(data).unwrap();
      if (response.success) {
        toast.success("Profile updated successfully.");
        refetch();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsEditing(false);
      setProfile(data);
    }
  };

  const handleCancel = () => {
    reset(profile);
    setIsEditing(false);
  };

  const StatCard = ({ icon: Icon, label, value, className = "" }) => (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 rounded-xl">
          <Icon className="w-7 h-7 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const InputField = ({
    icon: Icon,
    label,
    name,
    control,
    rules,
    type = "text",
  }) => (
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-indigo-50 rounded-xl">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      {isEditing ? (
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">{label}</label>
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
              <input
                {...field}
                type={type}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
              />
            )}
          />
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
          )}
        </div>
      ) : (
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-gray-900 font-medium">{profile[name]}</p>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="h-32 bg-gradient-to-r from-[#1E3A8A] to-[#3b1861]"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:space-x-6">
              <div className="relative group">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-44 h-44 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <div className="mt-6 sm:mt-0 text-center sm:text-left flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    {isEditing ? (
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="text-3xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent"
                          />
                        )}
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profile.name}
                      </h1>
                    )}
                    <div className="mt-2 flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                        {profile.role}
                      </span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500">
                        Joined {new Date(profile.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className=" transition-colors duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-center">
        </div>

        {/* Profile Information */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              <InputField
                icon={Mail}
                label="Email Address"
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                type="email"
              />
              <InputField
                icon={Phone}
                label="Phone Number"
                name="phone"
                control={control}
                rules={{
                  pattern: {
                    value: /^\+?[0-9\s-]+$/,
                    message: "Invalid phone number",
                  },
                }}
              />
              <InputField
                icon={MapPin}
                label="Address"
                name="address"
                control={control}
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              About Me
            </h2>
            {isEditing ? (
              <Controller
                name="bio"
                control={control}
                rules={{
                  required: "Bio is required",
                  maxLength: {
                    value: 200,
                    message: "Bio must be less than 200 characters",
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="Tell us about yourself..."
                  />
                )}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={updateLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
              {updateLoading ? (
                <span>Saving...</span>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
