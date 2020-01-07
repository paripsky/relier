let conf = { iceServers: [{ urls: [] }] };
let pc = new RTCPeerConnection(conf);
let localStream,
  _fileChannel,
  chatEnabled,
  context,
  source,
  _chatChannel,
  sendFileDom = {},
  recFileDom = {},
  receiveBuffer = [],
  receivedSize = 0,
  file,
  bytesPrev = 0;

const errHandler = console.error;

pc.ondatachannel = function(e) {
  if (e.channel.label === 'chatChannel') {
    console.log('chatChannel Received -', e);
    _chatChannel = e.channel;
    chatChannel(e.channel);
  }
};

pc.onicecandidate = function(e) {
  var cand = e.candidate;
  if (!cand) {
    console.log('iceGatheringState complete', pc.localDescription);
    // localOffer.value = JSON.stringify(pc.localDescription);
  } else {
    console.log(cand.candidate);
  }
};
pc.oniceconnectionstatechange = function() {
  console.log('iceconnectionstatechange: ', pc.iceConnectionState);
};
// pc.onaddstream = function(e) {
//   console.log('remote onaddstream', e.stream);
//   remote.src = URL.createObjectURL(e.stream);
// };
pc.onconnection = function(e) {
  console.log('onconnection ', e);
};

const setRemoteOffer = remoteOffer => {
  var _remoteOffer = new RTCSessionDescription(JSON.parse(remoteOffer));
  console.log('remoteOffer \n', _remoteOffer);
  pc.setRemoteDescription(_remoteOffer)
    .then(function() {
      console.log('setRemoteDescription ok');
      if (_remoteOffer.type === 'offer') {
        pc.createAnswer()
          .then(function(description) {
            console.log('createAnswer 200 ok \n', description);
            pc.setLocalDescription(description)
              .then(function() {})
              .catch(errHandler);
          })
          .catch(errHandler);
      }
    })
    .catch(errHandler);
};

const createLocalOffer = () => {
  if (chatEnabled) {
    _chatChannel = pc.createDataChannel('chatChannel');
    chatChannel(_chatChannel);
  }
  pc.createOffer()
    .then(des => {
      console.log('createOffer ok ');
      pc.setLocalDescription(des)
        .then(() => {
          setTimeout(function() {
            if (pc.iceGatheringState === 'complete') {
              return;
            } else {
              console.log('after GatherTimeout', pc.localDescription);
              //   localOffer.value = JSON.stringify(pc.localDescription);
            }
          }, 2000);
          console.log('setLocalDescription ok');
        })
        .catch(errHandler);
      // For chat
    })
    .catch(errHandler);
};

function chatChannel(e) {
  _chatChannel.onopen = function(e) {
    console.log('chat channel is open', e);
  };
  _chatChannel.onmessage = function(e) {
    // chat.innerHTML = chat.innerHTML + '<pre>' + e.data + '</pre>';
    console.log(e.data);
  };
  _chatChannel.onclose = function() {
    console.log('chat channel closed');
  };
}

function sendMsg() {
  //   var text = sendTxt.value;
  //   chat.innerHTML = chat.innerHTML + '<pre class=sent>' + text + '</pre>';
  //   _chatChannel.send(text);
  //   sendTxt.value = '';
  return false;
}
