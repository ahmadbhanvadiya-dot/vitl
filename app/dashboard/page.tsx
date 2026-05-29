"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import BottomNav from "../components/BottomNav";

export default function DashboardPage() {

  const [fullName, setFullName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");

  const [userId, setUserId] = useState("");

  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [timing, setTiming] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  const [medicines, setMedicines] = useState<any[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);

  const qrValue = userId
    ? `${window.location.origin}/emergency-profile/${userId}`
    : "";

  async function handleSaveProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not logged in");
      return;
    }

    setUserId(user.id);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        blood_group: bloodGroup,
        allergies: allergies,
        emergency_contact: emergencyContact,
        medical_conditions: medicalConditions,
      });

    if (error) {

      alert(error.message);

    } else {

      alert("Profile saved!");
    }
  }

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

  async function handleAddMedicine() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("medicines")
      .insert({
        user_id: user.id,
        medicine_name: medicineName,
        dosage: dosage,
        timing: timing,
        reminder_time: reminderTime,
      });

    if (error) {

      alert(error.message);

    } else {

      alert("Medicine added!");

      setMedicineName("");
      setDosage("");
      setTiming("");
      setReminderTime("");

      loadMedicines();
    }
  }

  async function downloadQRCard() {

    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current);

    const link = document.createElement("a");

    link.download = "vitl-emergency-card.png";

    link.href = dataUrl;

    link.click();
  }

  useEffect(() => {

    async function loadProfile() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {

        setFullName(profile.full_name || "");
        setBloodGroup(profile.blood_group || "");
        setAllergies(profile.allergies || "");
        setEmergencyContact(profile.emergency_contact || "");
        setMedicalConditions(profile.medical_conditions || "");
      }
    }

    loadProfile();
    loadMedicines();

  }, []);

  return (

    <main className="min-h-screen bg-gray-100 px-4 py-8 pb-28 flex justify-center">

      <div className="w-full max-w-md space-y-8">

        <div className="bg-white rounded-3xl border border-gray-200 p-6">

          <h1 className="text-4xl font-bold text-red-700">
            VITL
          </h1>

          <p className="text-gray-500 mt-2">
            Emergency Medical Profile
          </p>

          <div className="mt-8 space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-200 text-black"
            />

            <input
              type="text"
              placeholder="Blood Group"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-200 text-black"
            />

            <input
              type="text"
              placeholder="Allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-200 text-black"
            />

            <input
              type="text"
              placeholder="Emergency Contact"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-200 text-black"
            />

            <input
              type="text"
              placeholder="Medical Conditions"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-200 text-black"
            />

            <button
              onClick={handleSaveProfile}
              className="w-full bg-red-700 text-white py-4 rounded-2xl font-semibold"
            >
              Save Medical Profile
            </button>

          </div>

        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6">

          <h2 className="text-2xl font-bold text-black">
            Medicine Reminders
          </h2>

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
              type="text"
              placeholder="Timing"
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

          <div className="mt-6 space-y-4">

            {medicines.map((medicine) => (

              <div
                key={medicine.id}
                className="bg-gray-100 rounded-2xl p-4"
              >

                <h3 className="text-lg font-bold text-black">
                  {medicine.medicine_name}
                </h3>

                <p className="text-gray-600 mt-1">
                  {medicine.dosage}
                </p>

                <p className="text-red-700 font-medium mt-2">
                  {medicine.timing}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                 ⏰ {medicine.reminder_time}
                </p>

              </div>

            ))}

          </div>

        </div>

        <div className="flex justify-center">

          <div
            ref={cardRef}
            className="w-[320px] bg-white rounded-[32px] border border-gray-200 p-8 flex flex-col items-center"
          >

            <h2 className="text-4xl font-bold text-red-700">
              VITL
            </h2>

            <p className="text-gray-500 mt-1 text-center">
              Emergency Medical ID
            </p>

            <div className="mt-6 text-center">

              <h3 className="text-2xl font-bold text-black">
                {fullName || "Your Name"}
              </h3>

              <p className="text-red-700 font-bold text-xl mt-2">
                {bloodGroup || "Blood Group"}
              </p>

            </div>

            <div className="bg-white p-4 rounded-2xl mt-8 border border-gray-200">

              <QRCode
                value={qrValue}
                size={180}
              />

            </div>

            <p className="text-xs text-gray-400 mt-6 text-center">
              Scan this QR during emergencies
            </p>

          </div>

        </div>

        <button
          onClick={downloadQRCard}
          className="w-full bg-black text-white py-4 rounded-2xl font-semibold"
        >
          Download QR Card
        </button>

      </div>

      <BottomNav />

    </main>
  );
}