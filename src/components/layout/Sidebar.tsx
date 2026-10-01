"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Wallet,
  Settings,
  HelpCircle,
  Moon,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/lib/actions/auth";

const mainNavItems = [
  { title: "Dashboard", href: "/tableau-de-bord", icon: LayoutDashboard },
  { title: "Factures", href: "/factures", icon: FileText },
  { title: "Clients", href: "/clients", icon: Users },
];

const bottomNavItems = [
  { title: "Aide & Support", href: "/aide", icon: HelpCircle },
  { title: "Paramètres", href: "/parametres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-100 px-4 py-6 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">iz</span>
        </div>
        <span className="font-bold text-xl">izifacture</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="text-xs font-semibold text-slate-400 mb-4 px-2 uppercase tracking-wider">
          Menu
        </div>
        
        <nav className="space-y-1 mb-8">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-slate-50 text-primary" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="text-xs font-semibold text-slate-400 mb-4 px-2 uppercase tracking-wider">
          Utilitaires
        </div>

        <nav className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-slate-50 text-primary" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-100 flex flex-col gap-4 px-2">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-slate-200">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-slate-900 truncate">Jean Dupont</span>
            <span className="text-xs text-slate-500 truncate">Admin</span>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
