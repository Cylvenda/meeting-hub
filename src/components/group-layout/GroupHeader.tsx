"use client"

import Link from 'next/link'
import { Users, Play, CalendarPlus2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useGroupStore } from '@/store/group/groupUser.store'
import { formatUTCDate } from '@/hooks/formatted-date'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useMeetingStore } from '@/store/meeting/meeting.store'

export default function GroupHeader() {
     const [isInviteOpen, setIsInviteOpen] = useState(false)
     const [isScheduleOpen, setIsScheduleOpen] = useState(false)
     const [inviteEmail, setInviteEmail] = useState("")
     const [inviteMessage, setInviteMessage] = useState("")
     const [meetingTitle, setMeetingTitle] = useState("")
     const [meetingDescription, setMeetingDescription] = useState("")
     const [meetingStart, setMeetingStart] = useState("")
     const [meetingEnd, setMeetingEnd] = useState("")

     const { selectedGroup, invitationLoading, sendGroupInvitation } = useGroupStore()
     const { meetings, createMeeting, loading } = useMeetingStore()
     const memberCount = selectedGroup?.members_count ?? 0
     const groupMeetings = meetings.filter((meeting) => meeting.group === selectedGroup?.id)
     const liveMeeting = groupMeetings.find((meeting) => meeting.status === "ongoing")
     const nextMeeting = groupMeetings.find((meeting) => meeting.status === "scheduled")

     const handleInviteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const trimmedEmail = inviteEmail.trim().toLowerCase()

          if (!selectedGroup?.id) {
               toast.error("No group selected.")
               return
          }

          if (!trimmedEmail) {
               toast.error("Email is required.")
               return
          }

          const result = await sendGroupInvitation(
               selectedGroup.id,
               trimmedEmail,
               inviteMessage.trim() || undefined
          )

          if (result.success) {
               toast.success(result.message)
               setInviteEmail("")
               setInviteMessage("")
               setIsInviteOpen(false)
               return
          }

          toast.error(result.message)
     }

     const handleScheduleMeeting = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()

          if (!selectedGroup?.id) {
               toast.error("No group selected.")
               return
          }

          const result = await createMeeting({
               title: meetingTitle.trim(),
               description: meetingDescription.trim(),
               group: selectedGroup.id,
               scheduled_start: new Date(meetingStart).toISOString(),
               scheduled_end: meetingEnd ? new Date(meetingEnd).toISOString() : undefined,
          })

          if (result.success) {
               toast.success(result.message)
               setMeetingTitle("")
               setMeetingDescription("")
               setMeetingStart("")
               setMeetingEnd("")
               setIsScheduleOpen(false)
               return
          }

          toast.error(result.message)
     }

     return (
          <>
               <div className="flex flex-col justify-between rounded-2xl bg-card p-4 shadow md:flex-row md:items-center">
                    <div>
                         <h1 className="text-2xl font-bold">{selectedGroup?.name}</h1>
                         <p className="text-sm text-muted-foreground">
                              {selectedGroup?.is_private ? "Private" : "Public"} Group • {memberCount} Members •
                              Created {formatUTCDate(selectedGroup?.created_at || "")}</p>
                    </div>
                    <div className="flex gap-3 mt-3 md:mt-0">
                              <Button
                              className="bg-chart-3"
                              onClick={() => setIsInviteOpen(true)}
                              disabled={!selectedGroup?.id}
                         >
                              <Users /> Invite New Members
                         </Button>
                         {liveMeeting || nextMeeting ? (
                              <Button asChild className="bg-chart-3">
                                   <Link href={liveMeeting ? `/meeting/${liveMeeting.id}/session` : `/meeting/${nextMeeting!.id}`}>
                                        <Play /> {liveMeeting ? "Open Live Session" : "Open Meeting Details"}
                                   </Link>
                              </Button>
                         ) : (
                              <Button className="bg-chart-3" disabled>
                                   <Play /> Open Meeting Details
                              </Button>
                         )}
                         <Button className="bg-chart-3" onClick={() => setIsScheduleOpen(true)} >
                              <CalendarPlus2 /> Create Meeting Schedule
                         </Button>
                    </div>
               </div>

               {isInviteOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                         <div className="w-full max-w-md rounded-xl bg-card p-5 shadow-xl">
                              <h2 className="text-lg font-semibold">Invite New Member</h2>
                              <p className="mt-1 text-sm text-muted-foreground">
                                   Send an invitation email to join {selectedGroup?.name}.
                              </p>

                              <form className="mt-4 space-y-3" onSubmit={handleInviteSubmit}>
                                   <div>
                                        <label htmlFor="invite-email" className="mb-1 block text-sm font-medium">Email</label>
                                        <input
                                             id="invite-email"
                                             type="email"
                                             value={inviteEmail}
                                             onChange={(event) => setInviteEmail(event.target.value)}
                                             placeholder="member@example.com"
                                             className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-chart-3"
                                             required
                                        />
                                   </div>

                                   <div>
                                        <label htmlFor="invite-message" className="mb-1 block text-sm font-medium">Message (optional)</label>
                                        <textarea
                                             id="invite-message"
                                             value={inviteMessage}
                                             onChange={(event) => setInviteMessage(event.target.value)}
                                             placeholder="Welcome to our group."
                                             className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-chart-3"
                                        />
                                   </div>

                                   <div className="flex items-center justify-end gap-2 pt-1">
                                        <Button
                                             type="button"
                                             variant="outline"
                                             onClick={() => setIsInviteOpen(false)}
                                             disabled={invitationLoading}
                                        >
                                             Cancel
                                        </Button>
                                        <Button type="submit" className="bg-chart-3" disabled={invitationLoading}>
                                             {invitationLoading ? "Sending..." : "Send Invite"}
                                        </Button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}

               {isScheduleOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                         <div className="w-full max-w-xl rounded-xl bg-card p-5 shadow-xl">
                              <h2 className="text-lg font-semibold">Schedule Meeting</h2>
                              <p className="mt-1 text-sm text-muted-foreground">
                                   Create a meeting for {selectedGroup?.name}.
                              </p>

                              <form className="mt-4 space-y-3" onSubmit={handleScheduleMeeting}>
                                   <div>
                                        <label htmlFor="meeting-title" className="mb-1 block text-sm font-medium">Title</label>
                                        <input
                                             id="meeting-title"
                                             type="text"
                                             value={meetingTitle}
                                             onChange={(event) => setMeetingTitle(event.target.value)}
                                             placeholder="Weekly planning"
                                             className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-chart-3"
                                             required
                                        />
                                   </div>

                                   <div>
                                        <label htmlFor="meeting-description" className="mb-1 block text-sm font-medium">Description</label>
                                        <textarea
                                             id="meeting-description"
                                             value={meetingDescription}
                                             onChange={(event) => setMeetingDescription(event.target.value)}
                                             className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-chart-3"
                                             placeholder="Agenda summary"
                                        />
                                   </div>

                                   <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                             <label htmlFor="meeting-start" className="mb-1 block text-sm font-medium">Start time</label>
                                             <input
                                                  id="meeting-start"
                                                  type="datetime-local"
                                                  value={meetingStart}
                                                  onChange={(event) => setMeetingStart(event.target.value)}
                                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-chart-3"
                                                  required
                                             />
                                        </div>

                                        <div>
                                             <label htmlFor="meeting-end" className="mb-1 block text-sm font-medium">End time</label>
                                             <input
                                                  id="meeting-end"
                                                  type="datetime-local"
                                                  value={meetingEnd}
                                                  onChange={(event) => setMeetingEnd(event.target.value)}
                                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-chart-3"
                                             />
                                        </div>
                                   </div>

                                   <div className="flex items-center justify-end gap-2 pt-1">
                                        <Button
                                             type="button"
                                             variant="outline"
                                             onClick={() => setIsScheduleOpen(false)}
                                             disabled={loading}
                                        >
                                             Cancel
                                        </Button>
                                        <Button type="submit" className="bg-chart-3" disabled={loading}>
                                             {loading ? "Saving..." : "Schedule Meeting"}
                                        </Button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </>
     )
}
