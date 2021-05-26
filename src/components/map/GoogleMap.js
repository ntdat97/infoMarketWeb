import React, { Component, useState, useEffect, useRef } from "react";
import GoogleMapReact, { fitBounds } from "google-map-react";
import {
  XCircle,
  CheckCircle,
  Loader,
  ArrowLeft,
  MapPin,
  CreditCard,
} from "react-feather";
import { LoadingSmall } from "../common/Loading";
import { useAuth } from "../../fb/auth";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/router";
import LazyLoad from "react-lazyload";
import toast, { Toaster } from "react-hot-toast";
import { LoadingModal } from "../modal/LoadingModal";
import { ModalSubmitMedia } from "../modal/ModalSubmitMedia";
import { CarouselFullScreenPhotoCollectionMap } from "../common/CarouselFullScreen";
export function GoogleMap() {
  const [projectMedia, setProjectMedia] = useState([]);
  const [itemHover, setItemHover] = useState("");
  const [reloadTable, setReloadTable] = useState(false);
  const [indexImage, setIndexImage] = useState(0);
  const [selectedItem, setSelectedItem] = useState("");
  const [listImageData, setListImageData] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [submitModal, setSubmitModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const router = useRouter();
  const itemsRef = useRef([]);
  useEffect(() => {
    if (projectMedia.length > 0) {
      itemsRef.current = itemsRef.current.slice(0, projectMedia[0].length);
      const listTemp = [];
      projectMedia[0].map((item, index) => {
        listTemp.push({
          mediaId: item.media.id,
          status: item.media.isApprove,
          url: item.media.url,
          urlPaid:
            typeof item.media.urlPaid === "undefined" ? "" : item.media.urlPaid,
          isChange: false,
        });
      });
      /* console.log(listTemp); */
      setListImageData(listTemp);
    }
  }, [projectMedia]);
  const slug = router.query.slug;
  const statusURL = router.query.status;
  const { user } = useAuth();
  async function getMediaInfo() {
    const response = await fetch(
      `/api/posts/photo-collection-map/${router.query.status}?slug=${slug}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      }
    );

    if (response.ok) {
      const re = await response.json();
      console.log(re[0]);
      setProjectMedia(re);
    } else {
      toast.error("Có lỗi xảy ra");
    }
  }
  const approve = (index) => {
    const listImageClone = [...listImageData];

    listImageClone[index].status = "APPROVE";
    listImageClone[index].isChange = true;
    setListImageData(listImageClone);
  };
  const pending = (index) => {
    const listImageClone = [...listImageData];
    listImageClone[index].status = "PENDING";
    listImageClone[index].isChange = true;
    setListImageData(listImageClone);
  };
  const reject = (index) => {
    const listImageClone = [...listImageData];

    listImageClone[index].status = "REJECT";
    listImageClone[index].isChange = true;
    setListImageData(listImageClone);
  };
  const reviewMedia = async ({
    listImagePending,
    listImageApprove,
    listImageReject,
  }) => {
    setLoadingModal(true);
    if (!slug) return;
    const req = await fetch(`/api/posts/review-media?slug=${slug}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await user.getIdToken(true)}`,
      },
      body: JSON.stringify({
        listImagePending: listImagePending,
        listImageApprove: listImageApprove,
        listImageReject: listImageReject,
      }),
    });

    const data = await req.json();

    console.log(data[0].count + data[1].count + data[2].count);
    if (!req.ok) {
      setStatus("error");
      toast.error("Có lỗi xảy ra");
      setLoadingModal(false);
    }
    const count = data[0].count + data[1].count + data[2].count;
    setLoadingModal(false);
    setSubmitModal(true);
    setStatus(count);
  };
  const confirm = () => {
    const listImagePending = [];
    const listImageApprove = [];
    const listImageReject = [];
    listImageData.map((item, index) => {
      if (item.isChange) {
        if (item.status === "PENDING") {
          listImagePending.push(item.mediaId);
        } else if (item.status === "APPROVE") {
          listImageApprove.push(item.mediaId);
        } else if (item.status === "REJECT") {
          listImageReject.push(item.mediaId);
        }
      }
    });
    reviewMedia({ listImagePending, listImageApprove, listImageReject });
  };
  const setReloadTableButton = () => {
    setReloadTable(!reloadTable);
  };
  useEffect(() => {
    if (slug) {
      getMediaInfo();
    }
  }, [slug]);
  const [center, setCenter] = useState({
    lat: 10.0302296,
    lng: 105.7713349,
  });
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);

  const defaultProps = {
    center: {
      lat: 10.0302296,
      lng: 105.7713349,
    },
    zoom: 12,
  };
  const Marker = ({ item, index }) => {
    /*     console.log(
      item.media.paidState == false
        ? item.media.isApprove === "PENDING"
          ? "#c3c900"
          : item.media.isApprove === "APPROVE"
          ? "#21b532"
          : item.media.isApprove === "REJECT"
          ? "#ff0000"
          : "#b0b0b0"
        : "#2e43ff"
    ); */
    return (
      <>
        {/* <div className=" rounded-full w-5 h-5 bg-[#ff0000] " /> */}
        <button
          onMouseEnter={() => setItemHover(item.id)}
          onMouseLeave={() => setItemHover("")}
          className={` rounded-full  ${
            itemHover === item.id
              ? "w-5 h-5"
              : selectedItem === item.id
              ? " w-5 h-5 bg-[#19ff21]"
              : "w-3 h-3"
          }  bg-[${
            item.media.paidState == false
              ? item.media.isApprove === "PENDING"
                ? "#c3c900"
                : item.media.isApprove === "APPROVE"
                ? "#21b532"
                : item.media.isApprove === "REJECT"
                ? "#ff0000"
                : "#b0b0b0"
              : "#2e43ff"
          }] focus:outline-none hover:bg-[${
            item.media.isApprove === "PENDING"
              ? "#c3c900"
              : item.media.isApprove === "APPROVE"
              ? "#19ff21"
              : "#a3a3a3"
          }] hover:w-5 hover:h-5 duration-150 transform `}
          onClick={() => {
            itemsRef.current[index].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            setSelectedItem(item.id);
            map.panTo({ lat: item.lat, lng: item.long });
          }}
        ></button>
      </>
    );
  };
  return (
    <>
      <div className="flex flex-row mx-4">
        <Toaster />
        <ModalSubmitMedia
          modalVisible={submitModal}
          setModalVisible={setSubmitModal}
          successText={"Đã cập nhât " + status + " hình ảnh"}
          setReloadTable={setReloadTableButton}
        />
        <LoadingModal
          setModalVisible={setLoadingModal}
          modalVisible={loadingModal}
          loadingText="Đang ghi nhận kết quả"
        />
        <CarouselFullScreenPhotoCollectionMap
          data={listImageData}
          openImageModal={openImageModal}
          setOpenImageModal={setOpenImageModal}
          index={indexImage}
          approve={approve}
          reject={reject}
          pending={pending}
          isPaid={statusURL === "paid" ? true : false}
        />
        <div className="w-3/4">
          <div style={{ height: "100vh", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyCXm0aRrGqJaxurRZ2f3IosQrJ_4x9gIEs",
              }}
              defaultCenter={defaultProps.center}
              yesIWantToUseGoogleMapApiInternals={true}
              onGoogleApiLoaded={({ map, maps }) => {
                const styles = {
                  default: [],
                  hide: [
                    {
                      featureType: "poi.business",
                      stylers: [{ visibility: "off" }],
                    },
                    {
                      featureType: "transit",
                      elementType: "labels.icon",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                };
                map.setOptions({
                  styles: styles["default"],
                });

                setMaps(maps);
                setMap(map);
              }}
              defaultZoom={defaultProps.zoom}
            >
              {projectMedia.length > 0 &&
                projectMedia[0].map((item, index) => (
                  <Marker
                    key={index}
                    index={index}
                    item={item}
                    lat={item.lat}
                    lng={item.long}
                  />
                ))}
            </GoogleMapReact>
          </div>
        </div>
        <div className="w-1/4 h-screen overflow-y-scroll ml-2 pb-10 ">
          {/*  {console.log(projectMedia[0])} */}
          <div className="sticky top-0 bg-gray-200 p-2 justify-center items-center flex rounded-md">
            <Link
              href={{
                pathname: "/project/[slug]/payment",
                query: { slug: slug },
              }}
            >
              <a className="text-center mr-4 text-white shadow bg-[#ff8a24] justify-center items-center rounded-xl h-full py-1.5 px-2">
                Thanh toán
              </a>
            </Link>
            <button
              onClick={confirm}
              className="text-center text-white shadow bg-[#2e43ff] justify-center items-center rounded-xl h-full py-1 px-2"
            >
              Xác nhận
            </button>
          </div>
          {projectMedia.length > 0 ? (
            projectMedia[0].map((item, index) => (
              <div
                key={index}
                className={`m-1 p-3 rounded-lg hover:bg-gray-300 ${
                  itemHover === item.id && "bg-gray-300"
                } ${selectedItem === item.id && "bg-green-200"}`}
              >
                <button
                  onClick={() => {
                    setOpenImageModal(true);
                    setIndexImage(index);
                  }}
                >
                  <LazyLoad>
                    <img
                      ref={(el) => (itemsRef.current[index] = el)}
                      onClick={() =>
                        map.panTo({ lat: item.lat, lng: item.long })
                      }
                      onMouseEnter={() => setItemHover(item.id)}
                      onMouseLeave={() => setItemHover("")}
                      src={
                        typeof item.media.urlPaid === "undefined"
                          ? item.media.url
                          : item.media.urlPaid
                      }
                      className={`h-[200px] object-cover w-full`}
                    />
                  </LazyLoad>
                </button>

                <div className="flex flex-row justify-between items-center mx-3 py-2">
                  {typeof item.media.urlPaid != "undefined" ? null /* (
                    <CreditCard color="green" size={40} />
                  ) */ : (
                    <>
                      <button
                        className="focus:outline-none"
                        onClick={() => pending(index)}
                      >
                        <Loader
                          color={
                            listImageData[index]?.status === "PENDING"
                              ? "#c3c900"
                              : "gray"
                          }
                          size={40}
                        />
                      </button>
                      <button
                        className="focus:outline-none"
                        onClick={() => reject(index)}
                      >
                        <XCircle
                          color={
                            listImageData[index]?.status === "REJECT"
                              ? "red"
                              : "gray"
                          }
                          size={40}
                        />
                      </button>
                      <button
                        onClick={() => approve(index)}
                        className="focus:outline-none"
                      >
                        <CheckCircle
                          color={
                            listImageData[index]?.status === "APPROVE"
                              ? "green"
                              : "gray"
                          }
                          size={40}
                        />
                      </button>{" "}
                    </>
                  )}
                  <button
                    onClick={() => map.panTo({ lat: item.lat, lng: item.long })}
                    className="focus:outline-none"
                  >
                    <MapPin color="#19ff21" size={40} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <LoadingSmall />
          )}
          <div className="mb-10" />
        </div>
      </div>
    </>
  );
}
