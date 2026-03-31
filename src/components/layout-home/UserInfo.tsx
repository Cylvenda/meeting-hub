"use client"

import Image from 'next/image'

const UserInfo = () => {
     return (
          <div className='flex gap-2 items-center'>
               <Image
                    src="/meet.png"
                    alt='User avatar'
                    height={50}
                    width={45}
                    className='h-fit w-fit rounded-full shadow-2xl'
               />
               <span>brayanmlawa0917@gmail.com</span>
          </div>
     )
}

export default UserInfo