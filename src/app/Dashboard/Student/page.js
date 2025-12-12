"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import FullPageLoader from '../../components/loader'
import ZegoMeeting from '../../components/ZegoMeeting'

const MentorCard = ({ mentor, onRetract, retractingId, onJoin }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const formatDateTime = (dateValue, timeString) => {
    if (!dateValue || !timeString) return null;
    try {
      let date;
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        // If dateValue is already a full ISO string, use it directly
        if (dateValue.includes('T')) {
          date = new Date(dateValue);
        } else {
          // If it's just a date string, combine with time
          date = new Date(`${dateValue}T${timeString}`);
        }
      } else {
        return null;
      }

      if (isNaN(date.getTime())) {
        return null;
      }

      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return null;
    }
  };

  const getMeetingDateObj = () => {
    if (!mentor.meetingDate || !mentor.meetingTime) return null;
    const combined = mentor.meetingDate.includes('T')
      ? new Date(mentor.meetingDate)
      : new Date(`${mentor.meetingDate}T${mentor.meetingTime}`);
    return isNaN(combined.getTime()) ? null : combined;
  };

  const meetingDateObj = getMeetingDateObj();
  const oneHourAfter = meetingDateObj ? new Date(meetingDateObj.getTime() + 60 * 60 * 1000) : null;
  const canJoin = meetingDateObj ? now >= meetingDateObj && (!oneHourAfter || now <= oneHourAfter) : false;
  const isExpired = meetingDateObj ? now > oneHourAfter : false;
  const meetingId =
    mentor.meetingId || `${mentor.id}-${mentor.meetingDate || ''}-${mentor.meetingTime || ''}`;

  const getStatusBadge = () => {
    const status = mentor.status || 'pending';
    switch (status) {
      case 'accepted':
        return (
          <span className="text-xs text-green-400 font-semibold px-3 py-1 bg-green-400/10 rounded-full">
            Accepted ✓
          </span>
        );
      case 'rejected':
        return (
          <span className="text-xs text-red-400 font-semibold px-3 py-1 bg-red-400/10 rounded-full">
            Rejected ✗
          </span>
        );
      default:
        return (
          <span className="text-xs text-yellow-400 font-semibold px-3 py-1 bg-yellow-400/10 rounded-full">
            Pending ⏳
          </span>
        );
    }
  };

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
          {getStatusBadge()}
          {mentor.status === 'accepted' && mentor.meetingDate && mentor.meetingTime && (
            <div className="mt-2 w-full text-center px-3 py-2 bg-green-400/10 rounded-lg border border-green-400/20">
              <p className="text-xs text-green-400 font-semibold mb-1">Meeting Scheduled</p>
              <p className="text-xs text-slate-300">
                {formatDateTime(mentor.meetingDate, mentor.meetingTime) ||
                  `${formatDate(mentor.meetingDate)} at ${mentor.meetingTime}`}
              </p>
              {!isExpired ? (
                <button
                  onClick={() => {
                    onJoin?.(meetingId, mentor.name);
                  }}
                  disabled={!canJoin}
                  className={`mt-2 w-full text-xs font-semibold rounded-lg px-3 py-2 transition shadow ${canJoin
                    ? 'bg-[#F39C12] hover:bg-[#d7890f] text-white'
                    : 'bg-slate-700 text-slate-300 cursor-not-allowed'
                    }`}
                >
                  {canJoin ? 'Join Meeting' : 'Join available at meeting time'}
                </button>
              ) : (
                <p className="mt-2 text-xs text-red-400 font-semibold">Meeting expired</p>
              )}
            </div>
          )}
          {mentor.respondedAt && (
            <p className="text-xs text-slate-400 text-center">
              Responded on {formatDate(mentor.respondedAt)}
            </p>
          )}
          {(mentor.status === 'pending' || (mentor.status === 'accepted' && (!mentor.meetingDate || !mentor.meetingTime))) && (
            <button
              onClick={() => onRetract(mentor.id, mentor.meetingDate, mentor.meetingTime)}
              disabled={retractingId === mentor.id}
              className="mt-3 w-full text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-semibold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {retractingId === mentor.id ? 'Retracting...' : 'Retract Request'}
            </button>
          )}
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
  const [retractingId, setRetractingId] = useState(null);
  const [showCall, setShowCall] = useState(false);
  const [callMeetingId, setCallMeetingId] = useState(null);

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

  const handleRetract = async (mentorId, meetingDate, meetingTime) => {
    const hasScheduled = meetingDate && meetingTime;
    if (hasScheduled) {
      alert('Cannot retract: meeting already scheduled.');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('Please login to retract your request.');
      return;
    }

    // find application id fallback
    const target = mentors.find((m) => m.id === mentorId);
    const applicationId = target?.applicationId || target?._id || mentorId;

    setRetractingId(mentorId);
    try {
      const response = await fetch('/api/mentor-applications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mentorId, applicationId })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to retract request.');
      }

      setMentors((prev) => prev.filter((m) => m.id !== mentorId));
    } catch (err) {
      alert(err.message || 'Failed to retract request.');
    } finally {
      setRetractingId(null);
    }
  };

  if (loading) return <FullPageLoader />;
  if (error) return <div className="text-red-500 p-6 text-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">{error}</div>;

  return (
    <section className="px-6 py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A] min-h-screen">
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
              <MentorCard
                key={m.id}
                mentor={m}
                onRetract={(id, date, time) => {
                  if (retractingId === id) return;
                  handleRetract(id, date, time);
                }}
                retractingId={retractingId}
                onJoin={(ignoredMeetingId, peerName) => {
                  // Construct consistent ID: meeting_APPID_MENTORID
                  // This matches the format used in Mentor Dashboard
                  const consistentId = `meeting_${m.applicationId}_${m.id}`;
                  const sanitizedId = consistentId.replace(/[^a-zA-Z0-9_]/g, '');
                  console.log("Student joining with ID:", sanitizedId);
                  setCallMeetingId(sanitizedId);
                  setShowCall(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
      {
        showCall && callMeetingId && (
          <ZegoMeeting
            meetingId={callMeetingId}
            userName={user?.firstName || user?.Name || 'Student'}
            userId={user?.id || user?._id || user?.email || `student-${Date.now()}`}
            onClose={() => {
              setShowCall(false);
              setCallMeetingId(null);
            }}
          />
        )
      }
    </section >
  )
}

export default Page