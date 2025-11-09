import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full bg-[#1a1b1e]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation Sidebar */}
      <div className="hidden md:flex h-full w-20 z-30 flex-col fixed inset-y-0">
        <div className="h-full bg-[#1e1f22]/98 backdrop-blur-xl border-r border-white/5">
          <NavigationSidebar />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="md:pl-20 h-full relative z-10">
        {children}
      </main>
    </div>
   );
}
 
export default MainLayout;
