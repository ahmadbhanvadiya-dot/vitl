"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function SignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Account created successfully!");
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F2E8] flex items-center justify-center px-6">
      <div className="bg-[#FAF8F0] w-full max-w-sm rounded-3xl shadow-md p-8">

        <h1 className="text-3xl font-bold text-[#3B4D63] text-center">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create your medical profile
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-300 bg-white outline-none text-gray-700 placeholder:text-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-300 bg-white outline-none text-gray-700 placeholder:text-gray-400"
          />

          <button
            type="submit"
            className="w-full bg-[#3B4D63] text-white py-4 rounded-2xl font-medium hover:opacity-90 transition"
          >
            Create Account
          </button>

        </form>

        <div className="mt-6 text-center">

  <p className="text-gray-500">
    Already have an account?
  </p>

  <Link
    href="/login"
    className="text-[#3B4D63] font-semibold"
  >
    Login
  </Link>

</div>
      </div>
    </main>
  );
}