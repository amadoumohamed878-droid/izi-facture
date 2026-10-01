# 📄 GEMINI.md - Documentation & Guide du Projet IziFacture

Ce fichier sert de référence complète et d'instructions pour le projet **IziFacture**, afin de permettre à tout assistant IA ou développeur de comprendre instantanément l'application, son architecture, ses choix de design et ses règles techniques.

---

## 🚀 1. Ce que l'application fait

**IziFacture** est une application web moderne de facturation et de gestion de clients conçue spécifiquement pour les PME et indépendants (adaptée au contexte ouest-africain / sénégalais : devise en FCFA, NINEA/TVA, etc.).

L'application permet de :
- Consulter un tableau de bord analytique avec les statistiques clés (revenus du mois, factures en attente, factures en retard, nombre de factures émises).
- Gérer la liste des factures (créer, modifier, prévisualiser/imprimer, changer de statut, filtrer, rechercher, supprimer).
- Gérer le répertoire des clients (créer, éditer, rechercher, afficher le détail des factures associées).
- Configurer les paramètres de l'entreprise (coordonnées, NINEA, coordonnées bancaires, taux de TVA par défaut, mentions légales) avec une prévisualisation en direct de l'en-tête de facture.

---

## ✨ 2. Toutes les fonctionnalités implémentées

### 📊 Tableau de Bord (`/tableau-de-bord`)
- **Cartes statistiques dynamiques** : Revenus encaissés ce mois, montants en attente, montants en retard, total factures émises.
- **Liste des 5 dernières factures** avec tri automatique (de la plus récente à la plus ancienne).
- **Menu d'actions rapides** : Voir les détails, modifier, changer le statut (`Payée`, `Envoyée`, `En retard`, `Brouillon`, `Annulée`) ou supprimer une facture.

### 🧾 Factures (`/factures`)
- **Listing complet avec pagination** (8 factures par page).
- **Recherche temps réel** par nom de client ou numéro de facture.
- **Filtre par statut** (`Tous`, `Brouillon`, `Envoyée`, `Payée`, `En retard`).
- **Création de facture (`/factures/nouvelle`)** :
  - Sélection du client ou ajout rapide d'un client.
  - Saisie dynamique d'articles (description, quantité, prix unitaire FCFA).
  - Calculs automatiques des sous-totaux, remises (pourcentage ou montant fixe), TVA (ex: 18%) et total TTC.
  - Sauvegarde en tant que `Brouillon` ou `Envoyée`.
- **Détail & Visualisation (`/factures/[id]`)** :
  - Rendu imprimable / PDF propre de la facture avec les coordonnées de l'entreprise paramétrées et du client.
  - Actions : Modifier, Imprimer/Télécharger PDF, Changement de statut, Supprimer.
- **Modification de facture (`/factures/[id]/modifier`)**.

### 👥 Clients (`/clients`)
- **Listing des clients** avec recherche par nom/entreprise.
- **Formulaire d'ajout / édition** de client (Nom, contact, email, téléphone, adresse, NINEA/TVA).
- **Fiche client** avec historique de ses factures.

### ⚙️ Paramètres d'Entreprise (`/parametres`)
- **Formulaire de configuration** : Nom de l'entreprise, NINEA, Email, Téléphone, Adresse, Ville, Pays, Site web, Devise (default: `FCFA`), Taux de TVA par défaut, Nom de la banque, RIB / IBAN, Mentions légales.
- **Prévisualisation en direct** du rendu de l'en-tête de facture à droite de l'écran.
- Sauvegarde persistante en mémoire via Server Actions (`saveCompanySettingsAction`).

---

## 🛠️ 3. Technologies utilisées

- **Framework** : Next.js 15 (App Router, Server Actions, Server Components).
- **Langage** : TypeScript.
- **Style & UI** :
  - Tailwind CSS pour le styling.
  - Base UI / Radix UI primitives (`DropdownMenu`, `Dialog`, `Select`, `Table`, `Badge`, `Button`, `Input`).
  - Icons : Lucide React (`Plus`, `Search`, `Filter`, `Building`, `Check`, etc.).
  - Typography : Inter / Geist (Google Fonts).
- **Gestion des formulaires & validation** : React Hook Form, Zod.
- **Base de données & Persistence** :
  - **Supabase PostgreSQL** via `@supabase/ssr` (`createClient()` dans `src/lib/supabase/server.ts`).
  - Mappers de conversion DB <-> Application (`src/lib/data/mappers.ts`).
  - Base locale de secours / type exports (`src/lib/data/local/index.ts`).
  - Force dynamic rendering (`export const dynamic = "force-dynamic"`) sur toutes les pages serveur Next.js pour l'actualisation en temps réel.

---

## 📁 4. Structure des fichiers

```
izifacture/
├── GEMINI.md                            # Ce fichier de référence
├── src/
│   ├── app/
│   │   ├── (app)/                       # Routes sous layout d'application
│   │   │   ├── layout.tsx               # Sidebar & Navigation principale
│   │   │   ├── page.tsx                 # Redirection vers /tableau-de-bord
│   │   │   ├── tableau-de-bord/         # Dashboard (page.tsx, DashboardClient.tsx)
│   │   │   ├── factures/                # Module Factures
│   │   │   │   ├── page.tsx
│   │   │   │   ├── InvoicesClient.tsx   # Client component du listing avec tri & filtres
│   │   │   │   ├── nouvelle/            # Formulaire de création de facture
│   │   │   │   └── [id]/                # Détail, impression et modification ([id]/modifier)
│   │   │   ├── clients/                 # Module Clients (page.tsx, ClientsClient.tsx)
│   │   │   └── parametres/              # Page Paramètres entreprise (page.tsx, SettingsClient.tsx)
│   │   ├── globals.css                  # CSS Global & variables Tailwind
│   │   ├── layout.tsx                   # Root Layout HTML/Body
│   │   └── error.tsx                    # Error boundary global
│   ├── components/
│   │   └── ui/                          # Composants UI réutilisables (button, badge, dialog, dropdown-menu, select, table, etc.)
│   └── lib/
│       ├── actions/                     # Server Actions (invoices.ts, company.ts)
│       ├── data/                        # Types & Base de données locale
│       │   ├── types.ts                 # Interfaces InvoiceData, ClientData, CompanySettings, etc.
│       │   └── local/index.ts           # Instance Singleton db (LocalDatabase)
│       ├── format.ts                    # Formateurs de prix (FCFA) et de dates
│       ├── invoice/calc.ts              # Logique de calcul des sous-totaux, TVA, remises
│       └── validation/                  # Schemas Zod (invoice.ts, etc.)
```

---

## 🎨 5. Décisions de Design & Charte Graphique

1. **Esthétique Moderne & Soignée** :
   - Coins arrondis généreux (`rounded-2xl` pour les cartes/tableaux, `rounded-xl` pour boutons/inputs).
   - Bordures très douces en Slate (`border-slate-100` ou `border-slate-200`).
   - Ombres légères et propres (`shadow-sm`).
2. **Palette de couleurs** :
   - Fond principal : `bg-slate-50/50` ou `bg-slate-100/50`.
   - Cartes & Conteneurs : `bg-white`.
   - Textes : `text-slate-900` pour les titres, `text-slate-500` / `text-slate-600` pour les sous-titres et contenus.
   - Accents Statut :
     - **Payée** : Vert (`bg-emerald-100 text-emerald-700 border-emerald-200`).
     - **Envoyée** : Orange (`bg-orange-100 text-orange-700 border-orange-200`).
     - **En retard** : Rouge (`bg-red-100 text-red-700 border-red-200`).
     - **Brouillon** : Gris (`bg-slate-100 text-slate-700 border-slate-200`).
3. **Ergonomie & UX** :
   - Les nouvelles factures reçoivent un timestamp `createdAt: Date.now()` et sont **toujours affichées au sommet de la liste** sur la page Factures et sur le Dashboard.
   - Les menus déroulants (actions `...`) n'utilisent pas de conteneurs HTML incompatibles (ex: `DropdownMenuLabel` rendu comme `div` standard sans `MenuPrimitive.GroupLabel` pour éviter les erreurs de contexte Base UI).

---

## 🤖 6. Instructions pour les futurs modèles IA

Lorsque vous travaillez sur ce projet :
1. **Règles utilisateur prioritaires** :
   - **Salutation obligatoire** : Commencez TOUJOURS la toute première phrase de chaque réponse à l'utilisateur par : `"Bonjour Mohamed"`.
   - **Publication de site** : Si l'utilisateur vous demande de publier le site, demandez-lui d'abord explicitement : `"Est-ce que tu peux le faire"`.
2. **Chargement dynamique** :
   - Gardez `export const dynamic = "force-dynamic"` en haut des pages serveur Next.js App Router (`factures/page.tsx`, `tableau-de-bord/page.tsx`, `parametres/page.tsx`, `clients/page.tsx`) pour éviter le caching rsc statique qui empêcherait l'affichage instantané des données modifiées.
3. **Tri des Factures** :
   - Tout tri des factures doit comparer `createdAt` (ou à défaut l'horodatage de `issueDate`) de manière décroissante : `(b.createdAt ?? new Date(b.issueDate).getTime()) - (a.createdAt ?? new Date(a.issueDate).getTime())`.
4. **Mutations via Server Actions** :
   - Utilisez `revalidatePath("/", "layout")` lors de toute mutation (`saveInvoice`, `deleteInvoice`, `updateInvoiceStatus`, `saveCompanySettingsAction`) afin de rafraîchir le cache Next.js sur tout l'arbre de routage.
