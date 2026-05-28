export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F2E8] flex flex-col items-center justify-center px-6">
      <div className="bg-[#FAF8F0] shadow-md rounded-3xl p-10 w-full max-w-sm">
        <h1 className="text-5xl font-bold text-[#3B4D63] text-center">
          Vitl
        </h1>

        <p className="text-center text-gray-500 mt-4">
          Emergency Medical QR System
        </p>

        <button className="mt-8 w-full bg-[#3B4D63] text-white py-3 rounded-2xl font-medium hover:opacity-90 transition">
         <a
  href="/login"
  className="block w-full bg-[#4A5B75] text-white py-4 rounded-2xl text-center font-semibold text-xl"
>
  Get Started
</a>
        </button>
      </div>
    </main>
  );
}