export enum SocketMessageTypes {
  login = 'login',
  offer = 'offer',
  answer = 'answer',
  candidate = 'candidate',
  leave = 'leave',
}

export interface SocketMessage {
  type: SocketMessageTypes;
  payload?: MessagePayload;
  to?: string;
  from?: string;
  secret?: string;
}

type MessagePayload = RTCIceCandidate | RTCSessionDescriptionInit;

/**
 * send a message to a peer
 * @param {WebSocket} connection
 * @param {keyof SocketMessageTypes} message
 * @param {string} to
 */
export const sendMessage = (connection: WebSocket, message: SocketMessage) => {
  connection.send(JSON.stringify(message));
};

export const createLocalConnection = (
  connection: WebSocket,
  onAddStream: any,
  secret: string
) => {
  //displaying local video stream on the page
  //   localVideo.srcObject = stream;

  //using Google public stun server
  const configuration = {
    iceServers: [
      //{ url: 'stun:stun2.1.google.com:19302' }
    ],
  };

  const localConnection = new RTCPeerConnection(configuration);

  //when a remote user adds stream to the peer connection, we display it
  if (onAddStream) {
    localConnection.ontrack = (event: RTCTrackEvent) => {
      const [stream] = event.streams;
      onAddStream(stream, event);
    };
  }

  // Setup ice handling
  localConnection.onicecandidate = event => {
    if (event.candidate) {
      sendMessage(connection, {
        type: SocketMessageTypes.candidate,
        payload: event.candidate,
        secret,
      });
    }
  };

  return localConnection;
};

/**
 * call another user
 * @param {WebSocket} connection
 * @param {RTCPeerConnection} localConnection
 * @param {string} to
 */
export const call = async (
  connection: WebSocket,
  localConnection: RTCPeerConnection,
  secret: string
) => {
  const offer = await localConnection.createOffer();
  sendMessage(connection, {
    type: SocketMessageTypes.offer,
    payload: offer,
    secret,
  });

  localConnection.setLocalDescription(offer);
};

/**
 *
 * @param {WebSocket} connection
 * @param {RTCPeerConnection} localConnection
 * @param {RTCOfferAnswerOptions} offer
 * @param {string} from
 */
export const handleOffer = async (
  connection: WebSocket,
  localConnection: RTCPeerConnection,
  offer: RTCSessionDescription,
  from: string
) => {
  localConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await localConnection.createAnswer();
  localConnection.setLocalDescription(answer);

  sendMessage(connection, {
    type: SocketMessageTypes.answer,
    payload: answer,
    from,
  });
};

const handleAnswer = (
  localConnection: RTCPeerConnection,
  answer: RTCSessionDescription
) => {
  localConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

const handleCandidate = (
  localConnection: RTCPeerConnection,
  candidate: RTCIceCandidateInit
) => {
  localConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

const handleLeave = (localConnection: RTCPeerConnection) => {
  localConnection.close();
  localConnection.onicecandidate = null;
  localConnection.ontrack = null;
};

export const hangUp = (
  connection: WebSocket,
  localConnection: RTCPeerConnection,
  secret: string
) => {
  sendMessage(connection, {
    type: SocketMessageTypes.leave,
    secret,
  });

  handleLeave(localConnection);
};

const onMessage = (
  connection: WebSocket,
  localConnection: RTCPeerConnection,
  onLogin: any
) => (message: MessageEvent) => {
  console.log('Got message', message.data);
  const data = JSON.parse(message.data);

  switch (data.type) {
    case 'login':
      onLogin(data.id);
      break;
    //when somebody wants to call us
    case 'offer':
      handleOffer(connection, localConnection, data.payload, data.id);
      break;
    case 'answer':
      handleAnswer(localConnection, data.payload);
      break;
    //when a remote peer sends an ice candidate to us
    case 'candidate':
      handleCandidate(localConnection, data.payload);
      break;
    case 'leave':
      handleLeave(localConnection);
      break;
    default:
      break;
  }
};

export interface Connection {
  connection: WebSocket;
  localConnection: RTCPeerConnection;
}

export const connect = (
  url: string,
  onStream: any,
  secret: string,
  { onLogin }: any
): Promise<Connection> => {
  return new Promise(resolve => {
    const connection = new WebSocket(url);
    const localConnection = createLocalConnection(connection, onStream, secret);
    connection.onmessage = onMessage(connection, localConnection, onLogin);
    connection.onerror = console.error;
    connection.onopen = () => resolve({ connection, localConnection });
  });
};
