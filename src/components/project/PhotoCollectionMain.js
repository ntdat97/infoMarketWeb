import { Tooltip } from "../common/Tooltip";
import { dateFromNow } from "../../libs/dateFromNow";
import { XCircle, CheckCircle, Loader, ArrowLeft } from "react-feather";
import { format } from "date-fns";
import Link from "next/link";
import { HeaderCollection } from "../project/HeaderCollection";
import { CarouselFullScreenPhotoCollection } from "../common/CarouselFullScreen";
import CarouselFullScreenPaid from "../common/CarouselFullScreenPaid";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { LoadingModal } from "../modal/LoadingModal";
import { ModalSubmitMedia } from "../modal/ModalSubmitMedia";
import LazyLoad from "react-lazyload";
export const PhotoCollectionMain = ({
  data,
  user,
  setReloadTable,
  page,
  pageCount,
}) => {
  const [openImageModal, setOpenImageModal] = useState(false);
  const [indexImage, setIndexImage] = useState(0);
  const [loadingModal, setLoadingModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [listImageData, setListImageData] = useState([]);
  const [status, setStatus] = useState(undefined);
  const [post, setPost] = useState(undefined);
  const router = useRouter();
  const slug = router.query.slug;
  const statusURL = router.query.status;
  /* useEffect(() => {
    if (typeof router.query.page) {
      setPage(router.query.page);
    }
  }, [router.query.page]); */
  useEffect(() => {
    const listTemp = [];
    data.map((item, index) => {
      listTemp.push({
        mediaId: item.id,
        status: item.isApprove,
        url: item.url,
        urlPaid: item?.urlPaid,
        isChange: false,
      });
    });
    /* console.log(listTemp); */
    setListImageData(listTemp);
  }, [submitModal, data]);
  const handleChange = (e) => {
    router.push(
      `/project/${slug}/photo-collection/${statusURL}?page=${e.selected + 1}`
    );
    setReloadTable();
    /* if (e.selected !== 0) {
      router.push(
        `/project/${slug}/photo-collection/${statusURL}?page=${e.selected}`
      );
      setReloadTable();
    } else {
      router.push(`/project/${slug}/photo-collection/${statusURL}`);
      setReloadTable();
    } */
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
    setPost(data);
    setLoadingModal(false);
    setSubmitModal(true);
    setStatus(count);
  };
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
  if (data.length > 0 && listImageData.length > 0 && statusURL != null) {
    return (
      <>
        <ModalSubmitMedia
          modalVisible={submitModal}
          setModalVisible={setSubmitModal}
          successText={"Đã cập nhât " + status + " hình ảnh"}
          setReloadTable={setReloadTable}
        />
        <LoadingModal
          setModalVisible={setLoadingModal}
          modalVisible={loadingModal}
          loadingText="Đang ghi nhận kết quả"
        />
        <Toaster />
        <CarouselFullScreenPhotoCollection
          data={listImageData}
          openImageModal={openImageModal}
          setOpenImageModal={setOpenImageModal}
          index={indexImage}
          approve={approve}
          reject={reject}
          pending={pending}
          isPaid={statusURL === "paid" ? true : false}
        />

        <HeaderCollection data={data} user={user} confirm={confirm} />
        <div className="grid grid-cols-4 gap-4 p-2 max-w-[1118px] mx-auto">
          {console.log(data)}
          {data.map((item, index) => (
            <div
              key={index}
              className="shadow rounded-b-lg rounded-t-lg hover:bg-gray-300"
            >
              <button
                onClick={() => {
                  setOpenImageModal(true);
                  setIndexImage(index);
                }}
              >
                {statusURL === "paid" ? (
                  <LazyLoad>
                    <img
                      src={item.urlPaid}
                      className="h-[200px] object-cover w-full rounded-t-lg bg-gray-300"
                    />
                  </LazyLoad>
                ) : (
                  <LazyLoad>
                    <img
                      src={item.url}
                      className="h-[200px] object-cover w-full rounded-t-lg bg-gray-300"
                    />
                  </LazyLoad>
                )}
              </button>
              <div className="flex rounded-b-lg flex-col text-center">
                <Link href={`/profile/${item.user.username}`}>
                  <a className="text-gray-700 pt-1 pb-0.5 px-1 text-xl">
                    {item.user.name}
                  </a>
                </Link>
                <div className="mb-1">
                  <Tooltip
                    text={
                      <span className="px-2 rounded-sm text-xs  bg-black text-white">
                        {format(
                          new Date(item.updatedAt),
                          "yyyy-MM-dd HH:mm:ss"
                        )}
                      </span>
                    }
                  >
                    <span className="text-gray-700 text-sm">
                      {dateFromNow(item.updatedAt)}
                    </span>
                  </Tooltip>
                </div>
                {statusURL === "paid" ? null : (
                  <div className="flex flex-row justify-between mx-3">
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
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-1 rounded-md sticky bottom-0 bg-[#e2e8f0]">
          <ReactPaginate
            previousLabel={
              <div
                /* onClick={() => {
                  router.push(
                    `/project/${slug}/photo-collection/${status}?page=${page}`
                  );
                  setPage(router.query.page - 1);
                }} */
                className="h-8 w-8 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-left w-6 h-6"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </div>
            }
            pageClassName={
              "w-8 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full "
            }
            nextLabel={
              <div
                /*  onClick={() => {
                  router.push(
                    `/project/${slug}/photo-collection/${status}?page=${page}`
                  );
                  setPage(router.query.page + 1);
                }} */
                className="h-8 w-8 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-right w-6 h-6"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            }
            breakLabel={"..."}
            breakClassName={
              "w-8 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full"
            }
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(e) => handleChange(e)}
            forcePage={parseInt(page) - 1}
            /* initialPage={parseInt(page)} */
            containerClassName={"flex flex-row justify-center "}
            activeClassName={
              "w-8 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full bg-[#319795] text-white "
            }
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <HeaderCollection data={data} user={user} confirm={confirm} />
        <div className="flex flex-row text-center items-center">
          <div className="text-center mt-5 text-2xl justify-center">
            Chưa có ảnh nào được gởi
          </div>
        </div>
      </>
    );
  }
};
