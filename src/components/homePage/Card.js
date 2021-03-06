import React from "react";
import { MdStar, MdStarHalf } from "react-icons/md";
import { IoTrophyOutline } from "react-icons/io5";
import { Map } from "react-feather";
import Link from "next/link";
export default function Card({ data }) {
  const RenderStar = () => {
    const star = 4.5;
    var i;
    var starObject = [];
    for (i = 0; i < Math.floor(star / 1); i++) {
      starObject.push(<MdStar key={i} color="#f9bc39" />);
    }
    star % 1 > 0 && starObject.push(<MdStarHalf key={star} color="#f9bc39" />);
    starObject.push(
      <div className="font-medium text-sm ml-1" key={star + 1}>
        ({star})
      </div>
    );
    return <>{starObject}</>;
  };
  return (
    <>
      <div className="flex rounded-md shadow mt-4 mr-4 ml-4 flex-col hover:bg-gray-100 hover:bg-gradient-to-r hover:from-bg-white hover:to-bg-gray-100 transition duration-100 ease-linear">
        <Link href={`/project/${data.slug}`}>
          <a
            className="p-0.5 justify-center relative overflow-hidden rounded-t-lg w-auto h-[171px] bg-cover bg-center object-fill"
            style={{
              backgroundImage: `url(${
                data.caroselImage.length > 0
                  ? data.caroselImage[0].url
                  : "/default-cover.jpg"
              })`,
            }}
          >
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[rgba(70,70,70,0.5)]"></div>
            <div className="flex flex-col absolute">
              <div className="text-white text-3xl font-bold px-3 pt-1">
                {data.projectName}
              </div>
              <div className="flex flex-row items-center mt-[5px]">
                <IoTrophyOutline
                  className="ml-3 mr-2"
                  color="white"
                  size="20"
                />
                <div className="text-base text-white items-center">
                  {data.price}đ
                </div>
                <div className="text-base text-white items-center">/</div>
                <div className="text-base text-white items-center">Ảnh</div>
              </div>
            </div>
            <div className="absolute right-0 bottom-9 z-10">
              {data.complete === "UNCOMPLETE" && <div></div>}
              {data.complete === "PAUSE" && (
                <div className="text-[#f5440f] bg-[#ffc4b3] rounded-l-3xl p-1 pl-5 pr-[10px] font-medium">
                  Tạm dừng
                </div>
              )}
            </div>
          </a>
        </Link>
        <Link href={`/project/${data.slug}`}>
          <a className="flex flex-row justify-between items-center ">
            <div className="p-4">{data.authorName}</div>
            {data.type === "MAP" && (
              <Map className="mx-4" size={40} color="green" />
            )}
            {/*  <div className="flex flex-row items-center ml-2 mt-[2px]">
              <RenderStar />
            </div> */}
          </a>
        </Link>
      </div>
    </>
  );
}
