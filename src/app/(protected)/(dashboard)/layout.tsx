"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout-home/layout"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useGroupStore } from "@/store/group/groupUser.store"
import { useMeetingStore } from "@/store/meeting/meeting.store"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { initAuth, user } = useAuthUserStore()
  const { fetchGroups, fetchMyInvitations } = useGroupStore()
  const { fetchMeetings } = useMeetingStore()
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      if (!user) {
        const isAuthenticated = await initAuth()
        if (!isAuthenticated) {
          router.replace("/login")
          return
        }
      }

      await Promise.all([
        fetchGroups(),
        fetchMyInvitations(),
        fetchMeetings(),
      ])
    }

    void run()
  }, [user, initAuth, router, fetchGroups, fetchMyInvitations, fetchMeetings])

  return (
    <Layout>
      <div className="w-full">{children}</div>
    </Layout>
  )
}
