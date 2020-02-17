import connections from '../../connection/connections';
import { eventDispatcher } from '../../connection/events';

export const registerEventDispatcher = (
  secret: string,
  videoElement: HTMLVideoElement
) => {
  return () => {
    if (connections.has(secret)) {
      eventDispatcher(videoElement, secret);
    }
  };
};
