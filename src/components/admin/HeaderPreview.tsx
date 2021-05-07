import { useRouter } from "next/router";
import { Header } from "../common/Header";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import toast, { Toaster } from "react-hot-toast";
import { useAsyncList } from "@react-stately/data";
export const HeaderPreview = ({ user }) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState("UNDEFINE");
  async function getClaims() {
    const result = await user.getIdTokenResult();
    setIsAdmin(result.claims.role.includes("ADMIN"));
  }
  useEffect(() => {
    getClaims();
  }, []);
  useEffect(() => {
    getProjectInfo();
  }, [router.query.slug]);
  async function getProjectInfo() {
    const req = await fetch(
      `/api/admin/project/fetch-post?slug=${router.query.slug}`,
      {
        headers: {
          ContentType: "application/json",
        },
      }
    );
    const data = await req.json();
    setStatus(data.status);
  }
  /* let list = useAsyncList({
    async load() {
      let res = await fetch(
        `/api/publicPost/fetch-post?slug=${router.query.slug}`,
        {
          headers: {
            ContentType: "application/json",
          },
        }
      );

      let json = await res.json();
      console.log(json);
      return { items: json };
    },
  }); */
  async function handlePublishPost() {
    const token = await user.getIdToken();
    const req = await fetch("/api/posts/update-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        slug: router.query.slug,
        status: "PUBLISHED",
      }),
    });

    // const result = await req.json();

    if (req.ok) {
      toast.success("Duyệt bài thành công. Bài viết đã được đăng.");
      router.reload();
    } else {
      toast.error("Có lỗi xảy ra, Vui lòng thử lại.");
    }
  }
  async function handleDeletePost() {
    const token = await user.getIdToken();
    const req = await fetch("/api/posts/update-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        slug: router.query.slug,
        status: "DELETED",
      }),
    });

    // const result = await req.json();

    if (req.ok) {
      toast.success("Xóa bài thành công, đã đưa vào danh sách lưu trữ.");
      router.reload();
    } else {
      toast.error("Có lỗi xảy ra, Vui lòng thử lại.");
    }
  }
  const Status = ({ statusProps }) => {
    if (statusProps === "PUBLISHED") {
      return (
        <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#389e0d] bg-[#f6ffed] border border-[#b7eb8f]">
          {statusProps}
        </span>
      );
    }

    if (statusProps === "PENDING") {
      return (
        <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
          {statusProps}
        </span>
      );
    }

    if (statusProps === "DELETED") {
      return (
        <span className="px-2 py-1 rounded-xs font-medium text-xs text-red-800 bg-red-300 border border-red-500">
          {statusProps}
        </span>
      );
    }

    return (
      <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
        {statusProps}
      </span>
    );
  };
  return (
    <header className="max-w-5xl flex justify-between items-center h-12 border-b m-auto">
      <Toaster />
      <div>
        <button
          type="button"
          className="flex items-center text-gray-500 hover:text-gray-900"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
          <span className="ml-4 text-sm">Trở về</span>
        </button>
      </div>
      <div>
        {" "}
        <Status statusProps={status} />
      </div>
      <div>
        {/* <MenuAdmin user={user} /> */}
        {isAdmin ? (
          <>
            <button
              onClick={handlePublishPost}
              type="button"
              className="mr-4 focus:outline-non text-sm py-2 px-4 rounded border border-gray-800 hover:bg-black hover:text-white text-black"
            >
              Duyệt bài
            </button>
            <button
              onClick={handleDeletePost}
              type="button"
              className="focus:outline-non text-sm py-2 px-4 rounded border border-gray-800 hover:bg-black hover:text-white text-black"
            >
              Xóa bài
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
};
