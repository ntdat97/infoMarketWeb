import React, { useState, useEffect } from "react";
import { MdAccessTime, MdImage, MdAttachMoney } from "react-icons/md";
import CarouselComponent from "../common/CaroselComponent";
import { Uploader } from "../common/Upload";
import { ModalSubmit } from "./ModalSubmit";
import { ErrorPaymentModal } from "../modal/ErrorPaymentModal";
import { UnAuthModal } from "./UnAuthModal";

import { useRouter } from "next/router";
import { Loading } from "../common/Loading";
import Link from "next/link";
import vi from "date-fns/locale/vi";
import { LoadingModal } from "../common/LoadingModal";
import toast, { Toaster } from "react-hot-toast";

export function ProjectDetail({ user }) {
  const [coverImage, setCoverImage] = useState([]);
  const [isShowUploader, setIsShowUploader] = useState(false);
  const [modalAuthVisible, setModalAuthVisible] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [post, setPost] = useState(undefined);
  const [author, setAuthor] = useState(undefined);
  const [modalSubmitVisible, setModalSubmitVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState([false, []]);
  const [modalLoadingVisible, setModalLoadingVisible] = useState(false);
  const [countUserPhoto, setCountUserPhoto] = useState(0);
  /* const [countTemp, setCountTemp] = useState(0); */
  const router = useRouter();
  const slug = router.query.slug;
  const fetchPost = async () => {
    setStatus("loading");
    if (!slug) return;
    const req = await fetch(`/api/publicPost/fetch-post?slug=${slug}`, {
      headers: {
        ContentType: "application/json",
      },
    });

    const data = await req.json();
    const req1 = await fetch(`/api/profile/${data?.authorId}`, {
      headers: {
        ContentType: "application/json",
      },
    });
    const authorReq = await req1.json();

    if (!req.ok && !req1.ok) {
      setStatus("error");
    }
    setAuthor(authorReq);
    setPost(data);
    setStatus("ok");
  };
  async function sendPhoto(values) {
    setModalLoadingVisible(true);
    const response = await fetch("/api/sendPhoto/project", {
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      body: JSON.stringify({ data: { values } }),
    });
    if (response.ok) {
      setModalLoadingVisible(false);
      setModalSubmitVisible(true);
    } else {
      setModalLoadingVisible(false);
      toast.error("Có lỗi xảy ra, Vui lòng thử lại.");
    }
  }
  /* async function countPhoto(values) {
    const response = await fetch("/api/sendPhoto/count-photo", {
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      body: JSON.stringify({ data: { values } }),
    });
    let json = await response.json();
    setCountUserPhoto(json);
  } */
  useEffect(() => {
    fetchPost();
  }, [slug]);
  useEffect(() => {
    if (coverImage.length > 0 && post) {
      var data = [];
      coverImage.map((item, index) => {
        data.push({
          url: "",
          urlPaid: item.response.body.data[0].linkUrl,
          userId: user.uid,
          projectId: post.id,
        });
      });
      sendPhoto(data);
    }
  }, [coverImage]);
  /* useEffect(() => {
    console.log(countTemp);
    setCountUserPhoto(countUserPhoto + coverImage.length);
  }, [countTemp]); */
  const sendPhotoChecker = (post) => {
    /*     const data = {
      userId: user.uid,
      projectId: post.id,
    };
    
    countPhoto(data); */

    if (user) {
      if (post.complete === "UNCOMPLETE") {
        if (post.type === "MAP") {
          toast.error("Dự án thu thập ảnh trên bản đồ chỉ áp dụng cho di động");
        } else {
          setIsShowUploader(true);
        }
      } else {
        toast.error("Dự án đã tạm dừng");
      }
    } else {
      setModalAuthVisible(true);
    }
  };
  if (post?.id == "empty") {
    return (
      <>
        <div style={{ backgroundColor: "white" }}>Dự án không tồn tại.</div>
      </>
    );
  }
  return (
    <>
      {status === "loading" ? (
        <Loading />
      ) : status === "ok" && post.status === "PUBLISHED" ? (
        <>
          {isShowUploader ? (
            <Uploader
              isOpen={isShowUploader}
              setIsOpen={setIsShowUploader}
              outFiles={coverImage}
              setOutFile={setCoverImage}
              /* setCountTempFiles={setCountTemp} 
               isUploadButtonDisable={countUserPhoto > 12 ? true : false} */
            />
          ) : null}
          <LoadingModal
            modalVisible={modalLoadingVisible}
            setModalVisible={setModalLoadingVisible}
          />
          <ErrorPaymentModal
            modalVisible={errorModalVisible}
            setModalVisible={setErrorModalVisible}
          />

          <ModalSubmit
            setModalVisible={setModalSubmitVisible}
            modalVisible={modalSubmitVisible}
          />
          <UnAuthModal
            setModalVisible={setModalAuthVisible}
            modalVisible={modalAuthVisible}
          />
          <Toaster />
          <div>
            <div style={{ backgroundColor: "white" }}>
              <ModalSubmit />
              <div>
                <CarouselComponent data={post.caroselImage} />
              </div>
              <div className="text-4xl m font-bold  py-4 text-center">
                {post.projectName}
              </div>
              <div className="flex flex-row pb-2.5 border-b border-[#f0f0f0]">
                <div className="w-9/12 px-2">
                  <div className="items-center text-[#454545] px-1 flex flex-row py-2">
                    <MdAttachMoney size={30} className="mr-3" />
                    <div className="text-xl font-medium">
                      {" "}
                      <span className="text-2xl text-red-400">
                        {" "}
                        {post.price}đ
                      </span>{" "}
                      /ảnh{" "}
                    </div>
                  </div>
                  <div className="items-center text-[#454545] px-1 flex flex-row py-2">
                    <MdImage color="#8f8f8f" className="mr-3" size={30} />
                    <div className="text-xl font-medium">
                      {post.maxUnit} ảnh
                    </div>
                  </div>
                  <div className="flex flex-row items-center py-1 px-1">
                    <MdAccessTime color="#8f8f8f" className="mr-3" size={30} />

                    <div className="text-[17px] text-[#454545] items-center  ">
                      {new Date(post.openDay).toLocaleDateString(vi)}
                    </div>
                    <div className="text-xl p-1 justify-center items-center mx-2">
                      {" "}
                      -{" "}
                    </div>
                    <div className=" text-[17px] text-[#454545] items-center ">
                      {new Date(post.closeDay).toLocaleDateString(vi)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center w-3/12 flex-col">
                  <Link href={`/profile/${author[0].username}`}>
                    <a /* onPress={() => navigation.navigate('Profilediver')} */
                    >
                      <img
                        src={author[0].photoURL}
                        style={{ height: 70, width: 70 }}
                        className="rounded-full"
                      />
                    </a>
                  </Link>
                  <Link href={`/profile/${author[0].username}`}>
                    <a
                      style={{ paddingVertical: 1.5 }}
                      className="py-2 text-lg"
                    >
                      {post.authorName}
                    </a>
                  </Link>
                </div>
              </div>
              {post.complete === "PAUSE" && (
                <div className="text-[#f5440f] bg-[#ffc4b3] text-center p-1 pl-5 pr-[10px] font-medium">
                  Dự án đã tạm dừng
                </div>
              )}
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <p
                  className="whitespace-pre-wrap"
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  Mô tả
                </p>
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
                  Mục đích sử dụng
                </div>
                <p className="whitespace-pre-wrap">{post.usedFor}</p>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  Yêu cầu
                </div>
                <p className="whitespace-pre-wrap">{post.requirements}</p>
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
                  Liên hệ người tạo dự án
                </div>
                <Link href={`mailto:${post.contact}`}>
                  <a>
                    <div className="text-center border-[#006A73] py-1.5 mx-4 border rounded-md mb-4 text-[#006A73] font-semibold">
                      Đặt câu hỏi
                    </div>
                  </a>
                </Link>
                {/* <Link href="#">
                  <a>
                    <div className="text-center border-[#006A73] py-1.5 mx-4 border rounded-md mb-4 text-[#006A73] font-semibold">
                      Share project
                    </div>
                  </a>
                </Link> */}
                {/* <div
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
                </div> */}
              </div>
            </div>
          </div>
          <div className="p-2 border-t-[0.5px] border-[#f0f0f0]   mt-0.5  bg-white sticky bottom-0 right-0">
            <button
              onClick={() => sendPhotoChecker(post)}
              className="py-1  rounded-md bg-[#006A73] flex w-full focus:opacity-50 focus:outline-none items-center justify-center"
            >
              <div className="text-white font-semibold">Gửi ảnh</div>
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center mt-10 text-lg">
          Cố lỗi xảy ra hoặc dự án đã bị xóa
        </div>
      )}
    </>
  );
}
