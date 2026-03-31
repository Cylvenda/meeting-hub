"use client"

import { LayoutDashboard, Menu, X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import UserInfo from './UserInfo'
import MenuItems from './MenuItems'

interface HeaderProps {
     showMenu: boolean
     setShowMenu: Dispatch<SetStateAction<boolean>>
}

const Header = ({ showMenu, setShowMenu }: HeaderProps) => {
     return (
          <header className='p-5 w-full border-b-2 border-primary sticky top-0 bg-white z-50'>
               <div className='flex flex-row justify-between md:justify-evenly items-center'>

                    {/* Branding */}
                    <div>
                         <h1 className='font-bold text-2xl flex gap-3 items-center'>
                              <LayoutDashboard />
                              <Link href="/home">Meeting Hub</Link>
                         </h1>
                         <h2 className='text-sm'>
                              Saturday, March 28, 2026 · 3 meetings today
                         </h2>
                    </div>

                    {/* Mobile menu toggle */}
                    <div className='block md:hidden'>
                         <Button onClick={() => setShowMenu(!showMenu)} size='icon-lg'>
                              {showMenu ? <X /> : <Menu />}
                         </Button>
                    </div>

                    {/* Desktop menu icons */}
                    <div className='hidden md:flex flex-row items-center gap-7'>
                         <MenuItems />
                    </div>

                    {/* User info */}
                    <div className='hidden md:flex'>
                         <UserInfo />
                    </div>
               </div>

               {/* Mobile dropdown */}
               {showMenu && (
                    <div className='w-full bg-white p-2 transition duration-300 ease-in-out flex flex-col'>
                         <MenuItems isMobile />
                    </div>
               )}
          </header>
     )
}

export default Header