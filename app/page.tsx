'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Droplets,
  HeartPulse,
  Home,
  Info,
  Leaf,
  Menu,
  Moon,
  MoreHorizontal,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  UserRound,
  Utensils,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const defaultForm = {
  age: '42',
  bmi: '26.4',
  systolic: '128',
  activity: '3',
  sleep: '7',
  smoking: 'No',
  familyHistory: 'Yes',
}

type FormState = typeof defaultForm

function RiskRing({ score }: { score: number }) {
  const radius = 62
  const circumference = 2 * Math.PI * radius
  const dash = circumference * (score / 100)
  return (
    <div className="relative flex size-40 items-center justify-center">
      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth="12" className="text-[#e5eee9]" />
        <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="text-[#4b9079]" strokeDasharray={`${dash} ${circumference - dash}`} />
      </svg>
      <div className="relative text-center">
        <div className="font-serif text-4xl font-semibold tracking-tight text-[#173f34]">{score}%</div>
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#709287]">10-year risk</div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, note, tone = 'green' }: { icon: typeof Activity; label: string; value: string; note: string; tone?: 'green' | 'amber' | 'blue' }) {
  const toneStyles = {
    green: 'bg-[#f0f7f2] text-[#4b9079]',
    amber: 'bg-[#fbf5e8] text-[#b58a3b]',
    blue: 'bg-[#eef5f6] text-[#4c7f86]',
  }
  return (
    <div className="rounded-2xl border border-[#e2e9e4] bg-white p-4 shadow-[0_2px_12px_rgba(36,77,59,0.03)]">
      <div className="flex items-start justify-between gap-2">
        <div className={`flex size-9 items-center justify-center rounded-xl ${toneStyles[tone]}`}><Icon /></div>
        <MoreHorizontal className="size-4 text-[#a1b1aa]" />
      </div>
      <div className="mt-4 text-xs font-medium text-[#799088]">{label}</div>
      <div className="mt-1 flex items-baseline gap-2"><span className="font-serif text-2xl font-semibold text-[#173f34]">{value}</span><span className="text-[11px] text-[#81958c]">{note}</span></div>
    </div>
  )
}

export default function Page() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState(false)

  const score = useMemo(() => {
    const bmi = Number(form.bmi) || 0
    const age = Number(form.age) || 0
    const systolic = Number(form.systolic) || 0
    const activity = Number(form.activity) || 0
    let result = 8 + Math.max(0, age - 35) * 0.35 + Math.max(0, bmi - 22) * 1.2 + Math.max(0, systolic - 115) * 0.08
    result += form.smoking === 'Yes' ? 5 : 0
    result += form.familyHistory === 'Yes' ? 3 : 0
    result -= Math.min(activity, 7) * 0.45
    return Math.max(3, Math.min(39, Math.round(result)))
  }, [form])

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const riskLabel = score < 12 ? 'Low' : score < 20 ? 'Moderate' : 'Elevated'

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#173f34]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[242px] flex-col border-r border-[#e4ece6] bg-[#fbfdfb] px-5 py-6 lg:flex">
        <div className="flex items-center gap-3 px-2"><div className="flex size-9 items-center justify-center rounded-xl bg-[#dceee4] text-[#397b65]"><HeartPulse className="size-5" /></div><span className="font-serif text-xl font-semibold tracking-tight">well<span className="text-[#4b9079]">mark</span></span></div>
        <div className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9aaca3]">Workspace</div>
        <nav className="mt-3 flex flex-col gap-1" aria-label="Main navigation">
          <a className="flex items-center gap-3 rounded-xl bg-[#e6f2eb] px-3 py-2.5 text-sm font-semibold text-[#2d725b]" href="#overview"><Home className="size-[17px]" />Overview</a>
          <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#769088] hover:bg-[#f0f6f2]" href="#assessment"><Activity className="size-[17px]" />My assessment</a>
          <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#769088] hover:bg-[#f0f6f2]" href="#recommendations"><Sparkles className="size-[17px]" />Recommendations</a>
          <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#769088] hover:bg-[#f0f6f2]" href="#history"><CalendarDays className="size-[17px]" />History</a>
        </nav>
        <div className="mt-auto rounded-2xl bg-[#eff7f1] p-4"><div className="flex size-8 items-center justify-center rounded-lg bg-white text-[#4b9079]"><ShieldCheck className="size-4" /></div><p className="mt-3 text-xs font-semibold text-[#2d604f]">Your data is private</p><p className="mt-1 text-[11px] leading-relaxed text-[#77968a]">Only you can see your health information.</p><button className="mt-3 text-[11px] font-bold text-[#4b9079]">Learn more <ArrowRight className="ml-1 inline size-3" /></button></div>
        <div className="mt-5 flex items-center gap-3 border-t border-[#e7eee9] pt-5"><div className="flex size-8 items-center justify-center rounded-full bg-[#dce9e0] text-xs font-semibold text-[#397b65]">JD</div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">Jordan Davis</div><div className="text-[11px] text-[#91a49b]">Personal plan</div></div><ChevronDown className="size-4 text-[#8fa198]" /></div>
      </aside>

      <div className="lg:pl-[242px]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#e7eee9] bg-[#fbfdfb]/90 px-5 backdrop-blur lg:px-10"><div className="flex items-center gap-3"><button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><Menu /></button><div><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#91a49b]">Monday, October 14, 2024</div><h1 className="mt-1 font-serif text-xl font-semibold tracking-tight text-[#173f34]">Good morning, Jordan</h1></div></div><div className="flex items-center gap-3"><button className="relative flex size-9 items-center justify-center rounded-full border border-[#e1e9e4] bg-white text-[#799088]" aria-label="Notifications"><Bell className="size-4" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#d58c67]" /></button><button className="flex items-center gap-2 rounded-full border border-[#e1e9e4] bg-white py-1.5 pl-1.5 pr-3 text-xs font-semibold"><span className="flex size-6 items-center justify-center rounded-full bg-[#dce9e0] text-[10px] text-[#397b65]">JD</span><span className="hidden sm:inline">Jordan</span><ChevronDown className="size-3 text-[#90a29a]" /></button></div></header>

        {menuOpen && <div className="border-b border-[#e7eee9] bg-white px-5 py-3 lg:hidden"><nav className="flex flex-wrap gap-2 text-xs font-semibold text-[#397b65]"><a href="#overview" onClick={() => setMenuOpen(false)}>Overview</a><a href="#assessment" onClick={() => setMenuOpen(false)}>Assessment</a><a href="#recommendations" onClick={() => setMenuOpen(false)}>Recommendations</a></nav></div>}

        <div className="mx-auto max-w-[1280px] px-5 py-7 lg:px-10 lg:py-9">
          <section id="overview" className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="flex items-center gap-2 text-xs font-semibold text-[#4b9079]"><span className="size-2 rounded-full bg-[#65aa8b]" />Last assessment · Today at 9:42 AM</div><h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#173f34] sm:text-5xl">Your health at a glance</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-[#789088]">Small, consistent choices today can make a meaningful difference to your health tomorrow.</p></div><Button variant="outline" className="w-fit rounded-full border-[#dce7df] bg-white text-xs font-semibold text-[#397b65] shadow-none hover:bg-[#f0f7f2]" onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })}><Activity data-icon="inline-start" />Update assessment</Button></section>

          <section className="mt-8 grid gap-4 xl:grid-cols-[1.35fr_1fr_1fr]">
            <div className="rounded-2xl border border-[#dfeae2] bg-[#eaf5ed] p-6 sm:p-7"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#4b9079]"><Target className="size-4" />Overall risk</div><h3 className="mt-4 font-serif text-2xl font-semibold text-[#173f34]">You're on a healthy path</h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-[#648078]">Your current profile suggests a lower likelihood of developing type 2 diabetes or cardiovascular disease.</p></div><RiskRing score={score} /></div><div className="mt-5 flex items-center gap-2 border-t border-[#d2e6d8] pt-4 text-xs font-medium text-[#5e8173]"><Info className="size-3.5" />This is an estimate, not a medical diagnosis.</div></div>
            <StatCard icon={TrendingDown} label="Risk trend" value="-4.2%" note="vs. last month" tone="green" />
            <StatCard icon={Zap} label="Health score" value="78" note="out of 100" tone="amber" />
          </section>

          <section id="assessment" className="mt-10 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-2xl border border-[#e2e9e4] bg-white p-6 shadow-[0_2px_12px_rgba(36,77,59,0.03)] sm:p-7"><div className="flex items-start justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ca098]">01 / Your inputs</div><h3 className="mt-2 font-serif text-2xl font-semibold">Personalize your estimate</h3><p className="mt-1 text-sm text-[#83968e]">Use your latest numbers for a more relevant snapshot.</p></div><button className="text-[#9aaca3]" aria-label="Help"><CircleHelp className="size-5" /></button></div><div className="mt-7 grid gap-x-5 gap-y-5 sm:grid-cols-2"><label className="text-xs font-semibold text-[#526d63]">Age <div className="mt-2 flex items-center rounded-xl border border-[#e0e9e3] bg-[#fbfdfb] px-3 focus-within:border-[#76aa93]"><input value={form.age} onChange={(e) => update('age', e.target.value)} className="w-full bg-transparent py-3 text-sm font-semibold outline-none" inputMode="numeric" /><span className="text-xs text-[#99aaa2]">years</span></div></label><label className="text-xs font-semibold text-[#526d63]">BMI <div className="mt-2 flex items-center rounded-xl border border-[#e0e9e3] bg-[#fbfdfb] px-3"><input value={form.bmi} onChange={(e) => update('bmi', e.target.value)} className="w-full bg-transparent py-3 text-sm font-semibold outline-none" inputMode="decimal" /><span className="text-xs text-[#99aaa2]">kg/m²</span></div></label><label className="text-xs font-semibold text-[#526d63]">Systolic blood pressure <div className="mt-2 flex items-center rounded-xl border border-[#e0e9e3] bg-[#fbfdfb] px-3"><input value={form.systolic} onChange={(e) => update('systolic', e.target.value)} className="w-full bg-transparent py-3 text-sm font-semibold outline-none" inputMode="numeric" /><span className="text-xs text-[#99aaa2]">mmHg</span></div></label><label className="text-xs font-semibold text-[#526d63]">Weekly activity <div className="mt-2 flex items-center rounded-xl border border-[#e0e9e3] bg-[#fbfdfb] px-3"><input value={form.activity} onChange={(e) => update('activity', e.target.value)} className="w-full bg-transparent py-3 text-sm font-semibold outline-none" inputMode="numeric" /><span className="text-xs text-[#99aaa2]">hours</span></div></label><label className="text-xs font-semibold text-[#526d63]">Average sleep <div className="mt-2 flex items-center rounded-xl border border-[#e0e9e3] bg-[#fbfdfb] px-3"><input value={form.sleep} onChange={(e) => update('sleep', e.target.value)} className="w-full bg-transparent py-3 text-sm font-semibold outline-none" inputMode="numeric" /><span className="text-xs text-[#99aaa2]">hours/night</span></div></label><label className="text-xs font-semibold text-[#526d63]">Do you smoke? <div className="mt-2 flex gap-2">{['No', 'Yes'].map((option) => <button type="button" key={option} onClick={() => update('smoking', option)} className={`flex-1 rounded-xl border py-3 text-xs font-semibold transition ${form.smoking === option ? 'border-[#6aab91] bg-[#eaf5ed] text-[#397b65]' : 'border-[#e0e9e3] text-[#82968d]'}`}>{option}</button>)}</div></label></div><div className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-[#edf1ed] pt-5 sm:flex-row sm:items-center"><label className="flex items-center gap-3 text-xs text-[#718980]"><button type="button" onClick={() => update('familyHistory', form.familyHistory === 'Yes' ? 'No' : 'Yes')} className={`flex size-5 items-center justify-center rounded-md border ${form.familyHistory === 'Yes' ? 'border-[#5c9d82] bg-[#5c9d82] text-white' : 'border-[#ccd9d1]'}`} aria-label="Toggle family history">{form.familyHistory === 'Yes' && <Check className="size-3.5" />}</button><span>Family history of diabetes or heart disease</span></label><Button className="w-full rounded-full bg-[#397b65] px-6 text-xs font-semibold hover:bg-[#2d604f] sm:w-auto" onClick={() => { setToast(true); setTimeout(() => setToast(false), 2500) }}>Recalculate risk <ArrowRight data-icon="inline-end" /></Button></div></div>

            <div id="recommendations" className="rounded-2xl border border-[#e2e9e4] bg-[#fdfcf8] p-6 sm:p-7"><div className="flex items-start justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b18b4e]">02 / Your focus areas</div><h3 className="mt-2 font-serif text-2xl font-semibold">Personalized for you</h3></div><Sparkles className="size-5 text-[#c3a269]" /></div><div className="mt-7 flex flex-col gap-5"><div className="flex gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f8efd9] text-[#ba8f45]"><Utensils className="size-4" /></div><div><div className="flex items-center gap-2 text-sm font-semibold">Add more fiber <span className="rounded-full bg-[#f8efd9] px-2 py-0.5 text-[10px] font-bold text-[#a77f3c]">High impact</span></div><p className="mt-1 text-xs leading-relaxed text-[#81928a]">Try adding beans, oats, or an extra serving of vegetables each day.</p></div></div><div className="flex gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#e7f2ed] text-[#4b9079]"><Activity className="size-4" /></div><div><div className="text-sm font-semibold">Keep moving consistently</div><p className="mt-1 text-xs leading-relaxed text-[#81928a]">You're close to the 150-minute weekly activity goal. Keep it going.</p></div></div><div className="flex gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf2f4] text-[#4c7f86]"><Moon className="size-4" /></div><div><div className="text-sm font-semibold">Protect your sleep</div><p className="mt-1 text-xs leading-relaxed text-[#81928a]">A consistent sleep schedule supports blood pressure and metabolic health.</p></div></div></div><button className="mt-6 flex w-full items-center justify-between rounded-xl border border-[#e9e5d8] bg-white px-4 py-3 text-xs font-bold text-[#a47c3c] hover:bg-[#fffdf5]">View all recommendations <ArrowRight className="size-4" /></button></div>
          </section>

          <section id="history" className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.7fr]"><div className="rounded-2xl border border-[#e2e9e4] bg-white p-6 sm:p-7"><div className="flex items-center justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ca098]">Your journey</div><h3 className="mt-2 font-serif text-2xl font-semibold">Risk over time</h3></div><button className="rounded-lg border border-[#e2e9e4] px-3 py-2 text-xs font-semibold text-[#6f877e]">Last 6 months <ChevronDown className="ml-1 inline size-3" /></button></div><div className="mt-8"><div className="flex h-36 items-end gap-2 border-b border-[#e5ede7] px-2 pb-0 sm:gap-4"><div className="h-[58%] flex-1 rounded-t-lg bg-[#cfe5d6]" /><div className="h-[52%] flex-1 rounded-t-lg bg-[#cfe5d6]" /><div className="h-[49%] flex-1 rounded-t-lg bg-[#b9dac5]" /><div className="h-[44%] flex-1 rounded-t-lg bg-[#a6cfb5]" /><div className="h-[39%] flex-1 rounded-t-lg bg-[#8fc2a3]" /><div className="relative h-[33%] flex-1 rounded-t-lg bg-[#4b9079]"><span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-[#173f34] px-2 py-1 text-[10px] font-bold text-white">{score}%</span></div></div><div className="mt-3 flex justify-between px-1 text-[10px] font-medium text-[#9aaca3]"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div></div></div><div className="rounded-2xl bg-[#173f34] p-6 text-[#eaf5ed] sm:p-7"><div className="flex size-10 items-center justify-center rounded-xl bg-[#2b5c4d] text-[#b9dec8]"><Leaf className="size-5" /></div><h3 className="mt-5 font-serif text-2xl font-semibold">A healthier you is built daily.</h3><p className="mt-2 text-sm leading-relaxed text-[#acc9ba]">Health isn't a pass or fail test. It's the small actions you repeat over time.</p><button className="mt-6 flex items-center gap-2 text-xs font-bold text-[#b9dec8]">Explore healthy habits <ArrowRight className="size-4" /></button></div></section>
          <p className="mt-8 flex items-center justify-center gap-2 pb-4 text-center text-[11px] text-[#99aaa2]"><ShieldCheck className="size-3.5" /> Wellmark provides educational estimates and does not replace care from a licensed medical professional.</p>
        </div>
      </div>
      {toast && <div className="fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-xl bg-[#173f34] px-4 py-3 text-xs font-semibold text-white shadow-lg"><Check className="size-4 text-[#a9d7ba]" /> Risk profile updated <button onClick={() => setToast(false)} aria-label="Dismiss"><X className="size-3.5 text-[#a9c8b7]" /></button></div>}
    </main>
  )
}
