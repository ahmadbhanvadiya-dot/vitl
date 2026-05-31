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

  const [editingId, setEditingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMedicines, setAiMedicines] = useState<any[]>([]);

  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);

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

 if (editingId) {

  const { error } = await supabase
    .from("medicines")
    .update({
      medicine_name: medicineName,
      dosage: dosage,
      timing: timing,
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

    loadMedicines();
  }

} else {

  const { error } = await supabase
    .from("medicines")
    .insert({
      user_id: user.id,
      medicine_name: medicineName,
      dosage: dosage,
      timing: timing,
    });

  if (error) {

    alert(error.message);

  } else {

    alert("Medicine added!");

    setMedicineName("");
    setDosage("");
    setTiming("");

    loadMedicines();
  }
}
  }

  async function handleDeleteMedicine(id: string) {

  const { error } = await supabase
    .from("medicines")
    .delete()
    .eq("id", id);

  if (error) {

    alert(error.message);

  } else {

    loadMedicines();

  }
}
async function handleScanPrescription() {

  if (!prescriptionImage) {

    alert("Please select an image");

    return;

  }

  const reader = new FileReader();

  reader.onloadend = async () => {

    const base64 = reader.result
      ?.toString()
      .split(",")[1];

    const response = await fetch(
      "/api/scan-prescription",
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

      alert(data.text);

    } else {

      alert("Scan failed");

    }

  };

  reader.readAsDataURL(prescriptionImage);
}

function handleEditMedicine(medicine: any) {

  setMedicineName(medicine.medicine_name);
  setDosage(medicine.dosage);
  setTiming(medicine.timing);

  setEditingId(medicine.id);
}

  async function downloadQRCard() {

    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current);

    const link = document.createElement("a");

    link.download = "vitl-emergency-card.png";

    link.href = dataUrl;

    link.click();
  }
function checkMedicineReminders() {

  const now = new Date();

  const currentTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  medicines.forEach((medicine) => {

    if (medicine.reminder_time === currentTime) {

      new Notification("Medicine Reminder 💊", {
        body: `Time to take ${medicine.medicine_name}`,
      });
    }
  });
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
    const interval = setInterval(() => {
  checkMedicineReminders();
}, 60000);

return () => clearInterval(interval);

  }, []);
   async function enableNotifications() {

  const permission = await Notification.requestPermission();

  if (permission === "granted") {

    alert("Notifications enabled!");

  } else {

    alert("Notifications denied");
  }
}

async function handlePrescriptionUpload() {

  if (!imageFile) return;

  setLoadingAI(true);

  const reader = new FileReader();

  reader.readAsDataURL(imageFile);

  reader.onloadend = async () => {

    const base64 = reader.result
      ?.toString()
      .split(",")[1];

    const response = await fetch("/api/prescription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64,
      }),
    });

    const data = await response.json();

try {

  const medicines = JSON.parse(data.data);

  setAiMedicines(medicines);

  if (medicines.length > 0) {

    setMedicineName(medicines[0].medicine_name || "");
    setDosage(medicines[0].dosage || "");
    setTiming(medicines[0].timing || "");
  }

  alert("Prescription scanned successfully!");

} catch {

  alert("AI returned invalid data");
}

    setLoadingAI(false);
  };
}
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
    AI Prescription Scanner
  </h2>

  <p className="text-gray-500 mt-2">
    Upload a prescription and let AI extract medicines.
  </p>

  <div className="mt-6 space-y-4">

    <label
  htmlFor="prescription-upload"
  className="block w-full cursor-pointer bg-gray-100 border border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-200 transition"
>
  {prescriptionImage
    ? `📄 ${prescriptionImage.name}`
    : "📤 Upload Prescription"}
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
  className="w-full bg-black text-white py-4 rounded-2xl font-semibold"
>
  Scan Prescription
</button>

  </div>

</div>


        <div className="bg-white rounded-3xl border border-gray-200 p-6">

          <h2 className="text-2xl font-bold text-black">
            Medicine Reminders
          </h2>

          <div className="mt-6 space-y-4">
          <div className="space-y-4">

  <label className="w-full flex items-center justify-center bg-gray-200 text-black py-4 rounded-2xl font-semibold cursor-pointer hover:bg-gray-300 transition">

  {imageFile
    ? imageFile.name
    : "Upload Prescription Image"}

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files?.[0]) {
        setImageFile(e.target.files[0]);
      }
    }}
    className="hidden"
  />

</label>

  <button
    onClick={handlePrescriptionUpload}
    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold"
  >
    {loadingAI ? "Scanning..." : "Scan Prescription with AI"}
  </button>

</div>
            {aiMedicines.length > 0 && (

  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">

    <h3 className="font-bold text-green-700">
      AI Detected Medicines
    </h3>

    <div className="mt-3 space-y-2">

      {aiMedicines.map((med, index) => (

        <div
          key={index}
          className="bg-white rounded-xl p-3"
        >
          <p className="font-semibold">
            {med.medicine_name}
          </p>

          <p className="text-sm text-gray-600">
            {med.dosage}
          </p>

          <p className="text-sm text-red-600">
            {med.timing}
          </p>
        </div>

      ))}

    </div>

  </div>

)}
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
  {editingId ? "Update Medicine" : "Add Medicine"}
</button>

{editingId && (

  <button
    onClick={() => {

      setEditingId(null);

      setMedicineName("");
      setDosage("");
      setTiming("");

    }}
    className="w-full mt-3 bg-gray-300 text-black py-4 rounded-2xl font-semibold"
  >
    Cancel Edit
  </button>

)}

          </div>

          <div className="mt-6 space-y-4">

            {medicines.map((medicine) => (

  <div
    key={medicine.id}
    className="bg-gray-100 rounded-2xl p-4"
  >

    <h3 className="text-xl font-bold text-black">
      💊 {medicine.medicine_name}
    </h3>

    <p className="text-gray-600 mt-2">
      Dose: {medicine.dosage}
    </p>

    <p className="text-red-700 font-medium mt-2">
      ⏰ {medicine.timing}
    </p>

    <div className="flex gap-2 mt-4">

      <button
        onClick={() => handleEditMedicine(medicine)}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        ✏️ Edit
      </button>

      <button
        onClick={() => handleDeleteMedicine(medicine.id)}
        className="bg-red-600 text-white px-4 py-2 rounded-xl"
      >
        🗑️ Delete
      </button>

    </div>

  </div>

))}

          </div>

        </div>
<button
  onClick={enableNotifications}
  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold"
>
  Enable Notifications
</button>
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