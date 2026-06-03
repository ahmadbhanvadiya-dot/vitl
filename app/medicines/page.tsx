"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BottomNav from "../components/BottomNav";

export default function MedicinesPage() {

const [medicines, setMedicines] = useState<any[]>([]);

useEffect(() => {

async function loadMedicines() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("medicines")
    .select("*")
    .eq("user_id", user.id);

  if (data) {
    setMedicines(data);
  }

}

loadMedicines();

}, []);

const takenCount = medicines.filter(
(medicine) => medicine.taken_today
).length;

return (

<main className="min-h-screen bg-gray-100 px-4 py-8 pb-28 flex justify-center">

  <div className="w-full max-w-md space-y-6">

    <div className="bg-white rounded-3xl border border-gray-200 p-6">

      <h1 className="text-3xl font-bold text-red-700">
        Medicines
      </h1>

      <p className="text-gray-500 mt-2">
        Track and manage your medications.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="bg-red-50 rounded-2xl p-4">
          <p className="text-gray-500 text-sm">
            Active Medicines
          </p>

          <h2 className="text-2xl font-bold text-red-700">
            {medicines.length}
          </h2>
        </div>

        <div className="bg-green-50 rounded-2xl p-4">
          <p className="text-gray-500 text-sm">
            Taken Today
          </p>

          <h2 className="text-2xl font-bold text-green-700">
            {takenCount}
          </h2>
        </div>

      </div>

    </div>

    {medicines.map((medicine) => (

      <div
        key={medicine.id}
        className="bg-white rounded-2xl border border-gray-200 p-4"
      >

        <h3 className="text-xl font-bold text-black">
          💊 {medicine.medicine_name}
        </h3>

        <p className="text-gray-700 mt-2">
          Dose: {medicine.dosage}
        </p>

        <p className="text-red-600 font-semibold mt-2">
          ⏰ {medicine.timing}
        </p>

        <p
          className={
            medicine.taken_today
              ? "text-green-600 font-semibold mt-2"
              : "text-orange-600 font-semibold mt-2"
          }
        >
          {medicine.taken_today
            ? "✅ Taken Today"
            : "⏳ Not Taken"}
        </p>

      </div>

    ))}

  </div>

  <BottomNav />

</main>


);
}
