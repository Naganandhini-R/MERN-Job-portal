import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext)
  const [applicants, setApplicants] = useState(false)

  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      })
      if (data.success) {
        setApplicants(data.applications.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeJobApplicationStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/company/update-status`,
        { id, status },
        { headers: { token: companyToken } }
      )
      if (response.data.success) {
        toast.success('Status updated')
        setApplicants(prev =>
          prev.map(app => app._id === id ? { ...app, status } : app)
        )
      } else {
        toast.error(response.data.message || 'Failed to update status')
      }
    } catch (error) {
      toast.error('Error updating status')
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications()
    }
  }, [companyToken])

  if (!applicants) return <Loading />

  if (applicants.length === 0) {
    return (
      <div className='flex items-center justify-center h-[70vh]'>
        <p className='text-xl sm:text-2xl'>No Applications Available</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm max-sm:text-sm'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-l font-semibold text-gray-800 uppercase tracking-wider'>Job Applications</h2>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr className='border-b border-gray-200'>
                <th className='py-4 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider max-sm:hidden'>#</th>
                <th className='py-4 px-10 text-left text-sm font-medium text-gray-600 uppercase tracking-wider'>User name</th>
                <th className='py-4 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider max-sm:hidden'>Job Title</th>
                <th className='py-4 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider max-sm:hidden'>Location</th>
                <th className='py-4 text-center text-sm font-medium text-gray-600 uppercase tracking-wider'>Resume</th>
                <th className='py-4 text-center  text-sm font-medium text-gray-600 uppercase tracking-wider max-sm:hidden'>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants
                .filter((item) => item.jobId && item.userId)
                .map((applicant, index) => (
                  <tr key={index} className='text-gray-700 hover:bg-gray-50 transition-colors'>
                    <td className='py-3 px-4 border-b text-center max-sm:hidden'>{index + 1}</td>
                    <td className='py-2 px-4 border-b items-center'>
                      <div className='flex items-center gap-2'>
                        <img
                          className='w-9 h-9 rounded-full object-cover max-sm:hidden'
                          src={applicant.userId?.image || '/default-user.png'}
                          alt='User'
                        />
                        <span>{applicant.userId?.name}</span>
                      </div>
                    </td>
                    <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId?.title}</td>
                    <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId?.location}</td>
                    <td className='py-2 px-4 border-b flex justify-center items-center'>
                      {applicant.userId?.resume ? (
                        <a
                          href={applicant.userId.resume}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='bg-blue-50 text-blue-600 px-4 py-2 rounded inline-flex gap-2 items-center hover:bg-blue-100 transition-colors'
                        >
                          Resume <img src={assets.resume_download_icon} alt='Download Icon' />
                        </a>
                      ) : (
                        <span className='text-gray-400'>No Resume</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-center max-sm:hidden">
                      <div className="flex justify-center items-center">
                        {(!applicant.status || applicant.status.toLowerCase() === 'pending' || applicant.status === '') ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')}
                              className="px-5 py-2 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100 hover:text-green-400 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')}
                              className="px-5 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 hover:text-red-400 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`inline-flex px-5 py-2 rounded-full  text-xs font-medium items-center ${applicant.status?.toLowerCase() === 'accepted'
                                ? 'bg-green-100 text-green-600'
                                : applicant.status?.toLowerCase() === 'rejected'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                          >
                            {applicant.status || 'Pending'}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ViewApplications
