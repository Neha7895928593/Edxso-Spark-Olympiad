'use client';

import { useState } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";

import AddRosterModal from "./AddRosterModal";
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

const exams: Exam[] = [
  { id: 1, name: "Maths Midterm" },
  { id: 2, name: "Science Final" },
];
const grades: Grade[] = [
  { value: "6", label: "Grade 6" },
  { value: "7", label: "Grade 7" },
];
const students: Student[] = [
  { id: 1, name: "Ali" },
  { id: 2, name: "Sara" },
  { id: 3, name: "Rohan" },
];
const staff: Staff[] = [
  { id: 1, name: "Mr. Khan" },
  { id: 2, name: "Ms. Anita" },
];

export default function ExamRosterModule() {
  const [rosters, setRosters] = useState<RosterEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const handleAddRoster = (entry: RosterEntry) => {
    setRosters((prev) => [...prev, entry]);
    setAlert({ variant: "success", message: "Exam roster added successfully!" });
  };

  const handleDeleteRoster = (id: number) => {
    setRosters((prev) => prev.filter((x) => x.id !== id));
    setAlert({ variant: "warning", message: "Roster deleted." });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Exam Roster Scheduling</h1>

      {alert && (
        <div className="mb-4">
          <Alert variant={alert.variant} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      <button
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => setShowAddModal(true)}
      >
        + Add Exam Roster
      </button>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">Date</th>
            <th className="border border-gray-300 px-3 py-2">Slot</th>
            <th className="border border-gray-300 px-3 py-2">Exam</th>
            <th className="border border-gray-300 px-3 py-2">Grade</th>
            <th className="border border-gray-300 px-3 py-2">Students</th>
            <th className="border border-gray-300 px-3 py-2">In-Charge</th>
            <th className="border border-gray-300 px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rosters.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4 text-gray-500">
                No exam rosters scheduled yet.
              </td>
            </tr>
          ) : (
            rosters.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">
                  {r.date.toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-3 py-1">{r.slot}</td>
                <td className="border border-gray-300 px-3 py-1">{r.exam.name}</td>
                <td className="border border-gray-300 px-3 py-1">{r.grade.label}</td>
                <td className="border border-gray-300 px-3 py-1">
                  {r.students.map((s) => s.name).join(", ")}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {r.inCharge?.name}
                </td>
                <td className="border border-gray-300 px-3 py-1 flex justify-center gap-2">
                  <button title="View">
                    <Eye size={16} />
                  </button>
                  <button title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleDeleteRoster(r.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showAddModal && (
        <AddRosterModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddRoster}
          exams={exams}
          grades={grades}
          students={students}
          staff={staff}
        />
      )}
    </div>
  );
}
