import { ActiveLink } from "../../common/ActiveLink";
import { useAsyncList } from "@react-stately/data";
import React from "react";

export const HeaderContributeAdmin = ({ user }) => {
  let list = useAsyncList({
    async load() {
      let res = await fetch("/api/admin/contribute/media-count", {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      return { items: json };
    },
  });
  /*  if (!list.isLoading && list.items.length > 0) {
    console.log(list.items)
    return <div>Bạn không có quyền để xem thông tin này</div>;
  } */
  return (
    <div className="flex px-6 py-3 border-b mt-2">
      <div className="pb-2 mx-3 text-sm ">
        <h2 className="font-bold text-xl mr-2 ">Đóng góp</h2>
      </div>
      <div className="border-l pl-2">
        <div className="ml-8">
          <ActiveLink
            href={{
              pathname: "/admin/contribute/[status]",
              query: { status: "all" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Tất cả (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalMediaStatusALL}
              )
            </a>
          </ActiveLink>

          <ActiveLink
            href={{
              pathname: "/admin/contribute/[status]",
              query: { status: "approve" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Đã duyệt (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalMediaStatusAPPROVE}
              )
            </a>
          </ActiveLink>

          <ActiveLink
            href={{
              pathname: "/admin/contribute/[status]",
              query: { status: "pending" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Đang chờ duyệt (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalMediaStatusPENDING}
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
              pathname: "/admin/contribute/[status]",
              query: { status: "rejected" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Lưu trữ (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalMediaStatusREJECT}
              )
            </a>
          </ActiveLink>
          <ActiveLink
            href={{
              pathname: "/admin/contribute/[status]",
              query: { status: "paid" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Đã thanh toán (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalMediaStatusPAID}
              )
            </a>
          </ActiveLink>
        </div>
      </div>
    </div>
  );
};
