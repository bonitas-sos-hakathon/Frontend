import { useEffect, useState } from 'react'

type IconName =
  | 'home'
  | 'children'
  | 'chart'
  | 'cards'
  | 'heart'
  | 'bell'
  | 'arrow'
  | 'play'
  | 'check'
  | 'book'
  | 'shield'
  | 'spark'
  | 'menu'
  | 'close'
  | 'user'
  | 'lock'
  | 'clock'
  | 'plus'

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
  children: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 0 1 5 5v1"/></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
  cards: <><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h6M8 16h4"/></>,
  heart: <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  arrow: <><path d="M19 12H5M12 19l-7-7 7-7"/></>,
  play: <path d="m9 7 8 5-8 5Z"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  book: <><path d="M4 5a3 3 0 0 1 3-3h5v18H7a3 3 0 0 0-3 2Z"/><path d="M20 5a3 3 0 0 0-3-3h-5v18h5a3 3 0 0 1 3 2Z"/></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11"/><path d="m9 12 2 2 4-5"/></>,
  spark: <><path d="m12 3 1.4 4.1L17 9l-3.6 1.9L12 15l-1.4-4.1L7 9l3.6-1.9Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
}

function Icon({ name, size = 22, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const children = [
  { name: 'سارة', age: 8, id: 'LI-24018', score: 780, progress: 68, color: '#08A9E0', initial: 'س' },
  { name: 'آدم', age: 12, id: 'LI-24019', score: 1060, progress: 84, color: '#E2556A', initial: 'أ' },
]

const themes = [
  { title: 'النظافة والصحة الشخصية', short: 'النظافة والصحة', icon: 'spark' as IconName, progress: 82, color: '#08A9E0' },
  { title: 'التربية الاجتماعية', short: 'التربية الاجتماعية', icon: 'heart' as IconName, progress: 64, color: '#E2556A' },
  { title: 'حماية الجسم والتربية الوقائية', short: 'حماية الجسم', icon: 'shield' as IconName, progress: 48, color: '#1D3768' },
]

const nav = [
  { id: 'dashboard', label: 'الرئيسية', icon: 'home' as IconName },
  { id: 'children', label: 'أطفالي', icon: 'children' as IconName },
  { id: 'progress', label: 'التقدّم', icon: 'chart' as IconName },
  { id: 'flashcards', label: 'بطاقات اليوم', icon: 'cards' as IconName },
  { id: 'impact', label: 'أثرنا الجماعي', icon: 'heart' as IconName },
]

function Logo({ light = false }: { light?: boolean }) {
  return <button onClick={() => location.hash = ''} className="flex items-center gap-3 text-right" aria-label="Latino Impact">
    <span className="relative grid h-11 w-11 place-items-center rounded-[15px] bg-[#08A9E0] text-white shadow-[0_8px_20px_rgba(8,169,224,.22)]">
      <Icon name="heart" size={23}/><span className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-[#E2556A] ring-2 ring-white"/>
    </span>
    <span className="leading-none">
      <b className={`block text-[19px] font-black ${light ? 'text-white' : 'text-[#1D3768]'}`}>Latino <span className="text-[#08A9E0]">Impact</span></b>
      <small className={`mt-1 block text-[10px] font-bold ${light ? 'text-[#CFEAF5]' : 'text-[#1D3768]/55'}`}>نتعلّم اليوم لنصنع أثر الغد</small>
    </span>
  </button>
}

function ProgressRing({ value, size = 72 }: { value: number; size?: number }) {
  return <div className="relative grid place-items-center" style={{ width: size, height: size }}>
    <svg className="-rotate-90" width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="16" fill="none" stroke="#CFEAF5" strokeWidth="4"/>
      <circle cx="20" cy="20" r="16" fill="none" stroke="#08A9E0" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${value} ${100-value}`} pathLength="100"/>
    </svg>
    <b className="absolute text-sm text-[#1D3768]">{value}٪</b>
  </div>
}

function Header({ active, onMenu }: { active: string; onMenu: () => void }) {
  return <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#CFEAF5] bg-white/95 px-5 backdrop-blur md:px-9">
    <div className="flex items-center gap-3">
      <button onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-xl bg-[#EFFAFF] text-[#1D3768] lg:hidden"><Icon name="menu"/></button>
      <div>
        <p className="text-xs font-bold text-[#1D3768]/55">مرحباً من جديد،</p>
        <h1 className="text-lg font-black text-[#1D3768]">{active === 'flashcards' ? 'نصيحة اليوم' : active === 'impact' ? 'أثرنا الجماعي' : 'ريم بن يوسف'}</h1>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button className="relative grid h-11 w-11 place-items-center rounded-full bg-[#EFFAFF] text-[#1D3768]"><Icon name="bell" size={20}/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#E2556A] ring-2 ring-white"/></button>
      <button className="flex items-center gap-3 rounded-full border border-[#CFEAF5] py-1.5 pl-4 pr-1.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1D3768] text-sm font-black text-white">ر</span>
        <span className="hidden text-sm font-bold text-[#1D3768] sm:block">حساب الأم</span>
      </button>
    </div>
  </header>
}

function Sidebar({ active, setActive, open, close }: { active: string; setActive: (s:string)=>void; open:boolean; close:()=>void }) {
  return <>
    {open && <button onClick={close} className="fixed inset-0 z-40 bg-[#1D3768]/30 lg:hidden" aria-label="إغلاق القائمة"/>}
    <aside className={`fixed inset-y-0 right-0 z-50 flex w-[270px] flex-col border-l border-[#CFEAF5] bg-white p-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between pb-9 pt-1"><Logo/><button onClick={close} className="lg:hidden"><Icon name="close"/></button></div>
      <nav className="space-y-2">
        {nav.map(item => <button key={item.id} onClick={() => {setActive(item.id); close()}} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-extrabold transition ${active === item.id ? 'bg-[#08A9E0] text-white shadow-[0_8px_22px_rgba(8,169,224,.2)]' : 'text-[#1D3768]/70 hover:bg-[#EFFAFF] hover:text-[#1D3768]'}`}>
          <Icon name={item.icon} size={20}/>{item.label}
          {item.id === 'flashcards' && <span className={`mr-auto grid h-6 min-w-6 place-items-center rounded-full text-[11px] ${active === item.id ? 'bg-white text-[#08A9E0]' : 'bg-[#E2556A] text-white'}`}>1</span>}
        </button>)}
      </nav>
      <div className="mt-auto rounded-3xl bg-[#EFFAFF] p-4 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#E2556A] shadow-sm"><Icon name="heart"/></span>
        <p className="mt-3 text-sm font-black text-[#1D3768]">معاً نصنع الفرق</p>
        <p className="mt-1 text-[11px] leading-5 text-[#1D3768]/55">كل نشاط يكمله طفلك يساهم في أثرنا الجماعي.</p>
      </div>
      <button onClick={() => location.hash='landing'} className="mt-4 text-xs font-extrabold text-[#1D3768]/60 hover:text-[#08A9E0]">العودة إلى الموقع التعريفي</button>
    </aside>
  </>
}

function Dashboard({ setActive }: { setActive: (s:string)=>void }) {
  const [selected, setSelected] = useState(0)
  return <div className="space-y-7">
    <section className="relative overflow-hidden rounded-[32px] bg-[#1D3768] p-7 text-white md:p-9">
      <div className="absolute -left-12 -top-20 h-60 w-60 rounded-full bg-[#08A9E0]/25"/><div className="absolute bottom-[-70px] left-[28%] h-36 w-36 rounded-full border-[28px] border-[#CFEAF5]/10"/>
      <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#CFEAF5]"><Icon name="spark" size={15}/> ملخّص هذا الأسبوع</span>
          <h2 className="mt-4 text-2xl font-black md:text-3xl">تقدّم رائع يا ريم!</h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-white/70">أكمل أطفالك 7 أنشطة تعليمية هذا الأسبوع. استمرّوا في هذا الإيقاع الجميل.</p>
        </div>
        <div className="flex gap-7 rounded-3xl bg-white/10 px-6 py-4 backdrop-blur-sm">
          <div><b className="block text-2xl font-black text-[#CFEAF5]">7</b><span className="text-xs text-white/60">أنشطة مكتملة</span></div>
          <div className="w-px bg-white/15"/><div><b className="block text-2xl font-black text-[#CFEAF5]">+340</b><span className="text-xs text-white/60">نقطة جديدة</span></div>
        </div>
      </div>
    </section>

    <div className="flex items-end justify-between">
      <div><p className="text-xs font-extrabold text-[#08A9E0]">متابعة التعلّم</p><h2 className="mt-1 text-xl font-black text-[#1D3768]">تقدّم أطفالي</h2></div>
      <button onClick={()=>setActive('children')} className="flex items-center gap-1 text-xs font-extrabold text-[#08A9E0]">عرض التفاصيل <Icon name="arrow" size={16}/></button>
    </div>
    <div className="grid gap-4 xl:grid-cols-2">
      {children.map((child, i) => <button onClick={()=>setSelected(i)} key={child.id} className={`group rounded-3xl border bg-white p-5 text-right transition hover:-translate-y-1 hover:shadow-xl ${selected === i ? 'border-[#08A9E0] shadow-[0_12px_35px_rgba(29,55,104,.08)]' : 'border-[#CFEAF5]'}`}>
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] text-xl font-black text-white" style={{background: child.color}}>{child.initial}</span>
          <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="text-lg font-black text-[#1D3768]">{child.name}</h3><span className="rounded-full bg-[#EFFAFF] px-2 py-1 text-[10px] font-bold text-[#1D3768]/60">{child.age} سنوات</span></div><p className="mt-1 text-xs text-[#1D3768]/45">المعرّف: {child.id}</p></div>
          <ProgressRing value={child.progress}/>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EFFAFF]"><div className="h-full rounded-full bg-[#08A9E0]" style={{width:`${child.progress}%`}}/></div>
          <span className="text-xs font-black text-[#1D3768]">{child.score} نقطة</span>
        </div>
      </button>)}
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <section className="rounded-[28px] border border-[#CFEAF5] bg-white p-6">
        <div className="flex items-center justify-between"><div><p className="text-xs font-extrabold text-[#08A9E0]">نظرة حسب المحور</p><h3 className="mt-1 font-black text-[#1D3768]">تقدّم {children[selected].name}</h3></div><span className="rounded-xl bg-[#EFFAFF] px-3 py-2 text-xs font-bold text-[#1D3768]">آخر 30 يوماً</span></div>
        <div className="mt-7 space-y-6">{themes.map(t=><div key={t.title} className="grid grid-cols-[42px_1fr_40px] items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EFFAFF]" style={{color:t.color}}><Icon name={t.icon} size={19}/></span><div><div className="mb-2 flex justify-between"><span className="text-xs font-bold text-[#1D3768]">{t.short}</span><b className="text-xs text-[#1D3768]">{t.progress}٪</b></div><div className="h-2 overflow-hidden rounded-full bg-[#EFFAFF]"><div className="h-full rounded-full" style={{width:`${t.progress}%`, background:t.color}}/></div></div><span className="text-center text-[10px] font-bold text-[#1D3768]/40">3/2<br/>مستوى</span></div>)}</div>
      </section>
      <button onClick={()=>setActive('flashcards')} className="group relative overflow-hidden rounded-[28px] bg-[#E2556A] p-7 text-right text-white shadow-[0_16px_40px_rgba(226,85,106,.2)]">
        <span className="absolute -left-6 -top-8 h-32 w-32 rounded-full bg-white/10"/><span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><Icon name="cards"/></span>
        <p className="relative mt-7 text-xs font-extrabold text-white/70">بطاقة اليوم للأم</p><h3 className="relative mt-2 text-xl font-black leading-8">دقيقة إصغاء تصنع<br/>مساحة أمان</h3>
        <div className="relative mt-7 flex items-center gap-2 text-xs font-extrabold">اكتشفي النصيحة <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#E2556A] transition group-hover:-translate-x-1"><Icon name="arrow" size={16}/></span></div>
      </button>
    </div>
  </div>
}

function Quiz({ exit }: { exit:()=>void }) {
  const [answer, setAnswer] = useState<number | null>(null)
  const [question, setQuestion] = useState(3)
  const answers = ['أبتعد وأخبر شخصاً بالغاً أثق به', 'أبقى صامتاً حتى لا أغضب أحداً', 'أوافق حتى لو شعرت بعدم الراحة', 'لا أتحدث عن الأمر أبداً']
  const next = () => { setQuestion(q => q === 10 ? 1 : q + 1); setAnswer(null) }
  return <div className="min-h-screen bg-[#EFFAFF]" dir="rtl">
    <header className="flex h-20 items-center justify-between border-b border-[#CFEAF5] bg-white px-5 md:px-10"><Logo/><button onClick={exit} className="flex items-center gap-2 rounded-xl bg-[#EFFAFF] px-4 py-2 text-xs font-extrabold text-[#1D3768]"><Icon name="close" size={17}/> خروج آمن</button></header>
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><span className="inline-flex rounded-full bg-[#CFEAF5] px-3 py-1 text-[11px] font-extrabold text-[#1D3768]">العمر 10–15 · المستوى المتوسط</span><h1 className="mt-3 text-xl font-black text-[#1D3768]">حماية جسمي وحدودي الشخصية</h1></div>
        <div className="flex items-center gap-3"><div className="rounded-2xl bg-white px-4 py-2 text-center shadow-sm"><b className="block text-lg text-[#E2556A]">★ 180</b><span className="text-[10px] text-[#1D3768]/50">نجمة</span></div><div className="rounded-2xl bg-white px-4 py-2 text-center shadow-sm"><b className="block text-lg text-[#08A9E0]">{question}/10</b><span className="text-[10px] text-[#1D3768]/50">سؤال</span></div></div>
      </div>
      <div className="mb-7 h-2.5 overflow-hidden rounded-full bg-[#CFEAF5]"><div className="h-full rounded-full bg-[#08A9E0] transition-all" style={{width:`${question*10}%`}}/></div>
      <section className="rounded-[32px] border border-[#CFEAF5] bg-white p-6 shadow-[0_18px_60px_rgba(29,55,104,.08)] md:p-10">
        <div className="flex gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EFFAFF] text-[#1D3768]"><Icon name="shield"/></span><div><p className="text-xs font-extrabold text-[#08A9E0]">اختر الإجابة الأنسب</p><h2 className="mt-2 text-lg font-black leading-8 text-[#1D3768] md:text-2xl">ماذا أفعل إذا طلب مني شخص الاحتفاظ بسرّ جعلني أشعر بالخوف أو عدم الارتياح؟</h2></div></div>
        <div className="mt-8 grid gap-3">{answers.map((a,i)=><button key={a} onClick={()=>setAnswer(i)} className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-right text-sm font-bold transition ${answer === i ? i===0 ? 'border-[#08A9E0] bg-[#EFFAFF] text-[#1D3768]' : 'border-[#E2556A] bg-[#E2556A]/5 text-[#1D3768]' : 'border-[#CFEAF5] text-[#1D3768]/75 hover:border-[#08A9E0]'}`}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black ${answer===i ? i===0 ? 'bg-[#08A9E0] text-white' : 'bg-[#E2556A] text-white' : 'bg-[#EFFAFF] text-[#1D3768]'}`}>{answer===i ? <Icon name={i===0?'check':'close'} size={16}/> : ['أ','ب','ج','د'][i]}</span>{a}</button>)}</div>
        {answer !== null && <div className={`mt-6 rounded-2xl border p-4 ${answer===0?'border-[#08A9E0] bg-[#EFFAFF]':'border-[#E2556A] bg-[#E2556A]/5'}`}>
          <p className={`font-black ${answer===0?'text-[#08A9E0]':'text-[#E2556A]'}`}>{answer===0?'أحسنت! إجابة آمنة وشجاعة':'محاولة جيّدة، فكّر مرة أخرى'}</p>
          <p className="mt-1 text-sm leading-7 text-[#1D3768]/70">من حقّك دائماً أن تبتعد عن أي موقف غير مريح، وأن تخبر أمك أو معلّمك أو شخصاً بالغاً تثق به. الأسرار التي تخيفنا لا يجب أن نحتفظ بها.</p>
        </div>}
        <div className="mt-7 flex items-center justify-between"><button className="text-xs font-extrabold text-[#1D3768]/50">السؤال السابق</button><button disabled={answer===null} onClick={next} className="flex items-center gap-2 rounded-2xl bg-[#1D3768] px-6 py-3 text-sm font-extrabold text-white disabled:opacity-35">السؤال التالي <Icon name="arrow" size={17}/></button></div>
      </section>
      <p className="mt-5 text-center text-xs font-bold text-[#1D3768]/45">تذكّر: جسمي ملكي، ومشاعري مهمّة، ويمكنني دائماً طلب المساعدة.</p>
    </main>
  </div>
}

function Flashcards() {
  const [card, setCard] = useState(0)
  const cards = [
    {tag:'نصيحة تربوية', title:'استمعي قبل أن تجيبي', text:'امنحي طفلك دقيقتين ليحكي دون مقاطعة. الإصغاء الهادئ يساعده على تسمية مشاعره ويقوّي ثقته في الحديث معك.', prompt:'اسأليه اليوم: ما أجمل شيء حدث معك؟ وما الشيء الذي أزعجك؟', color:'#E2556A'},
    {tag:'نشاط مشترك', title:'تحدّي الأيدي النظيفة', text:'اختارا معاً أغنية قصيرة مدتها 20 ثانية وردّداها أثناء غسل اليدين. حوّلا العادة الصحية إلى لحظة مرحة.', prompt:'جرّبا النشاط قبل وجبة العشاء اليوم.', color:'#08A9E0'},
    {tag:'سؤال للحوار', title:'من هم أشخاص الأمان؟', text:'ساعدي طفلك على اختيار ثلاثة بالغين يثق بهم ويمكنه اللجوء إليهم عندما يحتاج إلى المساعدة.', prompt:'اكتبوا الأسماء معاً وعلّقوها في مكان آمن.', color:'#1D3768'},
  ]
  return <div className="space-y-7">
    <div><p className="text-xs font-extrabold text-[#08A9E0]">لحظة صغيرة، أثر كبير</p><h2 className="mt-1 text-2xl font-black text-[#1D3768]">بطاقات يومية للأم</h2><p className="mt-2 text-sm text-[#1D3768]/55">أفكار بسيطة تساعدك على بناء حوار دافئ وآمن مع أطفالك.</p></div>
    <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
      <section className="relative min-h-[440px] overflow-hidden rounded-[36px] p-7 text-white md:p-10" style={{background:cards[card].color}}>
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10"/><div className="absolute -bottom-24 right-16 h-56 w-56 rounded-full border-[35px] border-white/10"/>
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between"><span className="rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold">{cards[card].tag}</span><span className="text-xs font-bold text-white/65">اليوم · 08:00</span></div>
          <span className="mt-12 grid h-16 w-16 place-items-center rounded-[22px] bg-white text-[#E2556A] shadow-xl"><Icon name={card===0?'heart':card===1?'spark':'children'} size={30}/></span>
          <h3 className="mt-7 text-3xl font-black">{cards[card].title}</h3><p className="mt-4 max-w-2xl text-base leading-8 text-white/80">{cards[card].text}</p>
          <div className="mt-7 rounded-2xl bg-white/12 p-4"><p className="text-xs font-black text-white">جرّبي اليوم</p><p className="mt-1 text-sm leading-7 text-white/80">{cards[card].prompt}</p></div>
          <div className="mt-auto flex items-center justify-between pt-8"><div className="flex gap-2">{cards.map((_,i)=><button aria-label={`البطاقة ${i+1}`} key={i} onClick={()=>setCard(i)} className={`h-2 rounded-full bg-white transition-all ${card===i?'w-8':'w-2 opacity-40'}`}/>)}</div><button onClick={()=>setCard((card+1)%cards.length)} className="flex items-center gap-2 text-xs font-extrabold">بطاقة أخرى <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#1D3768]"><Icon name="arrow" size={17}/></span></button></div>
        </div>
      </section>
      <section className="rounded-[30px] border border-[#CFEAF5] bg-white p-6">
        <div className="flex items-center justify-between"><h3 className="font-black text-[#1D3768]">سجلّ النصائح</h3><span className="rounded-lg bg-[#EFFAFF] px-2 py-1 text-[10px] font-bold text-[#1D3768]/60">هذا الأسبوع</span></div>
        <div className="mt-5 space-y-3">{[
          ['أمس','ساعديه على تسمية مشاعره','heart'],
          ['الاثنين','روتين صباحي بلا استعجال','clock'],
          ['الأحد','كيف نعتذر بصدق؟','children'],
          ['السبت','لعبة الألوان الصحية','spark'],
        ].map((x,i)=><button key={i} className="flex w-full items-center gap-3 rounded-2xl border border-[#CFEAF5] p-3 text-right transition hover:bg-[#EFFAFF]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EFFAFF] text-[#08A9E0]"><Icon name={x[2] as IconName} size={18}/></span><span className="flex-1"><b className="block text-sm text-[#1D3768]">{x[1]}</b><small className="text-[10px] text-[#1D3768]/45">{x[0]}</small></span><Icon name="arrow" size={16} className="text-[#1D3768]/30"/></button>)}</div>
        <button className="mt-5 w-full rounded-2xl border border-[#08A9E0] py-3 text-xs font-extrabold text-[#08A9E0]">عرض كل النصائح السابقة</button>
      </section>
    </div>
  </div>
}

function ChildrenPage({ startQuiz }: { startQuiz:()=>void }) {
  return <div className="space-y-7">
    <div className="flex items-end justify-between"><div><p className="text-xs font-extrabold text-[#08A9E0]">إدارة حسابات الأطفال</p><h2 className="mt-1 text-2xl font-black text-[#1D3768]">أطفالي</h2></div><button className="flex items-center gap-2 rounded-2xl bg-[#08A9E0] px-4 py-3 text-xs font-extrabold text-white"><Icon name="plus" size={17}/> إضافة طفل</button></div>
    {children.map((child,i)=><section key={child.id} className="rounded-[30px] border border-[#CFEAF5] bg-white p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center"><span className="grid h-20 w-20 shrink-0 place-items-center rounded-[26px] text-3xl font-black text-white" style={{background:child.color}}>{child.initial}</span><div className="flex-1"><div className="flex flex-wrap items-center gap-3"><h3 className="text-xl font-black text-[#1D3768]">{child.name} بن يوسف</h3><span className="rounded-full bg-[#EFFAFF] px-3 py-1 text-xs font-bold text-[#1D3768]/60">فئة {child.age<10?'4–9':'10–15'} سنة</span></div><p className="mt-2 text-xs text-[#1D3768]/45">المعرّف الخاص: <b className="text-[#1D3768]">{child.id}</b> · رمز دخول من 4 أرقام</p><div className="mt-4 h-2 max-w-lg overflow-hidden rounded-full bg-[#EFFAFF]"><div className="h-full rounded-full bg-[#08A9E0]" style={{width:`${child.progress}%`}}/></div></div><div className="flex gap-5"><div><b className="text-xl text-[#1D3768]">{child.progress}٪</b><small className="block text-[10px] text-[#1D3768]/45">تقدّم عام</small></div><div><b className="text-xl text-[#E2556A]">{child.score}</b><small className="block text-[10px] text-[#1D3768]/45">نقطة</small></div></div></div>
      <div className="mt-6 grid gap-3 border-t border-[#CFEAF5] pt-5 md:grid-cols-3">{themes.map((t,k)=><div key={t.title} className="flex items-center gap-3 rounded-2xl bg-[#EFFAFF] p-3"><Icon name={t.icon} size={18} className="text-[#08A9E0]"/><div className="flex-1"><b className="block text-xs text-[#1D3768]">{t.short}</b><small className="text-[10px] text-[#1D3768]/45">{i===0?['متوسط','مبتدئ','مبتدئ'][k]:['متقدم','متوسط','متوسط'][k]}</small></div><span className="text-xs font-black text-[#1D3768]">{Math.min(98,t.progress+i*10)}٪</span></div>)}</div>
      <button onClick={startQuiz} className="mt-5 flex items-center gap-2 rounded-2xl bg-[#1D3768] px-5 py-3 text-xs font-extrabold text-white"><Icon name="play" size={17}/> فتح مساحة {child.name}</button>
    </section>)}
  </div>
}

function ProgressPage() {
  return <div className="space-y-7"><div><p className="text-xs font-extrabold text-[#08A9E0]">تقارير التعلّم</p><h2 className="mt-1 text-2xl font-black text-[#1D3768]">التقدّم والنتائج</h2></div>
    <div className="grid gap-5 lg:grid-cols-3">{[['18','مستوى مكتمل','check'],['1,840','مجموع النقاط','spark'],['12س 40د','وقت التعلّم','clock']].map(x=><div className="rounded-3xl border border-[#CFEAF5] bg-white p-5"><Icon name={x[2] as IconName} className="text-[#08A9E0]"/><b className="mt-4 block text-2xl text-[#1D3768]">{x[0]}</b><span className="text-xs text-[#1D3768]/50">{x[1]}</span></div>)}</div>
    <section className="rounded-[30px] border border-[#CFEAF5] bg-white p-6"><h3 className="font-black text-[#1D3768]">نشاط آخر 7 أيام</h3><div className="mt-8 flex h-52 items-end justify-between gap-3 border-b border-[#CFEAF5] px-2">{[45,70,38,88,62,95,76].map((v,i)=><div className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full max-w-10 rounded-t-xl bg-[#08A9E0] transition hover:bg-[#E2556A]" style={{height:`${v}%`}}/><span className="text-[10px] font-bold text-[#1D3768]/45">{['س','ح','ن','ث','ر','خ','ج'][i]}</span></div>)}</div></section>
  </div>
}

function Impact() {
  return <div className="space-y-7"><section className="overflow-hidden rounded-[34px] bg-[#1D3768] p-8 text-white"><p className="text-xs font-extrabold text-[#CFEAF5]">معاً نكبر</p><h2 className="mt-2 text-3xl font-black">كل خطوة تصنع أثراً</h2><p className="mt-3 max-w-xl text-sm leading-7 text-white/65">تعلّم أطفالنا اليوم يساهم في مجتمع أكثر وعياً وتضامناً غداً.</p><div className="mt-8 h-4 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-[#08A9E0]"/></div><div className="mt-3 flex justify-between text-xs font-bold"><span>72,450 نشاطاً مكتملاً</span><span className="text-[#CFEAF5]">هدفنا 100,000</span></div></section>
    <div className="grid gap-5 md:grid-cols-3">{[['4,280','طفلاً يتعلّم','children'],['12,640','ساعة تعلّم','clock'],['89','عمل تضامني','heart']].map(x=><div className="rounded-3xl border border-[#CFEAF5] bg-white p-6 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EFFAFF] text-[#08A9E0]"><Icon name={x[2] as IconName}/></span><b className="mt-4 block text-2xl text-[#1D3768]">{x[0]}</b><span className="text-xs text-[#1D3768]/50">{x[1]}</span></div>)}</div>
    <section className="rounded-[30px] border border-[#CFEAF5] bg-white p-6"><h3 className="text-lg font-black text-[#1D3768]">أعمال تضامنية قريبة</h3><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-[#EFFAFF] p-5"><b className="text-[#1D3768]">حقيبة نظافة لكل طفل</b><p className="mt-2 text-xs leading-6 text-[#1D3768]/55">ساهموا بنقاط التعلّم لدعم توزيع حقائب النظافة.</p><button className="mt-4 text-xs font-extrabold text-[#08A9E0]">اعرفي المزيد</button></div><div className="rounded-2xl bg-[#E2556A] p-5 text-white"><b>يوم اللعب والتعلّم</b><p className="mt-2 text-xs leading-6 text-white/75">لقاء عائلي تطوعي في قرية الأطفال.</p><button className="mt-4 text-xs font-extrabold text-white">سجّلي اهتمامك</button></div></div></section>
  </div>
}

function AppShell() {
  const [active, setActive] = useState('dashboard')
  const [menu, setMenu] = useState(false)
  const [quiz, setQuiz] = useState(false)
  if (quiz) return <Quiz exit={()=>setQuiz(false)}/>
  return <div className="min-h-screen bg-[#EFFAFF]" dir="rtl"><Sidebar active={active} setActive={setActive} open={menu} close={()=>setMenu(false)}/><div className="lg:mr-[270px]"><Header active={active} onMenu={()=>setMenu(true)}/><main className="mx-auto max-w-[1300px] p-4 md:p-8">{active==='dashboard'&&<Dashboard setActive={setActive}/>} {active==='children'&&<ChildrenPage startQuiz={()=>setQuiz(true)}/>} {active==='progress'&&<ProgressPage/>} {active==='flashcards'&&<Flashcards/>} {active==='impact'&&<Impact/>}</main></div></div>
}

function Landing() {
  const [login, setLogin] = useState(false)
  const [faq, setFaq] = useState(0)
  return <div dir="rtl" className="min-h-screen bg-white text-[#1D3768]">
    <header className="sticky top-0 z-30 border-b border-[#CFEAF5] bg-white/95 backdrop-blur"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5"><Logo/><nav className="hidden gap-7 text-sm font-bold md:flex"><a href="#mission">رسالتنا</a><a href="#how">كيف نعمل؟</a><a href="#impact">أثرنا</a><a href="#faq">الأسئلة</a></nav><div className="flex gap-2"><button onClick={()=>setLogin(true)} className="rounded-xl border border-[#08A9E0] px-4 py-2 text-xs font-extrabold text-[#08A9E0]">دخول الأم</button><button onClick={()=>location.hash='app'} className="hidden rounded-xl bg-[#1D3768] px-4 py-2 text-xs font-extrabold text-white sm:block">دخول الطفل</button></div></div></header>
    <main>
      <section className="relative overflow-hidden bg-[#EFFAFF]"><div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#CFEAF5]"/><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center lg:py-28"><div className="relative"><span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#08A9E0] shadow-sm"><Icon name="heart" size={15}/> بالتعاون مع قرى الأطفال SOS تونس</span><h1 className="mt-7 text-4xl font-black leading-[1.25] text-[#1D3768] md:text-6xl">أفعال صغيرة،<br/><span className="text-[#08A9E0]">أثر كبير!</span></h1><p className="mt-6 max-w-xl text-base leading-8 text-[#1D3768]/65">مساحة آمنة وممتعة تساعد الأطفال على اكتساب مهارات حياتية، وتمنح الأمهات أدوات بسيطة لمرافقتهم كل يوم.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={()=>setLogin(true)} className="rounded-2xl bg-[#08A9E0] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(8,169,224,.25)]">ابدئي رحلة عائلتك</button><a href="#mission" className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-[#1D3768]"><Icon name="play" size={17}/> اكتشفي المنصة</a></div></div>
        <div className="relative mx-auto w-full max-w-lg"><div className="absolute -right-5 -top-5 h-24 w-24 rounded-[30px] bg-[#E2556A]"/><div className="relative rounded-[40px] border-8 border-white bg-[#1D3768] p-7 shadow-[0_25px_70px_rgba(29,55,104,.2)]"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E2556A] text-xl font-black text-white">س</span><div><b className="text-white">ممتاز يا سارة!</b><p className="text-xs text-white/55">أكملتِ درس اليوم</p></div><b className="mr-auto text-[#CFEAF5]">+50 ★</b></div><div className="mt-7 rounded-3xl bg-white p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EFFAFF] text-[#08A9E0]"><Icon name="shield"/></span><div><b className="text-sm">حدودي الشخصية</b><p className="text-[10px] text-[#1D3768]/45">المستوى الثاني</p></div></div><div className="mt-5 h-2 rounded-full bg-[#EFFAFF]"><div className="h-full w-3/4 rounded-full bg-[#08A9E0]"/></div></div><div className="mt-4 grid grid-cols-3 gap-3">{themes.map(t=><div key={t.title} className="rounded-2xl bg-white/10 p-3 text-center text-white"><Icon name={t.icon} size={20} className="mx-auto text-[#CFEAF5]"/><span className="mt-2 block text-[9px]">{t.short}</span></div>)}</div></div></div></div>
      </section>
      <section id="mission" className="mx-auto max-w-7xl px-5 py-20 text-center"><p className="text-xs font-extrabold text-[#08A9E0]">نتعلّم، نشارك، نؤثّر</p><h2 className="mt-3 text-3xl font-black">رحلة بسيطة تصنع فرقاً حقيقياً</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#1D3768]/55">محتوى تربوي موثوق، مصمّم ليناسب عمر الطفل ويحترم خصوصية كل عائلة.</p><div id="how" className="mt-12 grid gap-5 md:grid-cols-3">{[['تعلّم باللعب','أسئلة وقصص تفاعلية تنمّي المهارات بطريقة ممتعة.','book'],['نتحرّك معاً','أنشطة بسيطة تجمع الأم وطفلها في لحظات ذات معنى.','children'],['نصنع أثراً دائماً','كل تقدّم فردي يساهم في هدف تضامني مشترك.','heart']].map((c,i)=><div className="rounded-[28px] border border-[#CFEAF5] bg-white p-7 text-right transition hover:-translate-y-1 hover:shadow-xl"><span className={`grid h-14 w-14 place-items-center rounded-2xl text-white ${i===0?'bg-[#08A9E0]':i===1?'bg-[#E2556A]':'bg-[#1D3768]'}`}><Icon name={c[2] as IconName}/></span><h3 className="mt-5 text-lg font-black">{c[0]}</h3><p className="mt-2 text-sm leading-7 text-[#1D3768]/55">{c[1]}</p></div>)}</div></section>
      <section id="impact" className="bg-[#1D3768] py-16 text-white"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 text-center md:grid-cols-4">{[['4,280','طفلاً مشاركاً'],['72,450','نشاطاً مكتملاً'],['1,930','أماً مرافقة'],['89','مبادرة تضامنية']].map(x=><div><b className="text-3xl font-black text-[#CFEAF5] md:text-4xl">{x[0]}</b><span className="mt-2 block text-xs text-white/55">{x[1]}</span></div>)}</div></section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center"><div><p className="text-xs font-extrabold text-[#E2556A]">شاركي معنا</p><h2 className="mt-3 text-3xl font-black">كوني جزءاً من الأثر</h2><p className="mt-4 text-sm leading-7 text-[#1D3768]/55">سجّلي اهتمامك وسيتواصل معك فريقنا لمساعدتك على بدء الرحلة.</p></div><form onSubmit={e=>e.preventDefault()} className="grid gap-3 rounded-[30px] bg-[#EFFAFF] p-6 sm:grid-cols-2"><input placeholder="الاسم واللقب" className="rounded-2xl border border-[#CFEAF5] bg-white px-4 py-3 text-sm outline-none focus:border-[#08A9E0]"/><input placeholder="رقم الهاتف" className="rounded-2xl border border-[#CFEAF5] bg-white px-4 py-3 text-sm outline-none focus:border-[#08A9E0]"/><input placeholder="البريد الإلكتروني" className="rounded-2xl border border-[#CFEAF5] bg-white px-4 py-3 text-sm outline-none focus:border-[#08A9E0] sm:col-span-2"/><button className="rounded-2xl bg-[#E2556A] py-3 text-sm font-extrabold text-white sm:col-span-2">أرسل طلبي</button></form></section>
      <section id="faq" className="bg-[#EFFAFF] py-20"><div className="mx-auto max-w-3xl px-5"><div className="text-center"><p className="text-xs font-extrabold text-[#08A9E0]">لديك سؤال؟</p><h2 className="mt-2 text-3xl font-black">أسئلة متكرّرة</h2></div><div className="mt-9 space-y-3">{['هل المحتوى مناسب لعمر طفلي؟','كيف أحصل على معرّف خاص لكل طفل؟','كيف تتم حماية بيانات عائلتي؟'].map((q,i)=><button onClick={()=>setFaq(faq===i?-1:i)} className="w-full rounded-2xl border border-[#CFEAF5] bg-white p-5 text-right"><div className="flex justify-between font-extrabold">{q}<span className="text-[#08A9E0]">{faq===i?'−':'+'}</span></div>{faq===i&&<p className="mt-3 text-sm leading-7 text-[#1D3768]/55">{i===0?'نعم، المحتوى مقسّم إلى فئتين عمريتين 4–9 و10–15، مع مستويات متدرّجة وشروحات واضحة وغير صريحة.':i===1?'بعد تسجيل حساب الأم، يمكنك إضافة أكثر من طفل والحصول على معرّف فريد ورمز PIN من أربعة أرقام لكل منهم.':'نستخدم بيانات تجريبية في هذا النموذج، وفي النسخة الكاملة تُعتمد معايير الخصوصية وحماية بيانات الأطفال.'}</p>}</button>)}</div></div></section>
    </main>
    <footer className="bg-white py-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 md:flex-row"><Logo/><p className="text-xs text-[#1D3768]/45">مشروع تضامني لفائدة قرى الأطفال SOS تونس · بيانات هذا النموذج تجريبية</p></div></footer>
    {login&&<div className="fixed inset-0 z-50 grid place-items-center bg-[#1D3768]/55 p-4"><button className="absolute inset-0" onClick={()=>setLogin(false)} aria-label="إغلاق"/><div className="relative w-full max-w-md rounded-[32px] bg-white p-7 shadow-2xl"><button onClick={()=>setLogin(false)} className="absolute left-5 top-5 text-[#1D3768]/50"><Icon name="close"/></button><Logo/><h2 className="mt-8 text-2xl font-black">مرحباً بعودتك</h2><p className="mt-2 text-sm text-[#1D3768]/50">ادخلي إلى لوحة متابعة أطفالك.</p><label className="mt-6 block text-xs font-bold">رقم بطاقة التعريف الوطنية</label><div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#CFEAF5] px-4"><Icon name="user" size={18} className="text-[#08A9E0]"/><input defaultValue="07234567" className="w-full py-3 outline-none"/></div><label className="mt-4 block text-xs font-bold">كلمة المرور</label><div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#CFEAF5] px-4"><Icon name="lock" size={18} className="text-[#08A9E0]"/><input type="password" defaultValue="password" className="w-full py-3 outline-none"/></div><button onClick={()=>location.hash='app'} className="mt-6 w-full rounded-2xl bg-[#08A9E0] py-3.5 text-sm font-extrabold text-white">تسجيل الدخول</button><button className="mt-4 w-full text-xs font-bold text-[#1D3768]/50">نسيت كلمة المرور؟</button></div></div>}
  </div>
}

export default function App() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const handler = () => setHash(location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  return hash === '#landing' || hash === '' ? <Landing/> : <AppShell/>
}
