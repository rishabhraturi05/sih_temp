"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// NEEDS ATTENTION: Ensure these variables are in your .env.local file prefixed with NEXT_PUBLIC_
const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
const SERVER_SECRET = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
console.log("APP_ID:", APP_ID);
console.log("SECRET:", SERVER_SECRET);

const ZegoMeeting = ({ meetingId, userName, userId, onClose }) => {
    const containerRef = useRef(null);
    const joinedRef = useRef(false);
    const router = useRouter();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!meetingId || !userName || !userId) {
            console.error("Missing required props for ZegoMeeting:", { meetingId, userName, userId });
            return;
        }

        const initMeeting = async () => {
            try {
                if (!APP_ID || !SERVER_SECRET) {
                    setError("ZegoCloud AppID and ServerSecret are missing. Please check .env.local file.");
                    return;
                }

                // Sanitize meetingId: allow only letters, numbers, and underscores
                const sanitizedMeetingId = meetingId.replace(/[^a-zA-Z0-9_]/g, '');
                const safeUserId = String(userId || `user-${Date.now()}`);

                console.log("Initializing ZegoCloud with:", {
                    sanitizedMeetingId,
                    safeUserId,
                    userName,
                    originalMeetingId: meetingId
                });

                // Dynamically import ZegoUIKitPrebuilt to avoid SSR issues
                const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');

                // Generate Kit Token
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    APP_ID,
                    SERVER_SECRET,
                    sanitizedMeetingId,
                    safeUserId,
                    userName
                );

                if (joinedRef.current) return;
                joinedRef.current = true;

                // Create instance object from Kit Token
                const zp = ZegoUIKitPrebuilt.create(kitToken);

                // Start the call
                zp.joinRoom({
                    container: containerRef.current,
                    sharedLinks: [
                        {
                            name: 'Personal link',
                            url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + sanitizedMeetingId,
                        },
                    ],
                    scenario: {
                        mode: ZegoUIKitPrebuilt.VideoConference, // Or OneONoneCall
                    },
                    showScreenSharingButton: true,
                    showPreJoinView: true,
                    onLeaveRoom: () => {
                        if (onClose) {
                            onClose();
                        } else {
                            router.back();
                        }
                    },
                });
            } catch (err) {
                console.error("Failed to initialize ZegoCloud:", err);
                setError("Failed to load video call component.");
            }
        };

        initMeeting();
    }, [meetingId, userName, userId, router, onClose]);

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 text-white">
                <div className="bg-slate-800 p-8 rounded-xl max-w-md text-center border border-red-500/50">
                    <h3 className="text-xl font-bold text-red-400 mb-4">Configuration Error</h3>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={onClose}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 bg-black"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
};

export default ZegoMeeting;
