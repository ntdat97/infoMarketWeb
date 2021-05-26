import React, { useState } from "react";
import Modal from "react-modal";
export const ErrorPaymentModal = ({
  setModalVisible,
  modalVisible,
  errorText = "Có lỗi xảy ra, vui lòng thử lại",
}) => {
  errorText =
    "Bạn phải thêm phương thức thanh toán " +
    modalVisible[1].map(
      (item) => item.ProjectPaymentMethodId.toUpperCase() + ", "
    ) +
    " \nđể đóng góp cho dự án này";
  const navigate = () => {
    const state = [...modalVisible];
    state[0] = !modalVisible[0];
    setModalVisible(state);
    /* navigation.navigate('Project'); */
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
          <div className="my-3 text-center text-lg font-bold text-[#333333] whitespace-pre-wrap	">
            {errorText}
          </div>
          <button
            className="py-0.5 px-6 rounded-md bg-[#006A73] mt-3 mb-1"
            onClick={navigate}
          >
            <div style={{ color: "white", fontSize: 15, paddingVertical: 3 }}>
              Đồng ý
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};
