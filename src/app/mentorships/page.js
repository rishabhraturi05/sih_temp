"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import FullPageLoader from '../components/loader'


const MentorCard = ({ mentor, onSchedule }) => {
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState(null);

  const handleSchedule = async () => {
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('Please login to schedule a meeting with a mentor.');
      return;
    }

    setIsScheduling(true);
    setScheduleStatus(null);

    try {
      const response = await fetch('/api/mentor-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mentorId: mentor.id })
      });

      const data = await response.json();

      if (response.ok) {
        setScheduleStatus('success');
        alert('Meeting scheduled successfully! You can view your applied mentors in your dashboard.');
        if (onSchedule) {
          onSchedule(mentor.id);
        }
      } else {
        setScheduleStatus('error');
        alert(data.message || 'Failed to schedule meeting. Please try again.');
      }
    } catch (error) {
      setScheduleStatus('error');
      alert('An error occurred. Please try again.');
      console.error('Error scheduling meeting:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-800/70 backdrop-blur-sm shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl">
      {/* <div className="absolute right-3 top-3">
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#F39C12] text-white shadow">
          {mentor.rating.toFixed(1)}+
        </span>
      </div> */}
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
          <button 
            onClick={handleSchedule}
            disabled={isScheduling}
            className={`text-sm ${
              scheduleStatus === 'success' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-[#F39C12] hover:bg-[#d7890f]'
            } text-white rounded-xl px-4 py-2 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F39C12]/70 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isScheduling ? 'Scheduling...' : scheduleStatus === 'success' ? 'Scheduled ✓' : 'Schedule a Meeting'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/mentors');
        if (!response.ok) {
          throw new Error('Failed to fetch mentors');
        }
        const data = await response.json();
        
        // Map MongoDB fields to component expected fields
        const mappedMentors = data.map((mentor) => ({
          id: mentor._id,
          name: mentor.Name || '',
          title: mentor.Title || '',
          bio: mentor.Bio || '',
          avatar: mentor.Photo || 'https://i.pravatar.cc/600?img=1',
          email: mentor.email || '',
        }));
        
        setMentors(mappedMentors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (loading) return <FullPageLoader />;
  if (error) return <div className="text-red-500 p-6 text-center">Error: {error}</div>;

  return (
    <section className="px-6 py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Connect with Expert Mentors
          </h1>
          <p className="mt-4 text-slate-300 max-w-3xl mx-auto">
            Get personalized guidance from experienced professionals across various fields. Book one-on-one sessions to accelerate your career journey.
          </p>
        </header>

        {mentors.length === 0 ? (
          <div className="text-center text-slate-300 py-12">
            <p>No mentors available at the moment.</p>
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
