-- Schema SQL complet pour Supabase - IziFacture

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table Companies (Paramètres de l'entreprise)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tax_id TEXT, -- NINEA / TVA
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Sénégal',
    website TEXT,
    currency TEXT DEFAULT 'FCFA',
    default_tax_rate NUMERIC(5, 2) DEFAULT 18.00,
    bank_name TEXT,
    bank_account TEXT, -- RIB / IBAN
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table Clients (Répertoire des clients)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Sénégal',
    tax_id TEXT,
    notes TEXT,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table Invoices (Factures)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    number TEXT UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    currency TEXT DEFAULT 'FCFA',
    tax_rate NUMERIC(5, 2) DEFAULT 18.00,
    discount_type TEXT CHECK (discount_type IN ('percent', 'amount', NULL)),
    discount_value NUMERIC(12, 2) DEFAULT 0,
    subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(14, 2) DEFAULT 0,
    tax_amount NUMERIC(14, 2) DEFAULT 0,
    total NUMERIC(14, 2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(14, 2) DEFAULT 0,
    notes TEXT,
    terms TEXT,
    client_snapshot JSONB,
    company_snapshot JSONB,
    public_token TEXT UNIQUE,
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table Invoice Items (Articles / Prestations de factures)
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    position INT DEFAULT 0,
    description TEXT NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    line_total NUMERIC(14, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers de mise à jour automatique du champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Activation de RLS (Row Level Security)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (Accès complet pour le développement)
CREATE POLICY "Allow all access to companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to invoice_items" ON public.invoice_items FOR ALL USING (true) WITH CHECK (true);
