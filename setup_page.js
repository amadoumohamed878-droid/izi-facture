const fs = require('fs');

const pageContent = `
"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    // Year updater
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear().toString();
    }

    // Scroll reveal
    const targets = document.querySelectorAll('section > div');
    targets.forEach(target => {
      target.classList.add('reveal-on-scroll');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#fbf9f6] text-[#0f172a] antialiased selection:bg-brand-500 selection:text-white overflow-x-hidden">
      
      <header className="sticky top-0 z-50 bg-[#fbf9f6]/85 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link className="flex items-center gap-2.5 group" href="/">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-neutral-900">
                izi<span className="text-blue-600">Facture</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 text-[15px] font-medium text-neutral-700">
              <a className="hover:text-blue-600 transition-colors duration-150" href="#fonctionnalites">Fonctionnalités</a>
              <a className="hover:text-blue-600 transition-colors duration-150" href="#pourquoi-nous">Pourquoi nous</a>
              <a className="hover:text-blue-600 transition-colors duration-150" href="#comment-ca-marche">Comment ça marche</a>
              <a className="hover:text-blue-600 transition-colors duration-150" href="#temoignages">Témoignages</a>
              <a className="hover:text-blue-600 transition-colors duration-150" href="#tarifs">Tarifs</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link className="hidden sm:inline-flex text-sm font-semibold text-neutral-800 hover:text-blue-600 transition-colors px-3 py-2" href="/login">Connexion</Link>
              <a className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-lg active:scale-95 transition-all duration-150" href="#tarifs">Essai gratuit</a>
            </div>
          </div>
        </div>
      </header>

      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-brand-200/50 to-transparent blur-3xl -z-10 pointer-events-none rounded-full reveal-on-scroll is-visible"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-on-scroll is-visible">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-6 shadow-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            <span className="">⚡ Conçu spécialement pour les entreprises africaines</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 max-w-4xl mx-auto leading-[1.12]">
            Fini le casse-tête des factures sur Word et Excel.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Créez des factures professionnelles en <strong className="font-semibold text-neutral-900">FCFA conformes avec TVA 18%</strong> en moins de 2 minutes, et pilotez vos encaissements sans aucun stress.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" href="#tarifs">
              Commencer gratuitement
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"></path></svg>
            </a>
            <a className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-full text-base font-semibold text-neutral-800 bg-white border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 shadow-sm transition-all duration-200" href="#apercu-demo">
              <svg className="mr-2 w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" fillRule="evenodd"></path></svg>
              Voir la démo en 1 min
            </a>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-neutral-500 font-medium">
            ✓ Sans carte bancaire • Configuration en 60 secondes chrono • Conforme OHADA
          </p>

          <div className="mt-12 pt-8 border-t border-neutral-200/70 max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
              Recommandé par plus de 2 500 PME et indépendants à Dakar, Abidjan, Douala, Cotonou &amp; Lomé
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
              <span className="font-extrabold text-lg tracking-tight text-neutral-800 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Wave
              </span>
              <span className="font-bold text-lg tracking-tight text-neutral-800 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5500]"></span> Orange Money
              </span>
              <span className="font-bold text-lg tracking-tight text-neutral-800 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span> MTN MoMo
              </span>
              <span className="font-bold text-lg tracking-tight text-neutral-800 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-600"></span> Ecobank
              </span>
              <span className="font-bold text-lg tracking-tight text-neutral-800 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span> Moov Money
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-100/60 border-y border-neutral-200/80" id="pourquoi-nous">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll is-visible">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">LE CONSTAT</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Pourquoi la facturation traditionnelle freine votre croissance
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600">
              Les méthodes manuelles coûtent des heures précieuses et font perdre de l'argent chaque mois aux entreprises africaines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-soft hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Factures non professionnelles</h3>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Les fichiers Word et Excel envoyés en vrac décrédibilisent votre entreprise devant des grands comptes et donnent une impression d’amateurisme.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-soft hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Calculs manuels de TVA &amp; taxes</h3>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Erreurs d’arrondis sur la TVA 18%, montants Hors Taxe vs TTC inversés et angoisse comptable permanente lors des déclarations mensuelles.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-soft hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Suivi des paiements impossible</h3>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Factures oubliées, clients qui paient avec des semaines de retard sans que vous ne vous en rendiez compte, et trésorerie inutilement asphyxiée.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" id="fonctionnalites">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll is-visible">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">FONCTIONNALITÉS</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Tout ce dont vous avez besoin pour facturer comme un pro
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600">
              Une plateforme moderne, intuitive et taillée pour les standards fiscaux de la zone UEMOA et CEMAC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200/80 shadow-soft hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">Factures professionnelles en 2 clics</h3>
              <p className="text-neutral-600 leading-relaxed text-base mb-6">Générez des modèles irréprochables respectant les normes OHADA. Intégrez votre logo, votre numéro NINEA / RCCM, et téléchargez un PDF haute définition prêt à envoyer.</p>
              <div className="flex items-center text-sm font-semibold text-blue-600">
                <span className="">Personnalisation complète de marque</span>
                <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200/80 shadow-soft hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">TVA 18% calculée automatiquement</h3>
              <p className="text-neutral-600 leading-relaxed text-base mb-6">Détail clair des montants HT, TVA (18%) et TTC calculés à l'unité près en Francs CFA (XOF / XAF). Évitez les redressements et gagnez la confiance de vos partenaires financiers.</p>
              <div className="flex items-center text-sm font-semibold text-blue-600">
                <span className="">Zéro erreur de calcul comptable</span>
                <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200/80 shadow-soft hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">Suivi des paiements en temps réel</h3>
              <p className="text-neutral-600 leading-relaxed text-base mb-6">Statuts instantanés ultra-visuels (<span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Payé</span>, <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">En attente</span>, <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">En retard</span>). Sachez qui a payé et programmez des relances automatiques bienveillantes.</p>
              <div className="flex items-center text-sm font-semibold text-blue-600">
                <span className="">Visibilité totale sur votre trésorerie</span>
                <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200/80 shadow-soft hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">Gestion de clients intégrée</h3>
              <p className="text-neutral-600 leading-relaxed text-base mb-6">Carnet d'adresses centralisé avec historique d'achats, devis transformés en factures en un seul clic, et export simplifié pour votre comptable ou votre banquier.</p>
              <div className="flex items-center text-sm font-semibold text-blue-600">
                <span className="">Fini la recherche d'anciens emails</span>
                <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-100/50 border-t border-neutral-200/80" id="comment-ca-marche">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll is-visible">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">SIMPLICITÉ ABSOLUE</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Prêt en 3 étapes simples
            </h2>
            <p className="mt-2 text-neutral-600">Aucune compétence en comptabilité n'est requise.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="relative bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/30">1</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Inscrivez-vous en 30s</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Renseignez votre nom commercial, pays et monnaie (FCFA). Aucune carte bancaire n'est requise pour débuter.
              </p>
            </div>

            <div className="relative bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white font-extrabold text-xl flex items-center justify-center mb-6 shadow-md">2</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Créez votre facture</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Ajoutez vos prestations ou produits. Les montants HT, TVA 18% et TTC s'actualisent instantanément sans calculatrice.
              </p>
            </div>

            <div className="relative bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/30">3</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Envoyez et encaissez</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Partagez la facture via WhatsApp, lien sécurisé ou PDF. Recevez une alerte dès que votre client effectue le paiement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" id="temoignages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll is-visible">
          <div className="relative rounded-3xl md:rounded-[40px] bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500 text-white p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-widest font-bold text-white/90 bg-white/15 px-3.5 py-1 rounded-full backdrop-blur-sm">TÉMOIGNAGES CLIENTS</span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">Ce que disent les entrepreneurs qui ont sauté le pas</h2>
              <p className="mt-3 text-blue-100 text-base sm:text-lg">Découvrez comment ils ont transformé leur gestion quotidienne à Dakar, Abidjan et Douala.</p>
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white text-neutral-900 rounded-2xl p-7 shadow-lg flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-200">
                <div>
                  <div className="flex items-center text-amber-400 mb-4">★★★★★</div>
                  <p className="text-neutral-700 text-sm leading-relaxed italic mb-6">« Avant iziFacture, je passais mes dimanches à faire des totaux sur Excel avec des erreurs de TVA. Aujourd'hui, mes clients à Abidjan reçoivent des factures ultra-pros en 1 minute chrono. »</p>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">MD</div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Moussa Diop</h4>
                    <p className="text-xs text-neutral-500">Studio Kemet • Dakar</p>
                  </div>
                </div>
              </div>
              <div className="bg-white text-neutral-900 rounded-2xl p-7 shadow-lg flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-200">
                <div>
                  <div className="flex items-center text-amber-400 mb-4">★★★★★</div>
                  <p className="text-neutral-700 text-sm leading-relaxed italic mb-6">« La gestion des paiements Wave et virements en direct a divisé nos retards de règlement par trois. Un outil désormais indispensable pour tous les prestataires de services en Côte d'Ivoire. »</p>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">AB</div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Aïssatou Bakayoko</h4>
                    <p className="text-xs text-neutral-500">Consultante Marketing • Abidjan</p>
                  </div>
                </div>
              </div>
              <div className="bg-white text-neutral-900 rounded-2xl p-7 shadow-lg flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-200">
                <div>
                  <div className="flex items-center text-amber-400 mb-4">★★★★★</div>
                  <p className="text-neutral-700 text-sm leading-relaxed italic mb-6">« Le calcul automatique de la TVA à 18% et l’affichage net en Francs CFA nous évitent bien des tracas comptables en fin de trimestre. Simple, net et redoutablement efficace. »</p>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">YN</div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Yannick Nguessan</h4>
                    <p className="text-xs text-neutral-500">Gérant TechServices • Douala</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap items-center justify-around gap-6 text-center text-white">
              <div>
                <div className="text-3xl font-black">99.8%</div>
                <div className="text-xs text-blue-200 mt-1">Conformité fiscale</div>
              </div>
              <div>
                <div className="text-3xl font-black">&lt; 2 min</div>
                <div className="text-xs text-blue-200 mt-1">Pour créer une facture</div>
              </div>
              <div>
                <div className="text-3xl font-black">+450M FCFA</div>
                <div className="text-xs text-blue-200 mt-1">Facturés chaque mois</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-100/50 border-t border-neutral-200/80" id="tarifs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll is-visible">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full inline-block mb-4">TARIFICATION TRANSPARENTE</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">Des tarifs clairs, sans frais cachés</h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">Choisissez le forfait adapté à votre activité. Passez au niveau supérieur sans engagement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-soft flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-neutral-900">Gratuit</h3>
                  <p className="text-xs text-neutral-500 mt-1 min-h-[36px]">Idéal pour tester et démarrer votre activité</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-neutral-900">0 FCFA</span>
                    <span className="text-sm text-neutral-500 font-medium">/ mois</span>
                  </div>
                  <span className="inline-block mt-1 text-xs text-neutral-400 font-medium">Gratuit pour toujours</span>
                </div>
                <ul className="space-y-3 pt-6 border-t border-neutral-100 text-sm text-neutral-700 mb-8">
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">5 factures &amp; devis par mois</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">1 utilisateur</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Calcul automatique TVA 18%</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Export PDF haute définition</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Partage WhatsApp &amp; Email</span></li>
                </ul>
              </div>
              <a className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-bold text-neutral-800 bg-white border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 shadow-sm transition-all duration-200" href="/login">Démarrer gratuitement</a>
            </div>

            <div className="relative bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-xl shadow-blue-500/10 flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-200 md:-mt-3 md:-mb-3">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md shadow-blue-500/30 whitespace-nowrap">⭐ Le plus populaire</div>
              <div>
                <div className="mb-6 pt-2">
                  <h3 className="text-xl font-bold text-neutral-900">Pro</h3>
                  <p className="text-xs text-neutral-500 mt-1 min-h-[36px]">Pour les indépendants, prestataires et TPE en croissance</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-neutral-900">5 000 FCFA</span>
                    <span className="text-sm text-neutral-500 font-medium">/ mois</span>
                  </div>
                  <span className="inline-block mt-1 text-xs text-blue-600 font-semibold">Facturation sans engagement</span>
                </div>
                <ul className="space-y-3 pt-6 border-t border-neutral-100 text-sm text-neutral-700 mb-8">
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="font-semibold text-neutral-900">Factures &amp; devis illimités</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">1 utilisateur principal</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Calcul automatique TVA 18% &amp; taxes</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Suivi des paiements en temps réel</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Relances automatiques d'impayés</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Personnalisation complète (logo, mentions)</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="font-medium text-blue-700">Support prioritaire WhatsApp</span></li>
                </ul>
              </div>
              <a className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all duration-200" href="/login">Commencer l'essai Pro</a>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-soft flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-neutral-900">Entreprise</h3>
                  <p className="text-xs text-neutral-500 mt-1 min-h-[36px]">Pour les PME et structures avec plusieurs collaborateurs</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-neutral-900">15 000 FCFA</span>
                    <span className="text-sm text-neutral-500 font-medium">/ mois</span>
                  </div>
                  <span className="inline-block mt-1 text-xs text-neutral-400 font-medium">Multi-comptes inclus</span>
                </div>
                <ul className="space-y-3 pt-6 border-t border-neutral-100 text-sm text-neutral-700 mb-8">
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="font-semibold text-neutral-900">Tout ce qui est inclus dans le plan Pro</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Multi-utilisateurs (jusqu'à 5 accès)</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Gestion avancée des droits d'accès</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Carnet clients &amp; produits illimité</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Export comptable pour expert-comptable</span></li>
                  <li className="flex items-center gap-2.5"><svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg><span className="">Accompagnement &amp; onboarding dédié</span></li>
                </ul>
              </div>
              <a className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-bold text-neutral-800 bg-white border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 shadow-sm transition-all duration-200" href="/login">Choisir le forfait Entreprise</a>
            </div>
          </div>
          <div className="mt-12 text-center text-xs sm:text-sm text-neutral-500 font-medium">
            <p className="">Tous nos prix sont en Francs CFA (XOF / XAF). Aucun frais d'installation. Sans engagement, résiliez à tout moment.</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-on-scroll is-visible">
          <div className="bg-white rounded-3xl md:rounded-[36px] p-10 md:p-16 border border-blue-200/80 shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
              Rejoignez les entrepreneurs qui facturent comme des pros
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-xl mx-auto">
              Passez à la vitesse supérieure dès aujourd'hui. Aucune carte bancaire requise, configuration en 1 minute.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all" href="/login">
                Commencer gratuitement
              </a>
              <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors" href="/login">
                Planifier un appel
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 font-medium">
              <span className="">✓ Support en français</span>
              <span className="">✓ Données hébergées en sécurité</span>
              <span className="">✓ Annulable à tout moment</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
            <div className="lg:col-span-2">
              <Link className="flex items-center gap-2.5" href="/">
                <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <span className="text-2xl font-black tracking-tight text-white">izi<span className="text-blue-500">Facture</span></span>
              </Link>
              <p className="mt-4 text-sm text-neutral-400 max-w-sm leading-relaxed">
                La solution de facturation cloud moderne conçue sur mesure pour répondre aux défis des PME, indépendants et créateurs en Afrique de l'Ouest et Centrale.
              </p>
              <div className="mt-6 flex items-center space-x-4 text-neutral-400">
                <a aria-label="LinkedIn" className="hover:text-white transition-colors" href="#">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
                <a aria-label="Twitter" className="hover:text-white transition-colors" href="#">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
                <a aria-label="Facebook" className="hover:text-white transition-colors" href="#">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"></path></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Produit</h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#fonctionnalites">Modèles de Factures</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#fonctionnalites">Calcul TVA 18%</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#fonctionnalites">Suivi des impayés</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#tarifs">Grille tarifaire</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#">Mises à jour</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Ressources</h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#">Guide fiscal OHADA</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#">Centre d'aide WhatsApp</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#">Modèles gratuits</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#">Blog pour entrepreneurs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Légal</h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#">Confidentialité</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#">Conditions générales</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#">Sécurité des données</a></li>
                <li className=""><a className="hover:text-brand-500 transition-colors" href="#">Mentions légales</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
            <p className="">© <span id="current-year" className="">2026</span> iziFacture Technologies. Tous droits réservés.</p>
            <p className="flex items-center gap-1.5">
              <span className="">Fait avec fierté en Afrique</span>
              <span className="text-base">🌍</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', pageContent);
