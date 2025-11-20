import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation, Navigate, useParams, useNavigate } from 'react-router-dom'
import { Menu, LogOut, LogIn, PlusCircle, Search, TrendingUp, MessageSquare, Shield, Settings, BadgeDollarSign, Video, Bell, FileText } from 'lucide-react'
import Spline from '@splinetool/react-spline'

// Utils
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('invested:user')
    return raw ? JSON.parse(raw) : null
  })

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (!res.ok) throw new Error((await res.json()).detail || 'Login failed')
    const data = await res.json()
    setUser(data.user)
    localStorage.setItem('invested:user', JSON.stringify(data.user))
  }
  const register = async (payload) => {
    const res = await fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error((await res.json()).detail || 'Register failed')
    const data = await res.json()
    setUser(data.user)
    localStorage.setItem('invested:user', JSON.stringify(data.user))
  }
  const logout = () => {
    setUser(null)
    localStorage.removeItem('invested:user')
  }
  return { user, login, register, logout }
}

function ResetScroll() {
  const location = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [location.pathname])
  return null
}

function LetterAvatar({ name, size = 36 }) {
  const letter = (name || '?').charAt(0).toUpperCase()
  const colors = ['#60a5fa','#34d399','#f472b6','#f59e0b','#22d3ee','#a78bfa']
  const color = colors[(name || '').length % colors.length]
  return (
    <div style={{ width: size, height: size, background: color }} className="rounded-full flex items-center justify-center text-white font-bold">
      {letter}
    </div>
  )
}

function MoneyHandLogo({ size=36 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow">
      <rect x="2" y="10" width="36" height="24" rx="4" fill="#1e40af" stroke="#60a5fa" strokeWidth="2"/>
      <path d="M10 20h20M10 24h12" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 44c4 0 6-2 8-4l8-8c2-2 6-2 8 0s2 6 0 8l-6 6c-2 2-5 4-8 4H18c-3 0-6-1-8-3l-4-4" fill="#0b1220"/>
      <path d="M18 44h14c3 0 6-2 8-4l6-6" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="40" cy="14" r="6" fill="#0ea5e9" stroke="#7dd3fc" strokeWidth="2"/>
      <path d="M40 10v8M36 14h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// Accessible, consistent button component
function AButton({ children, variant='primary', className='', ...props }){
  const base = 'inline-flex items-center justify-center rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'
  const styles = {
    primary: 'bg-white text-black hover:bg-slate-200',
    outline: 'border border-blue-900/60 hover:border-blue-700/80',
    ghost: 'hover:bg-blue-900/30',
  }
  return (
    <button type={props.type || 'button'} {...props} className={`${base} ${styles[variant]} ${className}`}>{children}</button>
  )
}

function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/60 border-b border-blue-900/40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-white">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-700/10 border border-blue-400/30 shadow-inner flex items-center justify-center">
            <MoneyHandLogo size={28} />
          </div>
          <span className="font-semibold tracking-wide">InvestEd</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/explore" className="hover:text-blue-300 flex items-center gap-2"><Search size={16}/>Explore</Link>
          <Link to="/apply" className="hover:text-blue-300 flex items-center gap-2"><PlusCircle size={16}/>Apply</Link>
          <Link to="/forum" className="hover:text-blue-300 flex items-center gap-2"><MessageSquare size={16}/>Community</Link>
          <Link to="/dashboard" className="hover:text-blue-300 flex items-center gap-2"><TrendingUp size={16}/>Dashboard</Link>
          <Link to="/about" className="hover:text-blue-300">About</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/settings" className="p-2 rounded-lg hover:bg-blue-900/30"><Settings size={18}/></Link>
              <AButton onClick={onLogout} className="px-3 py-1.5"><LogOut size={16}/> <span className="ml-1">Logout</span></AButton>
              <Link to="/profile" className="flex items-center gap-2">
                <LetterAvatar name={user.name} />
                <span className="hidden sm:block text-sm opacity-80">{user.name}</span>
              </Link>
            </div>
          ) : (
            <Link to="/auth" className="px-3 py-1.5 rounded-md bg-white text-black text-sm flex items-center gap-2"><LogIn size={16}/>Login</Link>
          )}
          <AButton className="md:hidden p-2" variant="ghost" onClick={() => setOpen(v=>!v)} aria-expanded={open} aria-label="Menu"><Menu/></AButton>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-blue-900/40 px-4 pb-4 text-white text-sm space-y-2">
          <Link onClick={()=>setOpen(false)} to="/explore" className="block py-2">Explore</Link>
          <Link onClick={()=>setOpen(false)} to="/apply" className="block py-2">Apply</Link>
          <Link onClick={()=>setOpen(false)} to="/forum" className="block py-2">Community</Link>
          <Link onClick={()=>setOpen(false)} to="/dashboard" className="block py-2">Dashboard</Link>
          <Link onClick={()=>setOpen(false)} to="/about" className="block py-2">About</Link>
        </div>
      )}
    </header>
  )
}

function Hero() {
  const splineUrl = import.meta.env.VITE_SPLINE_SCENE_URL || ''
  return (
    <section className="relative sm:min-h-[70vh] flex items-center overflow-hidden">
      {/* Background layer: Spline if provided, else animated gradients */}
      {splineUrl ? (
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Spline scene={splineUrl} />
        </div>
      ) : (
        <>
          <style>{`
            @keyframes gradientShift { 0%{ transform: translate3d(0,0,0) scale(1);} 50%{ transform: translate3d(10%, -5%, 0) scale(1.1);} 100%{ transform: translate3d(0,0,0) scale(1);} }
            @keyframes floaty { 0%{ transform: translateY(0) } 50%{ transform: translateY(-20px) } 100%{ transform: translateY(0) } }
          `}</style>
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute -top-32 -right-24 w-[36rem] h-[36rem] rounded-full blur-3xl" style={{ background:'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.35), transparent 60%)', animation:'gradientShift 12s ease-in-out infinite' }}></div>
            <div className="absolute -bottom-32 -left-24 w-[32rem] h-[32rem] rounded-full blur-3xl" style={{ background:'radial-gradient(circle at 70% 70%, rgba(99,102,241,0.35), transparent 60%)', animation:'gradientShift 14s ease-in-out infinite reverse' }}></div>
            <div className="absolute left-1/3 top-10 w-40 h-40 rounded-full bg-blue-500/20 blur-xl" style={{ animation:'floaty 8s ease-in-out infinite' }}></div>
            <div className="absolute right-1/4 bottom-10 w-28 h-28 rounded-full bg-cyan-400/20 blur-xl" style={{ animation:'floaty 10s ease-in-out infinite 1s' }}></div>
          </div>
        </>
      )}
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 text-white">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-4">Invest in Human Potential</h1>
        <p className="text-blue-200/90 max-w-xl mb-8">Sponsor learners and creatives in exchange for a share of future income, project revenue, or success bonuses.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/explore" className="px-5 py-3 rounded-lg bg-white text-black font-medium">Explore Learners</Link>
          <Link to="/apply" className="px-5 py-3 rounded-lg bg-blue-600/90 border border-blue-300/20">Get Funded</Link>
          <Link to="/demo" className="px-5 py-3 rounded-lg border border-blue-300/20">Get Started Now</Link>
        </div>
      </div>
      {/* Dark overlay for contrast and ensure clicks pass through */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90"></div>
    </section>
  )
}

function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Hero />
      <section className="max-w-6xl mx-auto px-4 py-16 grid sm:grid-cols-3 gap-6">
        {["Income Share","Revenue Share","Success Bonus"].map((t,i)=>(
          <div key={i} className="rounded-2xl border border-blue-900/50 bg-gradient-to-b from-slate-900 to-black p-6">
            <BadgeDollarSign className="text-blue-400 mb-3"/>
            <h3 className="text-lg font-semibold mb-2">{t}</h3>
            <p className="text-blue-200/80 text-sm">Flexible return models tailored to your goals. Choose Impact, Profit or Hybrid tiers per investment.</p>
          </div>
        ))}
      </section>
    </div>
  )
}

function AuthPage({ auth }) {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'investor' })
  const submit = async (e)=>{
    e.preventDefault(); setError('')
    try{
      if(isLogin) await auth.login(form.email, form.password)
      else await auth.register(form)
    }catch(err){ setError(err.message) }
  }
  return (
    <div className="min-h-[80vh] bg-black text-white flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-blue-900/50 bg-gradient-to-b from-slate-900 to-black p-6">
        <h2 className="text-2xl font-semibold mb-2">{isLogin? 'Welcome back' : 'Create account'}</h2>
        <p className="text-blue-200/70 mb-6">{isLogin? 'Log in to continue' : 'Join as learner or investor'}</p>
        {!isLogin && (
          <>
            <div className="mb-3">
              <label className="text-sm opacity-80">Full name</label>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2" required/>
            </div>
            <div className="mb-3">
              <label className="text-sm opacity-80">Role</label>
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2">
                <option value="learner">Learner</option>
                <option value="investor">Investor</option>
              </select>
            </div>
          </>
        )}
        <div className="mb-3">
          <label className="text-sm opacity-80">Email</label>
          <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2" required/>
        </div>
        <div className="mb-4">
          <label className="text-sm opacity-80">Password</label>
          <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2" required/>
        </div>
        {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}
        <AButton type="submit" className="w-full py-2">{isLogin? 'Login' : 'Create Account'}</AButton>
        <AButton type="button" onClick={()=>setIsLogin(v=>!v)} variant="outline" className="mt-3 w-full py-2">{isLogin? 'Create new account' : 'I already have an account'}</AButton>
      </form>
    </div>
  )
}

function ExplorePage({ user }) {
  const [list, setList] = useState([])
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)
  const load = async()=>{
    const res = await fetch(`${API_BASE}/learners/explore${q?`?q=${encodeURIComponent(q)}`:''}`)
    const data = await res.json(); setList(data.learners)
  }
  useEffect(()=>{ load() },[])
  return (
    <div className="min-h-[80vh] bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70" size={18}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search learners, skills" className="w-full bg-black border border-blue-900/60 rounded-lg pl-9 pr-3 py-2"/>
          </div>
          <AButton onClick={load} className="px-4 py-2">Search</AButton>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(l=>{
            const remaining = Math.max(0, (l.requested_funding||0) - (l.funded_amount||0))
            const pct = Math.min(100, Math.round(((l.funded_amount||0)/(l.requested_funding||1))*100))
            return (
              <div key={l.id} className="rounded-2xl border border-blue-900/50 bg-gradient-to-b from-slate-900 to-black p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <LetterAvatar name={l.name} />
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-blue-200/70">{(l.skills||[]).slice(0,3).join(' • ')}</div>
                  </div>
                </div>
                <p className="text-sm text-blue-200/80 line-clamp-3 mb-4">{l.project_description}</p>
                <div className="mb-3">
                  <div className="h-2 rounded bg-blue-900/40 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: pct+'%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-blue-200/70">
                    <span>{pct}% funded</span>
                    <span>Remaining ${remaining.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-auto flex gap-2">
                  <AButton onClick={()=>setSelected(l)} className="flex-1 py-2">Invest Now</AButton>
                  <Link to={`/learner/${l.id}`} className="px-4 py-2 rounded-lg border border-blue-900/60">Review</Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {selected && <InvestModal learner={selected} onClose={()=>setSelected(null)} user={user} onDone={()=>{ setSelected(null); load() }} />}
    </div>
  )
}

function InvestModal({ learner, onClose, user, onDone }) {
  const [amount, setAmount] = useState('')
  const [model, setModel] = useState('ISA')
  const [confirming, setConfirming] = useState(false)
  const remaining = Math.max(0, (learner.requested_funding||0) - (learner.funded_amount||0))

  const submit = async ()=>{
    setConfirming(false)
    const res = await fetch(`${API_BASE}/investments`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ investor_id: user?.id || 'guest', learner_id: learner.id, amount: parseFloat(amount), model }) })
    if(!res.ok){ alert((await res.json()).detail || 'Error'); return }
    await res.json(); onDone()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-blue-900/60 bg-gradient-to-b from-slate-900 to-black p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Invest in {learner.name}</h3>
        <p className="text-sm text-blue-200/80 mb-4">Choose amount and model. This action cannot be undone.</p>
        <div className="mb-3">
          <label className="text-sm opacity-80">Amount (max ${remaining.toFixed(2)})</label>
          <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" min="1" step="0.01" className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
        </div>
        <div className="mb-4">
          <label className="text-sm opacity-80">Return Model</label>
          <select value={model} onChange={e=>setModel(e.target.value)} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2">
            <option>ISA</option>
            <option>Revenue</option>
            <option>Bonus</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <AButton onClick={onClose} variant="outline" className="px-4 py-2">Cancel</AButton>
          <AButton onClick={()=>setConfirming(true)} className="px-4 py-2">Review & Confirm</AButton>
        </div>
      </div>
      {confirming && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-blue-900/60 bg-gradient-to-b from-slate-900 to-black p-6 text-white text-center">
            <Shield className="mx-auto mb-3 text-blue-400"/>
            <h4 className="font-semibold mb-2">Are you sure?</h4>
            <p className="text-sm text-blue-200/80 mb-4">This cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <AButton onClick={()=>setConfirming(false)} variant="outline" className="px-4 py-2">Back</AButton>
              <AButton onClick={submit} className="px-4 py-2">Confirm</AButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ApplyPage({ user }) {
  const [form, setForm] = useState({ user_id: user?.id || '', name:'', skills:'', field_of_study:'', project_description:'', requested_funding:1000, investment_terms:'', return_model:'ISA' })
  const [msg, setMsg] = useState('')
  useEffect(()=>{ setForm(f=>({...f,user_id:user?.id||''})) },[user])
  const submit = async (e)=>{
    e.preventDefault(); setMsg('')
    const payload = { ...form, skills: form.skills? form.skills.split(',').map(s=>s.trim()).filter(Boolean): [] }
    const res = await fetch(`${API_BASE}/learners/apply`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    if(!res.ok){ setMsg((await res.json()).detail || 'Error'); return }
    setMsg('Application submitted. You are now visible on Explore.')
  }
  return (
    <div className="min-h-[80vh] bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-2">Learner Application</h2>
        <p className="text-blue-200/80 mb-6">Tell us about your goals to get funded.</p>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm opacity-80">Full name</label>
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
            </div>
            <div>
              <label className="text-sm opacity-80">Field of study</label>
              <select value={form.field_of_study} onChange={e=>setForm({...form,field_of_study:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2">
                {['Art','Business','Computer Science','Design','Education','Engineering','Finance','Health','Law','Marketing','Science','Other'].sort((a,b)=>a.localeCompare(b)).map(opt=> (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          {form.field_of_study==='Other' && (
            <div>
              <label className="text-sm opacity-80">Specify field</label>
              <input value={form.other_field||''} onChange={e=>setForm({...form,other_field:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
            </div>
          )}
          <div>
            <label className="text-sm opacity-80">Skills (comma separated)</label>
            <input value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm opacity-80">Project description</label>
            <textarea required rows={4} value={form.project_description} onChange={e=>setForm({...form,project_description:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm opacity-80">Requested funding ($)</label>
              <input type="number" min="1" step="0.01" value={form.requested_funding} onChange={e=>setForm({...form,requested_funding:parseFloat(e.target.value)})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
            </div>
            <div>
              <label className="text-sm opacity-80">Return model</label>
              <select value={form.return_model} onChange={e=>setForm({...form,return_model:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2">
                <option>ISA</option>
                <option>Revenue</option>
                <option>Bonus</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm opacity-80">Investment terms</label>
            <textarea rows={3} value={form.investment_terms} onChange={e=>setForm({...form,investment_terms:e.target.value})} className="mt-1 w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
          </div>
          {msg && <div className="text-sm text-blue-200/90">{msg}</div>}
          <AButton type="submit" className="px-5 py-3">Submit</AButton>
        </form>
      </div>
    </div>
  )
}

function Dashboard({ user }) {
  const [summary, setSummary] = useState(null)
  const [notifs, setNotifs] = useState([])
  const load = async()=>{
    if(!user) return
    const res = await fetch(`${API_BASE}/investments/portfolio/${user.id}`)
    const data = await res.json(); setSummary(data.summary)
    const nr = await fetch(`${API_BASE}/notifications/${user.id}`)
    if(nr.ok){ const nd = await nr.json(); setNotifs(nd.notifications) }
  }
  useEffect(()=>{ load() },[user])
  return (
    <div className="min-h-[70vh] bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-2">Investor Dashboard</h2>
        <p className="text-blue-200/80 mb-6">Track performance and updates.</p>
        {!user && <div className="text-blue-200/80">Please log in to view your portfolio.</div>}
        {user && summary && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-blue-900/50 p-5 bg-gradient-to-b from-slate-900 to-black">
              <div className="text-sm opacity-80 mb-1">Total Invested</div>
              <div className="text-2xl font-semibold">${summary.total_invested.toFixed(2)}</div>
            </div>
            <div className="rounded-2xl border border-blue-900/50 p-5 bg-gradient-to-b from-slate-900 to-black">
              <div className="text-sm opacity-80 mb-1">ROI</div>
              <div className="text-2xl font-semibold">${summary.roi.toFixed(2)}</div>
            </div>
            <div className="rounded-2xl border border-blue-900/50 p-5 bg-gradient-to-b from-slate-900 to-black">
              <div className="text-sm opacity-80 mb-1">Active Investments</div>
              <div className="text-2xl font-semibold">{summary.active_investments}</div>
            </div>
          </div>
        )}
        {user && (
          <div className="rounded-2xl border border-blue-900/50 p-5 bg-gradient-to-b from-slate-900 to-black">
            <div className="flex items-center gap-2 mb-3"><Bell size={16} className="text-blue-400"/><div className="font-semibold">Notifications</div></div>
            {notifs.length===0 && <div className="text-sm text-blue-200/60">No notifications yet.</div>}
            <div className="space-y-2">
              {notifs.map(n=> (
                <div key={n.id} className="text-sm text-blue-200/90 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white/90">{n.title}</div>
                    <div className="opacity-80">{n.message}</div>
                  </div>
                  <div className="text-xs opacity-60">{new Date(n.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Forum() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ title:'', content:'' })
  const user = JSON.parse(localStorage.getItem('invested:user')||'null')
  const load = async()=>{
    const res = await fetch(`${API_BASE}/forum/posts`)
    const data = await res.json(); setPosts(data.posts)
  }
  useEffect(()=>{ load() },[])
  const submit = async(e)=>{
    e.preventDefault(); if(!user){ alert('Login to post'); return }
    const res = await fetch(`${API_BASE}/forum/posts`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ author_id: user.id, title: form.title, content: form.content })})
    if(res.ok){ setForm({title:'',content:''}); load() }
  }
  const like = async(id)=>{
    await fetch(`${API_BASE}/forum/posts/${id}/like?user_id=${encodeURIComponent(user?.id||'guest')}`, { method:'POST' })
    load()
  }
  const del = async(id)=>{
    if(!confirm('Delete this post?')) return
    await fetch(`${API_BASE}/forum/posts/${id}`, { method:'DELETE' })
    load()
  }
  return (
    <div className="min-h-[80vh] bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Community Forum</h2>
          <Link to="/forum/new" className="text-sm px-3 py-1.5 rounded-md bg-white text-black">New Post</Link>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-blue-900/50 bg-gradient-to-b from-slate-900 to-black p-4 mb-6">
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2 mb-3"/>
          <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} rows={3} placeholder="Share an idea or ask a question" className="w-full bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
          <div className="mt-3 flex justify-end">
            <AButton type="submit" className="px-4 py-2">Post</AButton>
          </div>
        </form>
        <div className="space-y-4">
          {posts.map(p=> (
            <div key={p.id} className="rounded-2xl border border-blue-900/50 bg-gradient-to-b from-slate-900 to-black p-5">
              <div className="flex items-center justify-between mb-2">
                <Link to={`/forum/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                <div className="text-xs text-blue-200/70">{new Date(p.created_at).toLocaleString()}</div>
              </div>
              <p className="text-blue-200/90 text-sm mb-4 whitespace-pre-wrap line-clamp-3">{p.content}</p>
              <div className="flex items-center gap-3 text-sm">
                <AButton onClick={()=>like(p.id)} variant="outline" className="px-3 py-1">Like ({p.like_count||0})</AButton>
                <span className="opacity-70">Views {p.views}</span>
                <AButton onClick={()=>del(p.id)} variant="outline" className="ml-auto text-red-300 px-3 py-1">Delete</AButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ForumPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [replies, setReplies] = useState([])
  const [content, setContent] = useState('')
  const user = useMemo(()=>JSON.parse(localStorage.getItem('invested:user')||'null'), [])
  const load = async()=>{
    const r = await fetch(`${API_BASE}/forum/posts/${id}`)
    if(r.ok){ const d = await r.json(); setPost(d.post); setReplies(d.replies) }
  }
  useEffect(()=>{ load() },[id])
  const addReply = async()=>{
    if(!user){ alert('Login to reply'); return }
    const r = await fetch(`${API_BASE}/forum/posts/${id}/replies`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ author_id: user.id, content }) })
    if(r.ok){ setContent(''); load() }
  }
  if(!post) return <div className="bg-black text-white p-8">Loading...</div>
  return (
    <div className="bg-black text-white min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/forum" className="text-blue-300">← Back</Link>
        <h2 className="text-2xl font-semibold mt-2">{post.title}</h2>
        <div className="text-sm text-blue-200/70">{new Date(post.created_at).toLocaleString()}</div>
        <p className="text-blue-200/90 mt-4 whitespace-pre-wrap">{post.content}</p>
        <div className="mt-8">
          <div className="font-semibold mb-2">Replies</div>
          <div className="space-y-3">
            {replies.map(r=> (
              <div key={r.id} className="border border-blue-900/50 rounded-xl p-3 text-blue-200/90">
                <div className="text-xs opacity-70 mb-1">{new Date(r.created_at).toLocaleString()}</div>
                <div>{r.content}</div>
              </div>
            ))}
            {replies.length===0 && <div className="text-sm text-blue-200/70">No replies yet.</div>}
          </div>
          <div className="mt-4 flex gap-2">
            <input value={content} onChange={e=>setContent(e.target.value)} placeholder="Write a reply" className="flex-1 bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
            <AButton onClick={addReply} className="px-4 py-2">Reply</AButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold mb-4">About Us</h2>
        <p className="text-blue-200/90 leading-relaxed">At InvestEd, we’re redefining the future of education and opportunity by connecting investors with learners and creators. Fund skills, not just degrees — and share in their future success.</p>
      </div>
    </div>
  )
}

function Privacy() {
  const [open, setOpen] = useState({p1:false,p2:false,p3:false})
  const Item = ({ id, title, children }) => (
    <div className="border border-blue-900/50 rounded-xl mb-3">
      <AButton onClick={()=>setOpen(o=>({...o,[id]:!o[id]}))} variant="ghost" className="w-full text-left px-4 py-3">{title}</AButton>
      {open[id] && <div className="px-4 pb-4 text-blue-200/80 text-sm">{children}</div>}
    </div>
  )
  return (
    <div className="bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold mb-6">Privacy Policy</h2>
        <Item id="p1" title="Data We Collect">Account details and usage analytics.</Item>
        <Item id="p2" title="How We Use Data">To facilitate funding and improve recommendations.</Item>
        <Item id="p3" title="Your Choices">Export or delete your account anytime in Settings.</Item>
      </div>
    </div>
  )
}

function Contact() {
  return (
    <div className="bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
        <p className="text-blue-200/80 mb-2">Email: rbahar2010@gmail.com</p>
      </div>
    </div>
  )
}

function Demo() {
  return (
    <div className="bg-black text-white min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center">
        <Video className="mx-auto mb-3 text-blue-400" />
        <h3 className="text-2xl font-semibold mb-2">Demo Video</h3>
        <Link to="/explore" className="inline-block mt-4 px-5 py-3 rounded-lg bg-white text-black">Get Started Now</Link>
      </div>
    </div>
  )
}

function SettingsPage() {
  const user = JSON.parse(localStorage.getItem('invested:user')||'null')
  const [docs, setDocs] = useState([{ type:'passport', url:'' }])

  const submitKYC = async()=>{
    if(!user){ alert('Login required'); return }
    const r = await fetch(`${API_BASE}/kyc/submit/${user.id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ documents: docs }) })
    if(r.ok) alert('KYC submitted')
  }

  return (
    <div className="bg-black text-white min-h-[60vh]">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="rounded-2xl border border-blue-900/50 p-5 bg-gradient-to-b from-slate-900 to-black">
          <div className="flex items-center gap-2 mb-3"><FileText size={18} className="text-blue-400"/><h3 className="font-semibold">KYC</h3></div>
          <div className="space-y-3">
            {docs.map((d,idx)=> (
              <div key={idx} className="grid sm:grid-cols-3 gap-3">
                <select value={d.type} onChange={e=>{ const v=[...docs]; v[idx]={...v[idx], type:e.target.value}; setDocs(v) }} className="bg-black border border-blue-900/60 rounded-lg px-3 py-2">
                  <option value="passport">Passport</option>
                  <option value="driver_license">Driver License</option>
                  <option value="proof_of_address">Proof of Address</option>
                  <option value="selfie">Selfie</option>
                </select>
                <input value={d.url} onChange={e=>{ const v=[...docs]; v[idx]={...v[idx], url:e.target.value}; setDocs(v) }} placeholder="Document URL" className="sm:col-span-2 bg-black border border-blue-900/60 rounded-lg px-3 py-2"/>
              </div>
            ))}
            <div className="flex gap-3">
              <AButton onClick={()=>setDocs(d=>[...d,{ type:'passport', url:'' }])} variant="outline" className="px-3 py-2">Add Document</AButton>
              <AButton onClick={submitKYC} className="px-3 py-2">Submit KYC</AButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LearnerDetail({ user }){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [showInvest, setShowInvest] = useState(false)
  const n = useNavigate()
  const load = async()=>{
    const r = await fetch(`${API_BASE}/learners/${id}`)
    if(r.ok){ const d = await r.json(); setData(d.learner) } else { n('/explore') }
  }
  useEffect(()=>{ load() },[id])
  if(!data) return <div className="bg-black text-white p-8">Loading...</div>
  const remaining = Math.max(0, (data.requested_funding||0) - (data.funded_amount||0))
  const pct = Math.min(100, Math.round(((data.funded_amount||0)/(data.requested_funding||1))*100))
  return (
    <div className="bg-black text-white min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-4">
          <LetterAvatar name={data.name} size={48}/>
          <div>
            <div className="text-2xl font-semibold">{data.name}</div>
            <div className="text-sm text-blue-200/80">{(data.skills||[]).join(' • ')}</div>
          </div>
        </div>
        <p className="text-blue-200/90 mb-6 whitespace-pre-wrap">{data.project_description}</p>
        <div className="mb-4">
          <div className="h-2 rounded bg-blue-900/40 overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: pct+'%' }}></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-blue-200/70">
            <span>{pct}% funded</span>
            <span>Remaining ${remaining.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <AButton onClick={()=>setShowInvest(true)} className="px-5 py-3">Invest Now</AButton>
          <div className="px-5 py-3 rounded-lg border border-blue-900/60">Model: {data.return_model}</div>
        </div>
      </div>
      {showInvest && <InvestModal learner={data} onClose={()=>setShowInvest(false)} user={user} onDone={()=>{ setShowInvest(false); load() }} />}
    </div>
  )
}

function Profile(){
  const user = JSON.parse(localStorage.getItem('invested:user')||'null')
  if(!user){ return <Navigate to="/auth" /> }
  return (
    <div className="bg-black text-white min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-6">
          <LetterAvatar name={user.name} size={56}/>
          <div>
            <div className="text-2xl font-semibold">{user.name}</div>
            <div className="text-blue-200/80">{user.email}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-blue-900/50 p-5 bg-gradient-to-b from-slate-900 to-black">
            <div className="font-semibold mb-2">Role</div>
            <div className="text-blue-200/80 capitalize">{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const auth = useAuth()
  return (
    <div className="min-h-screen bg-black">
      <Navbar user={auth.user} onLogout={auth.logout} />
      <ResetScroll />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={auth.user? <Navigate to="/"/> : <AuthPage auth={auth} />} />
        <Route path="/explore" element={<ExplorePage user={auth.user} />} />
        <Route path="/apply" element={<ApplyPage user={auth.user} />} />
        <Route path="/dashboard" element={<Dashboard user={auth.user} />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:id" element={<ForumPost />} />
        <Route path="/learner/:id" element={<LearnerDetail user={auth.user} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
      <footer className="border-t border-blue-900/40 text-blue-200/70 py-10 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-between">
          <div>© {new Date().getFullYear()} InvestEd</div>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
