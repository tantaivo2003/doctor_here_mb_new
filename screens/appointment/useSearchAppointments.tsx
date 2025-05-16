import { useState, useMemo } from "react";
import { Appointment } from "../../types/types";

export function useSearchAppointments(appointments: Appointment[]) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = useMemo(() => {
    if (!searchTerm.trim()) return appointments;
    const lower = searchTerm.toLowerCase();
    return appointments.filter((item) =>
      [item.doctor, item.specialty, item.hospital].some((field) =>
        field?.toLowerCase().includes(lower)
      )
    );
  }, [appointments, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredAppointments,
  };
}
