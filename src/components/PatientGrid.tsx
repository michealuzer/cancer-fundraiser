import { getPatients } from "@/lib/supabase";
import PatientCard from "@/components/PatientCard";

export default async function PatientGrid() {
  const patients = await getPatients();

  if (patients.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        <p className="font-fraunces text-xl">No active campaigns right now.</p>
        <p className="mt-1 text-sm">Check back soon — new fighters are added every week.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
}
