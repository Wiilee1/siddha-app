// Siddha Meditation App - Internationalization (i18n) Service
// Supports Polish ('pl', default) and English ('en').

const LANG_KEY = 'siddha_lang';

export function getLang() {
    try {
        const stored = localStorage.getItem(LANG_KEY);
        if (stored === 'en' || stored === 'pl') return stored;
    } catch (e) {}
    return 'pl';
}

export function setLang(lang, reload = true) {
    const normalized = lang === 'en' ? 'en' : 'pl';
    try {
        localStorage.setItem(LANG_KEY, normalized);
        document.documentElement.lang = normalized;
    } catch (e) {}
    if (reload) {
        window.location.reload();
    }
}

export function isPL() {
    return getLang() === 'pl';
}

/**
 * Returns the localized value based on current language.
 * Works with strings, arrays, objects, or HTML templates.
 * @param {*} en - English value
 * @param {*} pl - Polish value
 */
export function tr(en, pl) {
    return isPL() ? pl : en;
}

export function getLocale() {
    return isPL() ? 'pl-PL' : 'en-US';
}
