import { useCallback } from "react";

import { useState, useRef } from "react";

export default function useChatMessages(currentUser, otherUser, chatService) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleNewMessage = useCallback(
    (msg) => {
      setMessages((prev) => {
        const filtered = prev.filter(
          (m) =>
            m.id !== msg.id &&
            !(
              m.id &&
              m.id.startsWith("temp_") &&
              m.content === msg.content &&
              m.senderId === msg.senderId &&
              m.recipientId === msg.recipientId
            )
        );
        return [...filtered, msg];
      });
      scrollToBottom();
    },
    [scrollToBottom]
  );

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !otherUser?.id) return;
    const isOwner = currentUser?.role === "OWNER";
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      senderId: currentUser.id,
      recipientId: otherUser.id,
      content: newMessage.trim(),
      type: "text",
      createdAt: new Date().toISOString(),
      optimistic: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    chatService.sendMessageToUser(
      otherUser.id,
      newMessage.trim(),
      "text",
      isOwner
    );
    setNewMessage("");
    scrollToBottom();
  }, [newMessage, otherUser, currentUser, chatService, scrollToBottom]);

  const handleInputChange = (e) => setNewMessage(e.target.value);
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messages,
    setMessages,
    handleNewMessage,
    handleSendMessage,
    handleInputChange,
    handleKeyPress,
    newMessage,
    setNewMessage,
    messagesEndRef,
    scrollToBottom,
  };
}
