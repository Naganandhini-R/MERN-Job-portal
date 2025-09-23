import React, { useState, useContext, useEffect } from "react"; 
import Navbar from "../components/Navbar";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser, useAuth } from "@clerk/clerk-react";

const StatusBadge = ({ status }) => {
  const raw = status?.toLowerCase();
  const formatted =
    raw === "pending"
      ? "Pending"
      : raw === "accepted"
      ? "Accepted"
      : raw === "rejected"
      ? "Rejected"
      : "Pending";

  const config = {
    Accepted: { bg: "bg-green-100", text: "text-green-800", icon: "✓" },
    Rejected: { bg: "bg-red-100", text: "text-red-800", icon: "✗" },
    Pending: { bg: "bg-blue-100", text: "text-blue-800", icon: "⏳" },
  };

  const { bg, text, icon } = config[formatted] || config.Pending;

  return (
    <span
      className={`${bg} ${text} px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 w-fit`}
    >
      <span>{icon}</span> {formatted}
    </span>
  );
};

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  const {
    backendUrl,
    userData,
    userApplications,
    fetchUserData,
    fetchUserApplications,
  } = useContext(AppContext);

  const updateResume = async () => {
    try {
      if (!resume) {
        toast.error("Please select a resume file.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
        await fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || error.message);
    }

    setIsEdit(false);
    setResume(null);
  };

  //  Deduplicate applications
  const uniqueApplications = userApplications.filter(
    (job, index, self) =>
      index ===
      self.findIndex(
        (j) => j.jobId?._id === job.jobId?._id && j.Status === job.Status
      )
  );

  // fetch both userData + applications on refresh
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);

  const resumeUrl = userData?.resume || "";

  // Loader until userData arrives
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading your applications...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2ml:px-20 mx-auto my-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Manage Your Applications
              </h1>
              <p className="text-gray-600">
                Manage your resume and track your job applications
              </p>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Your Resume</h2>

            {userData.resume && !isEdit && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Uploaded
              </span>
            )}
          </div>

          <div className="space-y-4">
            {isEdit || userData.resume === "" ? (
              <>
                {/* Upload Dropzone */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <label
                    className="flex flex-col items-center cursor-pointer"
                    htmlFor="resumeUpload"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>

                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {resume ? resume.name : "Select Resume (PDF)"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Click to upload your resume
                    </p>

                    <input
                      id="resumeUpload"
                      onChange={(e) => setResume(e.target.files[0])}
                      accept="application/pdf"
                      type="file"
                      hidden
                    />
                  </label>
                </div>

                {resume && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          File Selected
                        </h3>
                        <p className="text-sm text-gray-600">
                          {resume.name} •{" "}
                          {(resume.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Click "Save Resume" to upload
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={updateResume}
                    disabled={!resume}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    Save Resume
                  </button>

                  {userData.resume && (
                    <button
                      onClick={() => {
                        setIsEdit(false);
                        setResume(null);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">
                        Resume Successfully Uploaded!
                      </h3>
                      <p className="text-sm text-green-600">
                        Your resume is ready for job applications
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      target="_blank"
                      href={resumeUrl}
                      rel="noopener noreferrer"
                    >
                      View Full Resume
                    </a>

                    <button
                      onClick={() => setIsEdit(true)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      Replace Resume
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>

        {/* Applications Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Jobs Applied ({uniqueApplications.length})
            </h2>
          </div>

          {uniqueApplications.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500">
                Start applying to jobs to see them here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Company
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Job Title
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 max-sm:hidden">
                      Location
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 max-sm:hidden">
                      Date Applied
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueApplications.map((job, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {job.companyId?.image ? (
                            <img
                              className="w-10 h-10 rounded-lg object-cover"
                              src={job.companyId.image}
                              alt={job.companyId?.name}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                            </div>
                          )}
                          <span className="font-medium text-gray-800">
                            {job.companyId?.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-700">
                        {job.jobId?.title}
                      </td>
                      <td className="py-4 px-4 text-gray-600 max-sm:hidden">
                        {job.jobId?.location}
                      </td>
                      <td className="py-4 px-4 text-gray-600 max-sm:hidden">
                        {moment(job.date).format("MMM DD, YYYY")}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={job.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Applications;