document.addEventListener('DOMContentLoaded', () => {
    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const useSyncEl = document.getElementById('useSync');
    const statusEl = document.getElementById('status');

    document.getElementById('save').addEventListener('click', () => {
        const username = usernameEl.value.trim();
        const password = passwordEl.value;
        const useSync = useSyncEl.checked;
        if (!username || !password) {
            statusEl.textContent = 'Enter both username and password.';
            return;
        }
        const area = useSync ? chrome.storage.sync : chrome.storage.local;
        area.set({ username, password }, () => {
            statusEl.textContent = 'Saved.';
            chrome.storage.sync.set({ useSync });
        });
    });

    document.getElementById('runNow').addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'runNow' }, resp => {
            if (resp && resp.ok) statusEl.textContent = 'Triggered check.';
            else if (resp && resp.error) statusEl.textContent = 'Trigger error: ' + resp.error;
            else statusEl.textContent = 'Trigger failed.';
        });
    });

    chrome.storage.sync.get(['username', 'password', 'useSync'], res => {
        if (res.username) usernameEl.value = res.username;
        if (res.password) passwordEl.value = res.password;
        if (res.useSync) useSyncEl.checked = true;
    });
});
