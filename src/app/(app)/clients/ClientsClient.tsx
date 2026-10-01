"use client";

import { useState, useEffect } from "react";

import { deleteClient } from "@/lib/actions/clients";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Search, Plus, MoreHorizontal, Mail, Phone, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Label } from "@/components/ui/label";

import { InvoiceData, ClientData } from "@/lib/data/types";

export default function ClientsClient({ initialClients, initialInvoices }: { initialClients: ClientData[], initialInvoices: InvoiceData[] }) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [invoices, setInvoices] = useState(initialInvoices);
  
  useEffect(() => {
    setClients(initialClients);
    setInvoices(initialInvoices);
  }, [initialClients, initialInvoices]);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientData | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const clientsWithStats = clients.map(client => {
    const clientInvoices = invoices.filter(i => i.clientId === client.id);
    const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const activeInvoices = clientInvoices.filter(i => ["sent", "partial", "overdue"].includes(i.status)).length;
    return { ...client, totalInvoiced, activeInvoices };
  });

  const filteredClients = clientsWithStats.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE) || 1;
  const currentClients = filteredClients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenDelete = (client: ClientData) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    await deleteClient(clientToDelete.id);
    const newClients = clients.filter(c => c.id !== clientToDelete.id);
    setClients(newClients);
    setIsDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-sm text-slate-500">Gérez votre base de clients et leurs contacts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/clients/nouveau">
            <Button className="rounded-xl shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau client
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Rechercher un client..." 
            className="w-full bg-white border-slate-200 pl-9 rounded-xl shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-semibold text-slate-500 h-11">Entreprise</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11">Contact</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11 text-right">CA Facturé</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11 text-center">Factures en cours</TableHead>
              <TableHead className="w-12 h-11"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentClients.length > 0 ? (
              currentClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="font-medium text-slate-900">{client.name}</div>
                    {client.city && <div className="text-sm text-slate-500">{client.city}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="text-slate-900">{client.contactName || "—"}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      {client.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {client.email}
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {client.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    {new Intl.NumberFormat("fr-FR").format(client.totalInvoiced)} FCFA
                  </TableCell>
                  <TableCell className="text-center">
                    {client.activeInvoices > 0 ? (
                      <span className="inline-flex items-center justify-center bg-orange-100 text-orange-700 rounded-full min-w-[24px] h-6 px-2 text-xs font-medium">
                        {client.activeInvoices}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-slate-400 hover:text-slate-900" })}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl shadow-sm border-slate-100">
                        <DropdownMenuItem onClick={() => router.push(`/clients/${client.id}/modifier`)}>
                          <Edit className="w-4 h-4 mr-2" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleOpenDelete(client)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Aucun client trouvé.
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
                Affichage de <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> à <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)}</span> sur <span className="font-medium">{filteredClients.length}</span> résultats
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
            <DialogTitle>Supprimer le client</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer {clientToDelete?.name} ? Cette action est irréversible et n'effacera pas ses factures associées.
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
