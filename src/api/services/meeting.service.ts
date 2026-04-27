import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import type { ApiResponse } from "../types"
import type {
  AgendaItem,
  AttendanceRecord,
  Meeting,
  MeetingMinutes,
  ParticipantSession,
  RealtimeConnection,
} from "@/store/meeting/meeting.types"

export const meetingServices = {
  async getMeetings(): Promise<ApiResponse<Meeting[]>> {
    const response = await api.get<Meeting[]>(API_ENDPOINTS.USER_MEETINGS)

    return {
      status: response.status,
      data: response.data,
    }
  },

  async getMeetingById(meetingId: string): Promise<ApiResponse<Meeting>> {
    const response = await api.get<Meeting>(`${API_ENDPOINTS.USER_MEETINGS}${meetingId}/`)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async createMeeting(payload: {
    title: string
    description?: string
    group: string
    scheduled_start: string
    scheduled_end?: string
  }): Promise<ApiResponse<Meeting>> {
    const response = await api.post<Meeting>(API_ENDPOINTS.USER_MEETINGS, payload)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async startMeeting(meetingId: string) {
    const response = await api.post<{ detail: string }>(`${API_ENDPOINTS.USER_MEETINGS}${meetingId}/start/`)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async endMeeting(meetingId: string) {
    const response = await api.post<{ detail: string }>(`${API_ENDPOINTS.USER_MEETINGS}${meetingId}/end/`)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async joinMeeting(meetingId: string) {
    const response = await api.post<RealtimeConnection>(`${API_ENDPOINTS.REALTIME}meetings/${meetingId}/token/`)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async leaveMeeting(meetingId: string) {
    const response = await api.post<{ detail: string }>(`${API_ENDPOINTS.USER_MEETINGS}${meetingId}/leave/`)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async getAttendance(meetingId: string): Promise<ApiResponse<AttendanceRecord[]>> {
    const response = await api.get<AttendanceRecord[]>(`${API_ENDPOINTS.USER_MEETINGS}${meetingId}/attendance/`)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async getParticipants(meetingId: string): Promise<ApiResponse<ParticipantSession[]>> {
    const response = await api.get<ParticipantSession[]>(`${API_ENDPOINTS.USER_MEETINGS}${meetingId}/participants/`)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async getMinutes(meetingId: string): Promise<ApiResponse<MeetingMinutes>> {
    const response = await api.get<MeetingMinutes>(`${API_ENDPOINTS.USER_MEETINGS}${meetingId}/minutes/`)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async createMinutes(meetingId: string, payload: { content: string; approved?: boolean }): Promise<ApiResponse<MeetingMinutes>> {
    const response = await api.post<MeetingMinutes>(`${API_ENDPOINTS.USER_MEETINGS}${meetingId}/minutes/`, payload)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async updateMinutes(meetingId: string, payload: { content?: string; approved?: boolean }): Promise<ApiResponse<MeetingMinutes>> {
    const response = await api.patch<MeetingMinutes>(`${API_ENDPOINTS.USER_MEETINGS}${meetingId}/minutes/`, payload)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async createAgendaItem(payload: {
    meeting: string
    title: string
    description?: string
    order: number
    allocated_minutes?: number
    completed?: boolean
  }): Promise<ApiResponse<AgendaItem>> {
    const response = await api.post<AgendaItem>(API_ENDPOINTS.AGENDA_ITEMS, payload)
    return {
      status: response.status,
      data: response.data,
    }
  },

  async deleteAgendaItem(agendaItemId: string) {
    const response = await api.delete(`${API_ENDPOINTS.AGENDA_ITEMS}${agendaItemId}/`)
    return {
      status: response.status,
      data: null,
    }
  },
}
