"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { FormError, FormData } from "../interfaces/login";
import { isEmail, validPassword } from "../helpers/validation";
import useHttp from "../contexts/HttpProvider";
import useAuth from "../contexts/AuthProvider";
import useToast from "../contexts/ToastProvider";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const { post } = useHttp();

  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormError>({});

  const validateForm = () => {
    const newErrors: FormError = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (isSignup) {
      if (!validPassword(formData.password)) newErrors.password = "Must be more than 8 characters, including number, lowercase letter, uppercase letter";
      if (!isEmail(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.email) newErrors.email = "Email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isSignup) {
      const signupRes = await post("/users/signup", formData);
      if (signupRes?.status) {
        showToast(signupRes?.data?.message || "Please try again later", "error");
      } else {
        setIsSignup(false);
      }
    } else {
      const loginRes = await login(formData.username, formData.password);
      if (loginRes?.status) {
        showToast(loginRes?.data?.message || "Please try again later", "error");
      }
    }
  };

  useEffect(() => {
    setFormData({
      username: "",
      password: "",
      email: "",
    });
    setErrors({});
  }, [isSignup]);

  const getErrorInputCss = (error?: string) =>
    error ? "input-error" : "input-primary";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => {
                setFormData((p) => ({ ...p, username: e.target.value.trim() }));
              }}
              className={`input ${getErrorInputCss(errors.username)} w-full`}
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
              value={formData.password}
              onChange={(e) => {
                setFormData((p) => ({ ...p, password: e.target.value.trim() }));
              }}
              className={`input ${getErrorInputCss(errors.password)} w-full`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          {isSignup && (
            <div>
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, email: e.target.value.trim() }));
                }}
                className={`input ${getErrorInputCss(errors.email)} w-full`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          )}
          <button type="submit" className="btn btn-info w-full text-white">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
