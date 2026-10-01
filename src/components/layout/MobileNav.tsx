"use client";

import { useState } from "react";

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
  Menu,
  Moon,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/lib/actions/auth";

const mainNavItems = [
  { title: "Dashboard", href: "/tableau-de-bord", icon: LayoutDashboard },
  { title: "Factures", href: "/factures", icon: FileText },
  { title: "Clients", href: "/clients", icon: Users },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        render={<Button variant="ghost" size="icon" className="lg:hidden" />}
      >
        <Menu className="w-5 h-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 border-r-0">
        <div className="flex flex-col h-full bg-white px-4 py-6">
          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">iz</span>
            </div>
            <span className="font-bold text-xl">izifacture</span>
          </div>

          <div className="text-xs font-semibold text-slate-400 mb-4 px-2 uppercase tracking-wider">
            Menu
          </div>
          
          <nav className="flex-1 space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
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

          <div className="mt-auto space-y-1">
            <Link
              href="/aide"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-slate-400" />
              Aide & Support
            </Link>
            <Link
              href="/parametres"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-400" />
              Paramètres
            </Link>
            
            <button className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-slate-400" />
                Mode Sombre
              </div>
              <div className="w-8 h-4 bg-slate-200 rounded-full relative">
                <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
              </div>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4 px-2">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
