import React, { useState } from "react";
import Modal from "react-modal";
export const LoadingModal = ({ setModalVisible, modalVisible }) => {
  const navigate = () => {
    setModalVisible(!modalVisible);
    /* navigation.navigate('Project'); */
  };
  return (
    <Modal
      ariaHideApp={false}
      isOpen={modalVisible}
      onRequestClose={navigate}
      contentLabel="Thành Công"
      style={{
        overlay: {
          zIndex: 50,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        },
        content: {
          position: "absolute",
          top: "100px",
          left: "40px",
          right: "40px",
          bottom: "40px",
          border: "0px solid #ccc",
          backgroundColor: "transparent",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
        },
      }}
    >
      <div className="justify-center items-center mt-5 flex">
        <div className="m-5 bg-white rounded-xl p-3 items-center shadow justify-center flex flex-col px-7">
          <div className="my-3 text-center text-lg font-bold text-[#333333] mb-5">
            Đang gởi ảnh
          </div>

          <div className="grid place-items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </Modal>
  );
};
