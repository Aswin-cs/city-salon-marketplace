import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  return <NavbarClient session={session} />;
}

export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-rose-100/40 w-full">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center w-full">
        <div className="text-3xl font-bold tracking-tight text-emerald-900">
          Marketplace<span className="text-rose-400">.</span>
        </div>
        <div className="h-8 w-48 bg-rose-100/40 animate-pulse rounded-full" />
      </div>
    </header>
  );
}
