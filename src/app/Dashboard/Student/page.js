"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import FullPageLoader from '../../components/loader'

const MentorCard = ({ mentor }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-800/70 backdrop-blur-sm shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex flex-col items-center pt-8 px-5 pb-5">
        <div className="relative w-28 h-28 -mt-2">
          <Image
            src={mentor.avatar}
            alt={mentor.name}
            fill
            className="rounded-full object-cover ring-4 ring-[#F39C12]/60"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="mt-4 text-lg font-extrabold text-white text-center">{mentor.name}</h3>
        <p className="text-sm text-[#F39C12] font-semibold text-center">{mentor.title}</p>
        <p className="text-slate-300 mt-3 leading-relaxed text-sm min-h-16 text-center">{mentor.bio}</p>
        <div className="mt-5 w-full flex flex-col items-center gap-3">
          <a href={`mailto:${mentor.email}`} className="text-xs text-slate-300 hover:text-white underline underline-offset-4">
            {mentor.email}
          </a>
          <span className="text-xs text-green-400 font-semibold px-3 py-1 bg-green-400/10 rounded-full">
            Applied ✓
          </span>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from localStorage
    const loadUser = () => {
      try {
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchAppliedMentors = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          setError('Please login to view your applied mentors.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/mentor-applications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Please login to view your applied mentors.');
          } else {
            throw new Error('Failed to fetch applied mentors');
          }
        } else {
          const data = await response.json();
          setMentors(data.mentors || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedMentors();
  }, []);

  if (loading) return <FullPageLoader />;
  if (error) return <div className="text-red-500 p-6 text-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">{error}</div>;

  return (
    <section className="px-6 py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        {user && (
          <div className="mb-8 md:mb-12 bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Hello, {user.firstName || user.Name || 'Student'}! 👋
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#F39C12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className="text-sm md:text-base">{user.email}</span>
                  </div>
                  {user.firstName && user.lastName && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#F39C12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm md:text-base">{user.firstName} {user.lastName}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-[#F39C12]/20 rounded-lg border border-[#F39C12]/30">
                  <span className="text-sm text-[#F39C12] font-semibold">
                    {mentors.length} {mentors.length === 1 ? 'Mentor' : 'Mentors'} Applied
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <header className="text-center mb-12 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            My Applied Mentors
          </h1>
          <p className="mt-4 text-slate-300 max-w-3xl mx-auto">
            View all the mentors you have applied to schedule meetings with. You can contact them directly via email.
          </p>
        </header>

        {mentors.length === 0 ? (
          <div className="text-center text-slate-300 py-12">
            <p className="text-lg mb-4">You haven&apos;t applied to any mentors yet.</p>
            <a 
              href="/mentorships" 
              className="inline-block text-[#F39C12] hover:text-[#d7890f] underline underline-offset-4 font-semibold"
            >
              Browse available mentors →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
            {mentors.map((m) => (
              <MentorCard key={m.id} mentor={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Page