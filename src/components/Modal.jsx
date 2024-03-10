// Modal.jsx
import React from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 backdrop-filter backdrop-blur-sm">
      <div className="bg-white p-4 rounded-md">
        {children}
        {/* <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Close
        </button> */}
      </div>
    </div>
  );
};

export default Modal;
