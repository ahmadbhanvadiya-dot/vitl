import { supabase } from "../../../lib/supabase";

export default async function EmergencyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  console.log("ID:", id);

 
  
  const { data: profile, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", id)
  .single();

console.log("ID:", id);
console.log("Profile:", profile);
console.log("Error:", error);

    const { data: medicines, error: medicinesError } = await supabase
  .from("medicines")
  .select("*")
  .eq("user_id", id);

  if (!profile) {

    return (

      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white border border-gray-200 rounded-3xl p-8 w-full max-w-md text-center">

          <div className="text-6xl mb-4">
            ⚠️
          </div>

          <h1 className="text-3xl font-bold text-red-700">
            Profile Not Found
          </h1>

          <p className="text-gray-500 mt-3">
            This emergency profile does not exist or may have been removed.
          </p>

        </div>

      </main>
    );
  }

  return (

    <main className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">

      <div className="w-full max-w-md">

        <div className="bg-red-700 rounded-t-3xl p-6 text-white">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm opacity-90">
                Emergency Medical Profile
              </p>

              <h1 className="text-3xl font-bold mt-1">
                {profile.full_name}
              </h1>

            </div>

            <div className="text-5xl">
              🚑
            </div>

          </div>

        </div>

        <div className="bg-white rounded-b-3xl border border-gray-200 p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">

  <p className="text-yellow-800 font-semibold">
    ⚠️ Emergency Information
  </p>

  <p className="text-yellow-700 text-sm mt-1">
    This information has been shared by the patient for emergency use.
  </p>

</div>

          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">

            <p className="text-red-500 text-sm font-medium">
              BLOOD GROUP
            </p>

            <h2 className="text-5xl font-bold text-red-700 mt-2">
              {profile.blood_group || "N/A"}
            </h2>

          </div>

          <div className="mt-6 space-y-4">

            <div className="bg-gray-100 rounded-2xl p-5">

              <p className="text-gray-500 text-sm">
                Allergies
              </p>

              <h2 className="text-black text-lg font-semibold mt-1">
                {profile.allergies || "None"}
              </h2>

            </div>

            <div className="bg-gray-100 rounded-2xl p-5">

              <p className="text-gray-500 text-sm">
                Medical Conditions
              </p>

              <h2 className="text-black text-lg font-semibold mt-1">
                {profile.medical_conditions || "None"}
              </h2>

            </div>

            <div className="bg-gray-100 rounded-2xl p-5">

              <p className="text-gray-500 text-sm">
                Emergency Contact
              </p>

              <h2 className="text-black text-lg font-semibold mt-1">
                {profile.emergency_contact || "Not Available"}
              </h2>

            </div>

            <div className="bg-gray-100 rounded-2xl p-5">

  <p className="text-gray-500 text-sm">
    Current Medicines
  </p>


  <div className="mt-3 space-y-3">

    {medicines && medicines.length > 0 ? (

      medicines.map((medicine) => (

        <div
  key={medicine.id}
  className="bg-white border border-gray-200 rounded-2xl p-4"
>

  <p className="text-lg font-bold text-black">
    💊 {medicine.medicine_name}
  </p>

  <p className="text-gray-600 mt-2">
    Dose: {medicine.dosage}
  </p>

  <p className="text-red-700 font-medium mt-1">
    ⏰ {medicine.timing}
  </p>

</div>

      ))

    ) : (

      <div className="bg-white rounded-2xl p-4 text-center">

  <div className="text-3xl">
    💊
  </div>

  <p className="text-gray-500 mt-2">
    No medicines have been added.
  </p>

</div>

    )}

  </div>

</div>

          </div>

          <a
            href={`tel:${profile.emergency_contact}`}
            className="block w-full text-center bg-red-700 text-white py-5 rounded-2xl font-bold text-lg mt-8"
          >
            📞 Call Emergency Contact
          </a>

          <div className="mt-6 text-center">

            <p className="text-xs text-gray-400">
              VITL Emergency QR System
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}
