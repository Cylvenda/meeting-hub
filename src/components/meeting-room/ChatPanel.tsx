"use client"

import { useMemo, useState, type FormEvent } from "react"
import { SendHorizonal } from "lucide-react"
import type { MeetingChatMessage } from "@/components/meeting-room/types"
import { Button } from "@/components/ui/button"

type ChatPanelProps = {
  messages: MeetingChatMessage[]
  currentUserId: string
  onSendMessage: (message: string) => Promise<void> | void
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

export function ChatPanel({ messages, currentUserId, onSendMessage }: ChatPanelProps) {
  const [draft, setDraft] = useState("")

  const orderedMessages = useMemo(() => messages, [messages])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = draft.trim()
    if (!trimmed) return

    await onSendMessage(trimmed)
    setDraft("")
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {orderedMessages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId
          const isSystem = message.kind === "system"

          if (isSystem) {
            return (
              <div key={message.id} className="rounded-2xl border border-dashed border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                {message.text}
              </div>
            )
          }

          return (
            <div key={message.id} className={isCurrentUser ? "flex justify-end" : "flex justify-start"}>
              <div
                className={[
                  "max-w-[85%] rounded-3xl px-4 py-3 shadow-sm",
                  isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-card-foreground",
                ].join(" ")}
              >
                <div className="mb-1 flex items-center gap-2 text-xs">
                  <span className={isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    {message.senderName}
                  </span>
                  <span className={isCurrentUser ? "text-primary-foreground/65" : "text-muted-foreground/80"}>
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-6">{message.text}</p>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border p-4">
        <div className="flex items-end gap-3 rounded-[28px] border border-border bg-background p-2 shadow-sm">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message..."
            className="min-h-12 flex-1 resize-none rounded-2xl border-0 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            className="h-11 rounded-2xl px-4"
            disabled={!draft.trim()}
          >
            <SendHorizonal className="size-4" />
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
