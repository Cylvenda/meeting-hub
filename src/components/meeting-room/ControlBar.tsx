"use client"

import { useState, useTransition } from "react"
import { useLocalParticipant } from "@livekit/components-react"
import { FileText, Hand, MessageSquareText, Mic, MicOff, MonitorUp, PhoneOff, Users, Video, VideoOff, Disc3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { MeetingSidebarTab } from "@/components/meeting-room/types"

type ControlBarProps = {
  raisedHand: boolean
  isRecordingUiOnly: boolean
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
        !active && !danger ? "border-gray-200" : "",
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
      className="rounded-2xl border-gray-200 px-4 shadow-sm"
    >
      {icon}
      {label}
    </Button>
  )
}

export function ControlBar({
  raisedHand,
  isRecordingUiOnly,
  activeDocumentsPanel,
  activePeoplePanel,
  onToggleRaisedHand,
  onToggleRecordingUiOnly,
  onLeave,
  onOpenDocumentsPanel,
  onOpenPeoplePanel,
}: ControlBarProps) {
  const { isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, localParticipant } = useLocalParticipant()
  const [isPending, startTransition] = useTransition()
  const [screenSharePending, setScreenSharePending] = useState(false)

  const toggleMicrophone = () => {
    startTransition(() => {
      void localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
    })
  }

  const toggleCamera = () => {
    startTransition(() => {
      void localParticipant.setCameraEnabled(!isCameraEnabled)
    })
  }

  const toggleScreenShare = async () => {
    setScreenSharePending(true)
    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled)
    } finally {
      setScreenSharePending(false)
    }
  }

  return (
    <footer className="border-t border-gray-200 bg-white px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <ControlButton type="button" active={isMicrophoneEnabled} onClick={toggleMicrophone} disabled={isPending}>
            {isMicrophoneEnabled ? <Mic className="size-4" /> : <MicOff className="size-4" />}
            {isMicrophoneEnabled ? "Mic on" : "Mic off"}
          </ControlButton>

          <ControlButton type="button" active={isCameraEnabled} onClick={toggleCamera} disabled={isPending}>
            {isCameraEnabled ? <Video className="size-4" /> : <VideoOff className="size-4" />}
            {isCameraEnabled ? "Camera on" : "Camera off"}
          </ControlButton>

          <ControlButton
            type="button"
            active={isScreenShareEnabled}
            onClick={toggleScreenShare}
            disabled={screenSharePending}
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
            <QuickPanelButton
              active={activeDocumentsPanel === "minutes"}
              icon={<FileText className="size-4" />}
              label="Minutes note"
              onClick={() => onOpenDocumentsPanel("minutes")}
            />
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

          <div className="flex items-center gap-3 xl:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-gray-200 px-4 shadow-sm"
                >
                  <FileText className="size-4" />
                  Documents
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
                <DropdownMenuItem onClick={() => onOpenDocumentsPanel("agenda")}>Open agenda</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpenDocumentsPanel("minutes")}>Open minutes notes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-gray-200 px-4 shadow-sm"
                >
                  <Users className="size-4" />
                  Chats & attendance
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
                <DropdownMenuItem onClick={() => onOpenPeoplePanel("chat")}>
                  <MessageSquareText className="size-4" />
                  Open chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpenPeoplePanel("attendance")}>
                  <Users className="size-4" />
                  Open attendance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleRecordingUiOnly}>
                  {isRecordingUiOnly ? "Stop recording indicator" : "Show recording indicator"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void localParticipant.setMicrophoneEnabled(isMicrophoneEnabled)}>
                  Recheck microphone permission
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
