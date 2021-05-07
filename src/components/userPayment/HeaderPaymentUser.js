import React from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-feather";
import { useAsyncList } from "@react-stately/data";
import { ActiveLink } from "../common/ActiveLink";
export const HeaderCollection = ({ data, user, confirm }) => {
  const router = useRouter();
  const slug = router.query.slug;
  let list = useAsyncList({
    async load() {
      let res = await fetch(
        `/api/posts/photo-collection/media-count-by-status?slug=${slug}`,
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
  });
  return (
    <>
      <div className="sticky top-0 right-0">
        <div className="flex flex-row justify-between items-center p-4 border-b">
          <div>
            <ActiveLink href="/my-projects/all">
              <a className="flex items-center text-gray-500 hover:text-gray-900">
                <ArrowLeft size={18} />
                <span className="ml-4 text-sm">Trở về</span>
              </a>
            </ActiveLink>
          </div>
          <div className="flex flex-row">
            <div className="text-2xl font-semibold border-r-2 pr-[32px] mr-5">
              {data[0]?.project.projectName}
            </div>
            <ActiveLink
              href={{
                pathname: "/project/[slug]/photo-collection/[status]",
                query: { status: "all", slug: slug },
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
                pathname: "/project/[slug]/photo-collection/[status]",
                query: { status: "pending", slug: slug },
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
            <ActiveLink
              href={{
                pathname: "/project/[slug]/photo-collection/[status]",
                query: { status: "approve", slug: slug },
              }}
              activeClassName="border-b border-b-2 border-black font-semibold"
            >
              <a className="py-2 mx-3 text-sm">
                Đã duyệt(
                {!list.isLoading &&
                  list.items.length > 0 &&
                  list.items[0]?.totalMediaStatusAPPROVE}
                )
              </a>
            </ActiveLink>

            <ActiveLink
              href={{
                pathname: "/project/[slug]/photo-collection/[status]",
                query: { status: "reject", slug: slug },
              }}
              activeClassName="border-b border-b-2 border-black font-semibold"
            >
              <a className="py-2 mx-3 text-sm">
                Đã từ chối (
                {!list.isLoading &&
                  list.items.length > 0 &&
                  list.items[0]?.totalMediaStatusREJECT}
                )
              </a>
            </ActiveLink>
          </div>

          <div>
            <button
              onClick={confirm}
              className="text-center mr-4 text-white shadow bg-[#ff8a24] justify-center items-center rounded-xl h-full py-1 px-2"
            >
              Thanh toán
            </button>
            <button
              onClick={confirm}
              className="text-center text-white shadow bg-[#2e43ff] justify-center items-center rounded-xl h-full py-1 px-2"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
