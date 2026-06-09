"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [adherence, setAdherence] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
    fetchPrescriptions();
  }, []);

  async function fetchHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("medicine_history")
      .select("*")
      .eq("user_id", user?.id)
      .order("taken_at", { ascending: false });

    if (!error && data) {
      setHistory(data);

      const taken = data.filter(
        (item) => item.status === "taken"
      ).length;

      const adherenceRate =
        data.length > 0
          ? Math.round((taken / data.length) * 100)
          : 0;

      setAdherence(adherenceRate);
    }
  }

  async function fetchPrescriptions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("user_id", user?.id)
      .order("uploaded_at", { ascending: false });

    setPrescriptions(data || []);
  }

  async function uploadPrescription() {
  alert("Upload function started");

  if (!file) {
    alert("No file selected");
    return;
  }

  alert(`File selected: ${file.name}`);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  alert(`User: ${user?.id}`);

  const filePath = `${user?.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("prescriptions")
    .upload(filePath, file);

  if (uploadError) {
    alert(uploadError.message);
    console.error(uploadError);
    return;
  }

  alert("File uploaded to storage");

  const { data } = supabase.storage
    .from("prescriptions")
    .getPublicUrl(filePath);

  await supabase
    .from("prescriptions")
    .insert({
      user_id: user?.id,
      file_url: data.publicUrl,
      file_name: file.name,
    });

  alert("Prescription uploaded!");
}
  const takenCount = history.filter(
    (item) => item.status === "taken"
  ).length;

  const missedCount = history.filter(
    (item) => item.status === "missed"
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 pb-28 flex justify-center">
  <div className="w-full max-w-md space-y-8">
      <div>
  <h1 className="text-4xl font-bold text-red-700">
    History
  </h1>

  <p className="text-gray-500 mt-2">
    Track medicines and prescriptions
  </p>
</div>

      {/* Analytics Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6">
        <h2 className="text-gray-600 text-sm">
          Adherence Rate
        </h2>

        <p className="text-4xl font-bold text-green-600 mt-2">
  {adherence}%
</p>

        <div className="flex justify-between mt-4">
          <div>
            <p className="text-gray-500 text-sm">
              Taken
            </p>
            <p className="font-bold text-2xl text-gray-900">
              {takenCount}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Missed
            </p>
            <p className="font-bold text-2xl text-gray-900">
              {missedCount}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Total
            </p>
            <p className="font-bold text-2xl text-gray-900">
              {history.length}
            </p>
          </div>
        </div>
      </div>

      {/* Medicine History */}
      <h2 className="text-xl font-bold text-gray-900 mb-3">
  💊 Medicine Activity
</h2>

      {history.length === 0 ? (
        <div className="text-center text-gray-500 mt-4 mb-8">
          No medicine history yet.
        </div>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900 text-lg">
                {item.status === "taken"
                  ? "✅ Taken"
                  : "❌ Missed"}
              </p>

              <span className="text-sm text-gray-700 font-medium">
                {new Date(
                  item.taken_at
                ).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {new Date(
                item.taken_at
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))
      )}

      {/* Prescription Vault */}

      <p className="text-sm text-blue-600">
  Current file: {file ? file.name : "NONE"}
</p>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
  📄 Prescription Vault
</h2>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <input
  type="file"
  accept="image/*,.pdf"
  className="text-gray-700 w-full"
  onChange={(e) => {
    const selectedFile = e.target.files?.[0] || null;

    console.log("Selected:", selectedFile);
    alert(
      selectedFile
        ? `Selected: ${selectedFile.name}`
        : "No file selected"
    );

    setFile(selectedFile);
  }}
/>

<button
  onClick={async () => {
    console.log("FILE STATE:", file);
    alert(file ? file.name : "FILE IS NULL");
    await uploadPrescription();
  }}
  className="mt-4 w-full bg-red-600 text-white py-3 rounded-2xl font-semibold"
>
  Upload Prescription
</button>

        </div>

        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
           className="bg-white rounded-2xl border border-gray-200 p-4 mb-3"
          >
            <p className="font-semibold">
              {prescription.file_name}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(
                prescription.uploaded_at
              ).toLocaleDateString()}
            </p>

            <a
              href={prescription.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-red-600 font-semibold"
            >
              View Prescription
            </a>
          </div>
        ))}
      </div>
    </div>
    </main>
  );
}