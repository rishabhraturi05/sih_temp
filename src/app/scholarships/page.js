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
  const normalizedScholarships = Array.isArray(scholarships) ? scholarships : [];
  const filteredScholarships = normalizedScholarships.filter((sch) =>
    (sch?.Name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A] py-12 px-6">
      <div className="flex flex-col justify-center items-center max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
          🎓 Scholarships for J&K Students
        </h1>

        {/* Search filter */}
        <div className="px-3 flex justify-between mb-8 items-center gap-2 border border-slate-700 rounded-xl bg-slate-800/70 backdrop-blur-sm w-full md:w-[40%]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Scholarships..."
            className="text-white bg-transparent h-12 w-full p-3 rounded-xl outline-none placeholder-slate-400"
          />
          <i className="fa-solid fa-magnifying-glass text-[#F39C12]"></i>
        </div>

        {/* Scholarship list */}
        {filteredScholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredScholarships.map((sch) => (
              <div
                key={sch._id}
                className="relative border border-slate-700 rounded-xl p-5 shadow-xl hover:shadow-2xl transition bg-slate-800/70 backdrop-blur-sm"
              >
                <h2 className="text-xl text-white font-bold mb-3">{sch.Name}</h2>
                <p className="text-slate-300 mt-2">
                  <strong className="text-[#F39C12]">Eligibility:</strong> {sch.Eligibility}
                </p>
                <p className="text-slate-300 mt-1">
                  <strong className="text-[#F39C12]">Colleges:</strong> {sch.Colleges}
                </p>
                {sch.Link ? (
                  <Link
                    href={sch.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[#F39C12] hover:text-[#d7890f] underline font-medium transition-colors"
                  >
                    <i className="fa-solid fa-link"></i> Official Notification / Apply
                  </Link>
                ) : (
                  <span className="mt-3 inline-block text-slate-400">No link available</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-300 text-center mt-10">No scholarships found.</p>
        )}
      </div>
    </div>
  );
};

export default ScholarshipsPage;
