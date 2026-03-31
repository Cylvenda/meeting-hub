"use client"

import GroupHeader from "@/components/group-layout/GroupHeader"
import MeetingInProgress from "@/components/group-layout/MeetingInProgress"
import MeetingsList from "@/components/group-layout/MeetinsList"
import MembersList from "@/components/group-layout/MembersList"
import OverviewCards from "@/components/group-layout/OverviewCards"
// import SharedFiles from "@/components/group-layout/SharedFiles"



export default function GroupPage() {
  return (

    <div className="px-4 md:px-20 py-6 flex flex-row justify-between gap-6">

      {/* LEFT */}
      <div className="flex-1 space-y-6 w-full">
        <GroupHeader />
        <OverviewCards />
        <MeetingInProgress />

        <div className="space-y-3">
          <MeetingsList />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-[30%]">
        <MembersList />
      </div>

    </div>
  )
}