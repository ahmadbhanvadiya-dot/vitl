"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [adherence, setAdherence] = useState(0);

  useEffect(() => {
    fetchHistory();
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

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
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
    </div>
  );
}