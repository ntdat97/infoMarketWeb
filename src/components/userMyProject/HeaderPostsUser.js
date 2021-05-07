import { ActiveLink } from "../common/ActiveLink";
import { useAsyncList } from "@react-stately/data";
import React from "react";

export const HeaderPostsUser = ({ user }) => {
  let list = useAsyncList({
    async load() {
      let res = await fetch("/api/posts/posts-count-by-status", {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      return { items: json };
    },
  });

  return (
    <div className="flex px-6 py-3 border-b mt-2">
      <ActiveLink href="/my-projects/all" activeClassName="">
        <a className="pb-2 mx-3 text-sm border-b border-black font-semibold">
          <h2 className="font-bold text-xl mr-2">Bài viết</h2>
        </a>
      </ActiveLink>
      <ActiveLink
        href="/my-contribute/all"
        activeClassName="border-b border-b-2 border-black font-semibold"
      >
        <a className="pb-2 mx-3 text-sm">
          <h2 className="font-bold text-xl mr-2">Đóng góp</h2>
        </a>
      </ActiveLink>
      <div className="border-l pl-2">
        <div className="ml-8">
          <ActiveLink
            href={{
              pathname: "/my-projects/[status]",
              query: { status: "all" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Tất cả (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalPostsStatusALL}
              )
            </a>
          </ActiveLink>

          <ActiveLink
            href={{
              pathname: "/my-projects/[status]",
              query: { status: "published" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Đã đăng (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalPostsStatusPUBLISHED}
              )
            </a>
          </ActiveLink>

          <ActiveLink
            href={{
              pathname: "/my-projects/[status]",
              query: { status: "pending" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Đang chờ duyệt (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalPostsStatusPENDING}
              )
            </a>
          </ActiveLink>

          {/* <ActiveLink
            href={{
              pathname: "/admin/posts/[status]",
              query: { status: "draft" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Bản thảo (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalPostsStatusDRAFT}
              )
            </a>
          </ActiveLink> */}

          <ActiveLink
            href={{
              pathname: "/my-projects/[status]",
              query: { status: "deleted" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Lưu trữ (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalPostsStatusDELETED}
              )
            </a>
          </ActiveLink>
        </div>
      </div>
    </div>
  );
};
