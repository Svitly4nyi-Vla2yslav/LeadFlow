import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { api } from '../api/client';

const TARGET = import.meta.env.VITE_LAUNCH_AT || '2027-01-01T00:00:00+01:00';
const REQUIRED_TAPS = 5;
const TAP_WINDOW_MS = 4000;

const shimmer = keyframes`
  0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}
`;
const pulse = keyframes`
  0%,100%{opacity:.45;box-shadow:0 0 8px rgba(224,63,63,.35)}50%{opacity:1;box-shadow:0 0 22px rgba(255,80,66,.9)}
`;
const scan = keyframes`
  from{transform:translateY(-100%)}to{transform:translateY(100vh)}
`;

const Screen = styled.main`
  box-sizing:border-box;width:100%;min-width:0;min-height:100vh;display:grid;grid-template-columns:minmax(0,1fr);place-items:center;overflow:hidden;position:relative;padding:24px;
  background:
    radial-gradient(circle at 50% 32%,rgba(196,137,38,.12),transparent 34%),
    radial-gradient(circle at 15% 90%,rgba(109,44,26,.18),transparent 34%),
    linear-gradient(145deg,#050607,#0d1012 46%,#050607);
  color:#e9e6df;
  &::before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.18;background-image:repeating-linear-gradient(0deg,transparent 0 3px,rgba(255,255,255,.025) 4px)}
  &::after{content:'';position:absolute;left:0;right:0;height:26vh;top:-26vh;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,205,111,.025),transparent);animation:${scan} 9s linear infinite}
  @media(max-width:560px){padding:14px}
  @media(prefers-reduced-motion:reduce){&::after{animation:none}}
`;
const Device = styled.section`
  box-sizing:border-box;width:100%;max-width:1040px;min-width:0;position:relative;border:1px solid rgba(225,190,116,.24);border-radius:28px;padding:clamp(28px,5vw,62px);
  background:linear-gradient(145deg,rgba(31,34,34,.96),rgba(9,11,12,.98));
  box-shadow:0 50px 120px rgba(0,0,0,.65),inset 0 1px rgba(255,255,255,.06),inset 0 0 90px rgba(0,0,0,.45);
  &::before{content:'';position:absolute;inset:11px;border:1px solid rgba(255,255,255,.045);border-radius:20px;pointer-events:none}
  @media(max-width:560px){padding:44px 22px 36px;border-radius:22px}
`;
const Brand = styled.div`text-align:center;margin-bottom:clamp(25px,5vw,48px)`;
const Logo = styled.img`width:clamp(180px,32vw,360px);height:auto;filter:drop-shadow(0 0 22px rgba(255,198,109,.38));margin:-24px auto -26px;display:block`;
const BrandName = styled.div`
  display:inline-block;font-size:clamp(12px,1.7vw,17px);letter-spacing:.48em;font-weight:700;padding-left:.48em;
  background:linear-gradient(105deg,#a96b13,#ffe7bb,#f4ad3d,#fff1cf,#a96b13);background-size:300% 300%;background-clip:text;color:transparent;animation:${shimmer} 5.8s ease-in-out infinite;
  @media(prefers-reduced-motion:reduce){animation:none}
`;
const Kicker = styled.p`margin:18px 0 0;color:rgba(255,255,255,.46);font-size:11px;letter-spacing:.28em;text-transform:uppercase`;
const TimerPlate = styled.div`
  box-sizing:border-box;min-width:0;position:relative;padding:clamp(18px,3vw,32px);border-radius:18px;border:1px solid rgba(222,180,88,.22);
  background:linear-gradient(180deg,rgba(0,0,0,.72),rgba(10,8,5,.9));box-shadow:inset 0 0 34px rgba(0,0,0,.95),0 0 32px rgba(221,154,43,.06);
  @media(max-width:560px){padding:20px 14px}
`;
const StatusLine = styled.div`
  display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:18px;color:#c9a55e;font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;
  @media(max-width:560px){font-size:9px;letter-spacing:.2em}
`;
const Led = styled.span`width:8px;height:8px;border-radius:50%;background:#ef4d3f;animation:${pulse} 2.4s ease-in-out infinite;@media(prefers-reduced-motion:reduce){animation:none}`;
const Digits = styled.div`
  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(6px,1.8vw,18px);align-items:start;
  @media(max-width:560px){grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}
`;
const Unit = styled.div`min-width:0;text-align:center`;
const Number = styled.div`
  font-family:'Courier New',ui-monospace,SFMono-Regular,monospace;font-weight:800;font-variant-numeric:tabular-nums;line-height:.95;
  font-size:clamp(38px,9vw,104px);letter-spacing:-.08em;padding:.18em .1em .16em;border-radius:10px;
  color:#ffd889;text-shadow:0 0 8px rgba(255,187,58,.8),0 0 30px rgba(255,151,36,.34);
  background:repeating-linear-gradient(180deg,rgba(255,196,69,.075) 0 1px,transparent 1px 5px),#090806;
  border:1px solid rgba(255,205,105,.13);box-shadow:inset 0 0 28px #000;
`;
const Label = styled.span`display:block;margin-top:10px;color:rgba(255,255,255,.42);font-size:clamp(8px,1.2vw,11px);letter-spacing:.2em;text-transform:uppercase`;
const Footer = styled.div`
  display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-top:22px;color:rgba(255,255,255,.36);font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  @media(max-width:560px){justify-content:center;text-align:center;gap:7px 18px}
`;
const Screw = styled.span<{ $position: string }>`position:absolute;${({$position})=>$position};width:13px;height:13px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#999,#333 45%,#111 70%);box-shadow:0 1px 2px #000,inset 0 0 0 1px rgba(255,255,255,.2);&::after{content:'';position:absolute;left:3px;right:3px;top:6px;height:1px;background:#181818;transform:rotate(-22deg)}`;
const SecretScrew = styled.button`
  position:absolute;right:17px;bottom:17px;width:17px;height:17px;padding:0;border:0;border-radius:50%;cursor:default;z-index:4;
  background:radial-gradient(circle at 35% 30%,#9a804d,#3b2d17 46%,#100d09 72%);box-shadow:0 1px 3px #000,inset 0 0 0 1px rgba(255,226,157,.16);
  &::after{content:'';position:absolute;left:4px;right:4px;top:8px;height:1px;background:#17100a;transform:rotate(24deg)}
  &:focus-visible{outline:2px solid #e7b75d;outline-offset:5px}
`;
const Overlay = styled.div`position:fixed;inset:0;z-index:20;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.78);backdrop-filter:blur(16px)`;
const AccessPanel = styled.form`
  width:min(420px,100%);padding:28px;border-radius:18px;background:#111416;border:1px solid rgba(235,190,99,.3);box-shadow:0 35px 100px rgba(0,0,0,.8);
  h2{margin:0 0 8px;color:#f4cc7e}p{color:rgba(255,255,255,.55);font-size:13px}label{display:grid;gap:8px;margin-top:22px}
  input{background:#080a0b;border-color:rgba(255,214,131,.24);font-size:17px;letter-spacing:.08em}
`;
const PasswordField = styled.div`
  position:relative;
  input{padding-right:92px}
  button{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:auto;min-height:30px;padding:5px 9px;border:0;border-radius:7px;background:rgba(231,183,93,.12);color:#e7c47d;font-size:12px;font-weight:700;cursor:pointer}
  button:hover{background:rgba(231,183,93,.2);color:#ffe4ad}
  button:focus-visible{outline:2px solid #e7b75d;outline-offset:2px}
`;
const Actions = styled.div`display:flex;justify-content:flex-end;gap:10px;margin-top:18px;button{width:auto;padding:10px 14px;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#eee;cursor:pointer}button[type=submit]{background:linear-gradient(120deg,#9a651a,#e7b75d);color:#161009;border:0;font-weight:800}`;
const ErrorText = styled.p`color:#ff9a8e!important;min-height:18px`;
const LoadingMark = styled.div`font-family:'Courier New',monospace;color:#d5b269;font-size:18px;letter-spacing:.2em`;

type Countdown = { days: string; hours: string; minutes: string; seconds: string; reached: boolean };

const calculateCountdown = (): Countdown => {
  const remaining = Math.max(0, new Date(TARGET).getTime() - Date.now());
  return {
    days: String(Math.floor(remaining / 86_400_000)).padStart(3, '0'),
    hours: String(Math.floor(remaining / 3_600_000) % 24).padStart(2, '0'),
    minutes: String(Math.floor(remaining / 60_000) % 60).padStart(2, '0'),
    seconds: String(Math.floor(remaining / 1000) % 60).padStart(2, '0'),
    reached: remaining === 0
  };
};

export default function LaunchGate({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<'checking' | 'locked' | 'unlocked'>('checking');
  const [countdown, setCountdown] = useState(calculateCountdown);
  const [accessOpen, setAccessOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const taps = useRef<number[]>([]);

  useEffect(() => {
    api.get('/api/auth/session').then(response => setAuthState(response.data.authenticated ? 'unlocked' : 'locked')).catch(() => setAuthState('locked'));
    const onUnauthorized = () => setAuthState('locked');
    window.addEventListener('leadflow:unauthorized', onUnauthorized);
    return () => window.removeEventListener('leadflow:unauthorized', onUnauthorized);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(calculateCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.code === 'KeyV') { event.preventDefault(); setAccessOpen(true); }
      if (event.key === 'Escape') setAccessOpen(false);
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);

  const units = useMemo(() => [
    ['Tage', countdown.days], ['Stunden', countdown.hours], ['Minuten', countdown.minutes], ['Sekunden', countdown.seconds]
  ], [countdown]);

  const revealAccess = () => {
    const cutoff = Date.now() - TAP_WINDOW_MS;
    taps.current = [...taps.current.filter(time => time > cutoff), Date.now()];
    if (taps.current.length >= REQUIRED_TAPS) { taps.current = []; setError(''); setAccessOpen(true); }
  };

  const login = async (event: FormEvent) => {
    event.preventDefault(); setSubmitting(true); setError('');
    try {
      await api.post('/api/auth/login', { password });
      setPassword(''); setShowPassword(false); setAccessOpen(false); setAuthState('unlocked');
    } catch (exception: any) {
      const status = exception.response?.status;
      setError(status === 429 ? 'Zu viele Versuche. Bitte später erneut versuchen.' : status === 503 ? 'Der interne Zugang ist noch nicht konfiguriert.' : 'Zugang verweigert.');
    } finally { setSubmitting(false); }
  };

  if (authState === 'checking') return <Screen><LoadingMark>INITIALISIERUNG…</LoadingMark></Screen>;
  if (authState === 'unlocked') return <>{children}</>;

  return <Screen>
    <Device aria-label={`Countdown bis zum Start von VS Web Studio: ${countdown.days} Tage, ${countdown.hours} Stunden, ${countdown.minutes} Minuten und ${countdown.seconds} Sekunden`}>
      <Screw $position="left:17px;top:17px"/><Screw $position="right:17px;top:17px"/><Screw $position="left:17px;bottom:17px"/>
      <SecretScrew type="button" onClick={revealAccess} aria-label="Interner Zugangspunkt" />
      <Brand><Logo src="/logo-vs-studio.svg" alt="VS Web Studio"/><BrandName>WEB STUDIO</BrandName><Kicker>Hildesheim · System im Aufbau</Kicker></Brand>
      <TimerPlate>
        <StatusLine><Led/>{countdown.reached ? 'Launch window reached' : 'Slow launch sequence'}</StatusLine>
        <Digits>{units.map(([label, value]) => <Unit key={label}><Number>{value}</Number><Label>{label}</Label></Unit>)}</Digits>
        <Footer><span>Geplanter Start · 01.01.2027</span><span>VS System · Standby</span></Footer>
      </TimerPlate>
    </Device>
    {accessOpen && <Overlay onMouseDown={event => { if (event.target === event.currentTarget) setAccessOpen(false); }}>
      <AccessPanel onSubmit={login}>
        <h2>Interner Zugang</h2><p>Authentifizierung für das VS Web Studio CRM.</p>
        <label>Passwort<PasswordField><input autoFocus type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /><button type="button" aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Verbergen' : 'Anzeigen'}</button></PasswordField></label>
        <ErrorText role="alert">{error}</ErrorText>
        <Actions><button type="button" onClick={() => setAccessOpen(false)}>Abbrechen</button><button type="submit" disabled={submitting}>{submitting ? 'Prüfung…' : 'System öffnen'}</button></Actions>
      </AccessPanel>
    </Overlay>}
  </Screen>;
}
