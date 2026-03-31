"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Meeting } from "./types/dashboard";


interface MeetingItemProps {
     meeting: Meeting;
}

const MeetingItem: FC<MeetingItemProps> = ({ meeting }) => {
     const statusClasses =
          meeting.status === "live"
               ? "bg-green-100 text-green-600"
               : meeting.status === "ended"
                    ? "bg-red-500 text-red-900"
                    : "bg-yellow-100 text-yellow-900";

     return (
          <div className="w-full p-2 rounded-2xl flex justify-between items-center border border-chart-3 hover:shadow-md hover:scale-[1.01] transition cursor-pointer">
               <div className="flex items-center gap-4">
                    <div className="text-center">
                         <p className="text-sm font-medium">{new Date(meeting.start_time).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                         <p className="text-xs text-gray-400">Today</p>
                    </div>

                    <Separator orientation="vertical" className="h-10" />

                    <div>
                         <h1 className="font-semibold text-lg">{meeting.title}</h1>
                         <p className="text-sm text-gray-500">{meeting.participants?.length} members joined</p>
                    </div>
               </div>

               <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusClasses}`}>{meeting.status}</span>
                    <Button className="bg-chart-3 hover:opacity-90">View</Button>
               </div>
          </div>
     );
};

export default MeetingItem;