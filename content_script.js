const USERNAME_CANDIDATES = [
    'username', 'user', 'login', 'email', 'userid', 'user_id', 'j_username', 'user-name', 'txtUser'
];
const PASSWORD_CANDIDATES = [
    'password', 'passwd', 'pwd', 'pass', 'user_password', 'loginpass'
];
const SUBMIT_CANDIDATES_TEXT = [
    'login', 'sign in', 'sign-in', 'submit', 'connect', 'log in'
];

function looksLikeUsername(el) {
    if (!el) return false;
    const t = (el.type || '').toLowerCase();
    if (t === 'password' || t === 'hidden' || t === 'checkbox' || t === 'radio') return false;
    const id = (el.id || '').toLowerCase();
    const name = (el.name || '').toLowerCase();
    const placeholder = (el.placeholder || '').toLowerCase();
    return USERNAME_CANDIDATES.some(c => id.includes(c) || name.includes(c) || placeholder.includes(c)) || t === 'email' || el.tagName.toLowerCase() === 'input';
}

function looksLikePassword(el) {
    if (!el) return false;
    const t = (el.type || '').toLowerCase();
    if (t === 'password') return true;
    const id = (el.id || '').toLowerCase();
    const name = (el.name || '').toLowerCase();
    const placeholder = (el.placeholder || '').toLowerCase();
    return PASSWORD_CANDIDATES.some(c => id.includes(c) || name.includes(c) || placeholder.includes(c));
}

function findUsernameAndPasswordFields() {
    const inputs = Array.from(document.querySelectorAll('input,textarea'));
    let passwordEl = null, usernameEl = null;

    for (const el of inputs) {
        if (looksLikePassword(el)) { passwordEl = el; break; }
    }

    if (passwordEl) {
        const form = passwordEl.closest('form');
        if (form) {
            const inForm = Array.from(form.querySelectorAll('input,textarea'));
            for (const el of inForm) {
                if (looksLikeUsername(el) && el !== passwordEl) { usernameEl = el; break; }
            }
        }
    }

    if (!usernameEl) {
        for (const el of inputs) {
            if (looksLikeUsername(el) && el !== passwordEl) { usernameEl = el; break; }
        }
    }

    if (!passwordEl) {
        for (const el of inputs) {
            if ((el.type || '').toLowerCase() === 'password') { passwordEl = el; break; }
        }
    }

    return { usernameEl, passwordEl };
}

function findSubmitButton(formOrDocument) {
    const container = formOrDocument || document;
    let btn = container.querySelector('button[type="submit"], input[type="submit"]');
    if (btn) return btn;
    const els = Array.from(container.querySelectorAll('button, a, input[type="button"], input[type="submit"]'));
    for (const e of els) {
        const text = ((e.innerText || e.value) || '').toLowerCase().trim();
        if (SUBMIT_CANDIDATES_TEXT.some(w => text.includes(w))) return e;
    }
    return null;
}

async function tryAutoLogin(config) {
    try {
        const { usernameEl, passwordEl } = findUsernameAndPasswordFields();
        if (!usernameEl || !passwordEl) {
            const allInputs = Array.from(document.querySelectorAll('input'));
            const textInput = allInputs.find(i => (i.type || '').toLowerCase() !== 'password');
            const passInput = allInputs.find(i => (i.type || '').toLowerCase() === 'password');
            if (textInput && passInput) {
                usernameEl = usernameEl || textInput;
                passwordEl = passwordEl || passInput;
            }
        }

        if (!usernameEl || !passwordEl) {
            console.warn('AutoLogin: Could not find username/password fields');
            return { ok: false, reason: 'no_fields' };
        }

        usernameEl.focus();
        usernameEl.value = config.username || '';
        usernameEl.dispatchEvent(new Event('input', { bubbles: true }));
        passwordEl.focus();
        passwordEl.value = config.password || '';
        passwordEl.dispatchEvent(new Event('input', { bubbles: true }));

        const form = usernameEl.closest('form') || passwordEl.closest('form');
        if (form) {
            const submitBtn = findSubmitButton(form) || form.querySelector('button, input[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
                return { ok: true, method: 'click' };
            } else {
                try { form.submit(); return { ok: true, method: 'form.submit' }; } catch (e) { }
            }
        }

        const globalBtn = findSubmitButton(document);
        if (globalBtn) { globalBtn.click(); return { ok: true, method: 'global_click' }; }

        passwordEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        passwordEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

        return { ok: true, method: 'enter_key' };
    } catch (e) {
        console.error('AutoLogin exception', e);
        return { ok: false, reason: e.toString() };
    }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === 'autoLogin' && msg.config) {
        setTimeout(async () => {
            const res = await tryAutoLogin(msg.config);
            sendResponse(res);
        }, 1000);
        return true;
    }
});
