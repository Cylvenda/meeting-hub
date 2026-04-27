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
          <div className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all duration-100 hover:border-primary hover:shadow-sm">
               <div className="flex justify-between">
                    <Button size="icon-lg" className="text-sm bg-chart-2 p-0.5 rounded-sm">{icons}</Button>
                    <Button size="lg" className="rounded-sm bg-green-200 p text-sm text-green-700 dark:bg-green-500/20 dark:text-green-300">{status}</Button>
               </div>
               <p className="text-3xl font-bold mt-1 p-1">{count}</p>
               <p className="text-2xl font-heading p-1">{title}</p>
               <p className="text-sm text-muted-foreground">{description}</p>
          </div>
     );
};

export default OverviewCard;
