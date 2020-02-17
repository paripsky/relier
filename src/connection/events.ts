import dataChannels from './dataChannels';

const dispatchEventToPeer = (
  e: MouseEvent | KeyboardEvent | Event,
  dataChannel: RTCDataChannel
) => {
  const mouseEvent = e as MouseEvent;
  const keyboardEvent = e as KeyboardEvent;
  if (dataChannel.readyState !== 'open') {
    return;
  }

  dataChannel.send(
    JSON.stringify({
      type: e.type,
      coordinates: {
        x: mouseEvent.x,
        y: mouseEvent.y,
      },
      key: keyboardEvent.key,
    })
  );
};

export const eventDispatcher = (element: HTMLVideoElement, secret: string) => {
  const getDataChannel = () => dataChannels.get(secret) as RTCDataChannel;
  const eventHandler = (e: MouseEvent | KeyboardEvent | Event) =>
    dispatchEventToPeer(e, getDataChannel());

  element.addEventListener('mousemove', eventHandler);
  element.addEventListener('click', eventHandler);
  element.addEventListener('contextmenu', eventHandler);
  element.addEventListener('scroll', eventHandler);
};
