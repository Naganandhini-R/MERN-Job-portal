import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import JobCard from "../components/JobCard";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext"; 

const SavedJobs = () => {
  const { getToken, isSignedIn } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!isSignedIn) return;

      try {
        const token = await getToken();
        const res = await axios.get(`${backendUrl}/api/users/saved-jobs/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [getToken, isSignedIn]);

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = savedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-gray-700 mb-8 text-center">My Saved Jobs</h2>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-gray-600 text-lg text-center">
              Your saved jobs list is empty. Browse and save jobs to see them here!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentJobs.map((item, index) => (
                <JobCard key={`${item.jobId}-${index}`} job={item.jobId} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-10">
                <img
                  onClick={handlePrevPage}
                  src={assets.left_arrow_icon}
                  alt="Previous Page"
                  className={`cursor-pointer ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
                />

                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClick(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                      currentPage === index + 1 ? "bg-blue-100 text-blue-500" : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <img
                  onClick={handleNextPage}
                  src={assets.right_arrow_icon}
                  alt="Next Page"
                  className={`cursor-pointer ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
                />
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SavedJobs;
