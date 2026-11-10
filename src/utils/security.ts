const AUTH_SALT = 'PCS_SALT_v1';
const EXPECTED_AUTH_HASH = '8fbd0a6bb5e26c2e7b5f29d67d86888a42eba0763bc4c657209c5dab66da7e36';

const LOCKOUT_STORAGE_KEY = 'pcs_sec_lockout_v1';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutos de bloqueo tras 3 fallos

interface LockoutState {
  attempts: number;
  lockedUntil: number;
}

/**
 * Sanitiza cualquier texto escrito por el visitante para prevenir inyecciones XSS o caracteres maliciosos.
 */
export function sanitizeUserText(input: string, maxLength = 60): string {
  return input
    .replace(/[<>`"'$\\]/g, '')
    .replace(/javascript:/gi, '')
    .slice(0, maxLength);
}

/**
 * Calcula el hash SHA-256 usando Web Crypto API nativa del navegador (sin librerías externas).
 */
async function sha256Hex(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica en 2 pasos: Número de teléfono (10 dígitos) + Código secreto mediante SHA-256.
 */
export async function verifyTwoStepAdminAuth(phoneInput: string, codeInput: string): Promise<boolean> {
  const cleanPhone = phoneInput.replace(/\D/g, '');
  const cleanCode = codeInput.trim().toLowerCase().replace(/\s+/g, '');
  if (cleanPhone.length !== 10 || !cleanCode) {
    return false;
  }
  const payload = `${AUTH_SALT}:${cleanPhone}:${cleanCode}`;
  const digest = await sha256Hex(payload);
  return digest === EXPECTED_AUTH_HASH;
}

export function getSecurityLockoutStatus(): {
  isLocked: boolean;
  remainingMinutes: number;
  attemptsLeft: number;
} {
  try {
    const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (!raw) {
      return { isLocked: false, remainingMinutes: 0, attemptsLeft: MAX_ATTEMPTS };
    }
    const state: LockoutState = JSON.parse(raw);
    const now = Date.now();
    if (state.lockedUntil > now) {
      const remainingMinutes = Math.ceil((state.lockedUntil - now) / 60000);
      return { isLocked: true, remainingMinutes, attemptsLeft: 0 };
    }
    if (state.lockedUntil !== 0 && state.lockedUntil <= now) {
      localStorage.removeItem(LOCKOUT_STORAGE_KEY);
      return { isLocked: false, remainingMinutes: 0, attemptsLeft: MAX_ATTEMPTS };
    }
    return {
      isLocked: false,
      remainingMinutes: 0,
      attemptsLeft: Math.max(0, MAX_ATTEMPTS - state.attempts),
    };
  } catch {
    return { isLocked: false, remainingMinutes: 0, attemptsLeft: MAX_ATTEMPTS };
  }
}

export function registerFailedAuthAttempt(): {
  isLocked: boolean;
  remainingMinutes: number;
  attemptsLeft: number;
} {
  try {
    const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY);
    const current: LockoutState = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
    const nextAttempts = current.attempts + 1;
    const lockedUntil = nextAttempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : 0;

    localStorage.setItem(
      LOCKOUT_STORAGE_KEY,
      JSON.stringify({ attempts: nextAttempts, lockedUntil })
    );

    return {
      isLocked: lockedUntil > 0,
      remainingMinutes: lockedUntil > 0 ? 15 : 0,
      attemptsLeft: Math.max(0, MAX_ATTEMPTS - nextAttempts),
    };
  } catch {
    return { isLocked: false, remainingMinutes: 0, attemptsLeft: 1 };
  }
}

export function clearAuthLockout(): void {
  try {
    localStorage.removeItem(LOCKOUT_STORAGE_KEY);
  } catch {
    // ignore
  }
}
