import React, { useState, useEffect, useRef } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Modal from "react-modal";
import { MdAccessTime, MdImage, MdAdd, MdClear } from "react-icons/md";
import { XCircle, CheckCircle, Loader } from "react-feather";
function CarouselFullScreenPhotoCollectionMap({
  data,
  setCarousel,
  setOpenImageModal,
  openImageModal,
  index,
  pending,
  reject,
  approve,
  isPaid = false,
}) {
  let winHeight = 660;
  let imageHeight = "h-[" + Math.round(winHeight * 0.8) + "px]";
  if (process.browser) {
    winHeight = window.innerHeight;
    imageHeight = "h-[" + Math.round(winHeight * 0.8) + "px]";
  }
  const navigate = () => {
    setOpenImageModal(!openImageModal);
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
        isOpen={openImageModal}
        onRequestClose={navigate}
        contentLabel="Thành Công"
        ariaHideApp={false}
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
          <Carousel
            infiniteLoop={true}
            dynamicHeight={true}
            selectedItem={index}
            swipeable={true}
            swipeScrollTolerance={5}
            showThumbs={false}
            showIndicators={true}
            useKeyboardArrows={true}
            emulateTouch={true}
          >
            {data.map((item, index) => (
              <div key={index} className=" w-full  bg-[#cfcfcf] ">
                <button
                  onClick={navigate}
                  className="absolute top-10 focus:outline-none bg-gray-500 rounded z-30 right-8"
                >
                  <MdClear size={30} color="white" />
                </button>
                {item.urlPaid === "" && (
                  <>
                    <button
                      onClick={() => pending(index)}
                      className="absolute top-32 focus:outline-none bg-gray-500 rounded z-30 right-8"
                    >
                      <Loader
                        size={30}
                        color={item.status === "PENDING" ? "#c3c900" : "white"}
                      />
                    </button>
                    <button
                      onClick={() => reject(index)}
                      className="absolute top-44 focus:outline-none bg-gray-500 rounded z-30 right-8"
                    >
                      <XCircle
                        size={30}
                        color={item.status === "REJECT" ? "red" : "white"}
                      />
                    </button>
                    <button
                      onClick={() => approve(index)}
                      className="absolute top-56 focus:outline-none bg-gray-500 rounded z-30 right-8"
                    >
                      <CheckCircle
                        size={30}
                        color={item.status === "APPROVE" ? "#19ff21" : "white"}
                      />
                    </button>
                  </>
                )}

                {/* {isEdit && (
                  <button
                    onClick={del}
                    className="absolute top-2 focus:outline-none bg-gray-100 bg-opacity-50 rounded z-40 right-10"
                  >
                    <MdClear size={30} color="red" />
                  </button>
                )} */}
                <img
                  className="object-contain w-full max-h-[600px]"
                  src={item.urlPaid === "" ? item.url : item.urlPaid}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </Modal>
    </>
  );
}
function CarouselFullScreenPhotoCollection({
  data,
  setCarousel,
  setOpenImageModal,
  openImageModal,
  index,
  pending,
  reject,
  approve,
  isPaid = false,
}) {
  console.log(data);
  let winHeight = 660;
  let imageHeight = "h-[" + Math.round(winHeight * 0.8) + "px]";
  if (process.browser) {
    winHeight = window.innerHeight;
    imageHeight = "h-[" + Math.round(winHeight * 0.8) + "px]";
  }
  const navigate = () => {
    setOpenImageModal(!openImageModal);
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
        isOpen={openImageModal}
        onRequestClose={navigate}
        contentLabel="Thành Công"
        ariaHideApp={false}
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
          <Carousel
            infiniteLoop={true}
            selectedItem={index}
            swipeable={true}
            dynamicHeight={true}
            swipeScrollTolerance={5}
            showThumbs={false}
            showIndicators={true}
            useKeyboardArrows={true}
            emulateTouch={true}
          >
            {data.map((item, index) => (
              <div key={index} className=" bg-[#cfcfcf] ">
                <button
                  onClick={navigate}
                  className="absolute top-10 focus:outline-none bg-gray-500 rounded z-30 right-8"
                >
                  <MdClear size={30} color="white" />
                </button>
                {!isPaid && (
                  <>
                    <button
                      onClick={() => pending(index)}
                      className="absolute top-32 focus:outline-none bg-gray-500 rounded z-30 right-8"
                    >
                      <Loader
                        size={30}
                        color={item.status === "PENDING" ? "#c3c900" : "white"}
                      />
                    </button>
                    <button
                      onClick={() => reject(index)}
                      className="absolute top-44 focus:outline-none bg-gray-500 rounded z-30 right-8"
                    >
                      <XCircle
                        size={30}
                        color={item.status === "REJECT" ? "red" : "white"}
                      />
                    </button>
                    <button
                      onClick={() => approve(index)}
                      className="absolute top-56 focus:outline-none bg-gray-500 rounded z-30 right-8"
                    >
                      <CheckCircle
                        size={30}
                        color={item.status === "APPROVE" ? "#19ff21" : "white"}
                      />
                    </button>
                  </>
                )}

                {/* {isEdit && (
                  <button
                    onClick={del}
                    className="absolute top-2 focus:outline-none bg-gray-100 bg-opacity-50 rounded z-40 right-10"
                  >
                    <MdClear size={30} color="red" />
                  </button>
                )} */}
                <img
                  className="object-contain w-full max-h-[600px]"
                  src={isPaid ? item.urlPaid : item.url}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </Modal>
    </>
  );
}
export {
  CarouselFullScreenPhotoCollectionMap,
  CarouselFullScreenPhotoCollection,
};
