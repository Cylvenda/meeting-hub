"use client"

import type { MeetingAgendaItem } from "@/components/meeting-room/types"

type AgendaPanelProps = {
  items: MeetingAgendaItem[]
  selectedItemId: string | null
  onSelectItem: (id: string) => void
}

function getStatusClass(status: MeetingAgendaItem["status"]) {
  if (status === "Done") return "bg-emerald-100 text-emerald-700"
  if (status === "Ongoing") return "bg-amber-100 text-amber-800"
  return "bg-gray-100 text-gray-600"
}

export function AgendaPanel({ items, selectedItemId, onSelectItem }: AgendaPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {items.map((item) => {
          const isActive = item.id === selectedItemId

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item.id)}
              className={[
                "block w-full rounded-3xl border p-4 text-left shadow-sm transition-colors",
                isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-muted-foreground/30",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {item.order}. {item.title}
                  </p>
                  <p
                    className={[
                      "mt-2 text-sm leading-6",
                      isActive ? "text-primary-foreground/85" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {item.description || "No description provided for this agenda item."}
                  </p>
                </div>

                <span
                  className={[
                    "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold",
                    isActive ? "bg-white/15 text-white" : getStatusClass(item.status),
                  ].join(" ")}
                >
                  {item.status}
                </span>
              </div>

              <p className={["mt-3 text-xs", isActive ? "text-primary-foreground/70" : "text-muted-foreground"].join(" ")}>
                {item.allocatedMinutes} minutes
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
