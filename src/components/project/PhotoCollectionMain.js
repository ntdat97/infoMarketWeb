import { PostLayout } from "../../components/layout/LayoutPost";
import { Tooltip } from "../common/Tooltip";
import { dateFromNow } from "../../libs/dateFromNow";
import { XCircle, CheckCircle, Loader } from "react-feather";
import { format } from "date-fns";
import Link from "next/link";
import CarouselFullSreen from "../common/CarouselFullScreen";
import React, { useState, useEffect } from "react";
export const PhotoCollectionMain = ({ data, user }) => {
  const [openImageModal, setOpenImageModal] = useState(false);
  const [indexImage, setIndexImage] = useState(0);
  const [listImageData, setListImageData] = useState([]);
  useEffect(() => {
    const listTemp = [];
    data.map((item, index) => {
      listTemp.push({
        mediaId: item.id,
        status: item.isApprove,
        url: item.url,
      });
    });
    /* console.log(listTemp); */
    setListImageData(listTemp);
  }, []);
  const approve = (index) => {
    const listImageClone = [...listImageData];

    listImageClone[index].status = "APPROVE";
    setListImageData(listImageClone);
  };
  const pending = (index) => {
    const listImageClone = [...listImageData];
    listImageClone[index].status = "PENDING";
    setListImageData(listImageClone);
  };
  const reject = (index) => {
    const listImageClone = [...listImageData];

    listImageClone[index].status = "REJECT";
    setListImageData(listImageClone);
  };
  if (data.length > 0 && listImageData.length > 0) {
    return (
      <>
        <CarouselFullSreen
          data={listImageData}
          openImageModal={openImageModal}
          setOpenImageModal={setOpenImageModal}
          index={indexImage}
        />
        <div className="grid grid-cols-4 gap-4 p-2">
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
                <img
                  src={item.url}
                  className="h-[200px] object-cover w-full rounded-t-lg bg-gray-300"
                />
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
                <div className="flex flex-row justify-between mx-3">
                  <button
                    className="focus:outline-none"
                    onClick={() => pending(index)}
                  >
                    <Loader
                      color={
                        listImageData[index].status === "PENDING"
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
                        listImageData[index].status === "REJECT"
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
                        listImageData[index].status === "APPROVE"
                          ? "green"
                          : "gray"
                      }
                      size={40}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>Chưa có ảnh nào được gởi</div>
      </>
    );
  }
};
