import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}
        <img
          onClick={() => navigate('/')}
          className="cursor-pointer"
          src={assets.logo}
          alt="Logo"
        />

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-6">
            {/* New Navigation Links */}
            <Link to="/applications" className="text-gray-600 hover:text-gray-900">
              Applied Jobs
            </Link>
            <Link to="/saved-jobs" className="text-gray-600 hover:text-gray-900">
              Saved Jobs
            </Link>
            <p className="max-sm:hidden">
              Hi, {user.firstName + ' ' + user.lastName}
            </p>
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-gray-600"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
