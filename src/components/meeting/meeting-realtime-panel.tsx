"use client"

import { useState } from "react"
import {
  LiveKitRoom,
  PreJoin,
  RoomAudioRenderer,
  VideoConference,
  type LocalUserChoices,
} from "@livekit/components-react"
import type { RealtimeConnection } from "@/store/meeting/meeting.types"
import { Button } from "@/components/ui/button"

type MeetingRealtimePanelProps = {
  meetingId?: string
  meetingStatus?: string
  connection: RealtimeConnection | null
  userEmail?: string
  loading?: boolean
  onRequestToken: () => Promise<void> | void
  onDisconnected?: () => Promise<void> | void
  onConnected?: () => Promise<void> | void
  onError?: (message: string) => void
  onResetConnection?: () => void
}

export function MeetingRealtimePanel({
  meetingStatus,
  connection,
  userEmail,
  loading = false,
  onRequestToken,
  onDisconnected,
  onConnected,
  onError,
  onResetConnection,
}: MeetingRealtimePanelProps) {
  const [userChoices, setUserChoices] = useState<LocalUserChoices>({
    username: userEmail || "",
    audioEnabled: true,
    videoEnabled: true,
    audioDeviceId: "default",
    videoDeviceId: "default",
  })
  const [roomPhase, setRoomPhase] = useState<"setup" | "connecting" | "connected" | "reconnecting" | "failed">("setup")
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null)

  const liveKitUrl = connection?.url || process.env.NEXT_PUBLIC_LIVEKIT_URL
  const canConnect = Boolean(connection?.token && liveKitUrl)
  const preJoinDefaults =
    userEmail && userChoices.username !== userEmail
      ? {
          ...userChoices,
          username: userEmail,
        }
      : userChoices

  const audio =
    userChoices.audioEnabled
      ? {
          deviceId: userChoices.audioDeviceId === "default" ? undefined : userChoices.audioDeviceId,
        }
      : false

  const video =
    userChoices.videoEnabled
      ? {
          deviceId: userChoices.videoDeviceId === "default" ? undefined : userChoices.videoDeviceId,
        }
      : false

  const handleReconnect = () => {
    setConnectionMessage("Requesting a fresh token and reconnecting to the room...")
    setRoomPhase("reconnecting")
    void onRequestToken()
  }

  const handleBackToSetup = () => {
    setConnectionMessage(null)
    setRoomPhase("setup")
    onResetConnection?.()
  }

  if (meetingStatus !== "ongoing") {
    return (
      <div className="flex h-fit items-center justify-center rounded-2xl border border-dashed border-border bg-muted text-center text-sm text-muted-foreground">
        Start the meeting to open the Live room.
      </div>
    )
  }

  if (!canConnect || roomPhase === "setup") {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/40 p-1">
        <div className="rounded-md">
              <PreJoin
                key={userEmail || "meeting-prejoin"}
                className="lk-prejoin-modern rounded-md"
                defaults={preJoinDefaults}
                joinLabel={loading ? "Joining..." : "Join Live Meeting"}
                userLabel="Email"
                persistUserChoices
                onValidate={(values) => !loading && Boolean(values.username)}
                onError={(error) => {
                  setRoomPhase("setup")
                  onError?.(error.message || "Unable to access your local media devices.")
                }}
                onSubmit={(values) => {
                  setUserChoices({
                    ...values,
                    username: userEmail || values.username,
                  })
                  setConnectionMessage("Requesting a secure access token for the LiveKit room...")
                  setRoomPhase("connecting")
                  void onRequestToken()
                }}
              />
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-150 overflow-hidden rounded-2xl border border-border bg-slate-950 shadow-xl" data-lk-theme="default">
      <LiveKitRoom
        audio={audio}
        video={video}
        connect
        token={connection?.token}
        serverUrl={liveKitUrl}
        className="h-full w-full"
        onConnected={() => {
          setConnectionMessage(null)
          setRoomPhase("connected")
          void onConnected?.()
        }}
        onDisconnected={() => {
          setConnectionMessage("The room connection was interrupted.")
          setRoomPhase("failed")
          void onDisconnected?.()
        }}
        onError={(error) => {
          setConnectionMessage(error.message || "Live Room failed to connect.")
          setRoomPhase("failed")
          onError?.(error.message || "Live Room failed to connect.")
        }}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>

      {roomPhase === "connecting" || roomPhase === "reconnecting" ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/82 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 text-center text-slate-100 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">LiveKit</p>
            <h3 className="mt-3 text-2xl font-semibold">
              {roomPhase === "reconnecting" ? "Reconnecting to the meeting" : "Connecting to the meeting"}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              {connectionMessage || "Preparing your secure room connection and publishing your selected media devices."}
            </p>
          </div>
        </div>
      ) : null}

      {roomPhase === "failed" ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/82 backdrop-blur-sm">
          <div className="max-w-lg rounded-2xl border border-white/10 bg-slate-900/92 p-6 text-center text-slate-100 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Connection Issue</p>
            <h3 className="mt-3 text-2xl font-semibold">The meeting room needs to reconnect</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {connectionMessage || "The Live Room room disconnected unexpectedly."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button className="bg-chart-3 text-white" onClick={handleReconnect} disabled={loading}>
                Reconnect
              </Button>
              <Button variant="outline" onClick={handleBackToSetup}>
                Back To Device Check
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        .lk-prejoin-modern .lk-username-container input {
          display: none;
        }
      `}</style>
    </div>
  )
}
