"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BoxSelect, LayoutDashboard, Menu, MessageSquareTextIcon, Plus } from 'lucide-react'
import Image from 'next/image'

const page = () => {

     const groupData = [
          {
               groupName: "Fammily one",
               lastMeeting: "20/2/2303"
          },
          {
               groupName: "Final Decision",
               lastMeeting: "22/3/2303"
          },
          {
               groupName: "Zima motto Group",
               lastMeeting: "20/2/2303"
          },
          {
               groupName: "Kueshimiana group",
               lastMeeting: "20/2/2303"
          },
          {
               groupName: "Kutafutana Pamoja",
               lastMeeting: "20/2/2303"
          },
          {
               groupName: "Kiole group",
               lastMeeting: "20/2/2303"
          },
          {
               groupName: "Mpentanoni Pamoja",
               lastMeeting: "20/2/2303"
          },
     ]


     return (
          <div className='flex flex-row justify-between p-10' >
               <header className='p-7 w-full'>
                    <div className='flex flex-row justify-between gap-5 '>
                         {/* heading  */}
                         <span className='text-bold text-2xl flex gap-3 items-center' ><LayoutDashboard /> Meeting Hub</span>
                         {/* menu list */}
                         <div className='flex flex-row items-center gap-7 justify-between'>
                              <span><Menu />  </span>
                              <span><MessageSquareTextIcon /></span>
                              <span><BoxSelect />  </span>
                         </div>
                         {/* current user */}
                         <div className='flex gap-2 items-center justify-center bg'>
                              <Image src="/meet.png" alt='user' height={50} width={45} className='h-fit w-fit rounded-full shadow-2xl' />
                              <span>brayanmlawa0917@gmail.com</span>
                         </div>
                    </div>
               </header>

               <Card className='h-full w-[70%] bg-muted min-h-255 rounded-4xl p-10'>
                    <div>
                         {/* Search input */}
                         <Input
                              type='text'
                              placeholder="Search"
                              className=' py-6 rounded-full'
                         />
                    </div>

                    {/* list groups */}
                    <div className='p-5 px-6'>

                         <div className='flex justify-between items-center'>
                              <h1 className='text-2xl font-bold p-2 '>My Groups List</h1>
                              <Button size='icon-lg'><Plus /></Button>
                         </div>

                         {
                              groupData.map((item, index) => (
                                   <div key={index} className='w-full bg-white p-4 mt-3 rounded-2xl flex justify-between items-center'>
                                        <div className='flex items-center gap-2.5'>

                                             <span className='h-fit w-fit rounded-full bg-chart-2 p-3 text-2xl'>FG</span>
                                             <div>
                                                  <h1 className='font-semibold text-lg'>{item.groupName}</h1>
                                                  <p className='ml-1 text-gray-500'>last meeting {item.lastMeeting}</p>
                                             </div>
                                        </div>
                                        <Button className='bg-chart-3'>View</Button>
                                   </div>
                              ))
                         }


                    </div>
               </Card>
          </div>
     )
}

export default page