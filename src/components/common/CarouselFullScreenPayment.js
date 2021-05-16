import React, { useState, useEffect, useRef } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Modal from "react-modal";
import { MdAccessTime, MdImage, MdAdd, MdClear } from "react-icons/md";
import { XCircle, CheckCircle, Loader } from "react-feather";
export default function CarouselFullScreenPayment({
  data,
  setCarousel,
  setOpenImageModal,
  openImageModal,
  index,
}) {
  let winHeight = 660;
  let imageHeight = "h-[" + Math.round(winHeight * 0.8) + "px]";
  if (process.browser) {
    winHeight = window.innerHeight;
    imageHeight = "h-[" + Math.round(winHeight * 0.8) + "px]";
  }

  const navigate = () => {
    var temp = [...openImageModal];
    temp[index] = !temp[index];
    setOpenImageModal(temp);
    /* navigation.navigate('Project'); */
  };
  /*   const carouselRef = useRef(null);
  const snapItemOnDel = ({ index }) => {
    del();
    console.log(carouselRef.current);
    carouselRef.current.props.selectedItem = index - 1;
  }; */
  return (
    <>
      <Modal
        isOpen={openImageModal[index]}
        onRequestClose={navigate}
        contentLabel="Thành Công"
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            zIndex: 20,
          },
          content: {
            position: "absolute",

            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",
            border: "0px solid #ccc",
            backgroundColor: "transparent",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "5px",
          },
        }}
      >
        <div className=" flex flex-row justify-center ">
          <Carousel autoPlay={true} infiniteLoop={true} dynamicHeight={true}>
            {data.map((item, index) => (
              <div key={index} className=" w-full  bg-[#cfcfcf] ">
                <button
                  onClick={navigate}
                  className="absolute top-10 focus:outline-none bg-gray-500 rounded z-30 right-8"
                >
                  <MdClear size={30} color="white" />
                </button>
                <img
                  className="object-contain w-full max-h-[600px]"
                  src={item.url}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </Modal>
    </>
  );
}
