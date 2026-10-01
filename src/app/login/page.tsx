import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "@/lib/actions/auth";
import { Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; mode?: string; success?: string }> | { error?: string; mode?: string; success?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const isSignup = resolvedSearchParams.mode === "signup";
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/20 mb-4">
            iz
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isSignup ? "Créer un compte" : "Bienvenue sur IziFacture"}
          </h1>
          <p className="text-slate-500 text-sm mt-2 text-center">
            {isSignup 
              ? "Inscrivez-vous pour commencer à gérer vos factures."
              : "Connectez-vous pour gérer vos factures et vos clients."}
          </p>
        </div>

        {resolvedSearchParams.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-start gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              {isSignup 
                ? "Erreur lors de l'inscription. L'email est peut-être déjà utilisé." 
                : "Identifiants incorrects. Veuillez vérifier votre adresse email et votre mot de passe."}
            </p>
          </div>
        )}

        {resolvedSearchParams.success && !isSignup && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm flex items-start gap-3 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p>Compte créé avec succès ! Vous pouvez maintenant vous connecter.</p>
          </div>
        )}

        <form action={isSignup ? signup : login} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="votre@email.com" 
                required 
                className="pl-10 rounded-xl h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="pl-10 rounded-xl h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-md">
            {isSignup ? "S'inscrire" : "Se connecter"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? (
            <>
              Déjà un compte ?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                Se connecter
              </Link>
            </>
          ) : (
            <>
              Pas encore de compte ?{" "}
              <Link href="/login?mode=signup" className="font-semibold text-blue-600 hover:underline">
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
