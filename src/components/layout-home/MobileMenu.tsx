"use client";

import { X } from "lucide-react";

interface MenuItem {
     icon: React.ComponentType<{ className?: string }>;
     label: string;
}

interface MobileMenuProps {
     menuItems: MenuItem[];
     onClose: () => void;
}

export default function MobileMenu({ menuItems, onClose }: MobileMenuProps) {
     return (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
               <div className="bg-white w-64 h-full p-4">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-lg font-semibold">Menu</h2>
                         <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
                              <X />
                         </button>
                    </div>
                    <div className="space-y-2">
                         {menuItems.map((item, i) => (
                              <button
                                   key={i}
                                   className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-100"
                                   onClick={onClose}
                              >
                                   <item.icon className="w-5 h-5" />
                                   <span>{item.label}</span>
                              </button>
                         ))}
                    </div>
               </div>
          </div>
     );
}