import Connection from '../models/Connection';

export enum SocketMessageTypes {
  login = 'login',
  offer = 'offer',
  answer = 'answer',
  candidate = 'candidate',
  leave = 'leave',
}

export interface LoginMessageOut {
  type: SocketMessageTypes.login;
  secret: string;
  password: string;
}

export interface OfferMessageOut {
  type: SocketMessageTypes.offer;
  offer: RTCSessionDescriptionInit;
  token: string;
}

export interface AnswerMessageOut {
  type: SocketMessageTypes.answer;
  answer: RTCSessionDescriptionInit;
  token: string;
}

export interface CandidateMessageOut {
  type: SocketMessageTypes.candidate;
  candidate: RTCIceCandidate;
  token: string;
}

export interface LeaveMessageOut {
  type: SocketMessageTypes.leave;
  token: string;
}

export type SocketMessageOut =
  | LoginMessageOut
  | OfferMessageOut
  | AnswerMessageOut
  | CandidateMessageOut
  | LeaveMessageOut;

export interface LoginMessageIn {
  type: SocketMessageTypes.login;
  error: string;
  token: string;
}

export interface OfferMessageIn {
  type: SocketMessageTypes.offer;
  offer: RTCSessionDescription;
}

export interface AnswerMessageIn {
  type: SocketMessageTypes.answer;
  answer: RTCSessionDescription;
}

export interface CandidateMessageIn {
  type: SocketMessageTypes.candidate;
  candidate: RTCIceCandidateInit;
}

export interface LeaveMessageIn {
  type: SocketMessageTypes.leave;
}

export type SocketMessageIn =
  | LoginMessageIn
  | OfferMessageIn
  | AnswerMessageIn
  | CandidateMessageIn
  | LeaveMessageIn;

export const sendMessage = (
  connection: WebSocket,
  message: SocketMessageOut
) => {
  connection.send(JSON.stringify(message));
};

export const createLocalConnection = (
  connection: WebSocket,
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
  token: string
) => {
  const offer = await localConnection.createOffer();
  await localConnection.setLocalDescription(offer);
  sendMessage(connection, {
    type: SocketMessageTypes.offer,
    offer,
    token,
  });
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
  token: string
) => {
  await localConnection.setRemoteDescription(offer);

  const answer = await localConnection.createAnswer();
  await localConnection.setLocalDescription(answer);

  sendMessage(connection, {
    type: SocketMessageTypes.answer,
    answer,
    token,
  });
};

const handleAnswer = (
  localConnection: RTCPeerConnection,
  answer: RTCSessionDescription
) => {
  localConnection.setRemoteDescription(answer);
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
  token: string
) => {
  sendMessage(connection, {
    type: SocketMessageTypes.leave,
    token,
  });

  handleLeave(localConnection);
};

const onMessage = (
  connection: WebSocket,
  localConnection: RTCPeerConnection,
  token: string
) => (message: MessageEvent) => {
  console.log('Got message', message.data);
  const data: SocketMessageIn = JSON.parse(message.data);

  switch (data.type) {
    case 'offer':
      const { offer } = data;

      if (!offer) {
        console.error('offer message without offer');
        return;
      }

      handleOffer(connection, localConnection, offer, token);
      break;
    case 'answer':
      const { answer } = data;

      if (!answer) {
        console.error('answer message has no answer');
        return;
      }

      handleAnswer(localConnection, answer);
      break;
    //when a remote peer sends an ice candidate to us
    case 'candidate':
      const { candidate } = data;

      if (!candidate) {
        console.error('candidate message has no candidate');
        return;
      }

      handleCandidate(localConnection, candidate);
      break;
    case 'leave':
      handleLeave(localConnection);
      break;
    default:
      break;
  }
};

export const connect = (
  url: string,
  secret: string,
  password: string
): Promise<Connection> => {
  return new Promise(resolve => {
    const connection = new WebSocket(url);
    const localConnection = createLocalConnection(connection, secret);
    connection.onerror = console.error;

    const onLoginMessage = (message: MessageEvent) => {
      const data: LoginMessageIn = JSON.parse(message.data);
      const { token } = data;

      if (!token) {
        console.error("couldn't login");
      }

      connection.removeEventListener('message', onLoginMessage);
      connection.addEventListener(
        'message',
        onMessage(connection, localConnection, token)
      );

      localConnection.onicecandidate = event => {
        if (event.candidate) {
          sendMessage(connection, {
            type: SocketMessageTypes.candidate,
            candidate: event.candidate,
            token,
          });
        }
      };
      resolve({ connection, localConnection, token });
    };

    connection.onopen = () =>
      sendMessage(connection, {
        type: SocketMessageTypes.login,
        secret,
        password,
      });
    connection.addEventListener('message', onLoginMessage);
  });
};
