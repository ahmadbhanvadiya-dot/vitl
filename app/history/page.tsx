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
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const filePath = `${user?.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("prescriptions")
      .upload(filePath, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

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

    setFile(null);
    fetchPrescriptions();
  }

  const takenCount = history.filter(
    (item) => item.status === "taken"
  ).length;

  const missedCount = history.filter(
    (item) => item.status === "missed"
  ).length;

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4">
        Medicine History
      </h1>

      {/* Analytics Card */}
      <div className="bg-white rounded-2xl shadow p-5 mb-5">
        <h2 className="text-gray-500 text-sm">
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
            <p className="font-bold text-lg">
              {takenCount}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Missed
            </p>
            <p className="font-bold text-lg">
              {missedCount}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Total
            </p>
            <p className="font-bold text-lg">
              {history.length}
            </p>
          </div>
        </div>
      </div>

      {/* Medicine History */}
      <h2 className="text-xl font-bold mb-3">
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
            className="bg-white rounded-xl shadow p-4 mb-3"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold">
                {item.status === "taken"
                  ? "✅ Taken"
                  : "❌ Missed"}
              </p>

              <span className="text-xs text-gray-400">
                {new Date(
                  item.taken_at
                ).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
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
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          📄 Prescription Vault
        </h2>

        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <button
            onClick={uploadPrescription}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Upload Prescription
          </button>
        </div>

        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="bg-white rounded-xl shadow p-4 mb-3"
          >
            <p className="font-semibold">
              {prescription.file_name}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(
                prescription.uploaded_at
              ).toLocaleDateString()}
            </p>

            <a
              href={prescription.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 font-medium"
            >
              View Prescription
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}