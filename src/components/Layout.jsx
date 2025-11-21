import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import AButton from "./AButton";

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(65%_65%_at_50%_0%,rgba(37,99,235,0.15),rgba(0,0,0,0.1)_60%,transparent_100%)]" />
      <header className="relative z-10 border-b border-slate-800/80 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="InvestEd" className="h-8 w-8" />
            <span className="font-semibold tracking-tight">InvestEd</span>
          </Link>
          <nav className="ml-auto hidden md:flex items-center gap-4">
            <NavLink to="/explore" className={({isActive})=>`px-3 py-2 rounded hover:bg-slate-800/60 ${isActive? 'bg-slate-800/80' : ''}`}>Explore</NavLink>
            <NavLink to="/apply" className={({isActive})=>`px-3 py-2 rounded hover:bg-slate-800/60 ${isActive? 'bg-slate-800/80' : ''}`}>Apply</NavLink>
            <NavLink to="/forum" className={({isActive})=>`px-3 py-2 rounded hover:bg-slate-800/60 ${isActive? 'bg-slate-800/80' : ''}`}>Forum</NavLink>
            <NavLink to="/dashboard" className={({isActive})=>`px-3 py-2 rounded hover:bg-slate-800/60 ${isActive? 'bg-slate-800/80' : ''}`}>Dashboard</NavLink>
          </nav>
          <div className="ml-2">
            <AButton variant="outline">Sign In</AButton>
          </div>
        </div>
      </header>
      <main className="relative z-10">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-slate-800/80 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
          © {new Date().getFullYear()} InvestEd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
