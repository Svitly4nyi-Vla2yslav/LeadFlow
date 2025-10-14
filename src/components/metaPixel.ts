// src/components/metaPixel.ts
// ЖОДНИХ підвантажень fbevents.js. Працюємо лише з тим, що дав GTM.
// Якщо fbq нема — мовчимо. Так ми гарантуємо: 0 конфліктів версій.
// Є антидубль подій та перевірка consent.

const PIXEL_ID = '659265680303874';

// Скільки чекаємо, щоб GTM встиг підкинути fbq (без інжекту з нашого боку)
const WAIT_FOR_GTM_MS = 4000;

// Антидубль на 5 секунд
function guardEvent(name: string): boolean {
  (window as any).__fbSent = (window as any).__fbSent || {};
  if ((window as any).__fbSent[name]) return false;
  (window as any).__fbSent[name] = true;
  setTimeout(() => { (window as any).__fbSent[name] = false; }, 5000);
  return true;
}

function hasAdConsent(): boolean {
  try {
    const raw = localStorage.getItem('cookieSettings');
    if (!raw) return false;
    const s = JSON.parse(raw);
    return s?.advertising?.enabled === true;
  } catch { return false; }
}

function scriptAlreadyPresent(): boolean {
  return Array.from(document.scripts).some(s =>
    typeof s.src === 'string' && /connect\.facebook\.net\/.*\/fbevents\.js/i.test(s.src)
  );
}

async function waitForFbq(timeout = WAIT_FOR_GTM_MS): Promise<boolean> {
  const started = Date.now();
  // якщо скрипт уже є в DOM — добре, просто чекаємо появу window.fbq
  while (Date.now() - started < timeout) {
    if (typeof (window as any).fbq === 'function') return true;
    await new Promise(r => setTimeout(r, 100));
  }
  return typeof (window as any).fbq === 'function';
}

let pixelReady = false;

export async function ensurePixelReady(): Promise<void> {
  if (pixelReady) return;
  if (!hasAdConsent()) return; // без згоди нічого не робимо

  // Заборонено інжектити наш fbevents.js. Чекаємо, що GTM його дасть.
  // Якщо навіть скрипт у DOM є, все одно чекаємо window.fbq.
  if (!scriptAlreadyPresent()) {
    // GTM може завантажити пізніше за наш код — просто чекаємо
  }

  const ok = await waitForFbq();
  if (!ok) return; // fbq так і не з’явився — тихо виходимо, без помилок

  try {
    // Безпечний init: якщо GTM вже інітнув — виклик не зашкодить
    (window as any).fbq('init', PIXEL_ID);
  } catch {
    // якщо кине за повторний init — ігноруємо
  } finally {
    pixelReady = true;
  }
}

export async function trackPageView() {
  await ensurePixelReady();
  if (typeof (window as any).fbq === 'function' && guardEvent('PageView')) {
    (window as any).fbq('track', 'PageView');
  }
}

export async function trackLead() {
  await ensurePixelReady();
  if (typeof (window as any).fbq === 'function' && guardEvent('Lead')) {
    (window as any).fbq('track', 'Lead');
  }
}

export async function trackContactPhone() {
  await ensurePixelReady();
  if (typeof (window as any).fbq === 'function' && guardEvent('Contact_phone')) {
    (window as any).fbq('track', 'Contact', { contact_type: 'phone' });
  }
}
