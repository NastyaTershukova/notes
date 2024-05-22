const userPrefersDark=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
function checkTheme () {
  if (userPrefersDark) {
    document.documentElement.setAttribute('dark-theme', 'true');
  }
}

checkTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme=e.matches?'dark':'light';
    if (newColorScheme=='dark') {
      document.documentElement.setAttribute('dark-theme', 'true');
    } else {
      document.documentElement.setAttribute('dark-theme', 'false');
    }
});
