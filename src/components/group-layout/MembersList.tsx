import { users } from "@/lib/mock-data";


export default function MembersList() {
     return (
          <div className="bg-white p-4 rounded-2xl shadow h-240 overflow-y-auto sticky top-22">
               <h3 className="text-lg font-bold mb-4">Members</h3>
               <div className="divide-y">
                    {users.map(m => (
                         <div key={m.name} className="flex justify-between items-center py-2">
                              <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-chart-2 text-white rounded-full flex items-center justify-center">
                                        {m.name
                                             .split(' ')
                                             .filter(Boolean)
                                             .map(word => word[0])
                                             .slice(0, 2)
                                             .join('')
                                        }
                                   </div>
                                   <div>
                                        <p className="font-medium">{m.name}</p>
                                        <p className="text-xs font-light">{m.role}</p>
                                   </div>
                              </div>
                              <p className={`text-sm ${m.status === 'active' ? 'text-green-600' : m.status === 'inactive' ? 'text-yellow-600' : 'text-gray-400'}`}>{m.status}</p>
                         </div>
                    ))}
               </div>
          </div>
     )
}