import { io, Socket } from "socket.io-client";
import store from "@/lib/store";
import { setOnline, setOffline } from "@/reducers/onlineStatusReducer";
import { toast } from "@/components/ui/use-toast.ts";

const socketServerURL = import.meta.env.VITE_API_BASE_URL;

let socket: Socket | null = null;

// a queue to store events that are emitted when the socket is not initialized
let eventQueue: { event: string; callback?: (...args: any[]) => void }[] = [];

const processEventQueue = (): void => {
  while (eventQueue.length > 0) {
    const { callback } = eventQueue.shift()!;
    if (callback) callback();
  }
};

// similar to the handleError function in http.ts
const handleError = (errorMessage: unknown) => {
  console.error("Socket IO Error:: ", errorMessage)

  if (errorMessage) {
    toast({
      title: "Socket IO Error",
      description: errorMessage as string,
      variant: "destructive",
    })
  }

  throw Error(errorMessage as string);
}

export const initializeSocket = (): void => {
  console.log("Initializing socket");
  if ( !socket) {
    socket = io(socketServerURL, {withCredentials: true});

    socket.on("connect", () => {
      store.dispatch(setOnline());
    });

    socket.on("disconnect", () => {
      store.dispatch(setOffline());
    });

    socket.on("connect_error", (err) => {
      console.error(`Connect error due to: ${err.message}`);
    });
    processEventQueue();
    onEvent("errorEvent", handleError);
  } else {
    // running react in dev can cause this to happen because the app is rendered twice in dev mode
    console.warn("Socket already initialized - this should not happen outside of development.")
  }
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    store.dispatch(setOffline());
  }
};

const handleSocketError = (error: never): void => {
  handleError(error);
};

export const emitEvent = <T>(event: string, data?: T): void => {
  if (socket) {
    socket.emit(event, data, (error: never) => {
      if (error) handleSocketError(error);
    });
  } else {
    eventQueue.push({event, callback: () => emitEvent(event, data)});
    console.warn("Socket not initialized. Event queued: ", event);
  }
};

export const onEvent = <T>(event: string, callback: (data: T) => void): void => {
  if (socket) {
    socket.on(event, callback);
  } else {
    eventQueue.push({event, callback: () => onEvent(event, callback)});
    console.warn("Socket not initialized. Event queued: ", event);
  }
};

export const offEvent = (event: string): void => {
  if (socket) {
    socket.off(event);
  } else {
    // remove event from queue
    eventQueue = eventQueue.filter((e) => e.event !== event);
    console.warn("Socket not initialized. Event removed from queue: ", event);
  }
};
