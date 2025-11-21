import React, { useEffect, useState } from "react";
import AButton from "../components/AButton";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Dashboard(){
  const [summary, setSummary] = useState({ total_invested: 0, roi: 0, upcoming_payments: 0});
  const [investments, setInvestments] = useState([]);
  const [range, setRange] = useState('3m');

  useEffect(()=>{
    (async ()=>{
      const res = await fetch(`${API_BASE}/investments/portfolio/demo-investor`);
      const data = await res.json();
      setSummary(data.summary || summary);
      setInvestments(data.investments || []);
    })();
  },[]);

  const ranges = ['1m','3m','6m','1y'];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-semibold">Investor Dashboard</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-slate-400 text-sm">Total Invested</div>
          <div className="text-2xl font-bold">${summary.total_invested?.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-slate-400 text-sm">ROI</div>
          <div className="text-2xl font-bold">${summary.roi?.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-slate-400 text-sm">Upcoming Payments</div>
          <div className="text-2xl font-bold">${summary.upcoming_payments?.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3">
          {ranges.map(r => (
            <button key={r} onClick={()=>setRange(r)} className={`px-3 py-1.5 rounded border ${range===r? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-black border-slate-300'}`}>{r}</button>
          ))}
        </div>
        <div className="mt-4 h-40 bg-[repeating-linear-gradient(90deg,rgba(59,130,246,0.2),rgba(59,130,246,0.2)_2px,transparent_2px,transparent_10px)] rounded" />
        <p className="mt-2 text-sm text-slate-400">Demo chart placeholder.</p>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-3">Recent Investments</h3>
        <div className="grid gap-3">
          {investments.map(inv => (
            <div key={inv.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Learner</div>
                <div>${inv.amount?.toFixed(2)} • {inv.model}</div>
              </div>
              <AButton variant="ghost">Details</AButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
