"use client"

import { Menu, MessageSquareTextIcon, BellRing, Settings, Moon } from 'lucide-react'

interface MenuItemsProps {
     isMobile?: boolean
}

const items = [
     { icon: Menu, label: "Menu" },
     { icon: MessageSquareTextIcon, label: "Messages" },
     { icon: BellRing, label: "Notifications" },
     { icon: Settings, label: "Settings" },
     { icon: Moon, label: "Toggle Theme" },
]

const MenuItems = ({ isMobile = false }: MenuItemsProps) => {
     return (
          <>
               {items.map((item, index) => {
                    const Element = item.icon
                    return isMobile ? (
                         <button
                              key={index}
                              className='p-2 rounded-md cursor-pointer flex items-center gap-2 hover:bg-chart-1'
                              aria-label={item.label}
                         >
                              <Element />
                              {item.label}
                         </button>
                    ) : (
                         <button
                              key={index}
                              className='bg-white p-2 rounded-md cursor-pointer hover:border-2 border-chart-3 hover:bg-chart-1'
                              aria-label={item.label}
                         >
                              <Element />
                         </button>
                    )
               })}
          </>
     )
}

export default MenuItems