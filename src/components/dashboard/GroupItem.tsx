"use client";

import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Group } from "./types/dashboard";
import { highlightText } from "@/hooks/hight-text";

interface GroupItemProps {
     group: Group;
     search: string;
}

const GroupItem: FC<GroupItemProps> = ({ group, search }) => (
     <div className="w-full p-2 rounded-2xl flex justify-between items-center border border-chart-3 hover:shadow-md hover:scale-[1.01] transition cursor-pointer">
          <div className="flex items-center gap-3">
               <div className="h-10 w-10 flex items-center justify-center rounded-full bg-chart-2 text-white font-semibold">

                    {group.name
                         .split(' ')
                         .filter(Boolean)
                         .map(word => word[0])
                         .slice(0, 2)
                         .join('')
                    }
               </div>
               <div>
                    <h1 className="font-semibold text-lg">
                         {search.length > 0 ? highlightText(group.name, search) : group.name}
                    </h1>
                    <p className="text-sm text-gray-500">{group.members.length} members</p>
               </div>
          </div>
          <Button className="bg-chart-3 hover:opacity-90">
               <Link href={`/group/${group.id}`}>View</Link>
          </Button>
     </div>
);

export default GroupItem;