import React, { useState, useEffect, useLayoutEffect } from "react";
import { IoEarth, IoPencil } from "react-icons/io5";
import { useAuth } from "../../fb/auth";
import { firebaseClient } from "../../fb/firebaseClient";
import { useAsyncList } from "@react-stately/data";
import Link from "next/link";
import { useFormik } from "formik";
import { Uploader } from "../common/Upload";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { list } from "postcss";
export default function ProfileUserEditByAdmin() {
  const router = useRouter();
  const { user } = useAuth();
  const [initValues, setInitValues] = useState([
    {
      id: "",
      email: "",
      role: "USER",
      name: "",
      providers: "",
      username: "",
      photoURL: "/avatar.png",
      website: "",
      bio: "",
      _count: { media: 0, project: 0 },
    },
    0,
  ]);
  const [coverImage, setCoverImage] = useState(null);
  const [isShowUploader, setIsShowUploader] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const slug = router.query.slug;
  const formik = useFormik({
    initialValues: {
      bio: initValues[0].bio,
      website: initValues[0].website,
      avatarURL: initValues[0].photoURL,
      displayName: initValues[0].name,
    },
    onSubmit: (values) => handleChangeProfile(values),
  });
  useEffect(() => {
    if (coverImage) {
      formik.setFieldValue(
        "avatarURL",
        coverImage[0].response.body.data[0].linkUrl
      );
    }
  }, [coverImage]);

  async function setAdmin() {
    toast.loading("Đang set quyền Admin", { duration: 2000 });
    const token = await user.getIdToken();
    const response = await fetch(`/api/onboarding/set-admin?slug=${slug}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      toast.success("Set quyền thành công");
    } else {
      toast.error("Có lỗi xảy ra");
    }
  }
  async function handleChangeProfile(values) {
    toast.loading("Đang cập nhật", { duration: 4000 });
    const token = await user.getIdToken();
    const response = await fetch(
      `/api/profile/update-profile-by-admin?slug=${slug}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { values } }),
      }
    );
    if (response.ok) {
      toast.success("Thay đổi thành công");
    } else {
      toast.error("Có lỗi xảy ra");
    }
  }
  let me = useAsyncList({
    async load() {
      const getTokenResult = await firebaseClient
        .auth()
        .currentUser.getIdTokenResult(true);
      console.log(getTokenResult);
      let res = await fetch(`/api/profile/get-profile-by-admin?slug=${slug}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      formik.setFieldValue("bio", json[0].bio);
      formik.setFieldValue("website", json[0].website);
      formik.setFieldValue("avatarURL", json[0].photoURL);
      formik.setFieldValue("displayName", json[0].name);
      formik.setFieldValue("email", json[0].email);
      setInitValues(json);
      return { items: json };
    },
  });
  useEffect(() => {
    me.reload();
  }, [slug]);
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
                  coverImage ? formik.values.avatarURL : initValues[0].photoURL
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
                  {initValues[0].name}
                </div>
              )}

              <div style={{ fontSize: 18, color: "#868483" }}>
                {initValues[0].email}
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
        <Link href="/my-projects/all">
          <a className="flex flex-row px-[22px] py-3 justify-between items-center bg-white">
            <div style={{}}>
              <div>All activity</div>
            </div>
            {/* <Icon name="chevron-right" size={24} color="#969696" /> */}
          </a>
        </Link>
        <button onClick={setAdmin}>Đặt người dùng này làm Admin</button>
      </div>
    </>
  );
}
/* 
<Text style={{backgroundColor: 'white'}}>sad</Text>
*/
