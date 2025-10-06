"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FullPageLoader from "../components/loader";

const ScholarshipsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch("/api/data"); // API that fetches from MongoDB
        const data = await response.json();
        setScholarships(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <FullPageLoader />;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;

  // Filter scholarships by search keyword
  const filteredScholarships = scholarships.filter((sch) =>
    (sch.Name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-center items-center max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-medium mb-6 text-center text-black">
        🎓 Scholarships for J&K Students
      </h1>

      {/* Search filter */}
      <div className="px-3 flex justify-between mb-8 items-center gap-2 border border-gray-300 rounded-xl bg-gray-100 w-[40%]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Scholarships..."
          className="text-black h-12 w-[100] md:w-1/2 p-3 rounded-xl outline-none"
        />
        <i className="fa-solid fa-magnifying-glass text-black"></i>
      </div>

      {/* Scholarship list */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScholarships.map((sch) => (
            <div
              key={sch._id}
              className="relative border rounded-xl p-5 shadow hover:shadow- transition bg-gray-200"
            >
              <h2 className="text-xl text-black">{sch.Name}</h2>
              <p className="text-gray-600 mt-2">
                <strong>Eligibility:</strong> {sch.Eligibility}
              </p>
              <p className="text-gray-600 mt-1">
                <strong>Colleges:</strong> {sch.Colleges}
              </p>
              {sch.Link ? (
                <Link
                  href={sch.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-blue-600 hover:underline font-medium"
                >
                  <i className="fa-solid fa-link"></i> Official Notification / Apply
                </Link>
              ) : (
                <span className="mt-3 inline-block text-gray-500">No link available</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">No scholarships found.</p>
      )}
    </div>
  );
};

export default ScholarshipsPage;
