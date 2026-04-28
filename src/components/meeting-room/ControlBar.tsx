"use client"

import { useRef, useState } from "react"
import { useLocalParticipant } from "@livekit/components-react"
import { Disc3, FileText, Hand, MessageSquareText, Mic, MicOff, MonitorUp, PhoneOff, Users, Video, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MeetingSidebarTab } from "@/components/meeting-room/types"

type ControlBarProps = {
  raisedHand: boolean
  isRecordingUiOnly: boolean
  canAccessMinutes: boolean
  activeDocumentsPanel: Extract<MeetingSidebarTab, "agenda" | "minutes"> | null
  activePeoplePanel: Extract<MeetingSidebarTab, "chat" | "attendance"> | null
  onToggleRaisedHand: () => void
  onToggleRecordingUiOnly: () => void
  onLeave: () => void
  onOpenDocumentsPanel: (tab: Extract<MeetingSidebarTab, "agenda" | "minutes">) => void
  onOpenPeoplePanel: (tab: Extract<MeetingSidebarTab, "chat" | "attendance">) => void
}

function ControlButton({
  active,
  danger = false,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  active?: boolean
  danger?: boolean
}) {
  return (
    <Button
      variant={danger ? "destructive" : active ? "default" : "outline"}
      size="lg"
      className={[
        "rounded-2xl px-4 shadow-sm",
        !active && !danger ? "border-border bg-card text-foreground hover:bg-muted" : "",
      ].join(" ")}
      {...props}
    >
      {children}
    </Button>
  )
}

function QuickPanelButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="lg"
      onClick={onClick}
      className="rounded-2xl border-border bg-card px-4 text-foreground shadow-sm hover:bg-muted"
    >
      {icon}
      {label}
    </Button>
  )
}

export function ControlBar({
  raisedHand,
  isRecordingUiOnly,
  canAccessMinutes,
  activeDocumentsPanel,
  activePeoplePanel,
  onToggleRaisedHand,
  onToggleRecordingUiOnly,
  onLeave,
  onOpenDocumentsPanel,
  onOpenPeoplePanel,
}: ControlBarProps) {
  const { isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, localParticipant } = useLocalParticipant()
  const [mediaActionPending, setMediaActionPending] = useState<null | "microphone" | "camera" | "screen-share">(null)
  const mediaActionInFlightRef = useRef(false)

  const runMediaAction = async (
    action: "microphone" | "camera" | "screen-share",
    callback: () => Promise<void>
  ) => {
    if (mediaActionInFlightRef.current) {
      return
    }

    mediaActionInFlightRef.current = true
    setMediaActionPending(action)

    try {
      await callback()
    } finally {
      mediaActionInFlightRef.current = false
      setMediaActionPending(null)
    }
  }

  const toggleMicrophone = () => {
    void runMediaAction("microphone", async () => {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
    })
  }

  const toggleCamera = () => {
    void runMediaAction("camera", async () => {
      await localParticipant.setCameraEnabled(!isCameraEnabled)
    })
  }

  const toggleScreenShare = async () => {
    await runMediaAction("screen-share", async () => {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled)
    })
  }

  return (
    <footer className="border-t border-border bg-background px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <ControlButton
            type="button"
            active={isMicrophoneEnabled}
            onClick={toggleMicrophone}
            disabled={mediaActionPending !== null}
          >
            {isMicrophoneEnabled ? <Mic className="size-4" /> : <MicOff className="size-4" />}
            {isMicrophoneEnabled ? "Mic on" : "Mic off"}
          </ControlButton>

          <ControlButton
            type="button"
            active={isCameraEnabled}
            onClick={toggleCamera}
            disabled={mediaActionPending !== null}
          >
            {isCameraEnabled ? <Video className="size-4" /> : <VideoOff className="size-4" />}
            {isCameraEnabled ? "Camera on" : "Camera off"}
          </ControlButton>

          <ControlButton
            type="button"
            active={isScreenShareEnabled}
            onClick={toggleScreenShare}
            disabled={mediaActionPending !== null}
          >
            <MonitorUp className="size-4" />
            {isScreenShareEnabled ? "Stop share" : "Share screen"}
          </ControlButton>

          <ControlButton type="button" active={raisedHand} onClick={onToggleRaisedHand}>
            <Hand className="size-4" />
            {raisedHand ? "Hand raised" : "Raise hand"}
          </ControlButton>

          <ControlButton type="button" active={isRecordingUiOnly} onClick={onToggleRecordingUiOnly}>
            <Disc3 className="size-4" />
            {isRecordingUiOnly ? "Recording" : "Record"}
          </ControlButton>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 xl:flex">
            <QuickPanelButton
              active={activeDocumentsPanel === "agenda"}
              icon={<FileText className="size-4" />}
              label="Agenda"
              onClick={() => onOpenDocumentsPanel("agenda")}
            />
            {canAccessMinutes ? (
              <QuickPanelButton
                active={activeDocumentsPanel === "minutes"}
                icon={<FileText className="size-4" />}
                label="Minutes note"
                onClick={() => onOpenDocumentsPanel("minutes")}
              />
            ) : null}
            <QuickPanelButton
              active={activePeoplePanel === "attendance"}
              icon={<Users className="size-4" />}
              label="Attendance"
              onClick={() => onOpenPeoplePanel("attendance")}
            />
            <QuickPanelButton
              active={activePeoplePanel === "chat"}
              icon={<MessageSquareText className="size-4" />}
              label="Chats"
              onClick={() => onOpenPeoplePanel("chat")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:hidden">
            <QuickPanelButton
              active={activeDocumentsPanel === "agenda"}
              icon={<FileText className="size-4" />}
              label="Agenda"
              onClick={() => onOpenDocumentsPanel("agenda")}
            />
            {canAccessMinutes ? (
              <QuickPanelButton
                active={activeDocumentsPanel === "minutes"}
                icon={<FileText className="size-4" />}
                label="Minutes"
                onClick={() => onOpenDocumentsPanel("minutes")}
              />
            ) : null}
            <QuickPanelButton
              active={activePeoplePanel === "attendance"}
              icon={<Users className="size-4" />}
              label="Attendance"
              onClick={() => onOpenPeoplePanel("attendance")}
            />
            <QuickPanelButton
              active={activePeoplePanel === "chat"}
              icon={<MessageSquareText className="size-4" />}
              label="Chats"
              onClick={() => onOpenPeoplePanel("chat")}
            />
          </div>

          <ControlButton type="button" danger onClick={onLeave}>
            <PhoneOff className="size-4" />
            Leave
          </ControlButton>
        </div>
      </div>
    </footer>
  )
}
