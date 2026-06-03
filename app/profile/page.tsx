"use client";

import BottomNav from "../components/BottomNav";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

export default function ProfilePage() {

  
  async function handleLogout() {

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl border border-gray-200 p-8">

          <div className="flex flex-col items-center">

            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-4xl">
              🚑
            </div>

            <h1 className="text-3xl font-bold text-black mt-6">
              VITL
            </h1>

            <p className="text-gray-500 mt-2">
              Emergency Medical Profile
            </p>

          </div>

          <div className="mt-10 space-y-4">

            <div className="bg-gray-100 rounded-2xl p-4">

              <p className="text-gray-500 text-sm">
                App Purpose
              </p>

              <h2 className="text-black font-semibold mt-1">
                Instant emergency medical access using QR technology
              </h2>

            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-700 text-white py-4 rounded-2xl font-semibold text-lg"
            >
              Logout
            </button>

          </div>

        </div>

      </div>

      <BottomNav />

    </main>
  );
}