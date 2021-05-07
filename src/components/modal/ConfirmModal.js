import React, { useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
export const ConfirmModal = ({
  setModalVisible,
  modalVisible,
  successText = "Bài viết sẽ được đưa vào lưu trữ sau khi xóa.",
  title = "Bạn có chắc chắn xóa?",
  confirmButton,
}) => {
  const router = useRouter();
  const navigate = () => {
    const state = [...modalVisible];
    state[0] = !modalVisible[0];
    setModalVisible(state);
    /* router.reload(); */
  };
  return (
    <Modal
      isOpen={modalVisible[0]}
      ariaHideApp={false}
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
        <div className="m-5 bg-white rounded-xl p-3 items-center shadow justify-center flex flex-col">
          <div className="my-3 text-center text-lg font-bold text-[#333333]">
            {title}
          </div>
          <div className="items-center font-medium text-[#333333] text-center">
            {successText}
          </div>
          <div>
            <button
              className="py-0.5 px-6 rounded-md bg-[#006A73] mt-3 mb-1 mr-5"
              onClick={navigate}
            >
              <div style={{ color: "white", fontSize: 15, paddingVertical: 3 }}>
                Hủy
              </div>
            </button>
            <button
              className="py-0.5 px-6 rounded-md bg-[#006A73] mt-3 mb-1"
              onClick={confirmButton}
            >
              <div style={{ color: "white", fontSize: 15, paddingVertical: 3 }}>
                Đồng ý
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
