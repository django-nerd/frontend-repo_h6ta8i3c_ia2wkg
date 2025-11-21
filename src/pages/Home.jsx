import React from "react";
import AButton from "../components/AButton";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[conic-gradient(at_30%_20%,rgba(37,99,235,0.15),transparent_30%)] animate-pulse" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Invest in skills. Share the upside.</h1>
          <p className="mt-4 text-slate-300">Sponsor learners, creatives, and upskillers in exchange for future income or revenue share. A modern marketplace for human potential.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/explore"><AButton size="lg">Explore Learners</AButton></Link>
            <Link to="/apply"><AButton variant="outline" size="lg">Apply for Funding</AButton></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
