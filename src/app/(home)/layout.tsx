import Layout from "@/components/layout-home/layout";


export default function HomeLayout({ children }: { children: React.ReactNode }) {
     return (
          <Layout>
               {/* Your dashboard content */}
               <div className="w-full">
                    {children}
               </div>
          </Layout>
     )
}