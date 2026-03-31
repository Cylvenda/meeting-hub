"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { JitsiMeeting, JitsiMeetingExternalAPI } from "@jitsi/react-sdk";

const displayName = "Cylvenda";

export default function MeetingPage() {
     const pathname = usePathname();
     const [roomName, setRoomName] = useState<string>("");
     const [participants, setParticipants] = useState<string[]>([]);

     useEffect(() => {
          const parts = pathname?.split("/") || [];
          setRoomName(parts[parts.length - 1] || "default-room");
     }, [pathname]);

     // Callback when Jitsi API is ready
     const handleApiReady = (api: JitsiMeetingExternalAPI) => {
          // Initial participant list
          const initialParticipants = api.getParticipantsInfo().map((p) => p.displayName);
          setParticipants(initialParticipants);

          // Listen for participants joining
          api.addListener("participantJoined", (event: any) => {
               setParticipants((prev) => [...prev, event.displayName]);
          });

          // Listen for participants leaving
          api.addListener("participantLeft", (event: any) => {
               setParticipants((prev) =>
                    prev.filter((name) => name !== event.displayName)
               );
          });
     };

     return (
          <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 p-4">
               {/* Participants Sidebar */}
               <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md mb-4 md:mb-0 md:mr-4">
                    <h2 className="text-xl font-semibold mb-2">Participants ({participants.length})</h2>
                    <ul className="space-y-1">
                         {participants.map((name, idx) => (
                              <li key={idx} className="px-2 py-1 bg-gray-50 rounded">{name}</li>
                         ))}
                    </ul>
               </div>

               {/* Jitsi Meeting */}
               <div className="w-full md:w-3/4 h-[600px] rounded-lg overflow-hidden shadow-lg">
                    {roomName && (
                         <JitsiMeeting
                              domain="meet.jit.si"
                              roomName={roomName}
                              configOverwrite={{
                                   startWithAudioMuted: true,
                                   startWithVideoMuted: false,
                                   disableModeratorIndicator: true,
                              }}
                              interfaceConfigOverwrite={{
                                   DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                              }}
                              userInfo={{ displayName }}
                              onApiReady={handleApiReady}
                              getIFrameRef={(iframeRef) => {
                                   if (iframeRef) iframeRef.style.height = "100%";
                              }}
                         />
                    )}
               </div>
          </div>
     );
}