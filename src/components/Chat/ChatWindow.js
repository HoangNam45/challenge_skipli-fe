"use client";

import { useEffect, useState } from "react";

import { Input, Button, Empty, Spin } from "antd";
import { chatService } from "../../services/chatService";
import useChatMessages from "../../hooks/useChatMessages";

const ChatWindow = ({ otherUser, currentUser }) => {
  const {
    messages,
    setMessages,
    handleNewMessage,
    handleSendMessage,
    handleInputChange,
    handleKeyPress,
    newMessage,
    messagesEndRef,
    scrollToBottom,
  } = useChatMessages(currentUser, otherUser, chatService);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const messagesContainerRef = messagesEndRef;

  useEffect(() => {
    if (otherUser?.id && currentUser?.id) {
      setMessages([]);
      setHasMore(true);
      fetchMessages();
      chatService.onNewMessage(handleNewMessage);
      chatService.onError((error) => {
        console.error("Chat error:", error);
      });
      return () => {
        if (chatService.socket) {
          chatService.socket.off("new_message", handleNewMessage);
        }
      };
    } else {
      setMessages([]);
      setHasMore(true);
    }
  }, [otherUser?.id, currentUser?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchMessages = async (lastMessageId = null) => {
    if (!otherUser?.id) return;
    if (loading || loadingMore) return;
    if (!lastMessageId) setLoading(true);
    else setLoadingMore(true);
    try {
      const isOwner = currentUser?.role === "OWNER";
      const res = await chatService.getMessages(
        otherUser.id,
        20,
        lastMessageId,
        isOwner
      );
      if (res.success) {
        if (lastMessageId) {
          setMessages((prev) => {
            const all = [...res.messages, ...prev];
            const unique = [];
            const seen = new Set();
            for (const m of all) {
              if (!seen.has(m.id)) {
                unique.push(m);
                seen.add(m.id);
              }
            }
            return unique;
          });
        } else {
          setMessages(res.messages || []);
        }
        setHasMore(res.hasMore);
      }
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && hasMore && !loadingMore) {
      const oldest = messages[0];
      if (oldest) fetchMessages(oldest.id);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto !px-5"
        style={{
          minHeight: "calc(100vh - 200px)",
          maxHeight: "calc(100vh - 200px)",
        }}
        onScroll={handleScroll}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : messages.length === 0 ? (
          <Empty description="No messages yet" />
        ) : (
          <div>
            {loadingMore && (
              <div className="flex justify-center py-2">
                <Spin size="small" />
                <span className="ml-2 text-gray-500">
                  Loading more messages
                </span>
              </div>
            )}
            {messages.map((msg) => {
              const isOwn = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={` ${isOwn ? "ml-auto" : ""}`}>
                    <div
                      className={`rounded-lg !px-2 !py-1 ${
                        isOwn
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap  break-words">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="flex-1"
          />
          <Button
            type="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
