"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Alert from "@/components/ui/alert/Alert";
import StudentCredentialTable, { Credential } from "@/components/student/StudentCredential";


export default function StudentRegistration() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);

  // Utility: returns icon SVG based on filename extension
  function getFileIcon(filename: string) {
    const ext = filename.split(".").pop()?.toLowerCase() || "";

    switch (ext) {
      case "csv":
        return (
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <text
              x="50%"
              y="55%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="8"
              fill="green"
            >
              CSV
            </text>
          </svg>
        );
      case "xls":
      case "xlsx":
        return (
          <svg
            className="w-8 h-8 text-green-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <text
              x="50%"
              y="55%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="8"
              fill="green"
            >
              XLSX
            </text>
          </svg>
        );
      default:
        return (
          <svg
            className="w-8 h-8 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
    }
  }

  // File select handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setProgress(0);
  };

  // Upload handler with progress
  const handleUpload = async () => {
    setAlert(null);
    if (!file) {
      setAlert({
        variant: "warning",
        message: "Please select a CSV or Excel file before uploading.",
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/students/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percent);
        },
      });

      const { batch_id } = res.data;
      setBatchId(batch_id);
      setAlert({
        variant: "success",
        message: "File uploaded successfully. Fetching validation logs...",
      });

      fetchLogs(batch_id);
      fetchCredentials();
    } catch (err) {
      console.error(err);
      setAlert({ variant: "error", message: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
      setProgress(0);
      setFile(null);
    }
  };

  // Logs fetcher
  const fetchLogs = async (batch_id: string) => {
    try {
      const res = await axios.get(`/api/students/upload-status/${batch_id}`);
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
      setAlert({ variant: "error", message: "Failed to fetch validation logs." });
    }
  };

  // Download failed records
  const handleDownloadFailed = async () => {
    try {
      const response = await axios.get(`/api/students/failed-records/${batchId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "failed-records.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      setAlert({ variant: "error", message: "Failed to download failed records." });
    }
  };

  // Credentials fetcher
  const fetchCredentials = async () => {
    try {
      const res = await axios.get("/api/creds/all");
      setCredentials(res.data);
    } catch (err) {
      setAlert({ variant: "error", message: "Failed to fetch credentials" });
    }
  };

  // Resend email
  const resendEmail = async (studentId: string) => {
    try {
      await axios.post("/api/email/resend", { studentId });
      setAlert({ variant: "success", message: `Email resent to ${studentId}` });
      fetchCredentials();
    } catch {
      setAlert({ variant: "error", message: "Failed to resend email" });
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCredentials();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Student Bulk Registration" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            Upload CSV / Excel for Student Registration
          </h2>

          {alert && <Alert variant={alert.variant} message={alert.message} />}

          {/* Dropzone styled div */}
          <label
            htmlFor="file-upload"
            className="mb-4 flex mt-4 flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-600 transition-colors"
          >
            <input
              id="file-upload"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />

            {file ? (
              <div className="flex items-center space-x-4">
                {getFileIcon(file.name)}
                <div className="text-left">
                  <p className="font-medium text-gray-800 dark:text-white">{file.name}</p>
                  {uploading && (
                    <div className="w-48 mt-2 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-blue-600 h-4 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              
              <div className="flex flex-col items-center">
              {/* 👇 Default Upload Icon */}
              <img
                src="/images/icons/uploadFile.png"
                alt="Upload Icon"
                className="w-10 h-10 mb-2 opacity-60"
              />
              
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                Click or drag file here to upload
              </p>
            </div>
            )}
          </label>

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? `Uploading... ${progress}%` : "Upload"}
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No logs available yet.
                </p>
              )}

              <button
                onClick={handleDownloadFailed}
                className="mt-4 text-sm text-blue-600 underline hover:text-blue-800"
              >
                Download Failed Records
              </button>
            </div>
          )}

          <StudentCredentialTable
            credentials={credentials}
            onResend={resendEmail}
          />
        </div>
      </div>
    </div>
  );
}
