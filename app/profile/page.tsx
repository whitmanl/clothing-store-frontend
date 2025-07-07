"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import Layout from "../components/Layout";
import useAuth, { ProtectRoute } from "../contexts/AuthProvider";
import { FormError } from "../interfaces/login";
import { isEmail, validPassword } from "../helpers/validation";
import useHttp from "../contexts/HttpProvider";
import { Profile } from "../interfaces/profile";
import useToast from "../contexts/ToastProvider";

function ProfilePage() {
  const { user, getUser } = useAuth();
  const { update } = useHttp();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Profile>({
    id: "",
    username: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormError>({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: FormError = {};
    if (!formData?.username) newErrors.username = "Username is required";
    if (!isEmail(formData?.email)) newErrors.email = "Invalid email format";
    if (!formData?.email) newErrors.email = "Email is required";
    if (formData?.password) {
      if (!validPassword(formData?.password))
        newErrors.password =
          "Must be more than 8 characters, including number, lowercase letter, uppercase letter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    e.preventDefault();
    if (!validateForm()) return;

    const res = await update(`/users/${user?.id}`, formData);
    if (res?.status) {
      showToast(res?.data?.message || "Please try again later", "error");
    } else {
      showToast("Successfully updated your profile!");
      setFormData((p) => ({ ...p, password: "" }));
      await getUser();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700">
                Username<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData?.username}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, username: e.target.value }))
                }
                className="input w-full"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData?.password || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, password: e.target.value }))
                }
                className="input w-full"
                placeholder="Leave blank to keep current"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-gray-700">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData?.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                className="input w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData?.firstName || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, firstName: e.target.value }))
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData?.lastName || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, lastName: e.target.value }))
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData?.address || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, address: e.target.value }))
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData?.phoneNumber || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phoneNumber: e.target.value }))
                }
                className="input w-full"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full text-white py-2 px-4 rounded"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default ProtectRoute(ProfilePage);
