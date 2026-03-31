import { meetings } from "@/lib/mock-data";
import { Separator } from "../ui/separator";
import { getInitials } from "@/hooks/get-initials";



const MeetingsList = () => {

     return (
          <div className="bg-white p-4 rounded-2xl shadow">
               <h3 className="text-lg font-bold mb-4">Meetings</h3>
               <div className="divide-y">
                    {meetings.map((m, i) => (
                         <div key={i} className="flex items-center gap-6 py-3">

                              {/* DATE */}
                              <div className="text-center text-sm">

                              </div>



                              {/* AVATAR */}
                              <div className="w-10 h-10 bg-chart-2 text-white rounded-full flex items-center justify-center font-semibold">
                                   {getInitials(m.title)}
                              </div>

                              <Separator orientation="vertical" className="h-10" />
                              {/* CONTENT */}
                              <div className="flex justify-between items-center w-full">
                                   <div>
                                        <p className="font-medium">{m.title}</p>
                                        <p className="font-medium">
                                             {new Date(m.start_time).toLocaleDateString("en-US", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                             })}
                                        </p>

                                   </div>

                                   <div className="flex flex-row items-center justify-center gap-5">
                                        <p
                                             className={`px-2 py-1 rounded-full text-xs text-center ${m.status === "live"
                                                  ? "bg-green-100 text-green-600"
                                                  : m.status === "ended"
                                                       ? "bg-red-100 text-red-600"
                                                       : "bg-yellow-100 text-yellow-600"
                                                  }`}
                                        >
                                             {m.status}
                                        </p>

                                        <button className="px-3 py-1 bg-chart-2 text-white rounded-xl hover:bg-blue-700">
                                             Join
                                        </button>
                                   </div>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     )
}


export default MeetingsList