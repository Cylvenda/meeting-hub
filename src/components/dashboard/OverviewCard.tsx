"use client";

import { Button } from "@/components/ui/button";
import { FC, ReactNode } from "react";

interface OverviewCardProps {
     title: string;
     description: string;
     status: string;
     count: number;
     icons: ReactNode;
}

const OverviewCard: FC<OverviewCardProps> = ({ title, description, status, count, icons }) => {
     return (
          <div className="bg-white p-5 rounded-2xl hover:border-2 border-primary transition-all duration-100 cursor-pointer">
               <div className="flex justify-between">
                    <Button size="icon-lg" className="text-sm bg-chart-2 p-0.5 rounded-sm">{icons}</Button>
                    <Button size="lg" className="text-sm text-green-700 bg-green-200 p rounded-sm">{status}</Button>
               </div>
               <p className="text-3xl font-bold mt-1 p-1">{count}</p>
               <p className="text-2xl font-heading p-1">{title}</p>
               <p className="text-sm">{description}</p>
          </div>
     );
};

export default OverviewCard;