"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import MeetingItem from "./MeetingItem";
import { Meeting } from "./types/dashboard";

interface MeetingListProps {
     meetings: Meeting[];
}

const MeetingList: FC<MeetingListProps> = ({ meetings }) => (
     <Card className="w-full md:w-[80%] bg-white p-3 md:p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
               <div>
                    <h1 className="text-2xl font-bold px-2">{"Today's Meetings"}</h1>
                    <p className="text-sm text-gray-500 px-2">
                         {new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
               </div>

               <Button size="lg" variant="link" className="flex items-center gap-2">
                    <List size={18} /> View All
               </Button>
          </div>

          <div className="space-y-3">
               {meetings.map(meeting => (
                    <MeetingItem key={meeting.id} meeting={meeting} />
               ))}
          </div>
     </Card>
);

export default MeetingList;