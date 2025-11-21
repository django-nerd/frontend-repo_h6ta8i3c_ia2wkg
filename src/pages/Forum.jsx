import React, { useEffect, useState } from "react";
import AButton from "../components/AButton";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

function timeAgo(iso){
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime())/1000; // seconds
  if(diff < 60) return `${Math.floor(diff)} seconds ago`;
  if(diff < 3600) return `${Math.floor(diff/60)} minutes ago`;
  if(diff < 86400) return `${Math.floor(diff/3600)} hours ago`;
  return d.toLocaleDateString();
}

export default function Forum(){
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const load = async () => {
    const res = await fetch(`${API_BASE}/forum/posts`);
    const data = await res.json();
    setPosts(data.posts || []);
  }
  useEffect(()=>{ load(); },[]);

  const submit = async () => {
    if(!title || !content) return;
    await fetch(`${API_BASE}/forum/posts`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ author_id: 'demo-user', title, content })});
    setTitle(""); setContent("");
    load();
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h2 className="text-2xl font-semibold">Community Forum</h2>
      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full bg-transparent border-b border-slate-700 pb-2 outline-none" />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Share an update, question, or idea..." rows={3} className="mt-3 w-full bg-transparent outline-none" />
        <div className="mt-3"><AButton onClick={submit}>Post</AButton></div>
      </div>
      <div className="mt-8 grid gap-4">
        {posts.map(p => (
          <article key={p.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{p.title}</h3>
              <span className="text-xs text-slate-500">{timeAgo(p.created_at)}</span>
            </div>
            <p className="mt-2 text-slate-300 whitespace-pre-wrap">{p.content}</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
              <span>Likes: {p.like_count || 0}</span>
              <span>Views: {p.views || 0}</span>
              <AButton variant="ghost" onClick={async ()=>{ await fetch(`${API_BASE}/forum/posts/${p.id}/like?user_id=demo-user`, { method:'POST' }); load(); }}>Like</AButton>
              <AButton variant="outline" onClick={async ()=>{ if(confirm('Delete this post?')) { await fetch(`${API_BASE}/forum/posts/${p.id}`, { method:'DELETE' }); load(); } }}>Delete</AButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
