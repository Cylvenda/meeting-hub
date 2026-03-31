"use client"

import GroupList from '@/components/dashboard/GroupList'
import MeetingList from '@/components/dashboard/MeetingList'
import OverviewCard from '@/components/dashboard/OverviewCard'
import { Card } from '@/components/ui/card'
import { groups, meetings } from '@/lib/mock-data'
import { Calendar, PersonStanding, TvMinimalPlayIcon } from 'lucide-react'


const Page = () => {

     const overViewData = [
          {
               title: "Active Meeting",
               description: "Happening right now",
               status: "Live",
               count: 2,
               icons: <TvMinimalPlayIcon />
          },
          {
               title: "My Groups",
               description: "Active Groups",
               status: "Active",
               count: 49,
               icons: <PersonStanding />
          },
          {
               title: "Groups Invitations",
               description: "New Group Invitations",
               status: "New",
               count: 12,
               icons: <TvMinimalPlayIcon />
          },
          {
               title: "Total Meetings",
               description: "Attended Meeting",
               status: "Participations",
               count: 220,
               icons: <Calendar />
          },
     ]

     return (
          <div className='w-full' >
               <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-5 md:p-10">
                    {overViewData.map((item, i) => <OverviewCard key={i} {...item} />)}
               </div>

               <Card className='h-fit w-full py-5 px-4 md:px-10 border-none bg-muted rounded-md flex flex-col md:flex-row justify-between'>
                    <GroupList groups={groups} />
                    <MeetingList meetings={meetings} />
               </Card>
          </div>
     )
}

export default Page