"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BottomNav from "../components/BottomNav";

export default function MedicinesPage() {

const [medicines, setMedicines] = useState<any[]>([]);
const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);
const [aiMedicines, setAiMedicines] = useState<any[]>([]);
const [isScanning, setIsScanning] = useState(false);

const [medicineName, setMedicineName] = useState("");
const [dosage, setDosage] = useState("");
const [timing, setTiming] = useState("");
const [reminderTime, setReminderTime] = useState("");
const [editingId, setEditingId] = useState<string | null>(null);

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


async function saveDetectedMedicines() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const medicinesToInsert = aiMedicines.map(
    (medicine) => ({
      user_id: user.id,
      medicine_name: medicine.medicine_name,
      dosage: medicine.dosage,
      timing: medicine.timing,
    })
  );

  const { error } = await supabase
    .from("medicines")
    .insert(medicinesToInsert);

  if (error) {

    alert(error.message);

    return;

  }

  alert("Medicines saved!");

  window.location.reload();
}


async function handleAddMedicine() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  if (editingId) {

    const { error } = await supabase
      .from("medicines")
      .update({
        medicine_name: medicineName,
        dosage,
        timing,
        reminder_time: reminderTime,
      })
      .eq("id", editingId);

    if (error) {

      alert(error.message);

    } else {

      alert("Medicine updated!");

      setEditingId(null);

      setMedicineName("");
      setDosage("");
      setTiming("");
      setReminderTime("");

      window.location.reload();
    }

  } else {

    const { error } = await supabase
      .from("medicines")
      .insert({
        user_id: user.id,
        medicine_name: medicineName,
        dosage,
        timing,
        reminder_time: reminderTime,
        taken_today: false,
      });

    if (error) {

      alert(error.message);

    } else {

      alert("Medicine added!");

      setMedicineName("");
      setDosage("");
      setTiming("");
      setReminderTime("");

      window.location.reload();
    }

  }
}

function handleEditMedicine(medicine: any) {

  setMedicineName(medicine.medicine_name);
  setDosage(medicine.dosage);
  setTiming(medicine.timing);
  setReminderTime(medicine.reminder_time || "");

  setEditingId(medicine.id);
}

const takenCount = medicines.filter((medicine) => medicine.taken_today).length;

async function handleMarkTaken(id: any) {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("medicines")
    .update({ taken_today: true })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  const { error: historyError } = await supabase
    .from("medicine_history")
    .insert({
      user_id: user?.id,
      medicine_id: id,
      status: "taken",
      taken_at: new Date().toISOString(),
    });

 if (historyError) {
  console.error(historyError);
  alert(historyError.message);
}

  setMedicines((prev) =>
    prev.map((medicine) =>
      medicine.id === id
        ? { ...medicine, taken_today: true }
        : medicine
    )
  );
} 

async function handleDeleteMedicine(id: string) {

  const confirmed = confirm(
    "Delete this medicine?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("medicines")
    .delete()
    .eq("id", id);

  if (error) {

    alert(error.message);

  } else {

    window.location.reload();

  }

}

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

          <button
  onClick={saveDetectedMedicines}
  className="w-full mt-4 bg-green-600 text-white py-4 rounded-2xl font-semibold"
>
  💾 Save All Medicines
</button>

        </div>

      ))}

    </div>

  </div>

)}

<div className="bg-white rounded-3xl border border-gray-200 p-6">

  <h2 className="text-2xl font-bold text-black">
    Add Medicine
  </h2>

  <p className="text-gray-500 mt-2">
    Add a medicine manually.
  </p>

  <div className="mt-6 space-y-4">

    <input
      type="text"
      placeholder="Medicine Name"
      value={medicineName}
      onChange={(e) => setMedicineName(e.target.value)}
      className="w-full p-4 rounded-2xl border border-gray-200 text-black"
    />

    <input
      type="text"
      placeholder="Dosage"
      value={dosage}
      onChange={(e) => setDosage(e.target.value)}
      className="w-full p-4 rounded-2xl border border-gray-200 text-black"
    />

    <input
      type="time"
      value={timing}
      onChange={(e) => setTiming(e.target.value)}
      className="w-full p-4 rounded-2xl border border-gray-200 text-black"
    /> 

    

    <input
      type="time"
      value={reminderTime}
      onChange={(e) => setReminderTime(e.target.value)}
      className="w-full p-4 rounded-2xl border border-gray-200 text-black"
    />

    <button
      onClick={handleAddMedicine}
      className="w-full bg-red-700 text-white py-4 rounded-2xl font-semibold"
    >
      Add Medicine
    </button>

  </div>

</div>

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

{!medicine.taken_today && (

  <button
    onClick={() => handleMarkTaken(medicine.id)}
    className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
  >
    ✅ Mark Taken
  </button>

)}

<button
  onClick={() => handleEditMedicine(medicine)}
  className="mt-3 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
>
  ✏️ Edit
</button>

<button
  onClick={() => handleDeleteMedicine(medicine.id)}
  className="mt-3 w-full bg-red-600 text-white py-3 rounded-xl font-semibold"
>
  🗑️ Delete
</button>
      </div>

    ))}

  </div>

  <BottomNav />

</main>


);
}
