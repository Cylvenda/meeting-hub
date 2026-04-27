export type MeetingStatus = "scheduled" | "ongoing" | "ended" | "cancelled"

export type AgendaItem = {
  id: string
  meeting: string
  title: string
  description: string | null
  order: number
  allocated_minutes: number
  completed: boolean
}

export type AttendanceRecord = {
  id: string
  meeting: string
  user: string
  user_email: string
  first_joined_at: string | null
  last_left_at: string | null
  total_duration_minutes: number
  status: string
  is_verified_member: boolean
}

export type ParticipantSession = {
  id: string
  user: string
  user_email: string
  joined_at: string
  left_at: string | null
}

export type RealtimeConnection = {
  token: string
  room: string
  url?: string
}

export type MeetingMinutes = {
  id: string
  meeting: string
  content: string
  prepared_by: string | null
  prepared_by_email: string | null
  approved: boolean
  created_at: string
  updated_at: string
}

export type Meeting = {
  id: string
  title: string
  description: string | null
  group: string
  host: string
  host_email: string
  scheduled_start: string
  scheduled_end: string | null
  actual_start: string | null
  actual_end: string | null
  status: MeetingStatus
  is_locked: boolean
  agenda_items?: AgendaItem[]
  minutes?: MeetingMinutes | null
  created_at: string
  updated_at: string
}
