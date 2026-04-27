"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import MeetingItem from "./MeetingItem";
import type { Meeting } from "@/store/meeting/meeting.types";

interface MeetingListProps {
     meetings: Meeting[];
}

const MeetingList: FC<MeetingListProps> = ({ meetings }) => (
     <Card className="w-full rounded-2xl bg-card p-3 shadow-sm md:w-[80%] md:p-6">
          <div className="flex justify-between items-center mb-4">
               <div>
                    <h1 className="text-2xl font-bold px-2">{"Today's Meetings"}</h1>
                    <p className="px-2 text-sm text-muted-foreground">
                         {new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
               </div>

               <Button size="lg" variant="link" className="flex items-center gap-2">
                    <List size={18} /> View All
               </Button>
          </div>

          <div className="space-y-3">
               {meetings.length === 0 && (
                    <p className="px-2 py-4 text-sm text-muted-foreground">No meetings scheduled yet.</p>
               )}
               {meetings.map((meeting, i)=> (
                    <MeetingItem key={i} meeting={meeting} />
               ))}
          </div>
     </Card>
);

export default MeetingList;
