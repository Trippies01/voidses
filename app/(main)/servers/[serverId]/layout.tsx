import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { ServerMemberSidebar } from "@/components/server/server-member-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) => {
  const { serverId } = await params;
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  return ( 
    <div className="h-full bg-[#1a1b1e]">
      {/* Modern Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 pointer-events-none" />
      
      {/* Left Sidebar - Server Channels */}
      <div className="hidden md:flex h-full w-72 z-20 flex-col fixed inset-y-0">
        <div className="h-full bg-[#1e1f22]/95 backdrop-blur-xl border-r border-white/5">
          <ServerSidebar serverId={serverId} />
        </div>
      </div>
      
      {/* Right Sidebar - Members */}
      <div className="hidden md:flex h-full w-64 z-20 flex-col fixed right-0 inset-y-0">
        <div className="h-full bg-[#1e1f22]/95 backdrop-blur-xl border-l border-white/5">
          <ServerMemberSidebar serverId={serverId} />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="h-full md:pl-72 md:pr-64">
        {children}
      </main>
    </div>
   );
}
 
export default ServerIdLayout;
