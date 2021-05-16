import { Loading, LoadingSmall } from "../common/Loading";
import { TableData } from "../common/TableData";
import { Tooltip } from "../common/Tooltip";
import { useAsyncList } from "@react-stately/data";
import { format } from "date-fns";
import { dateFromNow } from "../../libs/dateFromNow";
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { MdClear } from "react-icons/md";
import { Edit, Trash2, DollarSign } from "react-feather";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HeaderPaymentUser } from "./HeaderPaymentUser";
import { nanoid } from "nanoid";
export const MainPaymentUser = ({ user }) => {
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentModalAll, setPaymentModalAll] = useState(false);
  const [batchModal, setBatchModal] = useState(false);
  const [paymentID, setPaymentID] = useState(nanoid(12));
  const [photoData, setPhotoData] = useState([]);
  const [itemSelected, setItemSelected] = useState(0);
  const router = useRouter();
  let list = useAsyncList({
    async load() {
      if (router.query.slug) {
        let res = await fetch(
          `/api/posts/pay-for-photos/find-photos?slug=${router.query.slug}`,
          {
            headers: {
              Authorization: `Bearer ${await user.getIdToken(true)}`,
            },
          }
        );

        let json = await res.json();
        var result = json.reduce(function (r, a) {
          r[a.userId] = r[a.userId] || [];
          r[a.userId].push(a);
          return r;
        }, Object.create(null));
        const finalResult = Object.values(result);
        setPhotoData(finalResult);
        return { items: finalResult };
      }
      return { items: [] };
    },
  });
  useEffect(() => {
    list.reload();
  }, [router.query.slug]);
  const RenderModal = ({ id, data }) => {
    const navigate = () => {
      /*       var temp = [...modalPhotoVisible];
      temp[id] = !temp[id]; */
      setModalPhotoVisible(!modalPhotoVisible);
      /* navigation.navigate('Project'); */
    };
    if (data.length > 0) {
      return (
        <Modal
          isOpen={modalPhotoVisible}
          ariaHideApp={false}
          onRequestClose={navigate}
          contentLabel="Thành Công"
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              zIndex: 20,
            },
            content: {
              position: "absolute",

              top: "0px",
              left: "0px",
              right: "0px",
              bottom: "0px",
              border: "0px solid #ccc",
              backgroundColor: "transparent",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              padding: "5px",
            },
          }}
        >
          <div className=" flex flex-row justify-center ">
            <Carousel autoPlay={true} infiniteLoop={true} dynamicHeight={true}>
              {data[id].map((item, index) => (
                <div key={index} className=" w-full  bg-[#cfcfcf] ">
                  <button
                    onClick={navigate}
                    className="absolute top-10 focus:outline-none bg-gray-500 rounded z-30 right-8"
                  >
                    <MdClear size={30} color="white" />
                  </button>
                  <img
                    className="object-contain w-full max-h-[600px]"
                    src={item.url}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </Modal>
      );
    } else {
      return <div>Chưa có dữ liệu</div>;
    }
  };
  const confirmPayForPhotos = async (data, sumAmount) => {
    toast.loading("Đang thanh toán", { duration: 3000 });
    const response = await fetch(
      "/api/posts/pay-for-photos/project-transaction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
        body: JSON.stringify({
          data: { sumAmount: sumAmount, senderPhotosData: data },
        }),
      }
    );
    /* console.log(await response.json()); */
    if (response.ok) {
      list.reload();
      setPaymentModal(false);
      toast.success("Thanh toán thành công");
    } else {
      toast.error(await response.text());
    }
  };
  const confirmPayForAllPhotos = async (data, sumAmount) => {
    toast.loading("Đang thanh toán", { duration: 3000 });
    const response = await fetch(
      "/api/posts/pay-for-photos/project-transaction-all",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
        body: JSON.stringify({
          data: { sumAmount: sumAmount, senderPhotosData: data },
        }),
      }
    );

    if (response.ok) {
      const re = await response.json();
      list.reload();
      setPaymentModal(false);
      toast.success(
        `Có ${re[0]} giao dịch thành công, ${re[1]} giao dịch thất bại`,
        { duration: 6000 }
      );
    } else {
      toast.error(await response.text());
    }
  };
  const PaymentModal = ({ id, data }) => {
    console.log(id);
    console.log(data[id]);
    const navigate = () => {
      /*       var temp = [...modalPhotoVisible];
      temp[id] = !temp[id]; */
      setPaymentModal(!paymentModal);
      /* navigation.navigate('Project'); */
    };
    if (data.length > 0) {
      const note = paymentID;
      const amount = data[id].length * data[id][0].project?.price;
      return (
        <Modal
          isOpen={paymentModal}
          ariaHideApp={false}
          onRequestClose={navigate}
          contentLabel="Thành Công"
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              zIndex: 20,
            },
            content: {
              position: "absolute",

              top: "100px",
              left: "40px",
              right: "40px",
              bottom: "40px",
              border: "0px solid #ccc",
              backgroundColor: "transparent",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              padding: "20px",
            },
          }}
        >
          <button
            onClick={navigate}
            className="absolute top-10 focus:outline-none bg-gray-500 rounded z-30 right-8"
          >
            <MdClear size={30} color="white" />
          </button>
          <div className=" bg-white rounded-xl p-3 items-center shadow justify-center flex flex-col text-lg ">
            <div className="text-center  py-1.5 mx-4  rounded-md mb-4 text-[#006A73] font-semibold px-1.5 text-2xl ">
              Tạo giao dịch thanh toán
            </div>
            <div className="flex flex-row">
              <div className="mr-5">
                Tên dự án:{" "}
                <span className="font-bold">
                  {data[id][0].project.projectName}
                </span>
              </div>
              <Link href={`/profile/${data[id][0].user.username}`}>
                <div>
                  Người nhận:{" "}
                  <a>
                    <span className="font-bold">{data[id][0].user.name}</span>
                  </a>
                </div>
              </Link>
            </div>
            <div className="flex flex-row">
              <div className="mr-5">
                Số ảnh: <span className="font-bold">{data[id].length}</span>
              </div>
              <div>
                Tổng số tiền: <span className="font-bold">{amount}</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="text-center shadow bg-[#21b532] justify-center items-center rounded-xl h-full py-1 px-2 text-white"
                onClick={() => confirmPayForPhotos(data[id], amount)}
              >
                Đồng ý chuyển tiền
              </button>
            </div>
          </div>
        </Modal>
      );
    }
    return <></>;
  };
  const PaymentModalAll = ({ id, data }) => {
    const navigate = () => {
      /*       var temp = [...modalPhotoVisible];
      temp[id] = !temp[id]; */
      setPaymentModalAll(!paymentModalAll);
      /* navigation.navigate('Project'); */
    };
    if (data.length > 0) {
      const note = paymentID;
      var amount = 0;
      var photosCount = 0;
      data.map((item) => {
        photosCount = photosCount + item.length;
        amount = amount + item.length * item[0].project?.price;
      });
      return (
        <Modal
          isOpen={paymentModalAll}
          ariaHideApp={false}
          onRequestClose={navigate}
          contentLabel="Thành Công"
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              zIndex: 20,
            },
            content: {
              position: "absolute",

              top: "100px",
              left: "40px",
              right: "40px",
              bottom: "40px",
              border: "0px solid #ccc",
              backgroundColor: "transparent",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              padding: "20px",
            },
          }}
        >
          <button
            onClick={navigate}
            className="absolute top-10 focus:outline-none bg-gray-500 rounded z-30 right-8"
          >
            <MdClear size={30} color="white" />
          </button>
          <div className=" bg-white rounded-xl p-3 items-center shadow justify-center flex flex-col text-lg ">
            <div className="text-center  py-1.5 mx-4  rounded-md mb-4 text-[#006A73] font-semibold px-1.5 text-2xl ">
              Tạo giao dịch thanh toán hàng loạt
            </div>
            <div className="flex flex-row ">
              <div className="mr-5">
                Tên dự án:
                <span className="font-bold">
                  {data[id][0].project.projectName}
                </span>
              </div>
              <div>
                Tổng số người nhận:
                <span className="font-bold">{data.length} người</span>
              </div>
            </div>
            <div className="flex flex-row border-b border-gray-300 pb-3">
              <div className="mr-5">
                Tổng số ảnh:
                <span className="font-bold">{photosCount} </span>
              </div>
              <div>
                Tổng số tiền:
                <span className="font-bold">{amount}</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                className="text-center shadow bg-[#21b532] justify-center items-center rounded-xl h-full py-1 px-2 text-white"
                onClick={() => confirmPayForAllPhotos(data, amount)}
              >
                Đồng ý chuyển tiền
              </button>
            </div>
          </div>
        </Modal>
      );
    }
    return <></>;
  };
  const ConfirmBatchModal = ({ id, data }) => {
    const navigate = () => {
      /*       var temp = [...modalPhotoVisible];
      temp[id] = !temp[id]; */
      setBatchModal(!batchModal);
      /* navigation.navigate('Project'); */
    };
    if (data.length > 0) {
      const note = paymentID;
      var amount = 0;
      var photosCount = 0;
      data.map((item) => {
        photosCount = photosCount + item.length;
        amount = amount + item.length * item[0].project?.price;
      });
      return (
        <Modal
          isOpen={batchModal}
          ariaHideApp={false}
          onRequestClose={navigate}
          contentLabel="Thành Công"
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              zIndex: 20,
            },
            content: {
              position: "absolute",

              top: "100px",
              left: "40px",
              right: "40px",
              bottom: "40px",
              border: "0px solid #ccc",
              backgroundColor: "transparent",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              padding: "20px",
            },
          }}
        >
          <button
            onClick={navigate}
            className="absolute top-10 focus:outline-none bg-gray-500 rounded z-30 right-8"
          >
            <MdClear size={30} color="white" />
          </button>
          <div className=" bg-white rounded-xl p-3 items-center shadow justify-center flex flex-col text-lg ">
            <div className="text-center  py-1.5 mx-4  rounded-md mb-4 text-[#006A73] font-semibold px-1.5 text-2xl ">
              Bạn có muốn tạo giao dịch cho những hình ảnh này <br /> Các hình
              ảnh bạn duyệt sau này sẽ được thêm vào lần giao dịch sau
            </div>
          </div>
          <button
            className="py-0.5 px-6 rounded-md bg-[#006A73] mt-3 mb-1 mr-5"
            onClick={navigate}
          >
            <div style={{ color: "white", fontSize: 15, paddingVertical: 3 }}>
              Hủy
            </div>
          </button>
          <button
            className="py-0.5 px-6 rounded-md bg-[#006A73] mt-3 mb-1"
            onClick={navigate}
          >
            <div style={{ color: "white", fontSize: 15, paddingVertical: 3 }}>
              Đồng ý
            </div>
          </button>
        </Modal>
      );
    }
    return <></>;
  };
  const columns = useMemo(
    () => [
      {
        Header: "Hình ảnh",
        accessor: "url",
        Cell: ({ row }) => {
          const id = parseInt(row.id);
          return (
            <>
              <div className="flex flex-col">
                <button
                  className="hover:underline font-semibold text-base mb-1 focus:outline-none"
                  onClick={() => {
                    setModalPhotoVisible(!modalPhotoVisible);
                    setItemSelected(id);
                  }}
                >
                  <img src={row.original[0].url} className="w-28 h-20 shadow" />
                </button>
              </div>
            </>
          );
        },
      },
      {
        Header: "Số lượng",
        accessor: "amount",
        Cell: ({ row }) => {
          return (
            <>
              <div className="hover:underline font-semibold">
                {row.original.length}
              </div>
            </>
          );
        },
      },
      {
        Header: "Người gởi",
        accessor: "author",
        Cell: ({ row }) => {
          return (
            <Link
              href={{
                pathname: `/profile/${row.original[0].user.username}`,
              }}
            >
              <a className="hover:underline font-semibold">
                {row.original[0].user.name}{" "}
              </a>
            </Link>
          );
        },
      },
      {
        Header: "Tổng số tiền",
        accessor: "sumMoney",
        Cell: ({ row }) => {
          return (
            <>
              <Tooltip
                text={
                  <span className="px-2 mr-5 py-1 rounded-sm text-xs bg-black text-white">
                    {row.original.length} * {row.original[0].project.price}
                  </span>
                }
              >
                <div className=" font-semibold">
                  {row.original.length * row.original[0].project.price} đ
                </div>
              </Tooltip>
            </>
          );
        },
      },
      /* {
        Header: "Trạng thái",
        accessor: "status",
        Cell: ({ row }) => {
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
      }, */
      /*  {
        Header: "Ngày gởi",
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
      }, */
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
                      new Date(row.original[0].updatedAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </span>
                }
              >
                {dateFromNow(row.original[0].updatedAt)}
              </Tooltip>
            </span>
          );
        },
      },
      {
        Header: "Hành động",
        accessor: "id",
        Cell: ({ row }) => {
          const id = parseInt(row.id);
          return (
            <div className="flex flex-row">
              {/* <span className="text-sm mr-2">
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
              </span> */}
              <span className="text-sm ml-2">
                <button
                  onClick={() => {
                    setItemSelected(id);
                    setPaymentModal(true);
                  }}
                  className="text-center mr-4 text-white shadow bg-[#ff8a24]  rounded-xl h-full py-1 px-2"
                >
                  Thanh toán
                </button>
              </span>
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
        {list.isLoading && router.query.slug === undefined ? (
          <LoadingSmall />
        ) : (
          <>
            <Toaster />
            <PaymentModal id={itemSelected} data={photoData} />
            <PaymentModalAll id={itemSelected} data={photoData} />
            <ConfirmBatchModal id={itemSelected} data={photoData} />
            <RenderModal id={itemSelected} data={photoData} />
            <HeaderPaymentUser user={user} confirm={setPaymentModalAll} />
            {list.items.length > 0 ? (
              <TableData columns={columns} data={list.items} />
            ) : (
              <div className="text-center text-2xl text-gray-600">
                Bạn chưa duyệt hình ảnh nào
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
