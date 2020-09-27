import React from "react";

export const Message = ({ message }) => {
  const styles = {
    padding: "0.1rem 1rem",
    maxWidth: "80%",
    minWidth: "150px",
    borderRadius: "4px",
    display: "inline-block",
    position: "relative"
  };
  if (message.my) {
    return (
      <div className="" style={{ display: "flex", justifyContent: "flex-end" }}>
        <div className="card message-to" style={{ ...styles }}>
          <p>{message.text}</p>
          <span style={{ fontSize: "10px", position: "absolute", top: "5px", right: "5px" }}>
            {new Date(message.date).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div className="card message-from" style={{ ...styles, backgroundColor: "#f3f3f3" }}>
        <p>{message.text}</p>
        <span style={{ fontSize: "10px", position: "absolute", top: "5px", right: "5px" }}>
          {new Date(message.date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
