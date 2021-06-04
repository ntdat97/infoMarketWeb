import React, {
  useState,
  useEffect,
  useLayoutEffect,
  Fragment,
  useRef,
  useMemo,
} from "react";
import { IoEarth, IoPencil } from "react-icons/io5";
import { useAuth } from "../../fb/auth";
import { firebaseClient } from "../../fb/firebaseClient";
import { useAsyncList } from "@react-stately/data";
import { Dialog, Transition } from "@headlessui/react";
import { TableData } from "../common/TableData";
import {
  ArrowDown,
  Edit,
  CheckCircle,
  XCircle,
  Trash,
  RotateCcw,
} from "react-feather";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { Uploader } from "../common/Upload";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import vi from "date-fns/locale/vi";
/* 
import { firebase } from "../firebase/config"; */
/* import Login from "./Login"; */

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [initValues, setInitValues] = useState([
    {
      id: user.id,
      email: user.email,
      role: "USER",
      name: user.name,
      providers: "",
      username: "",
      photoURL: user.photoURL,
      website: "",
      bio: "",
      userPaymentMethod: [],
      _count: { media: 0, project: 0 },
    },
    0,
  ]);
  const [coverImage, setCoverImage] = useState(null);
  const [isShowUploader, setIsShowUploader] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);
  const [provider, setProvider] = useState(null);
  const [ewallet, setEwallet] = useState(null);
  const [bank, setBank] = useState(null);
  const [tranId, setTranId] = useState("");
  const [amountMoney, setAmountMoney] = useState("");
  const [paymentData, setPaymentData] = useState(null);
  const [paymentHistoryModal, setPaymentHistoryModal] = useState(false);
  const [paymentWithdrawModal, setPaymentWithdrawModal] = useState(false);
  const [userPoint, setUserPoint] = useState(0);
  const [depositInfoModal, setDepositInfoModal] = useState(false);
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(null);
  const cancelButtonRef = useRef();
  const cancelButtonRefHistory = useRef();
  const cancelButtonRefWithdraw = useRef();
  const { signout } = useAuth();
  const formik = useFormik({
    initialValues: {
      bio: initValues[0].bio,
      website: initValues[0].website,
      avatarURL: initValues[0].photoURL,
      displayName: initValues[0].name,
      userPaymentMethod: initValues[0].userPaymentMethod,
    },
    onSubmit: (values) => handleChangeProfile(values),
  });
  const formikPayment = useFormik({
    initialValues: {
      provider: "",
      ewalletProvider: "",
      bankProvider: "",
      name: "",
      phone: "",
      stk: "",
      id: "",
    },
    validationSchema: yup.object().shape({
      provider: yup.string().required("Vui lòng chọn phương thức thanh toán"),
      name: yup.string().required("Vui lòng nhập tên"),
      ewalletProvider: yup.string().when("provider", {
        is: "EWALLET",
        then: yup.string().required("Vui lòng chọn đơn vị cung cấp"),
      }),
      bankProvider: yup.string().when("provider", {
        is: "BANK",
        then: yup.string().required("Vui lòng chọn đơn vị cung cấp"),
      }),
      phone: yup.number().when("provider", {
        is: "EWALLET",
        then: yup
          .number()
          .required("Vui lòng nhập số điện thoại")
          .typeError("Vui lòng nhập đúng định dạng"),
      }),
      stk: yup.number().when("provider", {
        is: "BANK",
        then: yup
          .number()
          .required("Vui lòng nhập số tàu khoản")
          .typeError("Vui lòng nhập đúng định dạng"),
      }),
    }),
    onSubmit: (values) => handleAddPayment(values),
  });
  useEffect(() => {
    if (coverImage) {
      formik.setFieldValue(
        "avatarURL",
        coverImage[0].response.body.data[0].linkUrl
      );
    }
  }, [coverImage]);
  const columns = useMemo(
    () => [
      {
        Header: "Loại",
        accessor: "type",
        Cell: ({ row }) => {
          return (
            <div className="">
              {typeof row.original.withdrawPointState !== "undefined"
                ? "Rút tiền"
                : "Nạp tiền"}
            </div>
          );
        },
      },
      {
        Header: "Hình thức",
        accessor: "method",
        Cell: ({ row }) => {
          return <div>MOMO</div>;
        },
      },
      {
        Header: "Trạng thái",
        accessor: "status",
        Cell: ({ row }) => {
          return (
            <div>
              {typeof row.original.withdrawPointState != "undefined"
                ? row.original.withdrawPointState
                : "PAID"}
            </div>
          );
        },
      },
      {
        Header: "Chú thích",
        accessor: "description",
        Cell: ({ row }) => {
          return (
            <div className="max-w-[200px] overflow-y-auto">
              {row.original.description}
            </div>
          );
        },
      },
      {
        Header: "Ngày tạo",
        accessor: "createAt",
        Cell: ({ row }) => {
          return (
            <div>{new Date(row.original.createdAt).toLocaleDateString(vi)}</div>
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
    ],
    []
  );

  async function handleChangeProfile(values) {
    toast.loading("Đang cập nhật", { duration: 4000 });
    console.log(formik.values);
    const response = await fetch("/api/profile/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken(true)}`,
      },
      body: JSON.stringify({ data: { values } }),
    });
    if (response.ok) {
      toast.success("Thay đổi thành công");
    } else {
      toast.error("Có lỗi xảy ra");
    }
  }
  async function handleDepositMoney(values) {
    toast.loading("Đang kiểm tra", { duration: 4000 });
    const response = await fetch("/api/profile/deposit-money-momo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken(true)}`,
      },
      body: JSON.stringify({ data: { values } }),
    });
    /* setPaymentData(); */
    if (response.ok) {
      const re = await response.json();
      if (re?.statusPayment === "ok") {
        setPaymentData(values);
      } else {
        toast.error(re.msg);
      }
    } else {
      toast.error("Có lỗi xảy ra");
    }
  }
  const checkTranId = async (tranId) => {
    toast.loading("Đang kiểm tra", { duration: 3000 });
    setPaymentData(null);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    var raw =
      '{\r\n	"access_token": "he2BWRBcBZpDOsmimfSu6DXABbycBzc7n4Fp3RmbpTOpYNhOoz",\r\n	"tranId": ' +
      `"${tranId}"` +
      "\r\n}\r\n";

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://momofree.apimienphi.com/api/checkTranId", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error === 0) {
          handleDepositMoney(result.data);
        } else {
          toast.error(result.msg);
        }
      })
      .catch((error) => console.log("error", error));
  };
  async function handleAddPayment(values) {
    toast.loading("Đang thêm Payment", { duration: 4000 });

    const response = await fetch("/api/profile/add-payment-method", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken(true)}`,
      },
      body: JSON.stringify({ data: { values } }),
    });
    if (response.ok) {
      toast.success("Thêm thành công");
      me.reload();
    } else {
      toast.error("Có lỗi xảy ra");
    }
  }
  async function withdrawMoney() {
    const response = await fetch("/api/profile/withdraw-money", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken(true)}`,
      },
      body: JSON.stringify({
        data: { amount: amountMoney, method: paymentMethodSelected },
      }),
    });
    if (response.ok) {
      me.reload();
      setPaymentWithdrawModal(false);
      toast.success("Tạo lệnh rút tiền thành công");
    } else {
      toast.error(await response.text());
    }
  }
  async function getPaymentHistory() {
    const response = await fetch("/api/profile/get-payment-history", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken(true)}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const concat = data.userDepositRecorder.concat(data.userWithdrawRecorder);
      setPaymentHistoryData(concat);
    } else {
      toast.error("Có lỗi xảy ra khi tải lịch sử");
    }
  }
  async function handleDelPayment(paymentId) {
    toast.loading("Đang xóa Payment", { duration: 4000 });
    const response = await fetch(
      `/api/profile/update-payment?paymentId=${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      }
    );
    const res = await response.json();
    console.log(res);
    if (response.ok) {
      toast.success("Xóa thành công");
      router.reload();
    } else {
      toast.error("Có lỗi xảy ra");
    }
  }
  let me = useAsyncList({
    async load() {
      let res = await fetch("/api/profile/me", {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });
      let payment = await fetch("/api/profile/get-payment-method", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      let json = await res.json();
      let paymentJson = await payment.json();
      setUserPoint(json[0].point);
      formik.setFieldValue("bio", json[0].bio);
      formik.setFieldValue("website", json[0].website);
      formik.setFieldValue("avatarURL", json[0].photoURL);
      formik.setFieldValue("displayName", json[0].name);
      formik.setFieldValue("userPaymentMethod", json[0].userPaymentMethod);
      if (json[0].userPaymentMethod.length > 0) {
        const temp = [];
        json[0].userPaymentMethod.map((item, index) => {
          temp.push({ isEdit: false, id: item.id });
        });
        setIsEditingPayment(temp);
      }
      setInitValues(json);
      return { items: paymentJson };
    },
  });

  return (
    <>
      {isShowUploader ? (
        <Uploader
          isOpen={isShowUploader}
          setIsOpen={setIsShowUploader}
          outFiles={coverImage}
          setOutFile={setCoverImage}
          isAllowMultipleUploads={false}
          /* setCountTempFiles={setCountTemp} 
               isUploadButtonDisable={countUserPhoto > 12 ? true : false} */
        />
      ) : null}
      <Toaster />
      <Transition.Root show={depositInfoModal} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-40 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={depositInfoModal}
          onClose={setDepositInfoModal}
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
                        onClick={() => setDepositInfoModal(false)}
                      >
                        <XCircle color="white" />
                      </button>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl leading-6 font-medium text-gray-900"
                      >
                        Hướng dẫn nạp tiền vào tài khoản
                      </Dialog.Title>
                      <div className="mt-2 ">
                        <p className="text-base text-gray-600">
                          - Hiện tại hệ thống chỉ hỗ trợ nạp tự động qua ví MOMO
                        </p>
                        <p className="text-base text-gray-600">
                          $$$ Bạn vui lòng chuyển tiền qua MOMO với thông tin
                          sau
                        </p>
                        <p className="text-base text-gray-600 py-1">
                          <span className="font-bold">Bước 1:</span> Chuyển tiền
                          tới: <span className="font-bold">0383679476</span>{" "}
                          <br />
                          Họ tên người nhận tiền:{" "}
                          <span className="font-bold">Nguyễn Tấn Đạt</span>{" "}
                          <br />
                        </p>
                        <p className="text-base text-gray-600 py-1">
                          <span className="font-bold">Bước 2:</span> Nhập số
                          tiền bạn muốn nạp và thanh toán <br />
                        </p>
                        <p className="text-base text-gray-600 py-1">
                          <span className="font-bold">Bước 3:</span> Sao chép mã
                          giao dịch và dán vào ô bên dưới, sau đó nhấn kiểm tra
                          <br />
                        </p>
                        <img src="/depositDescription.jpg" className="" />
                        <div className="flex flex-row items-center  m-1 border border-[#1B9284] p-2 rounded-md">
                          <p className="mr-2">Nhập mã giao dịch</p>
                          <input
                            type="text"
                            value={tranId}
                            onInput={(e) => setTranId(e.target.value)}
                            className="border border-gray-400 p-1 rounded-md"
                          />
                          <button
                            className="border border-[#1B9284] rounded-md ml-2 p-1 px-2"
                            onClick={() => checkTranId(tranId)}
                          >
                            Kiểm tra
                          </button>
                        </div>
                        {paymentData && (
                          <div className="flex flex-row items-center  m-1 bg-[#1B9284]  p-2 rounded-md">
                            <p className="text-base text-white">
                              Bạn đã nạp thành công số tiền{" "}
                              <span className="font-bold">
                                {paymentData.amount}
                              </span>
                            </p>
                          </div>
                        )}

                        <p className="text-sm text-green-500">
                          - Cần 10 - 60 giây để hệ thống nhận kết quả nạp tiền
                        </p>
                        <p className="text-sm text-green-500">
                          - Chắc chắn bạn đã làm đủ và đúng các bước trên, nếu
                          không đúng hoặc đủ có thể dẫn tới hệ thống không thể
                          tự động nhận diện số tiền bạn nạp và phải có sự can
                          thiệp thủ công của chúng tôi. Điều đó có thể mất phí
                          và thời gian chờ
                        </p>
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
      {paymentHistoryData.length > 0 && (
        <Transition.Root show={paymentHistoryModal} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed z-40 inset-0 overflow-y-auto"
            initialFocus={cancelButtonRefHistory}
            open={paymentHistoryModal}
            onClose={setPaymentHistoryModal}
          >
            <div className="flex items-end justify-center min-h-screen w pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="absolute top-0 right-0">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => setPaymentHistoryModal(false)}
                        >
                          <XCircle color="white" />
                        </button>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-2xl leading-6 font-medium text-gray-900 mb-3 "
                        >
                          Lịch sử nạp tiền
                        </Dialog.Title>
                        <TableData
                          columns={columns}
                          data={paymentHistoryData}
                        />
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
      {initValues[0].userPaymentMethod.length > 0 && (
        <Transition.Root show={paymentWithdrawModal} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed z-40 inset-0 overflow-y-auto"
            initialFocus={cancelButtonRefWithdraw}
            open={paymentWithdrawModal}
            onClose={setPaymentWithdrawModal}
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
                          onClick={() => setPaymentWithdrawModal(false)}
                        >
                          <XCircle color="white" />
                        </button>
                      </div>
                      <div className="ml-10 mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-2xl leading-6 font-medium text-gray-900 mb-3 "
                        >
                          Hướng dẫn rút tiền
                        </Dialog.Title>
                        <div className="mb-2">
                          <span className="font-bold">Bước 1:</span> Chọn phương
                          thức nhận tiền
                        </div>
                        <div className="flex flex-row mb-2">
                          {initValues[0].userPaymentMethod.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex flex-row border border-[#006A73] rounded-md p-1 m-1 items-center justify-center"
                              >
                                {item.userPaymentMethodId.toUpperCase()}
                                <input
                                  type="radio"
                                  value={item.id}
                                  checked={
                                    item.id === paymentMethodSelected
                                      ? true
                                      : false
                                  }
                                  name="payment"
                                  className="ml-1"
                                  onChange={(event) =>
                                    setPaymentMethodSelected(event.target.value)
                                  }
                                />
                              </div>
                            )
                          )}
                        </div>
                        <div className=" mb-2">
                          <span className="font-bold">Bước 2:</span> Nhập số
                          tiền cần rút
                        </div>
                        <div>
                          <input
                            type="number"
                            className="border border-gray-400 p-1 rounded-md appearance-none mb-2"
                            value={amountMoney}
                            onInput={(e) => setAmountMoney(e.target.value)}
                          />
                        </div>
                        <div>
                          <button
                            className="border border-[#1B9284] rounded-md  p-1 px-2"
                            onClick={() => {
                              if (amountMoney <= userPoint) {
                                toast.loading("Đang thực hiện", {
                                  duration: 4000,
                                });
                                withdrawMoney();
                              } else {
                                toast.error("Số dư của bạn không đủ");
                              }
                            }}
                          >
                            Rút tiền
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
      )}
      <div className="flex flex-col w-full bg-[#F8F8F8] max-w-[1108px] mx-auto ">
        <div className="px-[22px] bg-white">
          <div className="flex flex-row mt-3">
            <div className="w-2/12 items-center py-3 flex-row flex justify-center">
              <img
                src={
                  coverImage ? formik.values.avatarURL : user.photoURL
                } /* coverImage ? coverImage : user.photoURL */
                style={{ width: 80, height: 80 }}
                className="rounded-full"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsShowUploader(true)}
                  className="mt-16 border-2"
                >
                  <IoPencil />
                </button>
              )}
            </div>
            <div className="w-10/12 flex flex-col  justify-center ">
              {isEditing ? (
                <div className="items-center">
                  <input
                    className=" font-bold   text-gray-700 focus:outline-none focus:ring focus:border-blue-300 border border-gray-300 rounded  py-1 my-1 px-4 block  appearance-none"
                    placeholder="Nhập tên hiển thị"
                    name="displayName"
                    value={formik.values.displayName}
                    onChange={formik.handleChange}
                  />
                </div>
              ) : (
                <div style={{ paddingBottom: 5, fontSize: 18 }}>
                  {user.displayName ? user.displayName : initValues[0].name}
                </div>
              )}

              <div style={{ fontSize: 18, color: "#868483" }}>
                {user.email ? user.email : initValues[0].email}
              </div>
              <div className="flex flex-row">
                <div style={{ fontSize: 18, color: "#868483" }}>
                  {userPoint} đ
                </div>
                <button
                  className="ml-2"
                  onClick={() => {
                    toast.loading("Đang cập nhật", { duration: 3000 });
                    me.reload();
                  }}
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>
          </div>
          {isEditing ? (
            <input
              className=" font-bold    text-gray-700 focus:outline-none focus:ring focus:border-blue-300 border border-gray-300 rounded py-1 my-1 px-4  block w-full appearance-none"
              placeholder="Nhập giới thiệu bản thân"
              name="bio"
              value={formik.values.bio}
              onChange={formik.handleChange}
            />
          ) : (
            <div
              style={{
                paddingHorizontal: 22,
                paddingVertical: 10,
                fontSize: 15,
              }}
            >
              "{initValues[0].bio}"
            </div>
          )}

          <div className="flex flex-row  py-3 items-center">
            <IoEarth className="mr-3" size={24} />
            {/* <Icon
            name="link-variant"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          /> */}
            {isEditing ? (
              <input
                className=" font-bold   text-gray-700 focus:outline-none focus:ring focus:border-blue-300 border border-gray-300 rounded py-1 my-1 px-4 block w-full appearance-none"
                placeholder="Nhập website giới thiệu"
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
              />
            ) : (
              <div>{initValues[0].website}</div>
            )}
          </div>
          <div className="flex flex-row">
            {isEditing ? (
              <>
                <button
                  className="border rounded-md border-red-500 p-2  mb-2.5 mr-2 shadow focus:outline-none hover:bg-[#d4fffa]"
                  onClick={() => setIsEditing(false)}
                >
                  <div style={{ color: "#1B9284", fontSize: 18 }}>Hủy</div>
                </button>
                <button
                  className="border rounded-md border-blue-500 p-2  mb-2.5 mr-2 shadow focus:outline-none hover:bg-[#d4fffa]"
                  type="submit"
                  onClick={() => {
                    formik.handleSubmit();
                    setIsEditing(false);
                  }}
                >
                  <div style={{ color: "#1B9284", fontSize: 18 }}>Xác nhận</div>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="border rounded-md border-[#1B9284] p-2  mb-2.5 mr-2 shadow focus:outline-none hover:bg-[#d4fffa]"
              >
                <div className="" style={{ color: "#1B9284", fontSize: 18 }}>
                  Chỉnh sửa
                </div>
              </button>
            )}
            {!isEditing && (
              <>
                {" "}
                <button
                  onClick={() => setDepositInfoModal(true)}
                  className="border rounded-md border-[#1B9284] p-2  mb-2.5 mr-2 shadow focus:outline-none hover:bg-[#d4fffa]"
                >
                  <div
                    /* className="py-2 mb-2.5 ml-3" */
                    style={{ color: "#1B9284", fontSize: 18 }}
                  >
                    Nạp tiền
                  </div>
                </button>
                <button
                  className="border rounded-md border-[#1B9284] p-2  mb-2.5 mr-2 shadow focus:outline-none hover:bg-[#d4fffa]"
                  onClick={() => {
                    if (initValues[0].userPaymentMethod.length > 0) {
                      setPaymentWithdrawModal(true);
                    } else {
                      toast.error(
                        "Vui lòng thêm phương thức thanh toán để rút tiền"
                      );
                    }
                  }}
                >
                  <div style={{ color: "#1B9284", fontSize: 18 }}>Rút tiền</div>
                </button>
                <button
                  className="border rounded-md border-[#1B9284] p-2  mb-2.5 mr-2 shadow focus:outline-none hover:bg-[#d4fffa]"
                  onClick={() => {
                    setPaymentHistoryModal(true);
                    getPaymentHistory();
                  }}
                >
                  <div style={{ color: "#1B9284", fontSize: 18 }}>
                    Lịch sử nạp/rút
                  </div>
                </button>{" "}
              </>
            )}
          </div>
        </div>
        <div className=" py-3 px-[22px]">Project Activites</div>
        <div className="flex flex-row bg-white px-[22px] py-3 justify-between border-b border-[#EEEEEE]">
          <div className="flex justify-center items-center flex-col">
            <div style={{ paddingVertical: 4 }}>
              {initValues[0]._count.media}
            </div>
            <div style={{ paddingVertical: 4 }}>Ảnh đã gởi</div>
          </div>
          <div className="flex justify-center items-center flex-col">
            <div style={{ paddingVertical: 4 }}>{initValues[1]}</div>
            <div style={{ paddingVertical: 4 }}>Ảnh được chấp nhận</div>
          </div>
          <div className="flex justify-center items-center flex-col">
            <div style={{ paddingVertical: 4 }}>
              {initValues[0]._count.project}
            </div>
            <div style={{ paddingVertical: 4 }}>Dự án đã tạo</div>
          </div>
        </div>

        {/* <Link href="/my-projects/all">
          <a className="flex flex-row px-[22px] py-3 justify-between items-center bg-white">
            <div style={{}}>
              <div>All activity</div>
            </div>
            
          </a>
        </Link> */}
        <div className=" py-3 px-[22px]">Phương thức thanh toán</div>
        <div className="h-4 bg-white " />
        {initValues[0].userPaymentMethod.map((item, index) => (
          <div
            key={index}
            className="flex flex-row p-4 pl-9 border border-[#006A73] max-w-[500px] min-w-[350px] mx-auto rounded-md bg-white m-2"
          >
            <div className="flex flex-col w-11/12">
              <div className="text-gray-600 mb-2">
                Nhà cung cấp: {item.userPaymentMethodId.toUpperCase()}
              </div>
              <div className="text-gray-600 my-1">Họ tên: {item.name}</div>
              {item.phone !== "" && item.phone !== null && (
                <div className="text-gray-600 my-1">
                  Số điện thoại: {item.phone}
                </div>
              )}
              {item.stk !== "" && item.stk !== null && (
                <div className="text-gray-600 my-1">
                  Số tài khoản: {item.stk}
                </div>
              )}
            </div>
            {isEditingPayment[index].isEdit ? (
              <div className="= w-1/12 justify-center items-center flex flex-col">
                <button
                  onClick={() => {
                    var temp = [...isEditingPayment];
                    temp[index] = { isEdit: false, id: temp[index].id };
                    console.log(temp);
                    setIsEditingPayment(temp);
                  }}
                  className="mb-2"
                >
                  <XCircle />
                </button>
                <button
                  onClick={() => handleDelPayment(isEditingPayment[index].id)}
                  className="mt-2"
                >
                  <Trash />
                </button>
              </div>
            ) : (
              <div className="= w-1/12 justify-center items-center flex">
                <button
                  onClick={() => {
                    var temp = [...isEditingPayment];
                    temp[index] = { isEdit: true, id: temp[index].id };
                    setIsEditingPayment(temp);
                  }}
                >
                  <Edit />
                </button>
              </div>
            )}
          </div>
        ))}

        {formikPayment.errors.provider && formikPayment.touched.provider && (
          <p style={{ color: "red" }}>{formikPayment.errors.provider}</p>
        )}
        {formikPayment.errors.name && formikPayment.touched.name && (
          <p style={{ color: "red" }}>{formikPayment.errors.name}</p>
        )}
        {formikPayment.errors.phone && formikPayment.touched.phone && (
          <p style={{ color: "red" }}>{formikPayment.errors.phone}</p>
        )}
        {formikPayment.errors.stk && formikPayment.touched.stk && (
          <p style={{ color: "red" }}>{formikPayment.errors.stk}</p>
        )}
        {formikPayment.errors.ewalletProvider &&
          formikPayment.touched.ewalletProvider && (
            <p style={{ color: "red" }}>
              {formikPayment.errors.ewalletProvider}
            </p>
          )}
        {formikPayment.errors.bankProvider &&
          formikPayment.touched.bankProvider && (
            <p style={{ color: "red" }}>{formikPayment.errors.bankProvider}</p>
          )}
        {isAddingPaymentMethod && (
          <div className=" flex items-center flex-col m-2 border-[#006A73] bg-white border rounded-md duration-300 transition ease-in-out">
            <div
              onChange={(event) => {
                setProvider(event.target.value);
                formikPayment.setFieldValue("provider", event.target.value);
              }}
              className="flex justify-center items-center border border-gray-400 rounded-md p-2 mt-3 my-1"
            >
              {!me.isLoading &&
                me.items.length > 0 &&
                me.items[1]?.map((item, index) => {
                  if (item.provider === "EWALLET") {
                    return (
                      <div key={index}>
                        <input
                          type="radio"
                          value="EWALLET"
                          name="payment"
                          className="mx-2"
                        />
                        Ví điện tử
                      </div>
                    );
                  }
                  if (item.provider === "BANK") {
                    return (
                      <div key={index}>
                        <input
                          type="radio"
                          value="BANK"
                          name="payment"
                          className="mx-2"
                        />
                        Tài khoản ngân hàng
                      </div>
                    );
                  }
                })}
            </div>
            {!me.isLoading && me.items.length > 0 && (
              <div>
                <ArrowDown />
              </div>
            )}
            <div
              className={`flex justify-center items-center border border-gray-400 rounded-md my-1 ${
                provider !== null && "p-2"
              }`}
              onChange={(event) => {
                if (provider === "EWALLET") {
                  setEwallet(event.target.value);
                  formikPayment.setFieldValue(
                    "ewalletProvider",
                    event.target.value
                  );
                  formikPayment.setFieldValue(
                    "id",
                    event.target.value.toLowerCase()
                  );
                }
                if (provider === "BANK") {
                  formikPayment.setFieldValue(
                    "bankProvider",
                    event.target.value
                  );
                  formikPayment.setFieldValue(
                    "id",
                    event.target.value.toLowerCase()
                  );
                  setBank(event.target.value);
                }
              }}
            >
              {provider === "EWALLET" &&
                !me.isLoading &&
                me.items.length > 0 &&
                me.items[0]?.map((item, index) => {
                  if (item.provider === "EWALLET") {
                    return (
                      <div key={index}>
                        <input
                          type="radio"
                          value={item.ewalletProvider}
                          name="ewallet"
                          className="mx-2"
                        />
                        {item.ewalletProvider}
                      </div>
                    );
                  }
                })}
              {provider === "BANK" &&
                !me.isLoading &&
                me.items.length > 0 &&
                me.items[0]?.map((item, index) => {
                  if (item.provider === "BANK") {
                    return (
                      <div key={index}>
                        <input
                          type="radio"
                          value={item.bankProvider}
                          name="bank"
                          className="mx-2"
                        />
                        {item.bankProvider}
                      </div>
                    );
                  }
                })}
            </div>
            {provider === "EWALLET" && ewallet !== null && (
              <div className="flex justify-center items-center my-3">
                <label>Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  className="border border-gray-500 ml-2 p-1 rounded-md"
                  value={formikPayment.values.name}
                  onChange={formikPayment.handleChange}
                />
                <label className="mx-5">|</label>
                <label>Số điện thoại ví</label>

                <input
                  type="text"
                  id="phone"
                  className="border border-gray-500 ml-2 p-1 rounded-md"
                  value={formikPayment.values.phone}
                  onChange={formikPayment.handleChange}
                />
              </div>
            )}
            {provider === "BANK" && bank !== null && (
              <div className="flex justify-center items-center my-3">
                <label>Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  className="border border-gray-500 ml-2 p-1 rounded-md"
                  value={formikPayment.values.name}
                  onChange={formikPayment.handleChange}
                />
                <label className="mx-5">|</label>
                <label>Nhập số tài khoản</label>
                <input
                  value={formikPayment.values.stk}
                  onChange={formikPayment.handleChange}
                  type="text"
                  id="stk"
                  className="border border-gray-500 ml-2 p-1 rounded-md"
                />
              </div>
            )}
          </div>
        )}
        {isAddingPaymentMethod ? (
          <div className="bg-white justify-center items-center flex py-2">
            <button
              onClick={() => setIsAddingPaymentMethod(false)}
              className="text-center  bg-white  border-[#006A73] py-1.5 mx-4 px-1.5 border rounded-md text-[#006A73] font-semibold"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                formikPayment.handleSubmit();
                console.log(formikPayment.values);
              }}
              className="text-center  bg-white  border-[#006A73] py-1.5 mx-4 px-1.5 border rounded-md text-[#006A73] font-semibold"
            >
              Xác nhận
            </button>
          </div>
        ) : (
          <div className="bg-white justify-center items-center flex py-2">
            <button
              onClick={() => setIsAddingPaymentMethod(true)}
              className="text-center  bg-white  border-[#006A73] py-1.5 mx-4 px-1.5 border rounded-md text-[#006A73] font-semibold"
            >
              Thêm phương thức thanh toán
            </button>
          </div>
        )}
        <div className="pb-20 bg-white" />
        {/*    <button onClick={signout} className="mb-20">
          Đăng xuất
        </button> */}
      </div>
    </>
  );
}
/* 
<Text style={{backgroundColor: 'white'}}>sad</Text>
*/
