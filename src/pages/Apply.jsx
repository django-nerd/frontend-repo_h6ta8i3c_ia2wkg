import React, { useState } from "react";
import AButton from "../components/AButton";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";
const fields = ["Art","Business","Computer Science","Design","Engineering","Finance","Health","Law","Marketing","Music","Science","Other"];

export default function Apply() {
  const [form, setForm] = useState({
    user_id: "demo-learner",
    name: "",
    age: 18,
    skills: "",
    field_of_study: "Computer Science",
    project_description: "",
    requested_funding: 1000,
    investment_terms: "",
    return_model: "ISA",
    payment_setup_done: false,
  });
  const [otherField, setOtherField] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    setLoading(true); setMsg("");
    const payload = { ...form, skills: form.skills.split(",").map(s=>s.trim()).filter(Boolean), field_of_study: form.field_of_study === 'Other' ? otherField : form.field_of_study };
    try{
      const res = await fetch(`${API_BASE}/learners/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)});
      const data = await res.json();
      if(!res.ok){ setMsg(data.detail || 'Error'); }
      else { setMsg('Submitted successfully. You now appear on Explore.'); setForm({ ...form, name: "", skills: "", project_description: ""}); }
    }catch(e){ setMsg('Failed to submit'); }
    finally{ setLoading(false); }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-semibold">Apply for Funding</h2>
      <p className="text-slate-400 mt-1">Tell us about your goals and how you plan to use the funds.</p>

      <div className="mt-6 grid gap-5">
        <div>
          <label className="text-sm text-slate-300">Name</label>
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm text-slate-300">Age: {form.age}</label>
          <input type="range" min={3} max={100} value={form.age} onChange={e=>setForm({...form, age:Number(e.target.value)})} className="mt-1 w-full accent-white" />
          <p className="text-xs text-slate-500">White slider with thin black outline (visual via OS accent).</p>
        </div>

        <div>
          <label className="text-sm text-slate-300">Skills (comma separated)</label>
          <input value={form.skills} onChange={e=>setForm({...form, skills:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm text-slate-300">Field of Study</label>
          <select value={form.field_of_study} onChange={e=>setForm({...form, field_of_study:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2">
            {fields.sort((a,b)=>a.localeCompare(b)).map(f=> <option key={f} value={f}>{f}</option>)}
          </select>
          {form.field_of_study === 'Other' && (
            <input placeholder="Enter field" value={otherField} onChange={e=>setOtherField(e.target.value)} className="mt-2 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
          )}
        </div>

        <div>
          <label className="text-sm text-slate-300">Project Description</label>
          <textarea value={form.project_description} onChange={e=>setForm({...form, project_description:e.target.value})} rows={5} className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm text-slate-300">Requested Funding: ${Number(form.requested_funding).toFixed(0)}</label>
          <input type="range" min={100} max={20000} step={100} value={form.requested_funding} onChange={e=>setForm({...form, requested_funding:Number(e.target.value)})} className="mt-1 w-full accent-white" />
        </div>

        <div>
          <label className="text-sm text-slate-300">Return Model</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['ISA','Revenue','Bonus','Hybrid'].map(m => (
              <button key={m} onClick={()=>setForm({...form, return_model:m})} className={`px-3 py-2 rounded-lg border ${form.return_model===m? 'bg-blue-600 border-blue-500' : 'border-slate-700'}`}>{m}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.payment_setup_done} onChange={e=>setForm({...form, payment_setup_done:e.target.checked})} />
          <span className="text-sm text-slate-300">I have set up my payment method</span>
        </div>

        <div className="flex gap-3">
          <AButton disabled={loading} onClick={submit}>Submit</AButton>
          {msg && <p className="text-sm text-slate-300">{msg}</p>}
        </div>
      </div>
    </section>
  );
}
