"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h2>
          <p className="text-sm text-slate-500 mb-6">
            {error.message || "Un problème inattendu s'est produit lors du chargement de cette page."}
          </p>
        </div>
        <Button onClick={() => reset()} className="w-full h-11 rounded-xl">
          Réessayer
        </Button>
      </div>
    </div>
  );
}
