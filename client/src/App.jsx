import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/AppContext";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import DashboardLayout from "./pages/DashboardLayout";
import 'quill/dist/quill.snow.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SavedJobs from "./pages/SavedJobs"; 

const App = () => {
  const { showRecruiterLogin, companyToken , backendUrl} = useContext(AppContext);
  const { user, isSignedIn } = useUser();

  // Sync Clerk user data with backend
  useEffect(() => {
    if (isSignedIn && user) {
      fetch(`${backendUrl}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          image: user.imageUrl,
        }),
      }).catch(error => console.error('User sync error:', error));
    }
  }, [isSignedIn, user]);

  return (
    // Changed from min-h-screen to min-h-full for better scroll behavior
    <div className="min-h-full bg-gray-50">
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
        <Route path="/saved-jobs" element={<SavedJobs />} /> 

        {/* Protected Dashboard Layout with nested routes */}
        <Route path='/dashboard' element={<DashboardLayout />}>
          {companyToken ? (
            <>
              <Route path='add-job' element={<AddJob />} />
              <Route path='manage-jobs' element={<ManageJobs />} />
              <Route path='view-applications' element={<ViewApplications />} />
            </>
          ) : null}
        </Route>
      </Routes>
    </div>
  );
};

export default App;