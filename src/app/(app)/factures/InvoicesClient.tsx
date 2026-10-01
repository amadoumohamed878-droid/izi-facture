"use client";

import { useState, useEffect, useTransition } from "react";
import {} from "@/lib/data/types";
import { deleteInvoice, updateInvoiceStatus } from "@/lib/actions/invoices";
import { formatMoney, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Search, Plus, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Payée</Badge>;
    case "sent":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Envoyée</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Annulée</Badge>;
    case "overdue":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">En retard</Badge>;
    case "draft":
    default:
      return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200">Brouillon</Badge>;
  }
};

import { InvoiceData, ClientData } from "@/lib/data/types";
import { InvoiceStatus } from "@/lib/data/types";

export default function InvoicesClient({ initialInvoices, initialClients }: { initialInvoices: InvoiceData[], initialClients: ClientData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  const handleStatusChange = (id?: string, status?: InvoiceStatus) => {
    if (!id || !status) return;
    startTransition(async () => {
      await updateInvoiceStatus(id, status);
    });
  };
  const ITEMS_PER_PAGE = 8;

  const [invoices, setInvoices] = useState(initialInvoices);
  const clients = initialClients;
  
  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const invoicesWithClients = [...invoices]
    .sort((a, b) => {
      const timeA = a.createdAt ?? new Date(a.issueDate).getTime();
      const timeB = b.createdAt ?? new Date(b.issueDate).getTime();
      return timeB - timeA;
    })
    .map(inv => ({
      ...inv,
      clientName: clients.find(c => c.id === inv.clientId)?.name || "Client inconnu"
    }));

  const filteredInvoices = invoicesWithClients.filter(inv => {
    const matchesSearch = inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (inv.number && inv.number.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && inv.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE) || 1;
  const currentInvoices = filteredInvoices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleDelete = async () => {
    if (invoiceToDelete) {
      await deleteInvoice(invoiceToDelete);
      setInvoices(invoices.filter(inv => inv.id !== invoiceToDelete));
      setIsDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Factures</h1>
          <p className="text-sm text-slate-500">Gérez vos factures et suivez les paiements.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/factures/nouvelle" className={buttonVariants({ className: "rounded-xl shadow-sm" })}>
            <Plus className="w-4 h-4 mr-2" />
            Créer une facture
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Rechercher par nom de client..." 
            className="w-full bg-white border-slate-200 pl-9 rounded-xl shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-[180px] bg-white border-slate-200 rounded-xl">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="truncate">
                  {statusFilter === "all" ? "Tous les statuts" :
                   statusFilter === "draft" ? "Brouillon" :
                   statusFilter === "sent" ? "Envoyée" :
                   statusFilter === "paid" ? "Payée" :
                   statusFilter === "overdue" ? "En retard" : "Filtrer par statut"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="sent">Envoyée</SelectItem>
              <SelectItem value="paid">Payée</SelectItem>
              <SelectItem value="overdue">En retard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-semibold text-slate-500 h-11">N° Facture</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11">Client</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11">Date d'émission</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11">Échéance</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11">Statut</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11 text-right">Montant TTC</TableHead>
              <TableHead className="w-12 h-11"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentInvoices.length > 0 ? (
              currentInvoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  className="hover:bg-slate-50/50 cursor-pointer"
                  onClick={() => router.push(`/factures/${invoice.id}`)}
                >
                  <TableCell className="font-medium text-slate-900">
                    {invoice.number || "Brouillon"}
                  </TableCell>
                  <TableCell className="text-slate-600">{invoice.clientName}</TableCell>
                  <TableCell className="text-slate-500">{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell className="text-slate-500">{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    {formatMoney(invoice.total)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-slate-400 hover:text-slate-900" })}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl shadow-sm border-slate-100 min-w-44">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/factures/${invoice.id}`); }}>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/factures/${invoice.id}/modifier`); }}>Modifier</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(invoice.id, 'paid'); }} className="text-emerald-600 font-medium cursor-pointer">
                          🟢 Marquer Payée
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(invoice.id, 'sent'); }} className="text-orange-600 font-medium cursor-pointer">
                          🟧 Marquer Envoyée
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(invoice.id, 'overdue'); }} className="text-red-600 font-medium cursor-pointer">
                          🟥 Marquer En retard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(invoice.id, 'draft'); }} className="cursor-pointer">
                          ⚪ Marquer Brouillon
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(invoice.id, 'cancelled'); }} className="cursor-pointer">
                          ⬛ Marquer Annulée
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInvoiceToDelete(invoice.id || null);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                  Aucune facture trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Affichage de <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> à <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredInvoices.length)}</span> sur <span className="font-medium">{filteredInvoices.length}</span> résultats
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-l-md rounded-r-none px-2 py-2"
                >
                  <span className="sr-only">Précédent</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <Button
                    key={idx}
                    variant={currentPage === idx + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(idx + 1)}
                    className="rounded-none px-4 py-2 hidden md:inline-flex"
                  >
                    {idx + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-r-md rounded-l-none px-2 py-2"
                >
                  <span className="sr-only">Suivant</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Supprimer la facture</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl">
              Oui, supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
