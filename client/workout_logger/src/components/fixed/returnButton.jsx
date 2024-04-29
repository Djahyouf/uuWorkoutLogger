import React from "react";
import { useLocation } from "react-router-dom";

const ReturnButton = () => {
  const location = useLocation();

  const handleReturn = () => {
    window.history.back();
  };

  return (
    <button
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        width: "90px",
        height: "90px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "40px",
      }}
      onClick={handleReturn}
    >
      {"<"}
    </button>
  );
};

export default ReturnButton;
