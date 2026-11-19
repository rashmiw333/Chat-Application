
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import MessageList from "./MessageList";
import "./chat.css";

const socket = io("https://chatapplicationbackend-delta.vercel.app");

export const Chat = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const typingTimeout = useRef(null);

  // Register user and fetch users
  useEffect(() => {
    const registerUser = () => {
      socket.emit("register_user", user.username);
    };

    socket.on("connect", registerUser);

    if (socket.connected) {
      registerUser();
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          "https://chatapplicationbackend-delta.vercel.app/users",
          {
            params: { currentUser: user.username },
          }
        );

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();

    return () => {
      socket.off("connect", registerUser);
    };
  }, [user.username]);

  // Listen for messages and typing events
  useEffect(() => {
    if (!currentChat) return;

    const receiveMessage = (data) => {
      if (
        data.sender === currentChat &&
        data.receiver === user.username
      ) {
        setMessages((prev) => [...prev, data]);

        // Confirm delivery and read status
        if (data._id) {
          socket.emit("message_delivered", data._id);
          socket.emit("message_read", data._id);
        }
      }
    };

    // Receive typing event
    const handleTyping = (data) => {
      console.log("Typing event received:", data);
      setIsTyping(true);
    };

    // Receive stop typing event
    const handleStopTyping = () => {
      setIsTyping(false);
    };

    // Message sent confirmation
    const handleMessageSent = (data) => {
      if (
        data.sender === user.username &&
        data.receiver === currentChat
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    // Update message status
    const handleMessageStatus = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, status: data.status }
            : msg
        )
      );
    };

    socket.on("receive_message", receiveMessage);
    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);
    socket.on("message_sent", handleMessageSent);
    socket.on("message_status", handleMessageStatus);

    return () => {
      socket.off("receive_message", receiveMessage);
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
      socket.off("message_sent", handleMessageSent);
      socket.off("message_status", handleMessageStatus);
    };
  }, [currentChat, user.username]);

  // Fetch messages when selecting a user
  const fetchMessages = async (receiver) => {
    try {
      clearTimeout(typingTimeout.current);

      setCurrentChat(receiver);
      setIsTyping(false);
      setCurrentMessage("");
      setShowEmojiPicker(false);

      const { data } = await axios.get(
        "https://chatapplicationbackend-delta.vercel.app/messages",
        {
          params: {
            sender: user.username,
            receiver,
          },
        }
      );

      // Mark received messages as read
      const updatedMessages = data.map((msg) => {
        if (
          msg.receiver === user.username &&
          msg.status !== "read"
        ) {
          socket.emit("message_read", msg._id);

          return { ...msg, status: "read" };
        }

        return msg;
      });

      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!currentMessage.trim() || !currentChat) return;

    const messageData = {
      sender: user.username,
      receiver: currentChat,
      message: currentMessage.trim(),
    };

    socket.emit("send_message", messageData);

    // Stop typing when message is sent
    socket.emit("stop_typing", {
      sender: user.username,
      receiver: currentChat,
    });

    clearTimeout(typingTimeout.current);

    setCurrentMessage("");
    setIsTyping(false);
    setShowEmojiPicker(false);
  };

  // Handle typing
  const handleTypingInput = (e) => {
    const value = e.target.value;

    setCurrentMessage(value);

    if (!currentChat) return;

    if (value.trim()) {
      console.log("Sending typing event:", {
        sender: user.username,
        receiver: currentChat,
      });

      socket.emit("typing", {
        sender: user.username,
        receiver: currentChat,
      });
    } else {
      socket.emit("stop_typing", {
        sender: user.username,
        receiver: currentChat,
      });
    }
  };

  // Add selected emoji
  const handleEmojiClick = (emojiData) => {
    setCurrentMessage((prev) => prev + emojiData.emoji);
  };

  // // Cleanup typing timeout
  // useEffect(() => {
  //   return () => {
  //     clearTimeout(typingTimeout.current);
  //   };
  // }, []);

  return (
    <div className="chat-container">
      <h2 className="welcome-heading">
        Welcome, {user.username}
      </h2>

      <div className="chat-list">
        <h3>Chats</h3>

        {users.map((u) => (
          <div
            key={u._id}
            className={`chat-user ${
              currentChat === u.username ? "active" : ""
            }`}
            onClick={() => fetchMessages(u.username)}
          >
            {u.username}
          </div>
        ))}
      </div>

      {currentChat && (
        <div className="chat-window">
          <h5>You are chatting with {currentChat}</h5>

          {isTyping && (
            <p className="typing-indicator">
              {currentChat} is typing...
            </p>
          )}

          <MessageList
            messages={messages}
            user={user}
          />

          <div className="message-field">
            <button
              type="button"
              className="emoji-button"
              onClick={() =>
                setShowEmojiPicker((prev) => !prev)
              }
            >
              😊
            </button>

            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  skinTonesDisabled={true}
                />
              </div>
            )}

            <input
              type="text"
              className="message-input"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={handleTypingInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              type="button"
              className="btn-prime"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
