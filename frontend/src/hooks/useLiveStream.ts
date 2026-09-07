import { useState, useEffect } from 'react';
import { liveStream } from '../services/websocket';
import { StreamEvent } from '../types';

export function useLiveStream() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<StreamEvent | null>(null);

  useEffect(() => {
    const unsubStatus = liveStream.onStatusChange((status) => {
      setIsConnected(status);
    });

    const unsubMsg = liveStream.onMessage((evt) => {
      setLastEvent(evt);
    });

    return () => {
      unsubStatus();
      unsubMsg();
    };
  }, []);

  return { isConnected, lastEvent };
}
