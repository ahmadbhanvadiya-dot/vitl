"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("medicine_history")
      .select("*")
      .eq("user_id", user?.id)
      .order("taken_at", { ascending: false });

    if (!error) {
      setHistory(data || []);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Medicine History
      </h1>

      {history.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow p-4 mb-3"
        >
          <p className="font-semibold">
            ✅ {item.status}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(item.taken_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}