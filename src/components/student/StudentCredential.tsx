"use client";

import React, { useState, useMemo } from "react";
import { Eye, RefreshCcw, Search, ChevronUp, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button/Button";

export type Credential = {
  student_id: string;
  email: string;
  password: string;
  status: "generated" | "sent" | "failed";
};

interface Props {
  credentials: Credential[];
  onResend: (studentId: string) => void;
}

type SortKey = "student_id" | "email" | "status";

export default function StudentCredentialTable({
  credentials,
  onResend,
}: Props) {
  const [showPassword, setShowPassword] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("student_id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtered + Sorted credentials
  const filteredCredentials = useMemo(() => {
    const filtered = credentials.filter(
      (cred) =>
        cred.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cred.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortKey].toString().toLowerCase();
      const bValue = b[sortKey].toString().toLowerCase();
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    return sorted;
  }, [credentials, searchQuery, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (credentials.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500 text-sm border rounded-lg p-6 bg-gray-50 shadow-sm">
        No registered students yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-semibold">Student Credentials</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search student or email"
            className="pl-8 pr-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <table className="min-w-full bg-white shadow rounded-xl">
        <thead className="bg-gray-100 text-left text-sm text-gray-700">
          <tr>
            <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort("student_id")}>
              Student ID {sortKey === "student_id" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </th>
            <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort("email")}>
              Email {sortKey === "email" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </th>
            <th className="py-3 px-4">Password</th>
            <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort("status")}>
              Status {sortKey === "status" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredCredentials.map((cred, idx) => (
            <tr
              key={cred.student_id}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="py-2 px-4 max-w-[150px] truncate">{cred.student_id}</td>
              <td className="py-2 px-4 max-w-[200px] truncate">{cred.email}</td>
              <td className="py-2 px-4">
                <div className="flex items-center gap-2">
                  <span>
                    {showPassword[cred.student_id] ? cred.password : "•••••••"}
                  </span>
                  <button
                    type="button"
                    title={
                      showPassword[cred.student_id]
                        ? "Hide Password"
                        : "Show Password"
                    }
                    className="text-gray-500 hover:text-black transition"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        [cred.student_id]: !prev[cred.student_id],
                      }))
                    }
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </td>
              <td className="py-2 px-4">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    cred.status === "sent"
                      ? "bg-green-100 text-green-600"
                      : cred.status === "failed"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {cred.status}
                </span>
              </td>
              <td className="py-2 px-4">
                <Button
                  onClick={() => onResend(cred.student_id)}
                  size="sm"
                  variant="outline"
                  disabled={cred.status === "sent"}
                >
                  <RefreshCcw className="mr-1" size={14} />
                  Resend
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredCredentials.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-6">
          No matching students found.
        </div>
      )}
    </div>
  );
}
