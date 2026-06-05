"use client";

import Link from "next/link";
import { Home, Pill, QrCode, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-white border border-gray-200 shadow-lg rounded-3xl px-6 py-3 flex justify-between items-center z-50">

      <Link
        href="/dashboard"
        className="flex flex-col items-center text-red-700"
      >
        <Home size={22} />
        <span className="text-xs mt-1 font-medium">
          Home
        </span>
      </Link>

      <Link
        href="/medicines"
        className="flex flex-col items-center text-gray-500"
      >
        <Pill size={22} />
        <span className="text-xs mt-1">
          Medicines
        </span>
      </Link>

      <Link
  href="/qr"
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none",
  }}
>

  <QrCode
    size={24}
    color="#4b5563"
  />

  <span
    style={{
      fontSize: "12px",
      marginTop: "4px",
      color: "#4b5563",
    }}
  >
    QR
  </span>

</Link>

    </div>
  );
}