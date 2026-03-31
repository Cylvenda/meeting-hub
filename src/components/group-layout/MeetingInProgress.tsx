import { Play } from "lucide-react";
import { Button } from "../ui/button";

export default function MeetingInProgress() {
     return (
          <div className="bg-chart-2 border border-chart-4 rounded-2xl shadow p-6 flex flex-col md:flex-row justify-between items-center text-white">
               <div>
                    <p className="font-light">Live Now</p>
                    <h2 className="text-2xl font-bold">Sprint Planning Meeting</h2>
                    <p className="font-light" >Host: Alice Johnson • 20 min elapsed</p>
               </div>
               <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Button variant={"outline"} className="text-black" > <Play /> Join Now</Button>
               </div>
          </div>
     )
}