"use client";
import React, { useEffect, useState } from "react";
import FullPageLoader from "../../components/loader";
import ZegoMeeting from "../../components/ZegoMeeting";

const StudentCard = ({ student, onStatusUpdate, onJoin }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(student.status || 'pending');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingInfo, setMeetingInfo] = useState({
    date: student.meetingDate ? new Date(student.meetingDate).toISOString().split('T')[0] : null,
    time: student.meetingTime || null
  });
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Update meeting info when student data changes
  useEffect(() => {
    if (student.meetingDate && student.meetingTime) {
      const dateStr = new Date(student.meetingDate).toISOString().split('T')[0];
      setMeetingInfo({
        date: dateStr,
        time: student.meetingTime
      });
    }
  }, [student.meetingDate, student.meetingTime]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        alert('Please login to respond to applications.');
        return;
      }

      const response = await fetch('/api/mentor-applications/respond', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: student.id,
          status: newStatus
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStatus(newStatus);
        if (onStatusUpdate) {
          onStatusUpdate(student.id, newStatus);
        }
        // If accepted, show schedule modal
        if (newStatus === 'accepted') {
          setShowScheduleModal(true);
        }
      } else {
        alert(data.message || 'Failed to update application status. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    if (!meetingDate || !meetingTime) {
      alert('Please select both date and time');
      return;
    }

    setIsScheduling(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        alert('Please login to schedule meetings.');
        return;
      }

      const response = await fetch('/api/mentor-applications/schedule', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: student.id,
          meetingDate: meetingDate,
          meetingTime: meetingTime
        })
      });

      const data = await response.json();

      if (response.ok) {
        const scheduledDate = new Date(data.meetingDate);
        const dateStr = scheduledDate.toISOString().split('T')[0];
        setMeetingInfo({ date: dateStr, time: meetingTime });
        setShowScheduleModal(false);
        setMeetingDate('');
        setMeetingTime('');
        if (onStatusUpdate) {
          onStatusUpdate(student.id, currentStatus, dateStr, meetingTime);
        }
        alert('Meeting scheduled successfully!');
      } else {
        const errorMessage = data.message || data.error || 'Failed to schedule meeting. Please try again.';
        console.error('Schedule meeting error:', data);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert('An error occurred. Please check the console for details.');
    } finally {
      setIsScheduling(false);
    }
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return 'N/A';
    try {
      const date = new Date(`${dateString}T${timeString}`);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const meetingDateObj = meetingInfo.date && meetingInfo.time
    ? new Date(`${meetingInfo.date}T${meetingInfo.time}`)
    : null;
  const oneHourAfter = meetingDateObj ? new Date(meetingDateObj.getTime() + 60 * 60 * 1000) : null;
  const canJoin = meetingDateObj ? now >= meetingDateObj && (!oneHourAfter || now <= oneHourAfter) : false;
  const isExpired = meetingDateObj ? now > oneHourAfter : false;
  const meetingId =
    student.meetingId || `${student.id}-${meetingInfo.date || ''}-${meetingInfo.time || ''}`;

  const getStatusBadge = () => {
    switch (currentStatus) {
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

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (<>
    <div className="relative rounded-3xl overflow-hidden bg-slate-800/70 backdrop-blur-sm shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex flex-col items-center pt-8 px-5 pb-5">
        <div className="relative w-28 h-28 -mt-2 flex items-center justify-center bg-[#F39C12]/20 rounded-full ring-4 ring-[#F39C12]/60">
          <svg
            className="w-16 h-16 text-[#F39C12]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-extrabold text-white text-center">
          {student.name}
        </h3>
        <div className="mt-5 w-full flex flex-col items-center gap-3">
          <a
            href={`mailto:${student.email}`}
            className="text-xs text-slate-300 hover:text-white underline underline-offset-4"
          >
            {student.email}
          </a>
          {student.appliedAt && (
            <p className="text-xs text-slate-400 text-center">
              Applied on {formatDate(student.appliedAt)}
            </p>
          )}
          {getStatusBadge()}

          {currentStatus === 'pending' && (
            <div className="flex gap-2 mt-2 w-full">
              <button
                onClick={() => handleStatusUpdate('accepted')}
                disabled={isUpdating}
                className="flex-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isUpdating ? '...' : 'Accept'}
              </button>
              <button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
                className="flex-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isUpdating ? '...' : 'Reject'}
              </button>
            </div>
          )}

          {currentStatus === 'accepted' && (
            <>
              {meetingInfo.date && meetingInfo.time ? (
                <div className="mt-2 w-full text-center">
                  <p className="text-xs text-green-400 font-semibold mb-1">Meeting Scheduled</p>
                  <p className="text-xs text-slate-300">
                    {formatDateTime(meetingInfo.date, meetingInfo.time)}
                  </p>
                  {!isExpired ? (
                    <button
                      onClick={() => onJoin?.(meetingId, student.name)}
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
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="mt-2 text-xs text-[#F39C12] hover:text-[#d7890f] underline"
                  >
                    Reschedule
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="mt-2 w-full text-sm bg-[#F39C12] hover:bg-[#d7890f] text-white rounded-lg px-4 py-2 font-semibold transition shadow-md"
                >
                  Schedule Meeting
                </button>
              )}
            </>
          )}

          {currentStatus !== 'pending' && student.respondedAt && (
            <p className="text-xs text-slate-400 text-center">
              Responded on {formatDate(student.respondedAt)}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Schedule Meeting Modal */}
    {showScheduleModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
        <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Schedule Meeting with {student.name}</h3>
          <form onSubmit={handleScheduleMeeting} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Meeting Date
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                min={today}
                required
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#F39C12]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Meeting Time
              </label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#F39C12]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowScheduleModal(false);
                  setMeetingDate('');
                  setMeetingTime('');
                }}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isScheduling}
                className="flex-1 px-4 py-2 bg-[#F39C12] hover:bg-[#d7890f] text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScheduling ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
  );
};

const Page = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showCall, setShowCall] = useState(false);
  const [callMeetingId, setCallMeetingId] = useState(null);

  const handleStatusUpdate = (studentId, newStatus, meetingDate = null, meetingTime = null) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? {
            ...student,
            status: newStatus,
            respondedAt: new Date().toISOString(),
            meetingDate: meetingDate || student.meetingDate,
            meetingTime: meetingTime || student.meetingTime
          }
          : student
      )
    );
  };

  useEffect(() => {
    // Load user data from localStorage
    const loadUser = () => {
      try {
        const storedUser =
          typeof window !== "undefined" ? localStorage.getItem("user") : null;
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchAppliedStudents = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          setError("Please login to view students who applied to you.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/student-applied", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Please login to view students who applied to you.");
          } else {
            throw new Error("Failed to fetch applied students");
          }
        } else {
          const data = await response.json();
          setStudents(data.students || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedStudents();
  }, []);

  if (loading) return <FullPageLoader />;
  if (error)
    return (
      <div className="text-red-500 p-6 text-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">
        {error}
      </div>
    );

  return (
    <section className="px-6 py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        {user && (
          <div className="mb-8 md:mb-12 bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Hello, {user.firstName || user.Name || "Mentor"}! 👋
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[#F39C12]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    <span className="text-sm md:text-base">{user.email}</span>
                  </div>
                  {user.firstName && user.lastName && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#F39C12]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-sm md:text-base">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-[#F39C12]/20 rounded-lg border border-[#F39C12]/30">
                  <span className="text-sm text-[#F39C12] font-semibold">
                    {students.length} {students.length === 1 ? "Student" : "Students"}{" "}
                    Applied
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <header className="text-center mb-12 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Students Who Applied
          </h1>
          <p className="mt-4 text-slate-300 max-w-3xl mx-auto">
            View all the students who have applied to schedule meetings with you.
            You can contact them directly via email.
          </p>
        </header>

        {students.length === 0 ? (
          <div className="text-center text-slate-300 py-12">
            <p className="text-lg mb-4">
              No students have applied to you yet.
            </p>
            <p className="text-sm text-slate-400">
              Students will appear here once they apply to schedule a meeting with you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onStatusUpdate={handleStatusUpdate}
                onJoin={(ignoredMeetingId) => {
                  // Construct consistent ID: meeting_APPID_MENTORID
                  // This matches the format used in Student Dashboard
                  // NOTE: user.id might be user._id depending on auth provider, usually _id from Mongo
                  const mentorId = user.id || user._id;
                  const consistentId = `meeting_${student.applicationId}_${mentorId}`;
                  const sanitizedId = consistentId.replace(/[^a-zA-Z0-9_]/g, '');
                  console.log("Mentor joining with ID:", sanitizedId);
                  setCallMeetingId(sanitizedId);
                  setShowCall(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
      {showCall && callMeetingId && (
        <ZegoMeeting
          meetingId={callMeetingId}
          userName={user?.firstName || user?.Name || 'Mentor'}
          userId={user?.id || user?._id || user?.email || `mentor-${Date.now()}`}
          onClose={() => {
            setShowCall(false);
            setCallMeetingId(null);
          }}
        />
      )}
    </section>
  );
};

export default Page;