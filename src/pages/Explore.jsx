import React, { useEffect, useState } from "react";
import AButton from "../components/AButton";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Explore() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchLearners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/learners/explore?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setLearners(data.learners || []);
    } catch (e) {
      setError("Failed to load learners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLearners(); }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search skills or name" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
        <AButton onClick={fetchLearners}>Search</AButton>
      </div>
      {loading && <p className="text-slate-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {learners.map(l => {
          const remaining = Math.max(0, (l.requested_funding||0) - (l.funded_amount||0));
          const pct = Math.min(100, Math.round(((l.funded_amount||0)/(l.requested_funding||1))*100));
          return (
            <div key={l.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{l.name}</h3>
                  <p className="text-sm text-slate-400">{(l.skills||[]).join(', ')}</p>
                </div>
                <span className="text-xs text-slate-400">{l.return_model}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300 line-clamp-3">{l.project_description}</p>
              <div className="mt-4">
                <div className="h-2 rounded bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-600" style={{width: pct+"%"}} />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
                  <span>Remaining: ${remaining.toFixed(2)}</span>
                  <span>Goal: ${Number(l.requested_funding||0).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <AButton className="flex-1" onClick={async ()=>{
                  const amt = Number(prompt(`How much to invest? Max ${remaining.toFixed(2)}`));
                  if(!amt) return;
                  try{
                    const res = await fetch(`${API_BASE}/investments`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ investor_id: 'demo-investor', learner_id: l.id, amount: amt, model: l.return_model || 'ISA'})});
                    if(!res.ok){
                      const err = await res.json();
                      alert(err.detail || 'Error');
                    } else {
                      await fetchLearners();
                      alert('Investment completed');
                    }
                  }catch(e){ alert('Failed'); }
                }}>Invest Now</AButton>
                <AButton variant="outline">Review</AButton>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
