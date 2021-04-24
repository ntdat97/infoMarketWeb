import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../common/Header";
import Sidebar from "../common/SideBar";
import { useFormik } from "formik";
import { Uploader } from "../common/Upload";
import { ModalSubmit } from "../modal/ModalSubmit";
import { LoadingModal } from "../modal/LoadingModal";
import { useAuth } from "../../fb/auth";
import {
  MdAccessTime,
  MdImage,
  MdAdd,
  MdClear,
  MdArrowUpward,
  MdSyncDisabled,
  MdSync,
} from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import CarouselComponent from "../common/CaroselComponent";
import DatePicker, { registerLocale } from "react-datepicker";
import { ErrorModal } from "../modal/ErrorModal";
import vi from "date-fns/locale/vi";
import * as yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("vi", vi);
const pics = [
  {
    url: "/slider.jpg",
  },
];
const rightOptions = [
  {
    id: 1,
    name: "Người nhận không được bán lại ảnh",
    iconName: "MdSyncDisabled",
    value: "nonrecyclable",
  },
  {
    id: 2,
    name: "Người nhận được bán lại ảnh",
    iconName: "MdSync",
    value: "recyclable",
  },
  {
    id: 3,
    name: "Người bán được upload cùng bức ảnh cho dự án khác",
    iconName: "MdArrowUpward",
    value: "reUpload",
  },
  {
    id: 4,
    name: "Người mua có thể sử dụng ảnh vô thời hạn",
    iconName: "MdAccessTime",
    value: "indefinitely",
  },
];

const CreateProject = () => {
  const [caroselImage, setCaroselImage] = useState([]);
  const [isShowUploader, setIsShowUploader] = useState(false);
  const [modalSubmitVisible, setModalSubmitVisible] = useState(false);
  const [modalLoadingVisible, setModalLoadingVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    if (caroselImage.length > 0) {
      formik.setFieldValue("caroselImage", caroselImage);
    }
  }, [caroselImage]);

  const addImage = (e) => {
    let imageTemp = Object.assign([], caroselImage);
    e.map((item, index) => {
      imageTemp.push({ url: item.response.body.data[0].linkUrl });
    });
    setCaroselImage(imageTemp);
  };
  const formik = useFormik({
    initialValues: {
      caroselImage: [],
      projectName: "",
      price: "",
      maxUnit: "",
      openDay: "",
      closeDay: "",
      description: "",
      usedFor: "",
      requirements: "",
      contact: "",
    },
    validationSchema: yup.object().shape({
      projectName: yup
        .string()
        .required("Vui lòng nhập tên")
        .max(50, "Tên tối đa 50 chữ cái"),
      price: yup
        .number()
        .required("Vui lòng nhập giá")
        .typeError("Vui lòng nhập đúng định dạng (số)"),
      maxUnit: yup
        .number()
        .required("Vui lòng nhập số lượng tối đa")
        .typeError("Vui lòng nhập đúng định dạng (số)"),
      openDay: yup
        .string()
        .required("Vui lòng nhập ngày bắt đầu")
        .typeError("Vui lòng nhập đúng định dạng"),
      closeDay: yup
        .string()
        .required("Vui lòng nhập ngày kết thúc")
        .typeError("Vui lòng nhập đúng định dạng"),
      description: yup.string().required("Vui lòng nhập mô tả"),
      usedFor: yup.string().required("Vui lòng nhập mục đích"),
      requirements: yup.string().required("Vui lòng nhập yêu cầu"),
      contact: yup
        .string()
        .email("Vui lòng nhập đúng định dạng")
        .required("Vui lòng nhập email"),
    }),
    onSubmit: (values) => handleCreate(values),
  });
  async function handleCreate(values) {
    setModalLoadingVisible(true);
    console.log(formik.values);
    const token = await user.getIdToken();
    const response = await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { values } }),
    });
    if (response.ok) {
      setModalLoadingVisible(false);
      setModalSubmitVisible(true);
    } else {
      setModalLoadingVisible(false);
      setErrorModalVisible(true);
    }
  }
  return (
    <>
      {isShowUploader ? (
        <Uploader
          isOpen={isShowUploader}
          setIsOpen={setIsShowUploader}
          outFiles={caroselImage}
          setOutFile={(e) => addImage(e)}
        />
      ) : null}
      <Header />
      <ModalSubmit
        modalVisible={modalSubmitVisible}
        setModalVisible={setModalSubmitVisible}
      />
      <ErrorModal
        modalVisible={errorModalVisible}
        setModalVisible={setErrorModalVisible}
      />
      <LoadingModal
        modalVisible={modalLoadingVisible}
        setModalVisible={setModalLoadingVisible}
      />
      <div className="flex flex-row ">
        <div className="w-1/6 sticky border-r border-[#e6e6e6] top-16 self-start h-auto ">
          <Sidebar />
        </div>
        <div className="flex w-11/12 ">
          <div className=" max-w-[1108px] mx-auto mt-4">
            <div style={{ backgroundColor: "white" }}>
              <div className="text-center items-center text-4xl text-[#2b2d38] font-semibold py-5 mb-4">
                Tạo dự án thu thập ảnh
              </div>
              <div className="flex flex-row justify-center">
                <div className="w-10/12">
                  <CarouselComponent
                    data={caroselImage.length > 0 ? caroselImage : pics}
                  />
                </div>
                <button
                  onClick={() => setIsShowUploader(true)}
                  className="ml-4  active:outline-none focus:outline-none active:opacity-25"
                >
                  <div className=" w-auto active:outline-none border-dashed border-green-500 border-2 h-full items-center justify-center flex-col flex">
                    <MdAdd size={50} />
                    <div className="text-center">Thêm hình ảnh minh họa</div>
                  </div>
                </button>
              </div>
              <div className="flex flex-row pb-2.5 border-b border-[#f0f0f0]">
                <div className="w-9/12 px-2">
                  <input
                    style={{
                      borderColor:
                        formik.errors.projectName && formik.touched.projectName
                          ? "red"
                          : "#e5e7eb",
                    }}
                    className="text-3xl m font-bold  my-2   text-gray-700 focus:outline-none focus:ring focus:border-blue-300 border border-gray-300 rounded py-2 h-14 px-4 block w-full appearance-none"
                    placeholder="Project's Name"
                    name="projectName"
                    value={formik.values.projectName}
                    onChange={formik.handleChange}
                  />
                  <div style={{ paddingVertical: 1.5 }} className="text-xl ">
                    {user.displayName}
                  </div>
                  {formik.errors.price && formik.touched.price && (
                    <p style={{ color: "red" }}>{formik.errors.price}</p>
                  )}
                  <div className="flex flex-row my-2">
                    <input
                      style={{
                        borderColor:
                          formik.errors.price && formik.touched.price
                            ? "red"
                            : "#e5e7eb",
                      }}
                      className="text-lg  border text-[#454545] items-center py-1 focus:outline-none focus:ring forcus:border-[0.5px] p-1 focus:border-blue-300  rounded-md"
                      placeholder="Price"
                      name="price"
                      type="number"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                    />
                    <div className="text-xl p-1 justify-center items-center mx-2">
                      {" "}
                      /{" "}
                    </div>
                    <div className="p-1 pt-2">Ảnh</div>
                  </div>
                  {formik.errors.maxUnit && formik.touched.maxUnit && (
                    <p style={{ color: "red" }}>{formik.errors.maxUnit}</p>
                  )}
                  <div className="flex flex-row items-center py-2">
                    <MdImage color="#8f8f8f" className="mr-3" size={30} />
                    <input
                      style={{
                        borderColor:
                          formik.errors.maxUnit && formik.touched.maxUnit
                            ? "red"
                            : "#e5e7eb",
                      }}
                      className="text-lg  border text-[#454545] items-center py-1 focus:outline-none focus:ring forcus:border-[0.5px] p-1 focus:border-blue-300  rounded-md"
                      placeholder="Maximun unit"
                      name="maxUnit"
                      type="number"
                      value={formik.values.maxUnit}
                      onChange={formik.handleChange}
                    />
                  </div>
                  {formik.errors.openDay && formik.touched.openDay && (
                    <>
                      <p style={{ color: "red" }}>{formik.errors.openDay}</p>
                    </>
                  )}
                  {formik.errors.closeDay && formik.touched.closeDay && (
                    <>
                      <p style={{ color: "red" }}>{formik.errors.closeDay}</p>
                    </>
                  )}
                  <div className="flex flex-row items-center py-2">
                    <MdAccessTime color="#8f8f8f" className="mr-3" size={30} />

                    <DatePicker
                      style={{
                        borderColor:
                          formik.errors.openDay && formik.touched.openDay
                            ? "red"
                            : "#e5e7eb",
                      }}
                      locale="vi"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Start date"
                      name="openDay"
                      selectsStart
                      startDate={formik.values.openDay}
                      endDate={formik.values.closeDay}
                      selected={formik.values.openDay}
                      onChange={(date) => formik.setFieldValue("openDay", date)}
                      className="text-lg  border text-[#454545] items-center py-1 focus:outline-none focus:ring forcus:border-[0.5px] p-1 focus:border-blue-300  rounded-md"
                    />
                    <div className="text-xl p-1 justify-center items-center mx-2">
                      {" "}
                      -{" "}
                    </div>
                    <DatePicker
                      style={{
                        borderColor:
                          formik.errors.closeDay && formik.touched.closeDay
                            ? "red"
                            : "#e5e7eb",
                      }}
                      locale="vi"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Close date"
                      name="closeDay"
                      selectsEnd
                      startDate={formik.values.openDay}
                      minDate={formik.values.openDay}
                      endDate={formik.values.closeDay}
                      selected={formik.values.closeDay}
                      onChange={(date) =>
                        formik.setFieldValue("closeDay", date)
                      }
                      className="text-lg  border text-[#454545] items-center py-1 focus:outline-none focus:ring forcus:border-[0.5px] p-1 focus:border-blue-300  rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center w-3/12">
                  <Link href="/profile/user">
                    <a /* onPress={() => navigation.navigate('Profilediver')} */
                    >
                      <img
                        src={user.photoURL}
                        style={{ height: 70, width: 70 }}
                      />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  Description
                </div>

                <textarea
                  style={{
                    borderColor:
                      formik.errors.description && formik.touched.description
                        ? "red"
                        : "#e5e7eb",
                  }}
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  className="text-lg w-full  border text-[#454545] items-center py-1 focus:outline-none focus:ring forcus:border-[0.5px] p-1 focus:border-blue-300  rounded-md resize-y "
                ></textarea>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  How photos will be used
                </div>
                <textarea
                  style={{
                    borderColor:
                      formik.errors.usedFor && formik.touched.usedFor
                        ? "red"
                        : "#e5e7eb",
                  }}
                  name="usedFor"
                  value={formik.values.usedFor}
                  onChange={formik.handleChange}
                  className="text-lg w-full  border text-[#454545] items-center py-1 focus:outline-none focus:ring forcus:border-[0.5px] p-1 focus:border-blue-300  rounded-md resize-y "
                ></textarea>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  Requirements
                </div>
                <textarea
                  style={{
                    borderColor:
                      formik.errors.requirements && formik.touched.requirements
                        ? "red"
                        : "#e5e7eb",
                  }}
                  name="requirements"
                  value={formik.values.requirements}
                  onChange={formik.handleChange}
                  className="text-lg w-full  border text-[#454545] items-center py-1 focus:outline-none focus:ring forcus:border-[0.5px] p-1 focus:border-blue-300  rounded-md resize-y "
                ></textarea>
              </div>
              {formik.errors.contact && formik.touched.contact && (
                <>
                  <p style={{ color: "red" }}>{formik.errors.contact}</p>
                </>
              )}
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 10,
                    marginBottom: 5,
                  }}
                >
                  Contact requester
                </div>
                <input
                  style={{
                    borderColor:
                      formik.errors.contact && formik.touched.contact
                        ? "red"
                        : "#e5e7eb",
                  }}
                  className="w-11/12 text-center border-[#006A73] py-1.5 mx-4 border rounded-md mb-4 text-[#006A73] font-semibold text-lg   text-[#454545] focus:outline-none focus:ring forcus:border-[0.5px] p-1 focus:border-blue-300 "
                  placeholder="Địa chỉ email liên lạc"
                  name="contact"
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                />

                <div
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "#f0f0f0",
                    borderRadius: 5,
                  }}
                >
                  <div>Photo right and responsibilities</div>
                  <div className="flex flex-row items-center py-[10px]">
                    <MdAccessTime
                      size={24}
                      color="#8f8f8f"
                      style={{ marginRight: 10 }}
                    />
                    <div>Photo can be use indefinitely</div>
                    <button className="ml-4 active:outline-red focus:outline-red focus:shadow rounded">
                      <MdClear color="red" size={20} />
                    </button>
                  </div>
                  <select>
                    {rightOptions.map((item, index) => (
                      <option key={index} value={item.value}>
                        <div className="flex flex-row items-center py-[10px]">
                          {`<${item.iconName} color="#8f8f8f" size={24} style={{ marginRight: 10 }}/>`}

                          <div>{item.name}</div>
                          <button className="ml-4 active:outline-red focus:outline-red focus:shadow rounded">
                            <MdClear color="red" size={20} />
                          </button>
                        </div>
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-2 border-t-[0.5px] border-[#f0f0f0]  mt-0.5  bg-white sticky bottom-0 ">
              <button
                type="button"
                onClick={formik.handleSubmit}
                className="py-1  rounded-md bg-[#006A73] flex w-full items-center justify-center"
              >
                <div className="text-white font-semibold">Send photos</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateProject;
