"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful!");
      window.location.href = "/dashboard";
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F2E8] flex items-center justify-center px-6">

      <div className="bg-[#FAF8F0] w-full max-w-sm rounded-3xl shadow-md p-8">

        <h1 className="text-3xl font-bold text-[#3B4D63] text-center">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login to your medical profile
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-300 bg-white text-black placeholder:text-gray-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-300 bg-white text-black placeholder:text-gray-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-[#3B4D63] text-white py-4 rounded-2xl font-medium hover:opacity-90 transition"
          >
            Login
          </button>

        </form>

      </div>

    </main>
  );
}