"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import {
  RoomAudioRenderer,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
} from "@livekit/components-react"
import { PanelLeftClose, PanelRightClose, X } from "lucide-react"
import type { AgendaItem, AttendanceRecord, ParticipantSession } from "@/store/meeting/meeting.types"
import { AgendaPanel } from "@/components/meeting-room/AgendaPanel"
import { AttendancePanel } from "@/components/meeting-room/AttendancePanel"
import { ChatPanel } from "@/components/meeting-room/ChatPanel"
import { ControlBar } from "@/components/meeting-room/ControlBar"
import { MinutesPanel } from "@/components/meeting-room/MinutesPanel"
import { TopBar } from "@/components/meeting-room/TopBar"
import { VideoGrid } from "@/components/meeting-room/VideoGrid"
import { Button } from "@/components/ui/button"
import type {
  MeetingAgendaItem,
  MeetingAttendanceItem,
  MeetingChatMessage,
  MeetingSidebarTab,
} from "@/components/meeting-room/types"

type MeetingRoomProps = {
  meetingTitle: string
  agendaItems: AgendaItem[]
  attendanceRecords: AttendanceRecord[]
  participantSessions: ParticipantSession[]
  hostIdentity?: string
  hostEmail?: string
  currentUserId?: string
  currentUserName?: string
  minutesContent?: string | null
  headerActions?: ReactNode
  onLeaveRequested: () => Promise<void> | void
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getAgendaStatus(index: number, total: number, selectedId: string | null, agendaId: string) {
  if (agendaId === selectedId) return "Ongoing"
  if (selectedId) return "Pending"
  if (index === 0) return "Ongoing"
  if (index === total - 1 && total > 2) return "Pending"
  return "Pending"
}

function getParticipantName(identity: string, liveName?: string, fallbackEmail?: string) {
  return liveName || fallbackEmail || identity
}

function getLatestJoinedAt(sessions: ParticipantSession[]) {
  if (sessions.length === 0) {
    return null
  }

  return [...sessions]
    .sort((left, right) => new Date(right.joined_at).getTime() - new Date(left.joined_at).getTime())[0]
    ?.joined_at ?? null
}

function PanelFrame({
  side,
  title,
  description,
  onClose,
  children,
}: {
  side: "left" | "right"
  title: string
  description: string
  onClose: () => void
  children: ReactNode
}) {
  const CloseIcon = side === "left" ? PanelLeftClose : PanelRightClose

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-sm lg:w-[22rem] xl:w-[24rem]">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-foreground">
            <CloseIcon className="size-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">{title}</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-2xl" onClick={onClose}>
          <X className="size-4" />
          <span className="sr-only">Close panel</span>
        </Button>
      </div>

      <div className="min-h-0 flex-1">{children}</div>
    </aside>
  )
}

export function MeetingRoom({
  meetingTitle,
  agendaItems,
  attendanceRecords,
  participantSessions,
  hostIdentity,
  hostEmail,
  currentUserId,
  currentUserName,
  minutesContent,
  headerActions,
  onLeaveRequested,
}: MeetingRoomProps) {
  const connectionState = useConnectionState()
  const room = useRoomContext()
  const participants = useParticipants()
  const { localParticipant } = useLocalParticipant()
  const [leftPanel, setLeftPanel] = useState<Extract<MeetingSidebarTab, "agenda" | "minutes"> | null>(null)
  const [rightPanel, setRightPanel] = useState<Extract<MeetingSidebarTab, "chat" | "attendance"> | null>(null)
  const [raisedHand, setRaisedHand] = useState(false)
  const [isRecordingUiOnly, setIsRecordingUiOnly] = useState(false)
  const [currentUtcIso, setCurrentUtcIso] = useState("")
  const [selectedAgendaItemId, setSelectedAgendaItemId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<MeetingChatMessage[]>([
    {
      id: "meeting-room-system-welcome",
      senderId: "system",
      senderName: "System",
      text: "Welcome to the meeting room. Chat is active locally and ready for realtime delivery.",
      createdAt: new Date().toISOString(),
      kind: "system",
    },
  ])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCurrentUtcIso(new Date().toISOString())
    })

    const timer = window.setInterval(() => {
      setCurrentUtcIso(new Date().toISOString())
    }, 1000 * 30)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearInterval(timer)
    }
  }, [])

  useDataChannel("chat", (message) => {
    try {
      const decoded = JSON.parse(new TextDecoder().decode(message.payload)) as {
        id?: string
        senderId?: string
        senderName?: string
        text?: string
        createdAt?: string
      }

      if (!decoded.text || !decoded.senderId) return

      setChatMessages((current) => {
        if (current.some((item) => item.id === decoded.id)) {
          return current
        }

        const senderId = decoded.senderId
        const text = decoded.text

        if (!senderId || !text) {
          return current
        }

        return [
          ...current,
          {
            id: decoded.id || createMessageId(),
            senderId,
            senderName: decoded.senderName || "Participant",
            text,
            createdAt: decoded.createdAt || new Date().toISOString(),
          },
        ]
      })
    } catch {
      return
    }
  })

  const { send } = useDataChannel("chat")
  const textEncoder = useMemo(() => new TextEncoder(), [])

  const chatSenderId = currentUserId || localParticipant.identity
  const chatSenderName =
    currentUserName ||
    localParticipant.name ||
    localParticipant.attributes?.email ||
    localParticipant.identity

  const normalizedAgendaItems = useMemo<MeetingAgendaItem[]>(
    () =>
      agendaItems.map((item, index) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        order: item.order,
        allocatedMinutes: item.allocated_minutes,
        status: getAgendaStatus(index, agendaItems.length, selectedAgendaItemId ?? agendaItems[0]?.id ?? null, item.id),
      })),
    [agendaItems, selectedAgendaItemId]
  )

  const activeAgendaItemId = selectedAgendaItemId ?? agendaItems[0]?.id ?? null

  const attendanceItems = useMemo<MeetingAttendanceItem[]>(() => {
    const liveParticipants = new Map(
      participants.map((participant) => [
        participant.identity,
        {
          name: participant.name,
          email: participant.attributes?.email,
        },
      ])
    )

    const items = new Map<string, MeetingAttendanceItem>()
    const sessionsByUser = new Map<string, ParticipantSession[]>()

    participantSessions.forEach((session) => {
      const existing = sessionsByUser.get(session.user) || []
      existing.push(session)
      sessionsByUser.set(session.user, existing)
    })

    attendanceRecords.forEach((record) => {
      const liveParticipant = liveParticipants.get(record.user)
      const email = liveParticipant?.email || record.user_email
      const userSessions = sessionsByUser.get(record.user) || []
      items.set(record.user, {
        id: record.user,
        name: getParticipantName(record.user, liveParticipant?.name, email),
        email,
        joinedAt: getLatestJoinedAt(userSessions) || record.first_joined_at,
        lastLeftAt: record.last_left_at,
        totalDurationMinutes: record.total_duration_minutes,
        joinCount: userSessions.length,
        status: liveParticipants.has(record.user) ? "online" : "offline",
        badge: record.user === hostIdentity || email === hostEmail ? "Host" : "Member",
        isCurrentUser: record.user === currentUserId,
        sessions: userSessions.map((session) => ({
          id: session.id,
          joinedAt: session.joined_at,
          leftAt: session.left_at,
        })),
      })
    })

    sessionsByUser.forEach((userSessions, userId) => {
      const firstSession = userSessions[0]
      if (!firstSession) return

      const liveParticipant = liveParticipants.get(userId)
      const existing = items.get(userId)
      const email = liveParticipant?.email || firstSession.user_email

      items.set(userId, {
        id: userId,
        name: existing?.name || getParticipantName(userId, liveParticipant?.name, email),
        email,
        joinedAt: existing?.joinedAt || getLatestJoinedAt(userSessions),
        lastLeftAt:
          existing?.lastLeftAt ||
          userSessions
            .filter((session) => session.left_at)
            .sort((left, right) => new Date(right.left_at as string).getTime() - new Date(left.left_at as string).getTime())[0]
            ?.left_at ||
          null,
        totalDurationMinutes: existing?.totalDurationMinutes || 0,
        joinCount: existing?.joinCount || userSessions.length,
        status: liveParticipants.has(userId) ? "online" : "offline",
        badge: userId === hostIdentity || email === hostEmail ? "Host" : "Member",
        isCurrentUser: userId === currentUserId,
        sessions: existing?.sessions || userSessions.map((session) => ({
          id: session.id,
          joinedAt: session.joined_at,
          leftAt: session.left_at,
        })),
      })
    })

    participants.forEach((participant) => {
      if (items.has(participant.identity)) return

      const email = participant.attributes?.email || participant.identity
      items.set(participant.identity, {
        id: participant.identity,
        name: getParticipantName(participant.identity, participant.name, email),
        email,
        joinedAt: null,
        lastLeftAt: null,
        totalDurationMinutes: 0,
        joinCount: 0,
        status: "online",
        badge: participant.identity === hostIdentity || email === hostEmail ? "Host" : "Member",
        isCurrentUser: participant.identity === currentUserId,
        sessions: [],
      })
    })

    return [...items.values()].sort((left, right) => {
      if (left.badge !== right.badge) return left.badge === "Host" ? -1 : 1
      if (left.status !== right.status) return left.status === "online" ? -1 : 1
      return left.name.localeCompare(right.name)
    })
  }, [attendanceRecords, currentUserId, hostEmail, hostIdentity, participantSessions, participants])

  const handleSendMessage = async (text: string) => {
    const nextMessage: MeetingChatMessage = {
      id: createMessageId(),
      senderId: chatSenderId,
      senderName: chatSenderName,
      text,
      createdAt: new Date().toISOString(),
    }

    setChatMessages((current) => [...current, nextMessage])

    try {
      await send(
        textEncoder.encode(
          JSON.stringify({
            id: nextMessage.id,
            senderId: nextMessage.senderId,
            senderName: nextMessage.senderName,
            text: nextMessage.text,
            createdAt: nextMessage.createdAt,
          })
        ),
        {
          topic: "chat",
          reliable: true,
        }
      )
    } catch {
      setChatMessages((current) => [
        ...current,
        {
          id: `${nextMessage.id}-failed`,
          senderId: "system",
          senderName: "System",
          text: "Your message was saved locally but could not be delivered to the room.",
          createdAt: new Date().toISOString(),
          kind: "system",
        },
      ])
      return
    }
  }

  const handleLeave = async () => {
    room.disconnect()
    await onLeaveRequested()
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <TopBar
        title={meetingTitle}
        connectionLabel={connectionState}
        currentUtcIso={currentUtcIso}
        actions={headerActions}
        onLeave={() => void handleLeave()}
      />

      <div className="flex min-h-0 flex-1 gap-4 px-4 py-5">
        {leftPanel ? (
          <PanelFrame
            side="left"
            title={leftPanel === "minutes" ? "Minutes Notes" : "Agenda"}
            description={
              leftPanel === "minutes"
                ? "Keep the official notes visible while the conversation continues."
                : "Follow the current discussion without leaving the live room."
            }
            onClose={() => setLeftPanel(null)}
          >
            {leftPanel === "agenda" ? (
              <AgendaPanel
                items={normalizedAgendaItems}
                selectedItemId={activeAgendaItemId}
                onSelectItem={setSelectedAgendaItemId}
              />
            ) : (
              <MinutesPanel content={minutesContent} />
            )}
          </PanelFrame>
        ) : null}

        <div className="min-w-0 flex-1">
          <VideoGrid hostIdentity={hostIdentity} currentUserIdentity={currentUserId || localParticipant.identity} />
        </div>

        {rightPanel ? (
          <PanelFrame
            side="right"
            title={rightPanel === "attendance" ? "Attendance" : "Meeting chat"}
            description={
              rightPanel === "attendance"
                ? "Track who is present without covering the meeting stage."
                : "Chat while everyone stays visible on screen."
            }
            onClose={() => setRightPanel(null)}
          >
            {rightPanel === "chat" ? (
              <ChatPanel
                messages={chatMessages}
                currentUserId={chatSenderId}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <AttendancePanel items={attendanceItems} />
            )}
          </PanelFrame>
        ) : null}
      </div>

      <ControlBar
        raisedHand={raisedHand}
        isRecordingUiOnly={isRecordingUiOnly}
        activeDocumentsPanel={leftPanel}
        activePeoplePanel={rightPanel}
        onToggleRaisedHand={() => setRaisedHand((current) => !current)}
        onToggleRecordingUiOnly={() => setIsRecordingUiOnly((current) => !current)}
        onLeave={() => void handleLeave()}
        onOpenDocumentsPanel={(tab) => {
          setLeftPanel((current) => (current === tab ? null : tab))
        }}
        onOpenPeoplePanel={(tab) => {
          setRightPanel((current) => (current === tab ? null : tab))
        }}
      />

      <RoomAudioRenderer />
    </div>
  )
}
