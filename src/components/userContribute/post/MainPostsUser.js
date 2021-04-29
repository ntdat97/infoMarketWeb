import { Loading, LoadingSmall } from "../../common/Loading";
import { TableData } from "../../common/TableData";
import { Tooltip } from "../../common/Tooltip";
import { useAsyncList } from "@react-stately/data";
import { format } from "date-fns";
import { dateFromNow } from "../../../libs/dateFromNow";
import Link from "next/link";
import { useRouter } from "next/router";
import { Edit, Trash2 } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
export const MainPostsUser = ({ user }) => {
  const router = useRouter();
  let list = useAsyncList({
    async load() {
      let res = await fetch(`/api/posts/my-contribute/${router.query.status}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      return { items: json };
    },
  });
  const removePost = async (slug) => {
    toast.loading("Đang xóa", { duration: 4000 });
    const req = await fetch(`/api/posts/remove-post?slug=${slug}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    if (!req.ok) {
      toast.error("Có lỗi khi xóa, vui lòng thử lại");
    }
    if (req.ok) {
      toast.success("Xóa thành công");
      list.reload();
    }
  };
  useEffect(() => {
    list.reload();
  }, [router.query.status]);

  const columns = useMemo(
    () => [
      {
        Header: "Hình ảnh",
        accessor: "url",
        Cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <a
                className="hover:underline font-semibold text-base mb-1 "
                target="_blank"
                href={row.original.url}
              >
                <img src={row.original.url} className="w-28 h-20 shadow" />
              </a>
              {/* <span className="text-xs text-gray-500">
                Đăng trong{" "}
                <Link
                  href={{
                    pathname: `/project/${row.original.project.slug}`,
                  }}
                >
                  <a className="hover:underline font-semibold">
                    {row.original.project.projectName}{" "}
                  </a>
                </Link>
              </span> */}
            </div>
          );
        },
      },
      {
        Header: "Dự án",
        accessor: "project",
        Cell: ({ row }) => {
          return (
            <Link
              href={{
                pathname: `/project/${row.original.project.slug}`,
              }}
            >
              <a className="hover:underline font-semibold">
                {row.original.project.projectName}{" "}
              </a>
            </Link>
          );
        },
      },
      {
        Header: "Trạng thái",
        accessor: "status",
        Cell: ({ row }) => {
          /*  if (row.original.status === "DRAFT") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#096dd9] bg-[#e6f7ff] border border-[#91d5ff]">
                {row.original.status}
              </span>
            );
          } */
          if (row.original.isApprove === "APPROVE") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#389e0d] bg-[#f6ffed] border border-[#b7eb8f]">
                {row.original.isApprove}
              </span>
            );
          }

          if (row.original.isApprove === "PENDING") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
                {row.original.isApprove}
              </span>
            );
          }

          if (row.original.isApprove === "REJECT") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-red-800 bg-red-300 border border-red-500">
                {row.original.isApprove}
              </span>
            );
          }

          return (
            <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
              {row.original.isApprove}
            </span>
          );
        },
      },
      {
        Header: "Cập nhật gần đây",
        accessor: "updatedAt",
        Cell: ({ row }) => {
          return (
            <span className="text-sm">
              <Tooltip
                text={
                  <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                    {format(
                      new Date(row.original.updatedAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </span>
                }
              >
                {dateFromNow(row.original.updatedAt)}
              </Tooltip>
            </span>
          );
        },
      },
      {
        Header: "Hành động",
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <div className="flex flex-row">
              <span className="text-sm mr-2">
                <Link
                  href={{
                    pathname: `/project/[slug]/project-preview`,
                    query: { slug: row.original.id },
                  }}
                >
                  <a>
                    <Tooltip
                      text={
                        <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                          Chỉnh sửa
                        </span>
                      }
                    >
                      <Edit />
                    </Tooltip>
                  </a>
                </Link>
              </span>
              {row.original.status != "APPROVE" &&
                row.original.status != "REJECT" && (
                  <span className="text-sm ml-2">
                    <Tooltip
                      text={
                        <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                          Xóa
                        </span>
                      }
                    >
                      <button onClick={() => removePost(row.original.id)}>
                        <Trash2 />
                      </button>
                    </Tooltip>
                  </span>
                )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div
        className="flex flex-col p-4"
        style={{
          maxWidth: "100%",
        }}
      >
        {list.isLoading ? (
          <LoadingSmall />
        ) : (
          <>
            <Toaster />
            {list.items.length > 0 ? (
              <TableData columns={columns} data={list.items} />
            ) : (
              <p>Empty...</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
