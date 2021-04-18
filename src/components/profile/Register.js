import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../fb/auth";
function Login() {
  const { signupWithEmail } = useAuth();
  return (
    <body className="flex w-full  ">
      <div className="py-6 w-full">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-2xl">
          <div className="w-full p-8 h-full ">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">
              REGISTER
            </h2>

            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                Enter your information to register
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring focus:border-blue-300 border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring focus:border-blue-300 border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
              />
            </div>
            <div className="mt-8">
              <button
                onclick={signupWithEmail}
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                Register
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <Link href="/profile">
                <a className="text-xs text-gray-500 uppercase">
                  Go back to Login
                </a>
              </Link>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}
export default Login;
