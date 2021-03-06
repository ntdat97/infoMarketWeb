import { Loading, LoadingSmall } from "../common/Loading";
import { TableData } from "../common/TableData";
import { Tooltip } from "../common/Tooltip";
import { useAsyncList } from "@react-stately/data";
import { format } from "date-fns";
import { dateFromNow } from "../../libs/dateFromNow";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConfirmModal } from "../modal/ConfirmModal";
import { Edit, Trash2, Image, Play, Pause, Map } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
export const MainPostsUser = ({ user }) => {
  const [confirmModalVisible, setConfirmModalVisible] = useState([false, ""]);
  const router = useRouter();
  let list = useAsyncList({
    async load() {
      let res = await fetch(`/api/posts/${router.query.status}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      return { items: json };
    },
  });
  const removePost = async (slug) => {
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
  const stopProject = async (slug) => {
    const req = await fetch(`/api/posts/stop-project?slug=${slug}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    console.log(await req.json());
    if (!req.ok) {
      toast.error("Có lỗi khi tạm dừng dự án, vui lòng thử lại");
    }
    if (req.ok) {
      toast.success("Tạm dừng thành công");
      list.reload();
    }
  };
  const resumeProject = async (slug) => {
    const req = await fetch(`/api/posts/resume-project?slug=${slug}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    console.log(await req.json());
    if (!req.ok) {
      toast.error("Có lỗi khi tiếp tục dự án, vui lòng thử lại");
    }
    if (req.ok) {
      toast.success("Tiếp tục thành công");
      list.reload();
    }
  };
  useEffect(() => {
    list.reload();
  }, [router.query.status]);
  const confirm = () => {
    /*     toast.loading("Đang xóa", { duration: 4000 }); */
    removePost(confirmModalVisible[1]);
    const state = [...confirmModalVisible];
    state[0] = !confirmModalVisible[0];
    setConfirmModalVisible(state);
    list.reload();
  };
  const columns = useMemo(
    () => [
      {
        Header: "Tiêu đề",
        accessor: "title",
        Cell: ({ row }) => {
          return (
            <div className="flex flex-row items-center ">
              <Link
                href={{
                  pathname: `/project/[slug]/project-preview`,
                  query: { slug: row.original.slug },
                }}
              >
                <a className="hover:underline font-semibold text-base mb-1">
                  {row.original.projectName}
                </a>
              </Link>
              {row.original.type === "MAP" && (
                <Map className="ml-2" size={16} color="green" />
              )}
              {/* <span className="text-xs text-gray-500">
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
              </span> */}
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
        Header: "Hoạt động",
        accessor: "complete",
        Cell: ({ row }) => {
          /*  if (row.original.status === "DRAFT") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#096dd9] bg-[#e6f7ff] border border-[#91d5ff]">
                {row.original.status}
              </span>
            );
          } */
          if (row.original.complete === "UNCOMPLETE") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#389e0d] bg-[#f6ffed] border border-[#b7eb8f]">
                Đang thu thập
              </span>
            );
          }

          if (row.original.complete === "PAUSE") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
                Tạm dừng
              </span>
            );
          }

          return (
            <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
              {row.original.complete}
            </span>
          );
        },
      },
      {
        Header: "Cập nhật",
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
              {row.original.status != "DELETED" && (
                <div className="flex flex-row ">
                  {row.original.complete === "UNCOMPLETE" && (
                    <span className="text-sm mr-2  ">
                      <Tooltip
                        text={
                          <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                            Tạm dừng dự án
                          </span>
                        }
                      >
                        <button onClick={() => stopProject(row.original.slug)}>
                          <Pause />
                        </button>
                      </Tooltip>
                    </span>
                  )}
                  {row.original.complete === "PAUSE" && (
                    <span className="text-sm mr-2  ">
                      <Tooltip
                        text={
                          <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                            Tiếp tục dự án
                          </span>
                        }
                      >
                        <button
                          onClick={() => resumeProject(row.original.slug)}
                        >
                          <Play />
                        </button>
                      </Tooltip>
                    </span>
                  )}

                  <span className="text-sm mr-2 ml-2">
                    <Link
                      href={
                        row.original.type === "MAP"
                          ? {
                              pathname: `/project/[slug]/photo-collection-map/all`,
                              query: { slug: row.original.slug },
                            }
                          : {
                              pathname: `/project/[slug]/photo-collection/all`,
                              query: { slug: row.original.slug },
                            }
                      }
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
                </div>
              )}
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
            <ConfirmModal
              setModalVisible={setConfirmModalVisible}
              modalVisible={confirmModalVisible}
              confirmButton={confirm}
            />
            {list.items.length > 0 ? (
              <TableData columns={columns} data={list.items} />
            ) : (
              <p className="font-normal text-2xl">Bạn chưa tạo dự án nào</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
