import { MobileNav } from "./MobileNav";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 lg:hidden">
      <div className="flex items-center gap-4 px-4 h-16">
        <MobileNav />
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Rechercher..." 
            className="w-full bg-white border-slate-200 pl-9 rounded-xl shadow-sm"
          />
        </div>
      </div>
    </header>
  );
}
