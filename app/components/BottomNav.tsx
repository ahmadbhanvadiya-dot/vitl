"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Pill,
  QrCode,
  User,
  History,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Home",
      icon: Home,
    },
    {
      href: "/medicines",
      label: "Medicines",
      icon: Pill,
    },
    {
      href: "/qr",
      label: "QR",
      icon: QrCode,
    },
    {
      href: "/history",
      label: "History",
      icon: History,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-white border border-gray-200 shadow-lg rounded-3xl px-6 py-3 flex justify-between items-center z-50">

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center transition-all ${
             isActive
  ? "text-red-700 scale-110"
  : "text-gray-500"
            }`}
          >
            <Icon size={22} />
            <span className="text-xs mt-1 font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}