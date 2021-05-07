import React, { useState, useEffect, useRef } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Modal from "react-modal";
import {
  MdAccessTime,
  MdImage,
  MdAdd,
  MdClear,
  MdArrowUpward,
  MdSyncDisabled,
  MdSync,
} from "react-icons/md";

export default function CarouselComponent({
  data,
  isEdit = false,
  del,
  setCarousel,
}) {
  const [openImageModal, setOpenImageModal] = useState(false);
  let winHeight = 1366;
  const navigate = () => {
    setOpenImageModal(!openImageModal);
    /* navigation.navigate('Project'); */
  };
  useEffect(() => {
    winHeight = window.innerHeight;
  });
  /*   const carouselRef = useRef(null);
  const snapItemOnDel = ({ index }) => {
    del();
    console.log(carouselRef.current);
    carouselRef.current.props.selectedItem = index - 1;
  }; */
  return (
    <>
      <Modal
        isOpen={openImageModal}
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
            padding: "20px",
          },
        }}
      >
        <button
          onClick={navigate}
          className="absolute top-10 focus:outline-none bg-gray-500 rounded z-30 right-5"
        >
          <MdClear size={30} color="white" />
        </button>
        <div className=" flex flex-row justify-center ">
          <Carousel
            autoPlay={true}
            showThumbs={false}
            infiniteLoop={true}
            dynamicHeight={true}
          >
            {data.map((item, index) => (
              <div key={index} className=" w-full h-auto bg-[#cfcfcf] ">
                {isEdit && (
                  <button
                    onClick={del}
                    className="absolute top-2 focus:outline-none bg-gray-100 bg-opacity-50 rounded z-40 right-10"
                  >
                    <MdClear size={30} color="red" />
                  </button>
                )}
                <img
                  className="object-contain w-full max-h-[600px]"
                  src={item.url}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </Modal>
      <div className="flex flex-row  justify-center">
        <Carousel
          onClickItem={() => setOpenImageModal(!openImageModal)}
          autoPlay={true}
          showThumbs={false}
          infiniteLoop={true}
          swipeable={true}
          dynamicHeight={true}
          onChange={setCarousel}
          /* ref={carouselRef} */
        >
          {data.map((item, index) => (
            <div
              key={index}
              className=" cursor-pointer justify-center items-center bg-[#cfcfcf] flex"
            >
              <img className="object-cover w-full h-64" src={item.url} />
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
}
