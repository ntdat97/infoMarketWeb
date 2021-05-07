import { Loading } from "../../common/Loading";
import { TableData } from "../../common/TableData";
import { Tooltip } from "../../common/Tooltip";
import { useAsyncList } from "@react-stately/data";
import { format } from "date-fns";
import { dateFromNow } from "../../../libs/dateFromNow";
import Link from "next/link";
import { useRouter } from "next/router";
import { Edit, Trash2, Image } from "react-feather";
import React, { useEffect, useMemo } from "react";

export const MainProjectsAdmin = ({ user }) => {
  const router = useRouter();
  let list = useAsyncList({
    async load() {
      let res = await fetch(`/api/admin/posts/${router.query.status}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      return { items: json };
    },
  });

  useEffect(() => {
    list.reload();
  }, [router.query.status]);

  const columns = useMemo(
    () => [
      {
        Header: "Tiêu đề",
        accessor: "title",
        Cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <Link
                href={{
                  pathname: `/project/[slug]/preview`,
                  query: { slug: row.original.slug },
                }}
              >
                <a className="hover:underline font-semibold text-base mb-1">
                  {row.original.projectName}
                </a>
              </Link>
              <span className="text-xs text-gray-500">
                Đăng bởi{" "}
                <Link
                  href={{
                    pathname: `/profile/${row.original.author.username}`,
                  }}
                >
                  <a className="hover:underline font-semibold">
                    {row.original.author.name}{" "}
                  </a>
                </Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: "Số lượng",
        accessor: "unit",
        Cell: ({ row }) => {
          /* const media = row.rogimedia;
          console.log(media) */ return (
            <div className="flex flex-col">
              <Link
                href={{
                  pathname: `/project/[slug]/photo-collection`,
                  query: { slug: row.original.slug },
                }}
              >
                <a className="hover:underline font-semibold text-base mb-1">
                  {row.original._count.media} /{row.original.maxUnit}
                </a>
              </Link>
            </div>
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
          if (row.original.status === "PUBLISHED") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#389e0d] bg-[#f6ffed] border border-[#b7eb8f]">
                {row.original.status}
              </span>
            );
          }

          if (row.original.status === "PENDING") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
                {row.original.status}
              </span>
            );
          }

          if (row.original.status === "DELETED") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-red-800 bg-red-300 border border-red-500">
                {row.original.status}
              </span>
            );
          }

          return (
            <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
              {row.original.status}
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
        accessor: "slug",
        Cell: ({ row }) => {
          return (
            <>
              <div className="flex flex-row ">
                <span className="text-sm mr-2 ml-2">
                  <Link
                    href={{
                      pathname: `/project/[slug]/photo-collection/all`,
                      query: { slug: row.original.slug },
                    }}
                  >
                    <a>
                      <Tooltip
                        text={
                          <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                            Ảnh đã đóng góp
                          </span>
                        }
                      >
                        <Image />
                      </Tooltip>
                    </a>
                  </Link>
                </span>
                <span className="text-sm mr-2 ml-2">
                  <Link
                    href={{
                      pathname: `/project/[slug]/edit`,
                      query: { slug: row.original.slug },
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
                {row.original.status != "DELETED" && (
                  <span className="text-sm ml-2  ">
                    <Tooltip
                      text={
                        <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                          Xóa
                        </span>
                      }
                    >
                      <button
                        onClick={() =>
                          setConfirmModalVisible([true, row.original.slug])
                        }
                      >
                        <Trash2 />
                      </button>
                    </Tooltip>
                  </span>
                )}
              </div>
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div
        className="flex flex-col p-4 mx-auto mb-8"
        style={{
          maxWidth: "100%",
        }}
      >
        {list.isLoading ? (
          <Loading />
        ) : (
          <>
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
