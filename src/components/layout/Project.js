import React, { useState, useEffect } from "react";
import { MdAccessTime, MdImage, MdAttachMoney } from "react-icons/md";
import CarouselComponent from "../common/CaroselComponent";
import { ModalSubmit } from "../project/ModalSubmit";
import { useRouter } from "next/router";
import { Loading } from "../common/Loading";
import Link from "next/link";
import vi from "date-fns/locale/vi";
import { LoadingModal } from "../common/LoadingModal";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../fb/auth";
const ProjectInfo = ({ post, author }) => {
  const closeDateFormated = new Date(post.closeDay).toLocaleDateString(vi);
  const openDateFormated = new Date(post.openDay).toLocaleDateString(vi);
  return (
    <div className="flex flex-row pb-2.5 border-b border-[#f0f0f0]">
      <div className="w-9/12 px-2">
        <div className="items-center text-[#454545] px-1 flex flex-row py-2">
          <MdAttachMoney size={30} className="mr-3" />
          <div className="text-xl font-medium">
            {" "}
            <span className="text-2xl text-red-400">
              {" "}
              {post.price}đ
            </span> /ảnh{" "}
          </div>
        </div>
        <div className="items-center text-[#454545] px-1 flex flex-row py-2">
          <MdImage color="#8f8f8f" className="mr-3" size={30} />
          <div className="text-xl font-medium">{post.maxUnit} ảnh</div>
        </div>
        <div className="flex flex-row items-center py-1 px-1">
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
      <div className="flex flex-col justify-center items-center w-3/12">
        <Link href={`/profile/${author[0].username}`}>
          <a /* onPress={() => navigation.navigate('Profilediver')} */>
            <img
              src={author[0].photoURL}
              className="rounded-full"
              style={{ height: 70, width: 70 }}
            />
          </a>
        </Link>
        <Link href={`/profile/${author[0].username}`}>
          <a style={{ paddingVertical: 1.5 }} className="py-2 text-lg">
            {post.authorName}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default function Project() {
  const [status, setStatus] = useState(undefined);
  const [post, setPost] = useState(undefined);
  const [author, setAuthor] = useState(undefined);
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
  useEffect(() => {
    fetchPost();
  }, [slug]);
  const sendPhotoChecker = () => {
    toast.error("Không thể gởi ảnh trong chế độ Preview");
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
      ) : status === "ok" ? (
        <>
          <Toaster />
          <div style={{ backgroundColor: "white" }}>
            <ModalSubmit />
            <div>
              <CarouselComponent data={post.caroselImage} />
            </div>
            <div className="text-4xl m font-bold  py-4 text-center">
              {post.projectName}
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
                Mô tả
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
                Mục đích sử dụng
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
                Yêu cầu
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
              <Link href={`mailto:${post.contact}`}>
                <a>
                  <div className="text-center border-[#006A73] py-1.5 mx-4 border rounded-md mb-4 text-[#006A73] font-semibold">
                    Ask a question
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
              {/*  <div
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
                  Fot the complete rights and responsibilities, please read the
                  Terms of Use.
                </div>
              </div> */}
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
        </>
      ) : (
        <p>Something went wrong.</p>
      )}
    </>
  );
}
