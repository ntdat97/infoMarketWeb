import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-feather";
import { useAsyncList } from "@react-stately/data";
import { ActiveLink } from "../common/ActiveLink";
import { saveAs } from "file-saver";
import JSZipUtils from "jszip-utils";
import Link from "next/link";
var zip = require("jszip");

export const HeaderCollection = ({ data, user, confirm }) => {
  const [listUrls, setListUrls] = useState([]);
  useEffect(() => {
    var temp = [];
    data.map((item, index) => {
      temp.push(item.urlPaid);
    });
    setListUrls(temp);
  }, [data]);
  const router = useRouter();
  const slug = router.query.slug;
  const status = router.query.status;
  var page = 1;
  var count = 0;
  var zipFilename = "zipFilename.zip";
  var donwloadAll = () => {
    listUrls.forEach(function (url, index) {
      console.log(url);
      var filename = "file-" + index;
      // loading a file and add it in a zip file
      JSZipUtils.getBinaryContent(url, async function (err, data) {
        if (err) {
          throw err; // or handle the error
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count == urls.length) {
          var zipFile = await zip.generateAsync({ type: "blob" });
          saveAs(zipFile, zipFilename);
        }
      });
    });
  };
  if (typeof router.query.page != "undefined") {
    page = router.query.page;
  }
  let list = useAsyncList({
    async load() {
      let res = await fetch(
        `/api/posts/photo-collection/media-count-by-status?slug=${slug}&page=${page}`,
        {
          headers: {
            ContentType: "application/json",
          },
        }
      );

      let json = await res.json();
      return { items: json };
    },
  });
  return (
    <>
      <div className="sticky top-0 right-0 bg-white max-w-full">
        <div className="flex flex-row justify-between items-center p-4 border-b">
          <div>
            <ActiveLink href="/my-projects/all">
              <a className="flex items-center text-gray-500 hover:text-gray-900">
                <ArrowLeft size={18} />
                <span className="ml-4 text-sm line-clamp-1 overflow-hidden whitespace-nowrap">
                  Trở về
                </span>
              </a>
            </ActiveLink>
          </div>
          <div className="flex flex-row  items-center">
            <div className="text-2xl font-semibold border-r-2 pr-[10px] mr-5 ">
              <span className="line-clamp-1 max-w-[360px]">
                {data[0]?.project.projectName}
              </span>
            </div>
            <ActiveLink
              href={{
                pathname: "/project/[slug]/photo-collection/[status]",
                query: { status: "all", slug: slug },
              }}
              activeClassName="border-b border-b-2 border-black font-semibold"
            >
              <a className="py-2 mx-3 text-sm line-clamp-1 overflow-hidden whitespace-nowrap">
                (
                <span>
                  {!list.isLoading &&
                    list.items.length > 0 &&
                    list.items[0]?.totalMediaStatusALL}
                  )
                </span>{" "}
                Tất cả
              </a>
            </ActiveLink>
            <ActiveLink
              href={{
                pathname: "/project/[slug]/photo-collection/[status]",
                query: { status: "pending", slug: slug },
              }}
              activeClassName="border-b border-b-2 border-black font-semibold"
            >
              <a className="py-2 mx-3 text-sm line-clamp-1 overflow-hidden whitespace-nowrap">
                (
                {!list.isLoading &&
                  list.items.length > 0 &&
                  list.items[0]?.totalMediaStatusPENDING}
                ) Đang chờ
              </a>
            </ActiveLink>
            <ActiveLink
              href={{
                pathname: "/project/[slug]/photo-collection/[status]",
                query: { status: "approve", slug: slug },
              }}
              activeClassName="border-b border-b-2 border-black font-semibold"
            >
              <a className="py-2 mx-3 text-sm line-clamp-1 overflow-hidden whitespace-nowrap">
                (
                {!list.isLoading &&
                  list.items.length > 0 &&
                  list.items[0]?.totalMediaStatusAPPROVE}
                ) Đã duyệt
              </a>
            </ActiveLink>

            <ActiveLink
              href={{
                pathname: "/project/[slug]/photo-collection/[status]",
                query: { status: "reject", slug: slug },
              }}
              activeClassName="border-b border-b-2 border-black font-semibold"
            >
              <a className="py-2 mx-3 text-sm line-clamp-1 overflow-hidden whitespace-nowrap">
                (
                {!list.isLoading &&
                  list.items.length > 0 &&
                  list.items[0]?.totalMediaStatusREJECT}
                ) Đã từ chối
              </a>
            </ActiveLink>
            <ActiveLink
              href={{
                pathname: "/project/[slug]/photo-collection/[status]",
                query: { status: "paid", slug: slug },
              }}
              activeClassName="border-b border-b-2 border-black font-semibold"
            >
              <a className="py-2 mx-3 text-sm line-clamp-1 overflow-hidden whitespace-nowrap">
                (
                {!list.isLoading &&
                  list.items.length > 0 &&
                  list.items[0]?.totalMediaStatusPAID}
                ) Đã thanh toán
              </a>
            </ActiveLink>
          </div>
          {status != "paid" ? (
            <div>
              <Link
                href={{
                  pathname: "/project/[slug]/payment",
                  query: { slug: slug },
                }}
              >
                <a className="overflow-hidden whitespace-nowrap max-w-[10px] text-center mr-4 text-white shadow bg-[#ff8a24] justify-center items-center rounded-xl h-full py-1.5 px-2">
                  Thanh toán
                </a>
              </Link>
              <button
                onClick={confirm}
                className="text-center text-white shadow bg-[#2e43ff] justify-center items-center rounded-xl h-full py-1 px-2"
              >
                Xác nhận
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => donwloadAll()}
                className="text-center text-white shadow bg-[#2e43ff] justify-center items-center rounded-xl h-full py-1 px-2"
              >
                Tải xuống
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
