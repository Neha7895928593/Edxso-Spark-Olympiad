"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import axios from "axios";
import Alert from "@/components/ui/alert/Alert";

// export const metadata: Metadata = {
//     title: "Student Registration | Upload-data",
//     description: "Bulk upload panel for student registration via Excel/CSV",
//   };
  

export default function StudentRegistration() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    setAlert(null);

    if (!file) {
      setAlert({ type: "warning", message: "Please select a file before uploading." });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/students/bulk-upload", formData);
      const { batch_id } = res.data;
      setBatchId(batch_id);

      setAlert({ type: "success", message: "File uploaded successfully. Fetching logs..." });
      fetchLogs(batch_id);
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const fetchLogs = async (batch_id: string) => {
    try {
      const res = await axios.get(`/api/students/upload-status/${batch_id}`);
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Failed to fetch upload status." });
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Upload CSV/Excel for Student Registration" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Student Bulk Upload</h2>

          {alert && <Alert type={alert.type} message={alert.message} />}

          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          {batchId && (
            <div className="mt-8 text-left">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Validation Logs (Batch ID: {batchId})
              </h3>

              {logs.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                  {logs.map((log, index) => (
                    <li key={index}>{log}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No logs available yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
