const CHECK_URL = 'http://clients3.google.com/generate_204';
const ALARM_NAME = 'periodicPortalCheck';
const PERIOD_MINUTES = 180;

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: PERIOD_MINUTES, when: Date.now() + 10000 });
    setTimeout(checkForPortal, 5000);
});

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === ALARM_NAME) checkForPortal();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === 'runNow') {
        checkForPortal().then(r => sendResponse({ ok: r })).catch(e => sendResponse({ ok: false, error: e.toString() }));
        return true;
    }
});

async function detectCaptivePortal() {
    try {
        const resp = await fetch(CHECK_URL, { method: 'GET', redirect: 'follow', cache: 'no-store' });
        if (resp.status === 204) return null;
        const finalUrl = resp.url || null;
        if (!finalUrl || finalUrl === CHECK_URL) {
            const ct = resp.headers.get('content-type') || '';
            if (ct.includes('text/html')) return resp.url || CHECK_URL;
            return null;
        }
        return finalUrl;
    } catch (e) {
        console.warn('detectCaptivePortal error', e);
        return null;
    }
}

async function checkForPortal() {
    const portalUrl = await detectCaptivePortal();
    if (!portalUrl) return false;
    const config = await getConfig();
    if (!config || !config.username || !config.password) {
        chrome.action.setBadgeText({ text: '!' });
        chrome.action.setTitle({ title: 'Auto Wi-Fi Login: Please open extension and set credentials' });
        return true;
    }
    try {
        const tab = await chrome.tabs.create({ url: portalUrl, active: false });
        const onUpdated = (tabId, info) => {
            if (tabId !== tab.id) return;
            if (info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(onUpdated);
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content_script.js']
                }).then(() => {
                    chrome.tabs.sendMessage(tab.id, { type: 'autoLogin', config }, () => {
                        setTimeout(() => {
                            chrome.tabs.remove(tab.id).catch(() => { });
                        }, 5000);
                    });
                }).catch(err => console.error('scripting.executeScript failed', err));
            }
        };
        chrome.tabs.onUpdated.addListener(onUpdated);
        chrome.action.setBadgeText({ text: '' });
        chrome.action.setTitle({ title: 'Auto Wi-Fi Login' });
        return true;
    } catch (e) {
        console.error('Failed to open portal tab', e);
        return false;
    }
}

function getConfig() {
    return new Promise(resolve => chrome.storage.sync.get(['username', 'password', 'autoClose', 'useSync'], res => resolve(res)));
}
