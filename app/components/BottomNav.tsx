"use client";

import Link from "next/link";
import { Home, Clock3, QrCode, User } from "lucide-react";

export default function BottomNav() {

  return (

    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "12px 0",
        zIndex: 999,
      }}
    >

      <Link
        href="/dashboard"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
        }}
      >

        <Home
          size={24}
          color="#b91c1c"
        />

        <span
          style={{
            fontSize: "12px",
            marginTop: "4px",
            color: "#b91c1c",
            fontWeight: 600,
          }}
        >
          Home
        </span>

      </Link>

      <Link
        href="#"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
        }}
      >

        <Clock3
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
          History
        </span>

      </Link>

      <Link
        href="#"
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

      <Link
        href="/profile"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
        }}
      >

        <User
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
          Profile
        </span>

      </Link>

    </div>
  );
}