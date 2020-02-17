export default interface Connection {
  connection: WebSocket;
  localConnection: RTCPeerConnection;
  token: string;
}
