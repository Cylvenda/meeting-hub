"use client"

import { JitsiMeeting } from "@jitsi/react-sdk"
import { useState } from "react"

interface Props {
     roomName: string
     displayName: string
     email?: string
}

export default function JitsiMeetingWrapper({ roomName, displayName, email }: Props) {
     const [iframeHeight, setIframeHeight] = useState("600px")

     return (
          <div className="w-full h-full">
               <JitsiMeeting
                    domain="https://localhost:8443" // or your AWS domain later
                    roomName={roomName}
                    userInfo={{
                         displayName,
                         email,
                    }}
                    
                    configOverwrite={{
                         startWithAudioMuted: true,
                         startWithVideoMuted: false,
                         enableWelcomePage: false,
                    }}
                    interfaceConfigOverwrite={{
                         SHOW_JITSI_WATERMARK: false,
                         SHOW_BRAND_WATERMARK: false,
                         HIDE_DEEP_LINKING_LOGO: true,
                         SHOW_POWERED_BY: false,
                         DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                         
                    }}
                    getIFrameRef={(iframeRef) => {
                         iframeRef.style.height = iframeHeight
                    }}
                    onApiReady={(api) => {
                         console.log("Jitsi API ready", api)

                         // Example: Listen for participants joining
                         api.addListener("participantJoined", (event: unknown) => {
                              console.log("Participant joined:", event)
                         })

                         // Example: Listen for participant leaving
                         api.addListener("participantLeft", (event: unknown) => {
                              console.log("Participant left:", event)
                         })
                    }}
               />
          </div>
     )
}