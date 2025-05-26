'use client';

import React, { useState } from "react";
import Select from "react-select";
import Calendar from "@/components/calendar/Calendar";
import Alert from "@/components/ui/alert/Alert";

interface Student {
  id: number;
  name: string;
}
interface Staff {
  id: number;
  name: string;
}
interface Exam {
  id: number;
  name: string;
}
interface Grade {
  value: string;
  label: string;
}
interface RosterEntry {
  id: number;
  date: Date;
  slot: string;
  exam: Exam;
  grade: Grade;
  students: Student[];
  inCharge: Staff | null;
}

const timeSlots = [
  { value: "10:00-11:00", label: "10:00 - 11:00 AM" },
  { value: "11:00-12:00", label: "11:00 - 12:00 PM" },
];

interface AddRosterModalProps {
  onClose: () => void;
  onSave: (entry: RosterEntry) => void;
  exams: Exam[];
  grades: Grade[];
  students: Student[];
  staff: Staff[];
}

export default function AddRosterModal({
  onClose,
  onSave,
  exams,
  grades,
  students,
  staff,
}: AddRosterModalProps) {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ value: string; label: string } | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedInCharge, setSelectedInCharge] = useState<Staff | null>(null);
  const [alert, setAlert] = useState<{ variant: "success" | "error" | "warning"; message: string } | null>(null);

  const showAlert = (variant: "success" | "error" | "warning", message: string) => {
    setAlert({ variant, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSave = () => {
    if (!selectedExam || !selectedGrade || !selectedDate || !selectedSlot || !selectedInCharge) {
      showAlert("error", "Please fill all required fields.");
      return;
    }

    if (selectedStudents.length === 0) {
      showAlert("error", "Select at least one student.");
      return;
    }

    const newEntry: RosterEntry = {
      id: Math.floor(Math.random() * 10000),
      exam: selectedExam,
      grade: selectedGrade,
      date: selectedDate,
      slot: selectedSlot.value,
      students: selectedStudents,
      inCharge: selectedInCharge,
    };

    onSave(newEntry);
    showAlert("success", "Roster entry saved successfully.");
    setTimeout(onClose, 1000); // Delay to let user see alert
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-[480px] max-h-[90vh] overflow-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Exam Roster</h2>

        {alert && (
          <div className="mb-4">
            <Alert variant={alert.variant} message={alert.message} />
          </div>
        )}

        <label className="block mb-2 font-medium">Select Exam</label>
        <Select
          options={exams.map((e) => ({ value: e.id, label: e.name }))}
          onChange={(opt) => setSelectedExam(exams.find((e) => e.id === opt?.value) || null)}
          placeholder="Choose Exam"
        />

        <label className="block mt-4 mb-2 font-medium">Select Grade</label>
        <Select
          options={grades}
          onChange={(opt) => setSelectedGrade(opt || null)}
          placeholder="Choose Grade"
        />

        <label className="block mt-4 mb-2 font-medium">Select Date</label>
        <Calendar
          selected={selectedDate}
          onChange={setSelectedDate}
          className="border px-2 py-1 rounded w-full"
          placeholderText="Select Date"
          dateFormat="dd/MM/yyyy"
        />

        <label className="block mt-4 mb-2 font-medium">Select Time Slot</label>
        <Select
          options={timeSlots}
          onChange={setSelectedSlot}
          placeholder="Choose Time Slot"
        />

        <label className="block mt-4 mb-2 font-medium">Select Students</label>
        <Select
          options={students.map((s) => ({ value: s.id, label: s.name }))}
          isMulti
          onChange={(opts) =>
            setSelectedStudents(opts ? opts.map((o) => students.find((s) => s.id === o.value)!) : [])
          }
          placeholder="Choose Students"
        />

        <label className="block mt-4 mb-2 font-medium">Assign In-Charge</label>
        <Select
          options={staff.map((s) => ({ value: s.id, label: s.name }))}
          onChange={(opt) => setSelectedInCharge(staff.find((s) => s.id === opt?.value) || null)}
          placeholder="Choose In-Charge"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
