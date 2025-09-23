import React, { useState, useEffect ,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { AppContext } from "../context/AppContext"; 

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [saved, setSaved ] = useState(false);

  const { backendUrl } = useContext(AppContext);

  //  Check if this job is already saved on load
  useEffect(() => {
     if (isSignedIn && user) {
    const checkSaved = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `${backendUrl}/api/users/saved-jobs/saved-jobs/list`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const isSaved = res.data.jobs.some(
          (item) => item.jobId._id === job._id
        );
        setSaved(isSaved);
      } catch (err) {
        console.error("Error checking saved jobs:", err);
      }
    };
    checkSaved();
  }
  }, [job._id, getToken]);

  // Toggle save/unsave
  const toggleSave = async () => {
    try {
      const token = await getToken();
      const res = await axios.post(`${backendUrl}/api/users/saved-jobs/save-job`,
        { jobId: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaved(res.data.message === "Job saved");
    } catch (err) {
      console.error("Error saving/unsaving job:", err);
    }
  };

  return (
    <div className="border p-6 shadow rounded relative">
      {/* Bookmark icon */}
      <button
        onClick={toggleSave}
        className="absolute top-3 right-3 text-gray-500 hover:text-blue-600"
      >
        {saved ? (
          <BookmarkCheck size={22} className="text-blue-600 fill-blue-600" />
        ) : (
          <Bookmark size={22} className="text-gray-500" />
        )}
      </button>

      <div className="flex justify-between items-center">
        <img
          className="h-8"
          src={job.companyId?.image || "https://via.placeholder.com/150"}
          alt="Company Logo"
        />
      </div>

      <h4 className="font-medium text-xl mt-2">{job.title}</h4>

      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-blue-50 border border-blue-200 px-4 py-1 rounded">
          {job.location}
        </span>
        <span className="bg-red-50 border border-red-200 px-4 py-1 rounded">
          {job.level}
        </span>
      </div>

      <p
        className="text-gray-500 text-sm mt-4"
        dangerouslySetInnerHTML={{
          __html: job.description?.slice(0, 158) + "..." || "",
        }}
      ></p>

      <div className="mt-4 flex gap-3 text-sm">
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply now
        </button>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="border border-gray-500 rounded text-gray-500 px-4 py-2"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCard;