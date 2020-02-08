const { ipcRenderer, remote } = window.require('electron');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'F4':
      ipcRenderer.send('restart');
      break;
    case 'F12':
      remote.getCurrentWindow().toggleDevTools();
      break;
    case 'F5':
      window.location.reload();
      break;
    default:
  }
});
