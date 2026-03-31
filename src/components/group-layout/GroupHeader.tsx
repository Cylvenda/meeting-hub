import { Users, Play, CalendarPlus2 } from 'lucide-react'
import { Button } from '../ui/button'

export default function GroupHeader() {
     return (
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-2xl shadow">
               <div>
                    <h1 className="text-2xl font-bold">Team Alpha</h1>
                    <p className="text-sm text-gray-500">Private Group • 12 Members • Created Mar 2026</p>
               </div>
               <div className="flex gap-3 mt-3 md:mt-0">
                    <Button className="bg-chart-3">
                         <Users /> Invite New Members
                    </Button>
                    <Button className="bg-chart-3">
                         <Play  /> Start Meeting
                    </Button>
                    <Button className="bg-chart-3" >
                         <CalendarPlus2 /> Create Meeting Schedule
                    </Button>
               </div>

          </div>
     )
}