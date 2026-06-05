"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { supabase } from "../../lib/supabase";
import BottomNav from "../components/BottomNav";

export default function QRPage() {

  const [userId, setUserId] = useState("");

  useEffect(() => {

    async function loadUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }

    }

    loadUser();

  }, []);

  const qrValue =
    userId &&
    `${window.location.origin}/emergency-profile/${userId}`;

  return (

    <main className="min-h-screen bg-gray-100 px-4 py-8 pb-28 flex justify-center">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl border border-gray-200 p-8">

          <h1 className="text-3xl font-bold text-red-700 text-center">
            Emergency QR
          </h1>
          <p className="mt-4 text-xs text-black break-all">
  {qrValue}
</p>

          <p className="text-gray-500 text-center mt-2">
            Share this QR during emergencies
          </p>

          <div className="mt-8 flex justify-center">

            <div className="bg-white p-4 rounded-2xl border border-gray-200">

              {userId && (
                <QRCode
                  value={qrValue}
                  size={220}
                />
              )}

            </div>

          </div>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-4">

            <p className="text-red-700 font-semibold text-center">
              Anyone who scans this QR can view your emergency medical profile.
            </p>

          </div>

        </div>

      </div>

      <BottomNav />

    </main>

  );
}