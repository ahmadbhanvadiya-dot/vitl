export default function MedicinesPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-md mx-auto">

        <div className="bg-white rounded-3xl border border-gray-200 p-6">

  <h1 className="text-3xl font-bold text-red-700">
    Medicines
  </h1>

  <p className="text-gray-500 mt-2">
    Track and manage your medications.
  </p>

  <div className="mt-6 grid grid-cols-2 gap-4">

    <div className="bg-red-50 rounded-2xl p-4">
      <p className="text-gray-500 text-sm">
        Active Medicines
      </p>

      <h2 className="text-2xl font-bold text-red-700">
        --
      </h2>
    </div>

    <div className="bg-green-50 rounded-2xl p-4">
      <p className="text-gray-500 text-sm">
        Taken Today
      </p>

      <h2 className="text-2xl font-bold text-green-700">
        --
      </h2>
    </div>

  </div>

</div>

      </div>

    </main>
  );
}