import React, { useState, useEffect } from "react";
import { MdAccessTime, MdImage } from "react-icons/md";
import CarouselComponent from "../../components/common/CaroselComponent";
import { Uploader } from "../../components/common/Upload";
import { ModalSubmit } from "../../components/project/ModalSubmit";
import { UnAuthModal } from "../../components/project/UnAuthModal";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { useAsyncList } from "@react-stately/data";
import { useRouter } from "next/router";
import { Loading } from "../../components/common/Loading";
import Link from "next/link";
import DatePicker, { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import { LoadingModal } from "../../components/common/LoadingModal";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../fb/auth";
const ProjectInfo = ({ post, author }) => {
  const closeDateFormated = new Date(post.closeDay).toLocaleDateString(vi);
  const openDateFormated = new Date(post.openDay).toLocaleDateString(vi);
  return (
    <div className="flex flex-row pb-2.5 border-b border-[#f0f0f0]">
      <div className="w-9/12 px-2">
        <div className="text-3xl m font-bold  py-2">{post.projectName}</div>
        <div style={{ paddingVertical: 1.5 }}>{post.authorName}</div>
        <div
          style={{
            fontSize: 17,
            color: "black",
            alignItems: "center",
            paddingVertical: 3,
            color: "#454545",
          }}
        >
          $ {post.price}/photo
        </div>
        <div className="flex flex-row items-center py-1">
          <MdImage color="#8f8f8f" className="mr-1" />
          <div style={{ color: "#454545", fontSize: 17 }}>
            {" "}
            {post.maxUnit} photos
          </div>
        </div>
        <div className="flex flex-row items-center py-1">
          <MdAccessTime color="#8f8f8f" className="mr-3" size={30} />

          <div className="text-[17px] text-[#454545] items-center  ">
            {openDateFormated}
          </div>
          <div className="text-xl p-1 justify-center items-center mx-2">
            {" "}
            -{" "}
          </div>
          <div className=" text-[17px] text-[#454545] items-center ">
            {closeDateFormated}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-3/12">
        <Link href={`/profile/${author[0].username}`}>
          <a /* onPress={() => navigation.navigate('Profilediver')} */>
            <img src={author[0].photoURL} style={{ height: 70, width: 70 }} />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default function ProjectDetail() {
  if (post?.id == "empty") {
    return (
      <>
        <Header />
        <div className="flex flex-row ">
          <div className="w-1/6 sticky top-16 self-start h-auto border-r border-[#e6e6e6] ">
            <Sidebar />
          </div>
          <div className="flex w-11/12 ">
            <div className="max-w-[1108px] mx-auto mt-4">
              <div style={{ backgroundColor: "white" }}>
                Dự án không tồn tại.
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-row ">
        <div className="w-1/6 sticky top-16 self-start h-auto border-r border-[#e6e6e6] ">
          <Sidebar />
        </div>
        <div className="flex w-11/12 ">
          <div className="max-w-[1108px] mx-auto mt-4">
            <div style={{ backgroundColor: "white" }}>
              <ModalSubmit />
              <div>
                <CarouselComponent data={post.caroselImage} />
              </div>
              <ProjectInfo post={post} author={author} />
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  Description
                </div>
                <div>{post.description}</div>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  How photos will be used
                </div>
                <div>{post.usedFor}</div>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  Photo requirements
                </div>
                <div>{post.requirements}</div>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 10,
                    marginBottom: 5,
                  }}
                >
                  Contact requester
                </div>
                <Link href="#">
                  <a>
                    <div className="text-center border-[#006A73] py-1.5 mx-4 border rounded-md mb-4 text-[#006A73] font-semibold">
                      Ask a question
                    </div>
                  </a>
                </Link>
                <Link href="#">
                  <a>
                    <div className="text-center border-[#006A73] py-1.5 mx-4 border rounded-md mb-4 text-[#006A73] font-semibold">
                      Share project
                    </div>
                  </a>
                </Link>
                <div
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "#f0f0f0",
                    borderRadius: 5,
                  }}
                >
                  <div>Photo right and responsibilities</div>
                  <div className="flex flex-row items-center py-[10px]">
                    <MdAccessTime
                      name="clock-time-three-outline"
                      size={24}
                      color="#8f8f8f"
                      style={{ marginRight: 10 }}
                    />
                    <div>Photo can be use indefinitely</div>
                  </div>
                  <div className="flex flex-row items-center py-[10px]">
                    <MdAccessTime
                      color="#8f8f8f"
                      size={24}
                      style={{ marginRight: 10 }}
                    />
                    <div>Photo can be use indefinitely</div>
                  </div>
                  <div className="flex flex-row items-center py-[10px]">
                    <MdAccessTime
                      color="#8f8f8f"
                      size={24}
                      style={{ marginRight: 10 }}
                    />
                    <div>Photo can be use indefinitely</div>
                  </div>
                  <div className="flex flex-row items-center py-[10px]">
                    <MdAccessTime
                      color="#8f8f8f"
                      size={24}
                      style={{ marginRight: 10 }}
                    />
                    <div>Photo can be use indefinitely</div>
                  </div>
                  <div style={{ paddingVertical: 5 }}>
                    Fot the complete rights and responsibilities, please read
                    the Terms of Use.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 border-t-[0.5px] border-[#f0f0f0]   mt-0.5  bg-white sticky bottom-0 ">
              <button
                onClick={sendPhotoChecker}
                className="py-1  rounded-md bg-[#006A73] flex w-full focus:opacity-50 focus:outline-none items-center justify-center"
              >
                <div className="text-white font-semibold">Send photos</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
