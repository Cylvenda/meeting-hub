"use client"

type MinutesPanelProps = {
  content?: string | null
}

export function MinutesPanel({ content }: MinutesPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          {content ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-card-foreground/90">{content}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No minutes notes have been saved for this meeting yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
