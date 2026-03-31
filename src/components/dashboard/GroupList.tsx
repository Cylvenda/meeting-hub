"use client";

import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";
import GroupItem from "./GroupItem";
import { Group } from "./types/dashboard";

interface GroupListProps {
  groups: Group[];
}

const GroupList: FC<GroupListProps> = ({ groups }) => {
  const [search, setSearch] = useState("");

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="h-fit w-full border-none  rounded-md flex flex-col md:flex-row justify-between">
      <div className="w-full bg-white p-3 md:p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold px-2">My Groups</h1>
          <div className="flex gap-2">
            <Button variant="link" className="flex items-center gap-2">
              <List size={18} /> View All
            </Button>
            <Button className="bg-chart-3 flex items-center gap-2">
              <Plus size={18} /> New Group
            </Button>
          </div>
        </div>

        <div className="px-2 mb-4">
          <Input
            onChange={e => setSearch(e.target.value)}
            type="text"
            placeholder="Search groups..."
            className="px-5 py-6 rounded-full"
          />
        </div>

        <div className="space-y-3 px-2">
          {(search.length > 0 ? filteredGroups : groups).map(group => (
            <GroupItem key={group.id} group={group} search={search} />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GroupList;