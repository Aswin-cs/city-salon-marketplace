'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LayoutDashboard, LogOut, LogIn } from "lucide-react";

interface NavbarClientProps {
  session: any;
}

export function NavbarClient({ session }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isBrowseActive = pathname === "/" || pathname.startsWith("/salons");
  const isProfileActive = pathname === "/profile";
  const isDashboardActive = pathname === "/dashboard";

  const linkClass = (isActive: boolean) =>
    `relative text-sm font-medium tracking-wide transition-colors py-2 px-1 text-emerald-900 hover:text-rose-600 ${
      isActive ? "text-emerald-950 font-semibold" : "text-emerald-900/80"
    }`;

  const underlineClass = (isActive: boolean) =>
    `absolute bottom-0 left-0 w-full h-[2px] bg-rose-400 transition-transform duration-300 ${
      isActive ? "scale-x-100" : "scale-x-0 origin-right hover:origin-left group-hover:scale-x-100"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF9F6]/85 backdrop-blur-md border-b border-rose-100/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center w-full">
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-1.5 focus:outline-none">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-900 transition-transform duration-300 group-hover:scale-[1.02]">
            Marketplace<span className="text-rose-400 transition-all duration-300 group-hover:text-rose-500">.</span>
          </h1>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/" className={`${linkClass(isBrowseActive)} group`}>
            Browse
            <span className={underlineClass(isBrowseActive)} />
          </Link>

          {session ? (
            <>
              <Link href="/profile" className={`${linkClass(isProfileActive)} group`}>
                Profile
                <span className={underlineClass(isProfileActive)} />
              </Link>
              {session.user?.role === "admin" && (
                <Link href="/dashboard" className={`${linkClass(isDashboardActive)} group`}>
                  Dashboard
                  <span className={underlineClass(isDashboardActive)} />
                </Link>
              )}
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Link>
            </>
          ) : (
            <div className="flex gap-4 items-center">
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-emerald-900 hover:text-emerald-950 bg-rose-100/40 hover:bg-rose-100/80 rounded-full transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-full transition-all duration-300 shadow-sm shadow-emerald-900/10 hover:shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden items-center justify-center p-2 rounded-full text-emerald-900 hover:bg-rose-100/50 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden border-t border-rose-100/30 bg-[#FAF9F6] shadow-xl absolute top-full left-0 w-full animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-6 py-6 space-y-4 flex flex-col">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors ${
                isBrowseActive ? "bg-rose-100/50 text-emerald-950 font-semibold" : "hover:bg-rose-50/50 text-emerald-900/80"
              }`}
            >
              Browse
            </Link>

            {session ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors ${
                    isProfileActive ? "bg-rose-100/50 text-emerald-950 font-semibold" : "hover:bg-rose-50/50 text-emerald-900/80"
                  }`}
                >
                  <User className="w-4 h-4 text-rose-400" />
                  Profile
                </Link>
                {session.user?.role === "admin" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors ${
                      isDashboardActive ? "bg-rose-100/50 text-emerald-950 font-semibold" : "hover:bg-rose-50/50 text-emerald-900/80"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-rose-400" />
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/api/auth/signout"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-3 px-3 rounded-xl text-rose-600 hover:bg-rose-50/80 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Link>
              </>
            ) : (
              <div className="pt-2 border-t border-rose-100/40 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-100/30 hover:bg-rose-100/60 text-emerald-900 font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-medium transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
