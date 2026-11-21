import React, { useEffect, useState } from 'react';
import {
  Home as HomeIcon, Users, BookOpen, HeartHandshake, Menu, X,
  LogIn, LogOut, Plus, ArrowLeft, RefreshCw
} from 'lucide-react';
import { supabase, isConfigured } from './lib/supabaseClient';
import './styles.css';

const emptyMessage = 'لا توجد بيانات بعد. ستظهر هنا المعلومات عند تسجيلها فعليًا.';

function Card({ children, className = '' }) {
  return <div className={`rounded-3xl bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}
function Progress({ value }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className="h-2.5 bg-lightblue rounded-full overflow-hidden"><div className="h-full bg-cyan rounded-full" style={{ width: `${v}%` }} /></div>;
}

// Tous les appels métier passent par les Edge Functions.
async function callFunction(name, body, headers = {}) {
  const { data, error } = await supabase.functions.invoke(name, { body, headers });
  if (error) {
    let message = error.message || 'Erreur lors de la communication avec le serveur.';
    try {
      const response = error.context;
      if (response && typeof response.json === 'function') {
        const payload = await response.json();
        if (payload?.error) message = payload.error;
      }
    } catch { /* conserver le message initial */ }
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

function App() {
  const [page, setPage] = useState('home');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [parentCin, setParentCin] = useState('');
  const [children, setChildren] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [childToken, setChildToken] = useState('');
  const [availableThemes, setAvailableThemes] = useState([]);
  const [menu, setMenu] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answeredBefore, setAnsweredBefore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [result, setResult] = useState(null);
  const [report, setReport] = useState(null);
  const [dailyTip, setDailyTip] = useState(null);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  };
  const go = (nextPage) => {
    setPage(nextPage);
    setMenu(false);
    setError('');
  };

  const loadParentData = async () => {
    const data = await callFunction('get-parent-dashboard', {});
    setProfile(data.parent);
    setParentCin(data.parent?.cin || '');
    setChildren(data.children || []);
    setAttempts(data.attempts || []);
    try {
      const tipData = await callFunction('get-daily-parenting-tip', {});
      setDailyTip(tipData.tip || null);
    } catch (tipError) {
      console.warn('Daily parenting tip:', tipError.message);
      setDailyTip(null);
    }
  };

  useEffect(() => {
    if (!isConfigured || !supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      if (currentSession) {
        try { await loadParentData(); }
        catch (e) { setError(e.message); }
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (!currentSession) {
        setProfile(null);
        setChildren([]);
        setAttempts([]);
        setParentCin('');
        setActiveChild(null);
        setChildToken('');
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (cin, password) => {
    setLoading(true);
    setError('');
    try {
      const data = await callFunction('parent-login', { cin, password });
      if (!data.session?.access_token || !data.session?.refresh_token) {
        throw new Error('La connexion a réussi, mais la session Supabase est absente.');
      }
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      if (sessionError) throw sessionError;
      setParentCin(cin);
      setProfile(data.parent);
      await loadParentData();
      setAuthOpen(false);
      notify('تم تسجيل الدخول بنجاح');
      go('mother');
    } catch (e) {
      setError(e.message || 'تعذّر تسجيل الدخول. تحققي من CIN وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name, cin, password) => {
    setLoading(true);
    setError('');
    try {
      await callFunction('parent-register', {
        full_name: name,
        cin,
        password,
      });
      // parent-register crée le compte mais ne renvoie pas de session.
      await signIn(cin, password);
    } catch (e) {
      setError(e.message || 'حدث خطأ أثناء إنشاء الحساب.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (childToken) {
        await callFunction('child-logout', {}, { 'x-child-session': childToken });
      }
    } catch (e) {
      console.warn('Child logout:', e.message);
    }
    setChildToken('');
    setActiveChild(null);
    await supabase.auth.signOut();
    go('home');
  };

  const addChild = async (displayName, pin) => {
    setLoading(true);
    setError('');
    try {
      await callFunction('create-child', { display_name: displayName, pin });
      await loadParentData();
      notify('تمت إضافة الطفل بنجاح');
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const childLogin = async (childId, pin) => {
    setLoading(true);
    setError('');
    try {
      if (!parentCin) throw new Error('أعيدي تسجيل الدخول إلى حساب الأم أولًا.');
      const data = await callFunction('child-login', {
        cin: parentCin,
        child_id: childId,
        pin,
      });
      setActiveChild(data.child);
      setChildToken(data.token);
      const available = await callFunction(
        'get-available-quizzes',
        {},
        { 'x-child-session': data.token }
      );
      setAvailableThemes(available.themes || []);
      go('child');
      return true;
    } catch (e) {
      setError(e.message || 'تعذّر تسجيل دخول الطفل.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutChild = async () => {
    try {
      if (childToken) await callFunction('child-logout', {}, { 'x-child-session': childToken });
    } catch (e) {
      console.warn(e);
    }
    setChildToken('');
    setActiveChild(null);
    setAvailableThemes([]);
    go('child');
  };

  const startQuiz = async (selectedQuiz) => {
    if (!childToken || !activeChild) {
      setError('سجّلي دخول الطفل أولًا.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const authHeaders = { 'x-child-session': childToken };
      const started = await callFunction('start-quiz', { quiz_id: selectedQuiz.id }, authHeaders);
      const id = started.attempt.id;
      const [quizData, resumeData] = await Promise.all([
        callFunction('get-quiz-questions', { quiz_id: selectedQuiz.id }, authHeaders),
        callFunction('resume-quiz', { attempt_id: id }, authHeaders),
      ]);
      const remaining = resumeData.unanswered_questions || [];
      if (!remaining.length) {
        const completed = await callFunction('complete-quiz', { attempt_id: id }, authHeaders);
        setResult(completed);
        setQuiz({ ...selectedQuiz, themeName: selectedQuiz.themeName });
        setAttemptId(id);
        go('result');
        return;
      }
      setQuiz({
        ...selectedQuiz,
        themeName: selectedQuiz.themeName,
        quizTitle: quizData.quiz?.title || selectedQuiz.title,
      });
      setAttemptId(id);
      setQuestions(remaining);
      setQuestionIndex(0);
      setSelectedOption(null);
      setAnsweredBefore(resumeData.progress?.answered || 0);
      setTotalQuestions(resumeData.progress?.total || quizData.questions?.length || remaining.length);
      setResult(null);
      go('quiz');
    } catch (e) {
      setError(e.message || 'تعذّر démarrer le quiz.');
    } finally {
      setLoading(false);
    }
  };

  const chooseOption = async (optionId) => {
    if (selectedOption || !questions[questionIndex]) return;
    setLoading(true);
    setError('');
    try {
      await callFunction('save-answer', {
        attempt_id: attemptId,
        question_id: questions[questionIndex].id,
        selected_option_id: optionId,
      }, { 'x-child-session': childToken });
      setSelectedOption(optionId);
    } catch (e) {
      setError(e.message || 'لم يتم حفظ الإجابة. حاولي مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (!selectedOption) return;
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelectedOption(null);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const completed = await callFunction(
        'complete-quiz',
        { attempt_id: attemptId },
        { 'x-child-session': childToken }
      );
      setResult(completed);
      go('result');
      if (session) await loadParentData();
    } catch (e) {
      setError(e.message || 'تعذّر terminer le quiz.');
    } finally {
      setLoading(false);
    }
  };

  const openReport = async (childId, id) => {
    setLoading(true);
    setError('');
    try {
      const data = await callFunction('get-child-report', {
        child_id: childId,
        attempt_id: id,
      });
      setReport(data);
      go('report');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const nav = [
    ['home', 'الرئيسية', HomeIcon],
    ['mother', 'فضاء الأم', Users],
    ['child', 'فضاء الطفل', BookOpen],
  ];
  const navEl = nav.map(([id, label, Icon]) => (
    <button key={id} onClick={() => go(id)} className={`navitem ${page === id ? 'selected' : ''}`}>
      <Icon size={17} />{label}
    </button>
  ));

  if (!isConfigured || !supabase) return <SetupScreen />;

  return (
    <div className="min-h-screen bg-pale text-navy" dir="rtl">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-lightblue">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-black text-xl">
            <span className="rounded-xl bg-cyan text-white p-2"><HeartHandshake size={22} /></span>
            Latino Impact
          </div>
          <nav className="hidden md:flex gap-1">{navEl}</nav>
          <div className="flex gap-2 items-center">
            {session
              ? <button onClick={signOut} className="btn-secondary flex gap-2 items-center"><LogOut size={16} /> خروج</button>
              : <button onClick={() => { setAuthOpen(true); setAuthMode('login'); }} className="btn-primary flex gap-2 items-center"><LogIn size={16} /> دخول</button>}
            <button className="md:hidden p-2" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
          </div>
        </div>
        {menu && <nav className="md:hidden flex flex-col p-3 border-t">{navEl}</nav>}
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {loading && <p className="text-center py-3">جارٍ تحميل البيانات…</p>}
        {error && <Card className="mb-4 border border-red-200"><p className="text-coral">{error}</p><button className="underline mt-2" onClick={() => setError('')}>إغلاق</button></Card>}
        {page === 'home' && <Home go={go} session={session} />}
        {page === 'mother' && <MotherDashboard
          session={session} profile={profile} childrenData={children} attempts={attempts}
          go={go} addChild={addChild} openReport={openReport} loading={loading} dailyTip={dailyTip}
        />}
        {page === 'child' && <ChildArea
          childrenData={children.filter((child) => child.is_active)}
          activeChild={activeChild} childToken={childToken} themes={availableThemes}
          childLogin={childLogin} logoutChild={logoutChild} startQuiz={startQuiz}
          loading={loading} parentLoggedIn={Boolean(session)}
        />}
        {page === 'quiz' && quiz && <Quiz
          questions={questions} questionIndex={questionIndex} selectedOption={selectedOption}
          chooseOption={chooseOption} nextQuestion={nextQuestion} quiz={quiz}
          answeredBefore={answeredBefore} totalQuestions={totalQuestions} loading={loading}
        />}
        {page === 'result' && result && <Result result={result} child={activeChild} go={go} />}
        {page === 'report' && report && <ParentReport report={report} go={go} />}
      </main>
      <footer className="text-center text-sm text-slate-500 p-8">Latino Impact · معًا نصنع أثرًا إيجابيًا للأطفال 💙</footer>
      {toast && <div className="toast">{toast}</div>}
      {authOpen && <AuthModal
        mode={authMode} setMode={setAuthMode} close={() => setAuthOpen(false)}
        signIn={signIn} signUp={signUp} loading={loading} error={error} setError={setError}
      />}
    </div>
  );
}

function SetupScreen() {
  return <div dir="ltr" className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl p-8 max-w-xl shadow">
      <h1 className="text-2xl font-bold">Supabase setup required</h1>
      <p className="mt-3">Configure the project URL and publishable key in your <code>.env</code> file.</p>
      <pre className="bg-slate-100 p-3 rounded mt-4 text-sm">{'VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY'}</pre>
      <p className="mt-4">Then restart the Vite development server.</p>
    </div>
  </div>;
}

function Home({ go, session }) {
  return <>
    <section className="hero rounded-[2rem] bg-white p-6 md:p-10 mt-5 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <span className="badge">منصة تعلم ومشاركة عائلية</span>
        <h1 className="text-4xl md:text-5xl font-black leading-relaxed mt-3">خطوات صغيرة،<br />أثر كبير! 🌟</h1>
        <p className="text-slate-600 leading-8 text-lg">نتعلم معًا، نكبر معًا، ونبني مستقبلًا أكثر أمانًا للأطفال من خلال اللعب والتوعية.</p>
        <div className="flex flex-wrap gap-3 mt-5">
          <button className="btn-primary" onClick={() => go('child')}>ابدأ رحلة التعلم ←</button>
          <button className="btn-secondary" onClick={() => go('mother')}>فضاء الأم</button>
        </div>
      </div>
      <div className="illustration rounded-3xl flex items-center justify-center min-h-64 text-8xl">🌱🧩💙</div>
    </section>
    <section className="mt-9">
      <h2 className="heading">كيف نصنع الأثر؟</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {[
          ['🎮', 'نتعلم من خلال اللعب', 'اختبارات تعليمية تُحمّل من قاعدة البيانات.'],
          ['👨‍👩‍👧', 'نتابع التقدم', 'يمكن للأم متابعة محاولات أطفالها.'],
          ['🔐', 'بيانات محمية', 'تُعالج الإجابات والنتائج في الخادم.'],
        ].map((item) => <Card key={item[1]}><div className="text-4xl">{item[0]}</div><h3 className="font-bold text-xl mt-3">{item[1]}</h3><p className="text-slate-600 leading-7">{item[2]}</p></Card>)}
      </div>
    </section>
    <section className="mt-5"><Card>
      <h2 className="heading">فضاء العائلة</h2>
      <p className="text-slate-600 leading-7">تسجيل الأم يتم باستخدام رقم بطاقة التعريف الوطنية وكلمة المرور.</p>
      <button className="btn-primary mt-3" onClick={() => go(session ? 'mother' : 'home')}>{session ? 'لوحة الأم' : 'استخدمي زر الدخول لإنشاء حساب أو تسجيل الدخول'}</button>
    </Card></section>
  </>;
}

function AuthModal({ mode, setMode, close, signIn, signUp, loading, error, setError }) {
  const [name, setName] = useState('');
  const [cin, setCin] = useState('');
  const [password, setPassword] = useState('');
  return <div className="fixed inset-0 bg-navy/60 z-50 flex items-center justify-center p-4" onClick={close}>
    <div className="bg-white rounded-3xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب الأم'} 🔐</h2>
        <button onClick={close}><X /></button>
      </div>
      {mode === 'signup' && <>
        <label className="block mt-4">الاسم الكامل</label>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" />
      </>}
      <label className="block mt-4">رقم بطاقة التعريف الوطنية (CIN)</label>
      <input className="field" value={cin} onChange={(e) => setCin(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="8 أرقام" inputMode="numeric" />
      <label className="block mt-3">كلمة المرور</label>
      <input className="field" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="8 أحرف على الأقل" />
      <p className="text-xs text-slate-500 mt-2">لا نطلب البريد الإلكتروني؛ يُستخدم CIN كمعرّف تسجيل الدخول.</p>
      {error && <p className="text-coral text-sm mt-3">{error}</p>}
      <button disabled={loading || cin.length !== 8 || password.length < (mode === 'signup' ? 8 : 1) || (mode === 'signup' && !name.trim())}
        className="btn-primary w-full mt-4 disabled:opacity-50"
        onClick={() => mode === 'login' ? signIn(cin, password) : signUp(name.trim(), cin, password)}>
        {loading ? 'جارٍ التنفيذ…' : mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
      </button>
      <button className="text-cyan font-bold mt-4 w-full" onClick={() => { setError(''); setMode(mode === 'login' ? 'signup' : 'login'); }}>
        {mode === 'login' ? 'ليس لديك حساب؟ إنشاء حساب' : 'لديك حساب؟ تسجيل الدخول'}
      </button>
    </div>
  </div>;
}

function MotherDashboard({ session, profile, childrenData, attempts, go, addChild, openReport, loading, dailyTip }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const completed = attempts.filter((attempt) => attempt.status === 'completed');
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><span className="badge">لوحة متابعة العائلة</span><h1 className="text-3xl font-black mt-2">{profile?.full_name ? `مرحبًا ${profile.full_name}` : 'فضاء الأم'} 💙</h1><p className="text-slate-600">تعرض هذه الصفحة سجلات حسابك فقط.</p></div>
      <button className="btn-primary" onClick={() => go('child')}>مساحة الأطفال</button>
    </div>
    {!session ? <Card><p>للوصول إلى بيانات العائلة، سجّلي الدخول أو أنشئي حسابًا.</p></Card> : <>
      {dailyTip && <Card>
        <span className="badge">نصيحة اليوم</span>
        <h2 className="heading mt-2">{dailyTip.title}</h2>
        <p className="leading-8 mt-2">{dailyTip.content}</p>
        {dailyTip.category && <p className="text-sm text-slate-500 mt-2">{dailyTip.category}</p>}
        {dailyTip.example && <p className="mt-2 text-slate-600">مثال: {dailyTip.example}</p>}
      </Card>}
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat value={childrenData.filter((child) => child.is_active).length} label="أطفال مسجلون" />
        <Stat value={attempts.length} label="محاولات الاختبار" />
        <Stat value={completed.length} label="اختبارات مكتملة" />
      </div>
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="heading">أطفالي</h2>
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}><Plus size={16} /> إضافة طفل</button>
        </div>
        {showForm && <Card className="mb-4">
          <h3 className="font-bold mb-3">إضافة طفل</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="field" placeholder="اسم الطفل أو لقبه" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="field" placeholder="PIN من 4 إلى 6 أرقام" maxLength={6} inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} />
          </div>
          <button className="btn-primary mt-3" disabled={!name.trim() || !/^\d{4,6}$/.test(pin) || loading}
            onClick={async () => { if (await addChild(name.trim(), pin)) { setName(''); setPin(''); setShowForm(false); } }}>حفظ</button>
        </Card>}
        {childrenData.length === 0 ? <Card>{emptyMessage}</Card> :
          <div className="grid md:grid-cols-2 gap-4">{childrenData.map((child) => {
            const childAttempts = attempts.filter((attempt) => attempt.child_id === child.id);
            return <Card key={child.id}>
              <div className="flex gap-3 items-center">
                <div className="child-illustration">🧒</div>
                <div><h3 className="text-xl font-bold">{child.display_name}</h3><small className="text-slate-500">{child.is_active ? 'حساب نشط' : 'حساب معطّل'}</small></div>
              </div>
              <p className="text-sm text-slate-500 mt-3">{childAttempts.length} محاولة اختبار</p>
              <button className="btn-secondary mt-3" onClick={() => go('child')}>فتح فضاء الطفل</button>
            </Card>;
          })}</div>}
      </section>
      <Card>
        <h2 className="heading mb-3">سجل الاختبارات</h2>
        {attempts.length === 0 ? <p>{emptyMessage}</p> : attempts.map((attempt) => {
          const child = childrenData.find((item) => item.id === attempt.child_id);
          const title = attempt.quizzes?.title || 'اختبار';
          const themeName = attempt.quizzes?.themes?.name || '';
          return <div key={attempt.id} className="py-3 border-b border-lightblue flex flex-wrap justify-between items-center gap-3">
            <div><b>{child?.display_name || 'طفل'}</b><p className="text-sm text-slate-500">{themeName} · {title}</p><small>{attempt.status === 'completed' ? 'مكتمل' : 'قيد الإنجاز'}</small></div>
            <div className="flex items-center gap-3">
              <b>{attempt.score ?? 0} نقطة</b>
              <button className="btn-secondary" onClick={() => openReport(attempt.child_id, attempt.id)}>التفاصيل</button>
            </div>
          </div>;
        })}
      </Card>
    </>}
  </div>;
}

function Stat({ value, label }) {
  return <Card><div className="text-3xl font-black text-cyan">{value}</div><p className="text-slate-500">{label}</p></Card>;
}

function ChildArea({ childrenData, activeChild, childToken, themes, childLogin, logoutChild, startQuiz, loading, parentLoggedIn }) {
  const [childId, setChildId] = useState('');
  const [pin, setPin] = useState('');
  return <div className="space-y-5">
    <Card><div className="flex flex-wrap gap-4 items-center justify-between">
      <div><span className="badge">فضاء الطفل</span><h1 className="text-3xl font-black mt-2">{activeChild ? `أهلًا ${activeChild.display_name}! 👋` : 'ابدأ مساحة الطفل'}</h1><p className="text-slate-600">يتم اختيار الطفل من حساب الأم ثم إدخال رمز PIN.</p></div>
      <div className="illustration rounded-2xl px-8 py-5 text-5xl">🎯⭐</div>
    </div></Card>
    {!activeChild || !childToken ? <Card>
      <h2 className="heading">دخول الطفل</h2>
      {!parentLoggedIn ? <p className="mt-3">يجب على الأم تسجيل الدخول أولًا حتى تظهر قائمة الأطفال.</p> :
        childrenData.length === 0 ? <p className="mt-3">لا يوجد طفل نشط. أضيفي طفلًا من فضاء الأم أولًا.</p> : <>
          <label className="block mt-4">اختيار الطفل</label>
          <select className="field" value={childId} onChange={(e) => setChildId(e.target.value)}>
            <option value="">اختاري الطفل</option>
            {childrenData.map((child) => <option key={child.id} value={child.id}>{child.display_name}</option>)}
          </select>
          <label className="block mt-3">PIN</label>
          <input className="field" type="password" maxLength={6} inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} />
          <button className="btn-primary mt-4" disabled={!childId || !/^\d{4,6}$/.test(pin) || loading}
            onClick={async () => { if (await childLogin(childId, pin)) { setPin(''); setChildId(''); } }}>تحقق من PIN</button>
        </>}
    </Card> : <>
      <Card><div className="flex justify-between items-center flex-wrap gap-3">
        <div><h2 className="heading">المتعلم: {activeChild.display_name}</h2><p>اختاري موضوعًا ثم اختبارًا.</p></div>
        <button className="btn-secondary" onClick={logoutChild}>خروج الطفل</button>
      </div></Card>
      {themes.length === 0 ? <Card>لا توجد اختبارات منشورة حاليًا.</Card> :
        themes.map((theme) => <Card key={theme.id}>
          <h2 className="heading">{theme.name}</h2>
          {theme.description && <p className="text-slate-600 mt-1">{theme.description}</p>}
          {theme.quizzes?.length ? <div className="grid md:grid-cols-2 gap-3 mt-3">
            {theme.quizzes.map((quiz) => <button key={quiz.id} disabled={loading} className="btn-secondary text-right" onClick={() => startQuiz({ ...quiz, themeName: theme.name })}>
              <b>{quiz.title}</b>{quiz.description && <span className="block text-sm mt-1">{quiz.description}</span>}
            </button>)}
          </div> : <p className="text-slate-500 mt-2">لا توجد اختبارات في هذا الموضوع.</p>}
        </Card>)}
    </>}
  </div>;
}

function Quiz({ questions, questionIndex, selectedOption, chooseOption, nextQuestion, quiz, answeredBefore, totalQuestions, loading }) {
  const question = questions[questionIndex];
  if (!question) return <Card>لم يتم العثور على السؤال.</Card>;
  const options = [...(question.question_options || [])].sort((a, b) => a.position - b.position);
  const currentNumber = answeredBefore + questionIndex + 1;
  return <Card className="max-w-3xl mx-auto">
    <span className="badge">{quiz.themeName} · {quiz.quizTitle}</span>
    <h2 className="text-xl font-bold mt-4">السؤال {currentNumber} من {totalQuestions}</h2>
    <Progress value={(currentNumber / Math.max(totalQuestions, 1)) * 100} />
    <h3 className="text-xl font-bold mt-6 mb-4">{question.question_text}</h3>
    <div className="space-y-2">
      {options.map((option, index) => <button key={option.id} disabled={Boolean(selectedOption) || loading}
        onClick={() => chooseOption(option.id)} className={`quiz-option ${selectedOption === option.id ? 'correct' : ''}`}>
        {['أ', 'ب', 'ج', 'د', 'هـ', 'و'][index] || `${index + 1}`} · {option.option_text}
      </button>)}
    </div>
    {selectedOption && <div className="feedback mt-4">
      <p className="font-bold">تم حفظ إجابتك بنجاح 💙</p>
      <p>ستظهر النتيجة والتصحيح في تقرير الأم بعد إنهاء الاختبار.</p>
      <button className="btn-primary mt-3" disabled={loading} onClick={nextQuestion}>
        {questionIndex === questions.length - 1 ? 'إنهاء الاختبار' : 'السؤال التالي ←'}
      </button>
    </div>}
  </Card>;
}

function Result({ result, child, go }) {
  return <Card className="max-w-xl mx-auto text-center py-10">
    <div className="text-6xl">🏆</div>
    <h1 className="text-3xl font-black mt-4">أحسنت {child?.display_name || ''}!</h1>
    <p className="text-2xl mt-3">النتيجة: <b className="text-cyan">{result.score}/{result.total}</b></p>
    <p className="text-slate-600">{result.percentage ?? 0}% · تم حفظ نتيجتك في سجل الحساب.</p>
    <button className="btn-primary mt-5" onClick={() => go('child')}>العودة للمواضيع</button>
  </Card>;
}

function ParentReport({ report, go }) {
  const stats = report.statistics || {};
  return <div className="space-y-4">
    <button className="btn-secondary" onClick={() => go('mother')}><ArrowLeft size={16} className="inline" /> العودة</button>
    <Card>
      <h1 className="heading">تقرير الاختبار</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <Stat value={`${stats.score ?? 0}/${stats.total_questions ?? 0}`} label="النتيجة" />
        <Stat value={`${stats.percentage ?? 0}%`} label="النسبة" />
        <Stat value={stats.correct_answers ?? 0} label="إجابات صحيحة" />
        <Stat value={stats.unanswered_questions ?? 0} label="غير مجابة" />
      </div>
    </Card>
    {(report.questions || []).map((question, index) => <Card key={question.question_id}>
      <h3 className="font-bold">{index + 1}. {question.question_text}</h3>
      <div className="space-y-2 mt-3">
        {question.options.map((option) => <p key={option.id} className={`rounded-xl p-2 ${option.id === question.correct_option_id ? 'bg-green-50' : 'bg-slate-50'}`}>
          {option.option_text}
          {option.id === question.selected_option_id && <b> — إجابة الطفل</b>}
          {option.id === question.correct_option_id && <b> — الإجابة الصحيحة</b>}
        </p>)}
      </div>
    </Card>)}
  </div>;
}

export default App;
