import { Loading, LoadingSmall } from "../../common/Loading";
import { TableData } from "../../common/TableData";
import { Tooltip } from "../../common/Tooltip";
import { useAsyncList } from "@react-stately/data";
import { format } from "date-fns";
import { dateFromNow } from "../../../libs/dateFromNow";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import {
  Edit,
  Trash2,
  Image,
  Slash,
  Unlock,
  XCircle,
  DollarSign,
} from "react-feather";
import React, { useEffect, useMemo, useState, useRef, Fragment } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ConfirmModal } from "../../modal/ConfirmModal";
export const MainPayment = ({ user }) => {
  const [confirmModalVisible, setConfirmModalVisible] = useState([false, ""]);
  const [confirmUnlcokModalVisible, setConfirmUnlcokModalVisible] = useState([
    false,
    "",
  ]);
  const [paymentInfoModalVisible, setPaymentInfoModalVisible] = useState(false);
  const [paymentInfoModal, setPaymentInfoModal] = useState(null);
  const [paymentDescriptionModalVisible, setPaymentDescriptionModalVisible] =
    useState(false);
  const [paymentDescriptionId, setPaymentDescriptionId] = useState(null);
  const [paymentDescription, setPaymentDescription] = useState("");
  const cancelButtonRef = useRef();
  const cancelButtonRefHistory = useRef();
  const router = useRouter();
  let list = useAsyncList({
    async load() {
      let res = await fetch(`/api/admin/payment/${router.query.status}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      return { items: json };
    },
  });
  const rejectWithdraw = async (id) => {
    toast.loading("Đang từ chối", { duration: 4000 });
    const req = await fetch(`/api/admin/payment/reject-withdraw?id=${id}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    if (!req.ok) {
      toast.error("Có lỗi thực hiện, vui lòng thử lại");
    }
    if (req.ok) {
      toast.success("Từ chối thành công");
      list.reload();
    }
  };
  async function handleAddDesciption(description, id) {
    toast.loading("Đang thêm chú thích", { duration: 4000 });
    const response = await fetch("/api/admin/payment/add-payment-description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken(true)}`,
      },
      body: JSON.stringify({ description: description, id: id }),
    });
    if (response.ok) {
      toast.success("Thêm thành công");
      setPaymentDescriptionModalVisible(false);
      list.reload();
    } else {
      toast.error("Có lỗi xảy ra");
    }
  }
  const paidWithdraw = async (id) => {
    toast.loading("Đang thanh toán", { duration: 4000 });
    const req = await fetch(`/api/admin/payment/paid-withdraw?id=${id}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    if (!req.ok) {
      toast.error("Có lỗi khi thực hiện, vui lòng thử lại");
    }
    if (req.ok) {
      toast.success("Thanh toán thành công");
      list.reload();
    }
  };
  useEffect(() => {
    list.reload();
  }, [router.query.status]);
  const confirmPaid = () => {
    /*     toast.loading("Đang xóa", { duration: 4000 }); */
    console.log(confirmModalVisible[1]);
    paidWithdraw(confirmModalVisible[1]);
    const state = [...confirmModalVisible];
    state[0] = !confirmModalVisible[0];
    setConfirmModalVisible(state);
    list.reload();
  };
  const confirmReject = () => {
    /*     toast.loading("Đang xóa", { duration: 4000 }); */
    console.log(confirmUnlcokModalVisible[1]);
    rejectWithdraw(confirmUnlcokModalVisible[1]);
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
                  query: { slug: row.original.user.username },
                }}
              >
                <a className="hover:underline font-semibold text-base mb-1">
                  {row.original.user.name}
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
        Header: "Số tiền",
        accessor: "amount",
        Cell: ({ row }) => {
          return <div>{row.original.amount}</div>;
        },
      },

      {
        Header: "Trạng thái",
        accessor: "withdrawPointState",
        Cell: ({ row }) => {
          if (row.original.withdrawPointState === "PAID") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#389e0d] bg-[#f6ffed] border border-[#b7eb8f]">
                {row.original.withdrawPointState}
              </span>
            );
          }

          if (row.original.withdrawPointState === "PAYING") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
                {row.original.withdrawPointState}
              </span>
            );
          }

          if (row.original.withdrawPointState === "REJECT") {
            return (
              <span className="px-2 py-1 rounded-xs font-medium text-xs text-red-800 bg-red-300 border border-red-500">
                {row.original.withdrawPointState}
              </span>
            );
          }

          return (
            <span className="px-2 py-1 rounded-xs font-medium text-xs text-[#d48806] bg-[#fffbe6] border border-[#ffe58f]">
              {row.original.withdrawPointState}
            </span>
          );
        },
      },
      {
        Header: "Thông tin",
        accessor: "paymentInfo",
        Cell: ({ row }) => {
          return (
            <button
              className="text-center text-gray-800 shadow border-[#2e43ff] justify-center items-center rounded-xl h-full py-1 px-2"
              onClick={() => {
                setPaymentInfoModalVisible(true);
                setPaymentInfoModal(row.original.userPaymentMethod);
              }}
            >
              Hiển thị
            </button>
          );
        },
      },
      {
        Header: "Chú thích",
        accessor: "description",
        Cell: ({ row }) => {
          return (
            <button
              className="text-center text-gray-800 shadow border-[#2e43ff] justify-center items-center rounded-xl h-full py-1 px-2"
              onClick={() => {
                setPaymentDescriptionModalVisible(true);
                setPaymentDescriptionId(row.original.id);
                setPaymentDescription(row.original.description);
              }}
            >
              Nhập
            </button>
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
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <>
              <div className="flex flex-row ">
                {row.original.withdrawPointState === "PAYING" && (
                  <>
                    <span className="text-sm ml-2  ">
                      <Tooltip
                        text={
                          <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                            Xác nhận đã chuyển tiền
                          </span>
                        }
                      >
                        <button
                          onClick={() =>
                            setConfirmModalVisible([true, row.original.id])
                          }
                        >
                          <DollarSign />
                        </button>
                      </Tooltip>
                    </span>
                    <span className="text-sm ml-2  ">
                      <Tooltip
                        text={
                          <span className="px-2 py-1 rounded-sm text-xs bg-black text-white">
                            Từ chối thanh toán
                          </span>
                        }
                      >
                        <button
                          onClick={() =>
                            setConfirmUnlcokModalVisible([
                              true,
                              row.original.id,
                            ])
                          }
                        >
                          <XCircle />
                        </button>
                      </Tooltip>
                    </span>
                  </>
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
            {paymentInfoModal && (
              <Transition.Root show={paymentInfoModalVisible} as={Fragment}>
                <Dialog
                  as="div"
                  static
                  className="fixed z-40 inset-0 overflow-y-auto"
                  initialFocus={cancelButtonRefHistory}
                  open={paymentInfoModalVisible}
                  onClose={setPaymentInfoModalVisible}
                >
                  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                      className="hidden sm:inline-block sm:align-middle sm:h-screen"
                      aria-hidden="true"
                    >
                      &#8203;
                    </span>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="absolute top-0 right-0">
                              <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() =>
                                  setPaymentInfoModalVisible(false)
                                }
                              >
                                <XCircle color="white" />
                              </button>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <Dialog.Title
                                as="h3"
                                className="text-2xl leading-6 font-medium text-gray-900 mb-3 "
                              >
                                Thông tin thanh toán
                              </Dialog.Title>
                              <div>
                                <p className="text-base text-gray-600 py-1">
                                  Hình thức thanh toán:{" "}
                                  <span className="font-bold">
                                    {paymentInfoModal.userPaymentMethodId.toUpperCase()}
                                  </span>
                                </p>
                                <p className="text-base text-gray-600 py-1">
                                  Họ tên người nhận tiền:{" "}
                                  <span className="font-bold">
                                    {paymentInfoModal.name}
                                  </span>{" "}
                                </p>
                                {paymentInfoModal.phone !== "" && (
                                  <p className="text-base text-gray-600 py-1">
                                    Số điện thoại ví:{" "}
                                    <span className="font-bold">
                                      {paymentInfoModal.phone}
                                    </span>{" "}
                                  </p>
                                )}
                                {paymentInfoModal.stk !== "" && (
                                  <p className="text-base text-gray-600 py-1">
                                    Số tài khoản:{" "}
                                    <span className="font-bold">
                                      {paymentInfoModal.stk}
                                    </span>{" "}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"></div>
                      </div>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>
            )}
            <Transition.Root
              show={paymentDescriptionModalVisible}
              as={Fragment}
            >
              <Dialog
                as="div"
                static
                className="fixed z-40 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRefHistory}
                open={paymentDescriptionModalVisible}
                onClose={setPaymentDescriptionModalVisible}
              >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                  </Transition.Child>

                  {/* This element is to trick the browser into centering the modal contents. */}
                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => {
                                setPaymentDescriptionModalVisible(false);
                                setPaymentDescriptionId(null);
                              }}
                            >
                              <XCircle color="white" />
                            </button>
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title
                              as="h3"
                              className="text-2xl leading-6 font-medium text-gray-900 mb-3 "
                            >
                              Chú thích
                            </Dialog.Title>
                            <div className="justify-center items-center flex flex-col">
                              <textarea
                                cols="55"
                                rows="10"
                                className="p-4 border border-gray-300 rounded-md"
                                value={paymentDescription}
                                onChange={(e) =>
                                  setPaymentDescription(e.target.value)
                                }
                              />

                              <button
                                className="border border-[#1B9284] rounded-md mt-5 p-1 px-2 "
                                onClick={() => {
                                  handleAddDesciption(
                                    paymentDescription,
                                    paymentDescriptionId
                                  );
                                }}
                              >
                                Đồng ý
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"></div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>
            <Toaster />
            <ConfirmModal
              setModalVisible={setConfirmModalVisible}
              modalVisible={confirmModalVisible}
              confirmButton={confirmPaid}
              successText="Giao dịch này sẽ được tính là đã thanh toán. Bạn nên lưu thông tin giao dịch ở ô chú thích"
              title="Xác nhận thanh toán?"
            />
            <ConfirmModal
              setModalVisible={setConfirmUnlcokModalVisible}
              modalVisible={confirmUnlcokModalVisible}
              confirmButton={confirmReject}
              successText="Giao dịch này sẽ được tính là đã từ chối. Bạn nên nêu lý do từ chối ở ô chú thích"
              title="Xác nhận từ chối?"
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
