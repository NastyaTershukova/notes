const userPrefersDark=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
function checkTheme () {
  let settingValue = getSetting('darkTheme');
  if (settingValue == 'Всегда светлая') {
    document.documentElement.setAttribute('dark-theme', 'false');
    return;
  }
  if ((userPrefersDark) || settingValue == 'Всегда тёмная') {
    document.documentElement.setAttribute('dark-theme', 'true');
  }
}

checkTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  console.log(getSetting('darkTheme'));
  if (getSetting('darkTheme') != 'Автоматическая') {
    return;
  }
  const newColorScheme=e.matches?'dark':'light';
  if (newColorScheme=='dark') {
    document.documentElement.setAttribute('dark-theme', 'true');
  } else {
    document.documentElement.setAttribute('dark-theme', 'false');
  }
});
