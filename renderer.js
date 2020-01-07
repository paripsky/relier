// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { desktopCapturer } = require('electron');

document.addEventListener('keydown', function(e) {
  if (e.which === 123) {
    require('electron')
      .remote.getCurrentWindow()
      .toggleDevTools();
  } else if (e.which === 116) {
    location.reload();
  }
});

desktopCapturer
  .getSources({ types: [/* 'window', */ 'screen'] })
  .then(async sources => {
    console.log(sources);
    // return;
    for (const source of sources) {
      //   if (source.name === 'Electron') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720,
            },
          },
        });
        handleStream(stream);
      } catch (e) {
        handleError(e);
      }
      return;
      //   }
    }
  });

function handleStream(stream) {
  const video = document.querySelector('video');
  video.srcObject = stream;
  video.onloadedmetadata = e => video.play();
}

function handleError(e) {
  console.log(e);
}
