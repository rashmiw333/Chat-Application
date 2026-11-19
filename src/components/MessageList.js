
import React from "react";

const MessageList = ({ messages, user }) => {

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatus = (status) => {
    if (status === "read") {
      return <span className="read-tick">✓✓</span>;
    }

    if (status === "delivered") {
      return <span className="delivered-tick">✓✓</span>;
    }

    return <span className="sent-tick">✓</span>;
  };

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div
          key={msg._id || index}
          className={`message ${
            msg.sender === user.username ? "sent" : "received"
          }`}
        >
          <strong>{msg.sender}: </strong>

          <span>{msg.message}</span>

          <div className="message-info">
            <small>{formatTime(msg.createdAt)}</small>

            {msg.sender === user.username &&
              getStatus(msg.status)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
