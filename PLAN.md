# izifacture — Plan d'implémentation

SaaS de facturation pour entrepreneurs africains (zone FCFA).
Stack : Next.js 14 (App Router) · Supabase (Postgres, Auth, Storage) · Tailwind CSS · Vercel.

---

## 0. Principes directeurs

1. **L'argent est sacré.** Montants stockés en **entiers** (`bigint`) — le FCFA n'a pas de subdivision. Jamais de `float` pour un montant. Tous les calculs passent par un seul module pur et testé (`lib/invoice/calc.ts`), et **le serveur recalcule toujours** les totaux : on ne fait jamais confiance aux totaux envoyés par le client.
2. **Une facture émise est immuable.** Une fois envoyée, on fige une copie (snapshot) des infos client et entreprise sur la facture. Modifier un client plus tard ne change pas une facture déjà émise. Une facture envoyée ne se supprime pas : on l'annule.
3. **Numérotation séquentielle sans trou** (exigence comptable/fiscale OHADA) : le numéro est attribué **au moment de l'émission** (pas à la création du brouillon), de façon atomique en base.
4. **Mobile d'abord.** La majorité des utilisateurs sera sur téléphone, parfois en 3G. Les captures servent de référence pour le desktop ; chaque écran aura une déclinaison mobile pensée (pas juste « empilée »). On privilégie les Server Components et on garde le JS client léger.
5. **Server-first dès la phase 2.** Les données locales de la phase 2 passent par la même couche d'accès (repository) que Supabase en phase 3. On change l'implémentation, pas les pages.
6. **Multi-tenant dès le départ.** Toutes les données métier portent un `org_id`, protégé par RLS. Un compte = une entreprise pour le MVP, mais le modèle permet plusieurs membres plus tard sans migration douloureuse.
7. **Interface en français**, code en anglais, URLs en français.

---

## 1. Décisions fonctionnelles

| Sujet | Décision (par défaut) |
|---|---|
| Devise | FCFA — `XOF` (UEMOA). Colonne `currency` conservée pour ajouter `XAF` plus tard. Affichage : `1 250 000 FCFA` (espace fine insécable). |
| TVA | Taux **par facture**, 18 % par défaut (configurable dans les paramètres ; option « Exonéré » = 0 %). Extensible au taux par ligne plus tard. |
| Remise | Optionnelle, en % ou en montant fixe, appliquée sur le HT **avant** TVA. |
| Calcul | `ligne = round(qté × PU)` · `HT = Σ lignes` · `HT net = HT − remise` · `TVA = round(HT net × taux)` · `TTC = HT net + TVA`. Quantités décimales autorisées (ex. 1,5 h). Arrondi à l'entier le plus proche. |
| Numérotation | `{préfixe}-{année}-{séquence}` → `FAC-2026-0001`. Compteur par entreprise et par année, attribué à l'émission. |
| Statuts stockés | `draft` · `sent` · `paid` · `cancelled` |
| Statuts affichés | + `overdue` (en retard) et `partial` (partiellement payée), **dérivés** en SQL (échéance dépassée / paiements partiels), sans tâche cron. |
| Paiements | Table dédiée (paiements partiels possibles). Moyens : Espèces, Virement, Orange Money, Wave, MTN MoMo, Moov Money, Chèque, Autre. La facture passe à `paid` quand Σ paiements ≥ TTC. |
| Envoi | E-mail (Resend) avec PDF joint + lien public ; **partage WhatsApp** (lien `wa.me` pré-rempli) — canal n°1 en Afrique de l'Ouest. |
| Lien public | `/f/{token}` : page consultable sans compte, token aléatoire non devinable, téléchargement PDF. |
| Identifiants légaux | Champs libres : n° fiscal (NINEA / NCC / IFU…) et RCCM, affichés sur la facture. |
| Dates | Type `date` (pas de fuseau), affichage `8 janv. 2026`. |

---

## 2. Architecture

### 2.1 Arborescence

```
izifacture/
├─ app/
│  ├─ (marketing)/            page.tsx (landing), tarifs/…           — phase 5
│  ├─ (auth)/                 connexion/, inscription/, mot-de-passe-oublie/, reinitialiser/
│  ├─ auth/callback/route.ts  échange du code Supabase                — phase 4
│  ├─ (app)/                  layout.tsx = sidebar + topbar (shell)
│  │  ├─ tableau-de-bord/
│  │  ├─ factures/            liste · nouvelle/ · [id]/ · [id]/modifier/
│  │  ├─ clients/             liste · [id]/
│  │  ├─ paiements/           historique des encaissements
│  │  ├─ parametres/          entreprise · facturation · profil
│  │  └─ bienvenue/           onboarding (création de l'entreprise)  — phase 4
│  ├─ f/[token]/              facture publique
│  └─ api/factures/[id]/pdf/route.ts
├─ components/
│  ├─ ui/                     primitives (Button, Input, Select, Dialog, Badge, Card, Table…)
│  ├─ layout/                 Sidebar, Topbar, MobileNav, PageHeader
│  ├─ invoices/               InvoiceForm, LineItemsEditor, InvoicePreview, StatusBadge, TotalsPanel
│  ├─ clients/                ClientForm, ClientPicker (combobox + création rapide)
│  └─ dashboard/              StatCard, RevenueChart, RecentInvoices
├─ lib/
│  ├─ invoice/calc.ts         calculs purs (100 % testés)
│  ├─ format.ts               formatMoney, formatDate, formatPhone
│  ├─ validation/             schémas Zod partagés client/serveur
│  ├─ data/
│  │  ├─ types.ts             types du domaine
│  │  ├─ repository.ts        interfaces (InvoiceRepo, ClientRepo, OrgRepo, PaymentRepo)
│  │  ├─ local/               implémentation mémoire + seed           — phase 2
│  │  └─ supabase/            implémentation Supabase                  — phase 3
│  ├─ actions/                Server Actions (factures, clients, paiements, paramètres)
│  ├─ supabase/               clients server / browser / middleware (@supabase/ssr)
│  ├─ pdf/InvoicePdf.tsx      @react-pdf/renderer
│  └─ email/                  templates + envoi Resend
├─ supabase/
│  ├─ migrations/             SQL versionné
│  ├─ seed.sql
│  └─ tests/                  tests RLS (pgTAP)
├─ tests/
│  ├─ unit/                   Vitest
│  └─ e2e/                    Playwright
└─ middleware.ts
```

### 2.2 Librairies

| Besoin | Choix | Pourquoi |
|---|---|---|
| UI | Tailwind + primitives style shadcn/ui (Radix) | accessibles, entièrement restylables selon les captures |
| Icônes | lucide-react | cohérent avec le style des captures |
| Police | Plus Jakarta Sans via `next/font` | proche des captures, auto-hébergée |
| Formulaires | react-hook-form + `useFieldArray` + Zod | lignes dynamiques, validation partagée |
| Graphiques | Recharts | CA mensuel du dashboard |
| PDF | @react-pdf/renderer (côté serveur) | pas de Chromium headless, compatible Vercel |
| E-mail | Resend | simple, domaine vérifiable |
| Toasts | sonner | |
| Tests | Vitest, Testing Library, Playwright, pgTAP | |

### 2.3 Flux des données

```
Page (Server Component) ──► repository.get…()  ──► local (phase 2) | Supabase (phase 3+)
Formulaire (Client)     ──► Server Action ──► Zod ──► recalcul calc.ts ──► repository.save…() ──► revalidatePath()
```

Création/émission de facture = **une seule fonction Postgres (RPC)** exécutée en transaction (en-tête + lignes + numéro + snapshot), car supabase-js n'offre pas de transactions côté client.

---

## 3. Modèle de données (Supabase)

```sql
organizations         id, name, legal_name, email, phone, address, city, country,
                      tax_id, rccm, logo_path, currency ('XOF'|'XAF'),
                      default_tax_rate (18.00), invoice_prefix ('FAC'),
                      payment_terms_days (30), default_notes, payment_instructions,
                      created_at, updated_at

organization_members  org_id, user_id, role ('owner'|'admin'|'member'), PK(org_id, user_id)

profiles              id (= auth.users.id), full_name, phone, avatar_url

invoice_counters      org_id, year, last_value            — verrou de ligne pour la séquence

clients               id, org_id, name, contact_name, email, phone, address, city,
                      country, tax_id, notes, archived_at, created_at, updated_at

invoices              id, org_id, client_id, number (NULL si brouillon),
                      status ('draft'|'sent'|'paid'|'cancelled'),
                      issue_date, due_date, currency,
                      tax_rate, discount_type ('percent'|'amount'|NULL), discount_value,
                      subtotal, discount_amount, tax_amount, total, amount_paid,   -- bigint
                      notes, terms, client_snapshot jsonb, company_snapshot jsonb,
                      public_token (unique), sent_at, paid_at, cancelled_at,
                      created_by, created_at, updated_at
                      UNIQUE(org_id, number)

invoice_items         id, invoice_id, org_id, position, description,
                      quantity numeric(12,2), unit_price bigint, line_total bigint

payments              id, org_id, invoice_id, amount bigint, paid_on date,
                      method, reference, note, created_by, created_at

invoice_events        id, org_id, invoice_id, type ('created'|'sent'|'viewed'|
                      'payment_recorded'|'cancelled'…), payload jsonb, actor_id, created_at
```

**Vue** `invoices_view` : ajoute `display_status` (`overdue` si `sent` et `due_date < current_date` et non soldée ; `partial` si `0 < amount_paid < total`) et le nom du client.

**Fonctions (RPC, `security invoker` sauf mention)** :
- `save_invoice(payload jsonb)` — crée/met à jour un brouillon + lignes, recalcule les totaux en SQL.
- `issue_invoice(id)` — attribue le numéro (`SELECT … FOR UPDATE` sur `invoice_counters`), fige les snapshots, passe en `sent`.
- `record_payment(invoice_id, …)` — insère le paiement, met à jour `amount_paid` / `status` / `paid_at`.
- `dashboard_stats(from, to)` — nb factures, facturé, encaissé, en attente, en retard, CA par mois.
- `get_public_invoice(token)` — `security definer`, ne renvoie que la facture du token (pas les autres données).

**Contraintes** : `CHECK` sur montants ≥ 0, quantité > 0, taux entre 0 et 100 ; triggers `updated_at` ; index sur `(org_id, status)`, `(org_id, due_date)`, `(org_id, client_id)`.

**RLS** : activée sur **toutes** les tables. Fonction `is_org_member(org_id)` (`security definer`, `stable`). Politique type : `using (is_org_member(org_id))`. Les factures non `draft` refusent `UPDATE` des champs monétaires (trigger) et `DELETE`.

**Storage** : bucket `logos` (public en lecture), écriture limitée au chemin `{org_id}/…` pour les membres ; PNG/JPEG/WebP/SVG, ≤ 2 Mo.

---

## 4. Système de design (d'après les captures)

Relevé sur la première capture (« Create Invoice ») — à compléter avec les suivantes :
- Fond d'application gris très clair, cartes blanches, bordures fines gris clair, rayons ~12 px, ombres très légères.
- Sidebar blanche à gauche : logo, recherche (`⌘F`), sections « Menu », élément actif sur fond gris, bas de sidebar : aide, paramètres, mode sombre, carte utilisateur.
- Couleur primaire bleue (boutons « Envoyer », toggles, focus des champs).
- Champs avec label flottant en haut, icône à gauche, focus bleu.
- **Écran de création en deux colonnes : formulaire à gauche, aperçu live de la facture à droite** (toggle « Afficher l'aperçu »), actions « Enregistrer le brouillon » / « Envoyer la facture ». Sur mobile : onglets Formulaire / Aperçu.
- Tableaux sobres, totaux alignés à droite, total TTC en gras.

Les tokens (couleurs, rayons, ombres, typographie) seront définis une fois dans `tailwind.config.ts` + variables CSS, avec un **mode sombre** (présent dans la capture).

---

## 5. Phases

### Phase 1 — Fondations et UI statique (d'après les captures)
- Initialiser Next.js 14.2 (TypeScript strict, ESLint, Prettier), Tailwind, police, alias `@/`.
- Tokens de design + primitives UI + shell applicatif (sidebar desktop, tiroir/barre de nav mobile, topbar).
- Construire **toutes** les pages avec des données factices en dur : dashboard, liste factures (filtres par statut, recherche), création/édition facture (formulaire + aperçu), détail facture, clients (liste + fiche), paramètres, états vides, squelettes de chargement, pages 404/erreur.
- `lib/format.ts` et `lib/invoice/calc.ts` écrits et testés **dès cette phase** (Vitest).

**Critère de sortie** : toutes les pages naviguables, fidèles aux captures, correctes à 375 px et 1440 px.

### Phase 2 — Interactivité avec données locales
- Types du domaine, interfaces de repository, implémentation mémoire (singleton sur `globalThis` pour survivre au hot reload) + seed réaliste (entreprises et clients sénégalais / ivoiriens, montants FCFA).
- Server Actions + Zod pour : CRUD clients, brouillon/édition/émission/annulation/duplication de facture, enregistrement de paiement, paramètres.
- Formulaire facture : lignes dynamiques (ajout/suppression/réordonnancement), calcul live HT/remise/TVA/TTC, sélection client avec création rapide, échéance calculée depuis les conditions de paiement.
- Dashboard branché sur les vraies stats ; filtres et recherche via `searchParams` (URL partageable).
- Gestion des erreurs (toasts, messages de champ), états `pending`.

**Critère de sortie** : parcours complet « créer client → créer facture → émettre → encaisser → voir le dashboard bouger » sans base de données.

### Phase 3 — Supabase + tests
- Projet Supabase (région la plus proche des utilisateurs, ex. Europe-Ouest / Paris ; fonctions Vercel dans la même région `cdg1`).
- Supabase CLI : migrations SQL versionnées, types TS générés (`supabase gen types`), seed.
- Tables, vue, RPC, triggers, RLS, bucket Storage (cf. §3).
- Implémentation `lib/data/supabase/` du repository → bascule par une seule ligne.
- Upload du logo, génération PDF, lien public `/f/[token]`, envoi e-mail (Resend) et partage WhatsApp.
- Tests :
  - **Unitaires** (Vitest) : calculs, arrondis, formatage, schémas Zod.
  - **Base de données** (pgTAP) : RLS — l'utilisateur A ne voit/modifie jamais les données de B ; séquence de numéros sans trou ni doublon en concurrence ; immuabilité des factures émises.
  - **Intégration** : Server Actions contre la base Supabase locale.

> Note : la base locale Supabase nécessite Docker Desktop. À défaut, on utilise un second projet Supabase dédié aux tests.

**Critère de sortie** : l'app fonctionne entièrement sur Supabase, tous les tests passent.

### Phase 4 — Authentification
- `@supabase/ssr` : clients server/browser, `middleware.ts` qui rafraîchit la session et protège `(app)`.
- Inscription / connexion e-mail + mot de passe, lien magique (optionnel), mot de passe oublié, confirmation d'e-mail, déconnexion.
- Onboarding : à la première connexion, création de l'entreprise (nom, pays → devise, logo) → création `organizations` + `organization_members` (owner) en RPC.
- Profil utilisateur, e-mails d'auth en français.

**Critère de sortie** : impossible d'atteindre une page applicative ou une donnée sans session valide ; deux comptes sont totalement isolés.

### Phase 5 — Landing page
- Hero, bénéfices (facture en 2 min, FCFA et TVA 18 % natifs, WhatsApp, mobile money), aperçu produit, tarifs, FAQ, CTA inscription.
- SEO (metadata, Open Graph, sitemap, robots), performance (Lighthouse ≥ 90 mobile).

### Phase 6 — Passage de bout en bout, sécurité, déploiement
- **E2E Playwright** : inscription → onboarding → client → facture → émission → PDF → paiement → dashboard ; accès non authentifié redirigé ; isolation entre deux comptes ; lien public.
- **Revue sécurité** : RLS sur toutes les tables (script de vérification), `service_role` jamais exposé au client, validation serveur de toutes les entrées, en-têtes (CSP, HSTS, X-Frame-Options, Referrer-Policy), upload restreint, tokens publics non devinables, pas de fuite dans les messages d'erreur, limitation de débit sur auth et lien public.
- Accessibilité (clavier, contrastes, labels), états vides/erreurs, pages 404/500.
- **Déploiement Vercel** : variables d'environnement, URLs de redirection Supabase Auth, domaine Resend, migrations appliquées en production, puis re-test E2E sur l'URL de production.
- CI GitHub Actions : lint + typecheck + tests unitaires + E2E sur chaque PR.

---

## 6. Hors périmètre MVP (pistes suivantes)
Devis convertibles en facture · factures récurrentes · avoirs · relances automatiques · paiement en ligne (Wave / Orange Money / CinetPay / PayDunya) · multi-utilisateurs avec rôles · export comptable CSV · catalogue produits/services · multi-devises · anglais · PWA hors-ligne.

---

## 7. Décisions confirmées (2026-09-27)
1. Devise : **XOF** uniquement pour le MVP (XAF reste une option future).
2. TVA : **un seul taux par facture** (18 % par défaut, option « Exonéré »).
3. Numéro : **attribué à l'envoi** de la facture.
4. Environnement : **Node 22 LTS**.
