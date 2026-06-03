"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BottomNav from "../components/BottomNav";

export default function MedicinesPage() {

const [medicines, setMedicines] = useState<any[]>([]);
const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);
const [aiMedicines, setAiMedicines] = useState<any[]>([]);
const [isScanning, setIsScanning] = useState(false);

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

async function handleScanPrescription() {

  if (!prescriptionImage) {

    alert("Please select an image");

    return;

  }

  setIsScanning(true);

  const reader = new FileReader();

  reader.onloadend = async () => {

    const base64 = reader.result
      ?.toString()
      .split(",")[1];

    const response = await fetch(
      "/api/prescription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          mimeType: prescriptionImage.type,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {

      try {

        const medicines = JSON.parse(data.text);

        setAiMedicines(medicines);

      } catch {

        alert("Failed to parse AI response");

      }

    } else {

      alert(data.error);

    }

    setIsScanning(false);

  };

  reader.readAsDataURL(prescriptionImage);
}

const takenCount = medicines.filter(
(medicine) => medicine.taken_today
).length;

return (

<main className="min-h-screen bg-gray-100 px-4 py-8 pb-28 flex justify-center">

  <div className="w-full max-w-md space-y-6">

    <div className="bg-white rounded-3xl border border-gray-200 p-6">

  <h2 className="text-2xl font-bold text-black">
    AI Prescription Scanner
  </h2>

  <p className="text-gray-500 mt-2">
    Upload a prescription and let AI extract medicines.
  </p>

  <div className="mt-6 space-y-4">

    <label
      htmlFor="prescription-upload"
      className="block w-full cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-4 text-center font-semibold"
    >
      {prescriptionImage
        ? `📄 ${prescriptionImage.name}`
        : "📤 Choose Prescription"}
    </label>

    <input
      id="prescription-upload"
      type="file"
      accept="image/*"
      onChange={(e) =>
        setPrescriptionImage(
          e.target.files?.[0] || null
        )
      }
      className="hidden"
    />

    <button
      onClick={handleScanPrescription}
      disabled={isScanning}
      className="w-full bg-black text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
    >
      {isScanning
        ? "🔄 Scanning..."
        : "📄 Scan Prescription"}
    </button>

  </div>

</div>

{aiMedicines.length > 0 && (

  <div className="bg-white rounded-3xl border border-gray-200 p-6">

    <h2 className="text-2xl font-bold text-black">
      AI Detected Medicines
    </h2>

    <div className="mt-4 space-y-3">

      {aiMedicines.map((medicine, index) => (

        <div
          key={index}
          className="bg-red-50 border border-red-200 rounded-2xl p-4"
        >

          <p className="font-bold text-red-700">
            {medicine.medicine_name}
          </p>

          <p className="text-gray-700">
            {medicine.dosage}
          </p>

          <p className="text-red-600 font-medium">
            {medicine.timing}
          </p>

        </div>

      ))}

    </div>

  </div>

)}

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
