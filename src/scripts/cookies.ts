/**
 * 7DStudio — Gestión de consentimiento de cookies y Google Analytics 4
 * Enfoque conservador: GA4 NUNCA se descarga ni ejecuta antes de obtener
 * el consentimiento explícito (analytics === true).
 */

export const GA_MEASUREMENT_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_GA_ID) ||
  "G-XXXXXXXXXX";

export const CONSENT_STORAGE_KEY = "7dstudio_cookie_consent";
export const CONSENT_VERSION = 1;

export interface CookieConsentState {
  analytics: boolean;
  version: number;
  timestamp: number;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    __gaLoaded?: boolean;
    [key: string]: any;
  }
}

/**
 * Obtiene el estado actual de consentimiento almacenado en localStorage.
 */
export function getConsentState(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && typeof parsed.analytics === "boolean") {
      return parsed;
    }
  } catch (e) {
    console.warn("[7DStudio Cookies] Error al leer localStorage:", e);
  }
  return null;
}

/**
 * Guarda la decisión del usuario en localStorage y activa o desactiva GA4.
 */
export function setConsentState(analytics: boolean): void {
  if (typeof window === "undefined") return;
  const state: CookieConsentState = {
    analytics,
    version: CONSENT_VERSION,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("[7DStudio Cookies] Error al guardar en localStorage:", e);
  }

  if (analytics) {
    loadGoogleAnalytics();
  } else {
    disableGoogleAnalytics();
  }
}

/**
 * Carga e inicializa Google Analytics 4 dinámicamente.
 * Se ejecuta una sola vez y solo tras consentimiento explícito.
 */
export function loadGoogleAnalytics(): void {
  if (typeof window === "undefined") return;
  if (window.__gaLoaded) return;

  // Si existe un tag deshabilitador previo, retirarlo
  if (GA_MEASUREMENT_ID) {
    delete window[`ga-disable-${GA_MEASUREMENT_ID}`];
  }

  // Inicializar dataLayer y función gtag global
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
  });

  // Inyectar el script oficial de Google Tag Manager solo si no es placeholder
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      GA_MEASUREMENT_ID,
    )}`;
    document.head.appendChild(script);
  } else {
    console.info(
      `[7DStudio Cookies] Consentimiento analítico concedido. GA4 listo para Measurement ID: ${GA_MEASUREMENT_ID}`,
    );
  }

  window.__gaLoaded = true;
}

/**
 * Desactiva Google Analytics e intenta limpiar las cookies analíticas de primera parte (_ga, _gid).
 */
export function disableGoogleAnalytics(): void {
  if (typeof window === "undefined") return;

  if (GA_MEASUREMENT_ID) {
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  }

  // Intentar eliminar cookies analíticas de primera parte creadas por GA
  const cleanId = GA_MEASUREMENT_ID.replace(/^G-/, "");
  const cookiesToRemove = ["_ga", "_gid", `_ga_${cleanId}`];
  const hostname = window.location.hostname;
  const domainParts = hostname.split(".");

  cookiesToRemove.forEach((name) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
    document.cookie = `${name}=; Path=/; Domain=.${hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
    document.cookie = `${name}=; Path=/; Domain=${hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;

    if (domainParts.length > 1) {
      const rootDomain = "." + domainParts.slice(-2).join(".");
      document.cookie = `${name}=; Path=/; Domain=${rootDomain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
    }
  });
}
