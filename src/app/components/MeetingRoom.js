"use client";

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

const MeetingRoom = ({ meetingId, onClose, displayName = "You" }) => {
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [status, setStatus] = useState("Connecting…");

  const cleanup = () => {
    pcRef.current?.getSenders?.().forEach((s) => s.track?.stop?.());
    pcRef.current?.close?.();
    pcRef.current = null;
    localStreamRef.current?.getTracks?.().forEach((t) => t.stop());
    if (socketRef.current) {
      socketRef.current.emit("leave-room", { meetingId });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  useEffect(() => {
    if (!meetingId) return;

    const connect = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        setStatus("Microphone/Camera blocked");
        console.error(err);
        return;
      }

      const socket = io("/", {
        path: "/api/socket",
        transports: ["websocket"],
      });
      socketRef.current = socket;

      const createPeer = () => {
        const pc = new RTCPeerConnection({ iceServers });
        pc.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit("ice-candidate", { meetingId, candidate: e.candidate });
          }
        };
        pc.ontrack = (e) => {
          if (remoteVideoRef.current && e.streams[0]) {
            remoteStreamRef.current = e.streams[0];
            remoteVideoRef.current.srcObject = e.streams[0];
          }
        };
        pc.onconnectionstatechange = () => {
          setStatus(pc.connectionState);
        };
        localStreamRef.current?.getTracks()?.forEach((t) =>
          pc.addTrack(t, localStreamRef.current)
        );
        pcRef.current = pc;
        return pc;
      };

      socket.on("connect", () => {
        setStatus("Waiting for peer…");
        socket.emit("join-room", { meetingId });
      });

      socket.on("ready", async ({ initiator }) => {
        const pc = pcRef.current || createPeer();
        if (initiator) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { meetingId, description: pc.localDescription });
        }
      });

      socket.on("offer", async ({ description }) => {
        const pc = pcRef.current || createPeer();
        await pc.setRemoteDescription(description);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { meetingId, description: pc.localDescription });
      });

      socket.on("answer", async ({ description }) => {
        if (!pcRef.current) return;
        await pcRef.current.setRemoteDescription(description);
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        if (pcRef.current && candidate) {
          try {
            await pcRef.current.addIceCandidate(candidate);
          } catch (err) {
            console.error("Error adding ICE", err);
          }
        }
      });

      socket.on("peer-left", () => {
        setStatus("Peer left");
        remoteVideoRef.current && (remoteVideoRef.current.srcObject = null);
      });

      socket.on("disconnect", () => {
        setStatus("Disconnected");
      });
    };

    connect();

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Meeting Room</h3>
          <div className="text-xs text-slate-300">Status: {status}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative bg-slate-800 rounded-xl overflow-hidden h-64 md:h-80">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {displayName} (You)
            </div>
          </div>
          <div className="relative bg-slate-800 rounded-xl overflow-hidden h-64 md:h-80">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
              Peer
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => {
              cleanup();
              onClose?.();
            }}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
