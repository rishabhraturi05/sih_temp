"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColleges, setSelectedColleges] = useState([]);

  // Fetch colleges from MongoDB
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("/api/colleges");
        if (!response.ok) {
          throw new Error("Failed to fetch colleges");
        }
        const data = await response.json();
        // Sort by srNo to ensure serial order
        const sortedData = data.sort((a, b) => (a.srNo || 0) - (b.srNo || 0));
        setColleges(sortedData);
        setFiltered(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Selection logic (max 3 colleges)
  const handleClick = (clickedCollege) => {
    const alreadySelected = selectedColleges.find(
      (c) => c.srNo === clickedCollege.srNo
    );

    if (alreadySelected) {
      // Remove it
      setSelectedColleges(
        selectedColleges.filter((c) => c.srNo !== clickedCollege.srNo)
      );
    } else if (selectedColleges.length < 3) {
      // Add only if less than 3
      setSelectedColleges([...selectedColleges, clickedCollege]);
    }
  };

  // Search filter
  const handleChange = (e) => {
    const search = e.target.value;
    const filteredColleges = colleges.filter((el) =>
      el.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredColleges);
  };

  const toggleCompare = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className="flex flex-col w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 p-6">
        <h1 className="font-extrabold text-3xl md:text-4xl text-white mb-6 tracking-wide flex justify-center">
          Colleges in Jammu & Kashmir
        </h1>
        <div className="flex gap-3 justify-center">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Search colleges..."
            className="text-white bg-slate-800/70 backdrop-blur-sm border border-slate-700 h-12 md:w-1/2 p-3 rounded-xl outline-none shadow-md max-w-3xl placeholder-slate-400 focus:border-[#F39C12]"
          />
          <button
            onClick={toggleCompare}
            className="px-4 py-2 rounded-xl bg-[#F39C12] text-white font-semibold hover:bg-[#d7890f] transition shadow-sm"
          >
            Compare
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-6 m-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F39C12]"></div>
            <span className="ml-3 text-slate-300">Loading colleges...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg font-semibold mb-2">
              Error loading colleges
            </div>
            <div className="text-slate-300">{error}</div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-xl border border-slate-700">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                  <th className="py-3 px-4 border text-center">Sr. No.</th>
                  <th className="px-4 py-3 border">College Name</th>
                  <th className="px-4 py-3 border">Courses</th>
                  <th className="px-4 py-3 border">Location</th>
                  <th className="px-4 py-3 border">Entrance Exams</th>
                  <th className="px-4 py-3 border">ROI</th>
                  <th className="px-4 py-3 border">NIRF</th>
                  <th className="px-4 py-3 border">Phone</th>
                  <th className="px-4 py-3 border">Email</th>
                  <th className="px-4 py-3 border">Website</th>
                  <th className="px-4 py-3 border">Fees Estimates</th>
                  <th className="px-4 py-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((college) => (
                    <tr
                      key={college._id}
                      className="odd:bg-slate-800/50 even:bg-slate-800/30 hover:bg-slate-700/50 transition-colors duration-300"
                    >
                      <td className="py-3 px-4 border text-gray-700 font-medium text-center">
                        {college.srNo}
                      </td>
                      <td className="px-4 py-3 border text-gray-800 font-semibold">
                        {college.name || '-'}
                      </td>
                      <td className="px-4 py-3 border text-gray-600 text-sm">
                        {college.courses || '-'}
                      </td>
                      <td className="px-4 py-3 border text-gray-600 text-sm">
                        {college.location || '-'}
                      </td>
                      <td className="px-4 py-3 border text-gray-600 text-sm">
                        {college.entranceExams || '-'}
                      </td>
                      <td className="px-4 py-3 border text-gray-600 text-sm">
                        {college.returnOnInvestment || '-'}
                      </td>
                      <td className="px-4 py-3 border text-gray-600 text-sm">
                        {college.nirf || '-'}
                      </td>
                      <td className="px-4 py-3 border text-gray-600 text-sm">
                        {college.phoneNumber || '-'}
                      </td>
                      <td className="px-4 py-3 border text-gray-600 text-sm">
                        {college.emailAddress || '-'}
                      </td>
                      <td className="px-4 py-3 border text-gray-600 text-sm">
                        {college.website ? (
                          <a 
                            href={college.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {college.website}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 border text-gray-600 text-sm">
                        {college.feesEstimates || '-'}
                      </td>
                      <td className="px-4 py-3 border text-center">
                        <button
                          onClick={() => handleClick(college)}
                          className={`px-3 py-1 rounded-lg text-white text-xs font-medium transition shadow-sm ${
                            selectedColleges.find(
                              (c) => c.srNo === college.srNo
                            )
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-[#F39C12] hover:bg-[#d7890f]"
                          }`}
                        >
                          {selectedColleges.find(
                            (c) => c.srNo === college.srNo
                          )
                            ? "Remove"
                            : "Select"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No colleges found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedColleges.length === 3 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg">
          Max colleges have been selected for comparison.
        </div>
      )}

      {/* Compare Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-[80%] max-w-3xl border border-slate-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Compare Colleges
              </h2>
              {selectedColleges.length > 0 ? (
                <div className="overflow-x-auto max-h-[70vh]">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                        <th className="px-4 py-3 border text-left">Field</th>
                        {selectedColleges.map((college) => (
                          <th
                            key={`header-${college.srNo}`}
                            className="px-4 py-3 border text-left"
                          >
                            {college.name || `College ${college.srNo}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          Serial No.
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`srNo-${college.srNo}`}
                            className="px-4 py-3 border text-gray-700"
                          >
                            {college.srNo || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          College Name
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`name-${college.srNo}`}
                            className="px-4 py-3 border text-gray-700"
                          >
                            {college.name || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          Courses
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`courses-${college.srNo}`}
                            className="px-4 py-3 border text-gray-600"
                          >
                            {college.courses || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          Location
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`location-${college.srNo}`}
                            className="px-4 py-3 border text-gray-600"
                          >
                            {college.location || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          Entrance Exams
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`entranceExams-${college.srNo}`}
                            className="px-4 py-3 border text-gray-600"
                          >
                            {college.entranceExams || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          Return on Investment
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`roi-${college.srNo}`}
                            className="px-4 py-3 border text-gray-600"
                          >
                            {college.returnOnInvestment || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          NIRF
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`nirf-${college.srNo}`}
                            className="px-4 py-3 border text-gray-600"
                          >
                            {college.nirf || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          Phone Number
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`phone-${college.srNo}`}
                            className="px-4 py-3 border text-gray-600"
                          >
                            {college.phoneNumber || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          Email Address
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`email-${college.srNo}`}
                            className="px-4 py-3 border text-gray-600"
                          >
                            {college.emailAddress || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          Website
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`website-${college.srNo}`}
                            className="px-4 py-3 border text-gray-600"
                          >
                            {college.website ? (
                              <a 
                                href={college.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {college.website}
                              </a>
                            ) : '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-semibold text-gray-800">
                          Fees Estimates
                        </td>
                        {selectedColleges.map((college) => (
                          <td
                            key={`fees-${college.srNo}`}
                            className="px-4 py-3 border text-gray-600"
                          >
                            {college.feesEstimates || '-'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-300 text-center">
                  No colleges selected for comparison.
                </p>
              )}
              <div className="flex justify-center mt-6">
                <button
                  onClick={toggleCompare}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CollegeTable;
