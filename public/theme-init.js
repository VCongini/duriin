(() => {
    const root = document.documentElement;
    let storedMode = null;
    let storedLayout = null;

    try {
        storedMode = localStorage.getItem('duriin-theme-mode');
        storedLayout = localStorage.getItem('duriin-theme-layout');
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }

    const mode = storedMode === 'light' || storedMode === 'dark'
        ? storedMode
        : window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark';
    const layout = storedLayout === 'modern' ? 'modern' : 'brutalist';

    root.setAttribute('data-theme-mode', mode);
    root.setAttribute('data-theme-layout', layout);
})();
