import { useEffect, useState } from "react";
import { chatService } from "../services/chatService";

export default function useChatSocket(user) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      (async () => {
        const socketInstance = await chatService.initialize(user);
        if (isMounted) setSocket(socketInstance);
      })();
    }
    return () => {
      isMounted = false;
      chatService.disconnect();
    };
  }, [user]);

  return socket;
}
