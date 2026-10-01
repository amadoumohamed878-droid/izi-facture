"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMoney, formatDate } from "@/lib/format";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle, Search, MoreHorizontal, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_STATS = [
  {
    title: "Revenus (Ce mois)",
    amount: 1250000,
    trend: "+12.5%",
    isPositive: true,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "En attente",
    amount: 450000,
    trend: "-2.4%",
    isPositive: false,
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "En retard",
    amount: 150000,
    trend: "+4.1%",
    isPositive: false,
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    title: "Factures émises",
    amount: 24,
    trend: "+3",
    isPositive: true,
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
];

import {} from "@/lib/data/types";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Payée</Badge>;
    case "sent":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Envoyée</Badge>;
    case "overdue":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">En retard</Badge>;
    case "draft":
    default:
      return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200">Brouillon</Badge>;
  }
};
import { InvoiceData, ClientData } from "@/lib/data/types";
import { InvoiceStatus } from "@/lib/data/types";
import { deleteInvoice, updateInvoiceStatus } from "@/lib/actions/invoices";

export default function DashboardClient({ initialInvoices, initialClients }: { initialInvoices: InvoiceData[], initialClients: ClientData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (id?: string, status?: InvoiceStatus) => {
    if (!id || !status) return;
    startTransition(async () => {
      await updateInvoiceStatus(id, status);
    });
  };

  const handleDeleteInvoice = (id?: string) => {
    if (!id) return;
    if (window.confirm("Voulez-vous vraiment supprimer cette facture ?")) {
      startTransition(async () => {
        await deleteInvoice(id);
      });
    }
  };
  
  const invoices = initialInvoices;
  const clients = initialClients;
  
  const recentInvoices = [...invoices]
    .sort((a, b) => {
      const timeA = a.createdAt ?? new Date(a.issueDate).getTime();
      const timeB = b.createdAt ?? new Date(b.issueDate).getTime();
      return timeB - timeA;
    })
    .map(inv => ({
      ...inv,
      clientName: clients.find(c => c.id === inv.clientId)?.name || "Client inconnu"
    }));

  const filteredInvoices = recentInvoices.filter(inv => 
    inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (inv.number && inv.number.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5); // Only show top 5

  // Calculate dynamic stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthInvoices = invoices.filter(inv => {
    const d = new Date(inv.issueDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const revenueThisMonth = thisMonthInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
    
  const pendingAmount = invoices
    .filter(i => i.status === 'sent')
    .reduce((sum, inv) => sum + inv.total, 0);
    
  const overdueAmount = invoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  const dynamicStats = [
    {
      title: "Revenus (Ce mois)",
      amount: revenueThisMonth,
      trend: "+12.5%", // Mock trend
      isPositive: true,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "En attente",
      amount: pendingAmount,
      trend: "-2.4%",
      isPositive: false,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "En retard",
      amount: overdueAmount,
      trend: "+4.1%",
      isPositive: false,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Factures émises",
      amount: invoices.length,
      trend: `+${thisMonthInvoices.length}`,
      isPositive: true,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-sm text-slate-500">Bienvenue, voici un résumé de votre activité.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Rechercher..." 
              className="w-64 bg-white border-slate-200 pl-9 rounded-xl shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/factures/nouvelle" className={buttonVariants({ className: "rounded-xl shadow-sm" })}>
            Créer une facture
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStats.map((stat, i) => (
          <Card key={i} className="border-slate-100 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stat.title === "Factures émises" ? stat.amount : formatMoney(stat.amount)}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm">
                {stat.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-orange-500" />
                )}
                <span className={stat.isPositive ? "text-emerald-600 font-medium" : "text-orange-600 font-medium"}>
                  {stat.trend}
                </span>
                <span className="text-slate-400">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Invoices */}
      <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Dernières factures</CardTitle>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/90 text-sm font-medium"
              onClick={() => router.push('/factures')}
            >
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-semibold text-slate-500 h-11 hidden sm:table-cell">N° Facture</TableHead>
                <TableHead className="font-semibold text-slate-500 h-11">Client</TableHead>
                <TableHead className="font-semibold text-slate-500 h-11 hidden sm:table-cell">Date</TableHead>
                <TableHead className="font-semibold text-slate-500 h-11">Statut</TableHead>
                <TableHead className="font-semibold text-slate-500 h-11 text-right">Montant</TableHead>
                <TableHead className="w-12 h-11 hidden sm:table-cell"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? filteredInvoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  className="hover:bg-slate-50/50 cursor-pointer"
                  onClick={() => router.push(`/factures/${invoice.id}`)}
                >
                  <TableCell className="font-medium text-slate-900 hidden sm:table-cell">{invoice.number || "Brouillon"}</TableCell>
                  <TableCell className="text-slate-600">{invoice.clientName}</TableCell>
                  <TableCell className="text-slate-500 hidden sm:table-cell">{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    {formatMoney(invoice.total)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-slate-400 hover:text-slate-900" })}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl shadow-sm border-slate-100 min-w-44">
                        <DropdownMenuItem onSelect={() => router.push(`/factures/${invoice.id}`)}>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push(`/factures/${invoice.id}/modifier`)}>Modifier</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleStatusChange(invoice.id, 'paid')} className="text-emerald-600 font-medium cursor-pointer">
                          🟢 Marquer Payée
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange(invoice.id, 'sent')} className="text-orange-600 font-medium cursor-pointer">
                          🟧 Marquer Envoyée
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange(invoice.id, 'overdue')} className="text-red-600 font-medium cursor-pointer">
                          🟥 Marquer En retard
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange(invoice.id, 'draft')} className="cursor-pointer">
                          ⚪ Marquer Brouillon
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange(invoice.id, 'cancelled')} className="cursor-pointer">
                          ⬛ Marquer Annulée
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 cursor-pointer" onSelect={() => handleDeleteInvoice(invoice.id)}>
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    Aucune facture trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
