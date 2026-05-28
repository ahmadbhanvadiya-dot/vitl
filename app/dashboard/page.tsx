"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import BottomNav from "../components/BottomNav";

class ProfileLoader {
  async load(userId: string) {
    return await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
  }
}

class QRCardDownloader {

  async download(element: HTMLDivElement | null) {

    if (!element) return;

    const dataUrl = await toPng(element);

    const link = document.createElement("a");

    link.download = "vitl-emergency-card.png";

    link.href = dataUrl;

    link.click();
  }
}

export default function DashboardPage() {

  const [fullName, setFullName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [userId, setUserId] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);

  const qrDownloader = new QRCardDownloader();

  useEffect(() => {

    async function loadProfile() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      console.log(user.id);

      const profileLoader = new ProfileLoader();
      const { data: profile } = await profileLoader.load(user.id);

      if (profile) {

        setFullName(profile.full_name || "");
        setBloodGroup(profile.blood_group || "");
        setAllergies(profile.allergies || "");
        setEmergencyContact(profile.emergency_contact || "");
        setMedicalConditions(profile.medical_conditions || "");

      }
    }

    loadProfile();

  }, []);

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
      alert("Profile saved successfully!");
    }
  }

  const qrValue = userId
  ? `${window.location.origin}/emergency-profile/${userId}`
  : "";

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">

      <div className="w-full max-w-md">

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-900">
            Vitl
          </h1>

          <p className="text-gray-500 mt-2">
            Your emergency medical profile
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">

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

          <textarea
            placeholder="Medical Conditions"
            value={medicalConditions}
            onChange={(e) => setMedicalConditions(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-200 text-black min-h-[120px]"
          />

          <button
            onClick={handleSaveProfile}
            className="w-full bg-red-700 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            Save Medical Profile
          </button>

        </div>

        <div className="mt-8 flex justify-center">

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
          onClick={() => qrDownloader.download(cardRef.current)}
          className="mt-6 w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold text-lg"
        >
          Download QR Card
        </button>

      </div>
<BottomNav />
    </main>
  );
}
