"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useMeetingStore } from "@/store/meeting/meeting.store"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { toast } from "react-toastify"

export default function MeetingPage() {
  const params = useParams<{ meetingId: string }>()
  const meetingId = Array.isArray(params?.meetingId) ? params.meetingId[0] : params?.meetingId
  const { user } = useAuthUserStore()
  const {
    selectedMeeting,
    currentMinutes,
    loading,
    fetchMeetingById,
    saveMinutes,
    addAgendaItem,
    removeAgendaItem,
  } = useMeetingStore()

  const [minutesDraft, setMinutesDraft] = useState<string | null>(null)
  const [agendaTitle, setAgendaTitle] = useState("")
  const [agendaDescription, setAgendaDescription] = useState("")
  const [agendaMinutes, setAgendaMinutes] = useState("10")

  useEffect(() => {
    if (!meetingId) return

    void fetchMeetingById(meetingId)
  }, [meetingId, fetchMeetingById])

  const isHost = user?.email === selectedMeeting?.host_email
  const minutesContent = minutesDraft ?? currentMinutes?.content ?? ""
  const sessionHref = meetingId ? `/meeting/${meetingId}/session` : "#"
  const scheduledStart = selectedMeeting?.scheduled_start
    ? new Date(selectedMeeting.scheduled_start).toLocaleString()
    : "Not scheduled"
  const scheduledEnd = selectedMeeting?.scheduled_end
    ? new Date(selectedMeeting.scheduled_end).toLocaleString()
    : "No end time"

  const handleMinutesSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!meetingId) return

    const result = await saveMinutes(meetingId, {
      content: minutesContent,
      approved: false,
    })

    if (result.success) {
      setMinutesDraft(minutesContent)
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleAgendaAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!meetingId || !selectedMeeting) return

    const result = await addAgendaItem({
      meeting: selectedMeeting.id,
      title: agendaTitle.trim(),
      description: agendaDescription.trim(),
      order: (selectedMeeting.agenda_items?.length || 0) + 1,
      allocated_minutes: Number(agendaMinutes) || 0,
    })

    if (result.success) {
      toast.success(result.message)
      setAgendaTitle("")
      setAgendaDescription("")
      setAgendaMinutes("10")
      return
    }

    toast.error(result.message)
  }

  const handleAgendaDelete = async (agendaItemId: string) => {
    const result = await removeAgendaItem(agendaItemId)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-6">
      <div className="mx-auto grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="border-none bg-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Meeting Details</p>
                <h1 className="text-3xl font-bold">{selectedMeeting?.title || "Loading meeting..."}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Host: {selectedMeeting?.host_email || "Unknown"} • Status: {selectedMeeting?.status || "loading"}
                </p>
                {selectedMeeting?.description && (
                  <p className="mt-3 text-sm text-foreground/80">{selectedMeeting.description}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {meetingId ? (
                  <Button asChild className="bg-chart-3">
                    <Link href={sessionHref}>
                      {selectedMeeting?.status === "ongoing" ? "Join Session" : "Open Session"}
                    </Link>
                  </Button>
                ) : (
                  <Button className="bg-chart-3" disabled>
                    Open Session
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-none bg-card p-5">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Agenda</h2>
                <p className="text-sm text-muted-foreground">Review and organize the topics and documents for this meeting.</p>
              </div>

              {isHost && (
                <form className="mb-5 space-y-3" onSubmit={handleAgendaAdd}>
                  <Input
                    value={agendaTitle}
                    onChange={(event) => setAgendaTitle(event.target.value)}
                    placeholder="Agenda item title"
                    required
                  />
                  <textarea
                    value={agendaDescription}
                    onChange={(event) => setAgendaDescription(event.target.value)}
                    className="min-h-24 w-full rounded-lg border border-input px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    placeholder="Agenda item description"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={agendaMinutes}
                    onChange={(event) => setAgendaMinutes(event.target.value)}
                    placeholder="Allocated minutes"
                  />
                  <Button type="submit" className="bg-chart-3" disabled={loading}>
                    Add Agenda Item
                  </Button>
                </form>
              )}

              <div className="space-y-3">
                {(selectedMeeting?.agenda_items || []).length === 0 && (
                  <p className="text-sm text-muted-foreground">No agenda items have been added yet.</p>
                )}
                {(selectedMeeting?.agenda_items || []).map((item) => (
                  <div key={item.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {item.order}. {item.title}
                        </p>
                        {item.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">{item.allocated_minutes} minutes</p>
                      </div>
                      {isHost && (
                        <Button size="sm" variant="outline" onClick={() => handleAgendaDelete(item.id)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-none bg-card p-5">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Meeting Minutes</h2>
                <p className="text-sm text-muted-foreground">Capture decisions and action items.</p>
              </div>

              {isHost ? (
                <form className="space-y-3" onSubmit={handleMinutesSave}>
                  <textarea
                    value={minutesContent}
                    onChange={(event) => setMinutesDraft(event.target.value)}
                    className="min-h-56 w-full rounded-lg border border-input px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    placeholder="Write your meeting minutes here..."
                  />
                  <Button type="submit" className="bg-chart-3" disabled={loading}>
                    Save Minutes
                  </Button>
                </form>
              ) : (
                <div className="rounded-xl border border-border p-4 text-sm text-foreground/80">
                  {currentMinutes?.content || "Minutes have not been published yet."}
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none bg-card p-5">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">Core information about this meeting before anyone joins the session.</p>

            <div className="mt-4 space-y-4 text-sm text-foreground/80">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scheduled Start</p>
                <p className="mt-2 font-medium">{scheduledStart}</p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scheduled End</p>
                <p className="mt-2 font-medium">{scheduledEnd}</p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Session Access</p>
                <p className="mt-2">
                  {selectedMeeting?.status === "ongoing"
                    ? "The live room is active. Open the session page to join the call."
                    : "Use the session page when you are ready to start or join the live meeting."}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-none bg-card p-5">
            <h2 className="text-xl font-semibold">Documents</h2>
            <p className="mt-1 text-sm text-muted-foreground">Use this page for planning materials, notes, and records of the meeting.</p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-muted p-4 text-sm text-foreground/80">
                <p className="font-medium">Agenda items</p>
                <p className="mt-1 text-muted-foreground">
                  Keep the structure of the conversation here before or after the session.
                </p>
              </div>
              <div className="rounded-xl bg-muted p-4 text-sm text-foreground/80">
                <p className="font-medium">Minutes and action items</p>
                <p className="mt-1 text-muted-foreground">
                  Capture decisions here while the session happens, then return later for review.
                </p>
              </div>
              {meetingId ? (
                <Button asChild variant="outline">
                  <Link href={sessionHref}>Go To Session Controls</Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Go To Session Controls
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
