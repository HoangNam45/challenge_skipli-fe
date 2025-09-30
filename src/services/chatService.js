import createApiInstance from "./apiConfig";
import io from "socket.io-client";

const api = createApiInstance();

export const chatService = {
  socket: null,

  initialize: async (user) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return null;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    chatService.socket = io(socketUrl, {
      auth: {
        token: token,
        user: user,
      },
      transports: ["websocket", "polling"],
    });

    return chatService.socket;
  },

  disconnect: () => {
    if (chatService.socket) {
      chatService.socket.disconnect();
      chatService.socket = null;
    }
  },

  getAllEmployees: async () => {
    try {
      const response = await api.get("/chat/employees");
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  getMessages: async (
    otherUserId,
    limit = 20,
    lastMessageId = null,
    isOwner = false
  ) => {
    let targetId = otherUserId;
    if (isOwner == false) {
      targetId = `owner_${otherUserId}`;
    }
    try {
      const params = { limit };
      if (lastMessageId) {
        params.lastMessageId = lastMessageId;
      }
      const response = await api.get(`/chat/messages/${targetId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  sendMessageToUser: (
    recipientId,
    content,
    messageType = "text",
    isOwner = false
  ) => {
    let targetId = recipientId;
    if (isOwner == false) {
      targetId = `owner_${recipientId}`;
    }
    if (chatService.socket) {
      chatService.socket.emit("send_message_to_user", {
        recipientId: targetId,
        content,
        messageType,
      });
    }
  },

  onNewMessage: (callback) => {
    if (chatService.socket) {
      chatService.socket.on("new_message", callback);
    }
  },

  onMessageSent: (callback) => {
    if (chatService.socket) {
      chatService.socket.on("message_sent", callback);
    }
  },

  onError: (callback) => {
    if (chatService.socket) {
      chatService.socket.on("error", callback);
    }
  },
};

export default chatService;
