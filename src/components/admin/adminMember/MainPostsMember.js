import { Loading, LoadingSmall } from "../../common/Loading";
import { TableData } from "../../common/TableData";
import { Tooltip } from "../../common/Tooltip";
import { useAsyncList } from "@react-stately/data";
import { format } from "date-fns";
import { dateFromNow } from "../../../libs/dateFromNow";
import Link from "next/link";
import { useRouter } from "next/router";
import { Edit, Trash2, Image, Slash, Unlock } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ConfirmModal } from "../../modal/ConfirmModal";
export const MainPostsMember = ({ user }) => {
  const [confirmModalVisible, setConfirmModalVisible] = useState([false, ""]);
  const [confirmUnlcokModalVisible, setConfirmUnlcokModalVisible] = useState([
    false,
    "",
  ]);
  const router = useRouter();
  let list = useAsyncList({
    async load() {
      let res = await fetch(`/api/admin/members/${router.query.status}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      return { items: json };
    },
  });
  const banUser = async (username) => {
    toast.loading("Đang khóa User", { duration: 4000 });
    const req = await fetch(
      `/api/admin/members/ban-user?username=${username}`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      }
    );
    if (!req.ok) {
      toast.error("Có lỗi khi khóa, vui lòng thử lại");
    }
    if (req.ok) {
      toast.success("Khóa User thành công");
      list.reload();
    }
  };
  const unBanUser = async (username) => {
    toast.loading("Đang mở khóa user", { duration: 4000 });
    const req = await fetch(
      `/api/admin/members/re-active-user?username=${username}`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      }
    );
    if (!req.ok) {
      toast.error("Có lỗi khi mở khóa, vui lòng thử lại");
    }
    if (req.ok) {
      toast.success("Mở khóa thành công");
      list.reload();
    }
  };
  useEffect(() => {
    list.reload();
  }, [router.query.status]);
  const confirmBan = () => {
    /*     toast.loading("Đang xóa", { duration: 4000 }); */
    console.log(confirmModalVisible[1]);
    banUser(confirmModalVisible[1]);
    const state = [...confirmModalVisible];
    state[0] = !confirmModalVisible[0];
    setConfirmModalVisible(state);
    list.reload();
  };
  const confirmUnBan = () => {
    /*     toast.loading("Đang xóa", { duration: 4000 }); */
    console.log(confirmUnlcokModalVisible[1]);
    unBanUser(confirmUnlcokModalVisible[1]);
    const state = [...confirmUnlcokModalVisible];
    state[0] = !confirmUnlcokModalVisible[0];
    setConfirmUnlcokModalVisible(state);
    list.reload();
  };
  const columns = useMemo(
    () => [
      {
        Header: "Tên user",
        accessor: "url",
        Cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <Link
                href={{
                  pathname: `/profile/[slug]`,
                  query: { slug: row.original.username },
                }}
              >
                <a className="hover:underline font-semibold text-base mb-1">
                  {row.original.name}
                </a>
              </Link>
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
        Header: "Dự án đã tạo",
        accessor: "projectCount",
        Cell: ({ row }) => {
          console.log(row);
          /* const media = row.rogimedia;
          console.log(media) */ return (
            <div>
              <Link
                href={{
                  pathname: `/project/[slug]/photo-collection`,
                  query: { slug: row.original.providers },
                }}
              >
                <a className="hover:underline font-semibold text-base mb-1">
                  {row.original._count.project}
                </a>
              </Link>
            </div>
          );
        },
      },
      {
        Header: "Ảnh đã gởi",
        accessor: "mediaCount",
        Cell: ({ row }) => {
          /* const media = row.rogimedia;
          console.log(media) */ return (
            <div>
              <Link
                href={{
                  pathname: `/project/[slug]/photo-collection`,
                  query: { slug: row.original.providers },
                }}
              >
                <a className="hover:underline font-semibold text-base mb-1">
                  {row.original._count.media}
                </a>
              </Link>
            </div>
          );
        },
      },
      {
        Header: "Trạng thái",
        accessor: "userState",
        Cell: ({ row }) => {
          if (row.original.userState === "ACTIVE") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#389e0d] bg-[#f6ffed] border border-[#b7eb8f]">
                {row.original.userState}
              </span>
            );
          }

          if (row.original.userState === "SUSPENDED") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
                {row.original.userState}
              </span>
            );
          }

          if (row.original.userState === "BANNED") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-red-800 bg-red-300 border border-red-500">
                {row.original.userState}
              </span>
            );
          }

          return (
            <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
              {row.original.userState}
            </span>
          );
        },
      },
      {
        Header: "Ngày tạo",
        accessor: "createdAt",
        Cell: ({ row }) => {
          return (
            <span className="text-sm">
              <Tooltip
                text={
                  <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                    {format(
                      new Date(row.original.createdAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </span>
                }
              >
                {dateFromNow(row.original.createdAt)}
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
                      pathname: `/profile/[slug]/admin-edit`,
                      query: { slug: row.original.username },
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
                {row.original.userState === "BANNED" ? (
                  <span className="text-sm ml-2  ">
                    <Tooltip
                      text={
                        <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                          Mở khóa tài khoản
                        </span>
                      }
                    >
                      <button
                        onClick={() =>
                          setConfirmUnlcokModalVisible([
                            true,
                            row.original.username,
                          ])
                        }
                      >
                        <Unlock />
                      </button>
                    </Tooltip>
                  </span>
                ) : (
                  row.original.role !== "ADMIN" && (
                    <span className="text-sm ml-2  ">
                      <Tooltip
                        text={
                          <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                            Ban
                          </span>
                        }
                      >
                        <button
                          onClick={() =>
                            setConfirmModalVisible([
                              true,
                              row.original.username,
                            ])
                          }
                        >
                          <Slash />
                        </button>
                      </Tooltip>
                    </span>
                  )
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
              confirmButton={confirmBan}
              successText="Các dự án và hình ảnh của người dùng này vẫn được giữ nguyên"
              title="Bạn có muốn ban User này"
            />
            <ConfirmModal
              setModalVisible={setConfirmUnlcokModalVisible}
              modalVisible={confirmUnlcokModalVisible}
              confirmButton={confirmUnBan}
              successText="Các dự án và hình ảnh của người dùng này vẫn được giữ nguyên"
              title="Bạn có muốn mở khóa User này"
            />
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
