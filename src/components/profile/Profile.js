import React, { useState, useEffect, useLayoutEffect } from "react";
import { IoEarth, IoPencil } from "react-icons/io5";
import { useAuth } from "../../fb/auth";
import { firebaseClient } from "../../fb/firebaseClient";
import { useAsyncList } from "@react-stately/data";
import { ArrowDown, Edit, CheckCircle, XCircle, Trash } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { Uploader } from "../common/Upload";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
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
      router.reload();
    } else {
      toast.error("Có lỗi xảy ra");
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
      const getTokenResult = await firebaseClient
        .auth()
        .currentUser.getIdTokenResult(true);
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
                <button onClick={() => setIsEditing(false)}>
                  <div
                    className="py-2 mb-2.5"
                    style={{ color: "#1B9284", fontSize: 18 }}
                  >
                    Hủy
                  </div>
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    formik.handleSubmit();
                    setIsEditing(false);
                  }}
                >
                  <div
                    className="py-2 mb-2.5 ml-3"
                    style={{ color: "#1B9284", fontSize: 18 }}
                  >
                    Xác nhận
                  </div>
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                <div
                  className="py-2 mb-2.5"
                  style={{ color: "#1B9284", fontSize: 18 }}
                >
                  Chỉnh sửa
                </div>
              </button>
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
                      <>
                        <input
                          type="radio"
                          value="EWALLET"
                          name="payment"
                          className="mx-2"
                          key={index}
                        />
                        Ví điện tử
                      </>
                    );
                  }
                  if (item.provider === "BANK") {
                    return (
                      <>
                        <input
                          type="radio"
                          value="BANK"
                          name="payment"
                          className="mx-2"
                          key={index}
                        />
                        Tài khoản ngân hàng
                      </>
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
                      <>
                        <input
                          type="radio"
                          value={item.ewalletProvider}
                          name="ewallet"
                          className="mx-2"
                          key={index}
                        />
                        {item.ewalletProvider}
                      </>
                    );
                  }
                })}
              {provider === "BANK" &&
                !me.isLoading &&
                me.items.length > 0 &&
                me.items[0]?.map((item, index) => {
                  if (item.provider === "BANK") {
                    return (
                      <>
                        <input
                          type="radio"
                          value={item.bankProvider}
                          name="bank"
                          className="mx-2"
                          key={index}
                        />
                        {item.bankProvider}
                      </>
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

        <button onClick={signout}>Đăng xuất</button>
      </div>
    </>
  );
}
/* 
<Text style={{backgroundColor: 'white'}}>sad</Text>
*/
