import { meetings, users } from '@/lib/mock-data'
import { CalendarCheck, Users, Clock } from 'lucide-react'

const cards = [
     { title: 'Total Meetings', value: meetings.length , icon: <CalendarCheck size={20} /> },
     { title: 'Members', value: users.length, icon: <Users size={20} /> },
     { title: 'This Month', value: 5, icon: <Clock size={20} /> },
]

export default function OverviewCards() {
     return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {cards.map((card) => (
                    <div key={card.title} className="flex items-center p-4 bg-white rounded-2xl shadow">
                         <div className="p-3 bg-blue-100 rounded-full">{card.icon}</div>
                         <div className="ml-4">
                              <p className="text-gray-500">{card.title}</p>
                              <p className="text-xl font-bold">{card.value}</p>
                         </div>
                    </div>
               ))}
          </div>
     )
}